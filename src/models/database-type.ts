export type DatabaseType = "postgresql" | "mysql" | "mariadb" | "sqlite" | "redis" | "mongodb";

export interface DatabaseTypeInfo {
  label: string;
  defaultPort: number;
  requiresAuth: boolean;
}

export const DATABASE_DEFAULTS: Record<DatabaseType, DatabaseTypeInfo> = {
  postgresql: { label: "PostgreSQL", defaultPort: 5432, requiresAuth: true },
  mysql: { label: "MySQL", defaultPort: 3306, requiresAuth: true },
  mariadb: { label: "MariaDB", defaultPort: 3306, requiresAuth: true },
  sqlite: { label: "SQLite", defaultPort: 0, requiresAuth: false },
  redis: { label: "Redis", defaultPort: 6379, requiresAuth: false },
  mongodb: { label: "MongoDB", defaultPort: 27017, requiresAuth: true },
};
