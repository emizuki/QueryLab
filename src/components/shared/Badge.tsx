import { TAG_COLORS } from "../../models/tag";

interface BadgeProps {
  label: string;
  color: string;
}

export function Badge(props: BadgeProps) {
  const bgColor = () => {
    const hex = TAG_COLORS[props.color] ?? props.color;
    return hex;
  };

  return (
    <span
      class="inline-flex items-center rounded-full px-1.5 py-px text-[10px] font-medium leading-tight"
      style={{
        "background-color": `${bgColor()}20`,
        color: bgColor(),
      }}
    >
      {props.label}
    </span>
  );
}
