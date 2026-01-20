const WebSocket = require("ws");
const http = require("http");

const GRAPHQL_WS_URL = "ws://localhost:3000/graphql";

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  red: "\x1b[31m",
  cyan: "\x1b[36m",
};

function log(color, prefix, message) {
  console.log(`${color}[${prefix}]${colors.reset} ${message}`);
}

// ==================== CLIENTE SUSCRIPTOR ====================
async function iniciarSuscriptor() {
  log(colors.blue, "SUSCRIPTOR", "Conectando al servidor WebSocket...");

  const ws = new WebSocket(GRAPHQL_WS_URL, "graphql-transport-ws");

  ws.on("open", () => {
    log(colors.green, "SUSCRIPTOR", "✅ Conectado!");

    ws.send(
      JSON.stringify({
        type: "connection_init",
        payload: {},
      }),
    );
  });

  ws.on("message", (data) => {
    const message = JSON.parse(data.toString());

    switch (message.type) {
      case "connection_ack":
        log(colors.green, "SUSCRIPTOR", "Conexión aceptada. Suscribiéndose...");

        ws.send(
          JSON.stringify({
            id: "1",
            type: "subscribe",
            payload: {
              query: `
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
            `,
            },
          }),
        );

        log(colors.cyan, "SUSCRIPTOR", "👂 Escuchando inscripciones...\n");

        setTimeout(() => {
          ejecutarInscripcion();
        }, 2000);
        break;

      case "next":
        log(colors.yellow, "📨 NOTIFICACIÓN", "Recibida inscripción:");
        console.log(JSON.stringify(message.payload.data, null, 2));
        console.log("");
        break;

      case "error":
        log(colors.red, "ERROR", JSON.stringify(message.payload));
        break;
    }
  });

  ws.on("error", (error) => {
    log(colors.red, "ERROR", `Error de conexión: ${error.message}`);
    log(
      colors.yellow,
      "TIP",
      "Asegúrate de que el servidor esté corriendo: npm run start:dev",
    );
  });

  ws.on("close", () => {
    log(colors.blue, "SUSCRIPTOR", "Conexión cerrada");
  });

  return ws;
}

// ==================== EJECUTAR MUTATION ====================
async function ejecutarInscripcion() {
  log(colors.green, "MUTATION", "Ejecutando inscripción de estudiante...");

  const mutation = `
    mutation {
      inscribirEstudiante(cursoId: "1", estudianteId: "6") {
        id
        titulo
        estudiantes {
          nombre
        }
      }
    }
  `;

  const postData = JSON.stringify({ query: mutation });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/graphql",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      try {
        const result = JSON.parse(data);

        if (result.errors) {
          log(colors.red, "MUTATION", `Error: ${result.errors[0].message}`);
        } else {
          log(colors.green, "MUTATION", "✅ Inscripción exitosa:");
          console.log(JSON.stringify(result.data, null, 2));
          console.log("");
          log(
            colors.cyan,
            "INFO",
            "El suscriptor debería haber recibido la notificación arriba ☝️",
          );
        }
      } catch (e) {
        log(colors.red, "ERROR", `Error parseando respuesta: ${e.message}`);
      }

      setTimeout(() => {
        log(colors.blue, "TEST", "Finalizando prueba...");
        process.exit(0);
      }, 3000);
    });
  });

  req.on("error", (error) => {
    log(colors.red, "ERROR", `Error al ejecutar mutation: ${error.message}`);
  });

  req.write(postData);
  req.end();
}

async function main() {
  console.log("\n" + "=".repeat(50));
  console.log("🧪 TEST DE SUBSCRIPTIONS GRAPHQL");
  console.log("=".repeat(50) + "\n");

  await iniciarSuscriptor();
}

main().catch(console.error);
