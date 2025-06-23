import { CatalogItem } from "./domain.js";

// 1. API Response Type - Transforma entidades en respuestas de API
export type ToApiResponse<T> = T extends { type: infer U; id: infer I }
  ? {
      type: U;
      id: I;
      data: Omit<T, "id" | "type" | "createdAt" | "updatedAt" | "version">;
      meta: {
        createdAt: string;
        updatedAt: string;
        version: number;
      };
    }
  : never;

// 2. Update Request Type - Para requests de actualización
export type ToUpdateRequest<T> = T extends { type: infer U }
  ? {
      type: U;
      updates: Partial<
        Omit<T, "id" | "type" | "createdAt" | "updatedAt" | "version">
      >;
      reason?: string;
    }
  : never;

// 3. Validation Schema Type - Crea schemas de validación automáticamente (RECURSIVO)
export type CreateValidationSchema<T> = {
  [K in keyof T]: T[K] extends string
    ? { type: "string"; required: boolean; pattern?: RegExp }
    : T[K] extends number
    ? { type: "number"; required: boolean; min?: number; max?: number }
    : T[K] extends boolean
    ? { type: "boolean"; required: boolean }
    : T[K] extends Date
    ? { type: "date"; required: boolean }
    : T[K] extends Array<any>
    ? { type: "array"; required: boolean; itemType?: string }
    : T[K] extends object
    ? {
        type: "object";
        required: boolean;
        schema: CreateValidationSchema<T[K]>;
      }
    : { type: "any"; required: boolean };
};

// 4. Event Type - Para eventos del dominio
export type ToEventType<T> = T extends { type: infer U }
  ? {
      eventType: `${string & U}Changed`;
      entityId: string;
      changes: Partial<
        Omit<T, "id" | "type" | "createdAt" | "updatedAt" | "version">
      >;
      metadata: {
        timestamp: Date;
        userId: string;
        source: string;
      };
    }
  : never;

// 5. Accessors Type - Genera getters y setters automáticamente
export type CreateAccessors<T> = {
  [K in keyof T as K extends
    | "id"
    | "type"
    | "createdAt"
    | "updatedAt"
    | "version"
    ? never
    : `get${Capitalize<string & K>}`]: () => T[K];
} & {
  [K in keyof T as K extends
    | "id"
    | "type"
    | "createdAt"
    | "updatedAt"
    | "version"
    ? never
    : `set${Capitalize<string & K>}`]: (value: T[K]) => void;
};

// 6. Serializers Type - Para convertir tipos complejos
export type CreateSerializers<T> = {
  [K in keyof T]: T[K] extends Date
    ? (value: T[K]) => string
    : T[K] extends object
    ? (value: T[K]) => Record<string, any>
    : (value: T[K]) => T[K];
};

// 7. Validation Functions Type - EL EJERCICIO PRINCIPAL
export type CreateValidationFunctions<T> = {
  [K in keyof T]: (value: unknown) => value is T[K];
};

// Tipos aplicados al dominio usando distributive conditional types
export type CatalogApiResponses = ToApiResponse<CatalogItem>;
export type CatalogUpdateRequests = ToUpdateRequest<CatalogItem>;
export type CatalogEvents = ToEventType<CatalogItem>;
export type CatalogAccessors<T extends CatalogItem> = CreateAccessors<T>;
export type CatalogSerializers<T extends CatalogItem> = CreateSerializers<T>;
export type CatalogValidationFunctions<T extends CatalogItem> =
  CreateValidationFunctions<T>;
