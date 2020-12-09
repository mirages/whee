import { DataSourceFactory } from '../factory/data'
import Scroller from '../scroller'
import { Emitter } from '../utils'
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
declare class Picker<T> extends Emitter {
  private _scrollers
  private _values
  private _tempValues
  private _dataSourceFactory
  private _cacheDataSources
  $root: HTMLElement
  constructor(options: PickerOpts<T>)
  private render
  private _resetDataSources
  private _changedIndependently
  private _changedCascade
  getValues(): T[]
  setValues(val: T[]): void
  get scrollers(): Scroller<T>[]
}
export default Picker
