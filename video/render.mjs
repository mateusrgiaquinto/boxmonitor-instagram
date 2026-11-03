// Gera o vídeo de um Reel de conteudo.mjs: voz da ElevenLabs por beat + cards animados (Remotion).
//
// Uso:
//   node video/render.mjs <slug>             grava videos/<slug>.mp4 (é esse arquivo que o publicar.mjs posta)
//   node video/render.mjs <slug> --sem-voz   teste sem áudio, com tempo estimado; grava em video/out/
//
// Variáveis de ambiente (só sem --sem-voz):
//   ELEVENLABS_API_KEY   chave da API da ElevenLabs
//   ELEVENLABS_VOICE_ID  id da voz (pt-BR) escolhida na Voice Library
import { copyFileSync, existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { bundle } from "@remotion/bundler";
import { renderMedia, selectComposition } from "@remotion/renderer";

import { posts } from "../gerador/conteudo.mjs";

const HERE = dirname(fileURLToPath(import.meta.url));
const ROOT = dirname(HERE);
const PUBLIC = join(HERE, "public");
const TTS_MODEL = "eleven_multilingual_v2";
const WORDS_PER_SECOND = 150 / 60; // ritmo usado no roteiro (voice.md)
const PAUSE_SECONDS = 0.3; // respiro entre um beat e o próximo

const [slug] = process.argv.slice(2).filter((arg) => !arg.startsWith("--"));
const isSilent = process.argv.includes("--sem-voz");

const post = posts.find((candidate) => candidate.slug === slug && candidate.kind === "reel");
if (!post) {
  const reels = posts.filter((candidate) => candidate.kind === "reel").map((candidate) => candidate.slug);
  console.error(`Reel não encontrado: ${slug ?? "(sem slug)"}. Reels em conteudo.mjs: ${reels.join(", ")}`);
  process.exit(1);
}

const { ELEVENLABS_API_KEY, ELEVENLABS_VOICE_ID } = process.env;
if (!isSilent && (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID)) {
  console.error("Faltam ELEVENLABS_API_KEY e ELEVENLABS_VOICE_ID (ou rode com --sem-voz para testar).");
  process.exit(1);
}

const audioDir = join(PUBLIC, post.slug);
mkdirSync(audioDir, { recursive: true });
copyFileSync(join(ROOT, "gerador", "logo.png"), join(PUBLIC, "logo.png"));

// Gera (ou reaproveita, se a fala não mudou) o áudio de um beat e devolve quanto ele dura.
const speak = async (beat, index) => {
  const name = `${String(index + 1).padStart(2, "0")}`;
  const metaPath = join(audioDir, `${name}.json`);
  const audio = `${post.slug}/${name}.mp3`;
  const cached = existsSync(metaPath) ? JSON.parse(readFileSync(metaPath, "utf8")) : undefined;
  if (cached?.say === beat.say && cached.voice === ELEVENLABS_VOICE_ID) return { audio, seconds: cached.seconds };

  const res = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}/with-timestamps`, {
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

  writeFileSync(join(audioDir, `${name}.mp3`), Buffer.from(json.audio_base64, "base64"));
  const seconds = json.alignment.character_end_times_seconds.at(-1);
  writeFileSync(metaPath, `${JSON.stringify({ say: beat.say, voice: ELEVENLABS_VOICE_ID, seconds }, null, 2)}\n`);
  return { audio, seconds };
};

const beats = [];
for (const [index, beat] of post.beats.entries()) {
  const voice = isSilent ? { seconds: beat.say.split(/\s+/).length / WORDS_PER_SECOND } : await speak(beat, index);
  beats.push({ say: beat.say, card: beat.card, audio: voice.audio, seconds: voice.seconds + PAUSE_SECONDS });
  console.log(`beat ${index + 1}: ${voice.seconds.toFixed(1)}s  ${beat.say}`);
}

const output = isSilent ? join(HERE, "out", `${post.slug}-sem-voz.mp4`) : join(ROOT, "videos", `${post.slug}.mp4`);
mkdirSync(dirname(output), { recursive: true });

const serveUrl = await bundle({ entryPoint: join(HERE, "index.jsx"), publicDir: PUBLIC });
const inputProps = { beats };
const composition = await selectComposition({ serveUrl, id: "Reel", inputProps });
await renderMedia({ composition, serveUrl, codec: "h264", inputProps, outputLocation: output });

const total = beats.reduce((sum, beat) => sum + beat.seconds, 0);
console.log(`Vídeo pronto: ${output} (${total.toFixed(1)}s)`);
