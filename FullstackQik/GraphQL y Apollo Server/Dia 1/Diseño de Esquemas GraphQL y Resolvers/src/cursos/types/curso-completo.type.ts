import { ObjectType, Field, ID } from "@nestjs/graphql";
import { Usuario } from "./usuario.type";
import { Leccion } from "./leccion.type";
import { EstadisticasCurso } from "./estadisticas-curso.type";

@ObjectType()
export class CursoCompleto {
  @Field(() => ID)
  id: string;

  @Field()
  titulo: string;

  @Field()
  descripcion: string;

  @Field(() => Usuario)
  instructor: Usuario;

  @Field(() => [Usuario])
  estudiantes: Usuario[];

  @Field(() => [Leccion])
  lecciones: Leccion[];

  @Field(() => EstadisticasCurso)
  estadisticas: EstadisticasCurso;
}
