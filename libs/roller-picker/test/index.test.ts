import { Picker, BaseData, DataFactory } from '../src/index'

interface PickerData extends BaseData {
  id: number
}

class AlphabetFactory implements DataFactory<PickerData> {
  private alphabet = [
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z'
  ]
  private initIndex = 10

  createData(index: number): PickerData {
    return {
      _text: this.alphabet[index],
      id: index
    }
  }
  getInit() {
    return this.createData(this.initIndex)
  }
  getPrev(data: PickerData | null): PickerData | null {
    if (!data || data.id === 0) return null

    return this.createData(data.id - 1)
  }
  getNext(data: PickerData | null) {
    if (!data || data.id === this.alphabet.length - 1) return null

    return this.createData(data.id + 1)
  }
}

describe('lib-starter test', () => {
  it('test', () => {
    const picker = new Picker({
      dataFactories: {
        create() {
          return [new AlphabetFactory()]
        }
      }
    })
    chai.expect(picker).to.be.an.instanceOf(Picker)
  })
})
