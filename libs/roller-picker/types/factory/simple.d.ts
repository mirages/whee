import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData,
  CascadeData,
  SimpleData,
  IdxCascadeData
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
  setInitIndex(initIndex?: number): void
  setDataList(list: T[], initIndex?: number): void
  getInit(): NullableData<IndexableData<T>>
  getPrev(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getNext(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getText(data: NullableData<IndexableData<T>>): string
}
export declare class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<IndexableData<T>> {
  cascadable: boolean
  private dataSources
  constructor(
    dataLists: T[][],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(): DataSource<IndexableData<T>>[]
  change(
    inits: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[]
}
export declare class CascadeDataSourceFactory<
  T extends {
    text: string
  }
> implements DataSourceFactory<IdxCascadeData<T>> {
  cascadable: boolean
  private cascadeList
  private options
  private dataSources
  constructor(
    cascadeList: CascadeData<T>[],
    options?: {
      initIndex?: number
      loop?: boolean
    }[]
  )
  create(): DataSource<IdxCascadeData<T>>[]
  change(
    inits: NullableData<IdxCascadeData<T>>[],
    index: number
  ): DataSource<IdxCascadeData<T>>[]
}
