import type {
  DataSource,
  DataSourceFactory,
  Nullable,
  Indexable,
  Cascadable,
  SimpleData,
  IdxCascadable
} from './data'
export declare class SimpleDataSource<T extends SimpleData>
  implements DataSource<Indexable<T>> {
  private list
  private initIndex
  private length
  private loop
  constructor(
    data: T[],
    options?: {
      initIndex?: number
      loop?: boolean
    }
  )
  private fixInitIndex
  private createData
  setInitIndex(initIndex?: number): void
  setDataList(list: T[], initIndex?: number): void
  getInit(): Nullable<Indexable<T>>
  getPrev(data: Nullable<Indexable<T>>): Nullable<Indexable<T>>
  getNext(data: Nullable<Indexable<T>>): Nullable<Indexable<T>>
  getText(data: Nullable<Indexable<T>>): string
}
export declare class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<Indexable<T>> {
  private dataSources
  readonly cascadable = false
  constructor(
    dataLists: T[][],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(): DataSource<Indexable<T>>[]
  change(inits: Nullable<Indexable<T>>[]): DataSource<Indexable<T>>[]
}
export declare class CascadeDataSourceFactory<
  T extends Exclude<SimpleData, string | number>
> implements DataSourceFactory<IdxCascadable<T>> {
  private cascadeList
  private options
  private dataSources
  readonly cascadable = true
  constructor(
    cascadeList: Cascadable<T>[],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(): DataSource<IdxCascadable<T>>[]
  change(
    inits: Nullable<IdxCascadable<T>>[],
    index: number
  ): DataSource<IdxCascadable<T>>[]
}
