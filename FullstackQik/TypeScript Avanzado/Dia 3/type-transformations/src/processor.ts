import { CatalogItem } from "./domain.js";
import { ToApiResponse, ToEventType } from "./transformations.js";

// Type-safe processor que usa distributive conditional types
export class CatalogProcessor {
  static processItem<T extends CatalogItem>(item: T): ToApiResponse<T> {
    const { id, type, createdAt, updatedAt, version, ...data } = item;

    return {
      type: type as any,
      id,
      data: data as any,
      meta: {
        createdAt: createdAt.toISOString(),
        updatedAt: updatedAt.toISOString(),
        version,
      },
    } as ToApiResponse<T>;
  }

  static createEvent<T extends CatalogItem>(
    item: T,
    changes: Partial<
      Omit<T, "id" | "type" | "createdAt" | "updatedAt" | "version">
    >,
    userId: string
  ): ToEventType<T> {
    return {
      eventType: `${item.type}Changed` as any,
      entityId: item.id,
      changes,
      metadata: {
        timestamp: new Date(),
        userId,
        source: "catalog-service",
      },
    } as ToEventType<T>;
  }
}
