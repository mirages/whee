import { PickerDataFactory } from './data';
import { Emitter } from './utils';
interface PickerOpts {
    radius?: number;
    scaleRatio?: number;
    intervalAngle?: number;
    pickerDataFactory: PickerDataFactory;
}
declare class Picker extends Emitter {
    private _scrollers;
    private _values;
    private _tempValues;
    private $wrapper;
    constructor(options: PickerOpts);
    show(): void;
    hide(): void;
    getValue(): unknown[];
    setValue(val: unknown[]): void;
    render(options: PickerOpts): void;
}
export default Picker;
