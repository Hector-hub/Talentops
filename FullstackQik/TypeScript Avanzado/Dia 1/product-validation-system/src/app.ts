import { ProductService } from "./services/ProductService";
import type { Product, ProductCategory } from "./types/product";
import type { ProductRepository } from "./services/ProductService";

class MockProductRepository implements ProductRepository {
  private products: Array<Product<ProductCategory>> = [];

  async save<T extends ProductCategory>(
    product: Product<T>
  ): Promise<Product<T>> {
    const existingIndex = this.products.findIndex((p) => p.id === product.id);
    if (existingIndex >= 0) {
      this.products[existingIndex] = product as Product<ProductCategory>;
    } else {
      this.products.push(product as Product<ProductCategory>);
    }
    return product;
  }

  async findById<T extends ProductCategory>(
    id: string
  ): Promise<Product<T> | null> {
    const product = this.products.find((p) => p.id === id);
    return product ? (product as unknown as Product<T>) : null;
  }

  async search<T extends ProductCategory>(
    query: string
  ): Promise<Product<T>[]> {
    return this.products.filter((p) =>
      p.name.toLowerCase().includes(query.toLowerCase())
    ) as unknown as Product<T>[];
  }

  async findByCategory<T extends ProductCategory>(
    category: T
  ): Promise<Product<T>[]> {
    return this.products.filter((p) =>
      p.category.startsWith(category)
    ) as unknown as Product<T>[];
  }
}

async function demonstrateSystem() {
  const repository = new MockProductRepository();
  const productService = new ProductService(repository);

  console.log("Sistema de Validación Type-Safe Demo");
  console.log("------------------------------------");

  console.log("Creando producto digital...");
  const digitalProductData = {
    name: "TypeScript Course",
    price: 99.99,
    description: "Advanced TypeScript course",
    tags: ["programming", "typescript"],
    category: "digital-content/software",
    downloadUrl: "https://example.com/download",
    fileSize: 1024000,
    format: "zip" as const,
    shippingRequired: false,
    instantDelivery: true,
  };

  const digitalResult = await productService.createProduct(
    digitalProductData,
    "digital-content"
  );

  if (digitalResult.success) {
    console.log("Producto digital creado:", digitalResult.data.id);
    console.log(
      "Tipo:",
      digitalResult.data.shippingRequired ? "físico" : "digital"
    );
  }

  console.log("Creando producto físico...");
  const physicalProductData = {
    name: "iPhone 15",
    price: 999.99,
    description: "Latest iPhone model",
    tags: ["phone", "apple"],
    category: "electronics/smartphones",
    inStock: true,
    weight: 171,
    dimensions: {
      width: 71.6,
      height: 147.6,
      depth: 7.8,
    },
    shippingRequired: true,
  };

  const physicalResult = await productService.createProduct(
    physicalProductData,
    "electronics"
  );

  if (physicalResult.success) {
    console.log("Producto físico creado:", physicalResult.data.id);
    console.log("Peso:", physicalResult.data.weight, "g");
  }

  console.log("Intentando crear producto inválido...");
  const invalidData = {
    name: "Invalid Product",
    description: "This should fail",
  };

  const invalidResult = await productService.createProduct(
    invalidData,
    "electronics"
  );

  if (!invalidResult.success) {
    console.log("Validación falló correctamente:", invalidResult.errors);
  }

  console.log("Buscando productos por nombre...");
  const searchResults = await productService.searchProducts("iphone");
  console.log("Resultados de búsqueda:", searchResults.length);

  if (physicalResult.success) {
    console.log("Actualizando producto físico...");
    const updateResult = await productService.updateProduct(
      physicalResult.data.id,
      {
        price: 899.99,
        inStock: false,
        dimensions: {
          width: 72.0,
        },
      }
    );

    if (updateResult.success) {
      console.log("Producto actualizado");
      console.log("Nuevo precio:", updateResult.data.price);
      console.log("Nuevas dimensiones:", updateResult.data.dimensions);
    }
  }

  if (digitalResult.success) {
    console.log("Obteniendo resumen de producto digital...");
    const summary = await productService.getProductSummary(
      digitalResult.data.id
    );
    if (summary) {
      console.log("Resumen:", {
        id: summary.id,
        name: summary.name,
        price: summary.price,
        type: summary.productType,
      });
    }
  }

  console.log("Actualizando producto inexistente...");
  const updateInvalid = await productService.updateProduct("not-found-id", {
    price: 123,
  });
  if (!updateInvalid.success) {
    console.log(
      "No se pudo actualizar producto inexistente:",
      updateInvalid.errors
    );
  }

  console.log("Buscando producto que no existe...");
  const noResults = await productService.searchProducts("nonexistent");
  console.log("Resultados encontrados:", noResults.length);
}

demonstrateSystem().catch(console.error);
