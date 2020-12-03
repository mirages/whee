export declare type NullableData<T> = T | null
export declare type SimpleData =
  | string
  | number
  | {
      text: string | number
    }
export declare type CascadeData<T extends Record<string, unknown>> = {
  [P in keyof T]: T[P]
} & {
  children?: CascadeData<T>[]
}
export interface IndexableData<T> {
  index: number
  value: T
}
export declare type IdxCascadeData<
  T extends Record<string, unknown>
> = IndexableData<CascadeData<T>>
export interface DataSource<T> {
  getInit: () => NullableData<T>
  getPrev: (param: NullableData<T>) => NullableData<T>
  getNext: (param: NullableData<T>) => NullableData<T>
  getText: (param: NullableData<T>) => string
}
export interface DataSourceFactory<T> {
  cascadable?: boolean
  create: () => DataSource<T>[]
  change: (values: NullableData<T>[], index: number) => DataSource<T>[]
}
