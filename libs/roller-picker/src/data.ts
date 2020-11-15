export interface ScrollerData {
  _text: string
  [prop: string]: unknown
}
export abstract class ScrollerDataFactory {
  createData(text: string): ScrollerData {
    return { _text: text }
  }

  abstract getInit(): ScrollerData | null

  abstract getPrev(param: ScrollerData | null): ScrollerData | null

  abstract getNext(param: ScrollerData | null): ScrollerData | null
}

export abstract class PickerDataFactory {
  private _factories: ScrollerDataFactory[] = []

  getFactories(): ScrollerDataFactory[] {
    return this._factories
  }

  change(values: unknown[]): ScrollerDataFactory[] | void {}
}
