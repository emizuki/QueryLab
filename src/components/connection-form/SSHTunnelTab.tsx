import { Show } from "solid-js";
import { TextField } from "../shared/TextField";
import { SecureField } from "../shared/SecureField";
import { Select } from "../shared/Select";
import { Toggle } from "../shared/Toggle";
import type { SSHConfiguration } from "../../models/connection";
import type { SSHAuthMethod } from "../../models/connection";
import type { FormErrors } from "../../validation/connection";

interface SSHTunnelTabProps {
  config: SSHConfiguration;
  errors: FormErrors;
  onChange: <K extends keyof SSHConfiguration>(key: K, value: SSHConfiguration[K]) => void;
}

const authMethodOptions: { value: SSHAuthMethod; label: string }[] = [
  { value: "password", label: "Password" },
  { value: "private-key", label: "Private Key" },
  { value: "ssh-agent", label: "SSH Agent" },
];

export function SSHTunnelTab(props: SSHTunnelTabProps) {
  return (
    <div class="flex flex-col gap-4 p-4">
      <Toggle
        label="Enable SSH Tunnel"
        checked={props.config.enabled}
        onChange={(v) => props.onChange("enabled", v)}
      />

      <Show when={props.config.enabled}>
        <TextField
          label="SSH Host"
          value={props.config.host}
          onInput={(v) => props.onChange("host", v)}
          placeholder="ssh.example.com"
          error={props.errors.sshHost}
        />
        <div class="flex gap-3">
          <TextField
            label="Port"
            value={String(props.config.port)}
            onInput={(v) => props.onChange("port", parseInt(v) || 22)}
            type="number"
            class="w-24"
            error={props.errors.sshPort}
          />
          <TextField
            label="Username"
            value={props.config.username}
            onInput={(v) => props.onChange("username", v)}
            placeholder="ssh user"
            class="flex-1"
            error={props.errors.sshUsername}
          />
        </div>

        <Select
          label="Authentication"
          value={props.config.authMethod}
          onChange={(v) => props.onChange("authMethod", v)}
          options={authMethodOptions}
        />

        <Show when={props.config.authMethod === "password"}>
          <SecureField
            label="SSH Password"
            value={props.config.password}
            onInput={(v) => props.onChange("password", v)}
            placeholder="SSH password"
          />
        </Show>

        <Show when={props.config.authMethod === "private-key"}>
          <TextField
            label="Private Key Path"
            value={props.config.privateKeyPath}
            onInput={(v) => props.onChange("privateKeyPath", v)}
            placeholder="~/.ssh/id_rsa"
            error={props.errors.sshPrivateKeyPath}
          />
          <SecureField
            label="Passphrase"
            value={props.config.passphrase}
            onInput={(v) => props.onChange("passphrase", v)}
            placeholder="Key passphrase (optional)"
          />
        </Show>

        <Show when={props.config.authMethod === "ssh-agent"}>
          <TextField
            label="Agent Socket Path"
            value={props.config.agentSocketPath}
            onInput={(v) => props.onChange("agentSocketPath", v)}
            placeholder="Leave empty for default"
          />
        </Show>
      </Show>
    </div>
  );
}
