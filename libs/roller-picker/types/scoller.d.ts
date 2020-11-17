import { DataFactory, BaseData, NullableData } from './data'
import { Emitter } from './utils'
export default class Scroller<T extends BaseData> extends Emitter {
  radius: number
  perspective: number
  intervalAngle: number
  scaleRatio: number
  dataFactory: DataFactory<T>
  styles: {
    item: string
  }
  shouldEnd: boolean
  endEasing: boolean
  private _items
  private _currItem
  constructor(options: {
    el: HTMLElement | string
    dataFactory: DataFactory<T>
    radius?: number
    scaleRatio?: number
    intervalAngle?: number
    styles?: {
      item: string
    }
  })
  private _init
  private _mount
  private _createItem
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
  getValue(): NullableData<T>
  changeDataFactory(dataFactory: DataFactory<T>): void
}
