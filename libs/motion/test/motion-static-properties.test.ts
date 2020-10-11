import { Motion } from '../src/index'
import { expect } from 'chai'

describe('Motion Class - static properties', () => {
  it('Motion.isSupportPassive is boolean value', () => {
    expect(Motion.isSupportPassive).to.be.a('boolean')
  })
})