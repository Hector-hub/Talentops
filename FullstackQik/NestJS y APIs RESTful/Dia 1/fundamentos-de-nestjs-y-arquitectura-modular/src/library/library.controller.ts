import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { LibraryService } from "./library.service";
import { BorrowBookDto } from "./dto/borrow-book.dto";

@Controller("library")
@ApiTags("library")
export class LibraryController {
  constructor(private readonly libraryService: LibraryService) {}

  @Post("borrow")
  @ApiOperation({ summary: "Borrow a book" })
  async borrowBook(@Body() borrowBookDto: BorrowBookDto) {
    await this.libraryService.borrowBook(borrowBookDto);
    return { message: "Book borrowed successfully" };
  }

  @Post("return")
  @ApiOperation({ summary: "Return a book" })
  async returnBook(@Body() body: { memberId: string; bookId: string }) {
    await this.libraryService.returnBook(body.memberId, body.bookId);
    return { message: "Book returned successfully" };
  }
}
