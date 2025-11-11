# Event Loop Optimization System
````

## 🔄 Recuperación Automática

El sistema incluye recuperación automática de tareas:

1. **Persistencia**: Las tareas se guardan en archivos JSON
2. **Recuperación**: Al reiniciar, las tareas pendientes se recuperan automáticamente
3. **Estado**: El sistema mantiene el estado de todas las tareas

### Archivos de Persistencia
- `task-storage/pending-tasks.json` - Tareas pendientes
- `task-storage/completed-tasks.json` - Tareas completadas
- `task-storage/failed-tasks.json` - Tareas fallidas

## 🎛️ Eventos del Sistema

```javascript
processor.on('taskQueued', ({ taskId, priority }) => {
  console.log(`Task ${taskId} queued with priority ${priority}`);
});

processor.on('taskCompleted', ({ taskId, result, processingTime }) => {
  console.log(`Task ${taskId} completed in ${processingTime}ms`);
});

processor.on('taskFailed', ({ taskId, error }) => {
  console.log(`Task ${taskId} failed: ${error}`);
});

processor.on('circuitBreakerStateChanged', ({ oldState, newState }) => {
  console.log(`Circuit breaker: ${oldState} -> ${newState}`);
});
````

## 🧪 Ejemplo de Uso Programático

```javascript
const AsyncProcessingSystem = require("./async-processing-system");

async function example() {
  const processor = new AsyncProcessingSystem({
    maxConcurrent: 5,
    queueLimit: 100,
  });

  await processor.initialize();

  // Procesar tarea con prioridad alta
  const result = await processor.processTask(
    {
      id: "important-task",
      type: "email",
      data: { recipient: "user@example.com" },
    },
    0
  ); // Prioridad 0 = alta

  console.log("Task result:", result);

  // Obtener métricas
  const metrics = await processor.getSystemMetrics();
  console.log("System metrics:", metrics);
}
```

## 📋 Requisitos del Sistema

- Node.js >= 14.0.0
- npm >= 6.0.0
- Memoria RAM: Mínimo 512MB
- Espacio en disco: 100MB para logs y persistencia

## 🚨 Manejo de Errores

El sistema incluye manejo robusto de errores:

- **Circuit Breaker**: Protege contra fallos en cascada
- **Reintentos**: Reintentos automáticos con backoff exponencial
- **Persistencia**: Las tareas fallidas se guardan para análisis posterior
- **Graceful Shutdown**: Cierre limpio del sistema

## 🔍 Debugging y Troubleshooting

### Logs del Sistema

```bash
# Ejecutar con logs detallados
DEBUG=* npm start
```

### Análisis de Memoria

```bash
# Profiling de memoria con 0x
npm run profile
```

### Verificar Estado

```bash
# Health check del servidor
curl http://localhost:3000/health

# Métricas actuales
curl http://localhost:3000/metrics
```

## 🤝 Contribución

Para contribuir al proyecto:

1. Fork el repositorio
2. Crear una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. Commit tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear un Pull Request

## 📄 Licencia

ISC License - Ver archivo LICENSE para más detalles.

## 🙏 Agradecimientos

- Node.js community por las herramientas de profiling
- Clinic.js team por las excelentes herramientas de análisis
- 0x project por los flame graphs
- Autocannon para el benchmarking HTTP
