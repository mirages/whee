import { DataFactory, NullableData } from './data'
interface IndexableData<T> {
  index: number
  value: T
}
export declare class SimpleDataFactory<T extends string>
  implements DataFactory<IndexableData<T>> {
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
  getInit(): NullableData<IndexableData<T>>
  getPrev(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getNext(data: NullableData<IndexableData<T>>): NullableData<IndexableData<T>>
  getText(data: NullableData<IndexableData<T>>): string
}
export {}
