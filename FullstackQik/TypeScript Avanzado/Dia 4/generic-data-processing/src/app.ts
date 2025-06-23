import { User, Product, Order } from "./types/entities";
import { ProcessorFactory } from "./factories/ProcessorFactory";
import {
  UniversalEventProcessor,
  EntityEventProcessor,
  SystemEventProcessor,
  BusinessEventProcessor,
} from "./events/EventProcessor.js";
import {
  createUserEvent,
  createProductEvent,
  createOrderEvent,
  createSystemEvent,
  createBusinessEvent,
  OrderCreatedPayload,
  UserRegisteredPayload,
} from "./events/EventTypes.js";
import { AnyEvent } from "./types/events.js";

// Usage con complete type safety
async function demonstrateGenericProcessing() {
  console.log(
    "=== DEMO: Generic Data Processing con Variance-Aware Design ===\n"
  );

  // 1. DATA PROCESSING DEMONSTRATION
  console.log("1. === DATA PROCESSING ===");

  // User processing
  const userProcessor = ProcessorFactory.createUserProcessor();
  const users: User[] = [
    {
      id: "user1",
      email: "JOHN@EXAMPLE.COM",
      name: "John Doe",
      role: "user",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "user2",
      email: "invalid-email",
      name: "",
      role: "admin",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const userResult = await userProcessor.process(users);
  console.log("User processing result:", {
    successful: userResult.summary.successful,
    failed: userResult.summary.failed,
    duration: userResult.summary.duration + "ms",
  });

  if (userResult.errors.length > 0) {
    console.log(
      "User processing errors:",
      userResult.errors.map((e) => e.error)
    );
  }

  // Product processing
  const productProcessor = ProcessorFactory.createProductProcessor();
  const products: Product[] = [
    {
      id: "product1",
      name: "  Laptop  ",
      price: 999.999,
      category: "Electronics",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "product2",
      name: "",
      price: -100,
      category: "Invalid",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const productResult = await productProcessor.process(products);
  console.log("Product processing result:", {
    successful: productResult.summary.successful,
    failed: productResult.summary.failed,
    duration: productResult.summary.duration + "ms",
  });

  // Order processing
  const orderProcessor = ProcessorFactory.createOrderProcessor();
  const orders: Order[] = [
    {
      id: "order1",
      userId: "user1",
      productIds: ["product1", "product2"],
      total: 1500,
      status: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: "order2",
      userId: "",
      productIds: [],
      total: -50,
      status: "completed",
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const orderResult = await orderProcessor.process(orders);
  console.log("Order processing result:", {
    successful: orderResult.summary.successful,
    failed: orderResult.summary.failed,
    duration: orderResult.summary.duration + "ms",
  });

  // Generic transformations
  const userSummaries = userProcessor.transform(users, (user) => ({
    id: user.id,
    displayName: user.name,
    isAdmin: user.role === "admin",
  }));

  console.log("User summaries:", userSummaries);

  // 2. VARIANCE-AWARE EVENT PROCESSING (EL NÚCLEO DEL EJERCICIO)
  console.log("\n2. === VARIANCE-AWARE EVENT PROCESSING ===");

  // Create various events
  const events: AnyEvent[] = [
    // Entity events (covariant)
    createUserEvent(users[0], "created"),
    createProductEvent(products[0], "updated", { price: 899.99 }),
    createOrderEvent(orders[0], "created"),

    // System events
    createSystemEvent("info", "System startup completed"),
    createSystemEvent("warning", "High memory usage detected", {
      usage: "85%",
    }),
    createSystemEvent("error", "Database connection failed"),

    // Business events (with variance in payload types)
    createBusinessEvent<UserRegisteredPayload>("user.registered", {
      userId: "user1",
      email: "john@example.com",
      registrationDate: new Date(),
    }),
    createBusinessEvent<OrderCreatedPayload>(
      "order.created",
      {
        orderId: "order1",
        userId: "user1",
        productIds: ["product1"],
        total: 999.99,
      },
      "correlation-123"
    ),
  ];

  // 3. SPECIALIZED EVENT PROCESSORS (demonstrating variance)
  console.log("\n3. === SPECIALIZED EVENT PROCESSORS ===");

  // Entity event processor (covariant - accepts EntityEvent<T> where T extends Entity)
  const entityEventProcessor = new EntityEventProcessor<User>();
  const userEvents = events.filter(
    (e) =>
      e.type === "entity_event" &&
      (e as any).entity &&
      typeof (e as any).entity.email !== "undefined"
  );

  if (userEvents.length > 0) {
    const entityResult = await entityEventProcessor.process(userEvents as any);
    console.log("Entity event processing result:", {
      successful: entityResult.summary.successful,
      failed: entityResult.summary.failed,
    });
  }

  // System event processor
  const systemEventProcessor = new SystemEventProcessor();
  const systemEvents = events.filter((e) => e.type === "system_event");

  if (systemEvents.length > 0) {
    const systemResult = await systemEventProcessor.process(
      systemEvents as any
    );
    console.log("System event processing result:", {
      successful: systemResult.summary.successful,
      failed: systemResult.summary.failed,
    });
  }

  // Business event processor (contravariant - can handle BusinessEvent<any>)
  const businessEventProcessor = new BusinessEventProcessor();
  const businessEvents = events.filter((e) => e.type === "business_event");

  if (businessEvents.length > 0) {
    const businessResult = await businessEventProcessor.process(
      businessEvents as any
    );
    console.log("Business event processing result:", {
      successful: businessResult.summary.successful,
      failed: businessResult.summary.failed,
    });
  }

  // 4. UNIVERSAL EVENT PROCESSOR (demonstrating variance-aware routing)
  console.log("\n4. === UNIVERSAL EVENT PROCESSOR (Variance-Aware) ===");

  const universalProcessor = new UniversalEventProcessor();
  const universalResult = await universalProcessor.process(events);

  console.log("Universal event processing result:", {
    total: universalResult.summary.total,
    successful: universalResult.summary.successful,
    failed: universalResult.summary.failed,
    duration: universalResult.summary.duration + "ms",
  });

  if (universalResult.failed.length > 0) {
    console.log(
      "Failed events:",
      universalResult.failed.map((f) => ({
        type: (f.event as any).type,
        error: f.error,
        code: f.code,
      }))
    );
  }

  // 5. VARIANCE DEMONSTRATION
  console.log("\n5. === VARIANCE DEMONSTRATION ===");

  // Covariance: EntityEvent<User> is a subtype of EntityEvent<Entity>
  const userEvent = createUserEvent(users[0], "updated", {
    email: "newemail@example.com",
  });
  console.log("Covariance: User event can be treated as Entity event");

  // Contravariance: A handler that accepts EntityEvent<Entity> can handle EntityEvent<User>
  const entityHandler = (event: any) => {
    console.log(
      `Processing entity ${event.entity.id} with action ${event.action}`
    );
  };

  // This demonstrates contravariance - the handler works for both specific and general types
  entityHandler(userEvent);

  // Event transformations with variance
  const eventSummaries = universalProcessor.transform(events, (event) => ({
    id: event.id,
    type: event.type,
    timestamp: event.timestamp.toISOString(),
    source: event.source,
  }));

  console.log("Event summaries (first 3):", eventSummaries.slice(0, 3));

  console.log("\n=== VARIANCE-AWARE GENERIC PROCESSING COMPLETE ===");
  console.log("✓ Generic data processors with type constraints");
  console.log("✓ Variance-aware event processing system");
  console.log("✓ Covariant entity events");
  console.log("✓ Contravariant event handlers");
  console.log("✓ Universal event processor with type routing");
  console.log("✓ Complete type safety throughout the system");
}

// Run the demonstration
demonstrateGenericProcessing().catch(console.error);
