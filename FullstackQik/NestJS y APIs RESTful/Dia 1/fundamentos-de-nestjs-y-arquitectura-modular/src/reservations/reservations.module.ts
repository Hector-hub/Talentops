import { Module } from "@nestjs/common";
import { ReservationsController } from "./reservations.controller";
import { ReservationsService } from "./reservations.service";
import { BooksModule } from "src/books/books.module";
import { MembersModule } from "src/members/members.module";
import { ReservationRepository } from "./repositories/reservation.repository";
import { InMemoryReservationRepository } from "./repositories/in-memory-reservation.repository";
import { IdGenerator } from "src/shared/interfaces/id-generator.interface";
import { UuidGenerator } from "src/shared/services/uuid-generator.service";

@Module({
  imports: [BooksModule, MembersModule],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    {
      provide: ReservationRepository,
      useClass: InMemoryReservationRepository,
    },
    {
      provide: IdGenerator,
      useClass: UuidGenerator,
    },
  ],
  exports: [ReservationsService, ReservationRepository],
})
export class ReservationsModule {}
