import { Injectable } from "@nestjs/common";
import { CursoCompleto, Usuario, Leccion, EstadisticasCurso } from "../types";
import { CrearCursoInput } from "../inputs";

// Datos mock para simular base de datos
const cursosDB: CursoCompleto[] = [
  {
    id: "1",
    titulo: "GraphQL desde cero",
    descripcion: "Aprende GraphQL paso a paso",
    instructor: { id: "1", nombre: "Juan Pérez", email: "juan@email.com" },
    estudiantes: [
      { id: "3", nombre: "Carlos López", email: "carlos@email.com" },
      { id: "4", nombre: "Ana Rodríguez", email: "ana@email.com" },
    ],
    lecciones: [
      {
        id: "1",
        titulo: "Introducción",
        contenido: "Contenido...",
        duracionMinutos: 15,
        orden: 1,
      },
      {
        id: "2",
        titulo: "Queries",
        contenido: "Contenido...",
        duracionMinutos: 20,
        orden: 2,
      },
    ],
    estadisticas: {
      totalEstudiantes: 150,
      calificacionPromedio: 4.8,
      totalLecciones: 2,
    },
  },
  {
    id: "2",
    titulo: "NestJS Avanzado",
    descripcion: "Domina NestJS como un profesional",
    instructor: { id: "2", nombre: "María García", email: "maria@email.com" },
    estudiantes: [
      { id: "1", nombre: "Juan Pérez", email: "juan@email.com" },
      { id: "3", nombre: "Carlos López", email: "carlos@email.com" },
      { id: "5", nombre: "Pedro Martínez", email: "pedro@email.com" },
    ],
    lecciones: [
      {
        id: "3",
        titulo: "Módulos",
        contenido: "Contenido...",
        duracionMinutos: 25,
        orden: 1,
      },
    ],
    estadisticas: {
      totalEstudiantes: 80,
      calificacionPromedio: 4.5,
      totalLecciones: 1,
    },
  },
];

const usuariosDB: Usuario[] = [
  { id: "1", nombre: "Juan Pérez", email: "juan@email.com" },
  { id: "2", nombre: "María García", email: "maria@email.com" },
  { id: "3", nombre: "Carlos López", email: "carlos@email.com" },
  { id: "4", nombre: "Ana Rodríguez", email: "ana@email.com" },
  { id: "5", nombre: "Pedro Martínez", email: "pedro@email.com" },
  { id: "6", nombre: "Laura Sánchez", email: "laura@email.com" },
];

@Injectable()
export class CursoService {
  private cursos = cursosDB;
  private usuarios = usuariosDB;

  async obtenerTodos(): Promise<CursoCompleto[]> {
    return this.cursos;
  }

  async obtenerCompleto(id: string): Promise<CursoCompleto> {
    const curso = this.cursos.find((c) => c.id === id);
    if (!curso) {
      throw new Error(`Curso con id ${id} no encontrado`);
    }
    return curso;
  }

  async crear(datos: CrearCursoInput): Promise<CursoCompleto> {
    const instructor = this.usuarios.find((u) => u.id === datos.instructorId);
    if (!instructor) {
      throw new Error(`Instructor con id ${datos.instructorId} no encontrado`);
    }

    const nuevoCurso: CursoCompleto = {
      id: String(this.cursos.length + 1),
      titulo: datos.titulo,
      descripcion: datos.descripcion,
      instructor,
      estudiantes: [],
      lecciones: [],
      estadisticas: {
        totalEstudiantes: 0,
        calificacionPromedio: 0,
        totalLecciones: 0,
      },
    };

    this.cursos.push(nuevoCurso);
    return nuevoCurso;
  }

  async inscribirEstudiante(
    cursoId: string,
    estudianteId: string,
  ): Promise<{ curso: CursoCompleto; estudiante: Usuario }> {
    const curso = this.cursos.find((c) => c.id === cursoId);
    if (!curso) {
      throw new Error(`Curso con id ${cursoId} no encontrado`);
    }

    const estudiante = this.usuarios.find((u) => u.id === estudianteId);
    if (!estudiante) {
      throw new Error(`Estudiante con id ${estudianteId} no encontrado`);
    }

    // Verificar si ya está inscrito
    const inscrito = curso.estudiantes.some((e) => e.id === estudianteId);
    if (inscrito) {
      throw new Error(`El estudiante ya está inscrito en este curso`);
    }

    // Agregar estudiante al array
    curso.estudiantes.push(estudiante);
    curso.estadisticas.totalEstudiantes = curso.estudiantes.length;

    return { curso, estudiante };
  }
}
