# sroller-picker

移动端 `js` 滚动选择器控件。支持单列、多列选择，以及多列级联选择。

## Picker

选择器，由 `Scroller` 组成，每一列都是一个单独的 `Scroller` 实例。

> 注意：在选择期间 `picker` 真实选择的 `values` 值是不发生变化的。期间选择的状态值保存在内部一个临时数组中，只有在点击 "确认" 按钮之后才会更新该值（更新选择状态），同样在点击 "取消" 按钮之后会回到上一次选择的状态。

### 用法

```js
import { Picker } from 'scroller-picker'

const picker = new Picker({
  /* PickerOpts */
})
```

### 选项

```js
interface PickerOpts<T> {
  el: HTMLElement | string
  radius?: number
  maxAngle?: number
  scaleRatio?: number
  intervalAngle?: number
  dataSourceFactory: DataSourceFactory<T>
  title?: string
  pickedEvent?: 'change' | 'scrollEnd'
  styles?: {
    picker?: string
    head?: string
    body?: string
    foot?: string
    title?: string
    ensure?: string
    cancel?: string
    scroller?: string
    item?: string
    mask?: string
  }
}
```

- `el<HTMLElement|string>` - 必选，指定挂载 `picker` 的 `dom` 元素。

- `dataSourceFactory<DataSourceFactory>` - 必选，指定 `picker` 的数据源工厂，用于创建供用户选择的数据项。

  ```js
  interface DataSourceFactory<T> {
    // 数据列之间是否是级联的
    readonly cascadable?: boolean
    // 初始创建每列(scroller)的数据源(dataSource)
    create: () => DataSource<T>[]
    // 当第 index 列的值变化时，触发该回调
    // 当 index === -1, 则表示需要重新创建每列的数据源
    change: (values: T[], index: number) => DataSource<T>[]
  }
  ```

- `radius`、`maxAngle`、`scaleRatio`、`intervalAngle` - 可选，参考 [ScrollerOptions](#ScrollerOptions)。
- `title<string>` - 可选，设置 `picker` 的标题。
- `pickedEvent<'change'|'scrollEnd'>` - 可选，设置 `picker` 触发数据更新的时机，**只针对级联数据**：
  - `'change'` - `scroller` 值发生变化时触发后续级联数据更新。
  - `'scrollEnd'` - `scroller` 滚动结束后触发后续级联数据更新。
- `styles` - 可选，指定 `picker` 和 `scroller` 的部分样式。

### 方法

#### `picker.getValues()`

获取当前选中的值。返回一个数组，每个元素对应每列的值。

_注意：单列数据也是返回一个数组，只是该数组只有一个元素。_

#### `picker.setValues(values)`

设置当前选中的值。参数 `values` 是一个数组，表示每一列的值，格式需跟 `picker.getValues()` 方法的返回值一致。

_注意：单列数据也需要传入一个数组。_

### 事件

#### `cancel`

“取消” 按钮的点击事件，取消选择。

```js
picker.on('cancel', () => { ... })
```

#### `ensure`

“确认” 按钮的点击事件，确认选择。

```js
picker.on('ensure', values => {})
```

## Scroller

滚动器，是选择器 `picker` 的基础部件。用于进行滚动和数据展示工作。

### 用法

```js
import { Scroller } from 'scroller-picker'

const scroller = new Scroller({
  /* ScrollerOpts */
})
```

### <a name="ScrollerOptions">选项</a>

```js
interface ScrollerOpts<T> {
  el: HTMLElement | string
  dataSource: DataSource<T>
  radius?: number
  scaleRatio?: number
  intervalAngle?: number
  maxAngle?: number
  styles?: StylesOpts
}
```

- `el<HTMLElement|string>` - 必选，挂载 `Scroller` 实例的元素。

- `dataSource<DataSource>` - 必选，`scroller` 展示数据项的数据源，主要用于动态产出数据。

  ```js
  interface DataSource<T> {
    // 获取初始展示数据
    getInit: () => T
    // 获取指定数据 param 的前一项数据
    getPrev: (param: Nullable<T>) => Nullable<T>
    // 获取指定数据 param 的后一项数据
    getNext: (param: Nullable<T>) => Nullable<T>
    // 获取指定数据 param 的文本展示形式
    getText: (param: Nullable<T>) => string
  }
  ```

- `radius<number>` - 可选，`scroller` 的滚动半径，默认值为 `140`。

- `scaleRatio<number>` - 可选，`scroller` 的缩放比率，取值范围 `0 ~ 1`，默认值为 `0.5`。

- `intervalAngle<number>` - 可选，`scroller` 数据项之间的角度间隔，默认值为 `18`。

- `maxAngle<number>` - 可选，`scroller` 数据项的最大角度，默认值为 `60`。

- `styles<StylesOpts>` - 可选，自定义 `scroller` 的部分样式。通常需要配合上面的选项调整样式。

  ```js
  interface StylesOpts {
    // 定义轮廓样式，例如高度等
    scroller?: string
    // 定义遮罩样式
    mask?: string
    // 定义数据项展示样式
    item?: string
  }
  ```

> intervalAngle=18 和 maxAngle=60 可定义展示数据项的个数：`2 * Math.floor(60 / 18) + 1 = 7`。

### 方法

#### `scroller.scroll(distance: number)`

让 `scroller` 滚动指定的距离。`distance < 0` 向上滚动；`distance > 0` 向下滚动。

#### `scroller.scrollEnd()`

让 `scroller` 停止滚动。并自动调整 `scroller` 数据项的最终显示位置。

#### `scroller.getValue()`

获取 `scroller` 当前指示的值。

### 事件

#### `change`

`scroller` 值发生变化时触发该事件。

```js
scroller.on('change', value => { ... })
```

#### `scrollEnd`

`scroller` 停止滚动后触发该事件。

```js
scroller.on('scrollEnd', vaule => { ... })
```

### 示例

```js
import { Scroller } from 'scroller-picker'

const initIndex = 3
const data = ['a', 'b', 'c', 'd', 'e', 'f', 'g']
const dataSource = {
  getInit() {
    return initIndex
  },
  getPrev(index) {
    return index === null || index < 0 ? null : index - 1
  },
  getNext(index) {
    return index === null || index > data.length - 1 ? null : index + 1
  },
  getText(index) {
    return index === null ? '' : data[index]
  }
}
const scroller = new Scroller({
  el: '#target',
  dataSource
})

// 监听 change 事件
scroller.on('change', value => {
  // ...
})
// 监听 scrollEnd 事件
scroller.on('scrollEnd', value => {
  // ...
})

// scroller.scroll(10)  ---> 滚动 10px 的距离
// scroller.scrollEnd() ---> 停止滚动，调整最终位置
```
