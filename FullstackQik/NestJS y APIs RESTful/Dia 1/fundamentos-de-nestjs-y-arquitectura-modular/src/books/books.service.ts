import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { BookRepository } from "./repositories/book.repository";
import { CreateBookDto } from "./dto/create-book.dto";
import { Book } from "./entities/book.entity";
import { IdGenerator } from "../shared/interfaces/id-generator.interface";

@Injectable()
export class BooksService {
  constructor(
    private readonly bookRepository: BookRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async createBook(createBookDto: CreateBookDto): Promise<Book> {
    // Check if book with ISBN already exists
    const existingBook = await this.bookRepository.findByIsbn(
      createBookDto.isbn
    );
    if (existingBook) {
      throw new ConflictException("Book with this ISBN already exists");
    }

    // Create new book
    const book = new Book(
      this.idGenerator.generate(),
      createBookDto.isbn,
      createBookDto.title,
      createBookDto.author,
      createBookDto.publishedYear
    );

    await this.bookRepository.save(book);
    return book;
  }

  async findAvailableBooks(): Promise<Book[]> {
    return this.bookRepository.findAvailable();
  }

  async findById(id: string): Promise<Book> {
    const book = await this.bookRepository.findById(id);
    if (!book) {
      throw new NotFoundException("Book not found");
    }
    return book;
  }
}
