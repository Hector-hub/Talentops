import { Log, Cache, Validate, Retry, Transaction } from "../decorators";
import { ValidationSchema } from "../types";

const CreateUserSchema: ValidationSchema = {
  validate: (data: any) => {
    if (!data || typeof data !== "object") {
      return { error: { message: "Data must be an object" } };
    }

    if (!data.email || typeof data.email !== "string") {
      return { error: { message: "Email is required and must be a string" } };
    }

    if (!data.name || typeof data.name !== "string") {
      return { error: { message: "Name is required and must be a string" } };
    }

    return { error: null };
  },
};

const UpdateUserSchema: ValidationSchema = {
  validate: (data: any) => {
    if (!data || typeof data !== "object") {
      return { error: { message: "Data must be an object" } };
    }

    if (data.email && typeof data.email !== "string") {
      return { error: { message: "Email must be a string" } };
    }

    if (data.name && typeof data.name !== "string") {
      return { error: { message: "Name must be a string" } };
    }

    return { error: null };
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt?: Date;
}

export interface CreateUserData {
  email: string;
  name: string;
}

export interface UpdateUserData {
  email?: string;
  name?: string;
}

const userDatabase = new Map<string, User>();

export class UserService {
  @Log({ level: "info" })
  @Cache({
    ttl: 300,
    keyGenerator: (email: string) => `user:email:${email}`,
  })
  @Retry({ attempts: 3, delay: 1000, backoff: 2 })
  async findByEmail(email: string): Promise<User | null> {
    if (Math.random() < 0.1) {
      throw new Error("Database connection failed");
    }

    await new Promise((resolve) => setTimeout(resolve, 100));

    const user = userDatabase.get(email);
    return user || null;
  }

  @Log({ level: "info" })
  @Transaction({ timeout: 5000 })
  @Validate(CreateUserSchema)
  async createUser(userData: CreateUserData): Promise<User> {
    console.log(`[USER_SERVICE] Creating user with data:`, userData);

    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new Error(`User with email ${userData.email} already exists`);
    }

    await new Promise((resolve) => setTimeout(resolve, 200));

    const user: User = {
      id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
      email: userData.email,
      name: userData.name,
      createdAt: new Date(),
    };

    userDatabase.set(userData.email, user);

    console.log(`[USER_SERVICE] User created successfully:`, user);
    return user;
  }

  @Log({ level: "info" })
  @Transaction({ timeout: 3000 })
  @Validate(UpdateUserSchema)
  async updateUser(id: string, userData: UpdateUserData): Promise<User> {
    console.log(`[USER_SERVICE] Updating user ${id} with data:`, userData);

    let userToUpdate: User | null = null;
    for (const user of userDatabase.values()) {
      if (user.id === id) {
        userToUpdate = user;
        break;
      }
    }

    if (!userToUpdate) {
      throw new Error(`User with id ${id} not found`);
    }

    await new Promise((resolve) => setTimeout(resolve, 150));

    const updatedUser: User = {
      ...userToUpdate,
      email: userData.email || userToUpdate.email,
      name: userData.name || userToUpdate.name,
      updatedAt: new Date(),
    };

    userDatabase.set(updatedUser.email, updatedUser);

    console.log(`[USER_SERVICE] User updated successfully:`, updatedUser);
    return updatedUser;
  }

  @Log({ level: "info" })
  @Transaction({ timeout: 10000 })
  async createMultipleUsers(usersData: CreateUserData[]): Promise<User[]> {
    console.log(`[USER_SERVICE] Creating ${usersData.length} users`);

    const createdUsers: User[] = [];

    for (const userData of usersData) {
      try {
        const user = await this.createUser(userData);
        createdUsers.push(user);
      } catch (error) {
        console.error(
          `[USER_SERVICE] Failed to create user ${userData.email}:`,
          error
        );
        throw error;
      }
    }

    console.log(
      `[USER_SERVICE] Successfully created ${createdUsers.length} users`
    );
    return createdUsers;
  }

  @Log({ level: "debug" })
  async clearDatabase(): Promise<void> {
    userDatabase.clear();
    console.log("[USER_SERVICE] Database cleared");
  }

  @Log({ level: "info" })
  @Cache({ ttl: 60 })
  async getAllUsers(): Promise<User[]> {
    await new Promise((resolve) => setTimeout(resolve, 50));
    return Array.from(userDatabase.values());
  }
}
