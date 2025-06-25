import { DomainEvent } from "../../shared/types/events";
import { v4 as uuidv4 } from "uuid";

export interface ProductStockUpdatedEvent extends DomainEvent {
  readonly eventName: "product.stock.updated";
  readonly productId: string;
  readonly oldStock: number;
  readonly newStock: number;
}

export class ProductStockUpdatedEvent implements ProductStockUpdatedEvent {
  readonly id: string = uuidv4();
  readonly occurredOn: Date = new Date();
  readonly eventName = "product.stock.updated" as const;

  constructor(
    public readonly productId: string,
    public readonly oldStock: number,
    public readonly newStock: number
  ) {}
}

// Declaration merging para registrar el evento
declare module "../../shared/types/events" {
  interface EventRegistry {
    "product.stock.updated": ProductStockUpdatedEvent;
  }
}
