import { DatetimeDataSourceFactory } from '../src/factory/datetime'

describe('DaatetimeDataSourceFactory', () => {
  it('options.initData can be set the init show date', () => {
    const initDate = new Date(2020, 9, 10)
    const factory = new DatetimeDataSourceFactory({
      initDate
    })

    const [years, months, days] = factory.create()

    years.getInit()!.should.be.equal(initDate.getFullYear())
    months.getInit()!.should.be.equal(initDate.getMonth())
    days.getInit()!.should.be.equal(initDate.getDate())
  })

  it('options.initData default value is now date', () => {
    const factory = new DatetimeDataSourceFactory()
    const now = new Date()
    const [years, months, days] = factory.create()

    years.getInit()!.should.be.equal(now.getFullYear())
    months.getInit()!.should.be.equal(now.getMonth())
    days.getInit()!.should.be.equal(now.getDate())
  })

  it('options.maxDate can be set the max date', () => {
    const initDate = new Date(2020, 9, 10)
    const maxDate = new Date(2030, 8, 25)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      maxDate
    })

    const [years, months, days] = factory.create()

    let maxYear = years.getInit()
    let next = maxYear
    while ((next = years.getNext(next))) {
      maxYear = next
    }
    maxYear!.should.be.equal(maxDate.getFullYear())

    factory.change([maxYear, 0, 1], 0)
    let maxMonth = (next = months.getInit())
    while ((next = months.getNext(next))) {
      maxMonth = next
    }
    maxMonth!.should.be.equal(maxDate.getMonth())

    factory.change([maxYear, maxMonth, 1], 0)
    let maxDay = (next = days.getInit())
    while ((next = days.getNext(next))) {
      maxDay = next
    }
    maxDay!.should.be.equal(maxDate.getDate())
  })

  it('options.minDate can be set the min date', () => {
    const initDate = new Date(2020, 9, 10)
    const minDate = new Date(2010, 8, 25)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      minDate
    })

    const [years, months, days] = factory.create()

    let minYear = years.getInit()
    let next = minYear
    while ((next = years.getPrev(next))) {
      minYear = next
    }
    minYear!.should.be.equal(minDate.getFullYear())

    factory.change([minYear, 0, 1], 0)
    let minMonth = (next = months.getInit())
    while ((next = months.getPrev(next))) {
      minMonth = next
    }
    minMonth!.should.be.equal(minDate.getMonth())

    factory.change([minYear, minMonth, 1], 0)
    let minDay = (next = days.getInit())
    while ((next = days.getPrev(next))) {
      minDay = next
    }
    minDay!.should.be.equal(minDate.getDate())
  })

  it('options.minDate should not be greater than options.maxDate', () => {
    (() => {
      new DatetimeDataSourceFactory({
        minDate: new Date(2010, 0, 2, 0, 0, 0),
        maxDate: new Date(2010, 0, 1, 0, 0, 0)
      })
    }).should.be.throw()
  })

  it('options.initDate should be options.minDate when options.initDate less than options.minDate', () => {
    const factory = new DatetimeDataSourceFactory({
      minDate: new Date(2010, 0, 2, 0, 0, 0),
      initDate: new Date(2010, 0, 1, 0, 0, 0)
    })
    factory.initDate.should.be.deep.equal([2010, 0, 2, 0, 0, 0])
  })

  it('options.initDate should be options.maxDate when options.initDate greater than options.maxDate', () => {
    const factory = new DatetimeDataSourceFactory({
      initDate: new Date(2010, 0, 2, 0, 0, 0),
      maxDate: new Date(2010, 0, 1, 0, 0, 0)
    })
    factory.initDate.should.be.deep.equal([2010, 0, 1, 0, 0, 0])
  })
})
