import { ChevronRight } from "lucide-solid";
import type { ConnectionGroup } from "../../models/group";
import { useUI } from "../../stores/ui-store";
import { useConnections } from "../../stores/connection-store";

interface GroupHeaderProps {
  group: ConnectionGroup;
}

export function GroupHeader(props: GroupHeaderProps) {
  const [uiState, ui] = useUI();
  const [, actions] = useConnections();

  const isCollapsed = () => !!uiState.collapsedGroupIds[props.group.id];
  const count = () => actions.connectionsInGroup(props.group.id).length;

  return (
    <div
      class="flex items-center gap-2 px-3 py-1.5 cursor-default hover:bg-surface-hover rounded-md"
      onClick={() => ui.toggleGroupCollapsed(props.group.id)}
      onContextMenu={(e) => {
        e.preventDefault();
        ui.showContextMenu(e.clientX, e.clientY, undefined, props.group.id);
      }}
    >
      <ChevronRight
        size={10}
        class={`text-text-tertiary transition-transform ${
          isCollapsed() ? "" : "rotate-90"
        }`}
      />
      <span class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
        {props.group.name}
      </span>
      <span class="text-[10px] text-text-tertiary">{count()}</span>
    </div>
  );
}
