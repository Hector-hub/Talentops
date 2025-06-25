import {
  IUserRepository,
  UserEntity,
  UserDomainService,
} from "../../domain/index";
import { CreateUserRequest, UserResponse } from "../dtos/CreateUserRequest";
import { IEventBus } from "../../shared/types/events";
import { UserCreatedEvent } from "../events/UserCreatedEvent";
import { Result } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

export class UserApplicationService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly userDomainService: UserDomainService,
    private readonly eventBus: IEventBus
  ) {}

  async createUser(
    request: CreateUserRequest
  ): Promise<Result<UserResponse, string>> {
    try {
      // Validación usando domain service
      const validation = await this.userDomainService.validateUserCreation(
        request
      );
      if (!validation.isValid) {
        return { success: false, error: validation.errors.join(", ") };
      }

      // Crear nueva entidad
      const userId = uuidv4();
      const user = UserEntity.create({
        id: userId,
        email: request.email,
        name: request.name,
      });

      // Guardar en repositorio
      await this.userRepository.save(user);

      // Publicar evento
      const event = new UserCreatedEvent(user.id, user.email, user.name);
      await this.eventBus.publish("user.created", event);

      // Retornar resultado
      const response: UserResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      };

      return { success: true, data: response };
    } catch (error) {
      console.error("Error creating user:", error);
      return { success: false, error: "Failed to create user" };
    }
  }

  async getUserById(id: string): Promise<Result<UserResponse, string>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const response: UserResponse = {
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      };

      return { success: true, data: response };
    } catch (error) {
      console.error("Error getting user:", error);
      return { success: false, error: "Failed to get user" };
    }
  }

  async getAllUsers(): Promise<Result<UserResponse[], string>> {
    try {
      const users = await this.userRepository.findAll();
      const response = users.map((user) => ({
        id: user.id,
        email: user.email,
        name: user.name,
        createdAt: user.createdAt.toISOString(),
      }));

      return { success: true, data: response };
    } catch (error) {
      console.error("Error getting users:", error);
      return { success: false, error: "Failed to get users" };
    }
  }

  async deleteUser(id: string): Promise<Result<void, string>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      await this.userRepository.delete(id);
      return { success: true, data: undefined };
    } catch (error) {
      console.error("Error deleting user:", error);
      return { success: false, error: "Failed to delete user" };
    }
  }
}
