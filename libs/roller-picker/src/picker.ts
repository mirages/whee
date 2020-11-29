import { DataFactories, BaseData, NullableData, DataFactory } from './data'
import Scroller from './scroller'
import { Emitter, getEle, createEle } from './utils'
import styles from './index.less'

interface PickerOpts<T extends BaseData> {
  radius?: number
  scaleRatio?: number
  intervalAngle?: number
  dataFactories: DataFactories<T>
}

class Picker<T extends BaseData> extends Emitter {
  private _scrollers: Scroller<T>[] = []
  private _values: NullableData<T>[] = []
  private _tempValues: NullableData<T>[] = []
  private _dataFactories: DataFactories<T>
  private _cacheFactories: NullableData<DataFactory<T>[]> = null // 缓存新创建的 dataFactories

  $root: HTMLElement

  constructor(options: PickerOpts<T>) {
    super()
    if (!options.dataFactories) {
      throw new Error('Picker: please assign the options.dataFactories')
    } else {
      this._dataFactories = options.dataFactories
    }

    this.$root = createEle('div', styles.picker)
    this.render(options)
  }

  private render(options: PickerOpts<T>): void {
    const $root = this.$root
    const {
      radius = 170,
      scaleRatio,
      intervalAngle = 12,
      dataFactories
    } = options

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
    const factories = dataFactories.create()
    const length = factories.length

    // 初始化所有的 scroller
    factories.forEach(dataFactory => {
      const scroller = new Scroller({
        el: $body,
        dataFactory,
        radius,
        scaleRatio,
        intervalAngle
      })
      const data = scroller.getValue()

      this._scrollers.push(scroller)
      this._values.push(data)
      this._tempValues.push(data)
    })

    // 联动更新操作
    this._scrollers.forEach((scroller, index) => {
      scroller.on('change', (data: T) => {
        this._tempValues[index] = data

        if (index === length - 1) {
          // 最后一个 scroller 变化，不进行联动更新
          this._cacheFactories = null
          return
        }
        if (!this._cacheFactories) {
          this._cacheFactories = dataFactories.create(this._tempValues.slice(0))
        }
        // 联动更新下一个 dataFactory
        const nextIndex = index + 1
        const nextDataFactory = this._cacheFactories[nextIndex]
        const nextScroller = this._scrollers[nextIndex]
        nextScroller.changeDataFactory(nextDataFactory)
      })
    })

    $cancel.addEventListener('click', () => {
      this._tempValues = [...this._values]
      this._resetDataFactories()
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

  private _resetDataFactories(): void {
    const factories = this._dataFactories.create(this._values)
    this._cacheFactories = factories
    this._scrollers[0].changeDataFactory(factories[0])
  }

  show(): void {
    this.$root.classList.add(styles['picker-in'])
  }

  hide(): void {
    this.$root.classList.remove(styles['picker-in'])
  }

  getValues(): NullableData<T>[] {
    return [...this._values]
  }

  setValues(val: T[]): void {
    this._values = [...val]
    this._tempValues = [...val]
    this._resetDataFactories()
  }

  get scrollers(): Scroller<T>[] {
    return this._scrollers
  }
}

export default Picker
