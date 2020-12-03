export type NullableData<T> = T | null

export type SimpleData = string | number | { text: string | number }

export type CascadeData<T extends Record<string, unknown>> = {
  [P in keyof T]: T[P]
} & {
  children?: CascadeData<T>[]
}

export interface IndexableData<T> {
  index: number
  value: T
}

export type IdxCascadeData<T extends Record<string, unknown>> = IndexableData<
  CascadeData<T>
>

export interface DataSource<T> {
  getInit: () => NullableData<T>

  getPrev: (param: NullableData<T>) => NullableData<T>

  getNext: (param: NullableData<T>) => NullableData<T>

  getText: (param: NullableData<T>) => string
}

export interface DataSourceFactory<T> {
  // data is cascadable
  cascadable?: boolean
  // create init dataSource list
  create: () => DataSource<T>[]
  // indexed data changed need to update relevant dataSource
  // if index === -1, should update all dataSource
  change: (values: NullableData<T>[], index: number) => DataSource<T>[]
}
