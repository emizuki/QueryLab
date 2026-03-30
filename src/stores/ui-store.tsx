import { createContext, useContext, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

export type FormTab = "general" | "ssh" | "ssl" | "advanced";

interface UIStoreState {
  searchText: string;
  selectedConnectionId: string | null;
  collapsedGroupIds: Record<string, boolean>;
  showConnectionForm: boolean;
  editingConnectionId: string | null;
  activeFormTab: FormTab;
  contextMenu: {
    visible: boolean;
    x: number;
    y: number;
    connectionId: string | null;
    groupId: string | null;
  };
}

interface UIStoreActions {
  setSearchText(text: string): void;
  selectConnection(id: string | null): void;
  toggleGroupCollapsed(groupId: string): void;
  openCreateForm(): void;
  openEditForm(connectionId: string): void;
  closeForm(): void;
  setFormTab(tab: FormTab): void;
  showContextMenu(x: number, y: number, connectionId?: string, groupId?: string): void;
  hideContextMenu(): void;
}

type UIStore = [UIStoreState, UIStoreActions];

const UIContext = createContext<UIStore>();

export function UIProvider(props: { children: JSX.Element }) {
  const [state, setState] = createStore<UIStoreState>({
    searchText: "",
    selectedConnectionId: null,
    collapsedGroupIds: {} as Record<string, boolean>,
    showConnectionForm: false,
    editingConnectionId: null,
    activeFormTab: "general",
    contextMenu: {
      visible: false,
      x: 0,
      y: 0,
      connectionId: null,
      groupId: null,
    },
  });

  const actions: UIStoreActions = {
    setSearchText(text) {
      setState("searchText", text);
    },

    selectConnection(id) {
      setState("selectedConnectionId", id);
    },

    toggleGroupCollapsed(groupId) {
      setState("collapsedGroupIds", groupId, (prev) => !prev);
    },

    openCreateForm() {
      setState({
        showConnectionForm: true,
        editingConnectionId: null,
        activeFormTab: "general",
      });
    },

    openEditForm(connectionId) {
      setState({
        showConnectionForm: true,
        editingConnectionId: connectionId,
        activeFormTab: "general",
      });
    },

    closeForm() {
      setState({
        showConnectionForm: false,
        editingConnectionId: null,
      });
    },

    setFormTab(tab) {
      setState("activeFormTab", tab);
    },

    showContextMenu(x, y, connectionId, groupId) {
      setState("contextMenu", {
        visible: true,
        x,
        y,
        connectionId: connectionId ?? null,
        groupId: groupId ?? null,
      });
    },

    hideContextMenu() {
      setState("contextMenu", "visible", false);
    },
  };

  return (
    <UIContext.Provider value={[state, actions]}>
      {props.children}
    </UIContext.Provider>
  );
}

export function useUI(): UIStore {
  const ctx = useContext(UIContext);
  if (!ctx) throw new Error("useUI must be used within UIProvider");
  return ctx;
}
