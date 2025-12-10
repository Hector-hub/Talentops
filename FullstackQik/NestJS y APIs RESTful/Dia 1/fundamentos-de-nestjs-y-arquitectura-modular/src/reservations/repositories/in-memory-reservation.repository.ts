import {
  Reservation,
  ReservationStatus,
} from "../entities/reservations.entity";
import { ReservationRepository } from "./reservation.repository";
import { Injectable } from "@nestjs/common";

@Injectable()
export class InMemoryReservationRepository extends ReservationRepository {
  private reservations: Map<string, Reservation> = new Map();

  save(reservation: Reservation): Promise<void> {
    this.reservations.set(reservation.id, reservation);
    return Promise.resolve();
  }
  findById(id: string): Promise<Reservation | null> {
    const reservation = this.reservations.get(id) || null;
    return Promise.resolve(reservation);
  }
  findByMemberId(memberId: string): Promise<Reservation[]> {
    const reservation = [...this.reservations.values()].filter(
      (reservation) => reservation.memberId === memberId
    );
    return Promise.resolve(reservation);
  }
  findActiveByBookId(bookId: string): Promise<Reservation[]> {
    const reservations = [...this.reservations.values()]
      .filter(
        (reservation) =>
          reservation.bookId === bookId && reservation.status === "ACTIVE"
      )
      .sort(
        (a, b) => a.reservationDate.getTime() - b.reservationDate.getTime()
      );
    return Promise.resolve(reservations);
  }
}
