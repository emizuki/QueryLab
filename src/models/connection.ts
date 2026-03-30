import type { DatabaseType } from "./database-type";
import { DATABASE_DEFAULTS } from "./database-type";

export type ConnectionColor =
  | "none" | "red" | "orange" | "yellow" | "green"
  | "blue" | "purple" | "pink" | "gray";

export const CONNECTION_COLORS: Record<ConnectionColor, string> = {
  none: "transparent",
  red: "#FF3B30",
  orange: "#FF9500",
  yellow: "#FFCC00",
  green: "#34C759",
  blue: "#007AFF",
  purple: "#AF52DE",
  pink: "#FF2D55",
  gray: "#8E8E93",
};

export type SSHAuthMethod = "password" | "private-key" | "ssh-agent";
export type SSLMode = "disabled" | "preferred" | "required" | "verify-ca" | "verify-identity";

export interface SSHConfiguration {
  enabled: boolean;
  host: string;
  port: number;
  username: string;
  authMethod: SSHAuthMethod;
  password: string;
  privateKeyPath: string;
  passphrase: string;
  agentSocketPath: string;
}

export interface SSLConfiguration {
  mode: SSLMode;
  caCertificatePath: string;
  clientCertificatePath: string;
  clientKeyPath: string;
}

export interface DatabaseConnection {
  id: string;
  name: string;
  type: DatabaseType;
  host: string;
  port: number;
  database: string;
  username: string;
  color: ConnectionColor;
  tagId: string | null;
  groupId: string | null;
  usePgpass: boolean;
  sshConfig: SSHConfiguration;
  sslConfig: SSLConfiguration;
}

export function createDefaultSSHConfig(): SSHConfiguration {
  return {
    enabled: false,
    host: "",
    port: 22,
    username: "",
    authMethod: "password",
    password: "",
    privateKeyPath: "",
    passphrase: "",
    agentSocketPath: "",
  };
}

export function createDefaultSSLConfig(): SSLConfiguration {
  return {
    mode: "disabled",
    caCertificatePath: "",
    clientCertificatePath: "",
    clientKeyPath: "",
  };
}

export function createDefaultConnection(type: DatabaseType = "postgresql"): DatabaseConnection {
  const defaults = DATABASE_DEFAULTS[type];
  return {
    id: crypto.randomUUID(),
    name: "",
    type,
    host: "localhost",
    port: defaults.defaultPort,
    database: "",
    username: "",
    color: "none",
    tagId: null,
    groupId: null,
    usePgpass: false,
    sshConfig: createDefaultSSHConfig(),
    sslConfig: createDefaultSSLConfig(),
  };
}
