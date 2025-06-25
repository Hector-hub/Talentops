import {
  IOrderRepository,
  OrderEntity,
  OrderDomainService,
} from "../../domain/index";
import { CreateOrderRequest, OrderResponse } from "../dtos/CreateOrderRequest";
import { IEventBus } from "../../shared/types/events";
import { OrderPlacedEvent } from "../events/OrderPlacedEvent";
import { Result } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

export class OrderApplicationService {
  constructor(
    private readonly orderRepository: IOrderRepository,
    private readonly orderDomainService: OrderDomainService,
    private readonly eventBus: IEventBus
  ) {}

  async createOrder(
    request: CreateOrderRequest
  ): Promise<Result<OrderResponse, string>> {
    try {
      // Validación usando domain service
      const validation = await this.orderDomainService.validateOrderItems(
        request.items
      );
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(", ") };
      }

      // Crear nueva entidad
      const orderId = uuidv4();
      const order = OrderEntity.create({
        id: orderId,
        userId: request.userId,
        items: request.items,
      });

      // Guardar en repositorio
      await this.orderRepository.save(order);

      // Publicar evento
      const event = new OrderPlacedEvent(
        order.id,
        order.userId,
        order.items,
        order.total
      );
      await this.eventBus.publish("order.placed", event);

      // Retornar resultado
      const response: OrderResponse = {
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      };

      return { success: true, data: response };
    } catch (error) {
      console.error("Error creating order:", error);
      return { success: false, error: "Failed to create order" };
    }
  }

  async getOrderById(id: string): Promise<Result<OrderResponse, string>> {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        return { success: false, error: "Order not found" };
      }

      const response: OrderResponse = {
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      };

      return { success: true, data: response };
    } catch (error) {
      console.error("Error getting order:", error);
      return { success: false, error: "Failed to get order" };
    }
  }

  async getOrdersByUserId(
    userId: string
  ): Promise<Result<OrderResponse[], string>> {
    try {
      const orders = await this.orderRepository.findByUserId(userId);
      const response = orders.map((order) => ({
        id: order.id,
        userId: order.userId,
        items: order.items,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt.toISOString(),
      }));

      return { success: true, data: response };
    } catch (error) {
      console.error("Error getting orders:", error);
      return { success: false, error: "Failed to get orders" };
    }
  }

  async confirmOrder(id: string): Promise<Result<OrderResponse, string>> {
    try {
      const order = await this.orderRepository.findById(id);
      if (!order) {
        return { success: false, error: "Order not found" };
      }

      const confirmedOrder = order.confirm();
      await this.orderRepository.save(confirmedOrder);

      const response: OrderResponse = {
        id: confirmedOrder.id,
        userId: confirmedOrder.userId,
        items: confirmedOrder.items,
        total: confirmedOrder.total,
        status: confirmedOrder.status,
        createdAt: confirmedOrder.createdAt.toISOString(),
      };

      return { success: true, data: response };
    } catch (error) {
      console.error("Error confirming order:", error);
      return { success: false, error: "Failed to confirm order" };
    }
  }
}
