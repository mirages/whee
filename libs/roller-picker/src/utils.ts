export function angleToRadian(angle: number): number {
  return (angle * Math.PI) / 180
}

export function radianToAngle(radian: number): number {
  return (radian * 180) / Math.PI
}

export function distanceToAngle(distance: number, radius: number): number {
  return radianToAngle(distance / radius)
}

export function getEle(
  el: string | HTMLElement,
  ancestorEle: HTMLElement | Document = document
): HTMLElement | null {
  return typeof el === 'string' ? ancestorEle.querySelector(el) : el
}

export function createEle(tag: string, cls?: string): HTMLElement {
  const el = document.createElement(tag)

  if (cls) el.className = cls
  return el
}

export class Emitter {
  private _events: {
    // eslint-disable-next-line
    [prop: string]: ((...rest: any[]) => void)[]
  } = {}

  // eslint-disable-next-line
  on(event: string, handler: (...rest: any[]) => void): void {
    if (this._events[event]) {
      this._events[event].push(handler)
    } else {
      this._events[event] = [handler]
    }
  }

  // eslint-disable-next-line
  emit(event: string, ...rest: any[]): void {
    const handlers = this._events[event]
    if (!handlers) return
    handlers.forEach(handler => {
      handler(...rest)
    })
  }
}
