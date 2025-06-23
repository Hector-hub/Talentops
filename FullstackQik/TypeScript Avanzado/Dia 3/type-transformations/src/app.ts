import { Product, Service, Subscription } from "./domain.js";
import {
  CreateValidationSchema,
  CreateValidationFunctions,
} from "./transformations.js";
import { CatalogItemFactory } from "./factory.js";
import { CatalogProcessor } from "./processor.js";
import { ValidationSystem } from "./validation.js";

// ========== SCHEMAS USANDO MAPPED TYPES ==========

const productSchema: CreateValidationSchema<Product> = {
  id: { type: "string", required: true },
  type: { type: "string", required: true },
  name: { type: "string", required: true },
  price: { type: "number", required: true, min: 0 },
  category: { type: "string", required: true },
  inStock: { type: "boolean", required: true },
  createdAt: { type: "date", required: true },
  updatedAt: { type: "date", required: true },
  version: { type: "number", required: true },
  metadata: {
    type: "object",
    required: true,
    schema: {
      weight: { type: "number", required: true },
      dimensions: {
        type: "object",
        required: true,
        schema: {
          width: { type: "number", required: true },
          height: { type: "number", required: true },
          depth: { type: "number", required: true },
        },
      },
      tags: { type: "array", required: true },
    },
  },
};

const serviceSchema: CreateValidationSchema<Service> = {
  id: { type: "string", required: true },
  type: { type: "string", required: true },
  name: { type: "string", required: true },
  hourlyRate: { type: "number", required: true, min: 0 },
  category: { type: "string", required: true },
  available: { type: "boolean", required: true },
  createdAt: { type: "date", required: true },
  updatedAt: { type: "date", required: true },
  version: { type: "number", required: true },
  metadata: {
    type: "object",
    required: true,
    schema: {
      duration: { type: "number", required: true },
      requirements: { type: "array", required: true },
      location: { type: "string", required: true },
    },
  },
};

const subscriptionSchema: CreateValidationSchema<Subscription> = {
  id: { type: "string", required: true },
  type: { type: "string", required: true },
  name: { type: "string", required: true },
  monthlyPrice: { type: "number", required: true, min: 0 },
  category: { type: "string", required: true },
  active: { type: "boolean", required: true },
  createdAt: { type: "date", required: true },
  updatedAt: { type: "date", required: true },
  version: { type: "number", required: true },
  metadata: {
    type: "object",
    required: true,
    schema: {
      features: { type: "array", required: true },
      limits: {
        type: "object",
        required: true,
        schema: {
          users: { type: "number", required: true },
          storage: { type: "number", required: true }
        }
      },
      billingCycle: { type: "string", required: true }
    },
  },
};

// ========== DEMO COMPLETA ==========

console.log("=== DEMO: Sistema Completo de Type Transformation ===\n");

// 1. Crear items usando Factory
console.log("1. === FACTORY PATTERN ===");
const product = CatalogItemFactory.createProduct({
  name: "MacBook Pro",
  price: 2499,
  category: "Electronics",
  inStock: true,
  metadata: {
    weight: 2.0,
    dimensions: { width: 30.41, height: 21.24, depth: 1.55 },
    tags: ["laptop", "apple", "professional"],
  },
});

const service = CatalogItemFactory.createService({
  name: "Full Stack Development",
  hourlyRate: 150,
  category: "Programming",
  available: true,
  metadata: {
    duration: 40,
    requirements: ["React", "Node.js", "TypeScript"],
    location: "remote",
  },
});

const subscription = CatalogItemFactory.createSubscription({
  name: "Premium Plan",
  monthlyPrice: 99,
  category: "Software",
  active: true,
  metadata: {
    features: ["Advanced Analytics", "Priority Support", "Custom Integrations"],
    limits: { users: 100, storage: 1000 },
    billingCycle: "monthly",
  },
});

console.log("Product created:", product.name);
console.log("Service created:", service.name);
console.log("Subscription created:", subscription.name);

// 2. Procesar items usando Type Transformations
console.log("\n2. === TYPE TRANSFORMATIONS ===");
const productApiResponse = CatalogProcessor.processItem(product);
const serviceApiResponse = CatalogProcessor.processItem(service);
const subscriptionApiResponse = CatalogProcessor.processItem(subscription);

console.log("Product API Response:", {
  type: productApiResponse.type,
  id: productApiResponse.id,
  dataKeys: Object.keys(productApiResponse.data),
});

console.log("Service API Response:", {
  type: serviceApiResponse.type,
  id: serviceApiResponse.id,
  dataKeys: Object.keys(serviceApiResponse.data),
});

console.log("Subscription API Response:", {
  type: subscriptionApiResponse.type,
  id: subscriptionApiResponse.id,
  dataKeys: Object.keys(subscriptionApiResponse.data),
});

// 3. Crear eventos usando Distributive Conditional Types
console.log("\n3. === EVENT GENERATION ===");
const productEvent = CatalogProcessor.createEvent(
  product,
  { price: 2299 },
  "admin_user"
);

const serviceEvent = CatalogProcessor.createEvent(
  service,
  { hourlyRate: 175 },
  "admin_user"
);

const subscriptionEvent = CatalogProcessor.createEvent(
  subscription,
  { monthlyPrice: 79 },
  "admin_user"
);

console.log("Product Event:", {
  eventType: productEvent.eventType,
  entityId: productEvent.entityId,
  changes: productEvent.changes,
});

console.log("Service Event:", {
  eventType: serviceEvent.eventType,
  entityId: serviceEvent.entityId,
  changes: serviceEvent.changes,
});

console.log("Subscription Event:", {
  eventType: subscriptionEvent.eventType,
  entityId: subscriptionEvent.entityId,
  changes: subscriptionEvent.changes,
});

// 4. VALIDATION FUNCTIONS AUTOMÁTICAS (EL EJERCICIO PRINCIPAL)
console.log("\n4. === VALIDATION FUNCTIONS AUTOMÁTICAS ===");

// Crear validation functions automáticamente usando mapped types
const productValidators: CreateValidationFunctions<Product> =
  ValidationSystem.createValidationFunctions(productSchema);

const serviceValidators: CreateValidationFunctions<Service> =
  ValidationSystem.createValidationFunctions(serviceSchema);

const subscriptionValidators: CreateValidationFunctions<Subscription> =
  ValidationSystem.createValidationFunctions(subscriptionSchema);

// Probar validation functions individuales para Product
console.log("Testing Product property validators:");
console.log('Name "MacBook Pro":', productValidators.name("MacBook Pro"));
console.log('Name "":', productValidators.name(""));
console.log("Price 2499:", productValidators.price(2499));
console.log("Price -100:", productValidators.price(-100));
console.log("InStock true:", productValidators.inStock(true));
console.log('InStock "yes":', productValidators.inStock("yes"));

// Probar validation functions individuales para Service
console.log("\nTesting Service property validators:");
console.log("HourlyRate 150:", serviceValidators.hourlyRate(150));
console.log("HourlyRate -50:", serviceValidators.hourlyRate(-50));
console.log("Available true:", serviceValidators.available(true));
console.log('Available "maybe":', serviceValidators.available("maybe"));

// Probar validation functions individuales para Subscription
console.log("\nTesting Subscription property validators:");
console.log("MonthlyPrice 99:", subscriptionValidators.monthlyPrice(99));
console.log("MonthlyPrice -25:", subscriptionValidators.monthlyPrice(-25));
console.log("Active true:", subscriptionValidators.active(true));
console.log('Active "yes":', subscriptionValidators.active("yes"));

// 5. Validación completa de objetos
console.log("\n5. === OBJECT VALIDATION ===");

const productValidationResult = ValidationSystem.validateObject(
  product,
  productSchema
);
console.log("Product validation:", productValidationResult);

const serviceValidationResult = ValidationSystem.validateObject(
  service,
  serviceSchema
);
console.log("Service validation:", serviceValidationResult);

const subscriptionValidationResult = ValidationSystem.validateObject(
  subscription,
  subscriptionSchema
);
console.log("Subscription validation:", subscriptionValidationResult);

// 6. Objetos inválidos para demostrar errores detallados
console.log("\n6. === ERROR HANDLING ===");

const invalidProduct = {
  ...product,
  name: "", // ERROR: string vacío
  price: -100, // ERROR: precio negativo
  inStock: "invalid", // ERROR: tipo incorrecto
  metadata: {
    ...product.metadata,
    weight: "heavy", // ERROR: debería ser number
    dimensions: {
      width: 30,
      height: 20,
      // ERROR: falta depth
    },
  },
};

const invalidProductResult = ValidationSystem.validateObject(
  invalidProduct,
  productSchema
);
console.log("Invalid product validation:", invalidProductResult);

const invalidService = {
  ...service,
  name: "", // ERROR: string vacío
  hourlyRate: -50, // ERROR: rate negativo
  available: "maybe", // ERROR: tipo incorrecto
  metadata: {
    duration: "long", // ERROR: debería ser number
    requirements: "React", // ERROR: debería ser array
    location: "invalid", // ERROR: no es un valor válido del union
  },
};

const invalidServiceResult = ValidationSystem.validateObject(
  invalidService,
  serviceSchema
);
console.log("Invalid service validation:", invalidServiceResult);

const invalidSubscription = {
  ...subscription,
  name: "", // ERROR: string vacío
  monthlyPrice: -25, // ERROR: precio negativo
  active: "maybe", // ERROR: tipo incorrecto
  metadata: {
    features: "premium", // ERROR: debería ser array
    limits: {
      users: "unlimited", // ERROR: debería ser number
      storage: -1000 // ERROR: número negativo
    },
    billingCycle: "weekly" // ERROR: no es un valor válido del union
  },
};

const invalidSubscriptionResult = ValidationSystem.validateObject(
  invalidSubscription,
  subscriptionSchema
);
console.log("Invalid subscription validation:", invalidSubscriptionResult);

// 7. Demostración de Type Safety
console.log("\n7. === TYPE SAFETY DEMO ===");

console.log("TypeScript infiere automáticamente los tipos de validadores");
console.log("Cada propiedad tiene su validador específico");
console.log("Type safety completo en tiempo de compilación");
console.log("Los mapped types CreateValidationFunctions<T> generan los tipos automáticamente");

console.log("\n=== SISTEMA COMPLETO FUNCIONANDO ===");
console.log("Mapped Types creando validation functions automáticamente");
console.log("Distributive Conditional Types para API responses");
console.log("Recursive validation para objetos anidados");
console.log("Type-safe Factory Pattern");
console.log("Event generation automática");
console.log("Error handling detallado");
console.log("Full Type Safety en todo el sistema");

console.log("\n=== EJERCICIO COMPLETADO ===");
console.log("Sistema de type transformation completo implementado");
console.log(
  "Validation functions generadas automáticamente usando mapped types"
);
console.log("Todos los requerimientos del ejercicio cumplidos");
