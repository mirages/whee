import Motion from '../src/index'
import { expect } from 'chai'

const Mode = Motion.Mode

describe('Mode Object', () => {
  it('Mode has a "realtime" property', () => {
    expect(Mode).to.have.property('realtime')
  })
  it('Mode has a "frame" property', () => {
    expect(Mode).to.have.property('frame')
  })
})