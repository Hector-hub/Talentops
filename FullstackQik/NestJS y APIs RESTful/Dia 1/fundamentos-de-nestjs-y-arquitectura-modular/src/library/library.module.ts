import { Module } from "@nestjs/common";
import { BooksModule } from "../books/books.module";
import { MembersModule } from "../members/members.module";
import { LibraryController } from "./library.controller";
import { LibraryService } from "./library.service";
import { IdGenerator } from "../shared/interfaces/id-generator.interface";
import { UuidGenerator } from "../shared/services/uuid-generator.service";
import { ReservationsModule } from "src/reservations/reservations.module";

@Module({
  imports: [BooksModule, MembersModule, ReservationsModule],
  controllers: [LibraryController],
  providers: [
    LibraryService,
    {
      provide: IdGenerator,
      useClass: UuidGenerator,
    },
  ],
})
export class LibraryModule {}
