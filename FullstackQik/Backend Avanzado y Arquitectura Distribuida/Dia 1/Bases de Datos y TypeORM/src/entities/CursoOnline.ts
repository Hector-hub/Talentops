import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import {
  IsNotEmpty,
  MinLength,
  IsEnum,
  IsPositive,
  IsOptional,
} from "class-validator";

// Enum para los niveles de dificultad
export enum NivelDificultad {
  PRINCIPIANTE = "principiante",
  INTERMEDIO = "intermedio",
  AVANZADO = "avanzado",
}

@Entity("cursos_online")
export class CursoOnline {
  // 🔑 ID único universal (UUID)
  @PrimaryGeneratedColumn("uuid")
  id: string;

  // 📝 Título del curso (obligatorio, mínimo 5 caracteres)
  @Column({ type: "varchar", length: 200 })
  @IsNotEmpty({ message: "El título es obligatorio" })
  @MinLength(5, { message: "El título debe tener al menos 5 caracteres" })
  titulo: string;

  // 📄 Descripción detallada del curso
  @Column({ type: "text" })
  @IsNotEmpty({ message: "La descripción es obligatoria" })
  descripcion: string;

  // 📊 Nivel de dificultad (usa el enum)
  @Column({
    type: "enum",
    enum: NivelDificultad,
    default: NivelDificultad.PRINCIPIANTE,
  })
  @IsEnum(NivelDificultad, { message: "Nivel de dificultad inválido" })
  nivelDificultad: NivelDificultad;

  @Column({ type: "decimal", precision: 8, scale: 2 })
  @IsPositive({ message: "El precio debe ser positivo" })
  precio: number;

  @Column({ type: "int", default: 0 })
  @IsOptional()
  duracionHoras?: number;

  //Ejercicio: Extiende la entidad CursoOnline agregando una propiedad tags como
  //array de strings y una propiedad activo como boolean con valor por defecto true.

  @Column({ type: "text", array: true, nullable: true })
  @IsOptional()
  tags?: string[];

  @Column({ type: "boolean", default: true })
  activo: boolean;

  @CreateDateColumn()
  fechaCreacion: Date;

  @UpdateDateColumn()
  fechaActualizacion: Date;
}
