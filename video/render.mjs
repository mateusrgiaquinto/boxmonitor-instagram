// Gera o vídeo de um Reel de conteudo.mjs com HyperFrames: voz da ElevenLabs por beat, card com o texto
// grande, legenda da fala e, quando o beat tem `tela`, a tela do BoxMonitor recriada (video/telas.mjs).
//
// Uso:
//   node video/render.mjs <slug>              grava videos/<slug>.mp4 (é esse arquivo que o publicar.mjs posta)
//   node video/render.mjs --todos             todos os Reels de conteudo.mjs
//   node video/render.mjs <slug> --previa     só monta o projeto em video/build/<slug>/ (abra com `npx hyperframes preview`)
//   node video/render.mjs <slug> --sem-voz    teste sem áudio, com tempo estimado
//
// Precisa de FFmpeg no PATH e de ELEVENLABS_API_KEY (menos com --sem-voz).
// Trilha: video/musica/<slug>.mp3 se existir, senão video/musica/trilha.mp3; sem nenhuma, o Reel sai só com voz.
import { execSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { posts } from "../gerador/conteudo.mjs";
import { renderTela, TELA_CSS, temToque } from "./telas.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const HYPERFRAMES = "npx --yes hyperframes@0.9.8";
const TTS_MODEL = "eleven_multilingual_v2";
const VOICE_ID = "YU8EsJtXFMyKMxYtheDk"; // voz do BoxMonitor na ElevenLabs (plano Starter, uso comercial)
const WORDS_PER_SECOND = 150 / 60; // ritmo usado no roteiro
const PAUSE_SECONDS = 0.3; // respiro entre um beat e o próximo
const END_HOLD_SECONDS = 0.8; // o último card fica um pouco na tela antes do loop
const VOICE_VOLUME = 1.25; // +1,9 dB: o mix fica perto de −16 LUFS (faixa de redes sociais) com pico abaixo de −1 dBTP
const MUSIC_VOLUME = 0.14; // trilha por baixo da voz
// Onde está o pico de cada efeito (medido com `hyperframes audio`): o som entra para o pico cair 1 quadro depois da imagem.
const SFX = {
  whoosh: { file: "whoosh.mp3", peak: 0.162, seconds: 0.575, volume: 0.5 },
  pop: { file: "pop.mp3", peak: 0.12, seconds: 0.72, volume: 0.45 },
  click: { file: "click-soft.mp3", peak: 0.073, seconds: 0.366, volume: 0.6 },
  notificacao: { file: "notification.mp3", peak: 0.229, seconds: 2.456, volume: 0.35 },
};
const SFX_DIR = join(HERE, "sfx");
const FRAME = 1 / 30;

const args = process.argv.slice(2);
const isSilent = args.includes("--sem-voz");
const isPreview = args.includes("--previa");
const reels = posts.filter((post) => post.kind === "reel");
const [slug] = args.filter((arg) => !arg.startsWith("--"));
const selected = args.includes("--todos") ? reels : reels.filter((post) => post.slug === slug);
if (selected.length === 0) {
  console.error(`Reel não encontrado: ${slug ?? "(sem slug)"}. Reels em conteudo.mjs:\n${reels.map((post) => `  ${post.slug}`).join("\n")}`);
  process.exit(1);
}

const { ELEVENLABS_API_KEY } = process.env;
if (!isSilent && !ELEVENLABS_API_KEY) {
  console.error("Falta ELEVENLABS_API_KEY (ou rode com --sem-voz para testar).");
  process.exit(1);
}

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
// *texto* sai em amarelo, igual às artes do feed.
const rich = (text) => escapeHtml(text).replace(/\*(.+?)\*/g, "<mark>$1</mark>");
const pad = (n) => String(n).padStart(2, "0");
const sec = (n) => Number(n.toFixed(3));

// Gera (ou reaproveita, se a fala não mudou) o áudio de um beat. Devolve a duração e o início de cada caractere.
const speak = async (post, beat, index, voiceDir) => {
  const name = pad(index + 1);
  const metaPath = join(voiceDir, `${name}.json`);
  const cached = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : undefined;
  if (cached?.say === beat.say && cached.voice === VOICE_ID) return cached;

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({
      text: beat.say,
      model_id: TTS_MODEL,
      previous_text: post.beats[index - 1]?.say,
      next_text: post.beats[index + 1]?.say,
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status} no beat ${index + 1}: ${await res.text()}`);
  const json = await res.json();

  writeFileSync(join(voiceDir, `${name}.mp3`), Buffer.from(json.audio_base64, "base64"));
  const meta = {
    say: beat.say,
    voice: VOICE_ID,
    seconds: json.alignment.character_end_times_seconds.at(-1),
    charStarts: json.alignment.character_start_times_seconds,
  };
  writeFileSync(metaPath, `${JSON.stringify(meta)}\n`);
  return meta;
};

// Quando a tela muda durante a fala, cada estado entra no começo da frase correspondente
// ("Veículo recebido. Em diagnóstico." → 2 estados); sem frases que batam, divide o tempo por igual.
const stateStarts = (say, count, voice) => {
  if (count === 1) return [0];
  const chunks = say.split(/(?<=[.!?])\s+/);
  if (chunks.length === count && voice.charStarts) {
    let offset = 0;
    return chunks.map((chunk) => {
      const start = voice.charStarts[offset] ?? 0;
      offset += chunk.length + 1;
      return sec(start);
    });
  }
  return Array.from({ length: count }, (_, k) => sec((voice.seconds * k) / count));
};

const fontFaces = [
  ["Barlow", 500], ["Barlow", 600], ["Barlow", 700], ["Barlow Condensed", 700], ["Barlow Condensed", 800],
].map(([family, weight]) => `@font-face { font-family:"${family}"; font-weight:${weight}; font-display:block;
  src:url("assets/fonts/${family.replace(" ", "")}-${weight}.woff2") format("woff2"); }`).join("\n");

const BEAT_CSS = `
${fontFaces}
#root { position:absolute; inset:0; font-family:"Barlow"; color:#fff; }
.card { position:absolute; left:88px; right:160px; font-family:"Barlow Condensed"; font-weight:800; text-transform:uppercase;
  line-height:.95; letter-spacing:-1px; }
.card.sozinho { top:560px; font-size:132px; }
.card.com-tela { top:236px; font-size:92px; }
.card mark { background:none; color:#ffc72c; }
.legenda { position:absolute; left:88px; right:230px; top:1180px; font-size:40px; font-weight:600; line-height:1.2;
  background:rgba(0,15,51,.62); border-radius:16px; padding:16px 24px; }
${TELA_CSS}`;

const FUNDO_CSS = `
${fontFaces}
#root { position:absolute; inset:0; overflow:hidden; background:radial-gradient(circle at 85% 10%, #0a47c2 0%, #003399 45%, #001f66 100%); }
.brilho { position:absolute; width:900px; height:900px; left:420px; top:-260px; border-radius:50%;
  background:radial-gradient(circle, rgba(255,255,255,.12), rgba(255,255,255,0) 70%); }
.marca { position:absolute; top:176px; left:88px; display:flex; align-items:center; gap:16px; font-family:"Barlow Condensed";
  font-weight:700; font-size:30px; letter-spacing:4px; color:#fff; }
.marca img { width:52px; height:52px; border-radius:10px; background:#fff; }
.faixa { position:absolute; left:0; right:0; bottom:0; height:28px;
  background:repeating-linear-gradient(-45deg, #ffc72c 0 28px, #1a1d21 28px 56px); }`;

const sceneFile = (id, css, body, script) => `<template>
  <style>${css}</style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
${body}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
    // Realce em quem mudou de estado; nem toda tela tem esses elementos.
    const pop = (selector, at) => {
      const targets = document.querySelectorAll(selector);
      if (targets.length) tl.fromTo(targets, { scale: 0.92 }, { scale: 1, duration: 0.3, ease: "back.out(2)", stagger: 0.08 }, at);
    };
${script}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;

// Um beat = uma cena: card, legenda e (opcional) o painel com a tela, que pode mudar de estado durante a fala.
// O primeiro beat já abre com o gancho na tela (o quadro 0 é o que aparece antes do play); os outros entram animados.
const beatScene = (id, beat, timing, isPanelEntering, isFirst) => {
  const states = beat.tela ? [beat.tela].flat() : [];
  const body = [`    <h1 id="${id}-card" class="card ${states.length ? "com-tela" : "sozinho"}">${rich(beat.card)}</h1>`];
  const script = isFirst
    ? [`    tl.fromTo("#${id}-card", { scale: 1.04 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);`]
    : [
        `    tl.fromTo("#${id}-card", { y: 50, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, ease: "power3.out" }, 0);`,
        `    tl.fromTo("#${id}-legenda", { opacity: 0 }, { opacity: 1, duration: 0.2, ease: "none" }, 0.05);`,
      ];
  if (states.length) {
    const layers = states.map((tela, k) => {
      const { html, escura } = renderTela(tela);
      return `      <div id="${id}-e${k}" class="estado${escura ? " escura" : ""}">${html}</div>`;
    });
    // A tela é ilustração do app: o recado está no card e na legenda, então o painel fica fora da auditoria de layout.
    body.push(`    <div id="${id}-painel" class="painel" data-layout-ignore>\n${layers.join("\n")}\n      <span class="selo">Demonstração</span>\n    </div>`);
    if (isPanelEntering) {
      script.push(`    tl.fromTo("#${id}-painel", { y: 90, opacity: 0, scale: 0.94 }, { y: 0, opacity: 1, scale: 1, duration: 0.4, ease: "power3.out" }, 0.05);`);
    }
    states.forEach((tela, k) => {
      const at = timing.states[k];
      const layer = `#${id}-e${k}`;
      if (k > 0) script.push(`    tl.fromTo("${layer}", { opacity: 0 }, { opacity: 1, duration: 0.18, ease: "none" }, ${at});`);
      const accentAt = sec(at + (k === 0 && isPanelEntering ? 0.3 : 0.05));
      script.push(`    pop("${layer} :is(.atual, .t-chip, .t-aprovado, .baixo, .marcado, .destaque, .aberto, .t-anexo, .t-lista li, .t-itens li:not(.total), .t-registro)", ${accentAt});`);
      if (temToque(tela)) {
        script.push(`    tl.fromTo("${layer} .t-toque", { scale: 0, opacity: 0.9 }, { scale: 2.4, opacity: 0, duration: 0.5, ease: "power2.out" }, ${sec(at + 0.25)});`);
      }
      if (tela.tipo === "notificacao") {
        script.push(`    tl.fromTo("${layer} .t-notificacao", { y: -60, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "back.out(1.6)" }, ${sec(at + 0.15)});`);
      }
    });
  }
  body.push(`    <p id="${id}-legenda" class="legenda">${escapeHtml(beat.say)}</p>`);
  return sceneFile(id, BEAT_CSS, body.join("\n"), script.join("\n"));
};

const fundoScene = (duration) => sceneFile(
  "fundo",
  FUNDO_CSS,
  `    <div id="fundo-brilho" class="brilho"></div>
    <div class="marca"><img src="assets/logo.png" alt="" />BOXMONITOR</div>
    <div class="faixa"></div>`,
  `    tl.fromTo("#fundo-brilho", { x: 0, y: 0 }, { x: -260, y: 180, duration: ${duration}, ease: "none" }, 0);`,
);

const hostTag = (id, start, duration, track, zIndex) =>
  `    <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="${start}" data-duration="${duration}" data-track-index="${track}" data-track-kind="graphics" data-width="1080" data-height="1920" style="z-index:${zIndex}"></div>`;

const audioTag = (id, src, start, duration, track, volume, extra = "") =>
  `    <audio id="${id}" class="clip" src="${src}" data-start="${start}" data-duration="${duration}" data-track-index="${track}" data-volume="${volume}"${extra}></audio>`;

const buildReel = async (post) => {
  const project = join(HERE, "build", post.slug);
  const voiceDir = join(HERE, "voz", post.slug);
  mkdirSync(voiceDir, { recursive: true });

  // Tempo de cada beat (fala + respiro) e de cada estado da tela dentro dele.
  const timings = [];
  let clock = 0;
  for (const [index, beat] of post.beats.entries()) {
    const voice = isSilent
      ? { seconds: beat.say.split(/\s+/).length / WORDS_PER_SECOND }
      : await speak(post, beat, index, voiceDir);
    const isLast = index === post.beats.length - 1;
    const duration = sec(voice.seconds + PAUSE_SECONDS + (isLast ? END_HOLD_SECONDS : 0));
    const states = stateStarts(beat.say, beat.tela ? [beat.tela].flat().length : 1, voice);
    timings.push({ start: sec(clock), duration, voiceSeconds: sec(voice.seconds), states });
    console.log(`  beat ${pad(index + 1)}: ${voice.seconds.toFixed(1)}s  ${beat.say}`);
    clock += duration;
  }
  const total = sec(clock);

  // Recria só o que o script gera; a pasta fica (o Windows não a apaga enquanto um preview a usa, e .hyperframes guarda o histórico).
  for (const dir of ["compositions", "assets"]) rmSync(join(project, dir), { recursive: true, force: true });
  mkdirSync(join(project, "compositions"), { recursive: true });
  mkdirSync(join(project, "assets", "sfx"), { recursive: true });
  cpSync(join(HERE, "fonts"), join(project, "assets", "fonts"), { recursive: true });
  copyFileSync(join(ROOT, "gerador", "logo.png"), join(project, "assets", "logo.png"));
  if (!isSilent) cpSync(voiceDir, join(project, "assets", "voz"), { recursive: true, filter: (src) => !src.endsWith(".json") });
  for (const { file } of Object.values(SFX)) copyFileSync(join(SFX_DIR, file), join(project, "assets", "sfx", file));

  const hosts = [hostTag("fundo", 0, total, 0, 0)];
  const audio = [];
  const effects = [];
  const addEffect = (kind, at) => effects.push({ kind, start: sec(Math.max(0, at - SFX[kind].peak + FRAME)) });

  post.beats.forEach((beat, index) => {
    const id = `b${pad(index + 1)}`;
    const timing = timings[index];
    const isPanelEntering = Boolean(beat.tela) && !post.beats[index - 1]?.tela;
    writeFileSync(join(project, "compositions", `${id}.html`), beatScene(id, beat, timing, isPanelEntering, index === 0));
    hosts.push(hostTag(id, timing.start, timing.duration, 1, 1));
    if (!isSilent) audio.push(audioTag(`voz${pad(index + 1)}`, `assets/voz/${pad(index + 1)}.mp3`, timing.start, timing.voiceSeconds, 2, VOICE_VOLUME));

    // Efeitos só onde algo acontece na tela: painel entrando, tela mudando, toque, notificação chegando.
    if (isPanelEntering) addEffect("whoosh", timing.start + 0.15);
    [beat.tela ?? []].flat().forEach((tela, k) => {
      const at = timing.start + timing.states[k];
      if (k > 0) addEffect("pop", at + 0.05);
      if (temToque(tela)) addEffect("click", at + 0.25);
      if (tela.tipo === "notificacao") addEffect("notificacao", at + 0.15);
    });
  });
  // Cada efeito vai para a primeira faixa livre, para um não cortar o outro quando caem perto.
  const trackEnds = new Map([[3, 0], [5, 0], [6, 0]]);
  effects.sort((a, b) => a.start - b.start).forEach(({ kind, start }, index) => {
    const { file, seconds, volume } = SFX[kind];
    const duration = Math.min(seconds, sec(total - start));
    const track = [...trackEnds].find(([, end]) => end <= start)?.[0] ?? 6;
    trackEnds.set(track, start + duration);
    audio.push(audioTag(`sfx${pad(index + 1)}`, `assets/sfx/${file}`, start, duration, track, volume));
  });

  const music = [join(HERE, "musica", `${post.slug}.mp3`), join(HERE, "musica", "trilha.mp3")].find(existsSync);
  if (music && !isSilent) {
    copyFileSync(music, join(project, "assets", "trilha.mp3"));
    audio.push(audioTag("trilha", "assets/trilha.mp3", 0, total, 4, MUSIC_VOLUME, ` data-fade-in="0.4" data-fade-out="1.2"`));
  } else if (!isSilent) {
    console.log("  (sem trilha: coloque video/musica/trilha.mp3 ou video/musica/<slug>.mp3)");
  }

  writeFileSync(join(project, "compositions", "fundo.html"), fundoScene(total));
  writeFileSync(join(project, "hyperframes.json"), `${JSON.stringify({ paths: { blocks: "compositions", assets: "assets" }, media: { autoProxy: true } }, null, 2)}\n`);
  writeFileSync(join(project, "meta.json"), `${JSON.stringify({ id: post.slug, name: post.slug }, null, 2)}\n`);
  writeFileSync(join(project, "index.html"), `<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=1080, height=1920" />
    <script src="https://cdn.jsdelivr.net/npm/gsap@3.15.0/dist/gsap.min.js"></script>
    <style>
      * { margin: 0; padding: 0; box-sizing: border-box; }
      html, body { width: 1080px; height: 1920px; overflow: hidden; background: #001f66; }
      #root { position: relative; width: 100%; height: 100%; }
    </style>
  </head>
  <body>
    <div id="root" data-composition-id="main" data-start="0" data-duration="${total}" data-width="1080" data-height="1920">
${hosts.join("\n")}
${audio.join("\n")}
    </div>
    <script>
      window.__timelines["main"] = gsap.timeline({ paused: true });
    </script>
  </body>
</html>
`);
  return { project, total };
};

for (const post of selected) {
  console.log(`${post.slug}`);
  const { project, total } = await buildReel(post);
  if (isPreview) {
    console.log(`  Projeto pronto: ${project} (${total.toFixed(1)}s)`);
    continue;
  }
  execSync(`${HYPERFRAMES} render --quality delivery -o out.mp4`, { cwd: project, stdio: "inherit" });
  const output = isSilent ? join(HERE, "out", `${post.slug}-sem-voz.mp4`) : join(ROOT, "videos", `${post.slug}.mp4`);
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(join(project, "out.mp4"), output);
  console.log(`  Vídeo pronto: ${output} (${total.toFixed(1)}s)`);
}
