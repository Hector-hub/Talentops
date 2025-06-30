class CircuitBreaker {
  constructor(options = {}) {
    this.failureThreshold = options.failureThreshold || 3;
    this.timeout = options.timeout || 30000;
    this.state = "CLOSED";
    this.failures = 0;
    this.nextAttemptTime = 0;
  }

  async execute(fn) {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttemptTime) {
        throw new Error("Circuit breaker is OPEN. Service unavailable.");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await fn();
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.failures = 0;
    this.state = "CLOSED";
  }

  onFailure() {
    this.failures++;
    if (this.failures >= this.failureThreshold) {
      this.state = "OPEN";
      this.nextAttemptTime = Date.now() + this.timeout;
    }
  }

  getState() {
    return {
      state: this.state,
      failures: this.failures,
      nextAttemptTime: this.nextAttemptTime,
    };
  }
}

module.exports = CircuitBreaker;
