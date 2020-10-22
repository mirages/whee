# Motion
[![Build Status](https://travis-ci.com/mirages/motion.svg?branch=master)](https://travis-ci.com/mirages/motion) [![codecov](https://codecov.io/gh/mirages/motion/branch/master/graph/badge.svg?token=ZM4K1Q670O)](https://codecov.io/gh/mirages/motion/branch/master)

移动端触摸滑动工具，自动根据传入目标元素的 `touchstart, touchmove, touchend` 事件计算滑动距离，以及触摸事件结束后的惯性滑动；也可以手动传入相关事件来计算滑动距离。

## 使用

```shell
npm install js-motion
```
监听传入 `target` 元素的触摸滑动情况：

```js
import Motion from 'js-motion'

const Mode = Motion.Mode
const Direction = Motion.Direction
const motion = new Motion({
  target: '#target',
  mode: Mode.realtime,
  direction: Direction.xy
})

motion.onTouchstart(e => {
  // ...
})
motion.onTouchmove(({ x, y }, e) => {
  // ...
})
motion.onTouchend(({ x, y }, e) => {
  // ...
})
```

手动传入相关触摸事件，计算触摸滑动情况：

```js
import Motion from 'js-motion'

const Mode = Motion.Mode
const Direction = Motion.Direction
const motion = new Motion({
  mode: Mode.realtime,
  direction: Direction.xy
})
const target = document.querySelector('#target')

target.addEventListener('touchstart', e => {
  motion.touchstart(e)
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)

target.addEventListener('touchmove', e => {
  motion.touchmove(e, ({ x, y }) => {
    // ...
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)

target.addEventListener('touchend', e => {
  motion.touchend(e, ({ x, y }) => {
    // ...
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
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

#### `motion.onTouchstart(cb)`

监听 `options.target` 的 `touchstart` 操作，并将 `touchstart` 事件回调。

```js
motion.onTouchstart(e => {
  // e 是 options.target 的 touchstart 事件
})
```

#### `motion.onTouchmove(cb)`

监听 `options.target` 的 `touchmove` 操作，并将滑动距离和 `touchmove` 事件回调。

```js
motion.onTouchmove(({ x, y }, e) => {
  // x 是水平方向的移动距离
  // y 是垂直方向的移动距离
  // e 是 options.target 元素的原生 touchmove 事件
})
```

#### `motion.onTouchend(cb)`

监听 `options.target` 的 `touchend` 操作，并将需要惯性滑动的距离和 `touchend` 事件进行回调。

回调的滑动距离为 `0`  时则表示滑动停止：

- `options.direction=Direction.x` - 回调惯性滑动距离分量 `x` 为 `0` 时，表示惯性滑动停止
- `options.direction=Direction.y` - 回调惯性滑动距离分量 `y` 为 `0` 时，表示惯性滑动停止
- `options.direction=Direction.xy` - 回调惯性滑动距离分量 `x` 和 `y` 都为 `0` 时，表示惯性滑动停止

*注意：如果没触发惯性滑动，只会触发一次回调；如果触发惯性滑动，则会进行多次回调，直到滑动停止。*

```js
motion.onTouchend(({ x, y }, e) => {
  // x 是水平方向的惯性移动距离
  // y 是垂直方向的惯性移动距离
  // e 是 options.target 元素的原生 touchend 事件
})
```

#### `motion.touchstart(e)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchstart` 事件，告诉 `motion` 实例滑动操作即将开始。

```js
const target = document.querySelector('#target')

target.addEventListener('touchstart', e => {
  // 主动传入 touchstart 事件，触摸开始
  motion.touchstart(e)
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

*注意：在调用 `motion.touchmove()` 之前始终需要先调用一次 `motion.touchstart()`，保证 `motion` 可以正确计算开始触摸的位置。*

#### `motion.touchmove(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchmove` 事件，告诉 `motion` 实例滑动操作正在进行。

```js
const target = document.querySelector('#target')

target.addEventListener('touchmove', e => {
  // 主动传入 touchmove 事件，正在滑动
  motion.touchmove(e, ({ x, y }) => {
    // x 是水平方向的滑动距离
    // y 是垂直方向的滑动距离
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

#### `motion.touchend(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchend` 事件，告诉 `motion` 实例触摸已经结束。达到惯性滑动条件，则会进行惯性滑动。

```js
const target = document.querySelector('#target')

target.addEventListener('touchend', e => {
  // 主动传入 touchend 事件，触摸结束
  motion.touchend(e, ({ x, y }) => {
    // x 是水平方向的惯性滑动距离
    // y 是垂直方向的惯性滑动距离
  })
}, Motion.isSupportPassive ? { passive: false, capture: true } : false)
```

