// Express extensions
declare module "express" {
  interface Request {
    user?: {
      id: string;
      email: string;
      permissions: string[];
    };
    correlationId?: string;
    startTime?: number;
  }

  interface Response {
    success?<T>(data: T, message?: string): Response;
    error?(message: string, code?: number, details?: any): Response;
    paginated?<T>(data: T[], pagination: PaginationMeta): Response;
  }
}

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export {};
