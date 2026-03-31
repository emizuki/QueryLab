import { For, Show, createMemo } from "solid-js";
import { Plus, FolderPlus, Database } from "lucide-solid";
import { useConnections } from "../../stores/connection-store";
import { useUI } from "../../stores/ui-store";
import { SearchBar } from "../shared/SearchBar";
import { ConnectionRow } from "./ConnectionRow";
import { GroupHeader } from "./GroupHeader";

export function ConnectionList() {
  const [store, actions] = useConnections();
  const [uiState, ui] = useUI();

  const filteredConnections = createMemo(() => {
    const q = uiState.searchText.toLowerCase();
    if (!q) return store.connections;
    return store.connections.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.host.toLowerCase().includes(q) ||
        c.database.toLowerCase().includes(q)
    );
  });

  const ungrouped = createMemo(() =>
    filteredConnections().filter((c) => !c.groupId)
  );

  const groupedSections = createMemo(() =>
    store.groups
      .map((g) => ({
        group: g,
        connections: filteredConnections().filter((c) => c.groupId === g.id),
      }))
      .filter((s) => s.connections.length > 0)
  );

  return (
    <div class="flex flex-col flex-1 min-h-0">
      {/* Toolbar */}
      <div class="flex items-center gap-2 px-3 py-2">
        {/* New connection */}
        <button
          type="button"
          onClick={() => ui.openCreateForm()}
          class="flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="New connection"
        >
          <Plus size={14} />
        </button>
        {/* New group */}
        <button
          type="button"
          onClick={() => {
            ui.showInputDialog({
              title: "New Group",
              placeholder: "Group name",
              confirmLabel: "Create",
              onConfirm: (name) => {
                actions.addGroup({
                  id: crypto.randomUUID(),
                  name,
                  color: "gray",
                });
              },
            });
          }}
          class="flex items-center justify-center w-7 h-7 rounded-md text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors"
          title="New group"
        >
          <FolderPlus size={14} />
        </button>
        <SearchBar
          value={uiState.searchText}
          onInput={(v) => ui.setSearchText(v)}
        />
      </div>

      {/* Connection list */}
      <div class="flex-1 overflow-y-auto px-1.5 pb-2">
        <Show
          when={filteredConnections().length > 0}
          fallback={
            <div class="flex flex-col items-center justify-center h-full text-text-tertiary">
              <Database size={32} class="mb-2 opacity-50" />
              <p class="text-[12px]">
                {uiState.searchText ? "No matching connections" : "No connections"}
              </p>
            </div>
          }
        >
          {/* Ungrouped connections */}
          <For each={ungrouped()}>
            {(conn) => <ConnectionRow connection={conn} />}
          </For>

          {/* Grouped sections */}
          <For each={groupedSections()}>
            {(section) => (
              <div class="mt-1">
                <GroupHeader group={section.group} />
                <Show when={!uiState.collapsedGroupIds[section.group.id]}>
                  <div class="ml-2">
                    <For each={section.connections}>
                      {(conn) => <ConnectionRow connection={conn} />}
                    </For>
                  </div>
                </Show>
              </div>
            )}
          </For>
        </Show>
      </div>
    </div>
  );
}
