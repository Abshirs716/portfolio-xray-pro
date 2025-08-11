/**
 * Intelligent Market Data Cache
 * Optimizes API calls and provides smart caching strategies
 */

export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  accessCount: number;
  lastAccessed: number;
  priority: 'high' | 'medium' | 'low';
}

export interface CacheConfig {
  maxSize: number;
  defaultTTL: number;
  priorityTTL: {
    high: number;
    medium: number;
    low: number;
  };
}

export class MarketDataCache<T> {
  private cache = new Map<string, CacheEntry<T>>();
  private config: CacheConfig;

  constructor(config?: Partial<CacheConfig>) {
    this.config = {
      maxSize: 1000,
      defaultTTL: 60000, // 1 minute
      priorityTTL: {
        high: 30000,    // 30 seconds for real-time data
        medium: 60000,  // 1 minute for regular data
        low: 300000     // 5 minutes for less critical data
      },
      ...config
    };
  }

  /**
   * Set cache entry with automatic prioritization
   */
  set(key: string, data: T, priority: 'high' | 'medium' | 'low' = 'medium'): void {
    const now = Date.now();
    
    // If cache is full, remove least recently used items
    if (this.cache.size >= this.config.maxSize) {
      this.evictLRU();
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      accessCount: 1,
      lastAccessed: now,
      priority
    });
  }

  /**
   * Get cache entry with TTL validation
   */
  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    const now = Date.now();
    const ttl = this.config.priorityTTL[entry.priority];
    
    // Check if entry has expired
    if (now - entry.timestamp > ttl) {
      this.cache.delete(key);
      return null;
    }

    // Update access statistics
    entry.accessCount++;
    entry.lastAccessed = now;

    return entry.data;
  }

  /**
   * Check if cache has valid entry
   */
  has(key: string): boolean {
    return this.get(key) !== null;
  }

  /**
   * Remove expired entries
   */
  cleanup(): void {
    const now = Date.now();
    
    for (const [key, entry] of this.cache.entries()) {
      const ttl = this.config.priorityTTL[entry.priority];
      
      if (now - entry.timestamp > ttl) {
        this.cache.delete(key);
      }
    }
  }

  /**
   * Evict least recently used entries
   */
  private evictLRU(): void {
    let oldestTime = Date.now();
    let oldestKey = '';
    
    for (const [key, entry] of this.cache.entries()) {
      if (entry.lastAccessed < oldestTime) {
        oldestTime = entry.lastAccessed;
        oldestKey = key;
      }
    }
    
    if (oldestKey) {
      this.cache.delete(oldestKey);
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): {
    size: number;
    maxSize: number;
    hitRate: number;
    priorityCounts: Record<string, number>;
  } {
    const priorityCounts = { high: 0, medium: 0, low: 0 };
    let totalHits = 0;
    
    for (const entry of this.cache.values()) {
      priorityCounts[entry.priority]++;
      totalHits += entry.accessCount;
    }

    return {
      size: this.cache.size,
      maxSize: this.config.maxSize,
      hitRate: this.cache.size > 0 ? totalHits / this.cache.size : 0,
      priorityCounts
    };
  }

  /**
   * Clear cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get all cached keys
   */
  keys(): string[] {
    return Array.from(this.cache.keys());
  }

  /**
   * Set TTL for specific priority
   */
  setPriorityTTL(priority: 'high' | 'medium' | 'low', ttl: number): void {
    this.config.priorityTTL[priority] = ttl;
  }
}

/**
 * Global cache instances for different data types
 */
export const priceCache = new MarketDataCache<number>({
  maxSize: 500,
  priorityTTL: {
    high: 10000,   // 10 seconds for real-time prices
    medium: 30000, // 30 seconds for regular prices  
    low: 60000     // 1 minute for historical prices
  }
});

export const technicalIndicatorCache = new MarketDataCache<any>({
  maxSize: 200,
  priorityTTL: {
    high: 60000,   // 1 minute for active trading
    medium: 180000, // 3 minutes for regular analysis
    low: 300000    // 5 minutes for background data
  }
});

export const marketDataCache = new MarketDataCache<any>({
  maxSize: 300,
  priorityTTL: {
    high: 30000,   // 30 seconds for active quotes
    medium: 120000, // 2 minutes for regular data
    low: 600000    // 10 minutes for reference data
  }
});

/**
 * Cache cleanup scheduler
 */
export function startCacheCleanup(): () => void {
  const interval = setInterval(() => {
    priceCache.cleanup();
    technicalIndicatorCache.cleanup();
    marketDataCache.cleanup();
  }, 60000); // Cleanup every minute

  return () => clearInterval(interval);
}

/**
 * Get combined cache statistics
 */
export function getAllCacheStats() {
  return {
    prices: priceCache.getStats(),
    technicalIndicators: technicalIndicatorCache.getStats(),
    marketData: marketDataCache.getStats()
  };
}