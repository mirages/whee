import { DataSourceFactory, NullableData } from './factory/data'
import Scroller from './scroller'
import { Emitter } from './utils'
interface PickerOpts<T> {
  radius?: number
  maxAngle?: number
  scaleRatio?: number
  intervalAngle?: number
  dataSourceFactory: DataSourceFactory<T>
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
  show(): void
  hide(): void
  getValues(): NullableData<T>[]
  setValues(val: T[]): void
  get scrollers(): Scroller<T>[]
}
export default Picker
