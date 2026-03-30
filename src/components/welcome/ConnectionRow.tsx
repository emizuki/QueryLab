import { Show } from "solid-js";
import type { DatabaseConnection } from "../../models/connection";
import { useConnections } from "../../stores/connection-store";
import { useUI } from "../../stores/ui-store";
import { DatabaseIcon } from "../shared/DatabaseIcon";
import { Badge } from "../shared/Badge";

interface ConnectionRowProps {
  connection: DatabaseConnection;
}

export function ConnectionRow(props: ConnectionRowProps) {
  const [store] = useConnections();
  const [uiState, ui] = useUI();

  const tag = () => store.tags.find((t) => t.id === props.connection.tagId);
  const isSelected = () => uiState.selectedConnectionId === props.connection.id;

  return (
    <div
      class={`flex items-center gap-3 px-3 py-2 rounded-md cursor-default transition-colors ${
        isSelected()
          ? "bg-surface-selected"
          : "hover:bg-surface-hover"
      }`}
      onClick={() => ui.selectConnection(props.connection.id)}
      onDblClick={() => ui.openEditForm(props.connection.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        ui.selectConnection(props.connection.id);
        ui.showContextMenu(e.clientX, e.clientY, props.connection.id);
      }}
    >
      <DatabaseIcon type={props.connection.type} size={20} />
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2">
          <span class="text-[13px] text-text-primary font-medium truncate">
            {props.connection.name || "Untitled"}
          </span>
          <Show when={tag()}>
            {(t) => <Badge label={t().name} color={t().color} />}
          </Show>
        </div>
        <p class="text-[11px] text-text-secondary truncate mt-px">
          {props.connection.host}
          {props.connection.port ? `:${props.connection.port}` : ""}
        </p>
      </div>
    </div>
  );
}
