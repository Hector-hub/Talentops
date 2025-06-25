// Namespace para configuración del sistema
export namespace Config {
  export interface DatabaseConfig {
    url: string;
    maxConnections: number;
    timeout: number;
  }

  export interface RedisConfig {
    url: string;
    ttl: number;
  }

  export interface EmailConfig {
    apiKey: string;
    fromAddress: string;
    templates: {
      welcome: string;
      passwordReset: string;
    };
  }

  export interface AppConfig {
    port: number;
    environment: "development" | "production" | "test";
    apiVersion: string;
    database: DatabaseConfig;
    redis: RedisConfig;
    email: EmailConfig;
    jwt: {
      secret: string;
      expiresIn: string;
    };
  }

  export interface EventsConfig {
    enableLogging: boolean;
    maxRetries: number;
  }

  export function loadAppConfig(): Omit<
    AppConfig,
    "database" | "redis" | "email" | "jwt"
  > {
    return {
      port: parseInt(process.env.PORT || "3000"),
      environment: (process.env.NODE_ENV as any) || "development",
      apiVersion: process.env.API_VERSION || "v1",
    };
  }

  export function loadDatabaseConfig(): DatabaseConfig {
    return {
      url:
        process.env.DATABASE_URL || "postgresql://localhost:5432/enterprise_db",
      maxConnections: parseInt(process.env.DB_MAX_CONNECTIONS || "10"),
      timeout: parseInt(process.env.DB_TIMEOUT || "5000"),
    };
  }

  export function loadRedisConfig(): RedisConfig {
    return {
      url: process.env.REDIS_URL || "redis://localhost:6379",
      ttl: parseInt(process.env.REDIS_TTL || "3600"),
    };
  }

  export function loadEmailConfig(): EmailConfig {
    return {
      apiKey: process.env.EMAIL_SERVICE_API_KEY || "dummy-api-key",
      fromAddress: process.env.EMAIL_FROM_ADDRESS || "noreply@example.com",
      templates: {
        welcome: "welcome-template",
        passwordReset: "password-reset-template",
      },
    };
  }

  export function loadEventsConfig(): EventsConfig {
    return {
      enableLogging: process.env.EVENTS_LOGGING === "true",
      maxRetries: parseInt(process.env.EVENTS_MAX_RETRIES || "3"),
    };
  }

  export function loadConfig(): AppConfig {
    return {
      ...loadAppConfig(),
      database: loadDatabaseConfig(),
      redis: loadRedisConfig(),
      email: loadEmailConfig(),
      jwt: {
        secret: process.env.JWT_SECRET || "default-secret",
        expiresIn: process.env.JWT_EXPIRES_IN || "24h",
      },
    };
  }

  export function loadAllConfigs() {
    return {
      app: loadAppConfig(),
      database: loadDatabaseConfig(),
      redis: loadRedisConfig(),
      email: loadEmailConfig(),
      events: loadEventsConfig(),
    };
  }
}
