import * as v from "valibot";
import type { DatabaseConnection } from "../models/connection";

export type FormErrors = Record<string, string>;

const required = v.pipe(v.string(), v.nonEmpty());
const port = v.pipe(v.number(), v.minValue(1), v.maxValue(65535));

function check(schema: v.GenericSchema, value: unknown): boolean {
  return v.safeParse(schema, value).success;
}

export function validateConnection(conn: DatabaseConnection): FormErrors {
  const errors: FormErrors = {};

  if (!check(required, conn.name)) errors.name = "Name is required";

  if (conn.type === "sqlite") {
    if (!check(required, conn.database)) errors.database = "File path is required";
  } else {
    if (!check(required, conn.host)) errors.host = "Host is required";
    if (!check(port, conn.port)) errors.port = "Port must be 1\u201365535";
    if (!check(required, conn.username)) errors.username = "Username is required";
  }

  if (conn.sshConfig.enabled) {
    if (!check(required, conn.sshConfig.host)) errors.sshHost = "SSH host is required";
    if (!check(port, conn.sshConfig.port)) errors.sshPort = "Port must be 1\u201365535";
    if (!check(required, conn.sshConfig.username)) errors.sshUsername = "Username is required";
    if (conn.sshConfig.authMethod === "private-key") {
      if (!check(required, conn.sshConfig.privateKeyPath))
        errors.sshPrivateKeyPath = "Private key path is required";
    }
  }

  return errors;
}
