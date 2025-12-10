import { Injectable } from "@nestjs/common";
import { v4 as uuidv4 } from "uuid";
import { IdGenerator } from "../interfaces/id-generator.interface";

@Injectable()
export class UuidGenerator extends IdGenerator {
  generate(): string {
    return uuidv4();
  }
}
