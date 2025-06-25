// Global type extensions
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: "development" | "staging" | "production" | "test";
      DATABASE_URL: string;
      JWT_SECRET: string;
      EMAIL_SERVICE_API_KEY: string;
      REDIS_URL: string;
      PORT?: string;
      DB_MAX_CONNECTIONS?: string;
      DB_TIMEOUT?: string;
      REDIS_TTL?: string;
      EMAIL_FROM_ADDRESS?: string;
      JWT_EXPIRES_IN?: string;
    }
  }

  interface Error {
    code?: string;
    statusCode?: number;
    details?: any;
  }
}

export {};
