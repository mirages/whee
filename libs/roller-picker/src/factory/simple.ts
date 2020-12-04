import type {
  DataSource,
  DataSourceFactory,
  Nullable,
  Indexable,
  Cascadable,
  SimpleData,
  IdxCascadable
} from './data'

export class SimpleDataSource<T extends SimpleData>
  implements DataSource<Indexable<T>> {
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

  private createData(index: number): Nullable<Indexable<T>> {
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

  getInit(): Nullable<Indexable<T>> {
    return this.createData(this.initIndex)
  }

  getPrev(data: Nullable<Indexable<T>>): Nullable<Indexable<T>> {
    if (data === null) return null
    return this.createData(data.index - 1)
  }

  getNext(data: Nullable<Indexable<T>>): Nullable<Indexable<T>> {
    if (data === null) return null
    return this.createData(data.index + 1)
  }

  getText(data: Nullable<Indexable<T>>): string {
    if (data === null) return ''

    // Here must redefine `value` type as `SimpleData`.
    // Because generics extending unions cannot be narrowed currently.
    // Related issues: https://github.com/microsoft/TypeScript/issues/13995.
    const value: SimpleData = this.list[data.index]

    return typeof value === 'object' ? String(value.text) : String(value)
  }
}

export class SimpleDataSourceFactory<T extends SimpleData>
  implements DataSourceFactory<Indexable<T>> {
  private dataSources: SimpleDataSource<T>[] = []

  readonly cascadable = false

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

  create(): DataSource<Indexable<T>>[] {
    return this.dataSources
  }

  // update all dataSource
  change(inits: Nullable<Indexable<T>>[]): DataSource<Indexable<T>>[] {
    inits.forEach((init, index) => {
      this.dataSources[index].setInitIndex(init?.index)
    })
    return this.dataSources
  }
}

export class CascadeDataSourceFactory<
  T extends Exclude<SimpleData, string | number>
> implements DataSourceFactory<IdxCascadable<T>> {
  private cascadeList: Cascadable<T>[] = []
  private options: { initIndex?: number; loop?: boolean }[] = []
  private dataSources: SimpleDataSource<Cascadable<T>>[] = []

  readonly cascadable = true

  constructor(
    cascadeList: Cascadable<T>[],
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

  create(): DataSource<IdxCascadable<T>>[] {
    let idx = 0
    let list: Cascadable<T>[] | undefined = this.cascadeList

    while (list) {
      const ds: SimpleDataSource<Cascadable<T>> = new SimpleDataSource(
        list,
        this.options[idx]
      )
      const prevData = ds.getInit()

      this.dataSources.push(ds)
      idx++
      list = list[prevData ? prevData.index : 0].children
    }

    return this.dataSources
  }

  // update as cascade
  change(
    inits: Nullable<IdxCascadable<T>>[],
    index: number
  ): DataSource<IdxCascadable<T>>[] {
    if (index < 0) index = 0 // index may be -1
    // change dataSources[index] init index
    this.dataSources[index].setInitIndex(inits[index]?.index)
    // cascade down data source
    let list: Cascadable<T>[] | undefined

    do {
      list = this.dataSources[index++].getInit()?.value.children
      list && this.dataSources[index].setDataList(list, inits[index]?.index)
    } while (list)

    return this.dataSources
  }
}
