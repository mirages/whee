export declare type NullableData<T> = T | null
export interface DataFactory<T> {
  getInit: () => NullableData<T>
  getPrev: (param: NullableData<T>) => NullableData<T>
  getNext: (param: NullableData<T>) => NullableData<T>
  getText: (param: NullableData<T>) => string
}
export interface DataFactories<T> {
  create: (values?: NullableData<T>[]) => DataFactory<T>[]
}
