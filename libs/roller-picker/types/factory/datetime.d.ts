import type { DataSource, DataSourceFactory } from './data'
export declare class DatetimeDataSourceFactory
  implements
    DataSourceFactory<{
      text: string
    }> {
  cascadable: boolean
  create(): DataSource<{
    text: string
  }>[]
  change(): DataSource<{
    text: string
  }>[]
}
