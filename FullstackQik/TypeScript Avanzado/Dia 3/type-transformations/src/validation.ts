import {
  CreateValidationSchema,
  CreateValidationFunctions,
} from "./transformations.js";

// Resultado de validación
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Clase que genera validation functions automáticamente usando mapped types
export class ValidationSystem {
  // Crea validation functions para cada propiedad usando mapped types
  static createValidationFunctions<T extends { [K in keyof T]: any }>(
    schema: CreateValidationSchema<T>
  ): CreateValidationFunctions<T> {
    const validators = {} as any;

    for (const [key, rule] of Object.entries(schema)) {
      validators[key] = (value: unknown) => {
        return this.validateProperty(value, rule as any);
      };
    }

    return validators;
  }

  // Validador individual usando el schema
  private static validateProperty(value: unknown, rule: any): boolean {
    if (rule.required && (value === undefined || value === null)) {
      return false;
    }

    if (value === undefined || value === null) {
      return !rule.required;
    }

    switch (rule.type) {
      case 'string':
        return typeof value === 'string' && 
               value.length > 0 &&
               (!rule.pattern || rule.pattern.test(value));
      case 'number':
        return typeof value === 'number' && 
               (!rule.min || value >= rule.min) &&
               (!rule.max || value <= rule.max);
      case 'boolean':
        return typeof value === 'boolean';
      case 'date':
        return value instanceof Date;
      case 'array':
        return Array.isArray(value);
      case 'object':
        if (typeof value !== 'object' || value === null) return false;
        if (rule.schema) {
          return this.validateObject(value, rule.schema).isValid;
        }
        return true;
      default:
        return true;
    }
  }

  // Validador completo del objeto con errores detallados
  static validateObject<T>(
    obj: unknown,
    schema: CreateValidationSchema<T>
  ): ValidationResult {
    const errors: string[] = [];

    if (!obj || typeof obj !== "object") {
      return { isValid: false, errors: ["Must be an object"] };
    }

    const target = obj as Record<string, unknown>;

    for (const [key, rule] of Object.entries(schema)) {
      const result = this.validatePropertyWithDetails(
        target[key],
        rule as any,
        key
      );
      if (!result.isValid) {
        errors.push(...result.errors);
      }
    }

    return { isValid: errors.length === 0, errors };
  }

  // Validación con detalles de errores
  private static validatePropertyWithDetails(
    value: unknown, 
    rule: any, 
    fieldName: string
  ): ValidationResult {
    const errors: string[] = [];

    if (rule.required && (value === undefined || value === null)) {
      errors.push(`${fieldName} is required`);
      return { isValid: false, errors };
    }

    if (value === undefined || value === null) {
      return { isValid: true, errors: [] };
    }

    switch (rule.type) {
      case 'string':
        if (typeof value !== 'string') {
          errors.push(`${fieldName} must be a string`);
        } else if (value.length === 0) {
          errors.push(`${fieldName} cannot be empty`);
        } else if (rule.pattern && !rule.pattern.test(value)) {
          errors.push(`${fieldName} does not match required pattern`);
        }
        break;

      case 'number':
        if (typeof value !== 'number') {
          errors.push(`${fieldName} must be a number`);
        } else {
          if (rule.min !== undefined && value < rule.min) {
            errors.push(`${fieldName} must be at least ${rule.min}`);
          }
          if (rule.max !== undefined && value > rule.max) {
            errors.push(`${fieldName} must be at most ${rule.max}`);
          }
        }
        break;

      case 'boolean':
        if (typeof value !== 'boolean') {
          errors.push(`${fieldName} must be a boolean`);
        }
        break;

      case 'date':
        if (!(value instanceof Date) && isNaN(Date.parse(value as string))) {
          errors.push(`${fieldName} must be a valid date`);
        }
        break;

      case 'array':
        if (!Array.isArray(value)) {
          errors.push(`${fieldName} must be an array`);
        }
        break;

      case 'object':
        if (typeof value !== 'object' || value === null) {
          errors.push(`${fieldName} must be an object`);
        } else if (rule.schema) {
          const nestedResult = this.validateObject(value, rule.schema);
          if (!nestedResult.isValid) {
            errors.push(...nestedResult.errors.map(err => `${fieldName}.${err}`));
          }
        }
        break;
    }

    return { isValid: errors.length === 0, errors };
  }
}
