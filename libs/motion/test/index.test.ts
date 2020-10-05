import { Motion, Direction, Mode } from '../src/index'
import { expect } from 'chai'

describe('motion', () => {
  describe('default options', () => {
    it('options.mode can be Mode.realtime and Mode.animation', () => {
      expect(new Motion({ mode: Mode.realtime }).mode).to.be.equal(Mode.realtime)
      expect(new Motion({ mode: Mode.animation }).mode).to.be.equal(Mode.animation)
    })
    it('options.mode default value is Mode.realtime', () => {
      expect(new Motion().mode).to.be.equal(Mode.realtime)
      expect(new Motion({ mode: 'asd' as Mode }).mode).to.be.equal(Mode.realtime)
    })
    it('options.direction can be Direction.x and Direction.y and Direction.xy', () => {
      expect(new Motion({ direction: Direction.x }).direction).to.be.equal(Direction.x)
      expect(new Motion({ direction: Direction.y }).direction).to.be.equal(Direction.y)
      expect(new Motion({ direction: Direction.xy }).direction).to.be.equal(Direction.xy)
    })
    it('options.direction default value is Direction.xy', () => {
      expect(new Motion().direction).to.be.equal(Direction.xy)
      expect(new Motion({ direction: 'asd' as Direction }).direction).to.be.equal(Direction.xy)
    })
  })
})