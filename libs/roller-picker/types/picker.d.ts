import { DataFactories, NullableData } from './factories/data'
import Scroller from './scroller'
import { Emitter } from './utils'
interface PickerOpts<T> {
  radius?: number
  scaleRatio?: number
  intervalAngle?: number
  dataFactories: DataFactories<T>
}
declare class Picker<T> extends Emitter {
  private _scrollers
  private _values
  private _tempValues
  private _dataFactories
  private _cacheFactories
  $root: HTMLElement
  constructor(options: PickerOpts<T>)
  private render
  private _resetDataFactories
  show(): void
  hide(): void
  getValues(): NullableData<T>[]
  setValues(val: T[]): void
  get scrollers(): Scroller<T>[]
}
export default Picker
