import { ObjectType, Field, ID, Int } from "@nestjs/graphql";
import { CursoCompleto } from "./curso-completo.type";
import { Usuario } from "./usuario.type";
import { GraphQLDateTime } from "graphql-scalars";

@ObjectType()
export class InscripcionNotificacion {
  @Field(() => CursoCompleto)
  curso: CursoCompleto;

  @Field(() => Usuario)
  estudiante: Usuario;

  @Field(() => GraphQLDateTime)
  fecha: Date;
}
