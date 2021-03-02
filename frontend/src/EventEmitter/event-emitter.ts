export class EventEmitter<T> {

  private subscribers: Set<(event: T) => any> = new Set();

  subscribe(subscriber: (event: T) => any) {
    this.subscribers.add(subscriber);
  }

  unsubscribe(subscriber: (event: T) => any) {
    this.subscribers.delete(subscriber);
  }

  emit(event: T) {
    let subs = Array.from(this.subscribers.values());
    for (let sub of subs) {
      sub(event);
    }
  }

}