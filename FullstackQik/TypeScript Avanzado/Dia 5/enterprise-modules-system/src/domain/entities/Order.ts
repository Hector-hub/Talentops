import { Entity } from "../../shared/types";

export interface Order extends Entity {
  readonly id: string;
  readonly userId: string;
  readonly items: OrderItem[];
  readonly total: number;
  readonly status: OrderStatus;
  readonly createdAt: Date;
}

export interface OrderItem {
  readonly productId: string;
  readonly quantity: number;
  readonly price: number;
}

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export class OrderEntity implements Order {
  constructor(
    public readonly id: string,
    public readonly userId: string,
    public readonly items: OrderItem[],
    public readonly total: number,
    public readonly status: OrderStatus = OrderStatus.PENDING,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: {
    id: string;
    userId: string;
    items: OrderItem[];
  }): OrderEntity {
    const total = data.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return new OrderEntity(data.id, data.userId, data.items, total);
  }

  confirm(): OrderEntity {
    return new OrderEntity(
      this.id,
      this.userId,
      this.items,
      this.total,
      OrderStatus.CONFIRMED,
      this.createdAt
    );
  }

  cancel(): OrderEntity {
    return new OrderEntity(
      this.id,
      this.userId,
      this.items,
      this.total,
      OrderStatus.CANCELLED,
      this.createdAt
    );
  }
}
