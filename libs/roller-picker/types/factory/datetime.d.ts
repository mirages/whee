import type { DataSource, DataSourceFactory, Nullable } from './data'
interface BaseOptions {
  max: number
  min: number
  init: number
  loop: boolean
  unit: string
}
declare type InputOpts = {
  maxDate: number[]
  minDate: number[]
  init: number
  loop: boolean
  unit: string
}
declare abstract class BaseSource implements DataSource<number> {
  protected options: BaseOptions
  constructor(options: InputOpts, parents: number[], index: number)
  private createData
  abstract getMax(parents: number[]): number
  abstract getMin(parents: number[]): number
  fixMax(
    max: number,
    maxDate: number[],
    parents: number[],
    index: number
  ): number
  fixMin(
    min: number,
    minDate: number[],
    parents: number[],
    index: number
  ): number
  fixInit(init: number, min: number, max: number): number
  setOptions(options: InputOpts, parents: number[], index: number): void
  getInit(): number
  getPrev(value: Nullable<number>): Nullable<number>
  getNext(value: Nullable<number>): Nullable<number>
  getText(value: Nullable<number>): string
  format(value: number): string
}
export declare class DatetimeDataSourceFactory
  implements DataSourceFactory<number> {
  readonly cascadable = true
  readonly minDate: number[]
  readonly maxDate: number[]
  readonly initDate: number[]
  readonly units: string[]
  readonly loop: boolean
  protected dataSources: BaseSource[]
  constructor(options?: {
    minDate?: Date
    maxDate?: Date
    initDate?: Date
    loop?: boolean
  })
  protected dateToArray(date: Date): number[]
  protected createOptions(index: number, prevInit: number): InputOpts
  create(): BaseSource[]
  change(values: number[], index: number): BaseSource[]
}
export {}
