import { Picker, BaseData, DataFactory, NullableData } from '../src/index'
import '../src/types'
import styles from '../src/index.less'
import { getEle } from '../src/utils'

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
  getPrev(data: NullableData<PickerData>): NullableData<PickerData> {
    if (!data || data.id === 0) return null

    return this.createData(data.id - 1)
  }
  getNext(data: NullableData<PickerData>): NullableData<PickerData> {
    if (!data || data.id === this.alphabet.length - 1) return null

    return this.createData(data.id + 1)
  }
}

describe('Picker', () => {
  it('picker.getValue() return an array, and init value should be options.dataFactories init value', () => {
    const alphabetFactory = new AlphabetFactory()
    const picker = new Picker({
      dataFactories: {
        create() {
          return [alphabetFactory]
        }
      }
    })
    picker
      .getValue()
      .should.be.an('array')
      .and.deep.include(alphabetFactory.getInit())
  })

  it('picker.show() should show the picker', () => {
    const picker = new Picker({
      dataFactories: {
        create() {
          return [new AlphabetFactory()]
        }
      }
    })
    picker.show()
    picker.$root.className.should.be.include(styles['picker-in'])
  })

  it('picker.hide() should hide the picker', () => {
    const picker = new Picker({
      dataFactories: {
        create() {
          return [new AlphabetFactory()]
        }
      }
    })
    picker.show()
    picker.$root.className.should.be.include(styles['picker-in'])
    picker.hide()
    picker.$root.className.should.be.not.include(styles['picker-in'])
  })

  it('ensure button should be emit a ensure event', done => {
    const alphabetFactory = new AlphabetFactory()
    const picker = new Picker({
      dataFactories: {
        create() {
          return [alphabetFactory]
        }
      }
    })
    const $ensure = getEle('[ref=picker-ensure]', picker.$root)

    chai.should().exist($ensure)
    picker.on('ensure', (data: PickerData[]) => {
      data.should.be.an('array').and.deep.include(alphabetFactory.getInit())
      done()
    })
    $ensure!.click()
  })

  it('cancel button should be emit a cancel event', done => {
    const alphabetFactory = new AlphabetFactory()
    const picker = new Picker({
      dataFactories: {
        create() {
          return [alphabetFactory]
        }
      }
    })
    const $cancel = getEle('[ref=picker-cancel]', picker.$root)

    chai.should().exist($cancel)
    picker.on('cancel', () => {
      done()
    })
    $cancel!.click()
  })
})
