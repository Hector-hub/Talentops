// Template literal types para categorías
type ProductCategory = 
  | 'electronics'
  | 'clothing'
  | 'books'
  | 'home-garden'
  | 'sports'
  | 'digital-content';

// Template literal types para subcategorías
type ElectronicsSubcategory = 'smartphones' | 'laptops' | 'tablets' | 'accessories';
type ClothingSubcategory = 'shirts' | 'pants' | 'shoes' | 'accessories';
type DigitalSubcategory = 'software' | 'ebooks' | 'music' | 'videos';

// Combinación de categorías con subcategorías usando template literals
type CategoryPath<T extends ProductCategory> = 
  T extends 'electronics' 
    ? `electronics/${ElectronicsSubcategory}`
    : T extends 'clothing'
    ? `clothing/${ClothingSubcategory}`
    : T extends 'digital-content'
    ? `digital-content/${DigitalSubcategory}`
    : T;

// Tipos base para diferentes tipos de productos
interface BaseProduct {
  id: string;
  name: string;
  price: number;
  description: string;
  tags: string[];
}

// Propiedades específicas para productos físicos
interface PhysicalProductProps {
  inStock: boolean;
  weight: number;
  dimensions: {
    width: number;
    height: number;
    depth: number;
  };
  shippingRequired: true;
}

// Propiedades específicas para productos digitales
interface DigitalProductProps {
  downloadUrl: string;
  fileSize: number;
  format: 'pdf' | 'mp3' | 'mp4' | 'zip' | 'exe';
  shippingRequired: false;
  instantDelivery: true;
}

// Conditional type para determinar el tipo de producto basado en la categoría
type ProductType<T extends ProductCategory> = 
  T extends 'digital-content' 
    ? 'digital' 
    : 'physical';

// Conditional type para las propiedades específicas
type ProductSpecificProps<T extends ProductCategory> = 
  ProductType<T> extends 'digital'
    ? DigitalProductProps
    : PhysicalProductProps;

// Tipo principal de producto que combina todo
type Product<T extends ProductCategory = ProductCategory> = BaseProduct & {
  category: CategoryPath<T>;
} & ProductSpecificProps<T>;

export type { ProductCategory, CategoryPath, ElectronicsSubcategory, ClothingSubcategory, DigitalSubcategory, BaseProduct, PhysicalProductProps, DigitalProductProps, ProductType, ProductSpecificProps, Product };