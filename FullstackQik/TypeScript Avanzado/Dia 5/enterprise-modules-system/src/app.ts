import express from "express";
import { Config, Adapters, InMemoryUserRepository } from "./infrastructure";
import { EventBus, UserService, EventHandlers } from "./application";
import { UserController, createUserRoutes, Middleware } from "./presentation";

class App {
  private readonly app = express();
  private readonly config = Config.loadAllConfigs();

  // Infrastructure layer
  private readonly userRepository = new InMemoryUserRepository();
  private readonly emailAdapter = Adapters.createEmailAdapter();
  private readonly loggerAdapter = Adapters.createLoggerAdapter();
  private readonly cacheAdapter = Adapters.createCacheAdapter();

  // Application layer
  private readonly eventBus = new EventBus();
  private readonly userService = new UserService(
    this.userRepository,
    this.eventBus
  );
  private readonly eventHandlers = new EventHandlers(
    this.emailAdapter,
    this.loggerAdapter,
    this.cacheAdapter
  );

  // Presentation layer
  private readonly userController = new UserController(this.userService);

  constructor() {
    this.setupMiddleware();
    this.setupEventHandlers();
    this.setupRoutes();
    this.setupErrorHandling();
  }

  private setupMiddleware(): void {
    this.app.use(express.json());
    this.app.use(Middleware.correlationId);
    this.app.use(Middleware.requestLogger);
  }

  private setupEventHandlers(): void {
    // Registrar event handlers usando declaration merging
    this.eventBus.subscribe(
      "user.created",
      this.eventHandlers.handleUserCreated.bind(this.eventHandlers)
    );

    this.eventBus.subscribe(
      "product.stock.updated",
      this.eventHandlers.handleProductStockUpdated.bind(this.eventHandlers)
    );

    this.loggerAdapter.info("Event handlers registered", {
      userCreatedHandlers: this.eventBus.getSubscribersCount("user.created"),
      productStockUpdatedHandlers: this.eventBus.getSubscribersCount(
        "product.stock.updated"
      ),
    });
  }

  private setupRoutes(): void {
    // API routes
    this.app.use("/api/v1", createUserRoutes(this.userController));

    // Root endpoint
    this.app.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Enterprise Modules System v2 - TypeScript Advanced",
        version: this.config.app.apiVersion,
        environment: this.config.app.environment,
        timestamp: new Date().toISOString(),
        features: {
          declarationMerging: "Events with type-safe registry",
          namespaces: "Config, Adapters, Middleware",
          hexagonalArchitecture:
            "Domain, Application, Infrastructure, Presentation",
          pathMapping: "TypeScript path aliases configured",
          barrelExports: "Clean imports from each layer",
        },
      });
    });
  }

  private setupErrorHandling(): void {
    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Endpoint not found",
        path: req.originalUrl,
      });
    });

    // Error handler (debe ser el último middleware)
    this.app.use((error: Error, req: any, res: any, next: any) => {
      console.error(`[ERROR] ${req.method} ${req.path}:`, error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
        correlationId: req.headers["x-correlation-id"],
      });
    });
  }

  public start(): void {
    const port = this.config.app.port;

    this.app.listen(port, () => {
      console.log("\n===== ENTERPRISE MODULES SYSTEM V2 =====");
      console.log(`Server running on http://localhost:${port}`);
      console.log(`Environment: ${this.config.app.environment}`);
      console.log(`API Version: ${this.config.app.apiVersion}`);
      console.log("\nAvailable endpoints:");
      console.log("  GET  /                     - System info");
      console.log("  GET  /api/v1/health        - Health check");
      console.log("  POST /api/v1/users         - Create user");
      console.log("  GET  /api/v1/users/:id     - Get user by ID");
      console.log("\n Features demonstrated:");
      console.log("  Declaration merging (Events)");
      console.log("  Namespaces (Config, Adapters, Middleware)");
      console.log("  Hexagonal architecture");
      console.log("  TypeScript path mapping");
      console.log("  Barrel exports");
      console.log("  Type-safe event system");
      console.log("==========================================\n");
    });
  }
}

// Start the application
const app = new App();
app.start();
