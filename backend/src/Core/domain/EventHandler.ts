export interface EventHandler<T> {
  onReceive: (payload: T) => Promise<void>;
}
