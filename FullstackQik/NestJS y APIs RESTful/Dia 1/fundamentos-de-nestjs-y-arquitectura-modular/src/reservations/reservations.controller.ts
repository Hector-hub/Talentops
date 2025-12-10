import { Body, Controller, Delete, Get, Post, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { ReservationsService } from "./reservations.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@Controller("reservations")
@ApiTags("reservations")
export class ReservationsController {
  constructor(private readonly reservationsService: ReservationsService) {}

  @Post()
  @ApiOperation({ summary: "Create a new reservation" })
  async createReservation(@Body() createReservationDto: CreateReservationDto) {
    return this.reservationsService.createReservation(createReservationDto);
  }

  @Get("member/:memberId")
  @ApiOperation({ summary: "Get all reservations for a member" })
  async getReservations(@Param("memberId") memberId: string) {
    return this.reservationsService.findReservationsByMemberId(memberId);
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel a reservation" })
  async cancelReservation(@Param("id") id: string) {
    await this.reservationsService.cancelReservation(id);
    return { message: "Reservation cancelled successfully" };
  }
}
