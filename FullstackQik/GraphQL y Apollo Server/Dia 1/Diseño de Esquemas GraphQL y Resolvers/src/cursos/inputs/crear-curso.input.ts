import { InputType, Field, ID } from "@nestjs/graphql";

@InputType()
export class CrearCursoInput {
  @Field()
  titulo: string;

  @Field()
  descripcion: string;

  @Field(() => ID)
  instructorId: string;

  @Field(() => [String], { nullable: true })
  etiquetas?: string[];
}
