export enum BookStatus {
  AVAILABLE = "available",
  BORROWED = "borrowed",
  RESERVED = "reserved",
  MAINTENANCE = "maintenance",
}

export class Book {
  constructor(
    public readonly id: string,
    public readonly isbn: string,
    public readonly title: string,
    public readonly author: string,
    public readonly publishedYear: number,
    public status: BookStatus = BookStatus.AVAILABLE
  ) {}

  borrow(): void {
    if (this.status !== BookStatus.AVAILABLE) {
      throw new Error("Book is not available for borrowing");
    }
    this.status = BookStatus.BORROWED;
  }

  return(): void {
    if (this.status !== BookStatus.BORROWED) {
      throw new Error("Book is not currently borrowed");
    }
    this.status = BookStatus.AVAILABLE;
  }
}
