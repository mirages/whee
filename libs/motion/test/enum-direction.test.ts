import { Direction } from '../src/index'
import { expect } from 'chai'

describe('Direction Object', () => {
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