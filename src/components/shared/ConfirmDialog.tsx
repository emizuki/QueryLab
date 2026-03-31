import { Show } from "solid-js";
import { useUI } from "../../stores/ui-store";

export function ConfirmDialog() {
  const [state, actions] = useUI();

  return (
    <Show when={state.confirmDialog.visible}>
      <div class="fixed inset-0 z-55 flex items-center justify-center bg-surface-overlay">
        <div class="w-65 rounded-xl bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/8 shadow-2xl overflow-hidden">
          <div class="px-4 pt-4 pb-3 text-center">
            <h3 class="text-[13px] font-semibold text-text-primary">
              {state.confirmDialog.title}
            </h3>
            <p class="mt-1 text-[11px] text-text-secondary leading-relaxed">
              {state.confirmDialog.message}
            </p>
          </div>
          <div class="flex border-t border-white/8">
            <button
              type="button"
              onClick={() => actions.hideConfirmDialog()}
              class="flex-1 py-2 text-[13px] font-medium text-accent hover:bg-white/6 border-r border-white/8 cursor-default"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => actions.executeConfirm()}
              class="flex-1 py-2 text-[13px] font-semibold text-tag-red hover:bg-tag-red/10 cursor-default"
            >
              {state.confirmDialog.destructiveLabel}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
