export interface Adapter<T> {
  adapt(item: Partial<T>): T;
}
