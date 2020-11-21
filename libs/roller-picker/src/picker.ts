import { DataFactories, BaseData, NullableData } from './data'
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
  private $root: HTMLElement

  constructor(options: PickerOpts<T>) {
    super()
    if (!options.dataFactories) {
      throw new Error('Picker: please assign the options.dataFactories')
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

        const nextDataFactory = (dataFactories.create(
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
      const factories = dataFactories.create(this._values)
      this._scrollers[0].changeDataFactory(factories[0])
    })
    $ensure.addEventListener('click', () => {
      this._values = [...this._tempValues]
      this.hide()
      this.emit('ensure')
    })
    document.body.appendChild($root)
  }

  show(): void {
    this.$root.classList.add(styles['picker-in'])
  }

  hide(): void {
    this.$root.classList.remove(styles['picker-in'])
  }

  getValue(): NullableData<T>[] {
    return [...this._values]
  }

  setValue(val: T[]): void {
    this._values = [...val]
  }
}

export default Picker
