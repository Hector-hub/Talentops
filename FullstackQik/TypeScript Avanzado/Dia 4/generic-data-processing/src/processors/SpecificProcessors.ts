import { User, Product, Order } from "../types/entities";
import { BaseDataProcessor } from "./BaseDataProcessor";

// Specific processors con type safety
export class UserProcessor extends BaseDataProcessor<User> {
  constructor() {
    super(
      (user: User) => ({
        isValid: user.email.includes("@") && user.name.length > 0,
        errors: [
          ...(user.email.includes("@") ? [] : ["Invalid email format"]),
          ...(user.name.length > 0 ? [] : ["Name is required"]),
        ],
      }),
      [
        {
          name: "normalizeEmail",
          async apply(user: User): Promise<User> {
            return {
              ...user,
              email: user.email.toLowerCase().trim(),
            };
          },
        },
        {
          name: "updateTimestamp",
          async apply(user: User): Promise<User> {
            return {
              ...user,
              updatedAt: new Date(),
            };
          },
        },
      ]
    );
  }
}

export class ProductProcessor extends BaseDataProcessor<Product> {
  constructor() {
    super(
      (product: Product) => ({
        isValid: product.price > 0 && product.name.length > 0,
        errors: [
          ...(product.price > 0 ? [] : ["Price must be positive"]),
          ...(product.name.length > 0 ? [] : ["Name is required"]),
        ],
      }),
      [
        {
          name: "normalizeName",
          async apply(product: Product): Promise<Product> {
            return {
              ...product,
              name: product.name.trim(),
            };
          },
        },
        {
          name: "roundPrice",
          async apply(product: Product): Promise<Product> {
            return {
              ...product,
              price: Math.round(product.price * 100) / 100,
            };
          },
        },
      ]
    );
  }
}

export class OrderProcessor extends BaseDataProcessor<Order> {
  constructor() {
    super(
      (order: Order) => ({
        isValid:
          order.userId.length > 0 &&
          order.productIds.length > 0 &&
          order.total > 0,
        errors: [
          ...(order.userId.length > 0 ? [] : ["User ID is required"]),
          ...(order.productIds.length > 0
            ? []
            : ["At least one product is required"]),
          ...(order.total > 0 ? [] : ["Total must be positive"]),
        ],
      }),
      [
        {
          name: "calculateTotal",
          async apply(order: Order): Promise<Order> {
            // Simulated calculation
            const calculatedTotal = order.productIds.length * 100; // Simplified
            return {
              ...order,
              total: calculatedTotal,
            };
          },
        },
        {
          name: "updateTimestamp",
          async apply(order: Order): Promise<Order> {
            return {
              ...order,
              updatedAt: new Date(),
            };
          },
        },
      ]
    );
  }
}
