import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData
} from './data'
export declare class SimpleDataSource<
  T extends
    | string
    | number
    | {
        text: string | number
      }
> implements DataSource<IndexableData<T>> {
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
  setInit(initIndex?: number): void
  getInit(): NullableData<IndexableData<T>>
  getPrev(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getNext(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getText(data: NullableData<IndexableData<T>>): string
}
export declare class SimpleDataSourceFactory<
  T extends
    | string
    | number
    | {
        text: string | number
      }
> implements DataSourceFactory<IndexableData<T>> {
  private list
  private dataSource
  constructor(
    dataList: T[],
    options?: {
      initIndex?: number
      loop?: boolean
    }
  )
  create(
    init?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[]
}
