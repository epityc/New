import { AbsoluteFill, Sequence, Video, useVideoConfig } from "remotion";

interface Props {
  urls: string[];
}

export const BackgroundClips: React.FC<Props> = ({ urls }) => {
  const { durationInFrames } = useVideoConfig();

  if (urls.length === 0) {
    return <AbsoluteFill style={{ backgroundColor: "#0a0a0a" }} />;
  }

  const framesPerClip = Math.ceil(durationInFrames / urls.length);

  return (
    <AbsoluteFill>
      {urls.map((url, i) => (
        <Sequence
          key={url + i}
          from={i * framesPerClip}
          durationInFrames={framesPerClip}
        >
          <AbsoluteFill>
            <Video
              src={url}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              loop
              muted
            />
            {/* Subtle dark overlay for readability */}
            <AbsoluteFill
              style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)" }}
            />
          </AbsoluteFill>
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
