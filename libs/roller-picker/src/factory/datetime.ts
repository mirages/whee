import type { DataSource, DataSourceFactory, Nullable } from './data'

interface BaseOptions {
  max: number
  min: number
  init: number
  loop: boolean
  unit: string
}

abstract class BaseSource implements DataSource<number> {
  protected nowDate = new Date()
  protected minDate: Date
  protected maxDate: Date
  protected abstract options: BaseOptions

  constructor(minDate?: Date, maxDate?: Date) {
    this.minDate = minDate || new Date(1900, 0, 1, 0, 0, 0, 0)
    this.maxDate = maxDate || this.nowDate

    if (this.maxDate < this.minDate) {
      throw new Error('BaseSource: maxDate must not be less than minDate')
    }
  }
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

  abstract setOptions(
    options: Partial<BaseOptions>,
    parents?: Nullable<number>[]
  ): void

  getInit(): Nullable<number> {
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
    return value === null ? '' : String(value) + this.options.unit
  }
  format(value: number): string {
    return ('0' + value).substr(-2)
  }
}

type InputOpts = Omit<BaseOptions, 'min' | 'max'> & {
  maxDate: Date
  minDate: Date
}

function fixInit(init: number, min: number, max: number): number {
  return init > max ? max : init < min ? min : init
}

class YearSource extends BaseSource {
  protected options!: BaseOptions
  constructor(options: Partial<InputOpts> = {}) {
    super(options.minDate, options.maxDate)
    this.setOptions(options)
  }

  setOptions(options: Partial<InputOpts>): void {
    const max = this.maxDate.getFullYear()
    const min = this.minDate.getFullYear()
    const loop = !!options.loop
    const unit = options.unit || '年'
    let init = options.init ?? this.nowDate.getFullYear()

    init = fixInit(init, min, max)
    this.options = { min, max, init, loop, unit }
  }
}

class MonthSource extends BaseSource {
  protected options!: BaseOptions
  constructor(options: Partial<InputOpts>, parents: Nullable<number>[]) {
    super(options.minDate, options.maxDate)
    this.setOptions(options, parents)
  }

  setOptions(options: Partial<InputOpts>, parents: Nullable<number>[]): void {
    const year = parents[0] ?? this.nowDate.getFullYear()
    const minYear = this.minDate.getFullYear()
    const minMon = this.minDate.getMonth()
    const maxYear = this.maxDate.getFullYear()
    const maxMon = this.maxDate.getMonth()
    const loop = !!options.loop
    const unit = options.unit || '月'
    let max = 11
    let min = 0
    let init = options.init ?? this.nowDate.getMonth()

    if (year < minYear || year > maxYear) {
      throw new Error(
        'MonthSource.setOptions - initValue must not be less than options.minDate, and must not be greater than options.maxDate'
      )
    } else if (year === minYear && min < minMon) {
      min = minMon
    } else if (year === maxYear && max > maxMon) {
      max = maxMon
    }

    init = fixInit(init, min, max)
    this.options = { min, max, init, loop, unit }
  }
  getText(value: Nullable<number>): string {
    return super.getText(value === null ? null : value + 1)
  }
}

class DaySource extends BaseSource {
  protected options!: BaseOptions
  constructor(options: Partial<InputOpts>, parents: Nullable<number>[]) {
    super(options.minDate, options.maxDate)
    this.setOptions(options, parents)
  }

  setOptions(options: Partial<InputOpts>, parents: Nullable<number>[]): void {
    const year = parents[0] ?? this.nowDate.getFullYear()
    const month = parents[1] ?? this.nowDate.getMonth()
    const minYear = this.minDate.getFullYear()
    const minMon = this.minDate.getMonth()
    const minDay = this.minDate.getDate()
    const maxYear = this.maxDate.getFullYear()
    const maxMon = this.maxDate.getMonth()
    const maxDay = this.maxDate.getDate()
    const loop = !!options.loop
    const unit = options.unit || '日'
    let max = this.getMonthDays(year, month)
    let min = 1
    let init = options.init ?? this.nowDate.getDate()

    if (
      year < minYear ||
      year > maxYear ||
      (year === minYear && month < minMon) ||
      (year === maxYear && month > maxMon)
    ) {
      throw new Error(
        'DaySource.setOptions - initValue must not be less than options.minDate, and must not be greater than options.maxDate'
      )
    } else if (year === minYear && month === minMon && min < minDay) {
      min = minDay
    } else if (year === maxYear && month === maxMon && max > maxDay) {
      max = maxDay
    }

    init = fixInit(init, min, max)
    this.options = { min, max, init, loop, unit }
  }

  getMonthDays(year: number, month: number) {
    const days = [31, 0, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    const isLeapYear = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0

    if (Number(month) === 1) {
      days[month] = isLeapYear ? 29 : 28
    }

    return days[month]
  }
}

export class DatetimeDataSourceFactory implements DataSourceFactory<number> {
  readonly cascadable = true
  protected options
  protected dataSources: BaseSource[] = []

  constructor(
    options: {
      minDate?: Date
      maxDate?: Date
      loop?: boolean
    } = {}
  ) {
    this.options = options
  }
  create(): BaseSource[] {
    const years = new YearSource(this.options)
    const months = new MonthSource(this.options, [years.getInit()!])
    const days = new DaySource(this.options, [
      years.getInit()!,
      months.getInit()!
    ])

    this.dataSources = [years, months, days]

    return this.dataSources
  }
  change(values: Nullable<number>[], index: number): BaseSource[] {
    const length = values.length
    const parents = values.slice(0, index + 1)

    while (++index < length) {
      this.dataSources[index].setOptions(
        {
          ...this.options,
          init: values[index]!
        },
        parents
      )
      parents.push(this.dataSources[index].getInit())
    }
    return this.dataSources
  }
}
