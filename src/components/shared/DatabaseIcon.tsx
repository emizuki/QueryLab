import type { DatabaseType } from "../../models/database-type";

interface DatabaseIconProps {
  type: DatabaseType;
  size?: number;
}

export function DatabaseIcon(props: DatabaseIconProps) {
  const size = () => props.size ?? 16;

  // Simple cylinder icon colored per database type
  const colors: Record<DatabaseType, string> = {
    postgresql: "#336791",
    mysql: "#4479A1",
    mariadb: "#003545",
    sqlite: "#003B57",
    redis: "#DC382D",
    mongodb: "#47A248",
  };

  const color = () => colors[props.type] ?? "#8E8E93";

  return (
    <svg
      width={size()}
      height={size()}
      viewBox="0 0 16 16"
      fill="none"
      class="shrink-0"
    >
      <ellipse cx="8" cy="4" rx="5.5" ry="2.5" fill={color()} opacity="0.9" />
      <path
        d="M2.5 4v8c0 1.38 2.46 2.5 5.5 2.5s5.5-1.12 5.5-2.5V4"
        stroke={color()}
        stroke-width="1"
        fill={color()}
        opacity="0.7"
      />
      <ellipse cx="8" cy="4" rx="5.5" ry="2.5" fill={color()} />
      <ellipse cx="8" cy="4" rx="5.5" ry="2.5" fill="white" opacity="0.2" />
    </svg>
  );
}
