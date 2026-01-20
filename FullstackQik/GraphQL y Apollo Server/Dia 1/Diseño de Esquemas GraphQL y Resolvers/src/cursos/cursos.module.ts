import { Module } from "@nestjs/common";
import { CursoResolver } from "./resolvers";
import { CursoService, EstadisticasService } from "./services";
import { PubSub } from "graphql-subscriptions";
import { PUB_SUB } from "./constants";

@Module({
  providers: [
    CursoResolver,
    CursoService,
    EstadisticasService,
    {
      provide: PUB_SUB,
      useValue: new PubSub(),
    },
  ],
  exports: [CursoService, PUB_SUB],
})
export class CursosModule {}
