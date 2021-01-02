import type { DataSource, DataSourceFactory, Nullable } from './data'

interface BaseOptions {
  max: number
  min: number
  init: number
  loop: boolean
  unit: string
}

type InputOpts = {
  maxDate: number[]
  minDate: number[]
  init: number
  loop: boolean
  unit: string
}

/**
 * date source type.
 */
const DateSourceType = {
  year: '0' as const,
  month: '1' as const,
  day: '2' as const,
  hour: '3' as const,
  minute: '4' as const,
  second: '5' as const
}
type DateSourceTypeValue = typeof DateSourceType[keyof typeof DateSourceType]

abstract class BaseSource implements DataSource<number> {
  protected options!: BaseOptions
  protected type: DateSourceTypeValue

  constructor(
    options: InputOpts,
    parents: number[],
    type: DateSourceTypeValue
  ) {
    this.type = type
    this.setOptions(options, parents)
  }

  setOptions(options: InputOpts, parents: number[]): void {
    const loop = options.loop
    const unit = options.unit

    const max = this.fixMax(this.getMax(parents), options.maxDate, parents)
    const min = this.fixMin(this.getMin(parents), options.minDate, parents)
    const init = this.fixInit(options.init, min, max)

    this.options = { min, max, init, loop, unit }
  }

  private fixMax(max: number, maxDate: number[], parents: number[]) {
    const type = Number(this.type)
    const isEqual =
      maxDate.slice(0, type).toString() === parents.slice(0, type).toString()

    return isEqual && max > maxDate[type] ? maxDate[type] : max
  }

  private fixMin(min: number, minDate: number[], parents: number[]) {
    const type = Number(this.type)
    const isEqual =
      minDate.slice(0, type).toString() === parents.slice(0, type).toString()

    return isEqual && min < minDate[type] ? minDate[type] : min
  }

  private fixInit(init: number, min: number, max: number): number {
    return init > max ? max : init < min ? min : init
  }

  abstract getMax(parents: number[]): number
  abstract getMin(parents: number[]): number

  private createData(value: number): Nullable<number> {
    let _value: number | null
    if (value < this.options.min) {
      _value = this.options.loop ? this.options.max : null
    } else if (value > this.options.max) {
      _value = this.options.loop ? this.options.min : null
    } else {
      _value = value
    }

    return _value
  }

  getInit(): number {
    return this.options.init
  }

  getPrev(value: Nullable<number>): Nullable<number> {
    if (value === null) return null
    return this.createData(value - 1)
  }
  getNext(value: Nullable<number>): Nullable<number> {
    if (value === null) return null
    return this.createData(value + 1)
  }
  getText(value: Nullable<number>): string {
    return value === null ? '' : this.format(value) + this.options.unit
  }
  format(value: number): string {
    return ('0' + value).substr(-2)
  }
}

class YearSource extends BaseSource {
  constructor(options: InputOpts, parents: number[] = []) {
    super(options, parents, DateSourceType.year)
  }

  getMax() {
    return 9999
  }
  getMin() {
    return 0
  }
  /**
   * @override
   */
  format(value: number) {
    return String(value)
  }
}

class MonthSource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, DateSourceType.month)
  }

  getMax() {
    return 11
  }
  getMin() {
    return 0
  }
  getText(value: Nullable<number>): string {
    return super.getText(value === null ? null : value + 1)
  }
}

class DaySource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, DateSourceType.day)
  }

  getMax(parents: number[]) {
    const [year, month] = parents
    const days = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    if (Number(month) === 1) {
      days[month] = isLeapYear ? 29 : 28
    }

    return days[month]
  }
  getMin() {
    return 1
  }
}

class HourSource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, DateSourceType.hour)
  }

  getMax() {
    return 23
  }
  getMin() {
    return 0
  }
}

class MinuteSource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, DateSourceType.minute)
  }

  getMax() {
    return 59
  }
  getMin() {
    return 0
  }
}

class SecondSource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, DateSourceType.second)
  }

  getMax() {
    return 59
  }
  getMin() {
    return 0
  }
}

/**
 * '0','1','2','3','4','5' 分别对应 DateSourceTypeValue
 */
export const DATETYPE: {
  yyyy: '0'
  yyyyMM: '01'
  yyyyMMdd: '012'
  yyyyMMddHH: '0123'
  yyyyMMddHHmm: '01234'
  yyyyMMddHHmmss: '012345'
  MM: '1'
  MMdd: '12'
  MMddHH: '123'
  MMddHHmm: '1234'
  MMddHHmmss: '12345'
  dd: '2'
  ddHH: '23'
  ddHHmm: '234'
  ddHHmmss: '2345'
  HH: '3'
  HHmm: '34'
  HHmmss: '345'
  mm: '4'
  mmss: '45'
  ss: '5'
} = {
  yyyy: '0',
  yyyyMM: '01',
  yyyyMMdd: '012',
  yyyyMMddHH: '0123',
  yyyyMMddHHmm: '01234',
  yyyyMMddHHmmss: '012345',
  MM: '1',
  MMdd: '12',
  MMddHH: '123',
  MMddHHmm: '1234',
  MMddHHmmss: '12345',
  dd: '2',
  ddHH: '23',
  ddHHmm: '234',
  ddHHmmss: '2345',
  HH: '3',
  HHmm: '34',
  HHmmss: '345',
  mm: '4',
  mmss: '45',
  ss: '5'
}
type DatetimeTypeValue = typeof DATETYPE[keyof typeof DATETYPE]

const UNITS = ['年', '月', '日', '时', '分', '秒']
const CTORS = [
  YearSource,
  MonthSource,
  DaySource,
  HourSource,
  MinuteSource,
  SecondSource
]

export class DatetimeDataSourceFactory implements DataSourceFactory<number> {
  readonly cascadable = true
  readonly minDate: number[] = []
  readonly maxDate: number[] = []
  readonly initDate: number[] = []
  readonly units: string[] = []
  readonly loop: boolean
  readonly types: DateSourceTypeValue[]
  protected dataSources: BaseSource[] = []

  constructor(
    options: {
      minDate?: Date
      maxDate?: Date
      initDate?: Date
      loop?: boolean
      type?: DatetimeTypeValue
      units?: string[]
    } = {}
  ) {
    const now = new Date()
    const {
      loop = false,
      type = DATETYPE.yyyyMMdd,
      units = UNITS,
      minDate = new Date(1900, 0, 1, 0, 0, 0),
      maxDate = now
    } = options
    let { initDate = now } = options

    if (maxDate < minDate) {
      throw new Error(
        'DatetimeDataSourceFactory: options.maxDate must not be less than options.minDate'
      )
    } else if (initDate > maxDate) {
      initDate = maxDate
    } else if (initDate < minDate) {
      initDate = minDate
    }

    this.minDate = this.dateToArray(minDate)
    this.maxDate = this.dateToArray(maxDate)
    this.initDate = this.dateToArray(initDate)
    this.loop = loop
    this.types = type.split('') as DateSourceTypeValue[]
    this.units = this.types.reduce((acc, type, idx) => {
      acc[Number(type)] = units[idx]
      return acc
    }, UNITS.slice(0))
  }

  protected dateToArray(date: Date): number[] {
    return [
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds()
    ]
  }

  protected createOptions(type: number, prevInit: number): InputOpts {
    return {
      loop: this.loop,
      unit: this.units[type],
      maxDate: this.maxDate,
      minDate: this.minDate,
      init: prevInit
    }
  }

  create(): BaseSource[] {
    const parents: number[] = this.initDate.slice(0, Number(this.types[0]))

    this.types.forEach(type => {
      const _type = Number(type)
      const source = new CTORS[_type](
        this.createOptions(_type, this.initDate[_type]),
        parents
      )
      this.dataSources.push(source)
      parents.push(source.getInit())
    })

    return this.dataSources
  }

  change(values: number[], index: number): BaseSource[] {
    const parents: number[] = this.initDate
      .slice(0, Number(this.types[0]))
      .concat(values.slice(0, index + 1))

    for (let i = index + 1, len = this.types.length; i < len; i++) {
      this.dataSources[i].setOptions(
        this.createOptions(Number(this.types[i]), values[i]),
        parents
      )
      parents.push(this.dataSources[i].getInit())
    }

    return this.dataSources
  }
}
