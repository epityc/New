import { Composition } from "remotion";
import { FacelessVideo } from "./FacelessVideo";
import type { FacelessVideoProps } from "./types";

const FPS = 30;

const defaultProps: FacelessVideoProps = {
  audioUrl: "",
  backgroundUrls: [],
  wordTimestamps: [],
  captionStyle: "bold_stroke",
  durationTarget: 60,
};

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="FacelessVideo"
      component={FacelessVideo}
      durationInFrames={60 * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        durationInFrames: Math.ceil(props.durationTarget * FPS) + FPS, // +1s buffer
      })}
    />
  );
};
