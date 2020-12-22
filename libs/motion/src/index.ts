enum Mode {
  realtime = 'realtime',
  frame = 'frame'
}
enum Direction {
  x = 'x',
  y = 'y',
  xy = 'xy'
}
interface Options {
  target?: HTMLElement | string
  mode?: Mode
  direction?: Direction
}
interface MoveData {
  x: number
  y: number
  t: number
}
interface TransData extends MoveData {
  scale: number
  angle: number
}
interface TouchData extends MoveData {
  l: number
  a: number
}
type CbData = Pick<TransData, 'x' | 'y' | 'angle' | 'scale'>
interface StepCallback {
  (trans: CbData): void
}
interface TouchstartCallback {
  (e: TouchEvent): void
}
interface TouchmoveCallback {
  (s: CbData, e: TouchEvent): void
}
interface TouchendCallback {
  (s: CbData, e: TouchEvent): void
}

const noop = () => {
  // no operation
}

class Motion {
  static isSupportPassive: boolean = (() => {
    let supportsPassive = false

    try {
      document.createElement('div').addEventListener('testPassive', noop, {
        get passive() {
          supportsPassive = true
          return false
        }
      })
    } catch (e) {
      // Not support
    }

    return supportsPassive
  })()

  static Direction = Direction
  static Mode = Mode

  readonly el: HTMLElement | null
  readonly mode: Mode
  readonly direction: Direction
  private mainFinger = 0
  private trendData: TouchData[] = []
  private trendLength = 4
  private prevData: TouchData = {} as TouchData
  private renderData: TouchData | null = null
  private frameId = 0
  private rendering = false
  private accumulation = 6
  private tmThreshold = 50 // 惯性滚动时间差阈值，超过该值不触发惯性滚动，ios 比较灵敏，android 不灵敏
  private touchstartHandler: TouchstartCallback = noop
  private touchmoveHandler: TouchmoveCallback = noop
  private touchendHandler: TouchendCallback = noop

  /**
   * Motion 构造函数
   * @param {Object} [options] - 配置项
   * @param {string} [options.target=HTMLElement|string] - 绑定元素
   * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
   * @param {string} [options.mode=realtime] - 模式：
   *  'realtime' 实时模式，实时计算触摸情况
   *  'frame' 帧模式
   */
  constructor(options: Options = {}) {
    this.el = options.target ? this.getEl(options.target) : null
    this.mode = options.mode || Mode.realtime
    this.direction = options.direction || Direction.xy

    this.initEvent()
  }

  private getEl(el: HTMLElement | string): HTMLElement | null {
    return typeof el === 'string' ? document.querySelector(el) : el
  }

  private initEvent(): void {
    if (!this.el) return
    this.el.addEventListener(
      'touchstart',
      e => {
        this.touchstart(e)
        this.touchstartHandler(e)
      },
      Motion.isSupportPassive
        ? { passive: false, capture: true }
        : /* istanbul ignore next */ false
    )

    this.el.addEventListener(
      'touchmove',
      e => {
        e.preventDefault()
        this.touchmove(e, s => {
          this.touchmoveHandler(s, e)
        })
      },
      Motion.isSupportPassive
        ? { passive: false, capture: true }
        : /* istanbul ignore next */ false
    )

    this.el.addEventListener('touchend', e => {
      this.touchend(e, s => {
        this.touchendHandler(s, e)
      })
    })
  }

  private createData(
    event: TouchEvent,
    prop: 'targetTouches' | 'changedTouches' = 'targetTouches'
  ): TouchData {
    const firstTouch = event[prop][0]
    const secondTouch = event[prop][1]
    const data: TouchData = {
      x: firstTouch.pageX,
      y: firstTouch.pageY,
      t: Date.now(),
      l: 0,
      a: 0
    }

    if (secondTouch) {
      data.l = Math.sqrt(
        Math.pow(firstTouch.pageX - secondTouch.pageX, 2) +
          Math.pow(firstTouch.pageY - secondTouch.pageY, 2)
      )
      data.a =
        (Math.atan(
          (secondTouch.pageY - firstTouch.pageY) /
            (secondTouch.pageX - firstTouch.pageX)
        ) *
          180) /
        Math.PI
    }

    // 收集数据
    this.setTrendData(data)

    return data
  }

  private setTrendData(data: TouchData): void {
    if (this.trendData.length < 1) {
      this.trendData.push(data)
      return
    }
    const lastData = this.trendData[this.trendData.length - 1]
    const t = data.t - lastData.t
    const x = data.x - lastData.x
    const y = data.y - lastData.y

    if (
      t > this.tmThreshold &&
      Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / t < 0.3
    ) {
      // 距上次数据时间差较大并且移动距离较小时（缓慢滚动），不收集滚动数据
      this.trendData = []
    } else {
      // 否则收集滚动数据，用于计算惯性滚动
      this.trendData.push(data)
    }

    if (this.trendData.length > this.trendLength) this.trendData.shift()
  }

  private getMoveData(currData: TouchData): TransData {
    const prevData = this.prevData
    const moveData: TransData = {
      x: currData.x - prevData.x,
      y: currData.y - prevData.y,
      t: currData.t - prevData.t,
      scale: currData.l === 0 || prevData.l === 0 ? 1 : currData.l / prevData.l,
      angle:
        prevData.a > 0 && currData.a < -80
          ? currData.a - prevData.a + 180
          : prevData.a < 0 && currData.a > 80
          ? currData.a - prevData.a - 180
          : currData.a - prevData.a
    }
    this.prevData = currData

    return moveData
  }

  private isNeedInertiaScroll(): boolean {
    return this.trendData.length > 1
  }

  private inertiaScroll(cb: StepCallback): void {
    const first = this.trendData[0]
    const last = this.trendData[this.trendData.length - 1]
    const average = {
      x: last.x - first.x,
      y: last.y - first.y,
      t: last.t - first.t
    }
    let xMoveStep = this.getMoveStep(average.x, average.t)
    let yMoveStep = this.getMoveStep(average.y, average.t)

    if (this.direction === Direction.x) {
      yMoveStep = () => 0
    } else if (this.direction === Direction.y) {
      xMoveStep = () => 0
    }

    const step = () => {
      const deltaSx = xMoveStep()
      const deltaSy = yMoveStep()

      if (deltaSx !== 0 || deltaSy !== 0) {
        this.frameId = requestAnimationFrame(step)
      }

      cb({ x: deltaSx, y: deltaSy, angle: 0, scale: 1 })
    }

    step()
  }

  private getMoveStep(s: number, t: number): () => number {
    const v0 = s / t
    const a0 = v0 / t / 10
    let v = v0
    let a = -a0 * 0.06

    return /* step */ () => {
      const ratio = v / v0
      const nextA = ratio > 0.4 ? a + 0.02 * a0 : a - 0.015 * a0
      const nextV = v - a * this.accumulation
      let deltaS = ((v + nextV) / 2) * this.accumulation

      if (this.isMoveStop(v, nextV)) {
        // 停止运动
        deltaS = 0
        v = 0
        a = 0
      } else {
        v = nextV
        a = nextA
      }

      return deltaS
    }
  }

  /**
   * 速度为 0，或者速度方向改变，或者速度无限大，则停止运动
   * @param v - 当前速度
   * @param nextV - 下一刻速度
   */
  private isMoveStop(v: number, nextV: number): boolean {
    return v === Infinity || v === -Infinity || v === 0 || v / nextV < 0
  }

  private moveFrame(event: TouchEvent, cb: StepCallback): void {
    const data = this.createData(event)

    // 下一帧渲染
    this.renderData = data
    if (!this.rendering) {
      this.rendering = true

      this.frameId = requestAnimationFrame(() => {
        const moveData = this.getMoveData(this.renderData as TouchData)
        const cbData: CbData = {
          x: this.direction !== Direction.y ? moveData.x : 0,
          y: this.direction !== Direction.x ? moveData.y : 0,
          scale: moveData.scale,
          angle: moveData.angle
        }

        cb(cbData)
        this.rendering = false
      })
    }
  }

  private moveRealtime(event: TouchEvent, cb: StepCallback): void {
    const data = this.createData(event)
    const moveData = this.getMoveData(data)
    const cbData: CbData = {
      x: this.direction !== Direction.y ? moveData.x : 0,
      y: this.direction !== Direction.x ? moveData.y : 0,
      scale: moveData.scale,
      angle: moveData.angle
    }

    cb(cbData)
  }

  onTouchstart(cb: TouchstartCallback = noop): void {
    this.touchstartHandler = cb
  }

  onTouchmove(cb: TouchmoveCallback = noop): void {
    this.touchmoveHandler = cb
  }

  onTouchend(cb: TouchendCallback = noop): void {
    this.touchendHandler = cb
  }

  touchstart(event: TouchEvent): void {
    const targetTouches = event.targetTouches
    const changedTouches = event.changedTouches

    if (targetTouches.length === changedTouches.length) {
      // first touch, init touch
      const touch = event.changedTouches[0]

      this.trendData = []
      this.mainFinger = touch.identifier
      this.clearInertiaScroll()
    } else {
      // second touch, do nothing
    }

    // record touch data
    this.prevData = this.createData(event)
  }

  touchmove(event: TouchEvent, cb: StepCallback = noop): void {
    if (event.targetTouches[0].identifier === this.mainFinger) {
      // move with main finger
      this.mode === Mode.frame
        ? this.moveFrame(event, cb)
        : this.moveRealtime(event, cb)
    } else {
      // move without main finger, do nothing.
    }
  }

  touchend(event: TouchEvent, cb: StepCallback = noop): void {
    const targetTouches = event.targetTouches

    if (targetTouches.length > 0) {
      // has other finger touch
      const firstTouch = targetTouches[0]

      this.prevData = this.createData(event)
      if (this.mainFinger !== firstTouch.identifier) {
        // main finger leave, changed main finger
        this.trendData = []
        this.mainFinger = firstTouch.identifier
      } else {
        // other finger leave, do nothing
      }
    } else {
      // has no finger touch, emit touchend
      this.createData(event, 'changedTouches')

      if (this.isNeedInertiaScroll()) {
        this.inertiaScroll(cb)
      } else {
        cb({ x: 0, y: 0, angle: 0, scale: 1 })
      }
    }
  }

  clearInertiaScroll(): void {
    cancelAnimationFrame(this.frameId)
  }
}

export default Motion
