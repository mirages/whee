export type NullableData<T> = T | null

export interface IndexableData<T> {
  index: number
  value: T
}

export interface DataSource<T> {
  getInit: () => NullableData<T>

  getPrev: (param: NullableData<T>) => NullableData<T>

  getNext: (param: NullableData<T>) => NullableData<T>

  getText: (param: NullableData<T>) => string
}

export interface DataSourceFactory<T> {
  create: (values?: NullableData<T>[]) => DataSource<T>[]
}
