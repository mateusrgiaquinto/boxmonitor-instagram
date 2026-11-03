// Gera o vídeo de um Reel de conteudo.mjs com HyperFrames.
//
// A fala do Reel inteiro sai numa narração só da ElevenLabs (com o tempo de cada caractere), então não há cortes entre
// as frases. Os beats viram camadas contínuas por cima dela:
//   fundo    gradiente da marca com brilho e faixa em movimento
//   painel   a tela do BoxMonitor recriada (video/telas.mjs): entra, muda de estado, o dedo toca, números contam
//   cards    o texto grande de cada beat, palavra por palavra
//   legendas a fala, com a palavra dita em destaque
// e uma trilha da Eleven Music por baixo.
//
// Uso:
//   node video/render.mjs <slug>              grava videos/<slug>.mp4 (é esse arquivo que o publicar.mjs posta)
//   node video/render.mjs --todos             todos os Reels de conteudo.mjs
//   node video/render.mjs <slug> --previa     só monta o projeto em video/build/<slug>/ (abra com `npx hyperframes preview`)
//
// Precisa de FFmpeg no PATH e de ELEVENLABS_API_KEY. Narração e trilha ficam em video/voz/ e video/musica/ e só são
// geradas de novo quando o texto (ou o pedido da trilha) muda.
import { execSync } from "node:child_process";
import { copyFileSync, cpSync, existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { posts } from "../gerador/conteudo.mjs";
import { renderTela, TELA_CSS } from "./telas.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const HYPERFRAMES = "npx --yes hyperframes@0.9.8";
const ELEVENLABS = "https://api.elevenlabs.io/v1";
// Eleven v4 lê as marcações de atuação da fala ([sighs], [frustrated], [playfully]…); estabilidade baixa = mais emoção.
const TTS_MODEL = "eleven_v4";
const VOICE_ID = "YU8EsJtXFMyKMxYtheDk"; // voz do BoxMonitor na ElevenLabs (plano Starter, uso comercial)
const VOICE_SETTINGS = { stability: 0.3, similarity_boost: 0.8 };
// Marcação de atuação dentro da fala: vai para a voz, nunca para a legenda.
const ACTING_TAG = /\[[^\]]*\]/;
const END_HOLD_SECONDS = 1.2; // o último card fica na tela antes do loop
const VOICE_VOLUME = 1.25;
const MUSIC_VOLUME = 0.28; // trilha uns 5 dB abaixo da voz: presente, sem cobrir a fala
// Uma trilha por Reel, alternando estes três climas (Eleven Music, instrumental, liberada para uso comercial).
const MUSIC_PROMPTS = [
  "Upbeat energetic Brazilian funk-pop instrumental for a fast social media ad, punchy drums, groovy bass, bright synth stabs, confident and fun, 120 bpm, no vocals, starts strong from the first second",
  "Driving modern indie-rock instrumental, tight drums, clean electric guitar riffs and claps, optimistic hands-on energy, 118 bpm, no vocals, starts strong from the first second",
  "Bouncy modern hip-hop beat instrumental, crisp claps, warm bass, playful plucks, upbeat and positive, 100 bpm, no vocals, starts strong from the first second",
];
// Onde está o pico de cada efeito (medido com `hyperframes audio`): o som entra para o pico cair 1 quadro depois da imagem.
const SFX = {
  whoosh: { file: "whoosh.mp3", peak: 0.162, seconds: 0.575, volume: 0.45 },
  pop: { file: "pop.mp3", peak: 0.12, seconds: 0.72, volume: 0.4 },
  click: { file: "click-soft.mp3", peak: 0.073, seconds: 0.366, volume: 0.7 },
  notificacao: { file: "notification.mp3", peak: 0.229, seconds: 2.456, volume: 0.35 },
};
const FRAME = 1 / 30;

const args = process.argv.slice(2);
const isPreview = args.includes("--previa");
const reels = posts.filter((post) => post.kind === "reel");
const [slug] = args.filter((arg) => !arg.startsWith("--"));
const selected = args.includes("--todos") ? reels : reels.filter((post) => post.slug === slug);
if (selected.length === 0) {
  console.error(`Reel não encontrado: ${slug ?? "(sem slug)"}. Reels em conteudo.mjs:\n${reels.map((post) => `  ${post.slug}`).join("\n")}`);
  process.exit(1);
}

const { ELEVENLABS_API_KEY } = process.env;
if (!ELEVENLABS_API_KEY) {
  console.error("Falta ELEVENLABS_API_KEY.");
  process.exit(1);
}

const escapeHtml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
const pad = (n) => String(n).padStart(2, "0");
const sec = (n) => Number(n.toFixed(3));
const readJson = (path) => (existsSync(path) ? JSON.parse(readFileSync(path, "utf8")) : undefined);

// ── Áudio ────────────────────────────────────────────────────────────────────────────────────────

// Narração do Reel inteiro numa chamada só: a voz flui de uma frase para a outra. Devolve o tempo de cada caractere.
const narrate = async (post, dir) => {
  const text = post.beats.map((beat) => beat.say).join(" ");
  const metaPath = join(dir, "narracao.json");
  const cached = readJson(metaPath);
  const settings = JSON.stringify({ model: TTS_MODEL, ...VOICE_SETTINGS });
  if (cached?.text === text && cached.voice === VOICE_ID && cached.settings === settings) return cached;

  const res = await fetch(`${ELEVENLABS}/text-to-speech/${VOICE_ID}/with-timestamps`, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ text, model_id: TTS_MODEL, language_code: "pt", voice_settings: VOICE_SETTINGS }),
  });
  if (!res.ok) throw new Error(`ElevenLabs (voz) ${res.status}: ${await res.text()}`);
  const json = await res.json();
  writeFileSync(join(dir, "narracao.mp3"), Buffer.from(json.audio_base64, "base64"));
  const meta = {
    text,
    voice: VOICE_ID,
    settings,
    seconds: json.alignment.character_end_times_seconds.at(-1),
    charStarts: json.alignment.character_start_times_seconds,
    charEnds: json.alignment.character_end_times_seconds,
  };
  writeFileSync(metaPath, `${JSON.stringify(meta)}\n`);
  return meta;
};

// Trilha do tamanho do Reel (Eleven Music). Reaproveita a que já existe se o pedido não mudou e ela ainda cobre o vídeo.
const compose = async (post, index, seconds) => {
  const dir = join(HERE, "musica");
  mkdirSync(dir, { recursive: true });
  const file = join(dir, `${post.slug}.mp3`);
  const metaPath = join(dir, `${post.slug}.json`);
  const prompt = MUSIC_PROMPTS[index % MUSIC_PROMPTS.length];
  const lengthMs = Math.ceil((seconds + 1.5) * 1000);
  const cached = readJson(metaPath);
  if (existsSync(file) && cached?.prompt === prompt && cached.lengthMs >= lengthMs - 1500) return file;

  const res = await fetch(`${ELEVENLABS}/music?output_format=mp3_44100_128`, {
    method: "POST",
    headers: { "xi-api-key": ELEVENLABS_API_KEY, "content-type": "application/json" },
    body: JSON.stringify({ prompt, music_length_ms: lengthMs, model_id: "music_v1", force_instrumental: true }),
  });
  if (!res.ok) {
    // Sem trilha o vídeo ainda sai (só voz e efeitos); o motivo aparece no terminal.
    console.warn(`  ⚠ Sem trilha: ElevenLabs (música) ${res.status}: ${await res.text()}`);
    return undefined;
  }
  writeFileSync(file, Buffer.from(await res.arrayBuffer()));
  writeFileSync(metaPath, `${JSON.stringify({ prompt, lengthMs }, null, 2)}\n`);
  return file;
};

// ── Tempos ───────────────────────────────────────────────────────────────────────────────────────

// Cada beat começa quando a voz chega na primeira letra dele; as palavras e os estados da tela seguem a mesma régua.
const timeline = (post, voice) => {
  const total = sec(voice.seconds + END_HOLD_SECONDS);
  let offset = 0;
  const beats = post.beats.map((beat) => {
    const start = offset;
    offset += beat.say.length + 1;
    return { beat, offset: start };
  });
  return {
    total,
    beats: beats.map(({ beat, offset: charOffset }, index) => {
      const wordsOf = (item) => [...item.beat.say.matchAll(/\[[^\]]*\]|\S+/g)]
        .filter((match) => !ACTING_TAG.test(match[0]))
        .map((match) => ({
          text: match[0],
          start: sec(voice.charStarts[item.offset + match.index]),
          end: sec(voice.charEnds[item.offset + match.index + match[0].length - 1]),
        }));
      // O beat começa na primeira palavra falada (as marcações de atuação não contam).
      const words = wordsOf({ beat, offset: charOffset });
      const start = index === 0 ? 0 : words[0].start;
      const end = index === beats.length - 1 ? total : wordsOf(beats[index + 1])[0].start;
      // Tela que muda durante a fala: cada estado entra no começo da frase correspondente; senão, tempo dividido por igual.
      const telas = beat.tela ? [beat.tela].flat() : [];
      const sentences = beat.say.split(/(?<=[.!?])\s+/);
      let states = telas.map((_, k) => sec(start + ((end - start) * k) / telas.length));
      if (telas.length > 1 && sentences.length === telas.length) {
        let local = 0;
        states = sentences.map((sentence, k) => {
          const at = k === 0 ? start : voice.charStarts[charOffset + local];
          local += sentence.length + 1;
          return sec(at);
        });
      }
      return { beat, start, end, words, telas, states };
    }),
  };
};

// ── Cenas ────────────────────────────────────────────────────────────────────────────────────────

const fontFaces = [
  ["Barlow", 500], ["Barlow", 600], ["Barlow", 700], ["Barlow Condensed", 700], ["Barlow Condensed", 800],
].map(([family, weight]) => `@font-face { font-family:"${family}"; font-weight:${weight}; font-display:block;
  src:url("assets/fonts/${family.replace(" ", "")}-${weight}.woff2") format("woff2"); }`).join("\n");

const sceneFile = (id, css, body, script) => `<template>
  <style>
${fontFaces}
#root { position:absolute; inset:0; font-family:"Barlow"; color:#fff; }
${css}
  </style>
  <div id="root" data-composition-id="${id}" data-width="1080" data-height="1920">
${body}
  </div>
  <script>
    const tl = gsap.timeline({ paused: true });
${script}
    window.__timelines["${id}"] = tl;
  </script>
</template>
`;

// Fundo: gradiente da marca, dois brilhos que andam devagar e a faixa zebrada correndo.
const fundoScene = (total) => sceneFile(
  "fundo",
  `#root { overflow:hidden; background:radial-gradient(circle at 85% 10%, #0a47c2 0%, #003399 45%, #001f66 100%); }
.brilho { position:absolute; border-radius:50%; background:radial-gradient(circle, rgba(255,255,255,.14), rgba(255,255,255,0) 70%); }
#fundo-b1 { width:900px; height:900px; left:420px; top:-260px; }
#fundo-b2 { width:700px; height:700px; left:-300px; top:1100px; background:radial-gradient(circle, rgba(255,199,44,.12), rgba(255,199,44,0) 70%); }
.marca { position:absolute; top:176px; left:88px; display:flex; align-items:center; gap:16px; font-family:"Barlow Condensed";
  font-weight:700; font-size:30px; letter-spacing:4px; }
.marca img { width:52px; height:52px; border-radius:10px; background:#fff; }
.faixa { position:absolute; left:0; bottom:0; width:1400px; height:28px;
  background:repeating-linear-gradient(-45deg, #ffc72c 0 28px, #1a1d21 28px 56px); }`,
  `    <div id="fundo-b1" class="brilho" data-layout-ignore></div>
    <div id="fundo-b2" class="brilho" data-layout-ignore></div>
    <div class="marca"><img src="assets/logo.png" alt="" />BOXMONITOR</div>
    <div id="fundo-faixa" class="faixa" data-layout-ignore></div>`,
  `    tl.fromTo("#fundo-b1", { x: 0, y: 0, scale: 1 }, { x: -320, y: 220, scale: 1.2, duration: ${total}, ease: "sine.inOut" }, 0);
    tl.fromTo("#fundo-b2", { x: 0, y: 0, scale: 1 }, { x: 380, y: -160, scale: 1.3, duration: ${total}, ease: "sine.inOut" }, 0);
    // A faixa anda um período do padrão (79,2 px na horizontal) por segundo e volta ao início sem emenda visível.
    tl.fromTo("#fundo-faixa", { x: 0 }, { x: -79.196, duration: 1, ease: "none", repeat: ${Math.ceil(total)} }, 0);`,
);

// Card: palavras soltas que entram uma a uma; o trecho *destacado* sai em amarelo e ganha um traço por baixo.
const cardWords = (card) =>
  card.split(/(\*[^*]+\*)/).filter(Boolean).flatMap((part) => {
    const isHighlight = part.startsWith("*");
    return part.replace(/\*/g, "").split(/\s+/).filter(Boolean).map((word) =>
      isHighlight ? `<span class="w hl">${escapeHtml(word)}<span class="risco"></span></span>` : `<span class="w">${escapeHtml(word)}</span>`);
  }).join(" ");

const cardsScene = (plan) => sceneFile(
  "cards",
  `.card { position:absolute; left:88px; right:160px; font-family:"Barlow Condensed"; font-weight:800; text-transform:uppercase;
  line-height:.98; letter-spacing:-1px; opacity:0; }
.card.sozinho { top:540px; font-size:136px; }
.card.com-tela { top:236px; font-size:92px; }
#c01 { opacity:1; }
.w { display:inline-block; position:relative; }
.hl { color:#ffc72c; }
.risco { position:absolute; left:0; right:0; bottom:-2px; height:10px; border-radius:5px; background:#ffc72c; transform-origin:left center; }`,
  plan.map((card) => `    <h1 id="${card.id}" class="card ${card.comTela ? "com-tela" : "sozinho"}">${cardWords(card.text)}</h1>`).join("\n"),
  `    const plan = ${JSON.stringify(plan)};
    plan.forEach((card, index) => {
      const el = document.getElementById(card.id);
      const words = el.querySelectorAll(".w");
      const riscos = el.querySelectorAll(".risco");
      if (index === 0) {
        // O primeiro quadro já mostra o gancho: só um "soco" de escala.
        tl.fromTo(el, { scale: 1.08 }, { scale: 1, duration: 0.6, ease: "power3.out" }, 0);
      } else {
        tl.set(el, { opacity: 1 }, card.start);
        tl.fromTo(words, { y: 70, opacity: 0, rotation: 5 }, { y: 0, opacity: 1, rotation: 0, duration: 0.38, ease: "back.out(1.8)", stagger: 0.06, immediateRender: false }, card.start);
      }
      if (riscos.length) {
        tl.fromTo(riscos, { scaleX: 0 }, { scaleX: 1, duration: 0.3, ease: "power2.out", stagger: 0.05 }, card.start + 0.2 + words.length * 0.06);
      }
      if (index < plan.length - 1) {
        tl.to(el, { opacity: 0, y: -50, scale: 0.94, duration: 0.18, ease: "power2.in" }, card.end - 0.18);
      }
    });`,
);

// Legendas: a fala do beat, com a palavra dita acendendo em amarelo.
const legendasScene = (plan) => sceneFile(
  "legendas",
  `.legenda { position:absolute; left:88px; right:230px; top:1180px; font-size:42px; font-weight:700; line-height:1.25;
  background:rgba(0,15,51,.66); border-radius:16px; padding:16px 24px; opacity:0; }
#l01 { opacity:1; }
.lw { display:inline-block; color:rgba(255,255,255,.62); }`,
  plan.map((line) => `    <p id="${line.id}" class="legenda">${line.words.map((word) => `<span class="lw">${escapeHtml(word.text)}</span>`).join(" ")}</p>`).join("\n"),
  `    const plan = ${JSON.stringify(plan.map(({ id, start, end, words }) => ({ id, start, end, words: words.map(({ start: s, end: e }) => [s, e]) })))};
    plan.forEach((line, index) => {
      const el = document.getElementById(line.id);
      const words = el.querySelectorAll(".lw");
      if (index > 0) tl.fromTo(el, { opacity: 0, y: 24 }, { opacity: 1, y: 0, duration: 0.15, ease: "power2.out", immediateRender: false }, line.start);
      if (index < plan.length - 1) tl.to(el, { opacity: 0, duration: 0.1, ease: "none" }, line.end - 0.1);
      line.words.forEach(([start, end], k) => {
        tl.to(words[k], { color: "#ffc72c", duration: 0.08, ease: "power1.out" }, start);
        tl.to(words[k], { color: "#ffffff", duration: 0.12, ease: "power1.out" }, Math.max(end, start + 0.1));
      });
    });`,
);

// Painel: os estados de tela empilhados; o plano diz quando cada um entra, como (deslizando se a tela muda de tipo,
// trocando rápido se é a mesma tela em outro estado) e onde o dedo toca.
const painelScene = (layers, segments) => sceneFile(
  "painel",
  TELA_CSS,
  `    <div id="palco" class="palco" data-layout-ignore>
      <div id="flutua" class="flutua">
        <div id="painel" class="painel">
${layers.map((layer) => `          <div id="${layer.id}" class="estado${layer.escura ? " escura" : ""}">${layer.html}</div>`).join("\n")}
          <span class="selo">Demonstração</span>
        </div>
        <div id="onda" class="onda"></div>
        <div id="dedo" class="dedo"></div>
      </div>
    </div>`,
  `    const segments = ${JSON.stringify(segments)};
    const layers = ${JSON.stringify(layers.map(({ html, escura, ...layer }) => layer))};
    const flutua = document.getElementById("flutua");
    const painel = document.getElementById("painel");
    const dedo = document.getElementById("dedo");
    const onda = document.getElementById("onda");
    const brl = (v) => "R$ " + v.toFixed(2).replace(".", ",").replace(/\\B(?=(\\d{3})+(?!\\d))/g, ".");
    const formata = (el, v) => (el.dataset.fmt === "int" ? String(Math.round(v)) : brl(v)) + (el.dataset.sufixo || "");
    // Centro de um elemento em relação ao painel flutuante (offsets não mudam com as animações de transform).
    const centro = (el) => {
      let x = el.offsetWidth / 2, y = el.offsetHeight / 2;
      for (let node = el; node && node !== flutua; node = node.offsetParent) { x += node.offsetLeft; y += node.offsetTop; }
      return { x, y };
    };

    segments.forEach((segment, index) => {
      tl.fromTo("#palco", { opacity: 0, y: 150, scale: 0.86, rotation: -4 }, { opacity: 1, y: 0, scale: 1, rotation: 0, duration: 0.5, ease: "back.out(1.4)", immediateRender: index === 0 }, segment.start);
      tl.fromTo(flutua, { scale: 1, y: 0 }, { scale: 1.04, y: -12, duration: segment.end - segment.start, ease: "sine.inOut", immediateRender: false }, segment.start);
      if (!segment.isLast) tl.to("#palco", { opacity: 0, y: 120, scale: 0.9, rotation: 3, duration: 0.28, ease: "power2.in" }, segment.end - 0.28);
    });

    layers.forEach((layer) => {
      const el = document.getElementById(layer.id);
      const at = layer.at;
      if (layer.mode === "slide") {
        // Navegação de app: a tela nova empurra a anterior, as duas opacas.
        tl.fromTo(el, { opacity: 1, x: 680 }, { opacity: 1, x: 0, duration: 0.42, ease: "power3.inOut", immediateRender: false }, at);
        tl.to("#" + layer.prev, { x: -260, duration: 0.42, ease: "power3.inOut" }, at);
        tl.to("#" + layer.prev, { opacity: 0, duration: 0.01 }, at + 0.43);
      } else if (layer.mode === "swap") {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.16, ease: "none", immediateRender: false }, at);
        tl.to("#" + layer.prev, { opacity: 0, duration: 0.01 }, at + 0.17);
      } else {
        tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.01, immediateRender: false }, at);
      }

      // Realce em quem mudou.
      const accents = el.querySelectorAll(".atual, .t-chip, .t-aprovado, .baixo, .marcado, .destaque, .aberto, .t-anexo, .t-itens li.novo, .t-registro, .t-contador");
      if (accents.length) tl.fromTo(accents, { scale: 0.82 }, { scale: 1, duration: 0.42, ease: "back.out(2.6)", stagger: 0.08, immediateRender: false }, layer.accentAt);
      const items = el.querySelectorAll(".t-lista li, .t-itens li:not(.total):not(.vazio), .t-catalogo li, .t-estoque li, .t-historico li, .t-etapas li");
      if (layer.mode !== "swap" && items.length) {
        tl.fromTo(items, { x: -40, opacity: 0 }, { x: 0, opacity: 1, duration: 0.3, ease: "power2.out", stagger: layer.tipo === "lista" ? 0.35 : 0.04, immediateRender: false }, at + 0.08);
      }

      // Números contando até o valor.
      el.querySelectorAll("[data-contar]").forEach((node) => {
        const from = Number(node.dataset.de), to = Number(node.dataset.contar), value = { v: from };
        node.textContent = formata(node, from);
        tl.fromTo(value, { v: from }, { v: to, duration: 0.7, ease: "power2.out", immediateRender: false, onUpdate: () => { node.textContent = formata(node, value.v); } }, at + 0.15);
      });

      if (layer.tipo === "notificacao") {
        tl.fromTo(el.querySelector(".t-notificacao"), { y: -90, opacity: 0, scale: 0.9 }, { y: 0, opacity: 1, scale: 1, duration: 0.45, ease: "back.out(1.8)", immediateRender: false }, at + 0.2);
        tl.fromTo(painel, { x: 0 }, { x: 9, duration: 0.05, repeat: 5, yoyo: true, ease: "none", immediateRender: false }, at + 0.6);
      }
      if (layer.tipo === "foto") tl.fromTo(el.querySelectorAll(".canto"), { scale: 1.35, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: "power3.out", immediateRender: false }, at);
      if (el.querySelector(".t-detalhe")) tl.fromTo(el.querySelectorAll(".t-detalhe, .t-arquivo"), { y: -14, opacity: 0 }, { y: 0, opacity: 1, duration: 0.3, stagger: 0.1, immediateRender: false }, at + 0.4);
      el.querySelectorAll(".baixo").forEach((row) => tl.fromTo(row, { x: 0 }, { x: 10, duration: 0.05, repeat: 5, yoyo: true, ease: "none", immediateRender: false }, at + 0.9));

      // Dedo: chega no alvo, aperta, a onda abre e ele sai.
      const target = layer.alvo && el.querySelector(layer.alvo);
      if (target) {
        const c = centro(target);
        tl.fromTo(dedo, { x: c.x + 150, y: c.y + 240, opacity: 0, scale: 1 }, { x: c.x, y: c.y, opacity: 1, duration: 0.4, ease: "power2.out", immediateRender: false }, at + 0.1);
        tl.to(dedo, { scale: 0.78, duration: 0.08, ease: "power1.in" }, at + 0.5);
        tl.to(dedo, { scale: 1, duration: 0.14, ease: "power1.out" }, at + 0.58);
        tl.fromTo(onda, { x: c.x, y: c.y, scale: 0.4, opacity: 0.9 }, { scale: 2.6, opacity: 0, duration: 0.5, ease: "power2.out", immediateRender: false }, at + 0.52);
        tl.fromTo(target, { scale: 1 }, { scale: 0.94, duration: 0.08, yoyo: true, repeat: 1, ease: "power1.inOut", immediateRender: false }, at + 0.5);
        tl.to(dedo, { opacity: 0, y: "+=80", duration: 0.25, ease: "power2.in" }, at + 0.85);
        const flash = el.querySelector(".t-flash");
        if (flash) tl.fromTo(flash, { opacity: 0 }, { opacity: 0.9, duration: 0.06, yoyo: true, repeat: 1, ease: "none", immediateRender: false }, at + 0.52);
      }
    });`,
);

const hostTag = (id, total, track, zIndex, kind = "graphics") =>
  `    <div id="${id}" data-composition-id="${id}" data-composition-src="compositions/${id}.html" data-start="0" data-duration="${total}" data-track-index="${track}" data-track-kind="${kind}" data-width="1080" data-height="1920" style="z-index:${zIndex}"></div>`;

const audioTag = (id, src, start, duration, track, volume, extra = "") =>
  `    <audio id="${id}" class="clip" src="${src}" data-start="${start}" data-duration="${duration}" data-track-index="${track}" data-volume="${volume}"${extra}></audio>`;

// ── Projeto ──────────────────────────────────────────────────────────────────────────────────────

const buildReel = async (post, index) => {
  const project = join(HERE, "build", post.slug);
  const voiceDir = join(HERE, "voz", post.slug);
  mkdirSync(voiceDir, { recursive: true });
  const voice = await narrate(post, voiceDir);
  const { total, beats } = timeline(post, voice);
  const music = await compose(post, index, total);

  // Plano do painel: segmentos (beats seguidos com tela) e camadas (um estado de tela cada).
  const segments = [];
  const layers = [];
  const effects = [];
  const addEffect = (kind, at) => effects.push({ kind, start: sec(Math.max(0, at - SFX[kind].peak + FRAME)) });
  beats.forEach((item, beatIndex) => {
    if (!item.telas.length) return;
    const previousBeat = beats[beatIndex - 1];
    if (!previousBeat?.telas.length) {
      segments.push({ start: item.start, end: item.end, isLast: false });
      if (item.start > 0) addEffect("whoosh", item.start + 0.2);
    } else {
      segments.at(-1).end = item.end;
    }
    item.telas.forEach((tela, k) => {
      const prev = layers.at(-1);
      const isNewSegment = k === 0 && !previousBeat?.telas.length;
      // A mesma tela de novo (beat seguinte falando dela) continua a camada anterior, sem recomeçar animações.
      if (!isNewSegment && prev.key === JSON.stringify(tela)) return;
      const { html, escura, alvo } = renderTela(tela);
      const mode = isNewSegment ? "first" : prev.tipo === tela.tipo ? "swap" : "slide";
      const at = item.states[k];
      layers.push({ id: `p${pad(layers.length + 1)}`, key: JSON.stringify(tela), at, tipo: tela.tipo, mode, prev: isNewSegment ? undefined : prev.id, alvo, html, escura,
        accentAt: sec(at + (isNewSegment ? 0.4 : 0.12)) });
      if (mode === "slide") addEffect("whoosh", at + 0.15);
      if (mode === "swap") addEffect("pop", at + 0.1);
      if (alvo) addEffect("click", at + 0.52);
      if (tela.tipo === "notificacao") addEffect("notificacao", at + 0.3);
    });
  });
  for (const segment of segments) {
    segment.isLast = sec(segment.end) >= total;
    if (!segment.isLast) addEffect("whoosh", segment.end - 0.2);
  }

  const cards = beats.map((item, k) => ({ id: `c${pad(k + 1)}`, text: item.beat.card, start: item.start, end: item.end, comTela: item.telas.length > 0 }));
  const lines = beats.map((item, k) => ({ id: `l${pad(k + 1)}`, start: item.start, end: item.end, words: item.words }));

  // Recria só o que o script gera; a pasta fica (o Windows não a apaga enquanto um preview a usa, e .hyperframes guarda o histórico).
  for (const dir of ["compositions", "assets"]) rmSync(join(project, dir), { recursive: true, force: true });
  mkdirSync(join(project, "compositions"), { recursive: true });
  mkdirSync(join(project, "assets", "sfx"), { recursive: true });
  cpSync(join(HERE, "fonts"), join(project, "assets", "fonts"), { recursive: true });
  copyFileSync(join(ROOT, "gerador", "logo.png"), join(project, "assets", "logo.png"));
  copyFileSync(join(voiceDir, "narracao.mp3"), join(project, "assets", "narracao.mp3"));
  if (music) copyFileSync(music, join(project, "assets", "trilha.mp3"));
  for (const { file } of Object.values(SFX)) copyFileSync(join(HERE, "sfx", file), join(project, "assets", "sfx", file));

  writeFileSync(join(project, "compositions", "fundo.html"), fundoScene(total));
  writeFileSync(join(project, "compositions", "painel.html"), painelScene(layers, segments));
  writeFileSync(join(project, "compositions", "cards.html"), cardsScene(cards));
  writeFileSync(join(project, "compositions", "legendas.html"), legendasScene(lines));

  const audio = [audioTag("narracao", "assets/narracao.mp3", 0, sec(voice.seconds), 4, VOICE_VOLUME)];
  if (music) audio.push(audioTag("trilha", "assets/trilha.mp3", 0, total, 8, MUSIC_VOLUME, ` data-fade-out="1.2"`));
  // Cada efeito vai para a primeira faixa livre, para um não cortar o outro quando caem perto.
  const trackEnds = new Map([[5, 0], [6, 0], [7, 0]]);
  effects.sort((a, b) => a.start - b.start).forEach(({ kind, start }, k) => {
    const { file, seconds, volume } = SFX[kind];
    const duration = Math.min(seconds, sec(total - start));
    const track = [...trackEnds].find(([, end]) => end <= start)?.[0] ?? 7;
    trackEnds.set(track, start + duration);
    audio.push(audioTag(`sfx${pad(k + 1)}`, `assets/sfx/${file}`, start, duration, track, volume));
  });

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
${hostTag("fundo", total, 0, 0)}
${hostTag("painel", total, 1, 1)}
${hostTag("cards", total, 2, 2)}
${hostTag("legendas", total, 3, 3, "captions")}
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
  console.log(post.slug);
  const { project, total } = await buildReel(post, reels.indexOf(post));
  if (isPreview) {
    console.log(`  Projeto pronto: ${project} (${total.toFixed(1)}s)`);
    continue;
  }
  execSync(`${HYPERFRAMES} render --quality delivery -o out.mp4`, { cwd: project, stdio: "inherit" });
  const output = join(ROOT, "videos", `${post.slug}.mp4`);
  mkdirSync(dirname(output), { recursive: true });
  copyFileSync(join(project, "out.mp4"), output);
  console.log(`  Vídeo pronto: ${output} (${total.toFixed(1)}s)`);
}
