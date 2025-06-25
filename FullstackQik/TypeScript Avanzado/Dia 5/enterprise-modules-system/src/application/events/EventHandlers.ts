import { UserCreatedEvent } from "./UserCreatedEvent";
import { ProductStockUpdatedEvent } from "./ProductStockUpdatedEvent";
import { Adapters } from "../../infrastructure/adapters";

// Event handlers
export class EventHandlers {
  constructor(
    private readonly emailAdapter: Adapters.IEmailAdapter,
    private readonly loggerAdapter: Adapters.ILoggerAdapter,
    private readonly cacheAdapter: Adapters.ICacheAdapter
  ) {}

  // Handler para when usuario es creado
  async handleUserCreated(event: UserCreatedEvent): Promise<void> {
    this.loggerAdapter.info(`User created: ${event.userId}`, {
      email: event.email,
      name: event.name,
    });

    // Enviar email de bienvenida
    await this.emailAdapter.sendEmail(
      event.email,
      "Welcome to our platform!",
      `Hello ${event.name}, welcome to our enterprise system!`
    );

    // Invalidar cache relacionado
    await this.cacheAdapter.delete(`user:${event.userId}`);
  }

  // Handler para when stock es actualizado
  async handleProductStockUpdated(
    event: ProductStockUpdatedEvent
  ): Promise<void> {
    this.loggerAdapter.info(`Product stock updated: ${event.productId}`, {
      oldStock: event.oldStock,
      newStock: event.newStock,
    });

    // Invalidar cache del producto
    await this.cacheAdapter.delete(`product:${event.productId}`);

    // Si stock bajo, enviar alerta
    if (event.newStock < 10) {
      this.loggerAdapter.warn(
        `Low stock alert for product: ${event.productId}`,
        {
          currentStock: event.newStock,
        }
      );
    }
  }
}
