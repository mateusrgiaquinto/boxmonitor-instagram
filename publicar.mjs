// Publica no Instagram o próximo post vencido da agenda.json (no máximo 1 por execução).
// Roda todo dia pelo GitHub Actions; o que já foi publicado fica registrado em publicados.json.
//
// Variáveis de ambiente:
//   IG_USER_ID       id da conta profissional do Instagram (instagram_business_account)
//   IG_ACCESS_TOKEN  token com instagram_basic e instagram_content_publish
//   MEDIA_BASE_URL   (opcional) URL pública onde estão as imagens; padrão: raw do GitHub da branch main
//
// Reels (posts com `video` na agenda) só saem quando o arquivo existe em videos/; o vídeo é enviado
// direto para a Meta e a capa vai por URL.
//
// Uso: node publicar.mjs [--dry-run]
import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = dirname(fileURLToPath(import.meta.url));
const AGENDA_PATH = join(ROOT, "agenda.json");
const PUBLISHED_PATH = join(ROOT, "publicados.json");
const GRAPH = "https://graph.facebook.com/v25.0";
const CONTAINER_POLL_MS = 5_000;
const CONTAINER_MAX_POLLS = 36; // 3 minutos
const REEL_MAX_POLLS = 120; // 10 minutos: vídeo demora mais para processar
const RUPLOAD = "https://rupload.facebook.com/ig-api-upload/v25.0";

const isDryRun = process.argv.includes("--dry-run");

const agenda = JSON.parse(readFileSync(AGENDA_PATH, "utf8"));
const published = existsSync(PUBLISHED_PATH) ? JSON.parse(readFileSync(PUBLISHED_PATH, "utf8")) : {};

const now = new Date();
const overdue = agenda
  .filter((post) => !published[post.slug] && new Date(post.publishAt) <= now)
  .sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt));

// Reel só sai quando o vídeo já está no repositório; enquanto isso, os outros posts seguem.
const hasMedia = (post) => !post.video || existsSync(join(ROOT, post.video));
for (const post of overdue.filter((post) => !hasMedia(post))) {
  console.log(`Aguardando ${post.video}: ${post.slug} fica para quando o vídeo for enviado.`);
}
const due = overdue.filter(hasMedia);

if (due.length === 0) {
  const next = agenda.find((post) => !published[post.slug] && hasMedia(post));
  console.log(next ? `Nada vencido. Próximo: ${next.slug} em ${next.publishAt}.` : "Agenda concluída.");
  process.exit(0);
}

const post = due[0];
const mediaBase =
  process.env.MEDIA_BASE_URL ??
  (process.env.GITHUB_REPOSITORY ? `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/main/` : undefined);

if (isDryRun) {
  if (post.video) {
    console.log(`[dry-run] Publicaria o Reel ${post.slug}: ${post.video} (upload direto), capa ${mediaBase ?? "<MEDIA_BASE_URL>"}${post.cover}`);
  } else {
    console.log(`[dry-run] Publicaria ${post.slug} (${post.images.length} imagem/ns):`);
    for (const image of post.images) console.log(`  ${mediaBase ?? "<MEDIA_BASE_URL>"}${image}`);
  }
  if (due.length > 1) console.log(`[dry-run] Outros ${due.length - 1} vencidos ficam para as próximas execuções.`);
  process.exit(0);
}

const { IG_USER_ID, IG_ACCESS_TOKEN } = process.env;
if (!IG_USER_ID || !IG_ACCESS_TOKEN || !mediaBase) {
  console.error("Faltam IG_USER_ID, IG_ACCESS_TOKEN ou MEDIA_BASE_URL/GITHUB_REPOSITORY.");
  process.exit(1);
}

const graph = async (method, path, params = {}) => {
  const body = new URLSearchParams({ ...params, access_token: IG_ACCESS_TOKEN });
  const url = method === "GET" ? `${GRAPH}/${path}?${body}` : `${GRAPH}/${path}`;
  const res = await fetch(url, method === "GET" ? undefined : { method, body });
  const json = await res.json();
  if (!res.ok || json.error) {
    throw new Error(`Graph API ${method} ${path}: ${json.error?.message ?? res.statusText}`);
  }
  return json;
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// A Meta baixa e processa a mídia de forma assíncrona; só dá para publicar com status FINISHED.
const waitUntilReady = async (containerId, maxPolls = CONTAINER_MAX_POLLS) => {
  for (let poll = 0; poll < maxPolls; poll++) {
    const { status_code: status } = await graph("GET", containerId, { fields: "status_code" });
    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") throw new Error(`Container ${containerId} com status ${status}.`);
    await sleep(CONTAINER_POLL_MS);
  }
  throw new Error(`Container ${containerId} não ficou pronto a tempo.`);
};

// O raw do GitHub serve MP4 como application/octet-stream; por isso o vídeo vai por upload direto (resumable).
const uploadReel = async () => {
  const { id } = await graph("POST", `${IG_USER_ID}/media`, {
    media_type: "REELS",
    upload_type: "resumable",
    caption: post.caption,
    cover_url: `${mediaBase}${post.cover}`,
    share_to_feed: "true",
  });
  const video = readFileSync(join(ROOT, post.video));
  const res = await fetch(`${RUPLOAD}/${id}`, {
    method: "POST",
    headers: { Authorization: `OAuth ${IG_ACCESS_TOKEN}`, offset: "0", file_size: String(video.length) },
    body: video,
  });
  const json = await res.json();
  if (!res.ok || !json.success) {
    throw new Error(`Upload do vídeo ${post.video}: ${json.debug_info?.message ?? res.statusText}`);
  }
  await waitUntilReady(id, REEL_MAX_POLLS);
  return id;
};

const imageUrls = (post.images ?? []).map((image) => `${mediaBase}${image}`);
let creationId;

if (post.video) {
  creationId = await uploadReel();
} else if (imageUrls.length === 1) {
  ({ id: creationId } = await graph("POST", `${IG_USER_ID}/media`, { image_url: imageUrls[0], caption: post.caption }));
} else {
  const children = [];
  for (const imageUrl of imageUrls) {
    const { id } = await graph("POST", `${IG_USER_ID}/media`, { image_url: imageUrl, is_carousel_item: "true" });
    children.push(id);
  }
  for (const child of children) await waitUntilReady(child);
  ({ id: creationId } = await graph("POST", `${IG_USER_ID}/media`, {
    media_type: "CAROUSEL",
    children: children.join(","),
    caption: post.caption,
  }));
}

await waitUntilReady(creationId);
const { id: mediaId } = await graph("POST", `${IG_USER_ID}/media_publish`, { creation_id: creationId });

published[post.slug] = { mediaId, publishedAt: new Date().toISOString() };
writeFileSync(PUBLISHED_PATH, `${JSON.stringify(published, null, 2)}\n`);
console.log(`Publicado ${post.slug} (media ${mediaId}).`);
if (due.length > 1) console.log(`Ainda há ${due.length - 1} post(s) vencido(s); sai 1 por execução.`);
