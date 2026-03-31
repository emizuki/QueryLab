import { createContext, useContext, onMount, type JSX } from "solid-js";
import { createStore, produce } from "solid-js/store";
import {
  createDefaultSSHConfig,
  createDefaultSSLConfig,
  type DatabaseConnection,
} from "../models/connection";
import type { ConnectionGroup } from "../models/group";
import { PRESET_TAGS, type ConnectionTag } from "../models/tag";
import * as storage from "../services/storage";
import { useUI } from "./ui-store";

interface ConnectionStoreState {
  connections: DatabaseConnection[];
  groups: ConnectionGroup[];
  tags: ConnectionTag[];
  loaded: boolean;
}

export interface Credentials {
  password?: string;
  sshPassword?: string;
  sshPassphrase?: string;
}

interface ConnectionStoreActions {
  addConnection(conn: DatabaseConnection, credentials?: Credentials): Promise<void>;
  updateConnection(conn: DatabaseConnection, credentials?: Credentials): Promise<void>;
  removeConnection(id: string): Promise<void>;
  duplicateConnection(id: string): Promise<void>;
  addGroup(group: ConnectionGroup): Promise<void>;
  updateGroup(group: ConnectionGroup): Promise<void>;
  removeGroup(id: string): Promise<void>;
  getTag(id: string | null): ConnectionTag | undefined;
  getGroup(id: string | null): ConnectionGroup | undefined;
  connectionsInGroup(groupId: string): DatabaseConnection[];
  ungroupedConnections(): DatabaseConnection[];
}

type ConnectionStore = [ConnectionStoreState, ConnectionStoreActions];

const ConnectionContext = createContext<ConnectionStore>();

function formatError(err: unknown): string {
  return err instanceof Error ? err.message : String(err);
}

export function ConnectionProvider(props: { children: JSX.Element }) {
  const [, ui] = useUI();

  const [state, setState] = createStore<ConnectionStoreState>({
    connections: [],
    groups: [],
    tags: [...PRESET_TAGS],
    loaded: false,
  });

  onMount(async () => {
    try {
      const [connections, groups] = await Promise.all([
        storage.loadConnections(),
        storage.loadGroups(),
      ]);
      setState({ connections, groups, loaded: true });
    } catch (err) {
      console.error("Failed to load data:", err);
      setState("loaded", true);
    }
  });

  const actions: ConnectionStoreActions = {
    async addConnection(conn, credentials) {
      try {
        await storage.saveConnection(conn);
        if (credentials?.password) await storage.savePassword(conn.id, credentials.password);
        if (credentials?.sshPassword) await storage.saveSshPassword(conn.id, credentials.sshPassword);
        if (credentials?.sshPassphrase) await storage.saveSshPassphrase(conn.id, credentials.sshPassphrase);
        setState("connections", (prev) => [...prev, conn]);
      } catch (err) {
        ui.showToast(`Failed to save connection: ${formatError(err)}`);
        throw err;
      }
    },

    async updateConnection(conn, credentials) {
      try {
        await storage.saveConnection(conn);
        if (credentials?.password !== undefined) await storage.savePassword(conn.id, credentials.password || "");
        if (credentials?.sshPassword !== undefined) await storage.saveSshPassword(conn.id, credentials.sshPassword || "");
        if (credentials?.sshPassphrase !== undefined) await storage.saveSshPassphrase(conn.id, credentials.sshPassphrase || "");
        setState(
          "connections",
          (c) => c.id === conn.id,
          conn
        );
      } catch (err) {
        ui.showToast(`Failed to update connection: ${formatError(err)}`);
        throw err;
      }
    },

    async removeConnection(id) {
      try {
        await storage.deleteConnection(id);
        await storage.deletePassword(id);
        setState(
          produce((s) => {
            s.connections = s.connections.filter((c) => c.id !== id);
          })
        );
      } catch (err) {
        ui.showToast(`Failed to delete connection: ${formatError(err)}`);
        throw err;
      }
    },

    async duplicateConnection(id) {
      const original = state.connections.find((c) => c.id === id);
      if (!original) return;
      const copy: DatabaseConnection = {
        ...original,
        id: crypto.randomUUID(),
        name: `${original.name} Copy`,
        sshConfig: { ...createDefaultSSHConfig() },
        sslConfig: { ...createDefaultSSLConfig() },
      };
      await actions.addConnection(copy);
    },

    async addGroup(group) {
      try {
        await storage.saveGroup(group);
        setState("groups", (prev) => [...prev, group]);
      } catch (err) {
        ui.showToast(`Failed to save group: ${formatError(err)}`);
        throw err;
      }
    },

    async updateGroup(group) {
      try {
        await storage.saveGroup(group);
        setState(
          "groups",
          (g) => g.id === group.id,
          group
        );
      } catch (err) {
        ui.showToast(`Failed to update group: ${formatError(err)}`);
        throw err;
      }
    },

    async removeGroup(id) {
      try {
        await storage.deleteGroup(id);
        setState(
          produce((s) => {
            s.groups = s.groups.filter((g) => g.id !== id);
            // Ungroup connections that were in this group
            s.connections.forEach((c) => {
              if (c.groupId === id) c.groupId = null;
            });
          })
        );
      } catch (err) {
        ui.showToast(`Failed to delete group: ${formatError(err)}`);
        throw err;
      }
    },

    getTag(id) {
      if (!id) return undefined;
      return state.tags.find((t) => t.id === id);
    },

    getGroup(id) {
      if (!id) return undefined;
      return state.groups.find((g) => g.id === id);
    },

    connectionsInGroup(groupId) {
      return state.connections.filter((c) => c.groupId === groupId);
    },

    ungroupedConnections() {
      return state.connections.filter((c) => !c.groupId);
    },
  };

  return (
    <ConnectionContext.Provider value={[state, actions]}>
      {props.children}
    </ConnectionContext.Provider>
  );
}

export function useConnections(): ConnectionStore {
  const ctx = useContext(ConnectionContext);
  if (!ctx) throw new Error("useConnections must be used within ConnectionProvider");
  return ctx;
}
