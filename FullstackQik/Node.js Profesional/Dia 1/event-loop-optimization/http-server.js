const http = require('http');
const url = require('url');
const AsyncProcessingSystem = require('./async-processing-system');

class BenchmarkServer {
  constructor(port = 3000) {
    this.port = port;
    this.server = null;
    this.processor = null;
    this.requestCount = 0;
    this.startTime = Date.now();
  }

  async initialize() {
    // Initialize the async processing system
    this.processor = new AsyncProcessingSystem({
      maxConcurrent: 10, // Higher concurrency for HTTP load
      queueLimit: 1000
    });

    await this.processor.initialize();
    
    // Setup event listeners for metrics
    this.processor.on('taskCompleted', ({ taskId }) => {
      console.log(`✅ HTTP Task completed: ${taskId}`);
    });

    this.processor.on('taskFailed', ({ taskId, error }) => {
      console.log(`❌ HTTP Task failed: ${taskId} - ${error}`);
    });

    // Start metrics reporting every 10 seconds during HTTP load
    this.processor.startMetricsReporting(10000);
  }

  createServer() {
    this.server = http.createServer(async (req, res) => {
      this.requestCount++;
      const parsedUrl = url.parse(req.url, true);
      const pathname = parsedUrl.pathname;
      const method = req.method;

      // Enable CORS for all requests
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

      try {
        if (method === 'OPTIONS') {
          res.writeHead(200);
          res.end();
          return;
        }

        switch (pathname) {
          case '/':
            await this.handleRoot(req, res);
            break;
          
          case '/health':
            await this.handleHealth(req, res);
            break;
          
          case '/task':
            await this.handleTask(req, res, parsedUrl.query);
            break;
          
          case '/metrics':
            await this.handleMetrics(req, res);
            break;
          
          case '/load-test':
            await this.handleLoadTest(req, res);
            break;
          
          default:
            await this.handleNotFound(req, res);
            break;
        }
      } catch (error) {
        console.error('❌ Server error:', error);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Internal server error',
          message: error.message 
        }));
      }
    });

    return this.server;
  }

  async handleRoot(req, res) {
    const uptime = Date.now() - this.startTime;
    const response = {
      message: '🚀 Event Loop Optimization Benchmark Server',
      version: '1.0.0',
      uptime: Math.floor(uptime / 1000),
      requestCount: this.requestCount,
      endpoints: {
        'GET /': 'Server information',
        'GET /health': 'Health check',
        'POST /task': 'Process a task (query: priority=0-2)',
        'GET /metrics': 'System metrics',
        'GET /load-test': 'Simple load test endpoint'
      },
      benchmarkCommands: {
        basic: 'autocannon -c 100 -d 30 http://localhost:3000',
        tasks: 'autocannon -c 50 -d 20 -m POST http://localhost:3000/task',
        loadTest: 'autocannon -c 200 -d 60 http://localhost:3000/load-test'
      }
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response, null, 2));
  }

  async handleHealth(req, res) {
    const response = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000),
      requestCount: this.requestCount,
      processorStatus: this.processor ? 'initialized' : 'not_initialized'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  }

  async handleTask(req, res, query) {
    if (req.method !== 'POST') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method not allowed. Use POST.' }));
      return;
    }

    const priority = parseInt(query.priority) || 1;
    const taskId = `http_task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const taskData = {
      id: taskId,
      type: 'http_request',
      source: 'benchmark',
      timestamp: Date.now(),
      data: {
        method: req.method,
        url: req.url,
        userAgent: req.headers['user-agent'],
        requestId: this.requestCount
      }
    };

    try {
      const startTime = Date.now();
      const result = await this.processor.processTask(taskData, priority);
      const processingTime = Date.now() - startTime;

      const response = {
        success: true,
        taskId,
        priority,
        processingTime,
        result,
        requestNumber: this.requestCount
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    } catch (error) {
      const response = {
        success: false,
        taskId,
        error: error.message,
        requestNumber: this.requestCount
      };

      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(response));
    }
  }

  async handleMetrics(req, res) {
    try {
      const systemMetrics = await this.processor.getSystemMetrics();
      const serverMetrics = {
        server: {
          uptime: Math.floor((Date.now() - this.startTime) / 1000),
          requestCount: this.requestCount,
          requestsPerSecond: this.requestCount / Math.max(1, (Date.now() - this.startTime) / 1000),
          port: this.port,
          timestamp: new Date().toISOString()
        },
        system: systemMetrics
      };

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(serverMetrics, null, 2));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Failed to get metrics',
        message: error.message 
      }));
    }
  }

  async handleLoadTest(req, res) {
    // Simple endpoint that does minimal processing - good for pure HTTP benchmarking
    const response = {
      status: 'ok',
      timestamp: Date.now(),
      requestNumber: this.requestCount,
      message: 'Load test endpoint - minimal processing'
    };

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  }

  async handleNotFound(req, res) {
    const response = {
      error: 'Not Found',
      message: `Endpoint ${req.url} not found`,
      availableEndpoints: ['/', '/health', '/task', '/metrics', '/load-test']
    };

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(response));
  }

  async start() {
    await this.initialize();
    this.createServer();

    return new Promise((resolve, reject) => {
      this.server.listen(this.port, (err) => {
        if (err) {
          reject(err);
        } else {
          console.log(`🌐 HTTP Benchmark Server running on http://localhost:${this.port}`);
          console.log(`📊 Ready for benchmarking with autocannon`);
          console.log(`💡 Try: curl http://localhost:${this.port}/health`);
          resolve();
        }
      });
    });
  }

  async stop() {
    if (this.server) {
      return new Promise((resolve) => {
        this.server.close(() => {
          console.log('🔴 Server stopped');
          resolve();
        });
      });
    }
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new BenchmarkServer(3000);
  
  server.start().catch(error => {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\n🔄 Shutting down server...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\n🔄 Shutting down server...');
    await server.stop();
    process.exit(0);
  });
}

module.exports = BenchmarkServer;
