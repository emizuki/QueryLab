import { Show } from "solid-js";
import { TextField } from "../shared/TextField";
import { Select } from "../shared/Select";
import type { SSLConfiguration, SSLMode } from "../../models/connection";

interface SSLTLSTabProps {
  config: SSLConfiguration;
  onChange: <K extends keyof SSLConfiguration>(key: K, value: SSLConfiguration[K]) => void;
}

const sslModeOptions: { value: SSLMode; label: string }[] = [
  { value: "disabled", label: "Disabled" },
  { value: "preferred", label: "Preferred" },
  { value: "required", label: "Required" },
  { value: "verify-ca", label: "Verify CA" },
  { value: "verify-identity", label: "Verify Identity" },
];

export function SSLTLSTab(props: SSLTLSTabProps) {
  return (
    <div class="flex flex-col gap-4 p-4">
      <Select
        label="SSL Mode"
        value={props.config.mode}
        onChange={(v) => props.onChange("mode", v)}
        options={sslModeOptions}
      />

      <Show when={props.config.mode !== "disabled"}>
        <TextField
          label="CA Certificate"
          value={props.config.caCertificatePath}
          onInput={(v) => props.onChange("caCertificatePath", v)}
          placeholder="Path to CA certificate"
        />
        <TextField
          label="Client Certificate"
          value={props.config.clientCertificatePath}
          onInput={(v) => props.onChange("clientCertificatePath", v)}
          placeholder="Path to client certificate"
        />
        <TextField
          label="Client Key"
          value={props.config.clientKeyPath}
          onInput={(v) => props.onChange("clientKeyPath", v)}
          placeholder="Path to client key"
        />
      </Show>
    </div>
  );
}
