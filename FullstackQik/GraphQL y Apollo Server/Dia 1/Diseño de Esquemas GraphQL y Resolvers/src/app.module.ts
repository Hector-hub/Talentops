import { Module } from "@nestjs/common";
import { GraphQLModule } from "@nestjs/graphql";
import { ApolloDriver, ApolloDriverConfig } from "@nestjs/apollo";
import { CursosModule } from "./cursos/cursos.module";

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: "schema.gql",
      context: ({ req }) => ({ req }),
      playground: true,
      introspection: true,
      subscriptions: {
        "graphql-ws": true,
      },
    }),
    CursosModule,
  ],
})
export class AppModule {}
