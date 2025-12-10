export class Member {
  constructor(
    public readonly id: string,
    public readonly email: string,
    public readonly name: string,
    public readonly membershipDate: Date = new Date(),
    public borrowedBooks: string[] = []
  ) {}

  canBorrow(): boolean {
    return this.borrowedBooks.length < 5; // Max 5 books
  }

  borrowBook(bookId: string): void {
    if (!this.canBorrow()) {
      throw new Error("Member has reached borrowing limit");
    }
    this.borrowedBooks.push(bookId);
  }

  returnBook(bookId: string): void {
    const index = this.borrowedBooks.indexOf(bookId);
    if (index === -1) {
      throw new Error("Book not borrowed by this member");
    }
    this.borrowedBooks.splice(index, 1);
  }
}
