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
  protected nowDate: Date
  protected abstract options: BaseOptions
  private createData
  abstract setOptions(options: InputOpts, parents?: Nullable<number>[]): void
  getInit(): Nullable<number>
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
  protected createOption(
    index: number,
    prevInit?: number
  ): {
    loop: boolean
    unit: string
    maxDate: number[]
    minDate: number[]
    init: number
  }
  create(): BaseSource[]
  change(values: Nullable<number>[], index: number): BaseSource[]
}
export {}
