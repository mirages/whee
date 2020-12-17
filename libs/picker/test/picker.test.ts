import { Picker, DataSource, Nullable } from '../src/index'
import { angleToRadian, getEle } from '../src/utils'

interface AddrData {
  id: string
  value: string
}

interface PickerData extends AddrData {
  index: number
}

class BaseSource implements DataSource<PickerData> {
  protected list: AddrData[] = []
  protected initIndex = 0

  createData(index: number): PickerData {
    const data = this.list[index]
    return {
      index,
      ...data
    }
  }
  getInit() {
    return this.createData(this.initIndex)
  }
  getPrev(data: Nullable<PickerData>): Nullable<PickerData> {
    if (!data || data.index === 0) return null

    return this.createData(data.index - 1)
  }
  getNext(data: Nullable<PickerData>): Nullable<PickerData> {
    if (!data || data.index === this.list.length - 1) return null

    return this.createData(data.index + 1)
  }
  getText(data: Nullable<PickerData>): string {
    if (data === null) return ''
    return this.list[data.index].value
  }
}

const ProvinceData = [
  {
    id: '010000',
    value: '北京市'
  },
  {
    id: '020000',
    value: '河南省'
  },
  {
    id: '030000',
    value: '河北省'
  },
  {
    id: '040000',
    value: '湖南省'
  },
  {
    id: '050000',
    value: '湖北省'
  }
]
class ProvinceSource extends BaseSource {
  constructor(initId?: string) {
    super()
    this.list = ProvinceData
    const index = this.list.findIndex(item => item.id === initId)
    this.initIndex = index > -1 ? index : 0
  }
}

const CityData: {
  [prop: string]: {
    id: string
    value: string
  }[]
} = {
  '010000': [
    {
      id: '010100',
      value: '西城区'
    },
    {
      id: '010200',
      value: '东城区'
    },
    {
      id: '010300',
      value: '朝阳区'
    },
    {
      id: '010400',
      value: '海淀区'
    },
    {
      id: '010500',
      value: '石景山区'
    }
  ],
  '020000': [
    {
      id: '020100',
      value: '郑州市'
    },
    {
      id: '020200',
      value: '开封市'
    },
    {
      id: '020300',
      value: '洛阳市'
    },
    {
      id: '020400',
      value: '安阳市'
    },
    {
      id: '020500',
      value: '新乡市'
    }
  ],
  '030000': [
    {
      id: '030100',
      value: '石家庄市'
    },
    {
      id: '030200',
      value: '唐山市'
    },
    {
      id: '030300',
      value: '秦皇岛市'
    },
    {
      id: '030400',
      value: '邯郸市'
    },
    {
      id: '030500',
      value: '保定市'
    }
  ],
  '040000': [
    {
      id: '040100',
      value: '长沙市'
    },
    {
      id: '040200',
      value: '株洲市'
    },
    {
      id: '040300',
      value: '湘潭市'
    },
    {
      id: '040400',
      value: '衡阳市'
    },
    {
      id: '040500',
      value: '常德市'
    }
  ],
  '050000': [
    {
      id: '050100',
      value: '武汉市'
    },
    {
      id: '050200',
      value: '黄石市'
    },
    {
      id: '050300',
      value: '十堰市'
    },
    {
      id: '050400',
      value: '宜昌市'
    },
    {
      id: '050500',
      value: '襄樊市'
    }
  ]
}
class CitySource extends BaseSource {
  constructor(firstId: string, initId?: string) {
    super()
    this.list = CityData[firstId] || CityData['010000']

    const index = this.list.findIndex(item => item.id === initId)

    this.initIndex = index > -1 ? index : 0
  }
}

describe('Picker', () => {
  it('options.el must not be empty', () => {
    const factory = new ProvinceSource()
    chai
      .expect(() => {
        new Picker({
          el: '#ttttsss',
          dataSourceFactory: {
            cascadable: false,
            create() {
              return [factory]
            },
            change() {
              return [factory]
            }
          }
        })
      })
      .to.throw()
  })

  it('options.pickedEvent=change pick cascadable values when scroller emit change event', () => {
    let changedTime = 0
    const picker = new Picker({
      el: document.createElement('div'),
      pickedEvent: 'change',
      dataSourceFactory: {
        cascadable: true,
        create() {
          const provinceFactory = new ProvinceSource('030000') // init province id
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince)
          return [provinceFactory, cityFactory]
        },
        change(initValues: PickerData[]) {
          const initProv = initValues[0].id
          const initCity = initValues[1].id

          const provinceFactory = new ProvinceSource(initProv)
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince, initCity)

          changedTime++

          return [provinceFactory, cityFactory]
        }
      }
    })
    const scroller = picker.scrollers[0]

    scroller.scroll(2 * angleToRadian(scroller.intervalAngle) * scroller.radius)
    // after scroll intervalAngle, should change dataSource
    changedTime.should.be.equal(2)
  })

  it('options.pickedEvent=scrollEnd pick cascadable values when scroller emit scrollEnd event', () => {
    let changedTime = 0
    const picker = new Picker({
      el: document.createElement('div'),
      pickedEvent: 'scrollEnd',
      dataSourceFactory: {
        cascadable: true,
        create() {
          const provinceFactory = new ProvinceSource('030000') // init province id
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince)
          return [provinceFactory, cityFactory]
        },
        change(initValues: PickerData[]) {
          const initProv = initValues[0].id
          const initCity = initValues[1].id

          const provinceFactory = new ProvinceSource(initProv)
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince, initCity)

          changedTime++

          return [provinceFactory, cityFactory]
        }
      }
    })
    const scroller = picker.scrollers[0]

    scroller.scroll(-angleToRadian(scroller.intervalAngle) * scroller.radius)
    // after scroll intervalAngle, should not change dataSource
    changedTime.should.be.equal(0)
    scroller.scrollEnd()
    // after scrollEnd, should change dataSource
    changedTime.should.be.equal(1)
  })

  it('ensure button should be emit a ensure event, and callback current data', done => {
    const factory = new ProvinceSource()
    const picker = new Picker({
      el: document.createElement('div'),
      dataSourceFactory: {
        create() {
          return [factory]
        },
        change() {
          return [factory]
        }
      }
    })
    const initValue = factory.getInit()
    const scroller = picker.scrollers[0]
    const $ensure = getEle('[ref=picker-ensure]', picker.$root) as HTMLElement

    // 滚动一段距离
    scroller.scroll(-angleToRadian(scroller.intervalAngle) * scroller.radius)
    scroller.scrollEnd()
    const currValue = factory.getNext(initValue)
    chai.should().exist($ensure)
    picker.on('ensure', (data: PickerData[]) => {
      scroller.getValue().should.be.deep.equal(currValue)
      data.should.be.an('array').and.deep.include(currValue)
      done()
    })
    $ensure.click()
  })

  it('cancel button should be emit a cancel event, and reset the values', done => {
    const picker = new Picker({
      el: document.createElement('div'),
      dataSourceFactory: {
        create() {
          return [new ProvinceSource()]
        },
        change() {
          return [new ProvinceSource()]
        }
      }
    })
    const initValues = picker.getValues()
    const scroller = picker.scrollers[0]
    const $cancel = getEle('[ref=picker-cancel]', picker.$root) as HTMLElement

    // 滚动一段距离
    scroller.scroll(
      -angleToRadian(2 * scroller.intervalAngle) * scroller.radius
    )

    chai.should().exist($cancel)
    picker.on('cancel', () => {
      picker.getValues().should.be.deep.equal(initValues)
      scroller.getValue().should.be.deep.equal(initValues[0])
      done()
    })
    $cancel.click()
  })

  it('picker.getValues() return an array, and init value should be options.dataSourceFactory init value', () => {
    const picker = new Picker({
      el: document.createElement('div'),
      dataSourceFactory: {
        create() {
          const provinceFactory = new ProvinceSource()
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince)
          return [provinceFactory, cityFactory]
        },
        change(initValues: PickerData[]) {
          const initProv = initValues[0].id
          const initCity = initValues[1].id

          const provinceFactory = new ProvinceSource(initProv)
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince, initCity)
          return [provinceFactory, cityFactory]
        }
      }
    })
    picker
      .getValues()
      .should.be.an('array')
      .and.deep.equal([
        {
          id: '010000',
          value: '北京市',
          index: 0
        },
        {
          id: '010100',
          value: '西城区',
          index: 0
        }
      ])
  })

  it("picker.setValues() can set picker's value after created the picker", () => {
    const picker = new Picker({
      el: document.createElement('div'),
      dataSourceFactory: {
        create() {
          const provinceFactory = new ProvinceSource()
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince)
          return [provinceFactory, cityFactory]
        },
        change(initValues: PickerData[]) {
          const initProv = initValues[0].id
          const initCity = initValues[1].id

          const provinceFactory = new ProvinceSource(initProv)
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince, initCity)
          return [provinceFactory, cityFactory]
        }
      }
    })
    const scrollers = picker.scrollers
    const setValue: PickerData[] = [
      {
        id: '020000',
        value: '河南省',
        index: 1
      },
      {
        id: '020300',
        value: '洛阳市',
        index: 2
      }
    ]

    picker.setValues(setValue)
    picker.getValues().should.be.deep.equal(setValue)
    ;[scrollers[0].getValue(), scrollers[1].getValue()].should.be.deep.equal(
      setValue
    )
  })

  it('picker.scrollers can update in chain if the dataSourceFactory is cascadable', done => {
    const picker = new Picker({
      el: document.createElement('div'),
      radius: 200,
      intervalAngle: 15,
      dataSourceFactory: {
        cascadable: true,
        create() {
          const provinceFactory = new ProvinceSource()
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince)
          return [provinceFactory, cityFactory]
        },
        change(initValues: PickerData[]) {
          const initProv = initValues[0].id
          const initCity = initValues[1].id

          const provinceFactory = new ProvinceSource(initProv)
          const initProvince = provinceFactory.getInit().id
          const cityFactory = new CitySource(initProvince, initCity)
          return [provinceFactory, cityFactory]
        }
      }
    })
    const provinceScroller = picker.scrollers[0]
    provinceScroller.scroll(
      -angleToRadian(provinceScroller.intervalAngle) * provinceScroller.radius
    )
    provinceScroller.scrollEnd()

    const $ensure = getEle('[ref=picker-ensure]', picker.$root) as HTMLElement
    picker.on('ensure', (data: PickerData[]) => {
      console.log(data)
      data.should.be.an('array').and.deep.equal([
        {
          id: '020000',
          value: '河南省',
          index: 1
        },
        {
          id: '020100',
          value: '郑州市',
          index: 0
        }
      ])
      done()
    })
    $ensure.click()
  })
})
