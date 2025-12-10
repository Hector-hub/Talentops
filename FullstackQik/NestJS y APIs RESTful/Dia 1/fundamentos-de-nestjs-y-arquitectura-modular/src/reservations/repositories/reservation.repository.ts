import { Reservation } from "../entities/reservations.entity";

export abstract class ReservationRepository {
  abstract save(reservation: Reservation): Promise<void>;
  abstract findById(id: string): Promise<Reservation | null>;
  abstract findByMemberId(memberId: string): Promise<Reservation[]>;
  abstract findActiveByBookId(bookId: string): Promise<Reservation[]>;
}
