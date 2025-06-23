import {
  DataProcessor,
  ValidationResult,
  BusinessRule,
} from "../types/processing";
import { BaseDataProcessor } from "../processors/BaseDataProcessor";
import {
  UserProcessor,
  ProductProcessor,
  OrderProcessor,
} from "../processors/SpecificProcessors";
import { Entity, User, Product, Order } from "../types/entities";

// Generic factory con constraints
export class ProcessorFactory {
  // Factory methods for specific processors with better type inference
  static createUserProcessor(): UserProcessor {
    return new UserProcessor();
  }

  static createProductProcessor(): ProductProcessor {
    return new ProductProcessor();
  }

  static createOrderProcessor(): OrderProcessor {
    return new OrderProcessor();
  }

  // Generic processor factory with string-based type selection
  static createProcessor(
    entityType: "user",
    customValidator?: (item: User) => ValidationResult,
    customRules?: BusinessRule<User>[]
  ): UserProcessor;
  static createProcessor(
    entityType: "product",
    customValidator?: (item: Product) => ValidationResult,
    customRules?: BusinessRule<Product>[]
  ): ProductProcessor;
  static createProcessor(
    entityType: "order",
    customValidator?: (item: Order) => ValidationResult,
    customRules?: BusinessRule<Order>[]
  ): OrderProcessor;
  static createProcessor<T extends Entity>(
    entityType: string,
    customValidator?: (item: T) => ValidationResult,
    customRules?: BusinessRule<T>[]
  ): DataProcessor<T>;
  static createProcessor<T extends Entity>(
    entityType: string,
    customValidator?: (item: T) => ValidationResult,
    customRules?: BusinessRule<T>[]
  ): DataProcessor<T> {
    switch (entityType) {
      case "user":
        return new UserProcessor() as unknown as DataProcessor<T>;
      case "product":
        return new ProductProcessor() as unknown as DataProcessor<T>;
      case "order":
        return new OrderProcessor() as unknown as DataProcessor<T>;
      default:
        return new BaseDataProcessor<T>(
          customValidator || (() => ({ isValid: true, errors: [] })),
          customRules || []
        );
    }
  }

  // Generic processor factory with full customization
  static createCustomProcessor<T extends Entity>(
    validator: (item: T) => ValidationResult,
    businessRules: BusinessRule<T>[] = []
  ): BaseDataProcessor<T> {
    return new BaseDataProcessor<T>(validator, businessRules);
  }
}
