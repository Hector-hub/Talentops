# 📚 Sistema de Cursos con GraphQL Subscriptions

Sistema de gestión de cursos con notificaciones en tiempo real usando **NestJS**, **Apollo Server** y **GraphQL Subscriptions**.

## 🚀 Instalación

```bash
npm install
```

## ▶️ Ejecutar el servidor

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run start
```

El servidor estará disponible en: **http://localhost:3000/graphql**

## 🧪 Probar Subscriptions

Con el servidor corriendo, en **otra terminal** ejecuta:

```bash
npm run test:subscription
```

Esto:

1. Se conecta via WebSocket al servidor
2. Se suscribe a las notificaciones de inscripción
3. Ejecuta una inscripción de estudiante
4. Muestra la notificación recibida en tiempo real

---

## 📖 Uso Manual (GraphQL Playground)

Abre **http://localhost:3000/graphql** en tu navegador.

### Queries disponibles

```graphql
# Obtener todos los cursos
query {
  cursos {
    id
    titulo
    descripcion
    instructor {
      nombre
    }
    estudiantes {
      nombre
      email
    }
  }
}

# Obtener un curso específico
query {
  curso(id: "1") {
    titulo
    estudiantes {
      nombre
    }
    estadisticas {
      totalEstudiantes
      calificacionPromedio
    }
  }
}
```

### Mutations disponibles

```graphql
# Crear un nuevo curso
mutation {
  crearCursoCompleto(
    datos: {
      titulo: "Mi Nuevo Curso"
      descripcion: "Descripción del curso"
      instructorId: "1"
    }
  ) {
    id
    titulo
  }
}

# Inscribir un estudiante a un curso
mutation {
  inscribirEstudiante(cursoId: "1", estudianteId: "6") {
    titulo
    estudiantes {
      nombre
    }
  }
}
```

### Subscription (tiempo real)

```graphql
# Escuchar inscripciones en tiempo real
subscription {
  inscripcionACurso {
    curso {
      id
      titulo
    }
    estudiante {
      id
      nombre
      email
    }
    fecha
  }
}
```

---

## 🏗️ Estructura del Proyecto

```
src/
├── main.ts                    # Punto de entrada
├── app.module.ts              # Módulo principal (config GraphQL)
└── cursos/
    ├── constants.ts           # Token PUB_SUB para inyección
    ├── cursos.module.ts       # Módulo de cursos
    ├── types/                 # ObjectTypes de GraphQL
    │   ├── usuario.type.ts
    │   ├── leccion.type.ts
    │   ├── curso-completo.type.ts
    │   ├── estadisticas-curso.type.ts
    │   └── inscripcion-notificacion.type.ts
    ├── inputs/                # InputTypes de GraphQL
    │   └── crear-curso.input.ts
    ├── resolvers/             # Resolvers (Queries, Mutations, Subscriptions)
    │   └── curso.resolver.ts
    └── services/              # Lógica de negocio
        ├── curso.service.ts
        └── estadisticas.service.ts
```

---

## 🔧 Tecnologías

| Tecnología            | Versión | Propósito                     |
| --------------------- | ------- | ----------------------------- |
| NestJS                | 10.x    | Framework backend             |
| Apollo Server         | 4.x     | Servidor GraphQL              |
| graphql-ws            | 5.x     | WebSockets para subscriptions |
| graphql-subscriptions | 2.x     | PubSub para eventos           |
| graphql-scalars       | 1.x     | Tipos escalares (DateTime)    |

---

## 📝 Datos de Prueba

### Usuarios disponibles (para inscribir)

| ID  | Nombre         | Email            |
| --- | -------------- | ---------------- |
| 1   | Juan Pérez     | juan@email.com   |
| 2   | María García   | maria@email.com  |
| 3   | Carlos López   | carlos@email.com |
| 4   | Ana Rodríguez  | ana@email.com    |
| 5   | Pedro Martínez | pedro@email.com  |
| 6   | Laura Sánchez  | laura@email.com  |

### Cursos disponibles

| ID  | Título             |
| --- | ------------------ |
| 1   | GraphQL desde cero |
| 2   | NestJS Avanzado    |

---

## 🎯 Flujo de Subscriptions

```
┌─────────────────┐     WebSocket      ┌─────────────────┐
│   Cliente 1     │◄──────────────────►│                 │
│  (suscriptor)   │                    │     Servidor    │
└─────────────────┘                    │     GraphQL     │
                                       │                 │
┌─────────────────┐        HTTP        │   ┌─────────┐   │
│   Cliente 2     │───────────────────►│   │ PubSub  │   │
│   (mutation)    │                    │   └────┬────┘   │
└─────────────────┘                    │        │        │
                                       │        ▼        │
                                       │   Notifica a    │
                                       │   suscriptores  │
                                       └─────────────────┘
```

---

## 📜 Scripts disponibles

| Script              | Comando                     | Descripción              |
| ------------------- | --------------------------- | ------------------------ |
| `start`             | `npm run start`             | Inicia el servidor       |
| `start:dev`         | `npm run start:dev`         | Inicia con hot-reload    |
| `start:debug`       | `npm run start:debug`       | Inicia en modo debug     |
| `build`             | `npm run build`             | Compila el proyecto      |
| `test:subscription` | `npm run test:subscription` | Prueba las subscriptions |
