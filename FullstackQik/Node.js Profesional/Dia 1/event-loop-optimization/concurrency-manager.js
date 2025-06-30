const { performance } = require("perf_hooks");

class ConcurrencyManager {
  constructor(maxConcurrent = 5, queueLimit = 100) {
    this.maxConcurrent = maxConcurrent;
    this.queueLimit = queueLimit;
    this.running = 0;
    this.queue = [];
    this.metrics = {
      totalExecuted: 0,
      totalQueued: 0,
      totalRejected: 0,
      avgWaitTime: 0,
    };
  }

  async execute(taskFn, priority = 0) {
    if (this.queue.length >= this.queueLimit) {
      this.metrics.totalRejected++;
      throw new Error("Queue limit exceeded");
    }

    return new Promise((resolve, reject) => {
      const task = {
        fn: taskFn,
        resolve,
        reject,
        priority,
        queuedAt: Date.now(),
      };

      this.queue.push(task);
      this.queue.sort((a, b) => b.priority - a.priority);
      this.metrics.totalQueued++;
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.running >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const task = this.queue.shift();
    this.running++;
    this.metrics.totalExecuted++;

    const waitTime = Date.now() - task.queuedAt;
    this.metrics.avgWaitTime = (this.metrics.avgWaitTime + waitTime) / 2;

    try {
      const result = await task.fn();
      task.resolve(result);
    } catch (error) {
      task.reject(error);
    } finally {
      this.running--;
      this.processQueue();
    }
  }

  getMetrics() {
    return {
      ...this.metrics,
      currentRunning: this.running,
      queueLength: this.queue.length,
      utilizationRate: this.running / this.maxConcurrent,
    };
  }

  updateConcurrency(newLimit) {
    this.maxConcurrency = newLimit;
    this.processQueue();
  }
}

module.exports = ConcurrencyManager;
