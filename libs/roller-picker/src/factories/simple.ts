import { DataFactory, NullableData } from './data'

interface IndexableData<T> {
  index: number
  value: T
}
export class SimpleDataFactory<T extends string>
  implements DataFactory<IndexableData<T>> {
  private list: T[] = []
  private initIndex: number
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
    this.initIndex = this.fixInitIndex(options.initIndex || 0)
    this.loop = options.loop || false
  }

  private fixInitIndex(index: number): number {
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
    return this.list[data.index]
  }
}
