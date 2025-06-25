import { OrderItem } from "../../domain/entities/Order";

export interface CreateOrderRequest {
  userId: string;
  items: OrderItem[];
}

export interface OrderResponse {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: string;
  createdAt: string;
}
