import { AbsoluteFill, Audio, useVideoConfig } from "remotion";
import { BackgroundClips } from "./components/BackgroundClips";
import { Captions } from "./components/Captions";
import type { FacelessVideoProps } from "./types";

export const FacelessVideo: React.FC<FacelessVideoProps> = ({
  audioUrl,
  backgroundUrls,
  wordTimestamps,
  captionStyle,
}) => {
  const { fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ backgroundColor: "#000000" }}>
      <BackgroundClips urls={backgroundUrls} />
      {audioUrl ? <Audio src={audioUrl} /> : null}
      <Captions wordTimestamps={wordTimestamps} captionStyle={captionStyle} fps={fps} />
    </AbsoluteFill>
  );
};
