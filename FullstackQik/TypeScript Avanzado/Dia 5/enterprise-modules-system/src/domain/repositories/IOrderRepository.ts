import { OrderEntity } from "../entities/Order";

export interface IOrderRepository {
  findById(id: string): Promise<OrderEntity | null>;
  findByUserId(userId: string): Promise<OrderEntity[]>;
  save(order: OrderEntity): Promise<void>;
  delete(id: string): Promise<void>;
  findAll(): Promise<OrderEntity[]>;
}
