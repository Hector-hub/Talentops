export * from "./events";

// Tipos base comunes
export interface Entity {
  readonly id: string;
}

export interface ValueObject<T = any> {
  readonly value: T;
  equals(other: ValueObject<T>): boolean;
}

// Result type para manejo de errores
export type Result<T, E = Error> =
  | { success: true; data: T }
  | { success: false; error: E };

// Response types para API
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}
