import { createSignal, createEffect, onMount, onCleanup, Switch, Match } from "solid-js";
import { createStore } from "solid-js/store";
import { useConnections } from "../../stores/connection-store";
import { useUI, type FormTab } from "../../stores/ui-store";
import {
  createDefaultConnection,
  type DatabaseConnection,
} from "../../models/connection";
import { SegmentedControl } from "../shared/SegmentedControl";
import { GeneralTab } from "./GeneralTab";
import { SSHTunnelTab } from "./SSHTunnelTab";
import { SSLTLSTab } from "./SSLTLSTab";
import { AdvancedTab } from "./AdvancedTab";
import { FormFooter } from "./FormFooter";
import * as storage from "../../services/storage";

const tabOptions: { value: FormTab; label: string }[] = [
  { value: "general", label: "General" },
  { value: "ssh", label: "SSH Tunnel" },
  { value: "ssl", label: "SSL/TLS" },
  { value: "advanced", label: "Advanced" },
];

export function ConnectionForm() {
  const [storeState, actions] = useConnections();
  const [uiState, ui] = useUI();

  const isEditing = () => !!uiState.editingConnectionId;

  const [conn, setConn] = createStore<DatabaseConnection>(
    createDefaultConnection()
  );
  const [password, setPassword] = createSignal("");

  // Load connection data when editing
  createEffect(() => {
    const editId = uiState.editingConnectionId;
    if (editId) {
      const existing = storeState.connections.find((c) => c.id === editId);
      if (existing) {
        setConn({
          ...existing,
          sshConfig: { ...existing.sshConfig },
          sslConfig: { ...existing.sslConfig },
        });
        // Load password from keychain
        storage.loadPassword(editId).then((pw) => {
          if (pw) setPassword(pw);
        });
      }
    } else {
      setConn(createDefaultConnection());
      setPassword("");
    }
  });

  const handleSave = async () => {
    if (isEditing()) {
      await actions.updateConnection({ ...conn }, password());
    } else {
      await actions.addConnection({ ...conn }, password());
    }
    ui.closeForm();
  };

  const handleDelete = async () => {
    if (uiState.editingConnectionId) {
      await actions.removeConnection(uiState.editingConnectionId);
      ui.selectConnection(null);
    }
    ui.closeForm();
  };

  const handleTestConnection = () => {
    // TODO: implement test connection via Rust command
    alert("Connection test not yet implemented");
  };

  // Close on Escape
  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Escape") ui.closeForm();
  };

  onMount(() => document.addEventListener("keydown", handleKeyDown));
  onCleanup(() => document.removeEventListener("keydown", handleKeyDown));

  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay"
      onClick={(e) => {
        if (e.target === e.currentTarget) ui.closeForm();
      }}
    >
      <div class="w-120 max-h-130 flex flex-col rounded-xl bg-surface-dialog backdrop-blur-2xl border border-border shadow-2xl overflow-hidden">
        {/* Title */}
        <div class="flex items-center justify-between px-4 pt-3 pb-2">
          <h2 class="text-[13px] font-semibold text-text-primary">
            {isEditing() ? "Edit Connection" : "New Connection"}
          </h2>
        </div>

        {/* Tab Bar */}
        <div class="px-4 pb-2">
          <SegmentedControl
            value={uiState.activeFormTab}
            onChange={(v) => ui.setFormTab(v)}
            options={tabOptions}
          />
        </div>

        {/* Tab Content */}
        <div class="flex-1 overflow-y-auto">
          <Switch>
            <Match when={uiState.activeFormTab === "general"}>
              <GeneralTab
                connection={conn}
                password={password()}
                onChange={(key, value) => setConn(key as any, value as any)}
                onPasswordChange={setPassword}
              />
            </Match>
            <Match when={uiState.activeFormTab === "ssh"}>
              <SSHTunnelTab
                config={conn.sshConfig}
                onChange={(key, value) =>
                  setConn("sshConfig", key as any, value as any)
                }
              />
            </Match>
            <Match when={uiState.activeFormTab === "ssl"}>
              <SSLTLSTab
                config={conn.sslConfig}
                onChange={(key, value) =>
                  setConn("sslConfig", key as any, value as any)
                }
              />
            </Match>
            <Match when={uiState.activeFormTab === "advanced"}>
              <AdvancedTab />
            </Match>
          </Switch>
        </div>

        {/* Footer */}
        <FormFooter
          isEditing={isEditing()}
          onTestConnection={handleTestConnection}
          onDelete={handleDelete}
          onCancel={() => ui.closeForm()}
          onSave={handleSave}
        />
      </div>
    </div>
  );
}
