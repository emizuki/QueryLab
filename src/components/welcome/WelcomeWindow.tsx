import { onMount, onCleanup } from "solid-js";
import { LeftPanel } from "./LeftPanel";
import { ConnectionList } from "./ConnectionList";
import { ContextMenu } from "./ContextMenu";
import { useUI } from "../../stores/ui-store";
import { useConnections } from "../../stores/connection-store";

export function WelcomeWindow() {
  const [uiState, ui] = useUI();
  const [store, actions] = useConnections();

  const handleKeyDown = (e: KeyboardEvent) => {
    // Cmd+N: new connection
    if (e.metaKey && e.key === "n") {
      e.preventDefault();
      ui.openCreateForm();
      return;
    }

    // Arrow key navigation
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      const conns = store.connections;
      if (conns.length === 0) return;
      const currentIdx = conns.findIndex((c) => c.id === uiState.selectedConnectionId);
      let nextIdx: number;
      if (e.key === "ArrowDown") {
        nextIdx = currentIdx < conns.length - 1 ? currentIdx + 1 : 0;
      } else {
        nextIdx = currentIdx > 0 ? currentIdx - 1 : conns.length - 1;
      }
      ui.selectConnection(conns[nextIdx].id);
    }

    // Enter: edit selected connection
    if (e.key === "Enter" && uiState.selectedConnectionId) {
      e.preventDefault();
      ui.openEditForm(uiState.selectedConnectionId);
    }

    // Backspace/Delete: delete selected
    if ((e.key === "Backspace" || e.key === "Delete") && e.metaKey && uiState.selectedConnectionId) {
      e.preventDefault();
      const connId = uiState.selectedConnectionId;
      const connName = store.connections.find((c) => c.id === connId)?.name || "this connection";
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
    }
  };

  onMount(() => document.addEventListener("keydown", handleKeyDown));
  onCleanup(() => document.removeEventListener("keydown", handleKeyDown));

  return (
    <div class="flex h-screen">
      {/* Titlebar drag region */}
      <div
        data-tauri-drag-region
        class="fixed top-0 left-0 right-0 h-[30px] z-40"
      />

      {/* Left Panel - Branding */}
      <LeftPanel />

      {/* Divider */}
      <div class="w-px bg-divider" />

      {/* Right Panel - Connection List */}
      <div class="flex flex-col flex-1 min-w-0 pt-[30px]">
        <ConnectionList />
      </div>

      {/* Context Menu Overlay */}
      <ContextMenu />
    </div>
  );
}
