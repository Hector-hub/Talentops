// Utility functions
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function generateId(): string {
  return Math.random().toString(36).substr(2, 9);
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function deepClone<T>(obj: T): T {
  return JSON.parse(JSON.stringify(obj));
}
