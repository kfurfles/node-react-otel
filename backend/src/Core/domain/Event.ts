export interface EventBase<T> {
  date: Date;
  type: string;
  payload: T;
}
