import { IUserRepository, UserEntity } from "../../domain/index";
import { CreateUserDto, UserResponseDto } from "../dtos/UserDto";
import { IEventBus } from "../../shared/types/events";
import { UserCreatedEvent } from "../events/UserCreatedEvent";
import { Result } from "../../shared/types";
import { v4 as uuidv4 } from "uuid";

export class UserService {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly eventBus: IEventBus
  ) {}

  async createUser(
    dto: CreateUserDto
  ): Promise<Result<UserResponseDto, string>> {
    try {
      // Verificar si el usuario ya existe
      const existingUser = await this.userRepository.findByEmail(dto.email);
      if (existingUser) {
        return { success: false, error: "User with this email already exists" };
      }

      // Crear nueva entidad
      const userId = uuidv4();
      const user = UserEntity.create({
        id: userId,
        email: dto.email,
        name: dto.name,
      });

      // Guardar en repositorio
      await this.userRepository.save(user);

      // Publicar evento
      const event = new UserCreatedEvent(user.id, user.email, user.name);
      await this.eventBus.publish("user.created", event);

      // Retornar resultado
      const response: UserResponseDto = {
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

  async getUserById(id: string): Promise<Result<UserResponseDto, string>> {
    try {
      const user = await this.userRepository.findById(id);
      if (!user) {
        return { success: false, error: "User not found" };
      }

      const response: UserResponseDto = {
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
}
