import { IsNotEmpty, IsString, IsNumber, Min, Max } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateBookDto {
  @ApiProperty({
    example: "978-3-16-148410-0",
    description: "ISBN of the book",
  })
  @IsNotEmpty()
  @IsString()
  isbn: string;

  @ApiProperty({ example: "Clean Code", description: "Title of the book" })
  @IsNotEmpty()
  @IsString()
  title: string;

  @ApiProperty({
    example: "Robert C. Martin",
    description: "Author of the book",
  })
  @IsNotEmpty()
  @IsString()
  author: string;

  @ApiProperty({ example: 2008, description: "Year the book was published" })
  @IsNumber()
  @Min(1000)
  @Max(new Date().getFullYear())
  publishedYear: number;
}
