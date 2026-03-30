import { createSignal } from "solid-js";
import { Eye, EyeOff } from "lucide-solid";

interface SecureFieldProps {
  label?: string;
  value: string;
  onInput: (value: string) => void;
  placeholder?: string;
  class?: string;
}

export function SecureField(props: SecureFieldProps) {
  const [visible, setVisible] = createSignal(false);

  return (
    <div class={`flex flex-col gap-1 ${props.class ?? ""}`}>
      {props.label && (
        <label class="text-xs text-text-secondary">{props.label}</label>
      )}
      <div class="relative">
        <input
          type={visible() ? "text" : "password"}
          value={props.value}
          onInput={(e) => props.onInput(e.currentTarget.value)}
          placeholder={props.placeholder}
          class="h-7 w-full rounded-md border border-border bg-surface-secondary px-2.5 pr-8 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none transition-colors focus:border-accent"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible())}
          class="absolute right-1.5 top-1/2 -translate-y-1/2 p-0.5 text-text-tertiary hover:text-text-secondary"
          tabIndex={-1}
        >
          {visible() ? <Eye size={14} /> : <EyeOff size={14} />}
        </button>
      </div>
    </div>
  );
}
