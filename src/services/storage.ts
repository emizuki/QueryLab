import { invoke } from "@tauri-apps/api/core";
import type { DatabaseConnection } from "../models/connection";
import type { ConnectionGroup } from "../models/group";

export async function loadConnections(): Promise<DatabaseConnection[]> {
  return invoke("load_connections");
}

export async function saveConnection(connection: DatabaseConnection): Promise<void> {
  return invoke("save_connection", { connection });
}

export async function deleteConnection(id: string): Promise<void> {
  return invoke("delete_connection", { id });
}

export async function loadGroups(): Promise<ConnectionGroup[]> {
  return invoke("load_groups");
}

export async function saveGroup(group: ConnectionGroup): Promise<void> {
  return invoke("save_group", { group });
}

export async function deleteGroup(id: string): Promise<void> {
  return invoke("delete_group", { id });
}

export async function savePassword(connectionId: string, password: string): Promise<void> {
  return invoke("save_password", { connectionId, password });
}

export async function loadPassword(connectionId: string): Promise<string | null> {
  return invoke("load_password", { connectionId });
}
