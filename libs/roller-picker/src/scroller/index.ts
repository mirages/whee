import Motion from 'js-motion'
import { DataSource, Nullable } from '../factory/data'
import {
  angleToRadian,
  getEle,
  createEle,
  distanceToAngle,
  Emitter
} from '../utils'
import styles from './index.less'

interface VItem<T> {
  wrapper: HTMLElement
  el: HTMLElement
  data: Nullable<T>
  angle: number
  prev: Nullable<VItem<T>>
  next: Nullable<VItem<T>>
}

export default class Scroller<T> extends Emitter {
  radius = 200
  perspective = 0
  intervalAngle = 10
  scaleRatio = 0.1
  styles: {
    item: string
    scroller: string
  } = {
    item: '',
    scroller: ''
  }
  maxAngle = 50

  private _maxDiffAngle = this._getMaxDiffAngle()
  private _dataChangeAngle: number
  private _dataSource: DataSource<T>
  private _firstItem!: VItem<T>
  private _lastItem!: VItem<T>
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
    styles?: { item: string; scroller: string }
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

    let prevItem = currItem
    let nextItem = currItem
    let angle = this.intervalAngle

    this._currItem = currItem
    this._firstItem = currItem

    while (angle < this.maxAngle) {
      const _prevItem = this._createItem(
        dataSource.getPrev(prevItem.data),
        angle
      )
      const _nextItem = this._createItem(
        dataSource.getNext(nextItem.data),
        -angle
      )

      prevItem.prev = _prevItem
      nextItem.next = _nextItem
      _prevItem.next = prevItem
      _nextItem.prev = nextItem

      // 链表向前添加一个元素
      prevItem = _prevItem
      // 链表向后添加一个元素
      nextItem = _nextItem

      this._firstItem = prevItem
      this._lastItem = nextItem

      angle += this.intervalAngle // 角度递增
    }
  }

  private _mount($root: HTMLElement) {
    const $wrapper = createEle(
      'div',
      `${styles.scroller} ${this.styles.scroller || ''}`
    )
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
    this._iterateItems(item => {
      this._renderItem(item)
      $wrapper.appendChild(item.wrapper)
    })

    $root.appendChild($wrapper)
  }

  private _createItem(data: Nullable<T>, angle: number): VItem<T> {
    const wrapper = createEle('div', styles['scroller-item'])
    const el = createEle('div', this.styles.item)

    wrapper.appendChild(el)

    return { wrapper, el, data, angle, prev: null, next: null }
  }

  private _iterateItems(cb: (item: VItem<T>) => void) {
    let item: Nullable<VItem<T>> = this._firstItem
    while (item) {
      cb(item)
      item = item.next
    }
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
      const easeAngle = (intervalAngle - currAngleAbs) / intervalAngle

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
    this._iterateItems(item => {
      item.angle -= angle
    })

    const firstItem = this._firstItem
    const lastItem = this._lastItem
    // 更新数组顺序（同时也是更新元素的 data 值）
    if (angle < 0 && firstItem.angle > this.maxAngle) {
      // 第一个元素转动的角度超过 this.maxAngle，将其放到最后一个
      const secItem = firstItem.next!
      firstItem.angle = secItem.angle - this._maxDiffAngle
      firstItem.data = this._dataSource.getNext(lastItem.data)
      // 断开旧连接
      secItem.prev = null
      firstItem.next = null
      // 建立新连接
      firstItem.prev = lastItem
      lastItem.next = firstItem
      // 更新指针
      this._firstItem = secItem
      this._lastItem = firstItem
    } else if (angle > 0 && lastItem.angle < -this.maxAngle) {
      // 最后一个元素转动的角度超过 -this.maxAngle，将其放到第一个
      const secToLast = lastItem.prev!
      lastItem.angle = secToLast.angle + this._maxDiffAngle
      lastItem.data = this._dataSource.getPrev(firstItem.data)
      // 断开旧连接
      secToLast.next = null
      lastItem.prev = null
      // 建立新连接
      lastItem.next = firstItem
      firstItem.prev = lastItem
      // 更新指针
      this._firstItem = lastItem
      this._lastItem = secToLast
    }

    // 更新当前选中的值
    const currItem = this._currItem
    if (Math.abs(currItem.angle) > this._dataChangeAngle) {
      this._currItem = currItem.angle > 0 ? currItem.next! : currItem.prev!
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
    this._iterateItems(item => {
      this._renderItem(item)
    })
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

    const count = Math.ceil((50 * Math.abs(scrollAngle)) / this.intervalAngle)
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

  getValue(): T {
    return this._currItem.data!
  }

  get firstItem(): VItem<T> {
    return this._firstItem
  }

  get lastItem(): VItem<T> {
    return this._lastItem
  }

  changeDataSource(dataSource: DataSource<T>, emitChange = true): void {
    if (!dataSource) return

    const currData = dataSource.getInit()

    this._dataSource = dataSource
    this._currItem.data = currData

    let prevItem: Nullable<VItem<T>> = this._currItem.prev
    let nextItem: Nullable<VItem<T>> = this._currItem.next
    while (prevItem) {
      prevItem.data = this._dataSource.getPrev(prevItem.next!.data)
      prevItem = prevItem.prev
    }
    while (nextItem) {
      nextItem.data = this._dataSource.getNext(nextItem.prev!.data)
      nextItem = nextItem.next
    }

    this._render()
    if (emitChange) {
      this._emitChange()
    }
  }
}
