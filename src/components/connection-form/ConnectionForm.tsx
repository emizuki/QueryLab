import { createSignal, createEffect, Switch, Match } from "solid-js";
import { createStore, produce } from "solid-js/store";
import { useConnections, type Credentials } from "../../stores/connection-store";
import { useUI, type FormTab } from "../../stores/ui-store";
import {
  createDefaultConnection,
  type DatabaseConnection,
  type SSHConfiguration,
  type SSLConfiguration,
} from "../../models/connection";
import { SegmentedControl } from "../shared/SegmentedControl";
import { GeneralTab } from "./GeneralTab";
import { SSHTunnelTab } from "./SSHTunnelTab";
import { SSLTLSTab } from "./SSLTLSTab";
import { AdvancedTab } from "./AdvancedTab";
import { FormFooter } from "./FormFooter";
import * as storage from "../../services/storage";
import { validateConnection, type FormErrors } from "../../validation/connection";

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
  const [errors, setErrors] = createSignal<FormErrors>({});

  const clearError = (key: string) => {
    if (errors()[key]) setErrors((prev) => { const { [key]: _, ...rest } = prev; return rest; });
  };

  const updateField = <K extends keyof DatabaseConnection>(key: K, value: DatabaseConnection[K]) => {
    setConn(produce(s => Object.assign(s, { [key]: value })));
    clearError(key as string);
  };

  const sshErrorKeys: Record<string, string> = {
    host: "sshHost", port: "sshPort", username: "sshUsername", privateKeyPath: "sshPrivateKeyPath",
  };

  const updateSSH = <K extends keyof SSHConfiguration>(key: K, value: SSHConfiguration[K]) => {
    setConn("sshConfig", produce(s => Object.assign(s, { [key]: value })));
    clearError(sshErrorKeys[key as string] ?? key as string);
  };

  const updateSSL = <K extends keyof SSLConfiguration>(key: K, value: SSLConfiguration[K]) => {
    setConn("sslConfig", produce(s => Object.assign(s, { [key]: value })));
  };

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
        // Load credentials from keychain
        storage.loadPassword(editId).then((pw) => {
          if (pw) setPassword(pw);
        });
        storage.loadSshPassword(editId).then((pw) => {
          if (pw) setConn("sshConfig", "password", pw);
        });
        storage.loadSshPassphrase(editId).then((pp) => {
          if (pp) setConn("sshConfig", "passphrase", pp);
        });
      }
    } else {
      setConn(createDefaultConnection());
      setPassword("");
    }
  });

  const handleSave = async () => {
    const validationErrors = validateConnection(conn);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // Switch to the tab containing the first error
      if (validationErrors.name || validationErrors.host || validationErrors.port || validationErrors.database || validationErrors.username) {
        ui.setFormTab("general");
      } else if (Object.keys(validationErrors).some((k) => k.startsWith("ssh"))) {
        ui.setFormTab("ssh");
      }
      return;
    }
    setErrors({});
    const credentials: Credentials = {
      password: password(),
      sshPassword: conn.sshConfig.password,
      sshPassphrase: conn.sshConfig.passphrase,
    };
    if (isEditing()) {
      await actions.updateConnection({ ...conn }, credentials);
    } else {
      await actions.addConnection({ ...conn }, credentials);
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


  return (
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-surface-overlay"
      onClick={(e) => e.stopPropagation()}
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
                errors={errors()}
                onChange={updateField}
                onPasswordChange={setPassword}
              />
            </Match>
            <Match when={uiState.activeFormTab === "ssh"}>
              <SSHTunnelTab
                config={conn.sshConfig}
                errors={errors()}
                onChange={updateSSH}
              />
            </Match>
            <Match when={uiState.activeFormTab === "ssl"}>
              <SSLTLSTab
                config={conn.sslConfig}
                onChange={updateSSL}
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
