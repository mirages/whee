export interface BaseData {
  _text: string
}
export declare type NullableData<T> = T | null
export interface DataFactory<T extends BaseData> {
  getInit: () => NullableData<T>
  getPrev: (param: NullableData<T>) => NullableData<T>
  getNext: (param: NullableData<T>) => NullableData<T>
}
export interface DataFactories<T extends BaseData> {
  create: (values?: NullableData<T>[]) => DataFactory<T>[]
}
