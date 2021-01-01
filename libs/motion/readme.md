# Motion

[![Build Status](https://travis-ci.com/mirages/motion.svg?branch=master)](https://travis-ci.com/mirages/motion) [![codecov](https://codecov.io/gh/mirages/motion/branch/master/graph/badge.svg?token=ZM4K1Q670O)](https://codecov.io/gh/mirages/motion/branch/master) [![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg?style=flat-square)](https://github.com/prettier/prettier) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)

移动端触摸手势检测工具，根据元素的 `touchstart, touchmove, touchend` 事件计算相关的滑动、缩放和旋转操作，以及触摸事件结束后的惯性滑动。

> 滑动、缩放以及旋转都是**当前时刻**相对元素**上一时刻**的状态计算的，因此从触摸开始(`touchstart`)到触摸结束(`touchend`)之间总的滑动距离和旋转角度，需要将每一时刻值进行**累加**，而缩放大小则需要**累乘**。

## 示例

[触摸板](./examples/demo.html)

## 使用

```shell
npm install @whee/js-motion
```

自动监听 `options.target` 元素的手势操作：

```js
import Motion from '@whee/js-motion'

const motion = new Motion({
  target: '#target',
  mode: 'realtime',
  direction: 'xy'
})

motion.onTouchstart(e => {
  // ...
})
motion.onTouchmove(({ x, y, scale, angle }, e) => {
  // ...
})
motion.onTouchend(({ x, y }, e) => {
  // ...
})
```

如果已经进行了目标元素的 `touch` 事件绑定，则需要传入相关的事件，便可以检测到 `event.target` 元素的手势操作：

```js
import Motion from '@whee/js-motion'

const motion = new Motion({
  mode: 'realtime',
  direction: 'xy'
})
const target = document.querySelector('#target')

target.addEventListener(
  'touchstart',
  e => {
    e.preventDefault()
    motion.touchstart(e)
    // 其他操作
    //...
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)

target.addEventListener(
  'touchmove',
  e => {
    e.preventDefault()
    motion.touchmove(e, ({ x, y, scale, angle }) => {
      // ...
    })
    // 其他操作
    // ...
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)

target.addEventListener(
  'touchend',
  e => {
    motion.touchend(e, ({ x, y }) => {
      // ...
    })
    // 其他操作
    // ...
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)
```

推荐使用第一种方式，`motion` 实例会自动监听 `options.target` 元素的相关事件。

### Mode

`touchmove` 的执行模式：

- `'realtime'` - 实时模式：

  即每一次 `touchmove` 事件进行处理计算滑动距离。

- `'frame'` - 帧模式：

  即一帧内的多个 `touchmove` 事件合并，进行一次处理，计算总的滑动距离。

_注意：如果可以尽量使用 `realtime` 模式，因为部分浏览器对 `touchmove` 事件触发的频率已经做了优化，使用 `frame` 会出现跨度较大的问题。_

### Direction

`motion` 监听的移动方向：

- `'x'` - 只监听水平方向的移动：

  只计算水平方向的移动距离，垂直方向的移动距离始终为 0。

- `'y'` - 只监听垂直方向的移动。

  只计算垂直方向的移动距离，水平方向的移动距离始终为 0。

- `'xy'` - 同时监听水平和垂直方向的移动。

  同时计算水平和垂直两个方向的移动距离。

### Coordinate

参考的坐标系：

- `'screen'` - 使用 `touch.screenX` 和 `touch.screenY` 计算数据
- `'client'` - 使用 `touch.clientX` 和 `touch.clientY` 计算数据
- `'page'` - 使用 `touch.pageX` 和 `touch.pageY` 计算数据

### Motion

```js
const motion = new Motion(options)
```

实例化时指定 `options.target` 选项，被动监听 `motion.touch`

#### `options`

- `options.target` - 需要监听触摸事件的目标元素，可选。
- `options.mode` - 指定 `touchmove` 的执行模式，默认为 `'realtime'`。
- `options.direction` - 指定监听的移动方向，默认为 `'xy'`。
- `options.coordinate` - 参考的坐标系，默认为 `'page'`

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
motion.onTouchmove(({ x, y, scale, angle }, e) => {
  // x 是水平方向的移动距离
  // y 是垂直方向的移动距离
  // scale 是缩放比率
  // angle 是旋转的角度
  // e 是 options.target 元素的原生 touchmove 事件
})
```

#### `motion.onTouchend(cb)`

监听 `options.target` 的 `touchend` 操作，并将需要惯性滑动的距离和 `touchend` 事件进行回调。

回调的滑动距离为 `0` 时则表示滑动停止：

- `options.direction='x'` - 回调惯性滑动距离分量 `x` 为 `0` 时，表示惯性滑动停止
- `options.direction='y'` - 回调惯性滑动距离分量 `y` 为 `0` 时，表示惯性滑动停止
- `options.direction='xy'` - 回调惯性滑动距离分量 `x` 和 `y` 都为 `0` 时，表示惯性滑动停止

_注意：如果没触发惯性滑动，只会触发一次回调；如果触发惯性滑动，则会进行多次回调，直到滑动停止。_

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

target.addEventListener(
  'touchstart',
  e => {
    // 主动传入 touchstart 事件，触摸开始
    motion.touchstart(e)
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)
```

_注意：在调用 `motion.touchmove()` 之前始终需要先调用一次 `motion.touchstart()`，保证 `motion` 可以正确计算开始触摸的位置。_

#### `motion.touchmove(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchmove` 事件，告诉 `motion` 实例滑动操作正在进行。

```js
const target = document.querySelector('#target')

target.addEventListener(
  'touchmove',
  e => {
    // 主动传入 touchmove 事件，正在滑动
    motion.touchmove(e, ({ x, y, scale, angle }) => {
      // x 是水平方向的滑动距离
      // y 是垂直方向的滑动距离
      // scale 是缩放比率
      // angle 是旋转的角度
    })
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)
```

#### `motion.touchend(e, cb)`

实例化时没有指定 `options.target` 元素，则需要主动调用该方法，并传入 `touchend` 事件，告诉 `motion` 实例触摸已经结束。达到惯性滑动条件，则会进行惯性滑动。

```js
const target = document.querySelector('#target')

target.addEventListener(
  'touchend',
  e => {
    // 主动传入 touchend 事件，触摸结束
    motion.touchend(e, ({ x, y }) => {
      // x 是水平方向的惯性滑动距离
      // y 是垂直方向的惯性滑动距离
    })
  },
  Motion.isSupportPassive ? { passive: false, capture: true } : false
)
```
