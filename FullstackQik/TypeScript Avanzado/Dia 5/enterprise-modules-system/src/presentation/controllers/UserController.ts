import { Request, Response } from "express";
import { UserService, CreateUserDto } from "../../application/index";
import { ApiResponse } from "../../shared/types";

export class UserController {
  constructor(private readonly userService: UserService) {}

  async createUser(req: Request, res: Response): Promise<void> {
    try {
      const dto: CreateUserDto = req.body;
      const result = await this.userService.createUser(dto);

      if (result.success) {
        const response: ApiResponse = {
          success: true,
          data: result.data,
          message: "User created successfully",
        };
        res.status(201).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: result.error,
        };
        res.status(400).json(response);
      }
    } catch (error) {
      console.error("Error in createUser controller:", error);
      const response: ApiResponse = {
        success: false,
        error: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const result = await this.userService.getUserById(id);

      if (result.success) {
        const response: ApiResponse = {
          success: true,
          data: result.data,
        };
        res.status(200).json(response);
      } else {
        const response: ApiResponse = {
          success: false,
          error: result.error,
        };
        res.status(404).json(response);
      }
    } catch (error) {
      console.error("Error in getUserById controller:", error);
      const response: ApiResponse = {
        success: false,
        error: "Internal server error",
      };
      res.status(500).json(response);
    }
  }

  async healthCheck(req: Request, res: Response): Promise<void> {
    const response: ApiResponse = {
      success: true,
      data: {
        status: "healthy",
        timestamp: new Date().toISOString(),
        service: "enterprise-modules-system2",
      },
      message: "Service is running",
    };
    res.status(200).json(response);
  }
}
