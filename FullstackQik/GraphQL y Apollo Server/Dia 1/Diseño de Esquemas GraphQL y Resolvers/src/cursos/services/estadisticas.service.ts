import { Injectable } from "@nestjs/common";
import { EstadisticasCurso } from "../types";

@Injectable()
export class EstadisticasService {
  async calcularParaCurso(cursoId: string): Promise<EstadisticasCurso> {
    // Simulación de cálculo de estadísticas
    return {
      totalEstudiantes: Math.floor(Math.random() * 200) + 50,
      calificacionPromedio: Math.round((Math.random() * 2 + 3) * 10) / 10, // Entre 3.0 y 5.0
      totalLecciones: Math.floor(Math.random() * 20) + 5,
    };
  }
}
