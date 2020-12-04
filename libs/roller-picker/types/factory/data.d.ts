export declare type Nullable<T> = T | null
export declare type SimpleData =
  | string
  | number
  | {
      text: string | number
    }
export declare type Cascadable<
  T extends Exclude<SimpleData, string | number>
> = {
  [P in keyof T]: T[P]
} & {
  children?: Cascadable<T>[]
}
export declare type Indexable<T> = {
  index: number
  value: T
}
export declare type IdxCascadable<
  T extends Exclude<SimpleData, string | number>
> = Indexable<Cascadable<T>>
export interface DataSource<T> {
  getInit: () => Nullable<T>
  getPrev: (param: Nullable<T>) => Nullable<T>
  getNext: (param: Nullable<T>) => Nullable<T>
  getText: (param: Nullable<T>) => string
}
export interface DataSourceFactory<T> {
  readonly cascadable?: boolean
  create: () => DataSource<T>[]
  change: (values: Nullable<T>[], index: number) => DataSource<T>[]
}
