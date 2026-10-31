// Publica no Instagram o próximo post vencido da agenda.json (no máximo 1 por execução).
// Roda todo dia pelo GitHub Actions; o que já foi publicado fica registrado em publicados.json.
//
// Variáveis de ambiente:
//   IG_USER_ID       id da conta profissional do Instagram (instagram_business_account)
//   IG_ACCESS_TOKEN  token com instagram_basic e instagram_content_publish
//   MEDIA_BASE_URL   (opcional) URL pública onde estão as imagens; padrão: raw do GitHub da branch main
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

const isDryRun = process.argv.includes("--dry-run");

const agenda = JSON.parse(readFileSync(AGENDA_PATH, "utf8"));
const published = existsSync(PUBLISHED_PATH) ? JSON.parse(readFileSync(PUBLISHED_PATH, "utf8")) : {};

const now = new Date();
const due = agenda
  .filter((post) => !published[post.slug] && new Date(post.publishAt) <= now)
  .sort((a, b) => new Date(a.publishAt) - new Date(b.publishAt));

if (due.length === 0) {
  const next = agenda.find((post) => !published[post.slug]);
  console.log(next ? `Nada vencido. Próximo: ${next.slug} em ${next.publishAt}.` : "Agenda concluída.");
  process.exit(0);
}

const post = due[0];
const mediaBase =
  process.env.MEDIA_BASE_URL ??
  (process.env.GITHUB_REPOSITORY ? `https://raw.githubusercontent.com/${process.env.GITHUB_REPOSITORY}/main/` : undefined);

if (isDryRun) {
  console.log(`[dry-run] Publicaria ${post.slug} (${post.images.length} imagem/ns):`);
  for (const image of post.images) console.log(`  ${mediaBase ?? "<MEDIA_BASE_URL>"}${image}`);
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
const waitUntilReady = async (containerId) => {
  for (let poll = 0; poll < CONTAINER_MAX_POLLS; poll++) {
    const { status_code: status } = await graph("GET", containerId, { fields: "status_code" });
    if (status === "FINISHED") return;
    if (status === "ERROR" || status === "EXPIRED") throw new Error(`Container ${containerId} com status ${status}.`);
    await sleep(CONTAINER_POLL_MS);
  }
  throw new Error(`Container ${containerId} não ficou pronto a tempo.`);
};

const imageUrls = post.images.map((image) => `${mediaBase}${image}`);
let creationId;

if (imageUrls.length === 1) {
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
