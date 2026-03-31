import { createContext, useContext, type JSX } from "solid-js";
import { createStore } from "solid-js/store";

export type FormTab = "general" | "ssh" | "ssl" | "advanced";
export type ToastType = "error" | "info";

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
  toast: {
    visible: boolean;
    message: string;
    type: ToastType;
  };
  confirmDialog: {
    visible: boolean;
    title: string;
    message: string;
    destructiveLabel: string;
  };
  inputDialog: {
    visible: boolean;
    title: string;
    placeholder: string;
    confirmLabel: string;
  };
}

interface ConfirmDialogOptions {
  title: string;
  message: string;
  destructiveLabel: string;
  onConfirm: () => void;
}

interface InputDialogOptions {
  title: string;
  placeholder: string;
  confirmLabel: string;
  onConfirm: (value: string) => void;
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
  showToast(message: string, type?: ToastType): void;
  dismissToast(): void;
  showConfirmDialog(opts: ConfirmDialogOptions): void;
  hideConfirmDialog(): void;
  executeConfirm(): void;
  showInputDialog(opts: InputDialogOptions): void;
  hideInputDialog(): void;
  executeInput(value: string): void;
}

type UIStore = [UIStoreState, UIStoreActions];

const UIContext = createContext<UIStore>();

export function UIProvider(props: { children: JSX.Element }) {
  let pendingConfirmCallback: (() => void) | null = null;
  let pendingInputCallback: ((value: string) => void) | null = null;
  let toastTimerId: ReturnType<typeof setTimeout> | null = null;

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
    toast: {
      visible: false,
      message: "",
      type: "error" as ToastType,
    },
    confirmDialog: {
      visible: false,
      title: "",
      message: "",
      destructiveLabel: "Delete",
    },
    inputDialog: {
      visible: false,
      title: "",
      placeholder: "",
      confirmLabel: "OK",
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

    showToast(message, type = "error") {
      if (toastTimerId) clearTimeout(toastTimerId);
      setState("toast", { visible: true, message, type });
      toastTimerId = setTimeout(() => {
        setState("toast", "visible", false);
        toastTimerId = null;
      }, 3500);
    },

    dismissToast() {
      if (toastTimerId) {
        clearTimeout(toastTimerId);
        toastTimerId = null;
      }
      setState("toast", "visible", false);
    },

    showConfirmDialog(opts) {
      pendingConfirmCallback = opts.onConfirm;
      setState("confirmDialog", {
        visible: true,
        title: opts.title,
        message: opts.message,
        destructiveLabel: opts.destructiveLabel,
      });
    },

    hideConfirmDialog() {
      pendingConfirmCallback = null;
      setState("confirmDialog", "visible", false);
    },

    executeConfirm() {
      pendingConfirmCallback?.();
      pendingConfirmCallback = null;
      setState("confirmDialog", "visible", false);
    },

    showInputDialog(opts) {
      pendingInputCallback = opts.onConfirm;
      setState("inputDialog", {
        visible: true,
        title: opts.title,
        placeholder: opts.placeholder,
        confirmLabel: opts.confirmLabel,
      });
    },

    hideInputDialog() {
      pendingInputCallback = null;
      setState("inputDialog", "visible", false);
    },

    executeInput(value) {
      pendingInputCallback?.(value);
      pendingInputCallback = null;
      setState("inputDialog", "visible", false);
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
