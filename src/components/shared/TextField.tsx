interface TextFieldProps {
  label?: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  type?: "text" | "number";
  class?: string;
  disabled?: boolean;
  error?: string;
}

export function TextField(props: TextFieldProps) {
  return (
    <div class={`flex flex-col gap-1 ${props.class ?? ""}`}>
      {props.label && (
        <label class="text-xs text-text-secondary">{props.label}</label>
      )}
      <input
        type={props.type ?? "text"}
        value={props.value}
        onInput={(e) => props.onInput(e.currentTarget.value)}
        placeholder={props.placeholder}
        disabled={props.disabled}
        class={`h-7 rounded-md border bg-surface-secondary px-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors disabled:opacity-40 ${
          props.error ? "border-tag-red focus:border-tag-red" : "border-border focus:border-accent"
        }`}
      />
      {props.error && (
        <p class="text-[11px] text-tag-red">{props.error}</p>
      )}
    </div>
  );
}
