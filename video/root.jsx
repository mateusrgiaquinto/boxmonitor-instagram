import { Composition } from "remotion";

import { FPS, Reel, beatFrames } from "./reel.jsx";

// A duração vem dos beats: cada um dura o tempo da própria fala (medido no áudio gerado).
const calculateMetadata = ({ props }) => ({
  durationInFrames: Math.max(1, props.beats.reduce((total, beat) => total + beatFrames(beat), 0)),
});

export const Root = () => (
  <Composition
    id="Reel"
    component={Reel}
    fps={FPS}
    width={1080}
    height={1920}
    durationInFrames={FPS}
    defaultProps={{ beats: [] }}
    calculateMetadata={calculateMetadata}
  />
);
