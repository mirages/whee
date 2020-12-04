export type Nullable<T> = T | null

export type SimpleData = string | number | { text: string | number }

export type Cascadable<T extends Exclude<SimpleData, string | number>> = {
  [P in keyof T]: T[P]
} & {
  children?: Cascadable<T>[]
}

export type Indexable<T> = {
  index: number
  value: T
}

export type IdxCascadable<
  T extends Exclude<SimpleData, string | number>
> = Indexable<Cascadable<T>>

export interface DataSource<T> {
  getInit: () => Nullable<T>

  getPrev: (param: Nullable<T>) => Nullable<T>

  getNext: (param: Nullable<T>) => Nullable<T>

  getText: (param: Nullable<T>) => string
}

export interface DataSourceFactory<T> {
  // data is cascadable
  readonly cascadable?: boolean
  // create init dataSource list
  create: () => DataSource<T>[]
  // indexed data changed need to update relevant dataSource
  // if index === -1, should update all dataSource
  change: (values: Nullable<T>[], index: number) => DataSource<T>[]
}
