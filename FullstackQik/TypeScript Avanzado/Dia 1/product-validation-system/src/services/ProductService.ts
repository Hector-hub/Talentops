import type { Product, ProductCategory } from '../types/product';
import type { 
  CreateProductRequest, 
  UpdateProductRequest, 
  ProductSummary, 
  ProductSearchResult 
} from '../types/utils';
import type { ValidationResult } from '../types/validation';
import { 
  isValidCreateProductRequest, 
  isValidCategoryPath 
} from '../guards/productGuards';

// Interface para el repositorio (mock)
interface ProductRepository {
  save<T extends ProductCategory>(product: Product<T>): Promise<Product<T>>;
  findById<T extends ProductCategory>(id: string): Promise<Product<T> | null>;
  search<T extends ProductCategory>(query: string): Promise<Product<T>[]>;
  findByCategory<T extends ProductCategory>(category: T): Promise<Product<T>[]>;
}

class ProductService {
  constructor(private repository: ProductRepository) {}

  // Crear producto con validación type-safe por categoría
  async createProduct<T extends ProductCategory>(
    data: unknown,
    category: T
  ): Promise<ValidationResult<Product<T>>> {
    // Validación con type guard específico
    if (!isValidCreateProductRequest(data, category)) {
      return {
        success: false,
        errors: [`Invalid ${category} product data format`]
      };
    }

    // TypeScript ahora sabe que data es CreateProductRequest<T>
    const product: Product<T> = {
      id: `${category}_${Date.now()}`,
      ...data
    } as Product<T>;

    try {
      const savedProduct = await this.repository.save(product);
      return {
        success: true,
        data: savedProduct
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to save product to database']
      };
    }
  }

  // Actualizar producto con deep merge type-safe
  async updateProduct<T extends ProductCategory>(
    id: string,
    updates: UpdateProductRequest<T>
  ): Promise<ValidationResult<Product<T>>> {
    const existingProduct = await this.repository.findById<T>(id);

    if (!existingProduct) {
      return {
        success: false,
        errors: ['Product not found']
      };
    }

    // Deep merge type-safe para productos físicos vs digitales
    const updatedProduct = this.deepMergeProduct(existingProduct, updates);

    try {
      const savedProduct = await this.repository.save(updatedProduct);
      return {
        success: true,
        data: savedProduct
      };
    } catch (error) {
      return {
        success: false,
        errors: ['Failed to update product']
      };
    }
  }

  // Buscar productos con transformación automática
  async searchProducts<T extends ProductCategory>(
    query: string,
    category?: T
  ): Promise<ProductSearchResult<T>[]> {
    let products: Product<T>[];

    if (category) {
      products = await this.repository.findByCategory(category);
    } else {
      products = await this.repository.search(query);
    }

    // Transformación type-safe a search result format
    return products
      .filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.description.toLowerCase().includes(query.toLowerCase())
      )
      .map(product => ({
        id: product.id,
        name: product.name,
        price: product.price
      } as ProductSearchResult<T>));
  }

  // Obtener resumen de producto con información del tipo
  async getProductSummary<T extends ProductCategory>(
    id: string
  ): Promise<ProductSummary<T> | null> {
    const product = await this.repository.findById<T>(id);

    if (!product) {
      return null;
    }

    // Determinar tipo de producto basado en la categoría
    const productType = this.getProductType(product.category);

    return {
      id: product.id,
      name: product.name,
      price: product.price,
      category: product.category,
      productType
    } as ProductSummary<T>;
  }

  // Helper privado para deep merge type-safe
  private deepMergeProduct<T extends ProductCategory>(
    existing: Product<T>,
    updates: UpdateProductRequest<T>
  ): Product<T> {
    const result = { ...existing };

    // Merge propiedades de primer nivel
    Object.keys(updates).forEach(key => {
      const value = (updates as any)[key];
      if (value !== undefined) {
        if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
          // Deep merge para objetos anidados
          (result as any)[key] = {
            ...(existing as any)[key],
            ...value
          };
        } else {
          // Asignación directa para primitivos y arrays
          (result as any)[key] = value;
        }
      }
    });

    return result;
  }

  // Helper para determinar el tipo de producto
  private getProductType(category: string): 'digital' | 'physical' {
    return category.startsWith('digital-content') ? 'digital' : 'physical';
  }
}

export { ProductService };
export type { ProductRepository };