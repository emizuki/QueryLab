import { For } from "solid-js";
import { ChevronDown } from "lucide-solid";

interface SelectProps<T extends string> {
  label?: string;
  value: T;
  onChange: (value: T) => void;
  options: { value: T; label: string }[];
  class?: string;
}

export function Select<T extends string>(props: SelectProps<T>) {
  return (
    <div class={`flex flex-col gap-1 ${props.class ?? ""}`}>
      {props.label && (
        <label class="text-xs text-text-secondary">{props.label}</label>
      )}
      <div class="relative">
        <select
          value={props.value}
          onChange={(e) => props.onChange(e.currentTarget.value as T)}
          class="h-7 w-full rounded-md border border-border bg-surface-secondary px-2 pr-7 text-[13px] text-text-primary outline-none transition-colors focus:border-accent appearance-none cursor-default"
        >
          <For each={props.options}>
            {(option) => (
              <option value={option.value}>{option.label}</option>
            )}
          </For>
        </select>
        <ChevronDown
          size={12}
          class="absolute right-2 top-1/2 -translate-y-1/2 text-text-tertiary pointer-events-none"
        />
      </div>
    </div>
  );
}
