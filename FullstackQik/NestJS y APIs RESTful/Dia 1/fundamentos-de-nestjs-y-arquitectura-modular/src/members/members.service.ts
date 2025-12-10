import {
  Injectable,
  ConflictException,
  NotFoundException,
} from "@nestjs/common";
import { MemberRepository } from "./repositories/member.repository";
import { CreateMemberDto } from "./dto/create-member.dto";
import { Member } from "./entities/member.entity";
import { IdGenerator } from "../shared/interfaces/id-generator.interface";

@Injectable()
export class MembersService {
  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly idGenerator: IdGenerator
  ) {}

  async createMember(createMemberDto: CreateMemberDto): Promise<Member> {
    // Check if member with email already exists
    const existingMember = await this.memberRepository.findByEmail(
      createMemberDto.email
    );
    if (existingMember) {
      throw new ConflictException("Member with this email already exists");
    }

    // Create new member
    const member = new Member(
      this.idGenerator.generate(),
      createMemberDto.email,
      createMemberDto.name
    );

    await this.memberRepository.save(member);
    return member;
  }

  async findById(id: string): Promise<Member> {
    const member = await this.memberRepository.findById(id);
    if (!member) {
      throw new NotFoundException("Member not found");
    }
    return member;
  }
}
