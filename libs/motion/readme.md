# Motion
[![Build Status](https://travis-ci.com/mirages/motion.svg?branch=master)](https://travis-ci.com/mirages/motion) [![codecov](https://codecov.io/gh/mirages/motion/branch/master/graph/badge.svg?token=ZM4K1Q670O)](https://codecov.io/gh/mirages/motion/branch/master)

移动端触摸滑动工具，自动根据传入目标元素的 `touchstart, touchmove, touchend` 事件计算滑动距离，以及触摸事件结束后的惯性滑动；也可以手动传入相关事件来计算滑动距离。

## 用法
```
import Motion from 'js-motion'

const Mode = Motion.Mode
const Direction = Motion.Direction
const motion = new Motion({
  target: '#target',
  mode: Mode.realtime,
  direction: Direction.xy
})

motion.touchmove(({ x, y }, e) => {
  // x 是水平方向的移动距离
  // y 是垂直方向的移动距离
  // e 是 '#target' 元素的原生 touchmove 事件
})
motion.touchend(({ x, y }, e) => {
  // x 是水平方向的惯性移动距离
  // y 是垂直方向的惯性移动距离
  // e 是 '#target' 元素的原生 touchend 事件
})
```

### Mode
`touchmove` 的执行模式：

- `Mode.realtime` - 实时模式：

  即每一次  `touchmove` 事件进行处理计算滑动距离。

- `Mode.frame` - 帧模式：

  即一帧内的多个 `touchmove` 事件合并，进行一次处理，计算总的滑动距离。

### Direction
`motion` 监听的移动方向：

- `Direction.x` - 只监听水平方向的移动：

  只计算水平方向的移动距离，垂直方向的移动距离始终为 0。

- `Direction.y` - 只监听垂直方向的移动。

  只计算垂直方向的移动距离，水平方向的移动距离始终为 0。

- `Direction.xy` - 同时监听水平和垂直方向的移动。

  同时计算水平和垂直两个方向的移动距离。

### Motion

```js
const motion = new Motion(options)
```

实例化时指定 `options.target` 选项，被动监听 `motion.touch`

#### `options`

- `options.target` - 需要监听触摸事件的目标元素，可选。
- `options.mode` - 指定 `touchmove` 的执行模式，默认为 `Mode.realtime`。
- `options.direction` - 指定监听的移动方向，默认为 `Direction.xy`。

#### `motion.touchstart(cb)`

监听 `options.target` 的 `touchstart` 操作，并将 `touchstart` 事件回调。

```js
motion.touchstart(e => {
  // e 是 options.target 的 touchstart 事件
})
```

#### `motion.touchmove(cb)`

监听 `options.target` 的 `touchmove` 操作，并将滑动距离和 `touchmove` 事件回调。

- `options.direction=Direction.x` 时，

```js
motion.touchmove(({ x, y }, e) => {
  // x 是水平方向的移动距离
  // y 是垂直方向的移动距离
  // e 是 options.target 元素的原生 touchmove 事件
})
```

#### `motion.touchend(cb)`

监听 `options.target` 的 `touchend` 操作，并将需要惯性滑动的距离和 `touchend` 事件进行回调。

回调的滑动距离为 `0`  时则表示滑动停止：

- `options.direction=Direction.x` - 回调距离分量 `x` 为 `0` 时，表示滑动停止
- `options.direction=Direction.y` - 回调距离分量 `y` 为 `0` 时，表示滑动停止
- `options.direction=Direction.xy` - 回调距离分量 `x` 和 `y` 都为 `0` 时，表示滑动停止

*注意：如果不需要惯性滑动，只会触发一次回调；如果发生惯性滑动，则会进行多次回调，直到滑动停止。*

```js
motion.touchend(({ x, y }, e) => {
  // x 是水平方向的惯性移动距离
  // y 是垂直方向的惯性移动距离
  // e 是 options.target 元素的原生 touchend 事件
})
```

#### `motion.start(e)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchstart` 事件，告诉 `motion` 实例滑动操作即将开始。

```js
const target = document.querySelector('#target')

target.addEventListener('touchstart', e => {
  motion.start(e) // 主动传入 touchstart 事件
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

#### `motion.move(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchmove` 事件，告诉 `motion` 实例滑动操作正在进行。

```js
const target = document.querySelector('#target')

target.addEventListener('touchmove', e => {
  // 主动传入 touchmove 事件
  motion.move(e, ({ x, y }) => {
    // 回调滑动距离
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

#### `motion.end(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchend` 事件，告诉 `motion` 实例滑动操作已经结束。

```js
const target = document.querySelector('#target')

target.addEventListener('touchend', e => {
  // 主动传入 touchend 事件
  motion.end(e, ({ x, y }) => {
    // 回调惯性滑动距离
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

