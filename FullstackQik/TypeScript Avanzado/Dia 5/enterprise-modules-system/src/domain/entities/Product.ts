import { Entity } from "../../shared/types";

export interface Product extends Entity {
  readonly id: string;
  readonly name: string;
  readonly price: number;
  readonly stock: number;
}

export class ProductEntity implements Product {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly price: number,
    public readonly stock: number
  ) {}

  static create(data: {
    id: string;
    name: string;
    price: number;
    stock: number;
  }): ProductEntity {
    return new ProductEntity(data.id, data.name, data.price, data.stock);
  }

  isAvailable(): boolean {
    return this.stock > 0;
  }
}
