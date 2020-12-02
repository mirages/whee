import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData,
  CascadeData,
  SimpleData
} from './data'
export declare class SimpleDataSource<T extends SimpleData>
  implements DataSource<IndexableData<T>> {
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
export declare class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<IndexableData<T>> {
  private dataSources
  constructor(
    dataLists: T[][],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(
    inits?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[]
}
export declare class CascadeDataSourceFactory<
  T extends {
    text: string
  }
> implements DataSourceFactory<IndexableData<T>> {
  private list
  private options
  constructor(
    dataList: CascadeData<T>[],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(
    inits?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[]
}
