import Motion from 'js-motion'
import { ScrollerDataFactory, ScrollerData } from './data'
import {
  angleToRadian,
  getEle,
  createEle,
  distanceToAngle,
  Emitter
} from './utils'
import styles from './index.less'

interface VItem {
  wrapper: HTMLElement
  el: HTMLElement
  data: ScrollerData | null
  angle: number
  y: number
}

export default class Scroller extends Emitter {
  radius = 300
  perspective = 0
  intervalAngle = 10
  scaleRatio = 0.1
  dataFactory: ScrollerDataFactory
  styles: { item: string } = { item: '' }
  shouldEnd = false
  endEasing = false

  private _items: VItem[] = []
  private _currItem: VItem

  constructor(options: {
    el: HTMLElement | string
    dataFactory: ScrollerDataFactory
    radius?: number
    scaleRatio?: number
    intervalAngle?: number
    styles?: { item: string }
  }) {
    super()
    const {
      el,
      styles,
      dataFactory,
      radius = 200,
      intervalAngle = 10,
      scaleRatio = 0.1
    } = options

    const $root = getEle(el)

    if (!$root) {
      throw new Error("Scroller: can't find element by options.el")
    }

    this.dataFactory = dataFactory
    this._currItem = this._createItem(dataFactory.getInit(), 0, 0)
    this._items = [this._currItem]

    if (radius) {
      this.radius = radius
      this.perspective = radius
    }
    if (intervalAngle) this.intervalAngle = intervalAngle
    if (scaleRatio) this.scaleRatio = scaleRatio
    if (styles) this.styles = styles

    // 初始化
    this._init()

    // 挂载元素
    this._mount($root)
  }

  private _init() {
    const items = this._items
    let prevData = this._currItem.data
    let nextData = prevData
    let angle = this.intervalAngle

    while (angle <= 90) {
      const radian = angleToRadian(angle) // 弧度
      const y = this.radius * Math.sin(radian)

      prevData = this.dataFactory.getPrev(prevData)
      nextData = this.dataFactory.getNext(nextData)

      // 向前添加一个元素
      items.unshift(this._createItem(prevData, -y, angle))
      // 向后添加一个元素
      items.push(this._createItem(nextData, y, -angle))

      angle += this.intervalAngle // 角度递增
    }

    // TODO 90 和 -90 重复，需要去重
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
      if (this.shouldEnd) {
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

  private _createItem(
    data: ScrollerData | null,
    y: number,
    angle: number
  ): VItem {
    const wrapper = createEle('div', styles['scroller-item'])
    const el = createEle('div', this.styles.item)

    wrapper.appendChild(el)

    return { wrapper, el, data, y, angle }
  }

  private _scrollAngleDetection(angle: number) {
    const currData = this._currItem.data
    const boundary =
      (angle > 0 && this.dataFactory.getPrev(currData) === null) ||
      (angle < 0 && this.dataFactory.getNext(currData) === null)

    if (boundary) {
      const intervalAngle = this.intervalAngle
      const currAngleAbs = Math.abs(this._currItem.angle)
      const sign = angle > 0 ? 1 : -1
      const easeAngle =
        Math.pow((intervalAngle - currAngleAbs) / intervalAngle, 3) * 1

      if (currAngleAbs > intervalAngle * 0.6) {
        // 滚动到临界点角度
        this.shouldEnd = true
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
      (currAngle < 0 && this.dataFactory.getPrev(currData) === null) ||
      (currAngle > 0 && this.dataFactory.getNext(currData) === null)
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
      const currRadian = angleToRadian(currAngle)
      const currY = -this.radius * Math.sin(currRadian)

      item.y = currY
      item.angle = currAngle
    })

    const firstItem = items[0]
    const lastItem = items[len - 1]

    // 更新数组顺序（同时也是更新元素的 data 值）
    if (firstItem.angle > 90) {
      // 第一个元素转动的角度超过 90 度，将其放到最后一个（循环利用）。注意实际的 dom 元素顺序并未改变
      firstItem.angle = firstItem.angle - 180
      firstItem.y = -firstItem.y
      firstItem.data = this.dataFactory.getNext(lastItem.data)
      items.push(firstItem)
      items.shift()
    } else if (lastItem.angle < -90) {
      // 最后一个元素转动的角度超过 -90 度，将其放到第一个（循环利用）。注意实际的 dom 元素顺序并未改变
      lastItem.angle = lastItem.angle + 180
      lastItem.y = -lastItem.y
      lastItem.data = this.dataFactory.getPrev(firstItem.data)
      items.unshift(lastItem)
      items.pop()
    }

    // 更新当前选中的值
    if (Math.abs(this._currItem.angle) > this.intervalAngle - 0.01) {
      this._currItem = items[(len - 1) / 2]
      // 触发 change 回调
      this._emitChange()
    }

    // 渲染元素
    this._render()
  }

  private _emitChange() {
    const data = this.getCurrentData()
    this.emit('change', data)
  }

  private _render() {
    this._items.forEach(item => this._renderItem(item))
  }

  private _renderItem(item: VItem) {
    const scaleRatio = this.scaleRatio
    const perspective = this.perspective
    const y = item.y.toFixed(4)
    const angle = item.angle.toFixed(4)
    const data = item.data
    const radian = angleToRadian(Number(angle))
    const scale = Math.abs(
      Math.cos((1 - Math.pow(scaleRatio, 3)) * radian)
    ).toFixed(4)
    const text = data === null ? '' : data._text
    let cssText = `;
      -webkit-transform: translateY(${y}px) perspective(${perspective}px) rotateX(${angle}deg) scale(${scale});
      -moz-transform: translateY(${y}px) perspective(${perspective}px) rotateX(${angle}deg) scale(${scale});
      transform: translateY(${y}px) perspective(${perspective}px) rotateX(${angle}deg) scale(${scale});`

    if (this.endEasing) {
      cssText += `transition: transform .25s ease-out 0s;`
    }
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

    this.endEasing = false
    angles.forEach(angle => {
      const scrollAngle = this._scrollAngleDetection(angle)

      // 更新转动角度
      this._update(scrollAngle)
    })
  }

  scrollEnd(): void {
    const scrollAngle = this._scrollEndAngleDetection()

    this.shouldEnd = false
    this.endEasing = true
    // 更新转动角度
    this._update(scrollAngle)
  }

  getCurrentData(): { [prop: string]: unknown } {
    // eslint-disable-next-line
    const { _text, ...data } = this._currItem.data || { _text: '' }

    return data
  }

  changeDataFactory(dataFactory: ScrollerDataFactory): void {
    if (!dataFactory) return

    const len = this._items.length
    let index = (len - 1) / 2
    let prev = dataFactory.getInit()
    let next = prev

    this.dataFactory = dataFactory
    this._items[index].data = prev
    this._currItem = this._items[index]
    index++

    while (index < len) {
      prev = this.dataFactory.getPrev(prev)
      next = this.dataFactory.getNext(next)

      this._items[len - 1 - index].data = prev
      this._items[index].data = next

      index++
    }

    this._emitChange()
    this._render()
  }
}
