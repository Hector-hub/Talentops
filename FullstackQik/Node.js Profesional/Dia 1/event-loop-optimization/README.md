# Event Loop Optimization SystemUn sistema completo de procesamiento asíncrono diseñado para optimizar el Event Loop de Node.js con manejo de concurrencia, circuit breaker, persistencia de tareas y herramientas de monitoreo de rendimiento.## 🏗️ Arquitectura del Sistema### Componentes Principales1. **ConcurrencyManager** (`concurrency-manager.js`) - Gestión de colas con prioridades (0-2) - Control de concurrencia máxima - Métricas en tiempo real2. **CircuitBreaker** (`circuit-breaker.js`) - Protección contra fallos en cascada - Estados: CLOSED, OPEN, HALF_OPEN - Recuperación automática3. **TaskPersistence** (`task-persistence.js`) - Persistencia de tareas en archivos JSON - Recuperación automática en reinicios - Estados: pending, completed, failed4. **AsyncProcessingSystem** (`async-processing-system.js`) - Coordinador principal del sistema - Integra todos los componentes - API unificada para procesamiento## 🚀 Instalación y Configuración`bash# Instalar dependenciasnpm install# Instalar herramientas de profiling (opcional)npm install --save-dev 0x autocannon clinic`## 📊 Scripts Disponibles### Ejecución Básica`bashnpm start              # Ejecutar demo del sistemanpm run server         # Ejecutar servidor HTTP para benchmarks`### Profiling y Análisis`bashnpm run profile        # Profiling con 0x (flame graphs)npm run profile-server # Profiling del servidor HTTPnpm run clinic         # Análisis con Clinic.js Doctornpm run clinic-server  # Análisis del servidor con Clinic.js`### Benchmarking`bashnpm run benchmark      # Benchmark básico (100 conexiones, 30s)npm run benchmark-tasks # Benchmark de procesamiento de tareasnpm run benchmark-heavy # Benchmark de carga pesada (200 conexiones)npm run benchmark-all  # Ejecutar suite completa de benchmarks`## 🎯 Uso del Sistema### Demo Básico`bashnpm start`Este comando ejecuta una demostración que:- Procesa 20 tareas con diferentes prioridades- Simula fallos aleatorios (10% de tasa de fallo)- Muestra métricas en tiempo real cada 3 segundos- Demuestra recuperación automática### Servidor HTTP para Benchmarks`bashnpm run server`Inicia un servidor HTTP en `http://localhost:3000` con los siguientes endpoints:- `GET /` - Información del servidor- `POST /task?priority=0-2` - Procesar tarea- `GET /metrics` - Métricas del sistema- `GET /health` - Estado de salud### Benchmark Completo`bashnpm run benchmark-all`Ejecuta una suite completa de benchmarks y genera un reporte en `benchmark-results.json`.## 🔧 Configuración del Sistema`javascriptconst processor = new AsyncProcessingSystem({  maxConcurrent: 5,      // Máximo de tareas concurrentes  queueLimit: 100,       // Límite de la cola  circuitBreakerConfig: {    failureThreshold: 5,  // Umbral de fallos    timeout: 30000,       // Timeout en ms    resetTimeout: 60000   // Tiempo de reset en ms  }});`## 📈 Métricas del SistemaEl sistema proporciona métricas detalladas:`json{  "concurrency": {    "activeJobs": 3,    "queueSize": 12,    "totalProcessed": 150,    "totalFailed": 8,    "averageProcessingTime": 245  },  "circuitBreaker": {    "state": "CLOSED",    "failureCount": 2,    "successCount": 148,    "lastFailureTime": "2025-06-29T10:30:45.123Z"  },  "persistence": {    "pendingTasks": 12,    "completedTasks": 142,    "failedTasks": 8  },  "system": {    "uptime": 3600,    "memoryUsage": { "rss": 45678912, "heapUsed": 23456789 },    "cpuUsage": { "user": 1234567, "system": 987654 }  }}`## 🛠️ Herramientas de Profiling### 0x - Flame Graphs`bashnpm run profile# Genera flame graphs para análisis de CPU`### Clinic.js Doctor`bashnpm run clinic# Análisis completo de rendimiento con recomendaciones`### Autocannon - Benchmarking HTTP```bashnpm run benchmark# Load testing del servidor HTTP

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
