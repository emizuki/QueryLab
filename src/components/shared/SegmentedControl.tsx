import { For } from "solid-js";

interface SegmentedControlProps<T extends string> {
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
}

export function SegmentedControl<T extends string>(props: SegmentedControlProps<T>) {
  return (
    <div class="inline-flex rounded-lg bg-surface-secondary p-0.5 gap-0.5">
      <For each={props.options}>
        {(option) => (
          <button
            type="button"
            onClick={() => props.onChange(option.value)}
            class={`rounded-md px-3 py-1 text-[12px] font-medium transition-colors cursor-default ${
              props.value === option.value
                ? "bg-accent text-white"
                : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
            }`}
          >
            {option.label}
          </button>
        )}
      </For>
    </div>
  );
}
