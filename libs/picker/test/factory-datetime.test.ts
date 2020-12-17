import { Nullable } from '../src'
import { DatetimeDataSourceFactory, DATETYPE } from '../src/factory/datetime'

describe('DatetimeDataSourceFactory', () => {
  it('options.initDate can be set the init show date', () => {
    const initDate = new Date(2020, 9, 10)
    const factory = new DatetimeDataSourceFactory({
      initDate
    })

    const [years, months, days] = factory.create()

    years.getInit().should.be.equal(initDate.getFullYear())
    months.getInit().should.be.equal(initDate.getMonth())
    days.getInit().should.be.equal(initDate.getDate())
  })

  it('options.initDate default value is now date', () => {
    const factory = new DatetimeDataSourceFactory()
    const now = new Date()
    const [years, months, days] = factory.create()

    years.getInit().should.be.equal(now.getFullYear())
    months.getInit().should.be.equal(now.getMonth())
    days.getInit().should.be.equal(now.getDate())
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
    let next: Nullable<typeof maxYear> = maxYear
    while ((next = years.getNext(next))) {
      maxYear = next
    }
    maxYear.should.be.equal(maxDate.getFullYear())

    factory.change([maxYear, 0, 1], 0)
    let maxMonth = (next = months.getInit())
    while ((next = months.getNext(next))) {
      maxMonth = next
    }
    maxMonth.should.be.equal(maxDate.getMonth())

    factory.change([maxYear, maxMonth, 1], 0)
    let maxDay = (next = days.getInit())
    while ((next = days.getNext(next))) {
      maxDay = next
    }
    maxDay.should.be.equal(maxDate.getDate())
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
    let next: Nullable<typeof minYear> = minYear
    while ((next = years.getPrev(next))) {
      minYear = next
    }
    minYear.should.be.equal(minDate.getFullYear())

    factory.change([minYear, 0, 1], 0)
    let minMonth = (next = months.getInit())
    while ((next = months.getPrev(next))) {
      minMonth = next
    }
    minMonth.should.be.equal(minDate.getMonth())

    factory.change([minYear, minMonth, 1], 0)
    let minDay = (next = days.getInit())
    while ((next = days.getPrev(next))) {
      minDay = next
    }
    minDay.should.be.equal(minDate.getDate())
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

  it('options.loop=true can set scroller scroll circularly', () => {
    const factory = new DatetimeDataSourceFactory({
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2020, 11, 31),
      loop: true
    })
    const [years] = factory.create()
    let init: number

    init = years.getInit()
    years.getNext(init)!.should.be.equal(2010)

    factory.change([2010, 0, 1], -1)
    init = years.getInit()
    console.log(init)
    years.getPrev(init)!.should.be.equal(2020)
  })

  it('options.loop=false scroller cannot scroll circularly', () => {
    const factory = new DatetimeDataSourceFactory({
      minDate: new Date(2010, 0, 1),
      maxDate: new Date(2020, 11, 31)
    })
    const [years] = factory.create()
    let init: number

    init = years.getInit()
    chai.expect(years.getNext(init)).to.be.equal(null)
    chai.expect(years.getNext(null)).to.be.equal(null)

    factory.change([2010, 0, 1], -1)
    init = years.getInit()
    console.log(init)
    chai.expect(years.getPrev(init)).to.be.equal(null)
    chai.expect(years.getPrev(null)).to.be.equal(null)
  })

  it('options.units can be set data unit', () => {
    const factory = new DatetimeDataSourceFactory({
      initDate: new Date(2020, 2, 2, 10, 23, 30),
      type: DATETYPE.yyyyMMddHHmmss
    })
    const [years, months, days, hours, minutes, seconds] = factory.create()

    // default units
    years.getText(2020).should.be.equal('2020年')
    months.getText(2).should.be.equal('03月')
    days.getText(2).should.be.equal('02日')
    hours.getText(10).should.be.equal('10时')
    minutes.getText(23).should.be.equal('23分')
    seconds.getText(30).should.be.equal('30秒')

    const factory2 = new DatetimeDataSourceFactory({
      initDate: new Date(2020, 2, 2, 10, 23, 30),
      type: DATETYPE.ddHHmm,
      units: ['d', 'h', 'm']
    })
    const [days2, hours2, minutes2] = factory2.create()
    days2.getText(2).should.be.equal('02d')
    hours2.getText(10).should.be.equal('10h')
    minutes2.getText(23).should.be.equal('23m')
  })

  it('options.type=DATETYEP.yyyy should be select the year data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyy
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
  })

  it('options.type=DATETYEP.yyyyMM should be select the year-month data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyyMM
    })
    const sources = factory.create()

    sources.length.should.be.equal(2)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
    sources[1].getInit().should.be.equal(initDate.getMonth())
  })

  it('options.type=DATETYEP.yyyyMMdd should be select the year-month-day data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyyMMdd
    })
    const sources = factory.create()

    sources.length.should.be.equal(3)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
    sources[1].getInit().should.be.equal(initDate.getMonth())
    sources[2].getInit().should.be.equal(initDate.getDate())
  })

  it('options.type=DATETYEP.yyyyMMddHH should be select the year-month-day-hour data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyyMMddHH
    })
    const sources = factory.create()

    sources.length.should.be.equal(4)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
    sources[1].getInit().should.be.equal(initDate.getMonth())
    sources[2].getInit().should.be.equal(initDate.getDate())
    sources[3].getInit().should.be.equal(initDate.getHours())
  })

  it('options.type=DATETYEP.yyyyMMddHHmm should be select the year-month-day-hour-minute data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyyMMddHHmm
    })
    const sources = factory.create()

    sources.length.should.be.equal(5)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
    sources[1].getInit().should.be.equal(initDate.getMonth())
    sources[2].getInit().should.be.equal(initDate.getDate())
    sources[3].getInit().should.be.equal(initDate.getHours())
    sources[4].getInit().should.be.equal(initDate.getMinutes())
  })

  it('options.type=DATETYEP.yyyyMMddHHmmss should be select the year-month-day-hour-minute-second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.yyyyMMddHHmmss
    })
    const sources = factory.create()

    sources.length.should.be.equal(6)
    sources[0].getInit().should.be.equal(initDate.getFullYear())
    sources[1].getInit().should.be.equal(initDate.getMonth())
    sources[2].getInit().should.be.equal(initDate.getDate())
    sources[3].getInit().should.be.equal(initDate.getHours())
    sources[4].getInit().should.be.equal(initDate.getMinutes())
    sources[5].getInit().should.be.equal(initDate.getSeconds())
  })

  it('options.type=DATETYEP.MM should be select the month data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.MM
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getMonth())
  })

  it('options.type=DATETYEP.MMdd should be select the month-day data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.MMdd
    })
    const sources = factory.create()

    sources.length.should.be.equal(2)
    sources[0].getInit().should.be.equal(initDate.getMonth())
    sources[1].getInit().should.be.equal(initDate.getDate())
  })

  it('options.type=DATETYEP.MMddHH should be select the month-day-hour data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.MMddHH
    })
    const sources = factory.create()

    sources.length.should.be.equal(3)
    sources[0].getInit().should.be.equal(initDate.getMonth())
    sources[1].getInit().should.be.equal(initDate.getDate())
    sources[2].getInit().should.be.equal(initDate.getHours())
  })

  it('options.type=DATETYEP.MMddHHmm should be select the month-day-hour-minute data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.MMddHHmm
    })
    const sources = factory.create()

    sources.length.should.be.equal(4)
    sources[0].getInit().should.be.equal(initDate.getMonth())
    sources[1].getInit().should.be.equal(initDate.getDate())
    sources[2].getInit().should.be.equal(initDate.getHours())
    sources[3].getInit().should.be.equal(initDate.getMinutes())
  })

  it('options.type=DATETYEP.MMddHHmmss should be select the month-day-hour-minute-second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.MMddHHmmss
    })
    const sources = factory.create()

    sources.length.should.be.equal(5)
    sources[0].getInit().should.be.equal(initDate.getMonth())
    sources[1].getInit().should.be.equal(initDate.getDate())
    sources[2].getInit().should.be.equal(initDate.getHours())
    sources[3].getInit().should.be.equal(initDate.getMinutes())
    sources[4].getInit().should.be.equal(initDate.getSeconds())
  })

  it('options.type=DATETYEP.dd should be select the day data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.dd
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getDate())
  })

  it('options.type=DATETYEP.ddHH should be select the day-hour data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.ddHH
    })
    const sources = factory.create()

    sources.length.should.be.equal(2)
    sources[0].getInit().should.be.equal(initDate.getDate())
    sources[1].getInit().should.be.equal(initDate.getHours())
  })

  it('options.type=DATETYEP.ddHHmm should be select the day-hour-minute data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.ddHHmm
    })
    const sources = factory.create()

    sources.length.should.be.equal(3)
    sources[0].getInit().should.be.equal(initDate.getDate())
    sources[1].getInit().should.be.equal(initDate.getHours())
    sources[2].getInit().should.be.equal(initDate.getMinutes())
  })

  it('options.type=DATETYEP.ddHHmmss should be select the day-hour-minute-second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.ddHHmmss
    })
    const sources = factory.create()

    sources.length.should.be.equal(4)
    sources[0].getInit().should.be.equal(initDate.getDate())
    sources[1].getInit().should.be.equal(initDate.getHours())
    sources[2].getInit().should.be.equal(initDate.getMinutes())
    sources[3].getInit().should.be.equal(initDate.getSeconds())
  })

  it('options.type=DATETYEP.HH should be select the hour data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.HH
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getHours())
  })

  it('options.type=DATETYEP.HHmm should be select the hour-minute data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.HHmm
    })
    const sources = factory.create()

    sources.length.should.be.equal(2)
    sources[0].getInit().should.be.equal(initDate.getHours())
    sources[1].getInit().should.be.equal(initDate.getMinutes())
  })

  it('options.type=DATETYEP.HHmmss should be select the hour-minute-second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.HHmmss
    })
    const sources = factory.create()

    sources.length.should.be.equal(3)
    sources[0].getInit().should.be.equal(initDate.getHours())
    sources[1].getInit().should.be.equal(initDate.getMinutes())
    sources[2].getInit().should.be.equal(initDate.getSeconds())
  })

  it('options.type=DATETYEP.mm should be select the minute data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.mm
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getMinutes())
  })

  it('options.type=DATETYEP.mmss should be select the minute-second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.mmss
    })
    const sources = factory.create()

    sources.length.should.be.equal(2)
    sources[0].getInit().should.be.equal(initDate.getMinutes())
    sources[1].getInit().should.be.equal(initDate.getSeconds())
  })

  it('options.type=DATETYEP.ss should be select the second data', () => {
    const initDate = new Date(2010, 2, 20, 6, 23, 54)
    const factory = new DatetimeDataSourceFactory({
      initDate,
      type: DATETYPE.ss
    })
    const sources = factory.create()

    sources.length.should.be.equal(1)
    sources[0].getInit().should.be.equal(initDate.getSeconds())
  })

  it('DatetimeDataSourceFactory should be fix show values when scroller data change', () => {
    const maxDate = new Date(2020, 5, 10)
    const minDate = new Date(2018, 7, 20)
    const initDate = new Date(2019, 6, 15)
    const factory = new DatetimeDataSourceFactory({
      maxDate,
      initDate,
      minDate
    })

    const [years, months, days] = factory.create()

    years.getInit().should.be.equal(initDate.getFullYear())
    months.getInit().should.be.equal(initDate.getMonth())
    days.getInit().should.be.equal(initDate.getDate())

    factory.change([2020, 6, 15], 0)
    months.getInit().should.be.equal(maxDate.getMonth())
    days.getInit().should.be.equal(maxDate.getDate())

    factory.change([2018, 6, 15], 0)
    months.getInit().should.be.equal(minDate.getMonth())
    days.getInit().should.be.equal(minDate.getDate())
  })
})
