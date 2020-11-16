export interface BaseData {
  _text: string
}
export interface DataFactory<T extends BaseData> {
  getInit(): T | null
  getPrev(param: T | null): T | null
  getNext(param: T | null): T | null
}
export interface DataFactories<T extends BaseData> {
  create(): DataFactory<T>[]
  change(values: (T | null)[]): DataFactory<T>[] | void
}
