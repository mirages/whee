import type { DataSource, DataSourceFactory, Nullable } from './data'
interface BaseOptions {
  max: number
  min: number
  init: number
  loop: boolean
  unit: string
}
declare abstract class BaseSource implements DataSource<number> {
  protected nowDate: Date
  protected minDate: Date
  protected maxDate: Date
  protected abstract options: BaseOptions
  constructor(minDate?: Date, maxDate?: Date)
  private createData
  abstract setOptions(
    options: Partial<BaseOptions>,
    parents?: Nullable<number>[]
  ): void
  getInit(): Nullable<number>
  getPrev(value: Nullable<number>): Nullable<number>
  getNext(value: Nullable<number>): Nullable<number>
  getText(value: Nullable<number>): string
  format(value: number): string
}
export declare class DatetimeDataSourceFactory
  implements DataSourceFactory<number> {
  readonly cascadable = true
  protected options: {
    minDate?: Date | undefined
    maxDate?: Date | undefined
    loop?: boolean | undefined
  }
  protected dataSources: BaseSource[]
  constructor(options?: { minDate?: Date; maxDate?: Date; loop?: boolean })
  create(): BaseSource[]
  change(values: Nullable<number>[], index: number): BaseSource[]
}
export {}
