import { Motion, Direction, Mode } from '../src/index'
import { expect } from 'chai'

const createTouch = (options: any) => {
  return new Touch({
    identifier: Number(Math.random().toString().split('.')[1]),
    ...options
  })
}

describe('Motion Class - instance methods', () => {
  describe('touchstart(cb) - listen options.target element\'s touchstart event', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchstart()
      }).to.not.throw()
    })
    it('callback first parameter is the touchstart event', done => {
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

  describe('touchmove(cb) - listen options.target element\'s touchmove event', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchmove()
      }).to.not.throw()
    })
    it('callback first parameter has "x" property when options.direction equal Derection.x', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.x })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
    })
    it('callback first parameter has "y" property when options.direction equal Derection.y', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.y })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('y')
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
    })
    it('callback first parameter has "x" and "y" property when options.direction equal Derection.xy', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis).to.have.property('x')
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
    })
  })

  describe('touchend(cb) - listen options.target element\'s touchend event', () => {
    it('callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion({ target })
      expect(() => {
        motion.touchend()
      }).to.not.throw()
    })
    it('callback first parameter has "x" property when options.direction equal Derection.x', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.x })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis.x).to.be.equal(0)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 60)
    })
    it('callback may excute many times when options.direction equal Derection.x and trigger "x" direction inertial scroll', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.x })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
      let times = 0
      motion.touchend((dis) => {
        times++
        if (dis.x === 0) {
          console.log('times - x', times)
          expect(times).to.be.above(2)
          done()
        }
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 20)
    })
    it('callback first parameter has "y" property when options.direction equal Derection.y', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.y })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('y')
        expect(dis.y).to.be.equal(0)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 60)
    })
    it('callback may excute many times when options.direction equal Derection.y and trigger "y" direction inertial scroll', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.y })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
      let times = 0
      motion.touchend((dis, e) => {
        times++
        if (dis.y === 0) {
          console.log('times - y', times)
          expect(times).to.be.above(2)
          done()
        }
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 20)
    })
    it('callback first parameter has "x" and "y" property when options.direction equal Derection.xy', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis).to.have.property('x')
        expect(dis.x).to.be.equal(0)
        expect(dis.y).to.be.equal(0)
        done()
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 60)
    })
    it('callback may excute many times when options.direction equal Derection.xy and trigger "x" or "y" direction inertial scroll', done => {
      const target = document.createElement('div')
      const motion = new Motion({ target, direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
      let times = 0
      motion.touchend((dis, e) => {
        times++
        if (dis.x === 0 && dis.y === 0) {
          console.log('times - xy', times)
          expect(times).to.be.above(2)
          done()
        }
      })
      // 派发事件
      target.dispatchEvent(touchstartEvent)
      target.dispatchEvent(touchmoveEvent)
      // 需要延时操作，
      setTimeout(() => {
        target.dispatchEvent(touchendEvent)
      }, 20)
    })
  })

  describe('start(e) - tell motion the target\'s touchstart event manually', () => {
    it('it only accept the touchstart event as the first paramter', () => {
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
    it('the second paramter callback function is optional', () => {
      const target = document.createElement('div')
      const motion = new Motion()
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
      }).to.not.throw()
    })
    it('callback first parameter has "x" property when options.direction equal Derection.x', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.x })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        done()
      })
    })
    it('callback first parameter has "y" property when options.direction equal Derection.y', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.y })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('y')
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
    })
    it('callback first parameter has "x" and "y" property when options.direction equal Derection.xy', done => {
      const target = document.createElement('div')
      const motion = new Motion({ direction: Direction.xy })
      const touchstart = createTouch({
        target,
        pageX: 100,
        pageY: 100
      })
      const touchmove = createTouch({
        target,
        pageX: 120,
        pageY: 130
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
        expect(dis).to.have.property('x')
        expect(dis).to.have.property('y')
        expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
        expect(dis.y).to.be.equal(touchmove.pageY - touchstart.pageY)
        done()
      })
    })
  })
  
  describe('end(e, cb) - tell motion the target\'s touchend event manually', () => {})
})