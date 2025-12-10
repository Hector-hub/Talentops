import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";
import { ApiProperty } from "@nestjs/swagger";

export class CreateMemberDto {
  @ApiProperty({
    example: "john.doe@example.com",
    description: "Email of the member",
  })
  @IsEmail()
  email: string;

  @ApiProperty({ example: "John Doe", description: "Name of the member" })
  @IsNotEmpty()
  @IsString()
  @MinLength(2)
  name: string;
}
