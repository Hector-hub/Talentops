import { Entity } from "../types/entities";
import {
  DataProcessor,
  ProcessingResult,
  ValidationResult,
  BusinessRule,
  ProcessingError,
} from "../types/processing";

// Generic implementation con constraints
export class BaseDataProcessor<T extends Entity> implements DataProcessor<T> {
  constructor(
    private validator: (item: T) => ValidationResult,
    private businessRules: BusinessRule<T>[] = []
  ) {}

  async process(data: T[]): Promise<ProcessingResult<T>> {
    const startTime = Date.now();
    const processed: T[] = [];
    const errors: ProcessingError<T>[] = [];

    for (const item of data) {
      try {
        // Validate item
        const validation = this.validate(item);
        if (!validation.isValid) {
          errors.push({
            item,
            error: validation.errors.join(", "),
            code: "VALIDATION_ERROR",
          });
          continue;
        }

        // Apply business rules
        const processedItem = await this.applyBusinessRules(item);
        processed.push(processedItem);
      } catch (error) {
        errors.push({
          item,
          error: (error as Error).message,
          code: "PROCESSING_ERROR",
        });
      }
    }

    const duration = Date.now() - startTime;

    return {
      processed,
      errors,
      summary: {
        total: data.length,
        successful: processed.length,
        failed: errors.length,
        duration,
      },
    };
  }

  validate(item: T): ValidationResult {
    const errors: string[] = [];

    // Basic entity validation
    if (!item.id) errors.push("ID is required");
    if (!item.createdAt) errors.push("Created date is required");
    if (!item.updatedAt) errors.push("Updated date is required");

    // Custom validation
    const customValidation = this.validator(item);
    if (!customValidation.isValid) {
      errors.push(...customValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  transform<U>(data: T[], transformer: (item: T) => U): U[] {
    return data.map(transformer);
  }

  private async applyBusinessRules(item: T): Promise<T> {
    let processedItem = { ...item };

    for (const rule of this.businessRules) {
      processedItem = await rule.apply(processedItem);
    }

    return processedItem;
  }
}
