// Resultado de validación con discriminated union
export type ValidationResult<T> = 
  | { success: true; data: T; errors?: never }
  | { success: false; data?: never; errors: string[] };

// Tipo para errores de validación específicos
export type ValidationError = {
  field: string;
  message: string;
  code: string;
};

// Resultado de validación detallado con errores específicos por campo
export type DetailedValidationResult<T> = 
  | { success: true; data: T; errors?: never }
  | { success: false; data?: never; errors: ValidationError[] };

// Helper type para extraer el tipo de datos de un ValidationResult
export type ExtractValidationData<T> = T extends ValidationResult<infer U> ? U : never;

// Helper type para crear un resultado exitoso
export type SuccessResult<T> = Extract<ValidationResult<T>, { success: true }>;

// Helper type para crear un resultado de error
export type ErrorResult = Extract<ValidationResult<any>, { success: false }>