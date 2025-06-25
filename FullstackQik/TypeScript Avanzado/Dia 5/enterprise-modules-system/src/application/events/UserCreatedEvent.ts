import { DomainEvent } from "../../shared/types/events";
import { v4 as uuidv4 } from "uuid";

export interface UserCreatedEvent extends DomainEvent {
  readonly eventName: "user.created";
  readonly userId: string;
  readonly email: string;
  readonly name: string;
}

export class UserCreatedEvent implements UserCreatedEvent {
  readonly id: string = uuidv4();
  readonly occurredOn: Date = new Date();
  readonly eventName = "user.created" as const;

  constructor(
    public readonly userId: string,
    public readonly email: string,
    public readonly name: string
  ) {}
}

// Declaration merging para registrar el evento
declare module "../../shared/types/events" {
  interface EventRegistry {
    "user.created": UserCreatedEvent;
  }
}
