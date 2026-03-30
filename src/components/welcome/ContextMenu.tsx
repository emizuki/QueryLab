import { Show, onMount, onCleanup } from "solid-js";
import { useUI } from "../../stores/ui-store";
import { useConnections } from "../../stores/connection-store";

export function ContextMenu() {
  const [uiState, ui] = useUI();
  const [, actions] = useConnections();

  const handleClickOutside = () => {
    if (uiState.contextMenu.visible) ui.hideContextMenu();
  };

  onMount(() => {
    document.addEventListener("click", handleClickOutside);
    document.addEventListener("contextmenu", handleClickOutside);
  });

  onCleanup(() => {
    document.removeEventListener("click", handleClickOutside);
    document.removeEventListener("contextmenu", handleClickOutside);
  });

  return (
    <Show when={uiState.contextMenu.visible}>
      <div
        class="fixed z-50 min-w-[160px] rounded-lg bg-surface-dialog backdrop-blur-xl border border-border py-1 shadow-lg"
        style={{
          left: `${uiState.contextMenu.x}px`,
          top: `${uiState.contextMenu.y}px`,
        }}
      >
        <Show when={uiState.contextMenu.connectionId}>
          <MenuItem
            label="Edit"
            onClick={() => {
              ui.openEditForm(uiState.contextMenu.connectionId!);
              ui.hideContextMenu();
            }}
          />
          <MenuItem
            label="Duplicate"
            onClick={() => {
              // TODO: implement duplicate
              ui.hideContextMenu();
            }}
          />
          <div class="my-1 border-t border-divider" />
          <MenuItem
            label="Delete"
            destructive
            onClick={async () => {
              await actions.removeConnection(uiState.contextMenu.connectionId!);
              ui.selectConnection(null);
              ui.hideContextMenu();
            }}
          />
        </Show>

        <Show when={uiState.contextMenu.groupId}>
          <MenuItem
            label="Rename"
            onClick={() => {
              // TODO: implement rename
              ui.hideContextMenu();
            }}
          />
          <div class="my-1 border-t border-divider" />
          <MenuItem
            label="Delete Group"
            destructive
            onClick={async () => {
              await actions.removeGroup(uiState.contextMenu.groupId!);
              ui.hideContextMenu();
            }}
          />
        </Show>
      </div>
    </Show>
  );
}

function MenuItem(props: {
  label: string;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={props.onClick}
      class={`w-full text-left px-3 py-1 text-[12px] cursor-default transition-colors ${
        props.destructive
          ? "text-tag-red hover:bg-tag-red/10"
          : "text-text-primary hover:bg-surface-hover"
      }`}
    >
      {props.label}
    </button>
  );
}
