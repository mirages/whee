import { DataSource, Nullable } from '../factory/data'
import { Emitter } from '../utils'
interface VItem<T> {
  wrapper: HTMLElement
  el: HTMLElement
  data: Nullable<T>
  angle: number
  prev: Nullable<VItem<T>>
  next: Nullable<VItem<T>>
}
export default class Scroller<T> extends Emitter {
  radius: number
  perspective: number
  intervalAngle: number
  scaleRatio: number
  styles: {
    item: string
    scroller: string
  }
  maxAngle: number
  private _maxDiffAngle
  private _dataChangeAngle
  private _dataSource
  private _firstItem
  private _lastItem
  private _currItem
  private _shouldEnd
  private _rafId
  constructor(options: {
    el: HTMLElement | string
    dataSource: DataSource<T>
    radius?: number
    scaleRatio?: number
    intervalAngle?: number
    maxAngle?: number
    styles?: {
      item: string
      scroller: string
    }
  })
  private _getMaxDiffAngle
  private _init
  private _mount
  private _createItem
  private _iterateItems
  private _scrollAngleDetection
  private _scrollEndAngleDetection
  private _angleDivision
  private _update
  private _emitChange
  private _render
  private _renderItem
  /**
   * 根据 y 轴垂直位移进行滚动
   * distance < 0 向上滚动
   * distance > 0 向下滚动
   * @param {number} distance - y 轴垂直移动距离
   */
  scroll(distance: number): void
  scrollEnd(): void
  getValue(): T
  get firstItem(): VItem<T>
  get lastItem(): VItem<T>
  changeDataSource(dataSource: DataSource<T>, emitChange?: boolean): void
}
export {}
