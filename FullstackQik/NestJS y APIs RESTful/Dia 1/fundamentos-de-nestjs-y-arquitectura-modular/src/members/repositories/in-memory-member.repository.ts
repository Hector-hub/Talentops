import { Injectable } from "@nestjs/common";
import { MemberRepository } from "./member.repository";
import { Member } from "../entities/member.entity";

@Injectable()
export class InMemoryMemberRepository extends MemberRepository {
  private members: Map<string, Member> = new Map();

  async save(member: Member): Promise<void> {
    this.members.set(member.id, member);
  }

  async findById(id: string): Promise<Member | null> {
    return this.members.get(id) || null;
  }

  async findByEmail(email: string): Promise<Member | null> {
    for (const member of this.members.values()) {
      if (member.email === email) {
        return member;
      }
    }
    return null;
  }
}
