import { UserEntity } from "../entities/User";

export interface IUserRepository {
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  findAll(): Promise<UserEntity[]>;
  save(user: UserEntity): Promise<void>;
  delete(id: string): Promise<void>;
}
