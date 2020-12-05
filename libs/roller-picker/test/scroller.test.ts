import { Scroller, Indexable, Nullable } from '../src/index'
import { angleToRadian, createEle } from '../src/utils'
import { SimpleDataSource } from '../src/factory/simple'

const list: string[] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k']
const dataSource = new SimpleDataSource(list, { initIndex: 0 })

const $root = createEle('div')

describe('Scroller', () => {
  it('options.el should be a real element', () => {
    (() => {
      new Scroller({ el: '#none-el', dataSource })
    }).should.be.throw()
    ;(() => {
      new Scroller({ el: createEle('div'), dataSource })
    }).should.not.be.throw()
  })

  it('options.maxAngle has a default number value, should be greater than 0 and less than 90', () => {
    let scroller = new Scroller({
      el: $root,
      dataSource
    })

    scroller.maxAngle.should.be
      .an('number')
      .and.is.greaterThan(0)
      .and.is.lessThan(90)

    scroller = new Scroller({
      el: $root,
      dataSource,
      maxAngle: 0
    })

    scroller.maxAngle.should.be.greaterThan(0)

    scroller = new Scroller({
      el: $root,
      dataSource,
      maxAngle: 100
    })

    scroller.maxAngle.should.be.lessThan(90)
  })

  it('options.scaleRadio has a default number value', () => {
    const scroller = new Scroller({
      el: $root,
      dataSource
    })

    scroller.scaleRatio.should.be.an('number')
  })

  it('scroller.getValue() should be null when the dataSource return a null value', () => {
    const scroller = new Scroller({
      el: $root,
      dataSource: {
        getInit(): null {
          return null
        },
        getPrev() {
          return null
        },
        getNext() {
          return null
        },
        getText() {
          return ''
        }
      }
    })

    chai.should().not.exist(scroller.getValue())
  })

  it("scroller item angle's difference should be equal options.intervalAngle", () => {
    const intervalAngle = 15
    const scroller = new Scroller({
      el: $root,
      dataSource,
      intervalAngle,
      scaleRatio: 0.2
    })

    let item = scroller.firstItem

    while (item.next) {
      (item.angle - item.next.angle).should.be.equal(intervalAngle)
      item = item.next
    }
  })

  it("scroller item angle's should be less than options.maxAngle", () => {
    const maxAngle = 60
    const scroller = new Scroller({
      el: $root,
      dataSource,
      maxAngle
    })

    let item: Nullable<typeof scroller.firstItem> = scroller.firstItem
    while (item) {
      chai.expect(Math.abs(item.angle)).to.be.lessThan(maxAngle)
      item = item.next
    }
  })

  it('move down along y-axis, scroller should be get prev data', () => {
    const scroller = new Scroller<number>({
      el: $root,
      maxAngle: 40,
      intervalAngle: 15,
      // 初始值：3, 4, 5, 6, 7
      dataSource: {
        getInit() {
          return 5
        },
        getPrev(data) {
          if (data === null) return null
          return data - 1
        },
        getNext(data) {
          if (data === null) return null
          return data + 1
        },
        getText(data) {
          return data === null ? '' : String(data)
        }
      }
    })

    let y = 0
    let first = 3
    let last = 7
    let index = 10

    while (index--) {
      scroller.scroll(y)
      scroller.firstItem.data!.should.be.equal(first)
      scroller.lastItem.data!.should.be.equal(last)
      y = angleToRadian(scroller.intervalAngle) * scroller.radius
      first--
      last--
    }
  })

  it('move up along y-axis, scroller should be get next data', () => {
    const scroller = new Scroller<number>({
      el: $root,
      maxAngle: 40,
      intervalAngle: 15,
      // 初始值：3, 4, 5, 6, 7
      dataSource: {
        getInit() {
          return 5
        },
        getPrev(data) {
          if (data === null) return null
          return data - 1
        },
        getNext(data) {
          if (data === null) return null
          return data + 1
        },
        getText(data) {
          return data === null ? '' : String(data)
        }
      }
    })

    let y = 0
    let first = 3
    let last = 7
    let index = 10

    while (index--) {
      scroller.scroll(y)
      scroller.firstItem.data!.should.be.equal(first)
      scroller.lastItem.data!.should.be.equal(last)
      y = -angleToRadian(scroller.intervalAngle) * scroller.radius
      first++
      last++
    }
  })

  it('move cross over options.intervalAngle, emit change event.', () => {
    const initIndex = 3
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    const y = angleToRadian(scroller.intervalAngle) * scroller.radius
    scroller.scroll(y)
    scroller.getValue()!.should.be.deep.equal(dataSource.getPrev(initData))
    scroller.scroll(-y)
    scroller.getValue()!.should.be.deep.equal(initData)
  })

  it("conn't move down when there is no prev data", () => {
    const scroller = new Scroller({
      el: $root,
      dataSource
    })
    const currValue = scroller.getValue()

    let times = 0
    scroller.on('change', () => {
      times++
    })

    let index = 0
    while (index++ < 20) {
      scroller.scroll(30)
    }
    times.should.be.equal(0)
    scroller.getValue()!.should.be.deep.equal(currValue)
    console.log(scroller.firstItem)
  })

  it('move down to prev when end angle more than half options.intervalAngle, and has prev data.', done => {
    const initIndex = 3
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    const y = angleToRadian(scroller.intervalAngle / 2 + 1) * scroller.radius

    scroller.on('change', (data: Indexable<string>) => {
      data.should.be.deep.equal(dataSource.getPrev(initData))
      done()
    })
    scroller.scroll(y)
    scroller.scrollEnd()
  })

  it('move up to next when end angle more than half options.intervalAngle, and has next data.', done => {
    const initIndex = 3
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    const y = angleToRadian(scroller.intervalAngle / 2 + 1) * scroller.radius

    scroller.on('change', (data: Indexable<string>) => {
      data.should.be.deep.equal(dataSource.getNext(initData))
      done()
    })
    scroller.scroll(-y)
    scroller.scrollEnd()
  })

  it('move up back to current when end angle more than half options.intervalAngle, but has no prev data.', done => {
    const initIndex = 0
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    let index = 0
    while (index++ < 20) {
      scroller.scroll(30)
    }
    scroller.scrollEnd()

    setTimeout(() => {
      scroller.getValue()!.should.be.deep.equal(initData)
      done()
    }, 1500)
  })

  it('move down back to current when end angle more than half options.intervalAngle, but has no next data.', done => {
    const initIndex = list.length - 1
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    let index = 0
    while (index++ < 20) {
      scroller.scroll(-30)
    }
    scroller.scrollEnd()

    setTimeout(() => {
      scroller.getValue()!.should.be.deep.equal(initData)
      done()
    }, 1500)
  })

  it('move up back to current when end angle less than half options.intervalAngle', done => {
    const initIndex = 3
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    const y = angleToRadian(scroller.intervalAngle / 2 - 1) * scroller.radius
    scroller.scroll(y)
    scroller.scrollEnd()

    setTimeout(() => {
      scroller.getValue()!.should.be.deep.equal(initData)
      done()
    }, 1500)
  })

  it('move down back to current when end angle less than half options.intervalAngle', done => {
    const initIndex = list.length - 1
    const dataSource = new SimpleDataSource(list, { initIndex })
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const initData = dataSource.getInit()

    const y = angleToRadian(scroller.intervalAngle / 2 - 1) * scroller.radius
    scroller.scroll(-y)
    scroller.scrollEnd()

    setTimeout(() => {
      scroller.getValue()!.should.be.deep.equal(initData)
      done()
    }, 1500)
  })

  it('scroller.changeDataSource() can set a new data factory, and emit a change event', done => {
    let dataSource = new SimpleDataSource(list)
    const scroller = new Scroller({
      el: $root,
      maxAngle: 46,
      intervalAngle: 15,
      dataSource
    })
    const firstItemWrapper = scroller.firstItem.wrapper

    scroller.getValue()!.should.be.deep.equal(dataSource.getInit())
    dataSource = new SimpleDataSource(list, { initIndex: 5 })
    scroller.on('change', data => {
      // dom 元素复用
      scroller.firstItem.wrapper.should.be.equal(firstItemWrapper)
      // value 值更新
      data.should.be.deep.equal(dataSource.getInit())
      done()
    })
    scroller.changeDataSource(dataSource)
  })

  it('scroller can use any type of DataSource', () => {
    // a - z
    const strDataSource = {
      getInit() {
        return 'd'
      },
      getPrev(str: string | null) {
        if (str === null) return null
        const preChar = str.charCodeAt(0) - 1
        return preChar < 97 /* a */ ? null : String.fromCharCode(preChar)
      },
      getNext(str: string | null) {
        if (str === null) return null
        const preChar = str.charCodeAt(0) + 1
        return preChar > 122 /* z */ ? null : String.fromCharCode(preChar)
      },
      getText(str: string | null) {
        return str ?? ''
      }
    }
    // 0 - 9
    const numDataSource = {
      getInit() {
        return 5
      },
      getPrev(num: number | null) {
        if (num === null) return null
        return --num < 0 ? null : num
      },
      getNext(num: number | null) {
        if (num === null) return null
        return ++num > 9 ? null : num
      },
      getText(num: number | null) {
        return String(num) ?? ''
      }
    }

    const scroller1 = new Scroller({
      el: document.createElement('div'),
      dataSource: strDataSource
    })
    scroller1.getValue()!.should.be.equal('d')
    const scroller2 = new Scroller({
      el: document.createElement('div'),
      dataSource: numDataSource
    })
    scroller2.getValue()!.should.be.equal(5)
  })
})
