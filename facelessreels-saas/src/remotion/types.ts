export interface WordTimestamp {
  word: string;
  start: number; // seconds
  end: number;   // seconds
}

export interface FacelessVideoProps {
  audioUrl: string;
  backgroundUrls: string[];
  wordTimestamps: WordTimestamp[];
  captionStyle: string;
  durationTarget: number; // seconds
}
