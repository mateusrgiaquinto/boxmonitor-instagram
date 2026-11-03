// Gera as artes (PNG) e as legendas dos posts definidos em conteudo.mjs.
// Uso: node gerador/gerar.mjs   (a partir da pasta "BoxMonitor Instagram")
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import sharp from "sharp";

import { posts } from "./conteudo.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const BUILD = join(HERE, ".build");
const OUT = join(ROOT, "posts");
const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";
const FEED = { width: 1080, height: 1350 };
const REEL = { width: 1080, height: 1920 };

const logo = `data:image/png;base64,${readFileSync(join(HERE, "logo.png")).toString("base64")}`;

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// *texto* vira destaque.
const rich = (text = "") => escapeHtml(text).replace(/\*(.+?)\*/g, "<mark>$1</mark>");

const styles = ({ width, height }) => `
:root { --blue:#003399; --blue-dark:#001f66; --yellow:#ffc72c; --ink:#1a1d21; --paper:#eceff1; --muted:#4a5568; }
* { box-sizing:border-box; margin:0; padding:0; }
html, body { width:${width}px; height:${height}px; overflow:hidden; }
body { font-family:"Barlow", sans-serif; -webkit-font-smoothing:antialiased; }
.slide { position:relative; width:100%; height:100%; padding:88px 88px 120px; display:flex; flex-direction:column; }
.dark { background:radial-gradient(circle at 85% 10%, #0a47c2 0%, var(--blue) 45%, var(--blue-dark) 100%); color:#fff; }
.light { background:var(--paper); color:var(--ink); }
.stripe { position:absolute; left:0; right:0; bottom:0; height:28px;
  background:repeating-linear-gradient(-45deg, var(--yellow) 0 28px, var(--ink) 28px 56px); }
.light .stripe { background:repeating-linear-gradient(-45deg, var(--blue) 0 28px, var(--paper) 28px 56px); height:20px; }
header { display:flex; align-items:center; justify-content:space-between; }
.brand { display:flex; align-items:center; gap:18px; font-family:"Barlow Condensed"; font-weight:700; font-size:34px; letter-spacing:4px; }
.brand img { width:64px; height:64px; background:#fff; border-radius:12px; padding:6px; }
.light .brand img { box-shadow:0 0 0 2px #cfd6dd; }
.counter { font-family:"Barlow Condensed"; font-weight:600; font-size:32px; opacity:.7; letter-spacing:2px; }
main { flex:1; display:flex; flex-direction:column; justify-content:center; gap:40px; }
.kicker { align-self:flex-start; font-family:"Barlow Condensed"; font-weight:700; font-size:34px; letter-spacing:3px; text-transform:uppercase;
  background:var(--yellow); color:var(--blue-dark); padding:8px 22px; border-radius:8px; }
.light .kicker { background:var(--blue); color:#fff; }
h1 { font-family:"Barlow Condensed"; font-weight:800; text-transform:uppercase; line-height:.95; letter-spacing:-1px; }
.dark h1 { font-size:124px; }
.light h1 { font-size:92px; }
.dark mark { background:none; color:var(--yellow); }
.light mark { background:none; color:var(--blue); }
.body { font-size:46px; line-height:1.3; font-weight:500; }
.dark .body { color:rgba(255,255,255,.85); }
.light .body { color:var(--muted); }
.number { width:180px; height:180px; border-radius:24px; background:var(--yellow); color:var(--blue-dark);
  display:flex; align-items:center; justify-content:center; font-family:"Barlow Condensed"; font-weight:800; font-size:120px; line-height:1; }
.note { background:#fff; border-left:12px solid var(--blue); border-radius:12px; padding:28px 34px; font-size:44px; font-weight:700; color:var(--ink); }
.items { list-style:none; display:flex; flex-direction:column; gap:22px; }
.items li { background:#fff; border-radius:16px; padding:30px 36px; font-size:50px; font-weight:600; box-shadow:0 2px 0 #cfd6dd; }
.checks { list-style:none; display:flex; flex-direction:column; gap:26px; }
.checks li { display:flex; align-items:center; gap:26px; font-size:46px; font-weight:600; }
.checks li::before { content:"✓"; flex:none; width:64px; height:64px; border-radius:50%; background:var(--yellow); color:var(--blue-dark);
  display:flex; align-items:center; justify-content:center; font-size:40px; font-weight:800; }
.quote { font-family:"Barlow Condensed"; font-weight:800; font-size:104px; line-height:1; text-transform:uppercase; }
.verdict { align-self:flex-start; font-family:"Barlow Condensed"; font-weight:800; font-size:64px; letter-spacing:4px; text-transform:uppercase;
  padding:10px 34px; border:6px solid var(--blue); color:var(--blue); border-radius:12px; transform:rotate(-4deg); }
.verdict.depende { border-color:#b8860b; color:#8a6400; }
.button { align-self:flex-start; background:var(--yellow); color:var(--blue-dark); font-family:"Barlow Condensed"; font-weight:800;
  font-size:56px; text-transform:uppercase; letter-spacing:1px; padding:24px 44px; border-radius:16px; }
.url { font-size:40px; font-weight:600; opacity:.8; letter-spacing:1px; }
footer { font-family:"Barlow Condensed"; font-weight:700; font-size:36px; letter-spacing:3px; text-transform:uppercase; color:var(--yellow); }
.reel main { justify-content:center; gap:56px; }
.reel h1 { font-size:150px; }
.play { align-self:flex-start; display:flex; align-items:center; gap:18px; font-family:"Barlow Condensed"; font-weight:700; font-size:40px;
  letter-spacing:4px; text-transform:uppercase; color:var(--yellow); }
.play::before { content:""; border-left:34px solid var(--yellow); border-top:20px solid transparent; border-bottom:20px solid transparent; }
`;

const header = (counter) => `
<header>
  <div class="brand"><img src="${logo}" alt="" />BOXMONITOR</div>
  ${counter ? `<div class="counter">${counter}</div>` : ""}
</header>`;

const page = (size, theme, inner) => `<!doctype html>
<html lang="pt-BR"><head><meta charset="utf-8" />
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800&display=block" rel="stylesheet" />
<style>${styles(size)}</style></head>
<body><div class="slide ${theme}">${inner}<div class="stripe"></div></div></body></html>`;

const renderSlide = (slide, counter, isLast) => {
  switch (slide.type) {
    case "cover":
      return page(FEED, "dark", `${header(counter)}
<main>
  <div class="kicker">${rich(slide.kicker)}</div>
  <h1>${rich(slide.title)}</h1>
  ${slide.body ? `<p class="body">${rich(slide.body)}</p>` : ""}
</main>
${isLast ? "" : "<footer>Arraste →</footer>"}`);
    case "item":
      return page(FEED, "light", `${header(counter)}
<main>
  <div class="number">${rich(slide.number)}</div>
  <h1>${rich(slide.title)}</h1>
  <p class="body">${rich(slide.body)}</p>
  ${slide.note ? `<div class="note">${rich(slide.note)}</div>` : ""}
</main>`);
    case "list":
      return page(FEED, "light", `${header(counter)}
<main>
  <h1>${rich(slide.title)}</h1>
  <ul class="items">${slide.list.map((item) => `<li>${rich(item)}</li>`).join("")}</ul>
  ${slide.note ? `<div class="note">${rich(slide.note)}</div>` : ""}
</main>`);
    case "myth":
      return page(FEED, "light", `${header(counter)}
<main>
  <p class="quote">${rich(slide.quote)}</p>
  <div class="verdict ${slide.verdict === "Depende" ? "depende" : ""}">${rich(slide.verdict)}</div>
  <p class="body">${rich(slide.body)}</p>
</main>`);
    case "features":
      return page(FEED, "dark", `${header(counter)}
<main>
  <div class="kicker">${rich(slide.kicker)}</div>
  <h1>${rich(slide.title)}</h1>
  <p class="body">${rich(slide.body)}</p>
  <ul class="checks">${slide.list.map((item) => `<li><span>${rich(item)}</span></li>`).join("")}</ul>
</main>
<p class="url">boxmonitor.com.br</p>`);
    case "cta":
      return page(FEED, "dark", `${header(counter)}
<main>
  <h1>${rich(slide.title)}</h1>
  <p class="body">${rich(slide.body)}</p>
  <div class="button">${rich(slide.button ?? "Link na bio")}</div>
  <p class="url">boxmonitor.com.br</p>
</main>`);
    default:
      throw new Error(`Tipo de slide desconhecido: ${slide.type}`);
  }
};

const renderReelCover = (cover) =>
  page(REEL, "dark reel", `${header("")}
<main>
  <div class="play">${rich(cover.kicker)}</div>
  <h1>${rich(cover.title)}</h1>
</main>
<p class="url">boxmonitor.com.br</p>`);

const profileDir = join(tmpdir(), "boxmonitor-instagram-chrome");

const screenshot = (html, name, size, target) => {
  const htmlPath = join(BUILD, `${name}.html`);
  writeFileSync(htmlPath, html);
  execFileSync(CHROME, [
    "--headless=new",
    "--disable-gpu",
    "--hide-scrollbars",
    "--force-device-scale-factor=1",
    `--user-data-dir=${profileDir}`,
    `--window-size=${size.width},${size.height}`,
    "--virtual-time-budget=10000",
    `--screenshot=${target}`,
    pathToFileURL(htmlPath).href,
  ], { stdio: "ignore" });
};

const pad = (n) => String(n).padStart(2, "0");

// A API do Instagram só aceita JPEG.
const toJpeg = (pngPath) =>
  sharp(pngPath).jpeg({ quality: 92, chromaSubsampling: "4:4:4" }).toFile(pngPath.replace(/\.png$/, ".jpg"));

// Horário de publicação dos posts de feed (Brasília, sem horário de verão).
const PUBLISH_TIME = "12:00:00-03:00";

rmSync(BUILD, { recursive: true, force: true });
mkdirSync(BUILD, { recursive: true });

const schedule = [];
const agenda = [];

for (const post of posts) {
  const dir = join(OUT, post.slug);
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });

  writeFileSync(join(dir, "legenda.txt"), `${post.caption}\n`);

  const [, year, month, day] = post.slug.match(/^\d+-(\d{4})-(\d{2})-(\d{2})/);
  const publishTime = post.publishTime ?? PUBLISH_TIME;
  const publishAt = `${year}-${month}-${day}T${publishTime}`;

  if (post.kind === "reel") {
    const cover = join(dir, "capa.png");
    screenshot(renderReelCover(post.cover), `${post.slug}-capa`, REEL, cover);
    await toJpeg(cover);
    writeFileSync(join(dir, "roteiro.txt"), `ROTEIRO DO REEL\n\n${post.beats.map((beat) => `${beat.say.replace(/\[[^\]]*\]\s*/g, "")}  | Tela: ${beat.card.replace(/\*/g, "")}`).join("\n")}\n`);
    // O vídeo fica fora de posts/ porque esta pasta é apagada a cada geração.
    agenda.push({
      slug: post.slug,
      publishAt,
      video: `videos/${post.slug}.mp4`,
      cover: `posts/${post.slug}/capa.jpg`,
      caption: post.caption,
    });
  } else {
    const images = [];
    for (const [index, slide] of post.slides.entries()) {
      const counter = post.slides.length > 1 ? `${pad(index + 1)}/${pad(post.slides.length)}` : "";
      const isLast = index === post.slides.length - 1;
      const png = join(dir, `${pad(index + 1)}.png`);
      screenshot(renderSlide(slide, counter, isLast), `${post.slug}-${pad(index + 1)}`, FEED, png);
      await toJpeg(png);
      images.push(`posts/${post.slug}/${pad(index + 1)}.jpg`);
    }
    agenda.push({ slug: post.slug, publishAt, images, caption: post.caption });
  }

  const format = { reel: "Reel (vídeo em videos/)", carousel: "Carrossel", single: "Post único" }[post.kind];
  schedule.push(
    `${day}/${month}/${year} ${publishTime.slice(0, 5)}  ${format.padEnd(34)} posts/${post.slug}${post.pin ? "  ← fixar no perfil" : ""}`,
  );
  console.log(`ok  ${post.slug}`);
}

writeFileSync(join(ROOT, "CRONOGRAMA.txt"), `CRONOGRAMA INSTAGRAM BOXMONITOR (novembro e dezembro/2026)\n\n${schedule.join("\n")}\n`);
// Lida pelo publicar.mjs (GitHub Actions).
writeFileSync(join(ROOT, "agenda.json"), `${JSON.stringify(agenda, null, 2)}\n`);
