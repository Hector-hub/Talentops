import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { ReservationRepository } from "./repositories/reservation.repository";
import { IdGenerator } from "src/shared/interfaces/id-generator.interface";
import { BooksService } from "src/books/books.service";
import { MembersService } from "src/members/members.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";
import { BookStatus } from "src/books/entities/book.entity";
import { Reservation } from "./entities/reservations.entity";

@Injectable()
export class ReservationsService {
  constructor(
    private readonly reservationRepository: ReservationRepository,
    private readonly idGenerator: IdGenerator,
    private readonly booksService: BooksService,
    private readonly membersService: MembersService
  ) {}

  async createReservation(
    createReservationDto: CreateReservationDto
  ): Promise<Reservation> {
    const book = await this.booksService.findById(createReservationDto.bookId);
    if (book.status === BookStatus.AVAILABLE) {
      throw new BadRequestException("Cannot reserve an available book");
    }
    const member = await this.membersService.findById(
      createReservationDto.memberId
    );
    if (!member) {
      throw new BadRequestException("Member does not exist");
    }
    const activeReservations =
      await this.reservationRepository.findActiveByBookId(
        createReservationDto.bookId
      );

    const hasActiveReservation = activeReservations.some(
      (reservation: Reservation) =>
        reservation.memberId === createReservationDto.memberId
    );

    if (hasActiveReservation) {
      throw new ConflictException(
        "Member already has an active reservation for this book"
      );
    }

    const reservation = new Reservation(
      this.idGenerator.generate(),
      createReservationDto.bookId,
      createReservationDto.memberId
    );

    await this.reservationRepository.save(reservation);

    return reservation;
  }

  async findReservationsByMemberId(memberId: string): Promise<Reservation[]> {
    const member = await this.membersService.findById(memberId);

    if (!member) throw new BadRequestException("Member does not exist");

    return this.reservationRepository.findByMemberId(memberId);
  }

  async cancelReservation(reservationId: string): Promise<void> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) throw new NotFoundException("Reservation does not exist");

    reservation.cancel();

    await this.reservationRepository.save(reservation);
  }
}
