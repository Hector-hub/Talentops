// Base types para demonstration
export interface Entity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface User extends Entity {
  email: string;
  name: string;
  role: 'admin' | 'user';
}

export interface Product extends Entity {
  name: string;
  price: number;
  category: string;
}

export interface Order extends Entity {
  userId: string;
  productIds: string[];
  total: number;
  status: 'pending' | 'completed' | 'cancelled';
}

// Union type para todas las entidades
export type AnyEntity = User | Product | Order;