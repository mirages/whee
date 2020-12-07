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
/**
 * date source type.
 * 从 0 开始，对应数组数据的下标索引值
 */
declare const enum DSTYPE {
  year = 0,
  month = 1,
  day = 2,
  hour = 3,
  minute = 4,
  second = 5
}
declare abstract class BaseSource implements DataSource<number> {
  protected options: BaseOptions
  protected type: DSTYPE
  constructor(options: InputOpts, parents: number[], type: DSTYPE)
  setOptions(options: InputOpts, parents: number[]): void
  private fixMax
  private fixMin
  private fixInit
  abstract getMax(parents: number[]): number
  abstract getMin(parents: number[]): number
  private createData
  getInit(): number
  getPrev(value: Nullable<number>): Nullable<number>
  getNext(value: Nullable<number>): Nullable<number>
  getText(value: Nullable<number>): string
  format(value: number): string
}
/**
 * '0' 对应 DSTYPE.year
 * '1' 对应 DSTYPE.month
 * '2' 对应 DSTYPE.day
 * '3' 对应 DSTYPE.hour
 * '4' 对应 DSTYPE.minute
 * '5' 对应 DSTYPE.second
 */
export declare enum DATETYPE {
  yyyy = '0',
  yyyyMM = '01',
  yyyyMMdd = '012',
  yyyyMMddHH = '0123',
  yyyyMMddHHmm = '01234',
  yyyyMMddHHmmss = '012345',
  MM = '1',
  MMdd = '12',
  MMddHH = '123',
  MMddHHmm = '1234',
  MMddHHmmss = '12345',
  dd = '2',
  ddHH = '23',
  ddHHmm = '234',
  ddHHmmss = '2345',
  HH = '3',
  HHmm = '34',
  HHmmss = '345',
  mm = '4',
  mmss = '45',
  ss = '5'
}
export declare class DatetimeDataSourceFactory
  implements DataSourceFactory<number> {
  readonly cascadable = true
  readonly minDate: number[]
  readonly maxDate: number[]
  readonly initDate: number[]
  readonly units: string[]
  readonly loop: boolean
  readonly types: DSTYPE[]
  protected dataSources: BaseSource[]
  constructor(options?: {
    minDate?: Date
    maxDate?: Date
    initDate?: Date
    loop?: boolean
    type?: DATETYPE
    units?: string[]
  })
  protected dateToArray(date: Date): number[]
  protected createOptions(type: number, prevInit: number): InputOpts
  create(): BaseSource[]
  change(values: number[], index: number): BaseSource[]
}
export {}
