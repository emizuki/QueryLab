import { For } from "solid-js";
import { CONNECTION_COLORS, type ConnectionColor } from "../../models/connection";

interface ColorPickerProps {
  value: ConnectionColor;
  onChange: (color: ConnectionColor) => void;
}

const colorOptions: ConnectionColor[] = [
  "none", "red", "orange", "yellow", "green", "blue", "purple", "pink", "gray",
];

export function ColorPicker(props: ColorPickerProps) {
  return (
    <div class="flex items-center gap-1.5">
      <For each={colorOptions}>
        {(color) => (
          <button
            type="button"
            onClick={() => props.onChange(color)}
            class={`w-5 h-5 rounded-full border-2 transition-colors cursor-default ${
              props.value === color
                ? "border-accent"
                : "border-transparent hover:border-border"
            }`}
            style={{
              "background-color":
                color === "none" ? "transparent" : CONNECTION_COLORS[color],
              ...(color === "none"
                ? {
                    "background-image":
                      "linear-gradient(135deg, transparent 45%, rgba(255,59,48,0.6) 45%, rgba(255,59,48,0.6) 55%, transparent 55%)",
                    border: props.value === "none" ? "2px solid var(--color-accent)" : "1px solid var(--color-border)",
                  }
                : {}),
            }}
            title={color}
          />
        )}
      </For>
    </div>
  );
}
