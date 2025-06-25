import { ValueObject } from "../../shared/types";

export class Email implements ValueObject<string> {
  constructor(public readonly value: string) {
    if (!this.isValidEmail(value)) {
      throw new Error("Invalid email format");
    }
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  equals(other: ValueObject<string>): boolean {
    return this.value === other.value;
  }

  getDomain(): string {
    return this.value.split("@")[1];
  }

  toString(): string {
    return this.value;
  }
}
