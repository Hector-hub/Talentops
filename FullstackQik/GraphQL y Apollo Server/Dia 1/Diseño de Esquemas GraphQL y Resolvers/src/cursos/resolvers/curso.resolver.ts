import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
  Context,
  Subscription,
} from "@nestjs/graphql";
import { Inject } from "@nestjs/common";
import {
  CursoCompleto,
  EstadisticasCurso,
  InscripcionNotificacion,
} from "../types";
import { CrearCursoInput } from "../inputs";
import { CursoService, EstadisticasService } from "../services";
import { PubSub } from "graphql-subscriptions";
import { PUB_SUB } from "../constants";

const INSCRIPCION_EVENTO = "inscripcionACurso";

// Interfaz para el contexto de GraphQL
interface GraphQLContext {
  req: Request;
}

@Resolver(() => CursoCompleto)
export class CursoResolver {
  constructor(
    private readonly cursoService: CursoService,
    private readonly estadisticasService: EstadisticasService,
    @Inject(PUB_SUB) private readonly pubSub: PubSub,
  ) {}

  @Query(() => [CursoCompleto], { name: "cursos" })
  async obtenerTodos(): Promise<CursoCompleto[]> {
    return this.cursoService.obtenerTodos();
  }

  @Query(() => CursoCompleto, { name: "curso" })
  async obtenerPorId(@Args("id") id: string): Promise<CursoCompleto> {
    return this.cursoService.obtenerCompleto(id);
  }

  @Mutation(() => CursoCompleto)
  async crearCursoCompleto(
    @Args("datos") datos: CrearCursoInput,
    @Context() context: GraphQLContext,
  ): Promise<CursoCompleto> {
    const curso = await this.cursoService.crear(datos);
    return this.cursoService.obtenerCompleto(curso.id);
  }

  @ResolveField(() => EstadisticasCurso)
  async estadisticas(
    @Parent() curso: CursoCompleto,
  ): Promise<EstadisticasCurso> {
    return this.estadisticasService.calcularParaCurso(curso.id);
  }

  @Subscription(() => InscripcionNotificacion)
  inscripcionACurso() {
    return this.pubSub.asyncIterator(INSCRIPCION_EVENTO);
  }

  @Mutation(() => CursoCompleto)
  async inscribirEstudiante(
    @Args("cursoId") cursoId: string,
    @Args("estudianteId") estudianteId: string,
  ): Promise<CursoCompleto> {
    const { curso, estudiante } = await this.cursoService.inscribirEstudiante(
      cursoId,
      estudianteId,
    );

    this.pubSub.publish(INSCRIPCION_EVENTO, {
      inscripcionACurso: {
        curso,
        estudiante,
        fecha: new Date(),
      },
    });

    return this.cursoService.obtenerCompleto(curso.id);
  }
}
