import { Controller, Post, Get, Body, Param } from "@nestjs/common";
import { ApiTags, ApiOperation } from "@nestjs/swagger";
import { MembersService } from "./members.service";
import { CreateMemberDto } from "./dto/create-member.dto";

@Controller("members")
@ApiTags("members")
export class MembersController {
  constructor(private readonly membersService: MembersService) {}

  @Post()
  @ApiOperation({ summary: "Create a new member" })
  async createMember(@Body() createMemberDto: CreateMemberDto) {
    return this.membersService.createMember(createMemberDto);
  }

  @Get(":id")
  @ApiOperation({ summary: "Get member by ID" })
  async getMember(@Param("id") id: string) {
    return this.membersService.findById(id);
  }
}
