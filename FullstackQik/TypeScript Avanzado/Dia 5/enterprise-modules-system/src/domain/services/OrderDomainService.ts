import { IOrderRepository } from "../repositories/IOrderRepository";
import { IProductRepository } from "../repositories/IProductRepository";
import { OrderItem } from "../entities/Order";
import { Money } from "../value-objects/Money";

export class OrderDomainService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly productRepository: IProductRepository
  ) {}

  async validateOrderItems(
    items: OrderItem[]
  ): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    if (!items || items.length === 0) {
      errors.push("Order must contain at least one item");
      return { isValid: false, errors };
    }

    for (const item of items) {
      // Check if product exists
      const product = await this.productRepository.findById(item.productId);
      if (!product) {
        errors.push(`Product ${item.productId} not found`);
        continue;
      }

      // Check if enough stock
      if (product.stock < item.quantity) {
        errors.push(
          `Insufficient stock for product ${item.productId}. Available: ${product.stock}, Requested: ${item.quantity}`
        );
      }

      // Validate quantity
      if (item.quantity <= 0) {
        errors.push(`Invalid quantity for product ${item.productId}`);
      }

      // Validate price
      if (item.price !== product.price) {
        errors.push(`Price mismatch for product ${item.productId}`);
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  calculateOrderTotal(items: OrderItem[]): Money {
    const total = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    return new Money(total);
  }

  async canFulfillOrder(orderId: string): Promise<boolean> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return false;

    const validation = await this.validateOrderItems(order.items);
    return validation.isValid;
  }
}
