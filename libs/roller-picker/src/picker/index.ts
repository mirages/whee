import { DataSourceFactory, Nullable, DataSource } from '../factory/data'
import Scroller from '../scroller'
import { Emitter, getEle, createEle } from '../utils'
import styles from './index.less'

interface PickerOpts<T> {
  el: HTMLElement | string
  radius?: number
  maxAngle?: number
  scaleRatio?: number
  intervalAngle?: number
  dataSourceFactory: DataSourceFactory<T>
  title?: string
  pickedEvent?: 'change' | 'scrollEnd'
  styles?: {
    picker?: string
    head?: string
    body?: string
    foot?: string
    title?: string
    ensure?: string
    cancel?: string
    scroller?: string
    item?: string
    mask?: string
  }
}

class Picker<T> extends Emitter {
  private _scrollers: Scroller<T>[] = []
  private _values: T[] = []
  private _tempValues: T[] = []
  private _dataSourceFactory: DataSourceFactory<T>
  private _cacheDataSources: Nullable<DataSource<T>[]> = null // 缓存新创建的 data source

  $root!: HTMLElement

  constructor(options: PickerOpts<T>) {
    super()
    if (!options.dataSourceFactory) {
      throw new Error('Picker: please set the options.dataSourceFactory')
    } else {
      this._dataSourceFactory = options.dataSourceFactory
    }

    this.render(options)
  }

  private render(options: PickerOpts<T>): void {
    const {
      dataSourceFactory,
      el,
      title = '',
      pickedEvent = 'scrollEnd',
      styles: _styles = {},
      ...scrollerOpts
    } = options
    const $wrapper = getEle(el)
    const $root = createEle('div', `${styles.picker} ${_styles.picker}`)

    if (!$wrapper) {
      throw new Error('Picker: please set the options.el')
    }

    this.$root = $root

    $root.innerHTML = `
<div class="${styles['picker-head']} ${_styles.head || ''}" ref="picker-head">
  <button type="button" class="${styles['picker-cancel']} ${
      _styles.cancel || ''
    }" ref="picker-cancel">取消</button>
  <div class="${styles['picker-title']} ${_styles.title || ''}">${title}</div>
  <button type="button" class="${styles['picker-ensure']} ${
      _styles.ensure || ''
    }" ref="picker-ensure">完成</button>
</div>
<div class="${styles['picker-body']} ${
      _styles.body || ''
    }" ref="picker-body"></div>
<div class="${_styles.foot || ''}" ref="foot"></div>
    `

    const $body = getEle(`[ref="picker-body"]`, $root) as HTMLElement
    const $cancel = getEle(`[ref="picker-cancel"]`, $root) as HTMLElement
    const $ensure = getEle(`[ref="picker-ensure"]`, $root) as HTMLElement
    const dataSources = dataSourceFactory.create()

    // 初始化所有的 scroller
    dataSources.forEach(dataSource => {
      const scroller = new Scroller({
        el: $body,
        dataSource,
        ...scrollerOpts,
        styles: {
          item: _styles.item || '',
          mask: _styles.mask || '',
          scroller: _styles.scroller || ''
        }
      })
      const data = scroller.getValue()

      this._scrollers.push(scroller)
      this._values.push(data)
      this._tempValues.push(data)
    })

    if (dataSourceFactory.cascadable) {
      // 需要联动更新
      this._scrollers.forEach((scroller, index) => {
        scroller.on(pickedEvent, (data: T) => {
          this._changedCascade(data, index)
        })
      })
    } else {
      // 独立更新
      this._scrollers.forEach((scroller, index) => {
        scroller.on(pickedEvent, (data: T) => {
          this._changedIndependently(data, index)
        })
      })
    }

    $cancel.addEventListener('click', () => {
      this._tempValues = this._values.slice(0)
      this._resetDataSources()
      this.emit('cancel')
    })
    $ensure.addEventListener('click', () => {
      this._values = this._tempValues.slice(0)
      this.emit('ensure', this.getValues())
    })
    $wrapper.appendChild($root)
  }

  private _resetDataSources(): void {
    const dataSources = this._dataSourceFactory.change(this._values, -1)

    this._scrollers.forEach((scroller, index) => {
      scroller.changeDataSource(dataSources[index], false)
      this._tempValues[index] = scroller.getValue()
    })
  }

  private _changedIndependently(data: T, index: number): void {
    this._tempValues[index] = data
  }

  private _changedCascade(data: T, index: number): void {
    const length = this._scrollers.length
    this._tempValues[index] = data

    const facorys = this._dataSourceFactory.change(
      this._tempValues.slice(0),
      index
    )

    // change scroller dataFactory downward
    while (++index < length) {
      this._scrollers[index].changeDataSource(facorys[index], false)
      this._tempValues[index] = this._scrollers[index].getValue()
    }
  }

  getValues(): T[] {
    return this._values.slice(0)
  }

  setValues(val: T[]): void {
    this._values = val.slice(0)
    this._tempValues = val.slice(0)
    this._resetDataSources()
  }

  get scrollers(): Scroller<T>[] {
    return this._scrollers
  }
}

export default Picker
