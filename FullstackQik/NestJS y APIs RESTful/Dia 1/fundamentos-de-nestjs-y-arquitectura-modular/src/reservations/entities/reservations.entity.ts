export enum ReservationStatus {
  ACTIVE = "ACTIVE",
  FULFILLED = "FULFILLED",
  CANCELLED = "CANCELLED",
}

export class Reservation {
  constructor(
    public readonly id: string,
    public readonly bookId: string,
    public readonly memberId: string,
    public readonly reservationDate: Date = new Date(),
    public status: ReservationStatus = ReservationStatus.ACTIVE
  ) {}

  fulfill(): void {
    if (this.status !== ReservationStatus.ACTIVE) return;

    this.status = ReservationStatus.FULFILLED;
  }

  cancel(): void {
    if (this.status !== ReservationStatus.ACTIVE) return;

    this.status = ReservationStatus.CANCELLED;
  }
}
