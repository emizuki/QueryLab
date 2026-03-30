import { createContext, useContext, onMount, type JSX } from "solid-js";
import { createStore, produce } from "solid-js/store";
import type { DatabaseConnection } from "../models/connection";
import type { ConnectionGroup } from "../models/group";
import { PRESET_TAGS, type ConnectionTag } from "../models/tag";
import * as storage from "../services/storage";

interface ConnectionStoreState {
  connections: DatabaseConnection[];
  groups: ConnectionGroup[];
  tags: ConnectionTag[];
  loaded: boolean;
}

interface ConnectionStoreActions {
  addConnection(conn: DatabaseConnection, password?: string): Promise<void>;
  updateConnection(conn: DatabaseConnection, password?: string): Promise<void>;
  removeConnection(id: string): Promise<void>;
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

export function ConnectionProvider(props: { children: JSX.Element }) {
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
    async addConnection(conn, password) {
      await storage.saveConnection(conn);
      if (password) await storage.savePassword(conn.id, password);
      setState("connections", (prev) => [...prev, conn]);
    },

    async updateConnection(conn, password) {
      await storage.saveConnection(conn);
      if (password !== undefined) await storage.savePassword(conn.id, password || "");
      setState(
        "connections",
        (c) => c.id === conn.id,
        conn
      );
    },

    async removeConnection(id) {
      await storage.deleteConnection(id);
      setState(
        produce((s) => {
          s.connections = s.connections.filter((c) => c.id !== id);
        })
      );
    },

    async addGroup(group) {
      await storage.saveGroup(group);
      setState("groups", (prev) => [...prev, group]);
    },

    async updateGroup(group) {
      await storage.saveGroup(group);
      setState(
        "groups",
        (g) => g.id === group.id,
        group
      );
    },

    async removeGroup(id) {
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
