import { Injectable, BadRequestException } from "@nestjs/common";
import { BooksService } from "../books/books.service";
import { MembersService } from "../members/members.service";
import { BookRepository } from "../books/repositories/book.repository";
import { MemberRepository } from "../members/repositories/member.repository";
import { BorrowBookDto } from "./dto/borrow-book.dto";
import { ReservationRepository } from "src/reservations/repositories/reservation.repository";

@Injectable()
export class LibraryService {
  constructor(
    private readonly booksService: BooksService,
    private readonly membersService: MembersService,
    private readonly bookRepository: BookRepository,
    private readonly memberRepository: MemberRepository,
    private readonly reservationRepository: ReservationRepository
  ) {}

  async borrowBook(borrowBookDto: BorrowBookDto): Promise<void> {
    // Get member and book
    const member = await this.membersService.findById(borrowBookDto.memberId);
    const book = await this.booksService.findById(borrowBookDto.bookId);

    // Check if member can borrow
    if (!member.canBorrow()) {
      throw new BadRequestException("Member has reached borrowing limit");
    }

    // Borrow book
    book.borrow();
    member.borrowBook(book.id);

    // Save changes
    await this.bookRepository.save(book);
    await this.memberRepository.save(member);
  }

  async returnBook(memberId: string, bookId: string): Promise<void> {
    // Get member and book
    const member = await this.membersService.findById(memberId);
    const book = await this.booksService.findById(bookId);

    // Return book
    book.return();
    member.returnBook(bookId);

    // Save changes
    await this.bookRepository.save(book);
    await this.memberRepository.save(member);

    const activeReservation =
      await this.reservationRepository.findActiveByBookId(bookId);
    if (activeReservation.length > 0) {
      const nextReservation = activeReservation[0];
      nextReservation.fulfill();
      await this.reservationRepository.save(nextReservation);
    }
  }
}
