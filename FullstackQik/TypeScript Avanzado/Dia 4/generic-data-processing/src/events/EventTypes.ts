import { User, Product, Order } from "../types/entities";
import { EntityEvent, SystemEvent, BusinessEvent } from "../types/events";

// Specific event types para demonstration
export type UserEvent = EntityEvent<User>;
export type ProductEvent = EntityEvent<Product>;
export type OrderEvent = EntityEvent<Order>;

// Business event payload types
export interface OrderCreatedPayload {
  orderId: string;
  userId: string;
  productIds: string[];
  total: number;
}

export interface UserRegisteredPayload {
  userId: string;
  email: string;
  registrationDate: Date;
}

export interface ProductUpdatedPayload {
  productId: string;
  oldPrice: number;
  newPrice: number;
  updatedBy: string;
}

// Specific business events
export type OrderCreatedEvent = BusinessEvent<OrderCreatedPayload>;
export type UserRegisteredEvent = BusinessEvent<UserRegisteredPayload>;
export type ProductUpdatedEvent = BusinessEvent<ProductUpdatedPayload>;

// Event factory functions
export function createUserEvent(
  user: User,
  action: "created" | "updated" | "deleted",
  changes?: Partial<User>
): UserEvent {
  return {
    id: `user_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "entity_event",
    timestamp: new Date(),
    source: "user-service",
    version: 1,
    entity: user,
    action,
    changes,
  };
}

export function createProductEvent(
  product: Product,
  action: "created" | "updated" | "deleted",
  changes?: Partial<Product>
): ProductEvent {
  return {
    id: `product_event_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    type: "entity_event",
    timestamp: new Date(),
    source: "product-service",
    version: 1,
    entity: product,
    action,
    changes,
  };
}

export function createOrderEvent(
  order: Order,
  action: "created" | "updated" | "deleted",
  changes?: Partial<Order>
): OrderEvent {
  return {
    id: `order_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "entity_event",
    timestamp: new Date(),
    source: "order-service",
    version: 1,
    entity: order,
    action,
    changes,
  };
}

export function createSystemEvent(
  level: "info" | "warning" | "error",
  message: string,
  metadata?: Record<string, any>
): SystemEvent {
  return {
    id: `system_event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type: "system_event",
    timestamp: new Date(),
    source: "system",
    version: 1,
    level,
    message,
    metadata,
  };
}

export function createBusinessEvent<TPayload>(
  eventName: string,
  payload: TPayload,
  correlationId?: string
): BusinessEvent<TPayload> {
  return {
    id: `business_event_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`,
    type: "business_event",
    timestamp: new Date(),
    source: "business-service",
    version: 1,
    eventName,
    payload,
    correlationId,
  };
}
