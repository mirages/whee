# 1.1.0 (2021-01-02)

### Bug Fixes

- 增加多个手指触摸状态判断 ([d0ea2d2](https://github.com/mirages/whee/commit/d0ea2d2ddc94b0a1ee0a5c72c7900e35db04129e))

### Code Refactoring

- **js-motion:** remove enum data, and Motion.Direction, Motion.Mode static properties ([9838747](https://github.com/mirages/whee/commit/98387475543460e1da92c8cc6d31d1ea2a31ca4e))

### Features

- **js-motion:** add options.coordinate config ([1958600](https://github.com/mirages/whee/commit/19586002d15627fcc9bab46a83b9deaf4effa239))
- **touchmove:** 回调移动过程中的旋转操作 ([b1a0c27](https://github.com/mirages/whee/commit/b1a0c274e43eed346ef4209d5d947bfa870e7f54))
- **touchmove:** 增加缩放操作回调 ([14e1507](https://github.com/mirages/whee/commit/14e150722fbeee1b1b74faa6712f82121cd2326f))
- 多点触摸判断,以及相关数据收集 ([376312b](https://github.com/mirages/whee/commit/376312b4683424163d07876547cae383d29d1671))

### BREAKING CHANGES

- **js-motion:** remove Motion static properties
