// Reel em cards: um beat por tela, com o texto grande (card), a legenda da fala e o áudio do beat.
// Tudo que importa fica na área segura do Reels (y entre 230 e 1440, fora dos 230 px da direita).
import { loadFont as loadBarlow } from "@remotion/google-fonts/Barlow";
import { loadFont as loadBarlowCondensed } from "@remotion/google-fonts/BarlowCondensed";
import { Audio } from "@remotion/media";
import { AbsoluteFill, Img, Series, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig } from "remotion";

export const FPS = 30;

const { fontFamily: barlow } = loadBarlow("normal", { weights: ["600"], subsets: ["latin", "latin-ext"] });
const { fontFamily: condensed } = loadBarlowCondensed("normal", { weights: ["700", "800"], subsets: ["latin", "latin-ext"] });

const COLORS = { blue: "#003399", blueDark: "#001f66", yellow: "#ffc72c", ink: "#1a1d21" };

export const beatFrames = (beat) => Math.ceil(beat.seconds * FPS);

// *texto* sai em amarelo, igual às artes do feed.
const Highlighted = ({ text }) =>
  text.split(/(\*[^*]+\*)/).map((part, index) =>
    part.startsWith("*") ? (
      <span key={index} style={{ color: COLORS.yellow }}>
        {part.slice(1, -1)}
      </span>
    ) : (
      part
    ),
  );

const Beat = ({ beat }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const pop = spring({ frame, fps, config: { damping: 14, stiffness: 180 } });

  return (
    <AbsoluteFill>
      {beat.audio ? <Audio src={staticFile(beat.audio)} /> : null}
      <div
        style={{
          position: "absolute",
          top: 560,
          left: 88,
          right: 260,
          fontFamily: condensed,
          fontWeight: 800,
          fontSize: 132,
          lineHeight: 0.95,
          letterSpacing: -1,
          textTransform: "uppercase",
          color: "#fff",
          opacity: pop,
          transform: `translateY(${interpolate(pop, [0, 1], [60, 0])}px)`,
        }}
      >
        <Highlighted text={beat.card} />
      </div>
      <div
        style={{
          position: "absolute",
          top: 1180,
          left: 88,
          right: 260,
          fontFamily: barlow,
          fontWeight: 600,
          fontSize: 50,
          lineHeight: 1.2,
          color: "#fff",
          background: "rgba(0, 15, 51, 0.55)",
          borderRadius: 16,
          padding: "20px 28px",
        }}
      >
        {beat.say}
      </div>
    </AbsoluteFill>
  );
};

export const Reel = ({ beats }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(circle at 85% 10%, #0a47c2 0%, ${COLORS.blue} 45%, ${COLORS.blueDark} 100%)`,
    }}
  >
    <div style={{ position: "absolute", top: 88, left: 88, display: "flex", alignItems: "center", gap: 18 }}>
      <Img src={staticFile("logo.png")} style={{ width: 64, height: 64, borderRadius: 12, background: "#fff" }} />
      <span style={{ fontFamily: condensed, fontWeight: 700, fontSize: 34, letterSpacing: 4, color: "#fff" }}>BOXMONITOR</span>
    </div>
    <Series>
      {beats.map((beat, index) => (
        <Series.Sequence key={index} durationInFrames={beatFrames(beat)}>
          <Beat beat={beat} />
        </Series.Sequence>
      ))}
    </Series>
    <div
      style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        height: 28,
        background: `repeating-linear-gradient(-45deg, ${COLORS.yellow} 0 28px, ${COLORS.ink} 28px 56px)`,
      }}
    />
  </AbsoluteFill>
);
