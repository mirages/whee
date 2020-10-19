enum Mode {
  realtime = 'realtime',
  frame = 'frame'
}
enum Direction {
  x = 'x',
  y = 'y',
  xy = 'xy'
}
interface Opts {
  target?: HTMLElement|string,
  mode?: Mode,
  direction?: Direction
}
interface tData {
  x: number,
  y: number,
  t: number
}
export interface stepCallback {
  (arg: {x: number, y: number}): void
}
export interface touchstartCallback {
  (e: TouchEvent): void
}
export interface touchmoveCallback {
  (s: { x: number, y: number }, e: TouchEvent): void
}

const noop = () => {
  // no operation
}

class Motion {
  static isSupportPassive: boolean = (() => {
    let supportsPassive = false

    try {
      document.createElement('div').addEventListener('testPassive', noop, {
        get passive () {
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

  readonly el: HTMLElement|null
  readonly mode: Mode
  readonly direction: Direction
  private trendData: tData[] = []
  private maxLength = 4
  private tmThreshold = 50 // 惯性滚动时间差阈值，超过该值不触发惯性滚动，ios 比较灵敏，android 不灵敏
  private prevData: tData|null = null
  private renderData: tData|null = null
  private animateId = 0
  private rendering = false
  private accumulation = 6
  private touchstartHandler: touchstartCallback = noop
  private touchmoveHandler: touchmoveCallback = noop
  private touchendHandler: touchmoveCallback = noop

  /**
   * Motion 构造函数
   * @param {Object} [options] - 配置项
   * @param {string} [options.target=HTMLElement|string] - 绑定元素
   * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
   * @param {string} [options.mode=realtime] - 模式：
   *  'absolute' 绝对模式，输出绝对位置变量
   *  'relative' 相对模式，输出相对（上一次）位置变量
   */
  constructor (options: Opts = {}) {
    this.el = options.target ? this.getEl(options.target) : null
    this.mode = options.mode || Mode.realtime
    this.direction = options.direction || Direction.xy

    if (this.mode === Mode.frame) {
      this.move = this.moveAnimate
    } else {
      this.move = this.moveRealtime
    }

    this.initEvent()
  }

  private getEl (el: HTMLElement|string): HTMLElement|null {
    return typeof el === 'string' ? document.querySelector(el) : el
  }

  private initEvent (): void {
    if (!this.el) return
    this.el.addEventListener('touchstart', e => {
      this.start(e)
      this.touchstartHandler(e)
    }, Motion.isSupportPassive ? { passive: false, capture: true } : /* istanbul ignore next */false)

    this.el.addEventListener('touchmove', e => {
      e.preventDefault()
      this.move(e, s => {
        this.touchmoveHandler(s, e)
      })
    }, Motion.isSupportPassive ? { passive: false, capture: true } : /* istanbul ignore next */false)

    this.el.addEventListener('touchend', e => {
      this.end(e, s => {
        this.touchendHandler(s, e)
      })
    })
  }

  private createData (touch: Touch): tData {
    const now = Date.now()
    const data: tData = {
      x: touch.pageX,
      y: touch.pageY,
      t: now
    }

    return data
  }

  private getMoveData (currData: tData): tData {
    if (!this.prevData) this.prevData = currData
    const moveData: tData = {
      x: currData.x - this.prevData.x,
      y: currData.y - this.prevData.y,
      t: currData.t - this.prevData.t
    }
    this.prevData = currData

    return moveData
  }

  private isNeedInertiaScroll (): boolean {
    return this.trendData.length > 1
  }

  touchstart (cb: touchstartCallback = noop): void {
    this.touchstartHandler = cb
  }

  touchmove (cb: touchmoveCallback = noop): void {
    this.touchmoveHandler = cb
  }

  touchend (cb: touchmoveCallback = noop): void {
    this.touchendHandler = cb
  }

  start (event: TouchEvent): void {
    const touch = event.targetTouches[0]

    this.trendData = []
    this.prevData = this.createData(touch)
    this.setTrendData(this.prevData)
    this.clearInertiaScroll()
  }

  /* istanbul ignore next */
  // eslint-disable-next-line
  move (event: TouchEvent, cb: stepCallback = noop): void {}

  moveAnimate (event: TouchEvent, cb: stepCallback = noop): void {
    const touch = event.targetTouches[0]
    const data = this.createData(touch)

    // 实时收集数据
    this.setTrendData(data)
    // 下一帧渲染
    this.renderData = data
    if (!this.rendering) {
      this.rendering = true

      this.animateId = requestAnimationFrame(() => {
        const moveData = this.getMoveData(this.renderData as tData)
        const cbData = {
          x: this.direction !== Direction.y ? moveData.x : 0,
          y: this.direction !== Direction.x ? moveData.y : 0
        }

        cb(cbData)
        this.rendering = false
      })
    }
  }

  moveRealtime (event: TouchEvent, cb: stepCallback = noop): void {
    const touch = event.targetTouches[0]
    const data = this.createData(touch)
    const moveData = this.getMoveData(data)
    const cbData = {
      x: this.direction !== Direction.y ? moveData.x : 0,
      y: this.direction !== Direction.x ? moveData.y : 0
    }

    this.setTrendData(data)
    cb(cbData)
  }

  private setTrendData (data: tData): void {
    if (this.trendData.length < 1) {
      this.trendData.push(data)
      return
    }
    const lastData = this.trendData[this.trendData.length - 1]
    const t = data.t - lastData.t
    const x = data.x - lastData.x
    const y = data.y - lastData.y

    if (t > this.tmThreshold && Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / t < 0.3) {
      // 距上次数据时间差较大并且移动距离较小时（缓慢滚动），不收集滚动数据
      this.trendData = []
    } else {
      // 否则收集滚动数据，用于计算惯性滚动
      this.trendData.push(data)
    }

    if (this.trendData.length > this.maxLength) this.trendData.shift()
  }

  end (event: TouchEvent, cb: stepCallback = noop): void {
    const touch = event.changedTouches[0]
    const data = this.createData(touch)

    this.setTrendData(data)
    if (this.isNeedInertiaScroll()) {
      this.inertiaScroll(cb)
    } else {
      const cbData = { x: 0, y: 0 }
      cb(cbData)
    }
  }

  private inertiaScroll (cb: stepCallback): void {
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
        this.animateId = requestAnimationFrame(step)
      }

      cb({ x: deltaSx, y: deltaSy })
    }

    step()
  }

  private getMoveStep (s: number, t: number): () => number {
    const v0 = s / t
    const a0 = v0 / t / 10
    let v = v0
    let a = -a0 / 15

    return /* step */ () => {
      const nextA = a + 0.04 * a0
      const nextV = v - a * this.accumulation
      let deltaS = (v + nextV) / 2 * this.accumulation

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
  private isMoveStop (v: number, nextV: number): boolean {
    return v === Infinity || v === -Infinity || v === 0 || v / nextV < 0
  }

  clearInertiaScroll (): void {
    cancelAnimationFrame(this.animateId)
  }
}

export default Motion
