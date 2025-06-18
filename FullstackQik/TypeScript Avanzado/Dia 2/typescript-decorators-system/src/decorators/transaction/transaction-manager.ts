import {
  DatabaseConnection,
  Transaction,
  TransactionOptions,
} from "../../types";

// Simulamos una conexión de base de datos
class MockTransaction implements Transaction {
  public id: string;
  private isCommitted = false;
  private isRolledBack = false;

  constructor() {
    this.id = `tx_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  async commit(): Promise<void> {
    if (this.isRolledBack) {
      throw new Error("Cannot commit a rolled back transaction");
    }
    this.isCommitted = true;
    console.log(`[TRANSACTION] Transaction ${this.id} committed`);
  }

  async rollback(): Promise<void> {
    if (this.isCommitted) {
      throw new Error("Cannot rollback a committed transaction");
    }
    this.isRolledBack = true;
    console.log(`[TRANSACTION] Transaction ${this.id} rolled back`);
  }

  async query(sql: string, params?: any[]): Promise<any> {
    if (this.isCommitted || this.isRolledBack) {
      throw new Error("Cannot execute query on closed transaction");
    }
    console.log(
      `[TRANSACTION] Executing query in transaction ${this.id}:`,
      sql,
      params
    );
    return { rows: [] }; // Mock result
  }
}

class MockDatabaseConnection implements DatabaseConnection {
  async beginTransaction(): Promise<Transaction> {
    const transaction = new MockTransaction();
    console.log(`[TRANSACTION] Started transaction ${transaction.id}`);
    return transaction;
  }

  async query(sql: string, params?: any[]): Promise<any> {
    console.log(`[DATABASE] Executing query:`, sql, params);
    return { rows: [] }; // Mock result
  }
}

export class TransactionManager {
  private static instance: TransactionManager;
  private connection: DatabaseConnection;
  private currentTransaction: Transaction | null = null;

  private constructor() {
    this.connection = new MockDatabaseConnection();
  }

  static getInstance(): TransactionManager {
    if (!TransactionManager.instance) {
      TransactionManager.instance = new TransactionManager();
    }
    return TransactionManager.instance;
  }

  async startTransaction(options?: TransactionOptions): Promise<Transaction> {
    if (this.currentTransaction) {
      throw new Error("Transaction already in progress");
    }

    this.currentTransaction = await this.connection.beginTransaction();

    if (options?.timeout) {
      setTimeout(() => {
        if (this.currentTransaction) {
          console.log(
            `[TRANSACTION] Transaction ${this.currentTransaction.id} timed out`
          );
          this.rollbackCurrentTransaction();
        }
      }, options.timeout);
    }

    return this.currentTransaction;
  }

  getCurrentTransaction(): Transaction | null {
    return this.currentTransaction;
  }

  async commitCurrentTransaction(): Promise<void> {
    if (!this.currentTransaction) {
      throw new Error("No active transaction to commit");
    }

    await this.currentTransaction.commit();
    this.currentTransaction = null;
  }

  async rollbackCurrentTransaction(): Promise<void> {
    if (!this.currentTransaction) {
      throw new Error("No active transaction to rollback");
    }

    await this.currentTransaction.rollback();
    this.currentTransaction = null;
  }
}
