import "reflect-metadata";
import { AppDataSource } from "./config/database";
import { CursoOnline, NivelDificultad } from "./entities/CursoOnline";
import { validate } from "class-validator";

async function main() {
  try {
    console.log("🔌 Conectando a la base de datos...");
    await AppDataSource.initialize();
    console.log("✅ Conexión establecida!\n");

    const cursoRepo = AppDataSource.getRepository(CursoOnline);

    console.log("📝 Creando un nuevo curso...");
    const nuevoCurso = cursoRepo.create({
      titulo: "TypeORM desde Cero",
      descripcion:
        "Aprende a usar TypeORM con PostgreSQL en aplicaciones Node.js",
      nivelDificultad: NivelDificultad.INTERMEDIO,
      precio: 49.99,
      duracionHoras: 20,
      tags: ["typeorm", "postgresql", "nodejs"],
      activo: true,
    });

    const errores = await validate(nuevoCurso);
    if (errores.length > 0) {
      console.log("❌ Errores de validación:");
      errores.forEach((error) => {
        console.log(
          `  - ${error.property}: ${Object.values(error.constraints || {}).join(
            ", "
          )}`
        );
      });
      return;
    }

    const cursoGuardado = await cursoRepo.save(nuevoCurso);
    console.log("✅ Curso guardado exitosamente!");
    console.log(cursoGuardado);

    console.log("\n📚 Lista de todos los cursos:");
    const cursos = await cursoRepo.find();
    console.log(cursos);
  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await AppDataSource.destroy();
    console.log("\n🔌 Conexión cerrada");
  }
}

main();
