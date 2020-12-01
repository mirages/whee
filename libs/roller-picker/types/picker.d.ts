import { DataSourceFactory, NullableData } from './factories/data'
import Scroller from './scroller'
import { Emitter } from './utils'
interface PickerOpts<T> {
  radius?: number
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
  show(): void
  hide(): void
  getValues(): NullableData<T>[]
  setValues(val: T[]): void
  get scrollers(): Scroller<T>[]
}
export default Picker
