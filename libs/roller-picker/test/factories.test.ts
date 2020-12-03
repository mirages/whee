import {
  SimpleDataSource,
  SimpleDataSourceFactory
} from '../src/factory/simple'

describe('SimpleDataSource', () => {
  it('getInit() should be return the init data', () => {
    const data = [1, 2, 3]
    let initIndex = 0
    let dataSource = new SimpleDataSource(data)
    dataSource.getInit()!.should.be.deep.equal({
      index: initIndex,
      value: data[initIndex]
    })
    initIndex = -1
    dataSource = new SimpleDataSource(data, { initIndex })
    dataSource.getInit()!.should.be.deep.equal({
      index: 0,
      value: data[0]
    })
    initIndex = 2
    dataSource = new SimpleDataSource(data, { initIndex })
    dataSource.getInit()!.should.be.deep.equal({
      index: initIndex,
      value: data[initIndex]
    })
    initIndex = 3
    dataSource = new SimpleDataSource(data, { initIndex })
    dataSource.getInit()!.should.be.deep.equal({
      index: 0,
      value: data[0]
    })
  })
  it('getPrev() should be return the prev data', () => {
    const data = [1, 2, 3]
    const currIndex = 1
    const dataSource = new SimpleDataSource(data)
    dataSource
      .getPrev({
        index: currIndex,
        value: data[currIndex]
      })!
      .should.be.deep.equal({
        index: currIndex - 1,
        value: data[currIndex - 1]
      })
  })
  it('getPrev() should be return null when no prev data and not in loop mode', () => {
    const data = [1, 2, 3]
    const currIndex = 0
    const dataSource = new SimpleDataSource(data)
    chai
      .expect(
        dataSource.getPrev({
          index: currIndex,
          value: data[currIndex]
        })
      )
      .to.be.a('null')
    chai.expect(dataSource.getPrev(null)).to.be.a('null')
  })
  it('getPrev() should be return last data when in loop mode', () => {
    const data = [1, 2, 3]
    const currIndex = 0
    const dataSource = new SimpleDataSource(data, { loop: true })
    dataSource
      .getPrev({
        index: currIndex,
        value: data[currIndex]
      })!
      .should.be.deep.equal({
        index: 2,
        value: data[2]
      })
  })
  it('getNext() should be return next data', () => {
    const data = [1, 2, 3]
    const currIndex = 0
    const dataSource = new SimpleDataSource(data)
    dataSource
      .getNext({
        index: currIndex,
        value: data[currIndex]
      })!
      .should.be.deep.equal({
        index: currIndex + 1,
        value: data[currIndex + 1]
      })
  })
  it('getNext() should be return null when no next data and not in loop mode', () => {
    const data = [1, 2, 3]
    const currIndex = 2
    const dataSource = new SimpleDataSource(data)
    chai
      .expect(
        dataSource.getNext({
          index: currIndex,
          value: data[currIndex]
        })
      )
      .to.be.a('null')
    chai.expect(dataSource.getNext(null)).to.be.a('null')
  })
  it('getNext() should be return first data when in loop mode', () => {
    const data = [1, 2, 3]
    const currIndex = 2
    const dataSource = new SimpleDataSource(data, { loop: true })
    dataSource
      .getNext({
        index: currIndex,
        value: data[currIndex]
      })!
      .should.be.deep.equal({
        index: 0,
        value: data[0]
      })
  })
  it("getText() should be return the data's text value", () => {
    const data = [1, 2, 3]
    const currIndex = 2
    const dataSource = new SimpleDataSource(data, { loop: true })
    dataSource
      .getText({
        index: currIndex,
        value: data[currIndex]
      })
      .should.be.equal(String(data[currIndex]))
    dataSource.getText(null).should.be.equal('')

    const data2 = [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
    const currIndex2 = 2
    const dataSource2 = new SimpleDataSource(data2, { loop: true })
    dataSource2
      .getText({
        index: currIndex2,
        value: data2[currIndex2]
      })
      .should.be.equal(String(data2[currIndex2].text))
    dataSource2.getText(null).should.be.equal('')
  })
})
describe('SimpleDataSourceFactory', () => {
  it("simpleDataSourceFactory.create() should be return an list of SimpleDataSource's instance", () => {
    const factory = new SimpleDataSourceFactory([[1, 2, 3, 4]])
    const dataSource = factory.create()

    dataSource.should.be.an('array')
    dataSource[0].should.be.an.instanceOf(SimpleDataSource)
  })
  it('simpleDataSourceFactory.create() can also be set a init value', () => {
    const data = [{ text: 'a' }, { text: 'b' }, { text: 'c' }]
    let initIndex = 0
    const factory = new SimpleDataSourceFactory([data], [{ initIndex }])

    factory.create()[0].getInit()!.should.be.deep.equal({
      index: initIndex,
      value: data[initIndex]
    })
    initIndex = 1
    const initData = {
      index: initIndex,
      value: data[initIndex]
    }
    factory.change([initData])[0].getInit()!.should.be.deep.equal(initData)
  })
  it('SimpleDataSourceFactory can create non-cascade data source factory', () => {
    const data1 = [1, 2, 3, 4, 5, 6, 7]
    const data2 = ['a', 'b', 'c']
    const factory = new SimpleDataSourceFactory<string | number>(
      [data1, data2],
      [
        {
          initIndex: 3,
          loop: true
        },
        {
          initIndex: 1
        }
      ]
    )
    let [ds1, ds2] = factory.create()
    const ds1Init = ds1.getInit()
    const ds2Init = ds2.getInit()
    ds1Init!.should.be.deep.equal({
      index: 3,
      value: 4
    })
    ds2Init!.should.be.deep.equal({
      index: 1,
      value: 'b'
    })
    ;[ds1, ds2] = factory.change([ds1.getPrev(ds1Init), ds2.getNext(ds2Init)])
    ds1.getInit()!.should.be.deep.equal({
      index: 2,
      value: 3
    })
    ds2.getInit()!.should.be.deep.equal({
      index: 2,
      value: 'c'
    })
  })
})
