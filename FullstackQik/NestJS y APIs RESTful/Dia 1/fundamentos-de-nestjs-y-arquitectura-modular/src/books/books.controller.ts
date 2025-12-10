import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { BooksService } from "./books.service";
import { CreateBookDto } from "./dto/create-book.dto";

@Controller("books")
@ApiTags("books")
export class BooksController {
  constructor(private readonly booksService: BooksService) {}

  @Post()
  @ApiOperation({ summary: "Create a new book" })
  async createBook(@Body() createBookDto: CreateBookDto) {
    return this.booksService.createBook(createBookDto);
  }

  @Get("available")
  @ApiOperation({ summary: "Get all available books" })
  async getAvailableBooks() {
    return this.booksService.findAvailableBooks();
  }

  @Get(":id")
  @ApiOperation({ summary: "Get book by ID" })
  async getBook(@Param("id") id: string) {
    return this.booksService.findById(id);
  }
}
