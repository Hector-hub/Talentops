import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LibraryModule } from "./library/library.module";
import { ReservationsModule } from "./reservations/reservations.module";

@Module({
  imports: [ConfigModule.forRoot(), LibraryModule, ReservationsModule],
})
export class AppModule {}
