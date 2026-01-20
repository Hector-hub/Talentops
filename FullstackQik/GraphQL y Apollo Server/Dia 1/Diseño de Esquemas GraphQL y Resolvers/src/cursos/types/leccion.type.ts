import { ObjectType, Field, ID, Int } from "@nestjs/graphql";

@ObjectType()
export class Leccion {
  @Field(() => ID)
  id: string;

  @Field()
  titulo: string;

  @Field()
  contenido: string;

  @Field(() => Int)
  duracionMinutos: number;

  @Field(() => Int)
  orden: number;
}
