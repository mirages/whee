import { Mode } from '../src/index'
import { expect } from 'chai'

describe('Mode Object', () => {
  it('Mode has a "realtime" property', () => {
    expect(Mode).to.have.property('realtime')
  })
  it('Mode has a "animation" property', () => {
    expect(Mode).to.have.property('animation')
  })
})