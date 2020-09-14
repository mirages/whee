(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Motion = factory());
}(this, (function () { 'use strict';

	var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

	var check = function (it) {
	  return it && it.Math == Math && it;
	};

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global_1 =
	  // eslint-disable-next-line no-undef
	  check(typeof globalThis == 'object' && globalThis) ||
	  check(typeof window == 'object' && window) ||
	  check(typeof self == 'object' && self) ||
	  check(typeof commonjsGlobal == 'object' && commonjsGlobal) ||
	  // eslint-disable-next-line no-new-func
	  Function('return this')();

	var fails = function (exec) {
	  try {
	    return !!exec();
	  } catch (error) {
	    return true;
	  }
	};

	// Thank's IE8 for his funny defineProperty
	var descriptors = !fails(function () {
	  return Object.defineProperty({}, 1, { get: function () { return 7; } })[1] != 7;
	});

	var nativePropertyIsEnumerable = {}.propertyIsEnumerable;
	var getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// Nashorn ~ JDK8 bug
	var NASHORN_BUG = getOwnPropertyDescriptor && !nativePropertyIsEnumerable.call({ 1: 2 }, 1);

	// `Object.prototype.propertyIsEnumerable` method implementation
	// https://tc39.github.io/ecma262/#sec-object.prototype.propertyisenumerable
	var f = NASHORN_BUG ? function propertyIsEnumerable(V) {
	  var descriptor = getOwnPropertyDescriptor(this, V);
	  return !!descriptor && descriptor.enumerable;
	} : nativePropertyIsEnumerable;

	var objectPropertyIsEnumerable = {
		f: f
	};

	var createPropertyDescriptor = function (bitmap, value) {
	  return {
	    enumerable: !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable: !(bitmap & 4),
	    value: value
	  };
	};

	var toString = {}.toString;

	var classofRaw = function (it) {
	  return toString.call(it).slice(8, -1);
	};

	var split = ''.split;

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var indexedObject = fails(function () {
	  // throws an error in rhino, see https://github.com/mozilla/rhino/issues/346
	  // eslint-disable-next-line no-prototype-builtins
	  return !Object('z').propertyIsEnumerable(0);
	}) ? function (it) {
	  return classofRaw(it) == 'String' ? split.call(it, '') : Object(it);
	} : Object;

	// `RequireObjectCoercible` abstract operation
	// https://tc39.github.io/ecma262/#sec-requireobjectcoercible
	var requireObjectCoercible = function (it) {
	  if (it == undefined) throw TypeError("Can't call method on " + it);
	  return it;
	};

	// toObject with fallback for non-array-like ES3 strings



	var toIndexedObject = function (it) {
	  return indexedObject(requireObjectCoercible(it));
	};

	var isObject = function (it) {
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

	// `ToPrimitive` abstract operation
	// https://tc39.github.io/ecma262/#sec-toprimitive
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	var toPrimitive = function (input, PREFERRED_STRING) {
	  if (!isObject(input)) return input;
	  var fn, val;
	  if (PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (typeof (fn = input.valueOf) == 'function' && !isObject(val = fn.call(input))) return val;
	  if (!PREFERRED_STRING && typeof (fn = input.toString) == 'function' && !isObject(val = fn.call(input))) return val;
	  throw TypeError("Can't convert object to primitive value");
	};

	var hasOwnProperty = {}.hasOwnProperty;

	var has = function (it, key) {
	  return hasOwnProperty.call(it, key);
	};

	var document$1 = global_1.document;
	// typeof document.createElement is 'object' in old IE
	var EXISTS = isObject(document$1) && isObject(document$1.createElement);

	var documentCreateElement = function (it) {
	  return EXISTS ? document$1.createElement(it) : {};
	};

	// Thank's IE8 for his funny defineProperty
	var ie8DomDefine = !descriptors && !fails(function () {
	  return Object.defineProperty(documentCreateElement('div'), 'a', {
	    get: function () { return 7; }
	  }).a != 7;
	});

	var nativeGetOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

	// `Object.getOwnPropertyDescriptor` method
	// https://tc39.github.io/ecma262/#sec-object.getownpropertydescriptor
	var f$1 = descriptors ? nativeGetOwnPropertyDescriptor : function getOwnPropertyDescriptor(O, P) {
	  O = toIndexedObject(O);
	  P = toPrimitive(P, true);
	  if (ie8DomDefine) try {
	    return nativeGetOwnPropertyDescriptor(O, P);
	  } catch (error) { /* empty */ }
	  if (has(O, P)) return createPropertyDescriptor(!objectPropertyIsEnumerable.f.call(O, P), O[P]);
	};

	var objectGetOwnPropertyDescriptor = {
		f: f$1
	};

	var replacement = /#|\.prototype\./;

	var isForced = function (feature, detection) {
	  var value = data[normalize(feature)];
	  return value == POLYFILL ? true
	    : value == NATIVE ? false
	    : typeof detection == 'function' ? fails(detection)
	    : !!detection;
	};

	var normalize = isForced.normalize = function (string) {
	  return String(string).replace(replacement, '.').toLowerCase();
	};

	var data = isForced.data = {};
	var NATIVE = isForced.NATIVE = 'N';
	var POLYFILL = isForced.POLYFILL = 'P';

	var isForced_1 = isForced;

	var path = {};

	var aFunction = function (it) {
	  if (typeof it != 'function') {
	    throw TypeError(String(it) + ' is not a function');
	  } return it;
	};

	// optional / simple context binding
	var functionBindContext = function (fn, that, length) {
	  aFunction(fn);
	  if (that === undefined) return fn;
	  switch (length) {
	    case 0: return function () {
	      return fn.call(that);
	    };
	    case 1: return function (a) {
	      return fn.call(that, a);
	    };
	    case 2: return function (a, b) {
	      return fn.call(that, a, b);
	    };
	    case 3: return function (a, b, c) {
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function (/* ...args */) {
	    return fn.apply(that, arguments);
	  };
	};

	var anObject = function (it) {
	  if (!isObject(it)) {
	    throw TypeError(String(it) + ' is not an object');
	  } return it;
	};

	var nativeDefineProperty = Object.defineProperty;

	// `Object.defineProperty` method
	// https://tc39.github.io/ecma262/#sec-object.defineproperty
	var f$2 = descriptors ? nativeDefineProperty : function defineProperty(O, P, Attributes) {
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if (ie8DomDefine) try {
	    return nativeDefineProperty(O, P, Attributes);
	  } catch (error) { /* empty */ }
	  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported');
	  if ('value' in Attributes) O[P] = Attributes.value;
	  return O;
	};

	var objectDefineProperty = {
		f: f$2
	};

	var createNonEnumerableProperty = descriptors ? function (object, key, value) {
	  return objectDefineProperty.f(object, key, createPropertyDescriptor(1, value));
	} : function (object, key, value) {
	  object[key] = value;
	  return object;
	};

	var getOwnPropertyDescriptor$1 = objectGetOwnPropertyDescriptor.f;






	var wrapConstructor = function (NativeConstructor) {
	  var Wrapper = function (a, b, c) {
	    if (this instanceof NativeConstructor) {
	      switch (arguments.length) {
	        case 0: return new NativeConstructor();
	        case 1: return new NativeConstructor(a);
	        case 2: return new NativeConstructor(a, b);
	      } return new NativeConstructor(a, b, c);
	    } return NativeConstructor.apply(this, arguments);
	  };
	  Wrapper.prototype = NativeConstructor.prototype;
	  return Wrapper;
	};

	/*
	  options.target      - name of the target object
	  options.global      - target is the global object
	  options.stat        - export as static methods of target
	  options.proto       - export as prototype methods of target
	  options.real        - real prototype method for the `pure` version
	  options.forced      - export even if the native feature is available
	  options.bind        - bind methods to the target, required for the `pure` version
	  options.wrap        - wrap constructors to preventing global pollution, required for the `pure` version
	  options.unsafe      - use the simple assignment of property instead of delete + defineProperty
	  options.sham        - add a flag to not completely full polyfills
	  options.enumerable  - export as enumerable property
	  options.noTargetGet - prevent calling a getter on target
	*/
	var _export = function (options, source) {
	  var TARGET = options.target;
	  var GLOBAL = options.global;
	  var STATIC = options.stat;
	  var PROTO = options.proto;

	  var nativeSource = GLOBAL ? global_1 : STATIC ? global_1[TARGET] : (global_1[TARGET] || {}).prototype;

	  var target = GLOBAL ? path : path[TARGET] || (path[TARGET] = {});
	  var targetPrototype = target.prototype;

	  var FORCED, USE_NATIVE, VIRTUAL_PROTOTYPE;
	  var key, sourceProperty, targetProperty, nativeProperty, resultProperty, descriptor;

	  for (key in source) {
	    FORCED = isForced_1(GLOBAL ? key : TARGET + (STATIC ? '.' : '#') + key, options.forced);
	    // contains in native
	    USE_NATIVE = !FORCED && nativeSource && has(nativeSource, key);

	    targetProperty = target[key];

	    if (USE_NATIVE) if (options.noTargetGet) {
	      descriptor = getOwnPropertyDescriptor$1(nativeSource, key);
	      nativeProperty = descriptor && descriptor.value;
	    } else nativeProperty = nativeSource[key];

	    // export native or implementation
	    sourceProperty = (USE_NATIVE && nativeProperty) ? nativeProperty : source[key];

	    if (USE_NATIVE && typeof targetProperty === typeof sourceProperty) continue;

	    // bind timers to global for call from export context
	    if (options.bind && USE_NATIVE) resultProperty = functionBindContext(sourceProperty, global_1);
	    // wrap global constructors for prevent changs in this version
	    else if (options.wrap && USE_NATIVE) resultProperty = wrapConstructor(sourceProperty);
	    // make static versions for prototype methods
	    else if (PROTO && typeof sourceProperty == 'function') resultProperty = functionBindContext(Function.call, sourceProperty);
	    // default case
	    else resultProperty = sourceProperty;

	    // add a flag to not completely full polyfills
	    if (options.sham || (sourceProperty && sourceProperty.sham) || (targetProperty && targetProperty.sham)) {
	      createNonEnumerableProperty(resultProperty, 'sham', true);
	    }

	    target[key] = resultProperty;

	    if (PROTO) {
	      VIRTUAL_PROTOTYPE = TARGET + 'Prototype';
	      if (!has(path, VIRTUAL_PROTOTYPE)) {
	        createNonEnumerableProperty(path, VIRTUAL_PROTOTYPE, {});
	      }
	      // export virtual prototype methods
	      path[VIRTUAL_PROTOTYPE][key] = sourceProperty;
	      // export real prototype methods
	      if (options.real && targetPrototype && !targetPrototype[key]) {
	        createNonEnumerableProperty(targetPrototype, key, sourceProperty);
	      }
	    }
	  }
	};

	// `Date.now` method
	// https://tc39.github.io/ecma262/#sec-date.now
	_export({ target: 'Date', stat: true }, {
	  now: function now() {
	    return new Date().getTime();
	  }
	});

	var now = path.Date.now;

	var now$1 = now;

	var now$2 = now$1;

	var Mode;

	(function (Mode) {
	  Mode["realtime"] = "realtime";
	  Mode["animation"] = "animation";
	})(Mode || (Mode = {}));

	var Direction;

	(function (Direction) {
	  Direction["x"] = "x";
	  Direction["y"] = "y";
	  Direction["xy"] = "xy";
	})(Direction || (Direction = {}));

	var noop = function noop() {// no operation
	};

	var Motion =
	/** @class */
	function () {
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
	    if (options === void 0) {
	      options = {};
	    }

	    this.trendData = [];
	    this.maxLength = 4;
	    this.tmThreshold = 50; // 惯性滚动时间差阈值，超过该值不触发惯性滚动，ios 比较灵敏，android 不灵敏

	    this.prevData = null;
	    this.animateId = 0;
	    this.rendering = false;
	    this.accumulation = 6;
	    this.touchstartHandler = noop;
	    this.touchmoveHandler = noop;
	    this.touchendHandler = noop;
	    this.el = options.target ? this.getEl(options.target) : null;
	    this.mode = options.mode === 'animation' ? Mode.animation : Mode.realtime;
	    this.direction = options.direction === 'x' ? Direction.x : options.direction === 'y' ? Direction.y : Direction.xy;

	    if (this.mode === Mode.animation) {
	      this.move = this.moveAnimate;
	    } else {
	      this.move = this.moveRealtime;
	    }

	    this.initEvent();
	  }

	  Motion.prototype.getEl = function (el) {
	    return typeof el === 'string' ? document.querySelector(el) : el;
	  };

	  Motion.prototype.initEvent = function () {
	    var _this = this;

	    if (!this.el) return;
	    this.el.addEventListener('touchstart', function (e) {
	      _this.start(e);

	      _this.touchstartHandler(e);
	    }, Motion.isSupportPassive ? {
	      passive: false,
	      capture: true
	    } : false);
	    this.el.addEventListener('touchmove', function (e) {
	      e.preventDefault();

	      _this.move(e, function (s) {
	        _this.touchmoveHandler(s, e);
	      });
	    }, Motion.isSupportPassive ? {
	      passive: false,
	      capture: true
	    } : false);
	    this.el.addEventListener('touchend', function (e) {
	      _this.end(e, function (s) {
	        _this.touchendHandler(s, e);
	      });
	    });
	  };

	  Motion.prototype.createData = function (touch) {
	    var now = now$2();

	    var data = {
	      x: touch.pageX,
	      y: touch.pageY,
	      t: now
	    };
	    return data;
	  };

	  Motion.prototype.getMoveData = function (currData) {
	    if (!this.prevData) this.prevData = currData;
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
	    if (cb === void 0) {
	      cb = noop;
	    }

	    this.touchstartHandler = cb;
	  };

	  Motion.prototype.touchmove = function (cb) {
	    if (cb === void 0) {
	      cb = noop;
	    }

	    this.touchmoveHandler = cb;
	  };

	  Motion.prototype.touchend = function (cb) {
	    if (cb === void 0) {
	      cb = noop;
	    }

	    this.touchendHandler = cb;
	  };

	  Motion.prototype.start = function (event) {
	    var touch = event.targetTouches[0];
	    this.trendData = [];
	    this.prevData = this.createData(touch);
	    this.clearInertiaScroll();
	  }; // eslint-disable-next-line


	  Motion.prototype.move = function (event, cb) {
	  };

	  Motion.prototype.moveAnimate = function (event, cb) {
	    var _this = this;

	    if (cb === void 0) {
	      cb = noop;
	    }

	    var touch = event.targetTouches[0];
	    var data = this.createData(touch);
	    this.setTrendData(data);

	    if (!this.rendering) {
	      this.rendering = true;
	      var moveData_1 = this.getMoveData(data);
	      this.animateId = requestAnimationFrame(function () {
	        cb({
	          x: moveData_1.x,
	          y: moveData_1.y
	        });
	        _this.rendering = false;
	      });
	    }
	  };

	  Motion.prototype.moveRealtime = function (event, cb) {
	    if (cb === void 0) {
	      cb = noop;
	    }

	    var touch = event.targetTouches[0];
	    var data = this.createData(touch);
	    var moveData = this.getMoveData(data);
	    var cbData = this.direction === Direction.x ? {
	      x: moveData.x
	    } : this.direction === Direction.y ? {
	      y: moveData.y
	    } : {
	      x: moveData.x,
	      y: moveData.y
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
	      // 距上次滚动时间差较大（缓慢滚动）时，不收集滚动数据
	      this.trendData = [];
	    } else {
	      // 否则收集滚动数据，用于计算惯性滚动
	      this.trendData.push(data);
	    }

	    if (this.trendData.length > this.maxLength) this.trendData.shift();
	  };

	  Motion.prototype.end = function (event, cb) {
	    if (cb === void 0) {
	      cb = noop;
	    }

	    var touch = event.changedTouches[0];
	    var data = this.createData(touch);
	    this.setTrendData(data);

	    if (this.isNeedInertiaScroll()) {
	      this.inertiaScroll(cb);
	    } else {
	      var cbData = this.direction === Direction.x ? {
	        x: 0
	      } : this.direction === Direction.y ? {
	        y: 0
	      } : {
	        x: 0,
	        y: 0
	      };
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

	    var stepX = function stepX() {
	      var deltaSx = xMoveStep();

	      if (deltaSx !== 0) {
	        _this.animateId = requestAnimationFrame(stepX);
	      }

	      cb({
	        x: deltaSx
	      });
	    };

	    var stepY = function stepY() {
	      var deltaSy = yMoveStep();

	      if (deltaSy !== 0) {
	        _this.animateId = requestAnimationFrame(stepY);
	      }

	      cb({
	        y: deltaSy
	      });
	    };

	    var stepXY = function stepXY() {
	      var deltaSx = xMoveStep();
	      var deltaSy = yMoveStep();

	      if (deltaSx !== 0 || deltaSy !== 0) {
	        _this.animateId = requestAnimationFrame(stepXY);
	      }

	      cb({
	        x: deltaSx,
	        y: deltaSy
	      });
	    };

	    this.direction === Direction.x ? stepX() : this.direction === Direction.y ? stepY() : stepXY();
	  };

	  Motion.prototype.getMoveStep = function (s, t) {
	    var _this = this;

	    var v0 = s / t;
	    var a0 = v0 / t / 10;
	    var v = v0;
	    var a = -a0 / 15;
	    return (
	      /* step */
	      function () {
	        var nextA = a + 0.04 * a0;
	        var nextV = v - a * _this.accumulation;
	        var deltaS = (v + nextV) / 2 * _this.accumulation;

	        if (_this.isMoveStop(v, nextV)) {
	          // 停止运动
	          deltaS = 0;
	          v = 0;
	          a = 0;
	        } else {
	          v = nextV;
	          a = nextA;
	        }

	        return deltaS;
	      }
	    );
	  };
	  /**
	   * 速度为 0，或者速度方向改变，则停止运动
	   * @param v - 当前速度
	   * @param nextV - 下一刻速度
	   */


	  Motion.prototype.isMoveStop = function (v, nextV) {
	    return v === 0 || v / nextV < 0;
	  };

	  Motion.prototype.clearInertiaScroll = function () {
	    cancelAnimationFrame(this.animateId);
	  };

	  Motion.isSupportPassive = function () {
	    var supportsPassive = false;

	    try {
	      document.createElement('div').addEventListener('testPassive', noop, {
	        get passive() {
	          supportsPassive = true;
	          return false;
	        }

	      });
	    } catch (e) {// Not support
	    }

	    return supportsPassive;
	  }();

	  return Motion;
	}();

	return Motion;

})));
