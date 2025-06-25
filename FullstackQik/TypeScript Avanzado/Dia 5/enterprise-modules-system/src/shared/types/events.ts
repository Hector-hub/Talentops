export interface EventRegistry {
  // Los eventos específicos se añadirán aquí usando declaration merging
}

// Event Bus interface
export interface IEventBus {
  publish<T extends keyof EventRegistry>(
    eventName: T,
    event: EventRegistry[T]
  ): Promise<void>;
  subscribe<T extends keyof EventRegistry>(
    eventName: T,
    handler: (event: EventRegistry[T]) => Promise<void> | void
  ): void;
}

// Base event interface
export interface DomainEvent {
  readonly id: string;
  readonly occurredOn: Date;
  readonly eventName: string;
}
