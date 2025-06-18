import { TransactionOptions } from '../../types';
import { TransactionManager } from './transaction-manager';

export function Transaction(options: TransactionOptions = {}) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    
    descriptor.value = async function (...args: any[]) {
      const transactionManager = TransactionManager.getInstance();
      
      // Verificar si ya hay una transacción activa
      const existingTransaction = transactionManager.getCurrentTransaction();
      if (existingTransaction) {
        console.log(`[TRANSACTION] Using existing transaction ${existingTransaction.id} for ${target.constructor.name}.${propertyKey}`);
        return originalMethod.apply(this, args);
      }
      
      // Iniciar nueva transacción
      console.log(`[TRANSACTION] Starting new transaction for ${target.constructor.name}.${propertyKey}`);
      const transaction = await transactionManager.startTransaction(options);
      
      try {
        // Ejecutar el método original
        const result = await originalMethod.apply(this, args);
        
        // Si llegamos aquí, commit la transacción
        await transactionManager.commitCurrentTransaction();
        console.log(`[TRANSACTION] Method ${target.constructor.name}.${propertyKey} completed successfully`);
        
        return result;
        
      } catch (error) {
        // En caso de error, rollback
        console.error(`[TRANSACTION] Error in ${target.constructor.name}.${propertyKey}, rolling back:`, error);
        await transactionManager.rollbackCurrentTransaction();
        throw error;
      }
    };
    
    return descriptor;
  };
}