import type {   Product,   ProductCategory, 
  PhysicalProductProps, 
  DigitalProductProps 
} from '../types/product';
import type { CreateProductRequest } from '../types/utils';

// Type guard genérico para validar estructura base
function isValidBaseProduct(data: unknown): data is Record<string, any> {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).name === 'string' &&
    typeof (data as any).price === 'number' &&
    (data as any).price > 0 &&
    typeof (data as any).description === 'string' &&
    Array.isArray((data as any).tags)
  );
}

// Type guard para productos físicos
function isValidPhysicalProduct(data: unknown): data is PhysicalProductProps {
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).inStock === 'boolean' &&
    typeof (data as any).weight === 'number' &&
    (data as any).weight > 0 &&
    typeof (data as any).dimensions === 'object' &&
    typeof (data as any).dimensions.width === 'number' &&
    typeof (data as any).dimensions.height === 'number' &&
    typeof (data as any).dimensions.depth === 'number' &&
    (data as any).shippingRequired === true
  );
}

// Type guard para productos digitales
function isValidDigitalProduct(data: unknown): data is DigitalProductProps {
  const validFormats = ['pdf', 'mp3', 'mp4', 'zip', 'exe'];
  
  return (
    typeof data === 'object' &&
    data !== null &&
    typeof (data as any).downloadUrl === 'string' &&
    (data as any).downloadUrl.length > 0 &&
    typeof (data as any).fileSize === 'number' &&
    (data as any).fileSize > 0 &&
    validFormats.indexOf((data as any).format) !== -1 &&
    (data as any).shippingRequired === false &&
    (data as any).instantDelivery === true
  );
}

// Type guard específico para cada categoría
function isValidCreateProductRequest<T extends ProductCategory>(
  data: unknown,
  category: T
): data is CreateProductRequest<T> {
  if (!isValidBaseProduct(data)) {
    return false;
  }

  // Validar que la categoría sea compatible
  if ((data as any).category && !isValidCategoryPath((data as any).category, category)) {
    return false;
  }

  // Validar propiedades específicas según el tipo
  if (category === 'digital-content') {
    return isValidDigitalProduct(data);
  } else {
    return isValidPhysicalProduct(data);
  }
}

// Helper para validar rutas de categorías
function isValidCategoryPath(path: string, mainCategory: ProductCategory): boolean {
  if (mainCategory === 'digital-content') {
    return path.indexOf('digital-content/') === 0 && 
           ['software', 'ebooks', 'music', 'videos'].some(sub => path.indexOf(sub) !== -1);
  }
  
  if (mainCategory === 'electronics') {
    return path.indexOf('electronics/') === 0 && 
           ['smartphones', 'laptops', 'tablets', 'accessories'].some(sub => path.indexOf(sub) !== -1);
  }
  
  if (mainCategory === 'clothing') {
    return path.indexOf('clothing/') === 0 && 
           ['shirts', 'pants', 'shoes', 'accessories'].some(sub => path.indexOf(sub) !== -1);
  }
  
  // Para categorías sin subcategorías
  return ['books', 'home-garden', 'sports'].indexOf(path) !== -1;
}

export {
  isValidBaseProduct,
  isValidPhysicalProduct,
  isValidDigitalProduct,
  isValidCreateProductRequest,
  isValidCategoryPath
};

