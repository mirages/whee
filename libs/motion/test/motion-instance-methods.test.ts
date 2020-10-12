import { Motion, Direction, Mode, stepCallback } from '../src/index'
import { expect } from 'chai'
import { delay } from './helper'

const createTouch = (options: any) => {
  return new Touch({
    identifier: Number(Math.random().toString().split('.')[1]),
    ...options
  })
}

describe('Motion Class - instance methods', function () {
  describe('start(e) - tell motion the target\'s touchstart event manually', () => {
    it('it only accept the touchstart event as the first parameter', () => {
      const target = document.createElement('div')
      const motion = new Motion()
      const touchstart = createTouch({
        target,
        pageX: 0,
        pageY: 0
      })
      const touchstartEvent = new TouchEvent('touchstart',{
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      expect(() => {
        motion.start(touchstartEvent)
      }).to.not.throw()
    })
  })

  describe('move(e, cb) - tell motion the target\'s touchmove event manually', () => {
    it('the second parameter callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion()
      const motion1 = new Motion({ mode: Mode.animation })
      const touchmove = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      expect(() => {
        motion.move(touchmoveEvent)
        motion1.move(touchmoveEvent)
      }).to.not.throw()
    })
    it('move only in "x" direction when options.direction equal Derection.x', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.x })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      motion.start(touchstartEvent)
      motion.move(touchmoveEvent, (dis) => {
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        expect(dis.y).to.be.equal(0)
        done()
      })
    })
    it('move only in "y" direction when options.direction equal Derection.y', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.y })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      motion.start(touchstartEvent)
      motion.move(touchmoveEvent, (dis) => {
        expect(dis.x).to.be.equal(0)
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
    })
    it('move can in "x" and "y" direction when options.direction equal Derection.xy', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      motion.start(touchstartEvent)
      motion.move(touchmoveEvent, (dis) => {
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
    })
    it('move realtime when options.mode equal Mode.realtime', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchmove1 = createTouch({
        target,
        pageX: 110,
        pageY: 110
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      const touchmoveEvent1 = new TouchEvent('touchmove', {
        touches: [touchmove1],
        targetTouches: [touchmove1],
        changedTouches: [touchmove1]
      })
      let moveX = 0
      let moveY = 0
      motion.start(touchstartEvent)
      motion.move(touchmoveEvent, (dis) => {
        moveX += dis.x
        moveY += dis.y
      })
      expect(moveX).to.be.equal(touchmove.pageX - touchstart.pageX)
      expect(moveY).to.be.equal(touchmove.pageY - touchstart.pageY)
      motion.move(touchmoveEvent1, (dis) => {
        moveX += dis.x
        moveY += dis.y
      })
      expect(moveX).to.be.equal(touchmove1.pageX - touchstart.pageX)
      expect(moveY).to.be.equal(touchmove1.pageY - touchstart.pageY)
      done()
    })
    it('move frame by frame when options.mode equal Mode.animation', done => {
      const target = document.createElement('div')
      const motionX = new Motion({ direction: Direction.x, mode: Mode.animation })
      const motionY = new Motion({ direction: Direction.y, mode: Mode.animation })
      const motionXY = new Motion({ direction: Direction.xy, mode: Mode.animation })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchmove1 = createTouch({
        target,
        pageX: 110,
        pageY: 110
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      const touchmoveEvent1 = new TouchEvent('touchmove', {
        touches: [touchmove1],
        targetTouches: [touchmove1],
        changedTouches: [touchmove1]
      })
      let moveX = 0
      let moveY = 0
      let moveXY = 0
      motionX.start(touchstartEvent)
      motionX.move(touchmoveEvent, (dis) => {
        moveX += dis.x
      })
      motionX.move(touchmoveEvent1, (dis) => {
        moveX += dis.x
      })
      motionY.start(touchstartEvent)
      motionY.move(touchmoveEvent, (dis) => {
        moveY += dis.y
      })
      motionY.move(touchmoveEvent1, (dis) => {
        moveY += dis.y
      })
      motionXY.start(touchstartEvent)
      motionXY.move(touchmoveEvent, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motionXY.move(touchmoveEvent1, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      // 并没有执行 callback
      expect(moveX).to.be.equal(0)
      expect(moveY).to.be.equal(0)
      expect(moveXY).to.be.equal(0)
      // 下一帧动画才执行 callback
      requestAnimationFrame(() => {
        console.log('next frame')
        expect(moveX).to.be.equal(touchmove1.pageX - touchstart.pageX)
        expect(moveY).to.be.equal(touchmove1.pageY - touchstart.pageY)
        expect(moveXY).to.be.equal(Math.sqrt(
          Math.pow(touchmove1.pageX - touchstart.pageX, 2) + 
          Math.pow(touchmove1.pageY - touchstart.pageY, 2)
        ))
        done()
      })
    })
    it('stop animation move when recall start(e)', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.xy, mode: Mode.animation })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchmove1 = createTouch({
        target,
        pageX: 110,
        pageY: 110
      })
      const touchmove2 = createTouch({
        target,
        pageX: 115,
        pageY: 115
      })
      const touchmove3 = createTouch({
        target,
        pageX: 120,
        pageY: 120
      })
      const touchmove4 = createTouch({
        target,
        pageX: 125,
        pageY: 125
      })
      const touchmove5 = createTouch({
        target,
        pageX: 130,
        pageY: 130
      })
      const touchmove6 = createTouch({
        target,
        pageX: 135,
        pageY: 135
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        touches: [touchstart],
        targetTouches: [touchstart],
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        touches: [touchmove],
        targetTouches: [touchmove],
        changedTouches: [touchmove]
      })
      const touchmoveEvent1 = new TouchEvent('touchmove', {
        touches: [touchmove1],
        targetTouches: [touchmove1],
        changedTouches: [touchmove1]
      })
      const touchmoveEvent2 = new TouchEvent('touchmove', {
        touches: [touchmove2],
        targetTouches: [touchmove2],
        changedTouches: [touchmove2]
      })
      const touchmoveEvent3 = new TouchEvent('touchmove', {
        touches: [touchmove3],
        targetTouches: [touchmove3],
        changedTouches: [touchmove3]
      })
      const touchmoveEvent4 = new TouchEvent('touchmove', {
        touches: [touchmove4],
        targetTouches: [touchmove4],
        changedTouches: [touchmove4]
      })
      const touchmoveEvent5 = new TouchEvent('touchmove', {
        touches: [touchmove5],
        targetTouches: [touchmove5],
        changedTouches: [touchmove5]
      })
      const touchmoveEvent6 = new TouchEvent('touchmove', {
        touches: [touchmove6],
        targetTouches: [touchmove6],
        changedTouches: [touchmove6]
      })
      let moveXY = 0
      motion.start(touchstartEvent)
      motion.move(touchmoveEvent, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent1, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent2, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent3, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent4, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent5, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.move(touchmoveEvent6, (dis) => {
        moveXY += Math.sqrt(Math.pow(dis.x, 2) + Math.pow(dis.y, 2))
      })
      motion.start(touchstartEvent)
      // 下一帧也没有执行 move callback
      setTimeout(() => {
        expect(moveXY).to.be.equal(0)
        done()
      }, 30)
    })
  })
  
  describe('end(e, cb) - tell motion the target\'s touchend event manually', () => {
    it('the second parameter callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion()
      const touchend = createTouch({
        target,
        pageX: 0,
        pageY: 0
      })
      const touchendEvent = new TouchEvent('touchend', {
        touches: [],
        targetTouches: [],
        changedTouches: [touchend]
      })
      expect(() => {
        motion.end(touchendEvent)
      }).to.not.throw()
    })
    it('end immediately when move slowly', async () => {
      const target = document.createElement('div')
      const motionX = new Motion({ direction: Direction.x })
      const motionY = new Motion({ direction: Direction.y })
      const motionXY = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchstart],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchstart],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchmove],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchmove],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      const touchendEvent = new TouchEvent('touchend', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      motionX.start(touchstartEvent)
      motionX.move(touchmoveEvent)
      motionY.start(touchstartEvent)
      motionY.move(touchmoveEvent)
      motionXY.start(touchstartEvent)
      motionXY.move(touchmoveEvent)
      await delay(60) // 延时不进行惯性滚动
      motionX.end(touchendEvent, dis => {
        expect(dis.x).to.be.equal(0)
      })
      motionY.end(touchendEvent, dis => {
        expect(dis.y).to.be.equal(0)
      })
      motionXY.end(touchendEvent, dis => {
        expect(dis.x).to.be.equal(0)
        expect(dis.y).to.be.equal(0)
      })
    })
    it('end emit inertial scroll when move fastly', async () => {
      const target = document.createElement('div')
      const motionX = new Motion({ direction: Direction.x })
      const motionY = new Motion({ direction: Direction.y })
      const motionXY = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchstart],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchstart],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchmove],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchmove],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      const touchendEvent = new TouchEvent('touchend', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      motionX.start(touchstartEvent)
      motionY.start(touchstartEvent)
      motionXY.start(touchstartEvent)
      await delay(4)
      motionX.move(touchmoveEvent)
      motionY.move(touchmoveEvent)
      motionXY.move(touchmoveEvent)
      await delay(4) // 触发惯性滚动
      const times: number[] = await Promise.all([
        new Promise(resolve => {
          let times = 0
          motionX.end(touchendEvent, dis => {
            times++
            if (dis.x === 0) {
              resolve(times)
            }
          })
        }),
        new Promise(resolve => {
          let times = 0
          motionY.end(touchendEvent, dis => {
            times++
            if (dis.y === 0) {
              resolve(times)
            }
          })
        }),
        new Promise(resolve => {
          let times = 0
          motionXY.end(touchendEvent, dis => {
            times++
            if (dis.x === 0 && dis.y === 0) {
              resolve(times)
            }
          })
        })
      ])
      expect(times[0]).to.be.above(2)
      expect(times[1]).to.be.above(2)
      expect(times[2]).to.be.above(2)
    })
    it('stop inertial scroll when recall start(e)', async () => {
      const target = document.createElement('div')
      const motionXY = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchstart],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchstart],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchmove],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchmove],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      const touchendEvent = new TouchEvent('touchend', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      motionXY.start(touchstartEvent)
      await delay(4)
      motionXY.move(touchmoveEvent)
      await delay(4) // 触发惯性滚动
      const times = await new Promise(resolve => {
        let times = 0
        motionXY.end(touchendEvent, dis => {
          times++
          if (times === 2) {
            // 重新开始，则会停止上一次的惯性滚动
            motionXY.start(touchstartEvent)
            setTimeout(() => {
              resolve(2)
            }, 30)
          } else if (times === 3) {
            resolve(3)
          }
        })
      })
      expect(times).to.be.equal(2)
    })
  })

  describe('touchstart(cb) - listen motion (options.target) touchstart event passively', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchstart()
      }).to.not.throw()
    })
    it('excute callback when options.target emit touchstart event', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      const touch = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchstart = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touch],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touch],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touch]
      })
      motion.touchstart((e: any) => {
        expect(e).to.be.equal(touchstart)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstart)
    })
  })

  describe('touchmove(cb) - listen motion (options.target) touchmove event passively', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchmove()
      }).to.not.throw()
    })
    it('excute callback when options.target emit touchmove event', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchstart],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchstart],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchmove],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchmove],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      motion.touchmove((dis, e) => {
        expect(e).to.be.equal(touchmoveEvent)
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
    })
  })

  describe('touchend(cb) - listen motion (options.target) touchend event passively', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchend()
      }).to.not.throw()
    })
    it('excute callback when options.target emit touchend event', async () => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 105,
        pageY: 105
      })
      const touchstartEvent = new TouchEvent('touchstart', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchstart],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchstart],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchstart]
      })
      const touchmoveEvent = new TouchEvent('touchmove', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [touchmove],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [touchmove],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      const touchendEvent = new TouchEvent('touchend', {
        // 屏幕上所有触摸点 touch 对象列表
        touches: [],
        // 当前 dom 节点上的 touch 对象列表
        targetTouches: [],
        // 触发事件变化的 touch 对象列表
        changedTouches: [touchmove]
      })
      motion.touchend((dis, e) => {
        expect(e).to.be.equal(touchendEvent)
        expect(dis.x).to.be.equal(0)
        expect(dis.y).to.be.equal(0)
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      await delay(60)
      target.dispatchEvent(touchendEvent)
    })
  })
})