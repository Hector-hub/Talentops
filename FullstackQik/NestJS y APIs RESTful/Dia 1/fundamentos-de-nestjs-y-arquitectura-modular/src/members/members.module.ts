import { Module } from "@nestjs/common";
import { MembersController } from "./members.controller";
import { MembersService } from "./members.service";
import { MemberRepository } from "./repositories/member.repository";
import { InMemoryMemberRepository } from "./repositories/in-memory-member.repository";
import { IdGenerator } from "../shared/interfaces/id-generator.interface";
import { UuidGenerator } from "../shared/services/uuid-generator.service";

@Module({
  controllers: [MembersController],
  providers: [
    MembersService,
    {
      provide: MemberRepository,
      useClass: InMemoryMemberRepository,
    },
    {
      provide: IdGenerator,
      useClass: UuidGenerator,
    },
  ],
  exports: [MembersService, MemberRepository],
})
export class MembersModule {}
