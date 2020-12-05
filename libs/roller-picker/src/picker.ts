import { DataSourceFactory, Nullable, DataSource } from './factory/data'
import Scroller from './scroller'
import { Emitter, getEle, createEle } from './utils'
import styles from './index.less'

interface PickerOpts<T> {
  radius?: number
  maxAngle?: number
  scaleRatio?: number
  intervalAngle?: number
  dataSourceFactory: DataSourceFactory<T>
}

class Picker<T> extends Emitter {
  private _scrollers: Scroller<T>[] = []
  private _values: T[] = []
  private _tempValues: T[] = []
  private _dataSourceFactory: DataSourceFactory<T>
  private _cacheDataSources: Nullable<DataSource<T>[]> = null // 缓存新创建的 data source

  $root: HTMLElement

  constructor(options: PickerOpts<T>) {
    super()
    if (!options.dataSourceFactory) {
      throw new Error('Picker: please assign the options.dataSourceFactory')
    } else {
      this._dataSourceFactory = options.dataSourceFactory
    }

    this.$root = createEle('div', styles.picker)
    this.render(options)
  }

  private render(options: PickerOpts<T>): void {
    const $root = this.$root
    const { dataSourceFactory, ...scrollerOpts } = options

    const html = `
<div class="${styles['picker-content']}">
  <div class="${styles['picker-head']}" ref="picker-head">
    <button type="button" ref="picker-cancel">取消</button>
    <button type="button" ref="picker-ensure">完成</button>
  </div>
  <div class="${styles['picker-body']}" ref="picker-body"></div>
  <div class="${styles['picker-foot']} ${styles.hidden}" ref="foot"></div>
</div>
    `

    $root.innerHTML = html
    const $body = getEle(`[ref="picker-body"]`, $root) as HTMLElement
    const $cancel = getEle(`[ref="picker-cancel"]`, $root) as HTMLElement
    const $ensure = getEle(`[ref="picker-ensure"]`, $root) as HTMLElement
    const dataSources = dataSourceFactory.create()

    // 初始化所有的 scroller
    dataSources.forEach(dataSource => {
      const scroller = new Scroller({
        el: $body,
        dataSource,
        ...scrollerOpts
      })
      const data = scroller.getValue()

      this._scrollers.push(scroller)
      this._values.push(data)
      this._tempValues.push(data)
    })

    if (dataSourceFactory.cascadable) {
      // 需要联动更新
      this._scrollers.forEach((scroller, index) => {
        scroller.on('change', (data: T) => {
          this._changedCascade(data, index)
        })
      })
    } else {
      // 独立更新
      this._scrollers.forEach((scroller, index) => {
        scroller.on('change', (data: T) => {
          this._changedIndependently(data, index)
        })
      })
    }

    $cancel.addEventListener('click', () => {
      this._tempValues = [...this._values]
      this._resetDataSources()
      this.hide()
      this.emit('cancel')
    })
    $ensure.addEventListener('click', () => {
      this._values = [...this._tempValues]
      this.hide()
      this.emit('ensure', this.getValues())
    })
    document.body.appendChild($root)
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
    this._tempValues[index] = data

    if (index === this._scrollers.length - 1) {
      // 最后一个 scroller 变化，不进行联动更新
      this._cacheDataSources = null
      return
    }
    if (!this._cacheDataSources) {
      this._cacheDataSources = this._dataSourceFactory.change(
        this._tempValues.slice(0),
        index
      )
    }
    // 联动更新下一个 dataSource
    const nextIndex = index + 1
    const nextDataSource = this._cacheDataSources[nextIndex]
    const nextScroller = this._scrollers[nextIndex]
    nextScroller.changeDataSource(nextDataSource)
  }

  show(): void {
    this.$root.classList.add(styles['picker-in'])
  }

  hide(): void {
    this.$root.classList.remove(styles['picker-in'])
  }

  getValues(): T[] {
    return [...this._values]
  }

  setValues(val: T[]): void {
    this._values = [...val]
    this._tempValues = [...val]
    this._resetDataSources()
  }

  get scrollers(): Scroller<T>[] {
    return this._scrollers
  }
}

export default Picker
