import { IsNotEmpty, IsString } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class BorrowBookDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID of the member",
  })
  @IsNotEmpty()
  @IsString()
  memberId: string;

  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174001",
    description: "ID of the book",
  })
  @IsNotEmpty()
  @IsString()
  bookId: string;
}
