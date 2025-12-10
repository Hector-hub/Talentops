import { Member } from "../entities/member.entity";

export abstract class MemberRepository {
  abstract save(member: Member): Promise<void>;
  abstract findById(id: string): Promise<Member | null>;
  abstract findByEmail(email: string): Promise<Member | null>;
}
