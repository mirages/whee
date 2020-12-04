import { Scroller, Indexable } from '../src/index'
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

    const items = scroller.items
    const len = items.length
    let i = 0
    while (i++ < len - 2) {
      (items[i].angle - items[i + 1].angle).should.be.equal(intervalAngle)
    }
  })

  it("scroller item angle's should be less than options.maxAngle", () => {
    const maxAngle = 60
    const scroller = new Scroller({
      el: $root,
      dataSource,
      maxAngle
    })

    scroller.items[0].angle.should.be.lessThan(maxAngle)
  })

  it("move down along y-axis, scroller item's angle should be reduce", () => {
    const scroller = new Scroller({
      el: $root,
      dataSource
    })

    const prevAngle = scroller.items[0].angle
    scroller.scroll(5)
    scroller.items[0].angle.should.be.lessThan(prevAngle)
  })

  it("move up along y-axis, scroller item's angle should be increase", () => {
    const scroller = new Scroller({
      el: $root,
      dataSource
    })

    const prevAngle = scroller.items[0].angle
    scroller.scroll(-5)
    scroller.items[0].angle.should.be.greaterThan(prevAngle)
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
    console.log(scroller.items)
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
    const firstItemWrapper = scroller.items[0].wrapper

    scroller.getValue()!.should.be.deep.equal(dataSource.getInit())
    dataSource = new SimpleDataSource(list, { initIndex: 5 })
    scroller.on('change', data => {
      // dom 元素复用
      scroller.items[0].wrapper.should.be.equal(firstItemWrapper)
      // value 值更新
      data.should.be.deep.equal(dataSource.getInit())
      done()
    })
    scroller.changeDataSource(dataSource)
  })
})
