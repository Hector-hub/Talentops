import {
  EventProcessor,
  EventProcessingResult,
  ValidationResult,
  EntityEvent,
  SystemEvent,
  BusinessEvent,
  AnyEvent,
} from "../types/events";
import { Entity } from "../types/entities";

// Generic Event Processor con variance-aware design
export class GenericEventProcessor<T extends AnyEvent>
  implements EventProcessor<T>
{
  constructor(
    private eventValidator: (event: T) => ValidationResult,
    private eventHandlers: Map<string, (event: T) => Promise<void>> = new Map()
  ) {}

  async process(events: T[]): Promise<EventProcessingResult<T>> {
    const startTime = Date.now();
    const processed: T[] = [];
    const failed: Array<{
      event: T;
      error: string;
      code: string;
    }> = [];

    for (const event of events) {
      try {
        // Validate event
        const validation = this.validate(event);
        if (!validation.isValid) {
          failed.push({
            event,
            error: validation.errors.join(", "),
            code: "VALIDATION_ERROR",
          });
          continue;
        }

        // Process event based on type
        await this.processEvent(event);
        processed.push(event);
      } catch (error) {
        failed.push({
          event,
          error: (error as Error).message,
          code: "PROCESSING_ERROR",
        });
      }
    }

    const duration = Date.now() - startTime;

    return {
      processed,
      failed,
      summary: {
        total: events.length,
        successful: processed.length,
        failed: failed.length,
        duration,
      },
    };
  }

  validate(event: T): ValidationResult {
    const errors: string[] = [];

    // Basic event validation
    if (!event.id) errors.push("Event ID is required");
    if (!event.timestamp) errors.push("Event timestamp is required");
    if (!event.source) errors.push("Event source is required");
    if (event.version < 1) errors.push("Event version must be positive");

    // Custom validation
    const customValidation = this.eventValidator(event);
    if (!customValidation.isValid) {
      errors.push(...customValidation.errors);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  transform<U>(events: T[], transformer: (event: T) => U): U[] {
    return events.map(transformer);
  }

  // Add event handler with variance-aware typing
  addHandler<TSpecific extends T>(
    eventType: string,
    handler: (event: TSpecific) => Promise<void>
  ): void {
    this.eventHandlers.set(eventType, handler as (event: T) => Promise<void>);
  }

  private async processEvent(event: T): Promise<void> {
    const handler = this.eventHandlers.get(event.type);
    if (handler) {
      await handler(event);
    } else {
      console.log(`No handler found for event type: ${event.type}`);
    }
  }
}

// Specialized Event Processors usando variance
export class EntityEventProcessor<
  T extends Entity
> extends GenericEventProcessor<EntityEvent<T>> {
  constructor() {
    super((event: EntityEvent<T>) => ({
      isValid: event.entity !== null && event.entity !== undefined,
      errors: event.entity ? [] : ["Entity is required for entity events"],
    }));

    // Add default handlers
    this.addHandler("entity_event", async (event: EntityEvent<T>) => {
      console.log(`Processing ${event.action} for entity ${event.entity.id}`);
    });
  }
}

export class SystemEventProcessor extends GenericEventProcessor<SystemEvent> {
  constructor() {
    super((event: SystemEvent) => ({
      isValid:
        event.message.length > 0 &&
        ["info", "warning", "error"].includes(event.level),
      errors: [
        ...(event.message.length > 0 ? [] : ["Message is required"]),
        ...(["info", "warning", "error"].includes(event.level)
          ? []
          : ["Invalid log level"]),
      ],
    }));

    this.addHandler("system_event", async (event: SystemEvent) => {
      console.log(`[${event.level.toUpperCase()}] ${event.message}`);
    });
  }
}

export class BusinessEventProcessor<
  TPayload = any
> extends GenericEventProcessor<BusinessEvent<TPayload>> {
  constructor() {
    super((event: BusinessEvent<TPayload>) => ({
      isValid: event.eventName.length > 0 && event.payload !== null,
      errors: [
        ...(event.eventName.length > 0 ? [] : ["Event name is required"]),
        ...(event.payload !== null ? [] : ["Payload is required"]),
      ],
    }));

    this.addHandler(
      "business_event",
      async (event: BusinessEvent<TPayload>) => {
        console.log(`Processing business event: ${event.eventName}`);
      }
    );
  }
}

// Variance-aware Universal Event Processor
export class UniversalEventProcessor extends GenericEventProcessor<AnyEvent> {
  private entityProcessor = new EntityEventProcessor();
  private systemProcessor = new SystemEventProcessor();
  private businessProcessor = new BusinessEventProcessor();

  constructor() {
    super((event: AnyEvent) => ({ isValid: true, errors: [] }));
  }

  async process(events: AnyEvent[]): Promise<EventProcessingResult<AnyEvent>> {
    const startTime = Date.now();
    const processed: AnyEvent[] = [];
    const failed: Array<{
      event: AnyEvent;
      error: string;
      code: string;
    }> = [];

    for (const event of events) {
      try {
        // Route to appropriate processor based on type (variance-aware)
        switch (event.type) {
          case "entity_event":
            const entityResult = await this.entityProcessor.process([
              event as EntityEvent<any>,
            ]);
            processed.push(...entityResult.processed);
            failed.push(...entityResult.failed);
            break;

          case "system_event":
            const systemResult = await this.systemProcessor.process([
              event as SystemEvent,
            ]);
            processed.push(...systemResult.processed);
            failed.push(...systemResult.failed);
            break;

          case "business_event":
            const businessResult = await this.businessProcessor.process([
              event as BusinessEvent,
            ]);
            processed.push(...businessResult.processed);
            failed.push(...businessResult.failed);
            break;

          default:
            failed.push({
              event,
              error: `Unknown event type: ${(event as any).type}`,
              code: "UNKNOWN_EVENT_TYPE",
            });
        }
      } catch (error) {
        failed.push({
          event,
          error: (error as Error).message,
          code: "ROUTING_ERROR",
        });
      }
    }

    const duration = Date.now() - startTime;

    return {
      processed,
      failed,
      summary: {
        total: events.length,
        successful: processed.length,
        failed: failed.length,
        duration,
      },
    };
  }
}
