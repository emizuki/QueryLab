import { Show } from "solid-js";
import { AlertCircle, X } from "lucide-solid";
import { useUI } from "../../stores/ui-store";

export function Toast() {
  const [state, actions] = useUI();

  return (
    <Show when={state.toast.visible}>
      <div class="fixed bottom-4 left-1/2 -translate-x-1/2 z-[60]">
        <div class="flex items-center gap-2 max-w-[360px] rounded-lg bg-surface-dialog backdrop-blur-xl border border-border shadow-lg px-3 py-2">
          <AlertCircle size={13} class="shrink-0 text-tag-red" />
          <span class="text-[12px] text-text-primary leading-snug">
            {state.toast.message}
          </span>
          <button
            type="button"
            onClick={() => actions.dismissToast()}
            class="shrink-0 p-0.5 text-text-tertiary hover:text-text-secondary"
          >
            <X size={12} />
          </button>
        </div>
      </div>
    </Show>
  );
}
