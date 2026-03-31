import { Show, createSignal, createEffect } from "solid-js";
import { useUI } from "../../stores/ui-store";

export function InputDialog() {
  const [state, actions] = useUI();
  const [value, setValue] = createSignal("");

  createEffect(() => {
    if (state.inputDialog.visible) setValue("");
  });

  const handleConfirm = () => {
    const trimmed = value().trim();
    if (trimmed) actions.executeInput(trimmed);
  };

  return (
    <Show when={state.inputDialog.visible}>
      <div class="fixed inset-0 z-55 flex items-center justify-center bg-surface-overlay" onClick={() => actions.hideInputDialog()}>
        <div class="w-65 rounded-xl bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/8 shadow-2xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
          <div class="px-4 pt-4 pb-3 text-center">
            <h3 class="text-[13px] font-semibold text-text-primary">
              {state.inputDialog.title}
            </h3>
            <input
              type="text"
              value={value()}
              onInput={(e) => setValue(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleConfirm();
                if (e.key === "Escape") actions.hideInputDialog();
              }}
              placeholder={state.inputDialog.placeholder}
              class="mt-3 h-7 w-full rounded-md border border-white/12 bg-white/6 px-2.5 text-[13px] text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
              autofocus
            />
          </div>
          <div class="flex border-t border-white/8">
            <button
              type="button"
              onClick={() => actions.hideInputDialog()}
              class="flex-1 py-2 text-[13px] font-medium text-accent hover:bg-white/6 border-r border-white/8 cursor-default"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              class="flex-1 py-2 text-[13px] font-semibold text-accent hover:bg-white/6 cursor-default"
            >
              {state.inputDialog.confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </Show>
  );
}
