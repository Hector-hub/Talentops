import { DataSource } from "typeorm";
import { CursoOnline } from "../entities/CursoOnline";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "password",
  database: "elearning_dev",
  entities: [CursoOnline],
  synchronize: true, // Solo en desarrollo
  logging: true,
});
