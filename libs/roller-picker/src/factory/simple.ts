import type {
  DataSource,
  DataSourceFactory,
  NullableData,
  IndexableData,
  CascadeData,
  SimpleData
} from './data'

export class SimpleDataSource<T extends SimpleData>
  implements DataSource<IndexableData<T>> {
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

    // Here must redefine `value` type as `SimpleData`.
    // Because generics extending unions cannot be narrowed currently.
    // Related issues: https://github.com/microsoft/TypeScript/issues/13995.
    const value: SimpleData = this.list[data.index]

    return typeof value === 'object' ? String(value.text) : String(value)
  }
}

export class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<IndexableData<T>> {
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

  create(
    inits?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[] {
    if (inits) {
      inits.forEach((init, index) => {
        this.dataSources[index].setInit(init?.index)
      })
    }
    return this.dataSources
  }
}

export class CascadeDataSourceFactory<T extends { text: string }>
  implements DataSourceFactory<IndexableData<T>> {
  private list: CascadeData<T>[] = []
  private options: { initIndex?: number; loop?: boolean }[] = []

  constructor(
    dataList: CascadeData<T>[],
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
    this.list = dataList
    this.options = options
  }

  create(
    inits?: NullableData<IndexableData<T>>[]
  ): DataSource<IndexableData<T>>[] {
    const dataSources: SimpleDataSource<T>[] = []
    let options: { initIndex?: number; loop?: boolean }[] = []

    if (inits) {
      inits.forEach((init, idx) => {
        options.push({
          initIndex: init ? init.index : 0,
          loop: this.options[idx].loop
        })
      })
    } else {
      options = this.options
    }

    let idx = 0
    let list: CascadeData<T>[] | undefined = this.list

    while (list) {
      const ds: SimpleDataSource<CascadeData<T>> = new SimpleDataSource(
        list,
        options[idx]
      )
      const prevData = ds.getInit()
      idx++
      list = list[prevData ? prevData.index : 0].children
    }

    return dataSources
  }
}
