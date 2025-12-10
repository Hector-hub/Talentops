import { Module } from "@nestjs/common";
import { BooksController } from "./books.controller";
import { BooksService } from "./books.service";
import { BookRepository } from "./repositories/book.repository";
import { InMemoryBookRepository } from "./repositories/in-memory-book.repository";
import { IdGenerator } from "../shared/interfaces/id-generator.interface";
import { UuidGenerator } from "../shared/services/uuid-generator.service";

@Module({
  controllers: [BooksController],
  providers: [
    BooksService,
    {
      provide: BookRepository,
      useClass: InMemoryBookRepository,
    },
    {
      provide: IdGenerator,
      useClass: UuidGenerator,
    },
  ],
  exports: [BooksService, BookRepository],
})
export class BooksModule {}
