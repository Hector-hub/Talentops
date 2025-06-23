// Base entity que comparten todas las entidades
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  version: number;
}

// Product entity con metadata compleja
export interface Product extends BaseEntity {
  type: 'product';
  name: string;
  price: number;
  category: string;
  inStock: boolean;
  metadata: {
    weight: number;
    dimensions: { width: number; height: number; depth: number };
    tags: string[];
  };
}

// Service entity con metadata específica
export interface Service extends BaseEntity {
  type: 'service';
  name: string;
  hourlyRate: number;
  category: string;
  available: boolean;
  metadata: {
    duration: number;
    requirements: string[];
    location: 'remote' | 'onsite' | 'hybrid';
  };
}

// Subscription entity con metadata de facturación
export interface Subscription extends BaseEntity {
  type: 'subscription';
  name: string;
  monthlyPrice: number;
  category: string;
  active: boolean;
  metadata: {
    features: string[];
    limits: { users: number; storage: number };
    billingCycle: 'monthly' | 'yearly';
  };
}

// Union type principal
export type CatalogItem = Product | Service | Subscription;