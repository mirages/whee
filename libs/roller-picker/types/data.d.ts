export interface ScrollerData {
    _text: string;
    [prop: string]: unknown;
}
export declare abstract class ScrollerDataFactory {
    createData(text: string): ScrollerData;
    abstract getInit(): ScrollerData | null;
    abstract getPrev(param: ScrollerData | null): ScrollerData | null;
    abstract getNext(param: ScrollerData | null): ScrollerData | null;
}
export declare abstract class PickerDataFactory {
    private _factories;
    getFactories(): ScrollerDataFactory[];
    abstract change(values: unknown[]): ScrollerDataFactory[] | void;
}
