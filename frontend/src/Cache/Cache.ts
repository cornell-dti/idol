export class APICache {

  private static cacheMap: Map<string, any> = new Map();

  static cache(tag: string, value: any) {
    this.cacheMap.set(tag, value);
  }

  static retrieve<T>(tag: string): T {
    return this.cacheMap.get(tag) as T;
  }

  static invalidate<T>(tag: string): T {
    let lastVals = this.cacheMap.get(tag) as T;
    this.cacheMap.clear();
    return lastVals;
  }

  static has(tag: string): boolean {
    return this.cacheMap.has(tag);
  }

}