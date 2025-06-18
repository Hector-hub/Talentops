import "reflect-metadata";
import {
  ValidationSchema,
  CacheOptions,
  LogOptions,
  RetryOptions,
} from "../types";

// Validation decorator
export function Validate(schema: ValidationSchema) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      console.log(
        `[VALIDATION] Validating parameters for ${target.constructor.name}.${propertyKey}`
      );

      for (let i = 0; i < args.length; i++) {
        const result = schema.validate(args[i]);
        if (result.error) {
          throw new ValidationError(
            `Validation failed for parameter ${i}: ${result.error.message}`
          );
        }
      }

      console.log(
        `[VALIDATION] All parameters valid for ${target.constructor.name}.${propertyKey}`
      );
      return originalMethod.apply(this, args);
    };

    return descriptor;
  };
}

// Cache decorator
export function Cache(options: CacheOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;
    const cache = new Map<string, { value: any; expiry: number }>();

    descriptor.value = async function (...args: any[]) {
      const key = options.keyGenerator
        ? options.keyGenerator(...args)
        : `${target.constructor.name}.${propertyKey}:${JSON.stringify(args)}`;

      // Verificar cache
      const cached = cache.get(key);
      if (cached && cached.expiry > Date.now()) {
        console.log(`[CACHE] Cache hit for key: ${key}`);
        return cached.value;
      }

      // Ejecutar método original
      const result = await originalMethod.apply(this, args);

      // Guardar en cache
      cache.set(key, {
        value: result,
        expiry: Date.now() + options.ttl * 1000,
      });

      console.log(`[CACHE] Cache miss for key: ${key}, result cached`);
      return result;
    };

    return descriptor;
  };
}

// Log decorator
export function Log(options: LogOptions = { level: "info" }) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      const startTime = Date.now();
      const className = target.constructor.name;

      console.log(
        `[${options.level.toUpperCase()}] ${className}.${propertyKey} called with args:`,
        args
      );

      try {
        const result = await originalMethod.apply(this, args);
        const duration = Date.now() - startTime;

        console.log(
          `[${options.level.toUpperCase()}] ${className}.${propertyKey} completed in ${duration}ms`
        );
        return result;
      } catch (error) {
        const duration = Date.now() - startTime;
        console.error(
          `[ERROR] ${className}.${propertyKey} failed after ${duration}ms:`,
          error
        );
        throw error;
      }
    };

    return descriptor;
  };
}

// Retry decorator
export function Retry(options: RetryOptions) {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const originalMethod = descriptor.value;

    descriptor.value = async function (...args: any[]) {
      let lastError: Error;

      for (let attempt = 1; attempt <= options.attempts; attempt++) {
        try {
          return await originalMethod.apply(this, args);
        } catch (error) {
          lastError = error as Error;

          if (attempt === options.attempts) {
            throw error;
          }

          const delay =
            options.delay * Math.pow(options.backoff || 1, attempt - 1);
          console.log(
            `[RETRY] Attempt ${attempt} failed, retrying in ${delay}ms...`
          );
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }

      throw lastError!;
    };

    return descriptor;
  };
}

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// Re-export transaction decorator
export { Transaction } from "./transaction/transaction-decorator";
