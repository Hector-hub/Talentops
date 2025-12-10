import { IsNotEmpty, IsString } from "class-validator";

export class CreateReservationDto {
  @IsNotEmpty()
  @IsString()
  bookId: string;

  @IsNotEmpty()
  @IsString()
  memberId: string;
}
