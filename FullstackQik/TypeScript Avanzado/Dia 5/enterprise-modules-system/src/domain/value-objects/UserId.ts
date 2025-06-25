import { ValueObject } from "../../shared/types";

export class UserId implements ValueObject<string> {
  constructor(public readonly value: string) {
    if (!value || value.length < 3) {
      throw new Error("UserId must be at least 3 characters long");
    }
  }

  equals(other: ValueObject<string>): boolean {
    return this.value === other.value;
  }

  toString(): string {
    return this.value;
  }
}
