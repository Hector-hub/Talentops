import { Router } from "express";
import { UserController } from "../controllers/UserController";
import { CreateUserRequest } from "../../application/index";

// Validator para CreateUserRequest
const validateCreateUserDto = (body: any): body is CreateUserRequest => {
  return (
    typeof body === "object" &&
    typeof body.email === "string" &&
    typeof body.name === "string" &&
    body.email.includes("@")
  );
};

export function createUserRoutes(userController: UserController): Router {
  const router = Router();

  // Health check
  router.get("/health", (req, res) => userController.healthCheck(req, res));

  // User routes
  router.post("/users", (req, res) => {
    // Simple validation
    if (!validateCreateUserDto(req.body)) {
      res.status(400).json({
        success: false,
        message: "Invalid request body",
      });
      return;
    }
    userController.createUser(req, res);
  });

  router.get("/users/:id", (req, res) => userController.getUserById(req, res));

  return router;
}
