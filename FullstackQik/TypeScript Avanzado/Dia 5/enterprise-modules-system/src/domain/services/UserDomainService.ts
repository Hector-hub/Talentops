import { IUserRepository } from "../repositories/IUserRepository";
import { Email } from "../value-objects/Email";

export class UserDomainService {
  constructor(private readonly userRepository: IUserRepository) {}

  async isEmailUnique(email: string): Promise<boolean> {
    const existingUser = await this.userRepository.findByEmail(email);
    return existingUser === null;
  }

  async validateUserCreation(userData: {
    email: string;
    name: string;
  }): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];

    // Validate email format
    try {
      new Email(userData.email);
    } catch (error) {
      errors.push("Invalid email format");
    }

    // Validate name
    if (!userData.name || userData.name.trim().length < 2) {
      errors.push("Name must be at least 2 characters long");
    }

    // Check email uniqueness
    if (!(await this.isEmailUnique(userData.email))) {
      errors.push("Email already exists");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}
