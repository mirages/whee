import { DataFactories, BaseData, NullableData } from './data'
import { Emitter } from './utils'
interface PickerOpts<T extends BaseData> {
  radius?: number
  scaleRatio?: number
  intervalAngle?: number
  dataFactories: DataFactories<T>
}
declare class Picker<T extends BaseData> extends Emitter {
  private _scrollers
  private _values
  private _tempValues
  $root: HTMLElement
  constructor(options: PickerOpts<T>)
  private render
  show(): void
  hide(): void
  getValue(): NullableData<T>[]
  setValue(val: T[]): void
}
export default Picker
