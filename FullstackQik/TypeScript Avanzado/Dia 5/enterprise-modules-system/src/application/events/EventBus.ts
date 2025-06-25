import { IEventBus, EventRegistry } from "../../shared/types/events";

export class EventBus implements IEventBus {
  private handlers: Map<
    keyof EventRegistry,
    Array<(event: any) => Promise<void> | void>
  > = new Map();

  async publish<T extends keyof EventRegistry>(
    eventName: T,
    event: EventRegistry[T]
  ): Promise<void> {
    const eventHandlers = this.handlers.get(eventName) || [];

    console.log(` Publishing event: ${String(eventName)}`, event);

    for (const handler of eventHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error handling event ${String(eventName)}:`, error);
      }
    }
  }

  subscribe<T extends keyof EventRegistry>(
    eventName: T,
    handler: (event: EventRegistry[T]) => Promise<void> | void
  ): void {
    if (!this.handlers.has(eventName)) {
      this.handlers.set(eventName, []);
    }

    this.handlers.get(eventName)!.push(handler);
    console.log(`Subscribed to event: ${String(eventName)}`);
  }

  getSubscribersCount<T extends keyof EventRegistry>(eventName: T): number {
    return this.handlers.get(eventName)?.length || 0;
  }
}
