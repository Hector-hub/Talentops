import { ValueObject } from "../../shared/types";

export class Money implements ValueObject<number> {
  constructor(
    public readonly value: number,
    public readonly currency: string = "USD"
  ) {
    if (value < 0) {
      throw new Error("Money value cannot be negative");
    }
    if (!currency || currency.length !== 3) {
      throw new Error("Currency must be a 3-letter code");
    }
  }

  equals(other: ValueObject<number>): boolean {
    return this.value === other.value;
  }

  add(other: Money): Money {
    if (this.currency !== other.currency) {
      throw new Error("Cannot add money with different currencies");
    }
    return new Money(this.value + other.value, this.currency);
  }

  multiply(factor: number): Money {
    return new Money(this.value * factor, this.currency);
  }

  toString(): string {
    return `${this.value.toFixed(2)} ${this.currency}`;
  }
}
