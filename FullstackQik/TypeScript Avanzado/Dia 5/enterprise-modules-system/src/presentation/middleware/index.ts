import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";

// Namespace para middleware
export namespace Middleware {
  // Correlation ID middleware
  export function correlationId(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const correlationId =
      (req.headers["x-correlation-id"] as string) || uuidv4();

    req.headers["x-correlation-id"] = correlationId;
    res.setHeader("x-correlation-id", correlationId);

    console.log(
      `[CORRELATION] ${req.method} ${req.path} - ID: ${correlationId}`
    );
    next();
  }

  // Request logging middleware
  export function requestLogger(
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const start = Date.now();

    res.on("finish", () => {
      const duration = Date.now() - start;
      console.log(
        `[REQUEST] ${req.method} ${req.path} - ${res.statusCode} (${duration}ms)`
      );
    });

    next();
  }

  // Error handling middleware
  export function errorHandler(
    error: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    console.error(`[ERROR] ${req.method} ${req.path}:`, error);

    res.status(500).json({
      success: false,
      message: "Internal server error",
      correlationId: req.headers["x-correlation-id"],
    });
  }

  // CORS middleware
  export function cors(req: Request, res: Response, next: NextFunction): void {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, x-correlation-id"
    );

    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  }

  // Validation middleware factory
  export function validateBody<T>(validator: (body: any) => body is T) {
    return (req: Request, res: Response, next: NextFunction): void => {
      if (!validator(req.body)) {
        res.status(400).json({
          success: false,
          message: "Invalid request body",
          correlationId: req.headers["x-correlation-id"],
        });
        return;
      }
      next();
    };
  }
}
