# Product Validation System - TypeScript Avanzado

## 📋 Descripción

Sistema de validación type-safe que demuestra conceptos avanzados de TypeScript incluyendo Template Literal Types, Conditional Types, Utility Types y Type Guards.

## 🎯 Conceptos Demostrados

### Template Literal Types

- Categorías jerárquicas: `electronics/smartphones`, `digital-content/software`
- Validación automática de rutas de categorías
- Type safety en compile time

### Conditional Types

- Discriminated unions para productos físicos vs digitales
- Propiedades específicas por tipo de producto
- Type narrowing automático

### Utility Types

- `CreateProductRequest<T>` - Omit para requests sin ID
- `UpdateProductRequest<T>` - Partial + DeepPartial para actualizaciones
- `ProductSummary<T>` - Pick para vistas resumidas

### Type Guards

- Validación runtime con type predicates
- Type-safe data transformation
- Schema validation patterns

```typescript
// Template Literal Types
type CategoryPath<T> = T extends "digital-content"
  ? `digital-content/${"software" | "ebooks" | "music" | "videos"}`
  : T extends "electronics"
  ? `electronics/${"smartphones" | "laptops" | "tablets"}`
  : T;

// Conditional Types con Discriminated Unions
type Product<T extends ProductCategory> = BaseProduct & {
  category: CategoryPath<T>;
} & ProductSpecificProps<T>;

// Type Guards funcionales
function isValidCreateProductRequest<T extends ProductCategory>(
  data: unknown,
  category: T
): data is CreateProductRequest<T>;
```

## 🏗️ Arquitectura

```
src/
├── types/
│   └── product.ts          # Definiciones de tipos principales
├── guards/
│   └── productGuards.ts    # Type guards y validaciones
├── services/
│   └── ProductService.ts   # Lógica de negocio
└── app.ts                  # Demo y mock repository
```

## 🔧 Instalación y Uso

```bash
# Clonar repositorio
git clone https://github.com/TU_USERNAME/product-validation-system.git
cd product-validation-system

# Instalar dependencias
npm install

# Compilar TypeScript
npm run build

# Ejecutar demo
npm start

# Desarrollo con watch mode
npm run dev
```

## 📊 Demo Incluida

El sistema incluye una demostración completa que muestra:

1. ✅ Creación de productos digitales y físicos
2. ✅ Validación type-safe por categoría
3. ✅ Búsqueda y filtrado con type guards
4. ✅ Actualizaciones parciales con deep merge
5. ✅ Manejo de errores y edge cases
6. ✅ Template literal types en acción
7. ✅ Conditional types con discriminated unions
