import { ObjectType, Field, Int, Float } from "@nestjs/graphql";

@ObjectType()
export class EstadisticasCurso {
  @Field(() => Int)
  totalEstudiantes: number;

  @Field(() => Float)
  calificacionPromedio: number;

  @Field(() => Int)
  totalLecciones: number;
}
