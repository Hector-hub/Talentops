import { Product, Service, Subscription, CatalogItem } from "./domain.js";

// Factory class con métodos type-safe
export class CatalogItemFactory {
  // Generador de IDs único
  private static generateId(type: string): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `${type}_${timestamp}_${random}`;
  }

  // Factory method para Product
  static createProduct(
    data: Omit<Product, "id" | "type" | "createdAt" | "updatedAt" | "version">
  ): Product {
    return {
      id: this.generateId("product"),
      type: "product",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      ...data,
    };
  }

  // Factory method para Service
  static createService(
    data: Omit<Service, "id" | "type" | "createdAt" | "updatedAt" | "version">
  ): Service {
    return {
      id: this.generateId("service"),
      type: "service",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      ...data,
    };
  }

  // Factory method para Subscription
  static createSubscription(
    data: Omit<
      Subscription,
      "id" | "type" | "createdAt" | "updatedAt" | "version"
    >
  ): Subscription {
    return {
      id: this.generateId("subscription"),
      type: "subscription",
      createdAt: new Date(),
      updatedAt: new Date(),
      version: 1,
      ...data,
    };
  }
}
