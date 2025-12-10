import { Book } from "../entities/book.entity";

export abstract class BookRepository {
  abstract save(book: Book): Promise<void>;
  abstract findById(id: string): Promise<Book | null>;
  abstract findByIsbn(isbn: string): Promise<Book | null>;
  abstract findAvailable(): Promise<Book[]>;
}
