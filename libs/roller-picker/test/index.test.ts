import { Picker, PickerDataFactory } from '../src/index'

class SimplePickerData extends PickerDataFactory {

}
describe('lib-starter test', () => {
  it('test', () => {
    const picker = new Picker({
      pickerDataFactory: new SimplePickerData()
    })
    chai.expect(3).to.be.equal(3)
  })
})
