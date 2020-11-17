import { DataFactories, BaseData, DataFactory } from './data'
import Scroller from './scoller'
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
  private _values: (T | null)[] = []
  private _tempValues: (T | null)[] = []
  private $wrapper: HTMLElement

  constructor(options: PickerOpts<T>) {
    super()
    if (!options.dataFactories) {
      throw new Error('Picker: please assign the options.dataFactories')
    }

    this.$wrapper = createEle('div', styles.picker)
    this.render(options)
  }

  private render(options: PickerOpts<T>): void {
    const $wrapper = this.$wrapper
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

    $wrapper.innerHTML = html
    const $body = getEle(`[ref="picker-body"]`, $wrapper) as HTMLElement
    const $cancel = getEle(`[ref="picker-cancel"]`, $wrapper) as HTMLElement
    const $ensure = getEle(`[ref="picker-ensure"]`, $wrapper) as HTMLElement
    const factories = dataFactories.create()

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

    // 进行联动操作
    this._scrollers.forEach((scroller, index) => {
      scroller.on('change', (data: T) => {
        this._tempValues[index] = data

        const nextIndex = index + 1
        const nextScroller = this._scrollers[nextIndex]
        if (!nextScroller) return

        const nextDataFactory = (dataFactories.change(
          this._tempValues.slice(0, nextIndex)
        ) || [])[nextIndex]
        if (!nextDataFactory) return

        nextScroller.changeDataFactory(nextDataFactory)
      })
    })

    $cancel.addEventListener('click', () => {
      this._tempValues = [...this._values]
      this.hide()
      this.emit('cancel')
      const factories = dataFactories.change(this._values)
      this._scrollers[0].changeDataFactory(factories[0])
    })
    $ensure.addEventListener('click', () => {
      this._values = [...this._tempValues]
      this.hide()
      this.emit('ensure')
    })
    document.body.appendChild($wrapper)
  }

  show(): void {
    this.$wrapper.classList.add(styles['picker-in'])
  }
  hide(): void {
    this.$wrapper.classList.remove(styles['picker-in'])
  }
  getValue(): (T | null)[] {
    return [...this._values]
  }
  setValue(val: T[]): void {
    this._values = [...val]
  }
}

export default Picker
