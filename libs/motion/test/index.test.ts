import { Motion, Direction, Mode } from '../src/index'
import { expect } from 'chai'

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
    describe('touchstart(cb)', () => {
      it('excute cb function when options.target element emit touchstart event', () => {
  
      })
      it('cb function\'s first parameter is the touchstart event', () => {
  
      })
    })
  })
})