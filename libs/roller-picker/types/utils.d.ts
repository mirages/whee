export declare function angleToRadian(angle: number): number
export declare function radianToAngle(radian: number): number
export declare function distanceToAngle(
  distance: number,
  radius: number
): number
export declare function getEle(
  el: string | HTMLElement,
  ancestorEle?: HTMLElement | Document
): HTMLElement | null
export declare function createEle(tag: string, cls?: string): HTMLElement
export declare class Emitter {
  private _events
  on(event: string, handler: (...rest: any[]) => void): void
  emit(event: string, ...rest: any[]): void
}
