import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData
} from './data'

export class SimpleDataSource<
  T extends string | number | { text: string | number }
> implements DataSource<IndexableData<T>> {
  private list: T[] = []
  private initIndex = 0
  private length: number
  private loop: boolean

  constructor(
    data: T[],
    options: {
      initIndex?: number
      loop?: boolean
    } = {
      initIndex: 0,
      loop: false
    }
  ) {
    this.list = data
    this.length = this.list.length
    this.loop = options.loop || false
    this.setInit(options.initIndex)
  }

  private fixInitIndex(index?: number): number {
    index = index || 0
    if (!Number(index) || index < 0 || index > this.length - 1) {
      return 0
    } else {
      return index
    }
  }

  private createData(index: number): NullableData<IndexableData<T>> {
    if (index < 0 && this.loop) {
      index = this.length + index
    } else if (index > this.length - 1 && this.loop) {
      index = index - this.length
    }

    return index < 0 || index > this.length - 1
      ? null
      : {
          index,
          value: this.list[index]
        }
  }

  setInit(initIndex?: number): void {
    this.initIndex = this.fixInitIndex(initIndex)
  }

  getInit(): NullableData<IndexableData<T>> {
    return this.createData(this.initIndex)
  }

  getPrev(
    data: NullableData<IndexableData<T>>
  ): NullableData<IndexableData<T>> {
    if (data === null) return null
    return this.createData(data.index - 1)
  }

  getNext(
    data: NullableData<IndexableData<T>>
  ): NullableData<IndexableData<T>> {
    if (data === null) return null
    return this.createData(data.index + 1)
  }

  getText(data: NullableData<IndexableData<T>>): string {
    if (data === null) return ''

    // Here must redefine `value` type as `string | number | { text: string | number }`.
    // Because generics extending unions cannot be narrowed currently.
    // Related issues: https://github.com/microsoft/TypeScript/issues/13995.
    const value: string | number | { text: string | number } = this.list[
      data.index
    ]

    return typeof value === 'object' ? String(value.text) : String(value)
  }
}

export class SimpleDataSourceFactory<
  T extends string | number | { text: string | number }
> implements DataSourceFactory<IndexableData<T>> {
  private list: T[] = []
  private dataSource: SimpleDataSource<T>

  constructor(
    dataList: T[],
    options: {
      initIndex?: number
      loop?: boolean
    } = {
      initIndex: 0,
      loop: false
    }
  ) {
    this.dataSource = new SimpleDataSource(dataList, options)
  }

  create(
    init?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[] {
    if (init) {
      this.dataSource.setInit(init[0]?.index)
    }
    return [this.dataSource]
  }
}
