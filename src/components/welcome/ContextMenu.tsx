import { Show, onMount, onCleanup } from "solid-js";
import { ChevronRight } from "lucide-solid";
import { useUI } from "../../stores/ui-store";
import { useConnections } from "../../stores/connection-store";

function buildConnectionUrl(conn: {
  type: string;
  host: string;
  port: number;
  database: string;
  username: string;
}): string {
  if (conn.type === "sqlite") return conn.database;
  const user = conn.username ? `${conn.username}@` : "";
  const port = conn.port ? `:${conn.port}` : "";
  const db = conn.database ? `/${conn.database}` : "";
  return `${conn.type}://${user}${conn.host}${port}${db}`;
}

export function ContextMenu() {
  const [uiState, ui] = useUI();
  const [connState, actions] = useConnections();

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

  const menuPosition = () => {
    const menuWidth = 200;
    const menuHeight = uiState.contextMenu.connectionId ? 310 : 90;
    const x = Math.min(uiState.contextMenu.x, window.innerWidth - menuWidth - 8);
    const y = Math.min(uiState.contextMenu.y, window.innerHeight - menuHeight - 8);
    return { x: Math.max(8, x), y: Math.max(8, y) };
  };

  return (
    <Show when={uiState.contextMenu.visible}>
      <div
        class="fixed z-50 min-w-50 rounded-lg bg-black/40 backdrop-blur-2xl backdrop-saturate-150 border border-white/8 py-1 shadow-2xl"
        style={{
          left: `${menuPosition().x}px`,
          top: `${menuPosition().y}px`,
        }}
      >
        <Show when={uiState.contextMenu.connectionId}>
          {/* Connect */}
          <MenuItem label="Connect" disabled />
          <Divider />

          {/* New / Edit / Duplicate */}
          <MenuItem label="New" hasSubmenu disabled />
          <MenuItem
            label="Edit..."
            onClick={() => {
              ui.openEditForm(uiState.contextMenu.connectionId!);
              ui.hideContextMenu();
            }}
          />
          <MenuItem
            label="Duplicate"
            onClick={() => {
              const connId = uiState.contextMenu.connectionId!;
              ui.hideContextMenu();
              actions.duplicateConnection(connId).catch(() => {});
            }}
          />
          <Divider />

          {/* Copy as URL */}
          <MenuItem
            label="Copy as URL"
            onClick={() => {
              const connId = uiState.contextMenu.connectionId!;
              const conn = connState.connections.find((c) => c.id === connId);
              ui.hideContextMenu();
              if (conn) {
                navigator.clipboard.writeText(buildConnectionUrl(conn)).then(
                  () => ui.showToast("Connection URL copied", "info"),
                  () => ui.showToast("Failed to copy URL"),
                );
              }
            }}
          />
          <Divider />

          {/* Sort By */}
          <MenuItem label="Sort By" hasSubmenu disabled />
          <Divider />

          {/* Import / Export */}
          <MenuItem label="Import Connections..." disabled />
          <MenuItem label="Export Connections" hasSubmenu disabled />
          <Divider />

          {/* Delete */}
          <MenuItem
            label="Delete"
            destructive
            onClick={() => {
              const connId = uiState.contextMenu.connectionId!;
              const connName = connState.connections.find((c) => c.id === connId)?.name || "this connection";
              ui.hideContextMenu();
              ui.showConfirmDialog({
                title: `Delete "${connName}"?`,
                message: "This connection and its saved credentials will be permanently removed.",
                destructiveLabel: "Delete",
                onConfirm: async () => {
                  try {
                    await actions.removeConnection(connId);
                    ui.selectConnection(null);
                  } catch {
                    // Toast already shown by store action
                  }
                },
              });
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
          <Divider />
          <MenuItem
            label="Delete Group"
            destructive
            onClick={() => {
              const groupId = uiState.contextMenu.groupId!;
              const groupName = connState.groups.find((g) => g.id === groupId)?.name || "this group";
              ui.hideContextMenu();
              ui.showConfirmDialog({
                title: `Delete "${groupName}"?`,
                message: "Connections in this group will be ungrouped but not deleted.",
                destructiveLabel: "Delete Group",
                onConfirm: async () => {
                  try {
                    await actions.removeGroup(groupId);
                  } catch {
                    // Toast already shown by store action
                  }
                },
              });
            }}
          />
        </Show>
      </div>
    </Show>
  );
}

function Divider() {
  return <div class="my-1 border-t border-divider" />;
}

function MenuItem(props: {
  label: string;
  onClick?: () => void;
  destructive?: boolean;
  disabled?: boolean;
  hasSubmenu?: boolean;
}) {
  return (
    <button
      type="button"
      disabled={props.disabled}
      onClick={() => props.onClick?.()}
      class={`flex items-center w-full text-left px-3 py-1 text-[12px] cursor-default transition-colors disabled:text-text-tertiary ${
        props.destructive
          ? "text-tag-red hover:bg-tag-red/10"
          : "text-text-primary hover:bg-surface-hover"
      }`}
    >
      <span class="flex-1">{props.label}</span>
      <Show when={props.hasSubmenu}>
        <ChevronRight size={11} class="ml-4 text-text-tertiary" />
      </Show>
    </button>
  );
}
