import { ProductEntity } from "../entities/Product";

export interface IProductRepository {
  findById(id: string): Promise<ProductEntity | null>;
  findAll(): Promise<ProductEntity[]>;
  save(product: ProductEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
