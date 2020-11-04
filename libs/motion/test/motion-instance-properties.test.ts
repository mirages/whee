import Motion from '../src/index'
import { expect } from 'chai'

const Direction = Motion.Direction
const Mode = Motion.Mode

describe('Motion Class - instance properties', () => {
  it('motion.mode should be Mode.realtime or Mode.frame', () => {
    expect(new Motion({ mode: Mode.realtime }).mode).to.be.equal(Mode.realtime)
    expect(new Motion({ mode: Mode.frame }).mode).to.be.equal(Mode.frame)
  })
  it('motion.mode default value is Mode.realtime', () => {
    expect(new Motion().mode).to.be.equal(Mode.realtime)
    // expect(new Motion({ mode: 'asd' as Mode }).mode).to.be.equal(Mode.realtime)
  })
  it('motion.direction should be Direction.x or Direction.y or Direction.xy', () => {
    expect(new Motion({ direction: Direction.x }).direction).to.be.equal(Direction.x)
    expect(new Motion({ direction: Direction.y }).direction).to.be.equal(Direction.y)
    expect(new Motion({ direction: Direction.xy }).direction).to.be.equal(Direction.xy)
  })
  it('motion.direction default value is Direction.xy', () => {
    expect(new Motion().direction).to.be.equal(Direction.xy)
  })
  it('motion.target should be an element object or a string', () => {
    const target = document.createElement('div')
    target.id = 'target'
    target.className = 'target'
    document.body.appendChild(target)

    expect(new Motion({ target }).el).to.be.equal(target)
    expect(new Motion({ target: '#target' }).el).to.be.equal(target)
    expect(new Motion({ target: '.target' }).el).to.be.equal(target)
  })
})
