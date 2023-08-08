export type OptionalKeys<T, K extends keyof T = keyof T> = Partial<Pick<T, K>> &
  Omit<T, K>;
