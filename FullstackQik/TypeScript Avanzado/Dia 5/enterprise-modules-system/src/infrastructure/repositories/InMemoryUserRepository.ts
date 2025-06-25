import { IUserRepository, UserEntity } from "../../domain/index";

export class InMemoryUserRepository implements IUserRepository {
  private users: Map<string, UserEntity> = new Map();

  async findById(id: string): Promise<UserEntity | null> {
    return this.users.get(id) || null;
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    for (const user of this.users.values()) {
      if (user.email === email) {
        return user;
      }
    }
    return null;
  }

  async findAll(): Promise<UserEntity[]> {
    return Array.from(this.users.values());
  }

  async save(user: UserEntity): Promise<void> {
    this.users.set(user.id, user);
    console.log(`User saved: ${user.id} - ${user.email}`);
  }

  async delete(id: string): Promise<void> {
    this.users.delete(id);
    console.log(`User deleted: ${id}`);
  }

  // Método adicional para desarrollo
  getAllUsers(): UserEntity[] {
    return Array.from(this.users.values());
  }
}
