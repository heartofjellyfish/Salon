export type LightMood = "daylight" | "evening" | "spotlight";

export type RoomStyle = "warm" | "cool" | "neutral";

export interface PaintingDetail {
  label: string;
  value: string;
}

export interface Painting {
  id: string;
  title: string;
  artist: string;
  year: string;
  /** Path under /public. Swap the placeholder for a real high-res file at the same path. */
  imageUrl: string;
  /** Real artwork width in centimeters — drives both aspect ratio and believable scale. */
  width: number;
  /** Real artwork height in centimeters. */
  height: number;
  /** Hex color shown instantly behind a loading image; also tints the frame's matte. */
  dominantColor?: string;
  shortNote?: string;
  details?: PaintingDetail[];
}

export interface Room {
  id: string;
  slug: string;
  title: string;
  /** A short evocative subtitle, e.g. "Light, and the patience of afternoons". */
  theme: string;
  curatorNote: string;
  /** ISO date (YYYY-MM-DD) the room opens. */
  startDate: string;
  /** ISO date (YYYY-MM-DD) the room closes. */
  endDate: string;
  roomStyle?: RoomStyle;
  defaultLight?: LightMood;
  paintings: Painting[];
}
