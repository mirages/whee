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

abstract class BaseSource implements DataSource<number> {
  protected nowDate = new Date()
  protected abstract options: BaseOptions

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

  abstract setOptions(options: InputOpts, parents?: Nullable<number>[]): void

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

function fixInit(init: number, min: number, max: number): number {
  return init > max ? max : init < min ? min : init
}

class YearSource extends BaseSource {
  protected options!: BaseOptions
  constructor(options: InputOpts) {
    super()
    this.setOptions(options)
  }

  setOptions(options: InputOpts): void {
    const max = options.maxDate[0]
    const min = options.minDate[0]
    const loop = options.loop
    const unit = options.unit
    const init = options.init

    this.options = { min, max, init, loop, unit }
  }
}

class MonthSource extends BaseSource {
  protected options!: BaseOptions
  constructor(options: InputOpts, parents: number[]) {
    super()
    this.setOptions(options, parents)
  }

  setOptions(options: InputOpts, parents: number[]): void {
    const [year] = parents
    const [minYear, minMon] = options.minDate
    const [maxYear, maxMon] = options.maxDate
    const loop = options.loop
    const unit = options.unit
    let max = 11
    let min = 0
    let init = options.init

    if (year === minYear && min < minMon) {
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
  constructor(options: InputOpts, parents: number[]) {
    super()
    this.setOptions(options, parents)
  }

  setOptions(options: InputOpts, parents: number[]): void {
    const [year, month] = parents
    const [minYear, minMon, minDay] = options.minDate
    const [maxYear, maxMon, maxDay] = options.maxDate
    const loop = options.loop
    const unit = options.unit
    let max = this.getMonthDays(year, month)
    let min = 1
    let init = options.init

    if (year === minYear && month === minMon && min < minDay) {
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
  readonly minDate: number[] = []
  readonly maxDate: number[] = []
  readonly initDate: number[] = []
  readonly units: string[] = []
  readonly loop: boolean
  protected dataSources: BaseSource[] = []

  constructor(
    options: {
      minDate?: Date
      maxDate?: Date
      initDate?: Date
      loop?: boolean
    } = {}
  ) {
    const now = new Date()
    const {
      minDate = new Date(1900, 0, 1, 0, 0, 0, 0),
      maxDate = now,
      initDate = now,
      loop = false
    } = options

    let _initDate = initDate
    if (maxDate < minDate) {
      throw new Error(
        'DatetimeDataSourceFactory: options.maxDate must not be less than options.minDate'
      )
    } else if (initDate > maxDate) {
      _initDate = maxDate
    } else if (initDate < minDate) {
      _initDate = minDate
    }

    this.minDate = this.dateToArray(minDate)
    this.maxDate = this.dateToArray(maxDate)
    this.initDate = this.dateToArray(_initDate)
    this.units = ['年', '月', '日', '时', '分', '秒']
    this.loop = loop
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
  protected createOption(index: number, prevInit?: number) {
    return {
      loop: this.loop,
      unit: this.units[index],
      maxDate: this.maxDate.slice(0, index + 1),
      minDate: this.minDate.slice(0, index + 1),
      init: prevInit ?? this.initDate[index]
    }
  }
  create(): BaseSource[] {
    const years = new YearSource(this.createOption(0))
    const months = new MonthSource(this.createOption(1), [years.getInit()!])
    const days = new DaySource(this.createOption(2), [
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
        this.createOption(index, values[index]!),
        parents
      )
      parents.push(this.dataSources[index].getInit())
    }
    return this.dataSources
  }
}
