const EventEmitter = require("events");
const { performance } = require("perf_hooks");
const ConcurrencyManager = require("./concurrency-manager");
const CircuitBreaker = require("./circuit-breaker");
const TaskPersistence = require("./task-persistence");

class AsyncProcessingSystem extends EventEmitter {
  constructor(options = {}) {
    super();
    this.concurrencyManager = new ConcurrencyManager(
      options.maxConcurrent || 5,
      options.queueLimit || 100
    );
    this.circuitBreaker = new CircuitBreaker();
    this.taskPersistence = new TaskPersistence();
    this.isProcessing = false;
    this.metrics = {
      totalProcessed: 0,
      totalErrors: 0,
      avgLatency: 0,
      startTime: Date.now(),
    };
  }

  async initialize() {
    await this.taskPersistence.initialize();
    await this.recoverPendingTasks();
    this.isProcessing = true;
  }

  async recoverPendingTasks() {
    console.log("🔄 Starting task recovery...");
    const pendingTasks = await this.taskPersistence.getPendingTasks();

    for (const task of pendingTasks) {
      console.log(`♻️ Recovering task: ${task.id}`);
      setImmediate(() => {
        this.processTask(task.data, task.priority).catch((error) => {
          console.error(`Recovery failed for task ${task.id}:`, error.message);
        });
      });
    }

    await this.taskPersistence.clearPendingTasks();
    console.log(
      `✅ Task recovery completed: ${pendingTasks.length} tasks recovered`
    );
  }

  async processTask(taskData, priority = 0) {
    const taskId = `task_${Date.now()}_${Math.random()
      .toString(36)
      .substr(2, 9)}`;

    const task = {
      id: taskId,
      data: taskData,
      priority,
    };

    await this.taskPersistence.persistTask(task);
    this.emit("taskQueued", { taskId, taskData, priority });

    try {
      const result = await this.concurrencyManager.execute(
        () => this.executeTask(taskId, taskData),
        priority
      );

      await this.taskPersistence.markTaskCompleted(taskId, result);
      this.emit("taskCompleted", { taskId, result });
      return result;
    } catch (error) {
      await this.taskPersistence.markTaskFailed(taskId, error);
      this.emit("taskFailed", { taskId, error: error.message });
      throw error;
    }
  }

  async executeTask(taskId, taskData) {
    const startTime = performance.now();

    try {
      const result = await this.circuitBreaker.execute(async () => {
        const processingTime = Math.random() * 1000 + 500;
        await new Promise((resolve) => setTimeout(resolve, processingTime));

        if (Math.random() < 0.1) {
          throw new Error("External service error");
        }

        return {
          taskId,
          processedData: `Processed: ${JSON.stringify(taskData)}`,
          timestamp: new Date().toISOString(),
        };
      });

      const latency = performance.now() - startTime;
      this.updateMetrics(latency, true);

      return result;
    } catch (error) {
      const latency = performance.now() - startTime;
      this.updateMetrics(latency, false);
      throw error;
    }
  }

  updateMetrics(latency, success) {
    if (success) {
      this.metrics.totalProcessed++;
    } else {
      this.metrics.totalErrors++;
    }

    const alpha = 0.1;
    this.metrics.avgLatency =
      alpha * latency + (1 - alpha) * this.metrics.avgLatency;
  }

  async getSystemMetrics() {
    const uptime = Date.now() - this.metrics.startTime;
    const concurrencyMetrics = this.concurrencyManager.getMetrics();
    const persistenceStats = await this.taskPersistence.getStats();

    return {
      uptime,
      throughput: this.metrics.totalProcessed / (uptime / 1000),
      errorRate:
        this.metrics.totalErrors /
        (this.metrics.totalProcessed + this.metrics.totalErrors),
      avgLatency: this.metrics.avgLatency,
      concurrency: concurrencyMetrics,
      circuitBreakerState: this.circuitBreaker.getState(),
      persistence: persistenceStats,
    };
  }

  startMetricsReporting(interval = 5000) {
    setInterval(async () => {
      const metrics = await this.getSystemMetrics();
      this.emit("metricsReport", metrics);
      console.log("📊 System Metrics:", JSON.stringify(metrics, null, 2));
    }, interval);
  }

  async shutdown() {
    console.log("🔄 Shutting down system...");
    this.isProcessing = false;
    console.log("✅ System shutdown complete");
  }
}

module.exports = AsyncProcessingSystem;
