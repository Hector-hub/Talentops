// Generic processor con variance
export interface DataProcessor<T> {
  process(data: T[]): Promise<ProcessingResult<T>>;
  validate(item: T): ValidationResult;
  transform<U>(data: T[], transformer: (item: T) => U): U[];
}

export interface ProcessingResult<T> {
  processed: T[];
  errors: ProcessingError<T>[];
  summary: ProcessingSummary;
}

export interface ProcessingError<T> {
  item: T;
  error: string;
  code: string;
}

export interface ProcessingSummary {
  total: number;
  successful: number;
  failed: number;
  duration: number;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

// Business rule interface
export interface BusinessRule<T> {
  name: string;
  apply(item: T): Promise<T>;
}