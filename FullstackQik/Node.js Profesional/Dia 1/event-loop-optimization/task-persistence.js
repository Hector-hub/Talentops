const fs = require("fs").promises;
const path = require("path");

class TaskPersistence {
  constructor(storageDir = "./task-storage") {
    this.storageDir = storageDir;
    this.pendingTasksFile = path.join(storageDir, "pending-tasks.json");
    this.completedTasksFile = path.join(storageDir, "completed-tasks.json");
    this.failedTasksFile = path.join(storageDir, "failed-tasks.json");
  }

  async initialize() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      await this.ensureFiles();
    } catch (error) {
      throw new Error(
        `Failed to initialize task persistence: ${error.message}`
      );
    }
  }

  async ensureFiles() {
    const files = [
      this.pendingTasksFile,
      this.completedTasksFile,
      this.failedTasksFile,
    ];

    for (const file of files) {
      try {
        await fs.access(file);
      } catch {
        await fs.writeFile(file, "[]");
      }
    }
  }

  async persistTask(task) {
    try {
      const tasks = await this.loadTasks(this.pendingTasksFile);
      const taskWithTimestamp = {
        ...task,
        persistedAt: new Date().toISOString(),
        status: "pending",
      };
      tasks.push(taskWithTimestamp);
      await this.saveTasks(this.pendingTasksFile, tasks);
    } catch (error) {
      console.error("Failed to persist task:", error.message);
    }
  }

  async markTaskCompleted(taskId, result) {
    try {
      await this.moveTask(
        taskId,
        this.pendingTasksFile,
        this.completedTasksFile,
        {
          completedAt: new Date().toISOString(),
          status: "completed",
          result,
        }
      );
    } catch (error) {
      console.error("Failed to mark task as completed:", error.message);
    }
  }

  async markTaskFailed(taskId, error) {
    try {
      await this.moveTask(taskId, this.pendingTasksFile, this.failedTasksFile, {
        failedAt: new Date().toISOString(),
        status: "failed",
        error: error.message,
      });
    } catch (error) {
      console.error("Failed to mark task as failed:", error.message);
    }
  }

  async moveTask(taskId, fromFile, toFile, additionalData = {}) {
    const fromTasks = await this.loadTasks(fromFile);
    const toTasks = await this.loadTasks(toFile);

    const taskIndex = fromTasks.findIndex((task) => task.id === taskId);
    if (taskIndex === -1) return;

    const task = fromTasks.splice(taskIndex, 1)[0];
    const updatedTask = { ...task, ...additionalData };
    toTasks.push(updatedTask);

    await Promise.all([
      this.saveTasks(fromFile, fromTasks),
      this.saveTasks(toFile, toTasks),
    ]);
  }

  async loadTasks(file) {
    try {
      const data = await fs.readFile(file, "utf8");
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  async saveTasks(file, tasks) {
    await fs.writeFile(file, JSON.stringify(tasks, null, 2));
  }

  async getPendingTasks() {
    return await this.loadTasks(this.pendingTasksFile);
  }

  async getCompletedTasks() {
    return await this.loadTasks(this.completedTasksFile);
  }

  async getFailedTasks() {
    return await this.loadTasks(this.failedTasksFile);
  }

  async clearPendingTasks() {
    await this.saveTasks(this.pendingTasksFile, []);
  }

  async getStats() {
    const [pending, completed, failed] = await Promise.all([
      this.getPendingTasks(),
      this.getCompletedTasks(),
      this.getFailedTasks(),
    ]);

    return {
      pending: pending.length,
      completed: completed.length,
      failed: failed.length,
      total: pending.length + completed.length + failed.length,
    };
  }
}

module.exports = TaskPersistence;
