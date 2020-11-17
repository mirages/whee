import { Picker, DataFactory } from '../src/index'

interface PickerData {
  _text: string
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
  getInit() {
    const init = this.alphabet[this.initIndex]
    return {
      _text: init,
      id: this.initIndex
    }
  }
  getPrev(data: PickerData) {
    if (!data) return null
    const index = data.id - 1
    if (index < 0) return null
    return {
      _text: this.alphabet[index],
      id: index
    }
  }
  getNext(data: PickerData) {
    if (!data) return null
    const index = data.id + 1
    if (index > 26) return null
    return {
      _text: this.alphabet[index],
      id: index
    }
  }
}

describe('lib-starter test', () => {
  it('test', () => {
    const picker = new Picker({
      dataFactories: {
        create() {
          return [new AlphabetFactory()]
        },
        change() {
          // noop
          return [new AlphabetFactory()]
        }
      }
    })
    chai.expect(picker).to.be.an.instanceOf(Picker)
  })
})
