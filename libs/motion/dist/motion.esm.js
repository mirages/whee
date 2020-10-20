/**
 * motion
 * v1.0.0
 * by mirages
 */

var Mode;
(function (Mode) {
    Mode["realtime"] = "realtime";
    Mode["frame"] = "frame";
})(Mode || (Mode = {}));
var Direction;
(function (Direction) {
    Direction["x"] = "x";
    Direction["y"] = "y";
    Direction["xy"] = "xy";
})(Direction || (Direction = {}));
var noop = function () {
    // no operation
};
var Motion = /** @class */ (function () {
    /**
     * Motion 构造函数
     * @param {Object} [options] - 配置项
     * @param {string} [options.target=HTMLElement|string] - 绑定元素
     * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
     * @param {string} [options.mode=realtime] - 模式：
     *  'absolute' 绝对模式，输出绝对位置变量
     *  'relative' 相对模式，输出相对（上一次）位置变量
     */
    function Motion(options) {
        if (options === void 0) { options = {}; }
        this.trendData = [];
        this.maxLength = 4;
        this.tmThreshold = 50; // 惯性滚动时间差阈值，超过该值不触发惯性滚动，ios 比较灵敏，android 不灵敏
        this.prevData = null;
        this.renderData = null;
        this.animateId = 0;
        this.rendering = false;
        this.accumulation = 6;
        this.touchstartHandler = noop;
        this.touchmoveHandler = noop;
        this.touchendHandler = noop;
        this.el = options.target ? this.getEl(options.target) : null;
        this.mode = options.mode || Mode.realtime;
        this.direction = options.direction || Direction.xy;
        if (this.mode === Mode.frame) {
            this.move = this.moveAnimate;
        }
        else {
            this.move = this.moveRealtime;
        }
        this.initEvent();
    }
    Motion.prototype.getEl = function (el) {
        return typeof el === 'string' ? document.querySelector(el) : el;
    };
    Motion.prototype.initEvent = function () {
        var _this = this;
        if (!this.el)
            return;
        this.el.addEventListener('touchstart', function (e) {
            _this.start(e);
            _this.touchstartHandler(e);
        }, Motion.isSupportPassive ? { passive: false, capture: true } : /* istanbul ignore next */ false);
        this.el.addEventListener('touchmove', function (e) {
            e.preventDefault();
            _this.move(e, function (s) {
                _this.touchmoveHandler(s, e);
            });
        }, Motion.isSupportPassive ? { passive: false, capture: true } : /* istanbul ignore next */ false);
        this.el.addEventListener('touchend', function (e) {
            _this.end(e, function (s) {
                _this.touchendHandler(s, e);
            });
        });
    };
    Motion.prototype.createData = function (touch) {
        var now = Date.now();
        var data = {
            x: touch.pageX,
            y: touch.pageY,
            t: now
        };
        return data;
    };
    Motion.prototype.getMoveData = function (currData) {
        if (!this.prevData)
            this.prevData = currData;
        var moveData = {
            x: currData.x - this.prevData.x,
            y: currData.y - this.prevData.y,
            t: currData.t - this.prevData.t
        };
        this.prevData = currData;
        return moveData;
    };
    Motion.prototype.isNeedInertiaScroll = function () {
        return this.trendData.length > 1;
    };
    Motion.prototype.touchstart = function (cb) {
        if (cb === void 0) { cb = noop; }
        this.touchstartHandler = cb;
    };
    Motion.prototype.touchmove = function (cb) {
        if (cb === void 0) { cb = noop; }
        this.touchmoveHandler = cb;
    };
    Motion.prototype.touchend = function (cb) {
        if (cb === void 0) { cb = noop; }
        this.touchendHandler = cb;
    };
    Motion.prototype.start = function (event) {
        var touch = event.targetTouches[0];
        this.trendData = [];
        this.prevData = this.createData(touch);
        this.setTrendData(this.prevData);
        this.clearInertiaScroll();
    };
    /* istanbul ignore next */
    // eslint-disable-next-line
    Motion.prototype.move = function (event, cb) {
    };
    Motion.prototype.moveAnimate = function (event, cb) {
        var _this = this;
        if (cb === void 0) { cb = noop; }
        var touch = event.targetTouches[0];
        var data = this.createData(touch);
        // 实时收集数据
        this.setTrendData(data);
        // 下一帧渲染
        this.renderData = data;
        if (!this.rendering) {
            this.rendering = true;
            this.animateId = requestAnimationFrame(function () {
                var moveData = _this.getMoveData(_this.renderData);
                var cbData = {
                    x: _this.direction !== Direction.y ? moveData.x : 0,
                    y: _this.direction !== Direction.x ? moveData.y : 0
                };
                cb(cbData);
                _this.rendering = false;
            });
        }
    };
    Motion.prototype.moveRealtime = function (event, cb) {
        if (cb === void 0) { cb = noop; }
        var touch = event.targetTouches[0];
        var data = this.createData(touch);
        var moveData = this.getMoveData(data);
        var cbData = {
            x: this.direction !== Direction.y ? moveData.x : 0,
            y: this.direction !== Direction.x ? moveData.y : 0
        };
        this.setTrendData(data);
        cb(cbData);
    };
    Motion.prototype.setTrendData = function (data) {
        if (this.trendData.length < 1) {
            this.trendData.push(data);
            return;
        }
        var lastData = this.trendData[this.trendData.length - 1];
        var t = data.t - lastData.t;
        var x = data.x - lastData.x;
        var y = data.y - lastData.y;
        if (t > this.tmThreshold && Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)) / t < 0.3) {
            // 距上次数据时间差较大并且移动距离较小时（缓慢滚动），不收集滚动数据
            this.trendData = [];
        }
        else {
            // 否则收集滚动数据，用于计算惯性滚动
            this.trendData.push(data);
        }
        if (this.trendData.length > this.maxLength)
            this.trendData.shift();
    };
    Motion.prototype.end = function (event, cb) {
        if (cb === void 0) { cb = noop; }
        var touch = event.changedTouches[0];
        var data = this.createData(touch);
        this.setTrendData(data);
        if (this.isNeedInertiaScroll()) {
            this.inertiaScroll(cb);
        }
        else {
            var cbData = { x: 0, y: 0 };
            cb(cbData);
        }
    };
    Motion.prototype.inertiaScroll = function (cb) {
        var _this = this;
        var first = this.trendData[0];
        var last = this.trendData[this.trendData.length - 1];
        var average = {
            x: last.x - first.x,
            y: last.y - first.y,
            t: last.t - first.t
        };
        var xMoveStep = this.getMoveStep(average.x, average.t);
        var yMoveStep = this.getMoveStep(average.y, average.t);
        if (this.direction === Direction.x) {
            yMoveStep = function () { return 0; };
        }
        else if (this.direction === Direction.y) {
            xMoveStep = function () { return 0; };
        }
        var step = function () {
            var deltaSx = xMoveStep();
            var deltaSy = yMoveStep();
            if (deltaSx !== 0 || deltaSy !== 0) {
                _this.animateId = requestAnimationFrame(step);
            }
            cb({ x: deltaSx, y: deltaSy });
        };
        step();
    };
    Motion.prototype.getMoveStep = function (s, t) {
        var _this = this;
        var v0 = s / t;
        var a0 = v0 / t / 10;
        var v = v0;
        var a = -a0 / 15;
        return /* step */ function () {
            var nextA = a + 0.04 * a0;
            var nextV = v - a * _this.accumulation;
            var deltaS = (v + nextV) / 2 * _this.accumulation;
            if (_this.isMoveStop(v, nextV)) {
                // 停止运动
                deltaS = 0;
                v = 0;
                a = 0;
            }
            else {
                v = nextV;
                a = nextA;
            }
            return deltaS;
        };
    };
    /**
     * 速度为 0，或者速度方向改变，或者速度无限大，则停止运动
     * @param v - 当前速度
     * @param nextV - 下一刻速度
     */
    Motion.prototype.isMoveStop = function (v, nextV) {
        return v === Infinity || v === -Infinity || v === 0 || v / nextV < 0;
    };
    Motion.prototype.clearInertiaScroll = function () {
        cancelAnimationFrame(this.animateId);
    };
    Motion.isSupportPassive = (function () {
        var supportsPassive = false;
        try {
            document.createElement('div').addEventListener('testPassive', noop, {
                get passive() {
                    supportsPassive = true;
                    return false;
                }
            });
        }
        catch (e) {
            // Not support
        }
        return supportsPassive;
    })();
    Motion.Direction = Direction;
    Motion.Mode = Mode;
    return Motion;
}());

export default Motion;
