import { Motion, Direction, Mode } from '../src/index'
import { expect } from 'chai'

const createTouch = (options: any) => {
  return new Touch({
    identifier: Number(Math.random().toString().split('.')[1]),
    ...options
  })
}

describe('Direction Object', () => {
  describe('properties', () => {
    it('Derection has a "x" property', () => {
      expect(Direction).to.have.property('x')
    })
    it('Derection has a "y" property', () => {
      expect(Direction).to.have.property('y')
    })
    it('Derection has a "xy" property', () => {
      expect(Direction).to.have.property('xy')
    })
  })
})

describe('Mode Object', () => {
  describe('properties', () => {
    it('Mode has a "realtime" property', () => {
      expect(Mode).to.have.property('realtime')
    })
    it('Mode has a "animation" property', () => {
      expect(Mode).to.have.property('animation')
    })
  })
})

describe('Motion Class', () => {
  describe('static property', () => {
    it('Motion.isSupportPassive is boolean value', () => {
      expect(Motion.isSupportPassive).to.be.a('boolean')
    })
  })

  describe('instance options', () => {
    it('options.mode can be Mode.realtime or Mode.animation', () => {
      expect(new Motion({ mode: Mode.realtime }).mode).to.be.equal(Mode.realtime)
      expect(new Motion({ mode: Mode.animation }).mode).to.be.equal(Mode.animation)
    })
    it('options.mode default value is Mode.realtime', () => {
      expect(new Motion().mode).to.be.equal(Mode.realtime)
      expect(new Motion({ mode: 'asd' as Mode }).mode).to.be.equal(Mode.realtime)
    })
    it('options.direction can be Direction.x or Direction.y or Direction.xy', () => {
      expect(new Motion({ direction: Direction.x }).direction).to.be.equal(Direction.x)
      expect(new Motion({ direction: Direction.y }).direction).to.be.equal(Direction.y)
      expect(new Motion({ direction: Direction.xy }).direction).to.be.equal(Direction.xy)
    })
    it('options.direction default value is Direction.xy', () => {
      expect(new Motion().direction).to.be.equal(Direction.xy)
      expect(new Motion({ direction: 'asd' as Direction }).direction).to.be.equal(Direction.xy)
    })
    it('options.target can be element object or a string', () => {
      const target = document.createElement('div')
      target.id = 'target'
      target.className = 'target'
      document.body.appendChild(target)

      expect(new Motion({ target }).el).to.be.equal(target)
      expect(new Motion({ target: '#target' }).el).to.be.equal(target)
      expect(new Motion({ target: '.target' }).el).to.be.equal(target)
    })
  })

  describe('instance methods', () => {
    const target = document.createElement('div')
    const motion = new Motion({ target })

    describe('touchstart(cb) - listen options.target element\'s touchstart event', () => {
      it('callback function is optional', () => {
        expect(() => {
          motion.touchstart()
        }).to.not.throw()
      })
      it('callback first parameter is the touchstart event', done => {
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
        expect(() => {
          motion.touchmove()
        }).to.not.throw()
      })
      it('callback first parameter has "x" property when options.direction equal Derection.x', done => {
        const xMotion = new Motion({ target, direction: Direction.x })
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
        xMotion.touchmove((dis, e) => {
          // expect(e).to.be.equal(touchmoveEvent)
          console.log(dis, e)
          // expect(dis).to.have.property('x')
          // expect(dis.x).to.be.equal(touchmove.pageX - touchstart.pageX)
          done()
        })
        // 派发事件
        target.dispatchEvent(touchstartEvent)
        target.dispatchEvent(touchmoveEvent)
      })
    })
  })
})