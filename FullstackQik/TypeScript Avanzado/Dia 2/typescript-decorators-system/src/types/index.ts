export interface ValidationSchema {
  validate(data: any): { error: { message: string } | null };
}

export interface CacheOptions {
  ttl: number;
  keyGenerator?: (...args: any[]) => string;
}

export interface LogOptions {
  level: 'debug' | 'info' | 'warn' | 'error';
}

export interface RetryOptions {
  attempts: number;
  delay: number;
  backoff?: number;
}

export interface TransactionOptions {
  isolationLevel?: 'READ_UNCOMMITTED' | 'READ_COMMITTED' | 'REPEATABLE_READ' | 'SERIALIZABLE';
  timeout?: number;
}

export interface DatabaseConnection {
  beginTransaction(): Promise<Transaction>;
  query(sql: string, params?: any[]): Promise<any>;
}

export interface Transaction {
  id: string;
  commit(): Promise<void>;
  rollback(): Promise<void>;
  query(sql: string, params?: any[]): Promise<any>;
}