import { Entity } from "./entities";

// Base event interface con variance
export interface BaseEvent {
  id: string;
  timestamp: Date;
  source: string;
  version: number;
}

// Event types usando generics y variance
export interface EntityEvent<T extends Entity> extends BaseEvent {
  type: "entity_event";
  entity: T;
  action: "created" | "updated" | "deleted";
  changes?: Partial<T>;
}

export interface SystemEvent extends BaseEvent {
  type: "system_event";
  level: "info" | "warning" | "error";
  message: string;
  metadata?: Record<string, any>;
}

export interface BusinessEvent<TPayload = any> extends BaseEvent {
  type: "business_event";
  eventName: string;
  payload: TPayload;
  correlationId?: string;
}

// Union type para todos los eventos (variance-aware)
export type AnyEvent = EntityEvent<any> | SystemEvent | BusinessEvent<any>;

// Variance-aware event constraints
export type CovariantEvent<T extends Entity> = EntityEvent<T>;
export type ContravariantEvent<T extends Entity> = {
  handler: (event: EntityEvent<T>) => Promise<void>;
};

// Event processing result types
export interface EventProcessingResult<T extends AnyEvent> {
  processed: T[];
  failed: Array<{
    event: T;
    error: string;
    code: string;
  }>;
  summary: {
    total: number;
    successful: number;
    failed: number;
    duration: number;
  };
}

// Event processor interface con variance
export interface EventProcessor<T extends AnyEvent> {
  process(events: T[]): Promise<EventProcessingResult<T>>;
  validate(event: T): ValidationResult;
  transform<U>(events: T[], transformer: (event: T) => U): U[];
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}
