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
        class={`peer inline-flex h-5 w-9 shrink-0 cursor-default items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 ${
          props.checked ? "bg-accent" : "bg-surface-selected"
        }`}
      >
        <span
          class={`pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0 transition-transform ${
            props.checked ? "translate-x-4" : "translate-x-0"
          }`}
        />
      </button>
      {props.label && (
        <span class="text-[13px] text-text-primary">{props.label}</span>
      )}
    </label>
  );
}
