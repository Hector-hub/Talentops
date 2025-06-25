import { Entity } from "../../shared/types";

export interface User extends Entity {
  readonly id: string;
  readonly email: string;
  readonly name: string;
  readonly createdAt: Date;
}

export class UserEntity implements User {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly createdAt: Date = new Date()
  ) {}

  static create(data: { id: string; email: string; name: string }): UserEntity {
    return new UserEntity(data.id, data.email, data.name);
  }
}
