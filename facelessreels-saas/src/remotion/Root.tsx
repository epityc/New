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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      component={FacelessVideo as any}
      durationInFrames={60 * FPS}
      fps={FPS}
      width={1080}
      height={1920}
      defaultProps={defaultProps}
      calculateMetadata={({ props }) => ({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        durationInFrames: Math.ceil((props as any).durationTarget * FPS) + FPS,
      })}
    />
  );
};
