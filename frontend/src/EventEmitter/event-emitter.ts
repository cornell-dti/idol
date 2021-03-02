export default class EventEmitter<T> {

  private readonly subscribers: Set<(event: T) => unknown> = new Set();

  subscribe(subscriber: (event: T) => unknown): void {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (event: T) => unknown): void {
    this.subscribers.delete(subscriber);
  }

  emit(event: T): void {
    Array.from(this.subscribers.values()).forEach(sub => sub(event));
  }
}
