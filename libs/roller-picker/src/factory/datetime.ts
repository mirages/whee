import type { DataSource, DataSourceFactory, Nullable } from './data'

interface BaseOptions {
  max: number
  min: number
  init: number
  loop: boolean
  unit: string
}

abstract class BaseSource implements DataSource<number> {
  protected _options: BaseOptions

  constructor(options: Partial<BaseOptions>) {
    this._options = this.validateOptions(options)
  }

  private createData(value: number): Nullable<number> {
    let _value: number | null
    if (value < this._options.min) {
      _value = this._options.loop ? this._options.max : null
    } else if (value > this._options.max) {
      _value = this._options.loop ? this._options.min : null
    } else {
      _value = value
    }

    return _value
  }

  abstract validateOptions(options: Partial<BaseOptions>): BaseOptions

  setOptions(options: Partial<BaseOptions>) {
    this._options = this.validateOptions({
      ...this._options,
      ...options
    })
  }

  getInit(): Nullable<number> {
    return this._options.init
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
    return value === null ? '' : String(value) + this._options.unit
  }
}

class YearSource extends BaseSource {
  constructor(options: Partial<BaseOptions>) {
    super(options)
  }

  validateOptions(options: Partial<BaseOptions>): BaseOptions {
    const now = new Date()
    const min = options.min || 1900
    const max = options.max || now.getFullYear()
    const loop = !!options.loop
    const unit = options.unit || ''
    let init = options.init || now.getFullYear()

    if (max < min)
      throw new Error(
        'YearSource: options.max must be greated than options.min'
      )
    if (init > max) {
      init = max
    } else if (init < min) {
      init = min
    }

    return { max, min, init, loop, unit }
  }
}

class MonthSource extends BaseSource {
  constructor(options: Partial<BaseOptions> & { year: number }) {
    super(options)
  }

  validateOptions(
    options: Partial<BaseOptions> & { year: number }
  ): BaseOptions & { year: number } {
    const now = new Date()
    const year = options.year
    const min = options.min || 0
    const max = options.max || 11
    const loop = !!options.loop
    const unit = options.unit || ''
    let init = options.init || now.getMonth()

    if (max < min)
      throw new Error(
        'MonthSource: options.max must be greated than options.min'
      )
    if (init > max) {
      init = max
    } else if (init < min) {
      init = min
    }

    return { max, min, init, loop, unit, year }
  }
}

class DaySource extends BaseSource {
  constructor(options: Partial<BaseOptions> = {}) {
    super(options)
  }

  validateOptions(options: Partial<BaseOptions>): BaseOptions {
    const now = new Date()
    const min = options.min || 1900
    const max = options.max || now.getFullYear()
    const loop = !!options.loop
    const unit = options.unit || ''
    let init = options.init || now.getFullYear()

    if (max < min)
      throw new Error(
        'YearSource: options.max must be greated than options.min'
      )
    if (init > max) {
      init = max
    } else if (init < min) {
      init = min
    }

    return { max, min, init, loop, unit }
  }
}

export class DatetimeDataSourceFactory
  implements DataSourceFactory<{ text: string }> {
  cascadable = true
  create(): DataSource<{ text: string }>[] {
    return []
  }
  change(): DataSource<{ text: string }>[] {
    return []
  }
}
