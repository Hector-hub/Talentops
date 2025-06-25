import { Config } from "../config";

// Namespace para adapters externos
export namespace Adapters {
  // Interfaces principales del ejercicio
  export interface EmailAdapter {
    sendEmail(to: string, template: string, data: any): Promise<void>;
  }

  export interface CacheAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
  }

  // Implementación de SendGrid EmailAdapter del ejercicio
  export class SendGridEmailAdapter implements EmailAdapter {
    constructor(private config: Config.EmailConfig) {}

    async sendEmail(to: string, template: string, data: any): Promise<void> {
      console.log(
        `[SENDGRID] Sending email to ${to} using template ${template}`
      );
      console.log(`[SENDGRID] Data:`, data);
    }
  }

  // Implementación de Redis CacheAdapter del ejercicio
  export class RedisAdapter implements CacheAdapter {
    constructor(private config: Config.RedisConfig) {}

    async get<T>(key: string): Promise<T | null> {
      console.log(`[REDIS] Getting key: ${key}`);
      return null;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
      console.log(
        `[REDIS] Caching ${key} for ${ttl || this.config.ttl} seconds`
      );
    }

    async delete(key: string): Promise<void> {
      console.log(`[REDIS] Deleting cache key: ${key}`);
    }
  }
  // Email adapter interface
  export interface IEmailAdapter {
    sendEmail(to: string, subject: string, body: string): Promise<boolean>;
  }

  // Logger adapter interface
  export interface ILoggerAdapter {
    info(message: string, data?: any): void;
    error(message: string, error?: Error): void;
    warn(message: string, data?: any): void;
  }

  // Cache adapter interface
  export interface ICacheAdapter {
    get<T>(key: string): Promise<T | null>;
    set<T>(key: string, value: T, ttl?: number): Promise<void>;
    delete(key: string): Promise<void>;
  }

  // Implementación de EmailAdapter
  export class ConsoleEmailAdapter implements IEmailAdapter {
    async sendEmail(
      to: string,
      subject: string,
      body: string
    ): Promise<boolean> {
      console.log(`[EMAIL] To: ${to}`);
      console.log(`[EMAIL] Subject: ${subject}`);
      console.log(`[EMAIL] Body: ${body}`);
      return true;
    }
  }

  // Implementación de LoggerAdapter
  export class ConsoleLoggerAdapter implements ILoggerAdapter {
    info(message: string, data?: any): void {
      console.log(`[INFO] ${message}`, data || "");
    }

    error(message: string, error?: Error): void {
      console.error(`[ERROR] ${message}`, error?.message || "");
    }

    warn(message: string, data?: any): void {
      console.warn(`[WARN] ${message}`, data || "");
    }
  }

  // Implementación de CacheAdapter
  export class InMemoryCacheAdapter implements ICacheAdapter {
    private cache: Map<string, { value: any; expiry?: number }> = new Map();

    async get<T>(key: string): Promise<T | null> {
      const item = this.cache.get(key);
      if (!item) return null;

      if (item.expiry && item.expiry < Date.now()) {
        this.cache.delete(key);
        return null;
      }

      return item.value as T;
    }

    async set<T>(key: string, value: T, ttl?: number): Promise<void> {
      const expiry = ttl ? Date.now() + ttl * 1000 : undefined;
      this.cache.set(key, { value, expiry });
      console.log(`[CACHE] Set: ${key}`);
    }

    async delete(key: string): Promise<void> {
      this.cache.delete(key);
      console.log(`[CACHE] Deleted: ${key}`);
    }
  }

  // Factory functions
  export function createEmailAdapter(): IEmailAdapter {
    return new ConsoleEmailAdapter();
  }

  export function createLoggerAdapter(): ILoggerAdapter {
    return new ConsoleLoggerAdapter();
  }

  export function createCacheAdapter(): ICacheAdapter {
    return new InMemoryCacheAdapter();
  }
}
