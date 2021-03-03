export default class APICache {
  private static cacheMap: Map<string, unknown> = new Map();

  static cache(tag: string, value: unknown): void {
    this.cacheMap.set(tag, value);
  }

  static retrieve<T>(tag: string): T {
    return this.cacheMap.get(tag) as T;
  }

  static invalidate<T>(tag: string): T {
    const lastVals = this.cacheMap.get(tag) as T;
    this.cacheMap.clear();
    return lastVals;
  }

  static has(tag: string): boolean {
    return this.cacheMap.has(tag);
  }
}
