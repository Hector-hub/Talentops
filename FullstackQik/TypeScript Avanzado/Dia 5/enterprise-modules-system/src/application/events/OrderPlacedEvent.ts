import { DomainEvent } from "../../shared/types/events";
import { v4 as uuidv4 } from "uuid";
import { OrderItem } from "../../domain/entities/Order";

export interface OrderPlacedEvent extends DomainEvent {
  readonly eventName: "order.placed";
  readonly orderId: string;
  readonly userId: string;
  readonly items: OrderItem[];
  readonly total: number;
}

export class OrderPlacedEvent implements OrderPlacedEvent {
  readonly id: string = uuidv4();
  readonly occurredOn: Date = new Date();
  readonly eventName = "order.placed" as const;

  constructor(
    public readonly orderId: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly total: number
  ) {}
}

// Declaration merging para registrar el evento
declare module "../../shared/types/events" {
  interface EventRegistry {
    "order.placed": OrderPlacedEvent;
  }
}
