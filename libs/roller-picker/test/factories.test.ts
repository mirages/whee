import {
  SimpleDataSource,
  SimpleDataSourceFactory,
  CascadeDataSourceFactory
} from '../src/factory/simple'
import type { CascadeData, IdxCascadeData } from '../src'

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
describe('CascadeDataSourceFactory', () => {
  const cascadeData = [
    {
      id: 'a',
      text: 'a',
      children: [
        {
          id: 'a-1',
          text: 'a-1',
          children: [
            { id: 'a-1-1', text: 'a-1-1' },
            { id: 'a-1-2', text: 'a-1-2' },
            { id: 'a-1-3', text: 'a-1-3' },
            { id: 'a-1-4', text: 'a-1-4' }
          ]
        },
        {
          id: 'a-2',
          text: 'a-2',
          children: [
            { id: 'a-2-1', text: 'a-2-1' },
            { id: 'a-2-2', text: 'a-2-2' },
            { id: 'a-2-3', text: 'a-2-3' },
            { id: 'a-2-4', text: 'a-2-4' }
          ]
        },
        {
          id: 'a-3',
          text: 'a-3',
          children: [
            { id: 'a-3-1', text: 'a-3-1' },
            { id: 'a-3-2', text: 'a-3-2' },
            { id: 'a-3-3', text: 'a-3-3' },
            { id: 'a-3-4', text: 'a-3-4' }
          ]
        },
        {
          id: 'a-4',
          text: 'a-4',
          children: [
            { id: 'a-4-1', text: 'a-4-1' },
            { id: 'a-4-2', text: 'a-4-2' },
            { id: 'a-4-3', text: 'a-4-3' },
            { id: 'a-4-4', text: 'a-4-4' }
          ]
        }
      ]
    },
    {
      id: 'b',
      text: 'b',
      children: [
        {
          id: 'b-1',
          text: 'b-1',
          children: [
            { id: 'b-1-1', text: 'b-1-1' },
            { id: 'b-1-2', text: 'b-1-2' },
            { id: 'b-1-3', text: 'b-1-3' },
            { id: 'b-1-4', text: 'b-1-4' }
          ]
        },
        {
          id: 'b-2',
          text: 'b-2',
          children: [
            { id: 'b-2-1', text: 'b-2-1' },
            { id: 'b-2-2', text: 'b-2-2' },
            { id: 'b-2-3', text: 'b-2-3' },
            { id: 'b-2-4', text: 'b-2-4' }
          ]
        },
        {
          id: 'b-3',
          text: 'b-3',
          children: [
            { id: 'b-3-1', text: 'b-3-1' },
            { id: 'b-3-2', text: 'b-3-2' },
            { id: 'b-3-3', text: 'b-3-3' },
            { id: 'b-3-4', text: 'b-3-4' }
          ]
        },
        {
          id: 'b-4',
          text: 'b-4',
          children: [
            { id: 'b-4-1', text: 'b-4-1' },
            { id: 'b-4-2', text: 'b-4-2' },
            { id: 'b-4-3', text: 'b-4-3' },
            { id: 'b-4-4', text: 'b-4-4' }
          ]
        }
      ]
    },
    {
      id: 'c',
      text: 'c',
      children: [
        {
          id: 'c-1',
          text: 'c-1',
          children: [
            { id: 'c-1-1', text: 'c-1-1' },
            { id: 'c-1-2', text: 'c-1-2' },
            { id: 'c-1-3', text: 'c-1-3' },
            { id: 'c-1-4', text: 'c-1-4' }
          ]
        },
        {
          id: 'c-2',
          text: 'c-2',
          children: [
            { id: 'c-2-1', text: 'c-2-1' },
            { id: 'c-2-2', text: 'c-2-2' },
            { id: 'c-2-3', text: 'c-2-3' },
            { id: 'c-2-4', text: 'c-2-4' }
          ]
        },
        {
          id: 'c-3',
          text: 'c-3',
          children: [
            { id: 'c-3-1', text: 'c-3-1' },
            { id: 'c-3-2', text: 'c-3-2' },
            { id: 'c-3-3', text: 'c-3-3' },
            { id: 'c-3-4', text: 'c-3-4' }
          ]
        },
        {
          id: 'c-4',
          text: 'c-4',
          children: [
            { id: 'c-4-1', text: 'c-4-1' },
            { id: 'c-4-2', text: 'c-4-2' },
            { id: 'c-4-3', text: 'c-4-3' },
            { id: 'c-4-4', text: 'c-4-4' }
          ]
        }
      ]
    },
    {
      id: 'd',
      text: 'd',
      children: [
        {
          id: 'd-1',
          text: 'd-1',
          children: [
            { id: 'd-1-1', text: 'd-1-1' },
            { id: 'd-1-2', text: 'd-1-2' },
            { id: 'd-1-3', text: 'd-1-3' },
            { id: 'd-1-4', text: 'd-1-4' }
          ]
        },
        {
          id: 'd-2',
          text: 'd-2',
          children: [
            { id: 'd-2-1', text: 'd-2-1' },
            { id: 'd-2-2', text: 'd-2-2' },
            { id: 'd-2-3', text: 'd-2-3' },
            { id: 'd-2-4', text: 'd-2-4' }
          ]
        },
        {
          id: 'd-3',
          text: 'd-3',
          children: [
            { id: 'd-3-1', text: 'd-3-1' },
            { id: 'd-3-2', text: 'd-3-2' },
            { id: 'd-3-3', text: 'd-3-3' },
            { id: 'd-3-4', text: 'd-3-4' }
          ]
        },
        {
          id: 'd-4',
          text: 'd-4',
          children: [
            { id: 'd-4-1', text: 'd-4-1' },
            { id: 'd-4-2', text: 'd-4-2' },
            { id: 'd-4-3', text: 'd-4-3' },
            { id: 'd-4-4', text: 'd-4-4' }
          ]
        }
      ]
    }
  ]
  it('CascadeDataSourceFactory instance has cascadable property', () => {
    const dsFactory = new CascadeDataSourceFactory<{
      id: string
      text: string
    }>(cascadeData)
    dsFactory.cascadable.should.be.equal(true)
  })
  it('CascadeDataSourceFactory instance should be changed cascadable', () => {
    const dsFactory = new CascadeDataSourceFactory<{
      id: string
      text: string
    }>(cascadeData, [{ initIndex: 0 }, { initIndex: 1 }, { initIndex: 2 }])
    const dataSources = dsFactory.create()

    dataSources[0].getInit()!.should.be.deep.equal({
      index: 0,
      value: cascadeData[0]
    })
    dataSources[1].getInit()!.should.be.deep.equal({
      index: 1,
      value: cascadeData[0].children[1]
    })
    dataSources[2].getInit()!.should.be.deep.equal({
      index: 2,
      value: cascadeData[0].children[1].children[2]
    })

    dsFactory.change(
      [{ index: 1 }, { index: 2 }, { index: 3 }] as IdxCascadeData<{
        id: string
        text: string
      }>[],
      -1
    )

    dataSources[0].getInit()!.should.be.deep.equal({
      index: 1,
      value: cascadeData[1]
    })
    dataSources[1].getInit()!.should.be.deep.equal({
      index: 2,
      value: cascadeData[1].children[2]
    })
    dataSources[2].getInit()!.should.be.deep.equal({
      index: 3,
      value: cascadeData[1].children[2].children[3]
    })

    dsFactory.change(
      [null, { index: 3 }, { index: 2 }] as IdxCascadeData<{
        id: string
        text: string
      }>[],
      1
    )

    // dataSources[0] keep last change status
    dataSources[0].getInit()!.should.be.deep.equal({
      index: 1,
      value: cascadeData[1]
    })
    dataSources[1].getInit()!.should.be.deep.equal({
      index: 3,
      value: cascadeData[1].children[3]
    })
    dataSources[2].getInit()!.should.be.deep.equal({
      index: 2,
      value: cascadeData[1].children[3].children[2]
    })
  })
})
