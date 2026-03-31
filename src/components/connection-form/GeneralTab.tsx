import { Show } from "solid-js";
import { Link } from "lucide-solid";
import { TextField } from "../shared/TextField";
import { SecureField } from "../shared/SecureField";
import { Select } from "../shared/Select";
import { Toggle } from "../shared/Toggle";
import { ColorPicker } from "../shared/ColorPicker";
import type { DatabaseConnection } from "../../models/connection";
import type { DatabaseType } from "../../models/database-type";
import { DATABASE_DEFAULTS } from "../../models/database-type";
import { PRESET_TAGS } from "../../models/tag";
import { useConnections } from "../../stores/connection-store";

interface GeneralTabProps {
  connection: DatabaseConnection;
  password: string;
  onChange: <K extends keyof DatabaseConnection>(key: K, value: DatabaseConnection[K]) => void;
  onPasswordChange: (password: string) => void;
}

const dbTypeOptions = Object.entries(DATABASE_DEFAULTS).map(([value, info]) => ({
  value: value as DatabaseType,
  label: info.label,
}));

const tagOptions = [
  { value: "", label: "None" },
  ...PRESET_TAGS.map((t) => ({ value: t.id, label: t.name })),
];

export function GeneralTab(props: GeneralTabProps) {
  const [store] = useConnections();

  const groupOptions = () => [
    { value: "", label: "None" },
    ...store.groups.map((g) => ({ value: g.id, label: g.name })),
  ];

  return (
    <div class="flex flex-col gap-4 p-4">
      {/* Database Type */}
      <Select
        label="Database"
        value={props.connection.type}
        onChange={(v) => {
          props.onChange("type", v);
          props.onChange("port", DATABASE_DEFAULTS[v].defaultPort);
        }}
        options={dbTypeOptions}
      />

      {/* Name */}
      <TextField
        label="Name"
        value={props.connection.name}
        onInput={(v) => props.onChange("name", v)}
        placeholder="Connection name"
      />

      <Show when={props.connection.type === "sqlite"}>
        {/* SQLite: File Path */}
        <div class="flex flex-col gap-3">
          <h3 class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Database File
          </h3>
          <TextField
            label="File Path"
            value={props.connection.database}
            onInput={(v) => props.onChange("database", v)}
            placeholder="/path/to/database.db"
          />
        </div>
      </Show>

      <Show when={props.connection.type !== "sqlite"}>
        {/* Import from URL */}
        <button
          type="button"
          class="self-start text-[12px] text-accent hover:underline cursor-default flex items-center gap-1"
          onClick={() => {
            const url = prompt("Paste connection URL:");
            if (url) {
              // TODO: parse connection URL
            }
          }}
        >
          <Link size={12} />
          Import from URL
        </button>

        {/* Connection Section */}
        <div class="flex flex-col gap-3">
          <h3 class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Connection
          </h3>
          <TextField
            label="Host"
            value={props.connection.host}
            onInput={(v) => props.onChange("host", v)}
            placeholder="localhost"
          />
          <div class="flex gap-3">
            <TextField
              label="Port"
              value={String(props.connection.port)}
              onInput={(v) => props.onChange("port", parseInt(v) || 0)}
              type="number"
              class="w-24"
            />
            <TextField
              label="Database"
              value={props.connection.database}
              onInput={(v) => props.onChange("database", v)}
              placeholder="database name"
              class="flex-1"
            />
          </div>
        </div>

        {/* Authentication Section */}
        <div class="flex flex-col gap-3">
          <h3 class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
            Authentication
          </h3>
          <TextField
            label="Username"
            value={props.connection.username}
            onInput={(v) => props.onChange("username", v)}
            placeholder="username"
          />
          {props.connection.type === "postgresql" && (
            <Toggle
              label="Use ~/.pgpass"
              checked={props.connection.usePgpass}
              onChange={(v) => props.onChange("usePgpass", v)}
            />
          )}
          <SecureField
            label="Password"
            value={props.password}
            onInput={props.onPasswordChange}
            placeholder="password"
          />
        </div>
      </Show>

      {/* Appearance Section */}
      <div class="flex flex-col gap-3">
        <h3 class="text-[11px] font-semibold text-text-secondary uppercase tracking-wider">
          Appearance
        </h3>
        <div class="flex flex-col gap-1">
          <label class="text-xs text-text-secondary">Color</label>
          <ColorPicker
            value={props.connection.color}
            onChange={(v) => props.onChange("color", v)}
          />
        </div>
        <Select
          label="Tag"
          value={props.connection.tagId ?? ""}
          onChange={(v) => props.onChange("tagId", v || null)}
          options={tagOptions}
        />
        <Select
          label="Group"
          value={props.connection.groupId ?? ""}
          onChange={(v) => props.onChange("groupId", v || null)}
          options={groupOptions()}
        />
      </div>
    </div>
  );
}
