import { ObjectType, Field, ID } from "@nestjs/graphql";

@ObjectType()
export class Usuario {
  @Field(() => ID)
  id: string;

  @Field()
  nombre: string;

  @Field()
  email: string;
}
