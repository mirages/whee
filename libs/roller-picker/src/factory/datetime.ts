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
  protected options!: BaseOptions

  constructor(options: InputOpts, parents: number[], index: number) {
    this.setOptions(options, parents, index)
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

  abstract getMax(parents: number[]): number
  abstract getMin(parents: number[]): number

  fixMax(max: number, maxDate: number[], parents: number[], index: number) {
    let flag = true

    for (let i = 0; i < index; i++) {
      if (maxDate[i] !== parents[i]) {
        flag = false
        break
      }
    }

    return flag && max > maxDate[index] ? maxDate[index] : max
  }

  fixMin(min: number, minDate: number[], parents: number[], index: number) {
    let flag = true

    for (let i = 0; i < index; i++) {
      if (minDate[i] !== parents[i]) {
        flag = false
        break
      }
    }

    return flag && min < minDate[index] ? minDate[index] : min
  }

  fixInit(init: number, min: number, max: number): number {
    return init > max ? max : init < min ? min : init
  }

  setOptions(options: InputOpts, parents: number[], index: number): void {
    const loop = options.loop
    const unit = options.unit

    const max = this.fixMax(
      this.getMax(parents),
      options.maxDate,
      parents,
      index
    )
    const min = this.fixMin(
      this.getMin(parents),
      options.minDate,
      parents,
      index
    )
    const init = this.fixInit(options.init, min, max)

    this.options = { min, max, init, loop, unit }
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
    return value === null ? '' : String(value) + this.options.unit
  }
  format(value: number): string {
    return ('0' + value).substr(-2)
  }
}

class YearSource extends BaseSource {
  constructor(options: InputOpts) {
    super(options, [], 0)
  }

  getMax() {
    return 9999
  }
  getMin() {
    return 0
  }
}

class MonthSource extends BaseSource {
  constructor(options: InputOpts, parents: number[]) {
    super(options, parents, 1)
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
    super(options, parents, 2)
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
  constructor(options: InputOpts, parents: number[], index: number) {
    super(options, parents, index)
  }

  getMax() {
    return 23
  }
  getMin() {
    return 0
  }
}

class MinuteSource extends BaseSource {
  constructor(options: InputOpts, parents: number[], index: number) {
    super(options, parents, index)
  }

  getMax() {
    return 59
  }
  getMin() {
    return 0
  }
}

class SecondSource extends BaseSource {
  constructor(options: InputOpts, parents: number[], index: number) {
    super(options, parents, index)
  }

  getMax() {
    return 59
  }
  getMin() {
    return 0
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

  protected createOptions(index: number, prevInit: number): InputOpts {
    return {
      loop: this.loop,
      unit: this.units[index],
      maxDate: this.maxDate,
      minDate: this.minDate,
      init: prevInit
    }
  }

  create(): BaseSource[] {
    const ctors = [
      YearSource,
      MonthSource,
      DaySource,
      HourSource,
      MinuteSource,
      SecondSource
    ]
    const parents: number[] = []
    const max = ctors.length
    let index = 0

    while (index < max) {
      const source = new ctors[index](
        this.createOptions(index, this.initDate[index]),
        parents,
        index
      )
      this.dataSources.push(source)
      parents.push(source.getInit())
      index++
    }

    return this.dataSources
  }

  change(values: number[], index: number): BaseSource[] {
    const length = this.dataSources.length
    const parents = values.slice(0, index + 1)

    while (++index < length) {
      this.dataSources[index].setOptions(
        this.createOptions(index, values[index]),
        parents,
        index
      )
      parents.push(this.dataSources[index].getInit())
    }
    return this.dataSources
  }
}
