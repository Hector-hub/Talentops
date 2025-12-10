import { Injectable } from "@nestjs/common";
import { BookRepository } from "./book.repository";
import { Book, BookStatus } from "../entities/book.entity";

@Injectable()
export class InMemoryBookRepository extends BookRepository {
  private books: Map<string, Book> = new Map();

  async save(book: Book): Promise<void> {
    this.books.set(book.id, book);
  }

  async findById(id: string): Promise<Book | null> {
    return this.books.get(id) || null;
  }

  async findByIsbn(isbn: string): Promise<Book | null> {
    for (const book of this.books.values()) {
      if (book.isbn === isbn) {
        return book;
      }
    }
    return null;
  }

  async findAvailable(): Promise<Book[]> {
    return Array.from(this.books.values()).filter(
      (book) => book.status === BookStatus.AVAILABLE
    );
  }
}
