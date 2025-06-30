const AsyncProcessingSystem = require("./async-processing-system");

console.log("🚀 App starting...");

async function demonstrateAsyncProcessing() {
  console.log("🎯 DEMOSTRACIÓN DEL SISTEMA DE PROCESAMIENTO ASÍNCRONO");
  console.log("════════════════════════════════════════════════════════════");

  const processor = new AsyncProcessingSystem({
    maxConcurrent: 5,
    queueLimit: 100,
  });

  processor.on("taskQueued", ({ taskId, priority }) => {
    console.log(`📝 Task queued: ${taskId} (priority: ${priority})`);
  });

  processor.on("taskCompleted", ({ taskId }) => {
    console.log(`✅ Task completed: ${taskId}`);
  });

  processor.on("taskFailed", ({ taskId, error }) => {
    console.log(`❌ Task failed: ${taskId} - ${error}`);
  });

  try {
    await processor.initialize();
    console.log("🚀 Sistema inicializado correctamente");

    processor.startMetricsReporting(3000);

    console.log("\n🚀 Iniciando simulación de procesamiento de tareas...\n");

    const tasks = [];
    for (let i = 0; i < 20; i++) {
      const priority = Math.floor(Math.random() * 3);
      const taskData = {
        id: i,
        type: ["email", "notification", "analytics"][
          Math.floor(Math.random() * 3)
        ],
        data: `Task data ${i}`,
      };

      tasks.push(
        processor
          .processTask(taskData, priority)
          .catch((error) => console.error(`Task ${i} failed:`, error.message))
      );

      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    await Promise.allSettled(tasks);

    console.log("\n📊 Métricas finales del sistema:");
    const finalMetrics = await processor.getSystemMetrics();
    console.log(JSON.stringify(finalMetrics, null, 2));

    console.log("\n✅ Demostración completada. Presiona Ctrl+C para salir.");
    console.log(
      "💡 Tip: Reinicia la aplicación para ver la recuperación automática en acción."
    );
  } catch (error) {
    console.error("❌ Error durante la demostración:", error.message);
  }
}

process.on("SIGINT", async () => {
  console.log("\n🔄 Recibida señal de interrupción, cerrando sistema...");
  process.exit(0);
});

process.on("uncaughtException", (error) => {
  console.error("❌ Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.error("❌ Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

demonstrateAsyncProcessing()
  .then(() => {
    console.log("🎉 Demo completed successfully");
  })
  .catch((error) => {
    console.error("❌ Demo failed:", error);
    process.exit(1);
  });
