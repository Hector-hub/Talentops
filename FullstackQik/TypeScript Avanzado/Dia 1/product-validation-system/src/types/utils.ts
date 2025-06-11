import type { Product, ProductCategory } from './product';

// DeepPartial utility type para updates anidados
type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object 
    ? DeepPartial<T[P]> 
    : T[P];
};

// Transformaciones específicas por tipo de producto
type CreateProductRequest<T extends ProductCategory> = Omit<Product<T>, 'id'>;

type UpdateProductRequest<T extends ProductCategory> = DeepPartial<Omit<Product<T>, 'id'>>;

// Summary types para diferentes vistas
type ProductSummary<T extends ProductCategory> = Pick<Product<T>, 'id' | 'name' | 'price'> & {
  category: Product<T>['category'];
  productType: T extends 'digital-content' ? 'digital' : 'physical';
};

type ProductSearchResult<T extends ProductCategory> = Pick<Product<T>, 'id' | 'name' | 'price'> & {
  category: Product<T>['category'];
};

// Utility type para extraer información de categoría
type ExtractMainCategory<T> = T extends `${infer Main}/${string}` ? Main : T;

type ExtractSubcategory<T> = T extends `${string}/${infer Sub}` ? Sub : never;

export type {
  DeepPartial,
  CreateProductRequest,
  UpdateProductRequest,
  ProductSummary,
  ProductSearchResult,
  ExtractMainCategory,
  ExtractSubcategory
};