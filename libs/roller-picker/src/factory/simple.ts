import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData,
  CascadeData,
  SimpleData,
  IdxCascadeData
} from './data'

export class SimpleDataSource<T extends SimpleData>
  implements DataSource<IndexableData<T>> {
  private list: T[] = []
  private initIndex = 0
  private length = 0
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
    this.setDataList(data, options.initIndex)
    this.loop = options.loop || false
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

  setInitIndex(initIndex?: number): void {
    this.initIndex = this.fixInitIndex(initIndex)
  }

  setDataList(list: T[], initIndex?: number): void {
    this.list = list
    this.length = list.length
    this.setInitIndex(initIndex)
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

    // Here must redefine `value` type as `SimpleData`.
    // Because generics extending unions cannot be narrowed currently.
    // Related issues: https://github.com/microsoft/TypeScript/issues/13995.
    const value: SimpleData = this.list[data.index]

    return typeof value === 'object' ? String(value.text) : String(value)
  }
}

export class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<IndexableData<T>> {
  public cascadable = false
  private dataSources: SimpleDataSource<T>[] = []

  constructor(
    dataLists: T[][],
    options: {
      initIndex?: number
      loop?: boolean
    }[] = [
      {
        initIndex: 0,
        loop: false
      }
    ]
  ) {
    dataLists.forEach((col, index) => {
      this.dataSources.push(new SimpleDataSource(col, options[index]))
    })
  }

  create(): DataSource<IndexableData<T>>[] {
    return [...this.dataSources]
  }

  // update all dataSource
  change(
    inits: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[] {
    inits.forEach((init, index) => {
      this.dataSources[index].setInitIndex(init?.index)
    })
    return [...this.dataSources]
  }
}

export class CascadeDataSourceFactory<T extends { text: string }>
  implements DataSourceFactory<IdxCascadeData<T>> {
  public cascadable = true
  private cascadeList: CascadeData<T>[] = []
  private options: { initIndex?: number; loop?: boolean }[] = []
  private dataSources: SimpleDataSource<CascadeData<T>>[] = []

  constructor(
    cascadeList: CascadeData<T>[],
    options: {
      initIndex?: number
      loop?: boolean
    }[] = [
      {
        initIndex: 0,
        loop: false
      }
    ]
  ) {
    this.cascadeList = cascadeList
    this.options = options
  }

  create(): DataSource<IdxCascadeData<T>>[] {
    let idx = 0
    let list: CascadeData<T>[] | undefined = this.cascadeList

    while (list) {
      const ds: SimpleDataSource<CascadeData<T>> = new SimpleDataSource(
        list,
        this.options[idx]
      )
      const prevData = ds.getInit()

      this.dataSources.push(ds)
      idx++
      list = list[prevData ? prevData.index : 0].children
    }

    return [...this.dataSources]
  }

  // update as cascade
  change(
    inits: NullableData<IdxCascadeData<T>>[],
    index: number
  ): DataSource<IdxCascadeData<T>>[] {
    if (index < 0) index = 0 // index may be -1
    // change dataSources[index] init index
    this.dataSources[index].setInitIndex(inits[index]?.index)
    // cascade down data source
    let list: CascadeData<T>[] | undefined

    do {
      list = this.dataSources[index++].getInit()?.value.children
      list && this.dataSources[index].setDataList(list, inits[index]?.index)
    } while (list)

    return [...this.dataSources]
  }
}
