interface CacheStoreItem {
  value: unknown;
  expiresAt: number;
}

interface CustomGlobal {
  _appInMemoryCache?: {
    store: Map<string, CacheStoreItem>;
  };
}

const g = globalThis as unknown as CustomGlobal;

const globalCache = g._appInMemoryCache || {
  store: new Map<string, CacheStoreItem>(),
};
g._appInMemoryCache = globalCache;

const DEFAULT_TTL = 15 * 60 * 1000; // 15 minutes

export function getCached<T>(key: string): T | null {
  const item = globalCache.store.get(key);
  if (!item) return null;
  if (Date.now() > item.expiresAt) {
    globalCache.store.delete(key);
    return null;
  }
  return item.value as T;
}

export function setCached<T>(key: string, value: T, ttl = DEFAULT_TTL): void {
  globalCache.store.set(key, {
    value,
    expiresAt: Date.now() + ttl,
  });
}

export function clearMemoryCache(): void {
  globalCache.store.clear();
  console.log('Global memory cache cleared successfully!');
}
