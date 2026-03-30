interface ToggleProps {
  label?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  class?: string;
}

export function Toggle(props: ToggleProps) {
  return (
    <label class={`inline-flex items-center gap-2 cursor-default ${props.class ?? ""}`}>
      <button
        type="button"
        role="switch"
        aria-checked={props.checked}
        onClick={() => props.onChange(!props.checked)}
        class={`relative inline-flex h-5 w-9 shrink-0 rounded-full border border-transparent transition-colors ${
          props.checked ? "bg-accent" : "bg-surface-selected"
        }`}
      >
        <span
          class={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform ${
            props.checked ? "translate-x-4" : "translate-x-0.5"
          }`}
          style={{ "margin-top": "1px" }}
        />
      </button>
      {props.label && (
        <span class="text-[13px] text-text-primary">{props.label}</span>
      )}
    </label>
  );
}
