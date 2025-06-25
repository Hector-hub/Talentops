// Shared constants
export const APP_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  DEFAULT_TIMEOUT: 5000,
  CACHE_TTL: 300,
} as const;

export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const EVENT_NAMES = {
  USER_CREATED: "user.created",
  PRODUCT_STOCK_UPDATED: "product.stock.updated",
} as const;
