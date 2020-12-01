import Motion from 'js-motion'
import { DataSource, NullableData } from './factory/data'
import {
  angleToRadian,
  getEle,
  createEle,
  distanceToAngle,
  Emitter
} from './utils'
import styles from './index.less'

interface VItem<T> {
  wrapper: HTMLElement
  el: HTMLElement
  data: NullableData<T>
  angle: number
}

export default class Scroller<T> extends Emitter {
  radius = 200
  perspective = 0
  intervalAngle = 10
  scaleRatio = 0.1
  styles: { item: string } = { item: '' }
  maxAngle = 50

  private _maxDiffAngle = this._getMaxDiffAngle()
  private _dataChangeAngle: number
  private _dataSource: DataSource<T>
  private _items: VItem<T>[] = []
  private _currItem!: VItem<T>
  private _shouldEnd = false
  private _rafId = 0

  constructor(options: {
    el: HTMLElement | string
    dataSource: DataSource<T>
    radius?: number
    scaleRatio?: number
    intervalAngle?: number
    maxAngle?: number
    styles?: { item: string }
  }) {
    super()
    const {
      el,
      styles,
      dataSource,
      radius,
      intervalAngle,
      maxAngle,
      scaleRatio
    } = options

    const $root = getEle(el)

    if (!$root) {
      throw new Error("Scroller: can't find element by options.el")
    }

    this._dataSource = dataSource

    if (radius) {
      this.radius = radius
      this.perspective = radius
    }
    if (intervalAngle) this.intervalAngle = intervalAngle
    if (maxAngle && maxAngle > 0 && maxAngle <= 90) this.maxAngle = maxAngle
    if (scaleRatio) this.scaleRatio = scaleRatio
    if (styles) this.styles = styles
    this._maxDiffAngle = this._getMaxDiffAngle()
    this._dataChangeAngle = this.intervalAngle * 0.7

    // 初始化
    this._init()

    // 挂载元素
    this._mount($root)
  }

  private _getMaxDiffAngle(): number {
    return (
      Math.floor((this.maxAngle - 0.0001) / this.intervalAngle) *
      this.intervalAngle *
      2
    )
  }

  private _init() {
    const dataSource = this._dataSource
    const currItem = this._createItem(dataSource.getInit(), 0)

    let prevData = currItem.data
    let nextData = currItem.data
    let angle = this.intervalAngle

    this._currItem = currItem
    this._items = [currItem]

    while (angle < this.maxAngle) {
      prevData = dataSource.getPrev(prevData)
      nextData = dataSource.getNext(nextData)

      // 向前添加一个元素
      this._items.unshift(this._createItem(prevData, angle))
      // 向后添加一个元素
      this._items.push(this._createItem(nextData, -angle))

      angle += this.intervalAngle // 角度递增
    }
  }

  private _mount($root: HTMLElement) {
    const $wrapper = createEle('div', styles['scroller'])
    const motion = new Motion({
      target: $wrapper,
      direction: Motion.Direction.y
    })

    motion.onTouchmove(({ y }) => {
      this.scroll(y)
    })
    motion.onTouchend(({ y }) => {
      if (this._shouldEnd) {
        // 已到达边界点
        this.scrollEnd()
        motion.clearInertiaScroll()
      } else if (y !== 0) {
        // 正常滚动
        this.scroll(y)
      } else {
        // 滚动结束
        this.scrollEnd()
      }
    })

    // 挂载元素
    this._items.forEach(item => {
      this._renderItem(item)
      $wrapper.appendChild(item.wrapper)
    })

    $root.appendChild($wrapper)
  }

  private _createItem(data: NullableData<T>, angle: number): VItem<T> {
    const wrapper = createEle('div', styles['scroller-item'])
    const el = createEle('div', this.styles.item)

    wrapper.appendChild(el)

    return { wrapper, el, data, angle }
  }

  private _scrollAngleDetection(angle: number) {
    const currData = this._currItem.data
    const boundary =
      (angle > 0 && this._dataSource.getPrev(currData) === null) ||
      (angle < 0 && this._dataSource.getNext(currData) === null)

    if (boundary) {
      const intervalAngle = this.intervalAngle
      const currAngleAbs = Math.abs(this._currItem.angle)
      const sign = angle > 0 ? 1 : -1
      const easeAngle =
        Math.pow((intervalAngle - currAngleAbs) / intervalAngle, 3) * 1

      if (
        currAngleAbs > this._dataChangeAngle ||
        currAngleAbs + easeAngle > this._dataChangeAngle
      ) {
        // 滚动到临界点角度
        this._shouldEnd = true
        angle = 0
      } else {
        angle = sign * easeAngle
      }
    }

    return angle
  }

  private _scrollEndAngleDetection() {
    const intervalAngle = this.intervalAngle
    const currAngle = this._currItem.angle
    const currData = this._currItem.data
    const boundary =
      (currAngle < 0 && this._dataSource.getPrev(currData) === null) ||
      (currAngle > 0 && this._dataSource.getNext(currData) === null)
    let angle = 0

    if (Math.abs(currAngle) < intervalAngle / 2 || boundary) {
      // 转动角度较小，或遇到上下边界，回弹
      angle = currAngle
    } else {
      // 其他情况，过弹
      angle =
        currAngle > 0 ? currAngle - intervalAngle : currAngle + intervalAngle
    }

    return angle
  }

  private _angleDivision(angle: number): number[] {
    const breakpoint = this.intervalAngle * 0.4
    const arr = []
    let n = 1

    if (Math.abs(angle) > breakpoint) {
      // 一次转动的角度过大，分几次滚动
      n = Math.ceil(Math.abs(angle) / breakpoint)
      angle = angle / n
    }

    while (n--) {
      arr.push(angle)
    }

    return arr
  }

  private _update(angle: number) {
    const items = this._items
    const len = items.length

    // 更细每个元素的 y 值和 angle 值
    items.forEach(item => {
      const prevAngle = item.angle
      const currAngle = prevAngle - angle // 在原有基础上减去滚动角度，才是顺势变化

      item.angle = currAngle
    })

    const firstItem = items[0]
    const lastItem = items[len - 1]

    // 更新数组顺序（同时也是更新元素的 data 值）
    if (angle < 0 && firstItem.angle > this.maxAngle) {
      // 第一个元素转动的角度超过 this.maxAngle，将其放到最后一个（循环利用）
      firstItem.angle = items[1].angle - this._maxDiffAngle
      firstItem.data = this._dataSource.getNext(lastItem.data)
      items.push(firstItem)
      items.shift()
    } else if (angle > 0 && lastItem.angle < -this.maxAngle) {
      // 最后一个元素转动的角度超过 -this.maxAngle，将其放到第一个（循环利用）
      lastItem.angle = items[len - 2].angle + this._maxDiffAngle
      lastItem.data = this._dataSource.getPrev(firstItem.data)
      items.unshift(lastItem)
      items.pop()
    }

    // 更新当前选中的值
    if (Math.abs(this._currItem.angle) > this._dataChangeAngle) {
      this._currItem = items[(len - 1) / 2]
      // 触发 change 回调
      this._emitChange()
    }

    // 渲染元素
    this._render()
  }

  private _emitChange() {
    const data = this.getValue()
    this.emit('change', data)
  }

  private _render() {
    this._items.forEach(item => this._renderItem(item))
  }

  private _renderItem(item: VItem<T>) {
    const scaleRatio = this.scaleRatio
    const perspective = this.perspective
    const angle = item.angle
    const data = item.data
    const radian = angleToRadian(angle)
    const y = -(this.radius * Math.sin(radian)).toFixed(0)
    const scale = Math.abs(Math.cos((1 - Math.pow(scaleRatio, 3)) * radian))
    const text = this._dataSource.getText(data)
    const cssText = `;
      transform: translateY(${y}px) perspective(${perspective}px) rotateX(${angle.toFixed(
      4
    )}deg) scale(${scale.toFixed(4)});`

    item.wrapper.style.cssText = cssText
    item.el.textContent = text
    item.el.title = text

    return item
  }

  /**
   * 根据 y 轴垂直位移进行滚动
   * distance < 0 向上滚动
   * distance > 0 向下滚动
   * @param {number} distance - y 轴垂直移动距离
   */
  scroll(distance: number): void {
    if (!Number(distance)) return // 角度没有变化
    const angle = distanceToAngle(distance, this.radius) // 距离转换成角度
    const angles = this._angleDivision(angle) // 角度分割

    cancelAnimationFrame(this._rafId)
    angles.forEach(angle => {
      const scrollAngle = this._scrollAngleDetection(angle)

      if (!scrollAngle) return
      // 更新转动角度
      this._update(scrollAngle)
    })
  }

  scrollEnd(): void {
    const scrollAngle = this._scrollEndAngleDetection()

    this._shouldEnd = false

    if (!scrollAngle) return

    const count = Math.ceil((70 * Math.abs(scrollAngle)) / this.intervalAngle)
    let prevAngle = 0
    let index = 0

    const step = () => {
      const currAngle =
        (-scrollAngle / Math.pow(count, 2)) * Math.pow(++index - count, 2) +
        scrollAngle

      this._update(currAngle - prevAngle)
      prevAngle = currAngle

      if (index < count) {
        this._rafId = window.requestAnimationFrame(step)
      }
    }

    step()
  }

  getValue(): NullableData<T> {
    let data: NullableData<T> = null

    if (this._currItem.data) {
      data = { ...this._currItem.data }
    }

    return data
  }

  get items(): VItem<T>[] {
    return this._items
  }

  changeDataSource(dataSource: DataSource<T>, emitChange = true): void {
    if (!dataSource) return

    const len = this._items.length
    const currData = dataSource.getInit()
    let index = (len - 1) / 2
    let prev = currData
    let next = currData

    this._dataSource = dataSource
    this._items[index].data = currData

    while (++index < len) {
      prev = this._dataSource.getPrev(prev)
      next = this._dataSource.getNext(next)

      this._items[len - 1 - index].data = prev
      this._items[index].data = next
    }

    this._render()
    if (emitChange) {
      this._emitChange()
    }
  }
}
