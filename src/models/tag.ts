export interface ConnectionTag {
  id: string;
  name: string;
  isPreset: boolean;
  color: string;
}

export const PRESET_TAGS: ConnectionTag[] = [
  { id: "preset-local", name: "local", isPreset: true, color: "green" },
  { id: "preset-development", name: "development", isPreset: true, color: "blue" },
  { id: "preset-production", name: "production", isPreset: true, color: "red" },
  { id: "preset-testing", name: "testing", isPreset: true, color: "orange" },
];

export const TAG_COLORS: Record<string, string> = {
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  gray: "#8E8E93",
};
