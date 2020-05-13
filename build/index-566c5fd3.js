import { c as createCommonjsModule, a as commonjsGlobal } from './commonjsHelpers-cc66c86a.js';

var numberScale = createCommonjsModule(function (module, exports) {
  // UMD: https://github.com/umdjs/umd/blob/master/returnExports.js
  (function (root, factory) {
    /* istanbul ignore next */
    if (typeof undefined === 'function' && undefined.amd) {
      // AMD. Register as an anonymous module.
      /* istanbul ignore next */
      undefined(factory);
      /* istanbul ignore else */
    } else if ('object' === 'object') {
      // Node. Does not work with strict CommonJS, but
      // only CommonJS-like environments that support module.exports,
      // like Node.
      module.exports = factory();
    } else {
      // Browser globals (root is window)
      /* istanbul ignore next */
      root.numberScale = factory();
    }
  })(commonjsGlobal, function () {
    'use strict';

    /**
     * The default options
     *
     * @namespace defaultOptions
     * @property {Number}  precision         the decimal precision to display (0 for integers only)
     * @property {string}  roundMode         one of `even`, `odd`, `up`, `down`, or any other value
     * @property {string}  scale             the scale key to use
     * @property {string}  unit              the unit suffix to display
     * @property {Number}  recursive         a positive integer to recursively decompose the value into scale fragments
     * @see formatPrecision
     * @see round
     */
    var defaultOptions = {
      //maxExponent: 308,
      //minExponent: -324,
      precision: 2,
      roundMode: 'up',
      scale: 'SI',
      unit: '',
      recursive: 0
    };
    /* @private */
    var defaultOptionsKeys = Object.keys(defaultOptions);
    /**
     * All known scales
     *
     * @namespace
     * @private
     * @property {Object}  SI        International System of Units (https://en.wikipedia.org/wiki/International_System_of_Units)
     * @property {Object}  time      Time Unit scale
     * @property {object}  IEEE1541  IEEE 1541 Units for bytes measurements
     */
    var knownScales = {
      SI: buildScale({
        'y': 1e-24,
        'z': 1e-21,
        'a': 1e-18,
        'f': 1e-15,
        'p': 1e-12,
        'n': 1e-9,
        'µ': 1e-6,
        'm': 1e-3,
        '': 1,
        'k': 1e3,
        'M': 1e6,
        'G': 1e9,
        'T': 1e12,
        'P': 1e15,
        'E': 1e18,
        'Z': 1e21,
        'Y': 1e24
      }, 1),
      time: buildScale({
        'ns': 1e-9,
        'ms': 1e-3,
        's': 1,
        'm': 60,
        'h': 3600, // 60*60
        'd': 86400 // 60*60*24
      }, 1),
      IEEE1541: buildScale({
        '': 1,
        'Ki': 1e3,
        'Mi': 1e6,
        'Gi': 1e9,
        'Ti': 1e12,
        'Pi': 1e15,
        'Ei': 1e18,
        'Zi': 1e21,
        'Yi': 1e24
      }, 0)
    };


    /**
     * Return an object with all the required options filled out.
     * Any omitted values will be fetched from the default options
     *
     * @see defaultOptions
     * @param {Object} options
     * @returns {Object}
     */
    function mergeDefaults(options) {
      var i;
      var iLen;

      options = options || {};

      for (i = 0, iLen = defaultOptionsKeys.length; i < iLen; ++i) {
        if (!(defaultOptionsKeys[i] in options)) {
          options[defaultOptionsKeys[i]] = defaultOptions[defaultOptionsKeys[i]];
        }
      }

      return options;
    }

    /**
     * Make sure str does not contain any regex expressions
     *
     * @function escapeRegexp
     * @private
     * @param {string} str
     * @returns {string}
     */
    function escapeRegexp(str) {
      return str.replace(/([.*+?=^!:${}()|[\]\/\\])/g, '\\$1');
    }

    /**
     * Round the given value, considering it as a negative, or positive one.
     *
     * The function will round to the next 'even', or 'odd' number, or will round
     * 'down', or 'up' to any next integer. For any other value, a default mathematical
     * rounding will be performed (i.e. round to the nearest integer, half up)
     *
     * @function round
     * @private
     * @param {string} mode    one of 'even', 'odd', 'up', 'down', or any other value
     * @param {boolean} neg    if the value should considered as negative
     * @param {Number} value   a value to round (i.e. with decimals)
     * @returns {Number}       the value rounded
     */
    function round(mode, neg, value) {
      var i = value | 0;

      if (neg) {
        i = -i;
        value = -value;
      }

      //console.log("??? ROUND", mode, neg, value, i, i & 1);

      if (mode === 'even') {
        if (!neg && (i > value) || (i & 1)) {  // odd
          value = i + 1;
        } else {
          value = i;
        }
      } else if (mode === 'odd') {
        if (!neg && (i > value) || (i & 1)) {  // odd
          value = i;
        } else {
          value = i + 1;
        }
      } else if (mode === 'up') {
        value = Math.ceil(value);
      } else if (mode === 'down') {
        value = Math.floor(value);
      } else {
        value = Math.round(value);
      }

      return neg ? Math.abs(value) : value;
    }

    /**
     * Make sure a decimal value contains the specified precision.
     * Ignore any integer value.
     *
     * @function formatPrecision
     * @private
     * @param {Number} value
     * @param {Number} precision
     * @returns {string}
     */
    function formatPrecision(value, precision) {
      var i = value | 0;

      if ((i !== value) && Math.max(precision, 0)) {
        return Number(value).toFixed(precision);
      } else {
        return String(value);
      }
    }

    /**
     * Build a scale and prepare it to be used by the formatter and parser
     *
     * @function buildScale
     * @private
     * @param {Object} prefixes       a key-value object which keys are scale units and values it's base value
     * @param {Number} baseUnitValue  the base value, or scale pivot point
     * @return {Object}
     */
    function buildScale(prefixes, baseUnitValue) {
      var list = [];  // Lists prefixes and their factor in ascending order.
      var map = {};   // Maps from prefixes to their factor.
      var re;         // Regex to parse a value and its associated unit.
      var unitBase;   // the base unit for this scale
      var unitTmpValue = Number.MAX_VALUE;
      var tmp = [];

      baseUnitValue = baseUnitValue || 0;

      Object.keys(prefixes).forEach(function (prefix) {
        var name = prefix;
        var value = prefixes[prefix];

        list.push([name, value]);

        map[name] = value;

        tmp.push(escapeRegexp(name));

        if (Math.abs(baseUnitValue - value) < Math.abs(baseUnitValue - unitTmpValue)) {
          unitBase = name;
          unitTmpValue = value;
        }
      });

      list.sort(function (a, b) {
        return (a[1] - b[1]);
      });

      tmp = tmp.sort(function (a, b) {
        return b.length - a.length; // Matches longest first.
      }).join('|');
      re = new RegExp('^\\s*((?:-)?\\d+(?:\\.\\d+)?)\\s*(' + tmp + ').*?$', 'i');

      return {
        list: list,
        map: map,
        re: re,
        base: unitBase
      };
    }

    /**
     * Binary search to find the greatest index which has a value <=.
     *
     * @function findPrefix
     * @private
     * @param {Array} list      the scale's units list
     * @param {Number} value    a numeric value
     * @returns {Array}         the found list item
     */
    function findPrefix(list, value) {
      /* jshint bitwise: false */

      var low = 0;
      var high = list.length - 1;

      var mid, current;
      while (low !== high) {
        mid = (low + high + 1) >> 1;
        current = list[mid][1];

        if (current > value) {
          high = mid - 1;
        } else {
          low = mid;
        }
      }

      return list[low];
    }

    /**
     * Format the given value according to a scale and return it
     *
     * @function numberScale
     * @see defaultOptions
     * @param {Number} num         the number to format to scale
     * @param {Object} options     the options
     * @returns {string}           the scaled number
     */
    function numberScale(num, options) {
      var neg;
      var scale;
      var prefix;
      var roundModifier;
      var value;
      var reminder;

      options = mergeDefaults(options);

      // Ensures `value` is a number (or NaN).
      value = Number(num);
      scale = knownScales[options.scale];

      // If `value` is 0 or NaN.
      if (!value) {
        return '0' + scale.base + options.unit;
      }

      neg = value < 0;
      value = Math.abs(value);

      prefix = findPrefix(scale.list, value);
      roundModifier = +('1e' + Math.max(options.precision, 0));

      value = round(options.roundMode, neg, value * roundModifier / prefix[1]) / roundModifier;

      if (options.recursive) {
        --options.recursive;

        value = value | 0;
        reminder = Math.abs(num) - (value * prefix[1]);

        value = String(value);
      } else {
        value = formatPrecision(value, options.precision);
      }

      if (neg) {
        if (value !== '0') {
          value = '-' + value;
        }
        reminder = -reminder;
      }

      value = value + prefix[0] + options.unit;

      if (reminder && prefix !== scale.list[0]) {

        reminder = numberScale(reminder, options);

        if (Array.isArray(reminder)) {
          value = [value].concat(reminder);
        } else {
          value = [value, reminder];
        }
      }

      return value;
    }

    /**
     * Parse this value and return a number, or NaN if value is invalid
     *
     * @function parseScale
     * @see defaultOptions
     * @param {(Array|Number)} value     a value as returned by numberScale()
     * @param {Object} options           the options. Same as numberScale()'s options
     * @return {(Number|NaN)}            the parsed value as a number
     */
    function parseScale(value, options) {
      var scale;
      var matches;

      if (Array.isArray(value)) {
        return value.reduce(function (prev, val) {
          return prev + parseScale(val, options);
        }, 0);
      }

      options = mergeDefaults(options);

      scale = knownScales[options.scale];

      matches = String(value).match(scale.re);

      if (matches) {
        if (!matches[2]) {
          matches[2] = scale.base;
        }

        value = matches[1] * scale.map[matches[2]];
      } else {
        value = NaN;
      }

      return value;
    }

    /**
     * Define and bind a new scale, or ovrride an existing one
     *
     * @function defineScale
     * @param {string} name          the scale name
     * @param {Object} prefixes      the prefixes definitions
     * @param {Number} baseUnitValue the base value, or scale pivot point
     */
    function defineScale(name, prefixes, baseUnitValue) {
      knownScales[name] = buildScale(prefixes, baseUnitValue);
      numberScale.scales[name] = name;
    }


    // Scale Aliasses
    knownScales['IEEE-1541'] = knownScales.IEEE1541;


    /**
     * expose (readonly) API
     *
     * @namespace numberScale
     * @borrows defineScale as defineScale
     * @borrows parseScale as scale
     *
     * @property {Object} options.default     default options
     * @property {Object} scales              all known scales
     * @property {Function} defineScale
     * @property {Function} parse
     */
    Object.defineProperties(numberScale, {
      options: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: {
          default: defaultOptions
        }
      },
      scales: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: Object.keys(knownScales).reduce(function (scales, scale) {
          scales[scale] = scale;
          return scales;
        }, {})
      },
      defineScale: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: defineScale
      },
      parse: {
        configurable: false,
        enumerable: true,
        writable: false,
        value: parseScale
      }
    });

    return numberScale;
  });
});

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);

  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function (sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }

  return keys;
}

function _objectSpread2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};

    if (i % 2) {
      ownKeys(Object(source), true).forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(Object(source)).forEach(function (key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }

  return target;
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) {
    return o.__proto__ || Object.getPrototypeOf(o);
  };
  return _getPrototypeOf(o);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function isNativeReflectConstruct() {
  if (typeof Reflect === "undefined" || !Reflect.construct) return false;
  if (Reflect.construct.sham) return false;
  if (typeof Proxy === "function") return true;

  try {
    Date.prototype.toString.call(Reflect.construct(Date, [], function () { }));
    return true;
  } catch (e) {
    return false;
  }
}

function _construct(Parent, args, Class) {
  if (isNativeReflectConstruct()) {
    _construct = Reflect.construct;
  } else {
    _construct = function _construct(Parent, args, Class) {
      var a = [null];
      a.push.apply(a, args);
      var Constructor = Function.bind.apply(Parent, a);
      var instance = new Constructor();
      if (Class) _setPrototypeOf(instance, Class.prototype);
      return instance;
    };
  }

  return _construct.apply(null, arguments);
}

function _isNativeFunction(fn) {
  return Function.toString.call(fn).indexOf("[native code]") !== -1;
}

function _wrapNativeSuper(Class) {
  var _cache = typeof Map === "function" ? new Map() : undefined;

  _wrapNativeSuper = function _wrapNativeSuper(Class) {
    if (Class === null || !_isNativeFunction(Class)) return Class;

    if (typeof Class !== "function") {
      throw new TypeError("Super expression must either be null or a function");
    }

    if (typeof _cache !== "undefined") {
      if (_cache.has(Class)) return _cache.get(Class);

      _cache.set(Class, Wrapper);
    }

    function Wrapper() {
      return _construct(Class, arguments, _getPrototypeOf(this).constructor);
    }

    Wrapper.prototype = Object.create(Class.prototype, {
      constructor: {
        value: Wrapper,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    return _setPrototypeOf(Wrapper, Class);
  };

  return _wrapNativeSuper(Class);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

var toString = Object.prototype.toString;

var kindOf = function kindOf(val) {
  if (val === void 0) return 'undefined';
  if (val === null) return 'null';

  var type = typeof val;
  if (type === 'boolean') return 'boolean';
  if (type === 'string') return 'string';
  if (type === 'number') return 'number';
  if (type === 'symbol') return 'symbol';
  if (type === 'function') {
    return isGeneratorFn(val) ? 'generatorfunction' : 'function';
  }

  if (isArray(val)) return 'array';
  if (isBuffer(val)) return 'buffer';
  if (isArguments(val)) return 'arguments';
  if (isDate(val)) return 'date';
  if (isError(val)) return 'error';
  if (isRegexp(val)) return 'regexp';

  switch (ctorName(val)) {
    case 'Symbol': return 'symbol';
    case 'Promise': return 'promise';

    // Set, Map, WeakSet, WeakMap
    case 'WeakMap': return 'weakmap';
    case 'WeakSet': return 'weakset';
    case 'Map': return 'map';
    case 'Set': return 'set';

    // 8-bit typed arrays
    case 'Int8Array': return 'int8array';
    case 'Uint8Array': return 'uint8array';
    case 'Uint8ClampedArray': return 'uint8clampedarray';

    // 16-bit typed arrays
    case 'Int16Array': return 'int16array';
    case 'Uint16Array': return 'uint16array';

    // 32-bit typed arrays
    case 'Int32Array': return 'int32array';
    case 'Uint32Array': return 'uint32array';
    case 'Float32Array': return 'float32array';
    case 'Float64Array': return 'float64array';
  }

  if (isGeneratorObj(val)) {
    return 'generator';
  }

  // Non-plain objects
  type = toString.call(val);
  switch (type) {
    case '[object Object]': return 'object';
    // iterators
    case '[object Map Iterator]': return 'mapiterator';
    case '[object Set Iterator]': return 'setiterator';
    case '[object String Iterator]': return 'stringiterator';
    case '[object Array Iterator]': return 'arrayiterator';
  }

  // other
  return type.slice(8, -1).toLowerCase().replace(/\s/g, '');
};

function ctorName(val) {
  return val.constructor ? val.constructor.name : null;
}

function isArray(val) {
  if (Array.isArray) return Array.isArray(val);
  return val instanceof Array;
}

function isError(val) {
  return val instanceof Error || (typeof val.message === 'string' && val.constructor && typeof val.constructor.stackTraceLimit === 'number');
}

function isDate(val) {
  if (val instanceof Date) return true;
  return typeof val.toDateString === 'function'
    && typeof val.getDate === 'function'
    && typeof val.setDate === 'function';
}

function isRegexp(val) {
  if (val instanceof RegExp) return true;
  return typeof val.flags === 'string'
    && typeof val.ignoreCase === 'boolean'
    && typeof val.multiline === 'boolean'
    && typeof val.global === 'boolean';
}

function isGeneratorFn(name, val) {
  return ctorName(name) === 'GeneratorFunction';
}

function isGeneratorObj(val) {
  return typeof val.throw === 'function'
    && typeof val.return === 'function'
    && typeof val.next === 'function';
}

function isArguments(val) {
  try {
    if (typeof val.length === 'number' && typeof val.callee === 'function') {
      return true;
    }
  } catch (err) {
    if (err.message.indexOf('callee') !== -1) {
      return true;
    }
  }
  return false;
}

/**
 * If you need to support Safari 5-7 (8-10 yr-old browser),
 * take a look at https://github.com/feross/is-buffer
 */

function isBuffer(val) {
  if (val.constructor && typeof val.constructor.isBuffer === 'function') {
    return val.constructor.isBuffer(val);
  }
  return false;
}

/**
 * Superstruct ships by default with an unopinionated set of scalar types that
 * express all of the data types that are built-in to JavaScript.
 */

var Types = {
  /**
   * Matches any value other than `undefined`.
   *
   * ```js
   * 'anything'
   * true
   * ```
   */
  any: function any(value) {
    return value !== undefined;
  },

  /**
   * Matches an `arguments` object.
   *
   * ```js
   * arguments
   * ```
   */
  arguments: function _arguments(value) {
    return kindOf(value) === 'arguments';
  },

  /**
   * Matches an `Array`.
   *
   * ```js
   * [1, 2, 3]
   * ```
   */
  array: function array(value) {
    return kindOf(value) === 'array';
  },

  /**
   * Matches a boolean.
   *
   * ```js
   * true
   * false
   * ```
   */
  boolean: function boolean(value) {
    return kindOf(value) === 'boolean';
  },

  /**
   * Matches a Node.js `Buffer`.
   *
   * ```js
   * Buffer.from('string')
   * ```
   */
  buffer: function buffer(value) {
    return kindOf(value) === 'buffer';
  },

  /**
   * Matches a **valid** `Date` object.
   *
   * ```js
   * new Date()
   * ```
   *
   * Note: Invalid `Date` objects that equal `NaN` are not matched.
   */
  date: function date(value) {
    return kindOf(value) === 'date' && !isNaN(value);
  },

  /**
   * Matches an error object.
   *
   * ```js
   * new Error()
   * ```
   */
  error: function error(value) {
    return kindOf(value) === 'error';
  },

  /**
   * Matches a `Float32Array` object.
   */
  float32array: function float32array(value) {
    return kindOf(value) === 'float32array';
  },

  /**
   * Matches a `Float64Array` object.
   */
  float64array: function float64array(value) {
    return kindOf(value) === 'float64array';
  },

  /**
   * Matches a function.
   *
   * ```js
   * () => {}
   * function () {}
   * ```
   */
  function: function _function(value) {
    return kindOf(value) === 'function';
  },

  /**
   * Matches a generator function.
   *
   * ```js
   * function* () {}
   * ```
   */
  generatorfunction: function generatorfunction(value) {
    return kindOf(value) === 'generatorfunction';
  },

  /**
   * Matches a `Int16Array` object.
   */
  int16array: function int16array(value) {
    return kindOf(value) === 'int16array';
  },

  /**
   * Matches a `Int32Array` object.
   */
  int32array: function int32array(value) {
    return kindOf(value) === 'int32array';
  },

  /**
   * Matches a `Int8Array` object.
   */
  int8array: function int8array(value) {
    return kindOf(value) === 'int8array';
  },

  /**
   * Matches a `Map` object.
   *
   * ```js
   * new Map()
   * ```
   */
  map: function map(value) {
    return kindOf(value) === 'map';
  },

  /**
   * Matches the `null` literal value.
   *
   * ```js
   * null
   * ```
   */
  null: function _null(value) {
    return kindOf(value) === 'null';
  },

  /**
   * Matches a number.
   *
   * ```js
   * 42
   * ```
   */
  number: function number(value) {
    return kindOf(value) === 'number';
  },

  /**
   * Matches a plain object.
   *
   * ```js
   * { key: 'value' }
   * { something: true }
   * ```
   */
  object: function object(value) {
    return kindOf(value) === 'object';
  },

  /**
   * Matches a `Promise` object.
   *
   * ```js
   * Promise.resolve()
   * ```
   */
  promise: function promise(value) {
    return kindOf(value) === 'promise';
  },

  /**
   * Matches a regular expression object.
   *
   * ```js
   * /a-z/g
   * ```
   */
  regexp: function regexp(value) {
    return kindOf(value) === 'regexp';
  },

  /**
   * Matches a `Set` object.
   *
   * ```js
   * new Set()
   * ```
   */
  set: function set(value) {
    return kindOf(value) === 'set';
  },

  /**
   * Matches a string.
   *
   * ```js
   * 'text'
   * ```
   */
  string: function string(value) {
    return kindOf(value) === 'string';
  },

  /**
   * Matches a `Symbol`.
   *
   * ```js
   * Symbol()
   * ```
   */
  symbol: function symbol(value) {
    return kindOf(value) === 'symbol';
  },

  /**
   * Matches a `Uint16Array` object.
   */
  uint16array: function uint16array(value) {
    return kindOf(value) === 'uint16array';
  },

  /**
   * Matches a `Uint32Array` object.
   */
  uint32array: function uint32array(value) {
    return kindOf(value) === 'uint32array';
  },

  /**
   * Matches a `Uint8Array` object.
   */
  uint8array: function uint8array(value) {
    return kindOf(value) === 'uint8array';
  },

  /**
   * Matches a `Uint8ClampedArray` object.
   */
  uint8clampedarray: function uint8clampedarray(value) {
    return kindOf(value) === 'uint8clampedarray';
  },

  /**
   * Matches the `undefined` literal value.
   *
   * ```js
   * undefined
   * ```
   */
  undefined: function undefined$1(value) {
    return kindOf(value) === 'undefined';
  },

  /**
   * Matches a `WeakMap` object.
   *
   * ```js
   * new WeakMap()
   * ```
   */
  weakmap: function weakmap(value) {
    return kindOf(value) === 'weakmap';
  },

  /**
   * Matches a `WeakSet` object.
   *
   * ```js
   * new WeakSet()
   * ```
   */
  weakset: function weakset(value) {
    return kindOf(value) === 'weakset';
  }
};

var isProduction = "development" === 'production';
var prefix = 'Invariant failed';
function invariant(condition, message) {
  if (condition) {
    return;
  }

  if (isProduction) {
    throw new Error(prefix);
  } else {
    throw new Error(prefix + ": " + (message || ''));
  }
}

/**
 * `StructError` objects are thrown (or returned) by Superstruct when its
 * validation fails. The error represents the first error encountered during
 * validation. But they also have an `error.failures` property that holds
 * information for all of the failures encountered.
 */

var StructError =
  /*#__PURE__*/
  function (_TypeError) {
    _inheritsLoose(StructError, _TypeError);

    function StructError(failures) {
      var _this;

      invariant(failures.length > 0, "StructError requires being passed a failure, but received: " + failures);
      var first = failures[0];

      var path = first.path,
        value = first.value,
        type = first.type,
        branch = first.branch,
        rest = _objectWithoutPropertiesLoose(first, ["path", "value", "type", "branch"]);

      var message = "Expected a value of type `" + type + "`" + (path.length ? " for `" + path.join('.') + "`" : '') + " but received `" + JSON.stringify(value) + "`.";
      _this = _TypeError.call(this, message) || this;
      _this.type = type;
      _this.value = value;
      Object.assign(_assertThisInitialized(_this), rest);
      _this.path = path;
      _this.branch = branch;
      _this.failures = failures;
      _this.stack = new Error().stack;
      _this.__proto__ = StructError.prototype;
      return _this;
    }

    return StructError;
  }(_wrapNativeSuper(TypeError));

/**
 * A symbol to set on `Struct` objects to test them against later.
 */
var STRUCT = Symbol('STRUCT');
/**
 * Check if a value is a `Struct` object.
 */

var isStruct = function isStruct(value) {
  return typeof value === 'function' && value[STRUCT];
};
/**
 * This abstract `Struct` factory creates a generic struct that validates values
 * against a `Validator` function.
 */

var createStruct = function createStruct(props) {
  var struct = props.struct;
  var Error = struct.Error;

  var Struct = function Struct(value) {
    return Struct.assert(value);
  }; // Set a hidden symbol property so that we can check it later to see if an
  // object is a struct object.


  Object.defineProperty(Struct, STRUCT, {
    value: true
  });
  Struct.kind = props.kind;
  Struct.type = props.type;

  Struct.default = function () {
    return typeof props.defaults === 'function' ? props.defaults() : props.defaults;
  };

  Struct.test = function (value) {
    var _Struct$check = Struct.check(value, [value], []),
      failures = _Struct$check[0];

    return !failures;
  };

  Struct.assert = function (value) {
    var _Struct$check2 = Struct.check(value, [value], []),
      failures = _Struct$check2[0],
      result = _Struct$check2[1];

    if (failures) {
      throw new Error(failures);
    } else {
      return result;
    }
  };

  Struct.validate = function (value) {
    var _Struct$check3 = Struct.check(value, [value], []),
      failures = _Struct$check3[0],
      result = _Struct$check3[1];

    if (failures) {
      return [new Error(failures)];
    } else {
      return [undefined, result];
    }
  };

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var failures = [Struct.fail({
      value: value,
      branch: branch,
      path: path
    })];
    return [failures];
  };

  Struct.fail = function (obj) {
    return _objectSpread2({}, obj, {
      type: 'type' in obj ? obj.type : Struct.type
    });
  };

  return Struct;
};

var createArray = function createArray(schema, defaults, struct) {
  invariant(Array.isArray(schema) && schema.length === 1, "Array structs must be defined as an array with one element, but you passed: " + schema);
  var Element = struct(schema[0], undefined);
  var Struct = createStruct({
    kind: 'array',
    type: Element.type + "[]",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    if (!Array.isArray(value)) {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = [];
    var failures = [];

    for (var i = 0; i < value.length; i++) {
      var v = value[i];

      var _Element$check = Element.check(v, branch.concat(v), path.concat(i)),
        efs = _Element$check[0],
        er = _Element$check[1];

      if (efs) {
        failures.push.apply(failures, efs);
        continue;
      }

      result[i] = er;
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createDynamic = function createDynamic(schema, defaults, struct) {
  invariant(typeof schema === 'function', "Dynamic structs must be defined as a function, but you passed: " + schema);
  var Dynamic = createStruct({
    kind: 'dynamic',
    type: "dynamic<\u2026>",
    defaults: defaults,
    struct: struct
  });

  Dynamic.check = function (value, branch, path) {
    if (value === void 0) {
      value = Dynamic.default();
    }

    var Struct = schema(value, branch, path);
    return Struct.check(value, branch, path);
  };

  return Dynamic;
};

var createEnum = function createEnum(schema, defaults, struct) {
  invariant(Array.isArray(schema), "Enum structs must be defined as an array, but you passed: " + schema);

  var validator = function validator(value) {
    return schema.includes(value);
  };

  var Struct = struct(validator, defaults);
  Struct.kind = 'enum';
  Struct.type = schema.map(function (s) {
    return typeof s === 'string' ? "\"" + s + "\"" : "" + s;
  }).join(' | ');
  return Struct;
};

var createFunction = function createFunction(schema, defaults, struct) {
  var Struct = createStruct({
    kind: 'function',
    type: "function<\u2026>",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var result = schema(value, branch, path);

    if (result === true) {
      return [undefined, value];
    }

    var failures = [];

    if (result === false) {
      failures.push(Struct.fail({
        value: value,
        branch: branch,
        path: path
      }));
    } else if (Array.isArray(result) && result.length > 0) {
      for (var _iterator = result, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
        var _ref;

        if (_isArray) {
          if (_i >= _iterator.length) break;
          _ref = _iterator[_i++];
        } else {
          _i = _iterator.next();
          if (_i.done) break;
          _ref = _i.value;
        }

        var r = _ref;
        failures.push(Struct.fail(_objectSpread2({
          value: value,
          branch: branch,
          path: path
        }, r)));
      }
    } else if (typeof result === 'object') {
      failures.push(Struct.fail(_objectSpread2({
        value: value,
        branch: branch,
        path: path
      }, result)));
    } else {
      invariant(false, "Validator functions must return a boolean, a failure object, or an array of failure objects, but you passed: " + result);
    }

    return [failures];
  };

  return Struct;
};

var createInstance = function createInstance(schema, defaults, struct) {
  invariant(typeof schema === 'function', "Instance structs must be defined as a function, but you passed: " + schema);

  var validator = function validator(value) {
    return value instanceof schema;
  };

  var Struct = struct(validator, defaults);
  Struct.kind = 'instance';
  Struct.type = "instance<" + schema.name + ">";
  return Struct;
};

var createInterface = function createInterface(schema, defaults, struct) {
  invariant(typeof schema === 'object', "Interface structs must be defined as an object, but you passed: " + schema);
  var Props = {};

  for (var key in schema) {
    Props[key] = struct(schema[key]);
  }

  var Struct = createStruct({
    kind: 'interface',
    type: "interface<{" + Object.keys(schema).join() + "}>",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    if (typeof value !== 'object' && typeof value !== 'function') {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var failures = [];

    for (var k in Props) {
      var Prop = Props[k];
      var v = value[k];

      var _Prop$check = Prop.check(v, branch.concat(v), path.concat(k)),
        pfs = _Prop$check[0];

      if (pfs) {
        failures.push.apply(failures, pfs);
      }
    }

    return failures.length ? [failures] : [undefined, value];
  };

  return Struct;
};

var createIntersection = function createIntersection(schema, defaults, struct) {
  invariant(Array.isArray(schema) && schema.length !== 0, "Intersection structs must be defined as a non-empty array, but you passed: " + schema);
  var Structs = schema.map(function (sch) {
    return struct(sch);
  });
  var type = Structs.map(function (s) {
    return s.type;
  }).join(' & ');
  var Struct = createStruct({
    kind: 'intersection',
    type: type,
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var result = value;

    for (var _iterator = Structs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _struct = _ref;

      var _struct$check = _struct.check(value, branch, path),
        fs = _struct$check[0],
        v = _struct$check[1];

      if (fs) {
        return [[Struct.fail({
          value: value,
          branch: branch,
          path: path
        })]];
      } else {
        result = v;
      }
    }

    return [undefined, result];
  };

  return Struct;
};

var createLazy = function createLazy(schema, defaults, struct) {
  invariant(typeof schema === 'function', "Lazy structs must be defined as a function, but you passed: " + schema);
  var Lazy = createStruct({
    kind: 'lazy',
    type: "lazy<\u2026>",
    defaults: defaults,
    struct: struct
  });

  Lazy.check = function () {
    Object.assign(Lazy, schema());
    return Lazy.check.apply(Lazy, arguments);
  };

  return Lazy;
};

var createSize = function createSize(schema, defaults, struct) {
  invariant(Array.isArray(schema) && schema.length === 2 && schema.every(function (n) {
    return typeof n === 'number';
  }), "Size structs must be defined as an array with two number elements, but you passed: " + schema);
  var min = schema[0],
    max = schema[1];

  var validator = function validator(value) {
    return value != null && typeof value.length === 'number' && value.length >= min && value.length <= max;
  };

  var Struct = struct(validator, defaults);
  Struct.kind = 'size';
  Struct.type = "size<" + min + "," + max + ">";
  return Struct;
};

var createLiteral = function createLiteral(schema, defaults, struct) {
  var validator = function validator(value) {
    return value === schema;
  };

  var Struct = struct(validator, defaults);
  Struct.kind = 'literal';
  Struct.type = typeof schema === 'string' ? "\"" + schema + "\"" : "" + schema;
  return Struct;
};

var createObject = function createObject(schema, defaults, struct) {
  invariant(typeof schema === 'object', "Object structs must be defined as an object, but you passed: " + schema);
  var Props = {};

  for (var key in schema) {
    Props[key] = struct(schema[key]);
  }

  var Struct = createStruct({
    kind: 'object',
    type: "{" + Object.keys(schema).join() + "}",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var d = Struct.default();

    if (value === undefined) {
      value = d;
    }

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = {};
    var failures = [];
    var keys = new Set(Object.keys(Props).concat(Object.keys(value)));

    for (var _iterator = keys, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var k = _ref;
      var v = value[k];
      var p = path.concat(k);
      var b = branch.concat(v);
      var Prop = Props[k];

      if (v === undefined && d != null && k in d) {
        v = typeof d[k] === 'function' ? d[k](value, branch, path) : d[k];
      }

      if (!(k in Props)) {
        failures.push(Struct.fail({
          type: undefined,
          value: v,
          path: p,
          branch: value
        }));
        continue;
      }

      var _Prop$check = Prop.check(v, b, p),
        pfs = _Prop$check[0],
        pr = _Prop$check[1];

      if (pfs) {
        failures.push.apply(failures, pfs);
      } else if (pr !== undefined && k in Props) {
        result[k] = pr;
      }
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createPartial = function createPartial(schema, defaults, struct) {
  invariant(typeof schema === 'object', "Partial structs must be defined as an object, but you passed: " + schema);
  var Props = {};

  for (var key in schema) {
    Props[key] = struct.union([schema[key], 'undefined']);
  }

  var Struct = createStruct({
    kind: 'object',
    type: "{" + Object.keys(schema).join() + "}",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var d = Struct.default();

    if (value === undefined) {
      value = d;
    }

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = {};
    var failures = [];

    for (var _iterator = value, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var k = _ref;
      var v = value[k];
      var p = path.concat(k);
      var b = branch.concat(v);
      var Prop = Props[k];

      if (v === undefined && d != null && k in d) {
        v = typeof d[k] === 'function' ? d[k](value, branch, path) : d[k];
      }

      if (!(k in Props)) {
        failures.push(Struct.fail({
          type: undefined,
          value: v,
          path: p,
          branch: value
        }));
        continue;
      }

      var _Prop$check = Prop.check(v, b, p),
        pfs = _Prop$check[0],
        pr = _Prop$check[1];

      if (pfs) {
        failures.push.apply(failures, pfs);
      } else if (pr !== undefined && k in Props) {
        result[k] = pr;
      }
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createPick = function createPick(schema, defaults, struct) {
  invariant(typeof schema === 'object', "Pick structs must be defined as an object, but you passed: " + schema);
  var Props = {};

  for (var key in schema) {
    Props[key] = struct(schema[key]);
  }

  var Struct = createStruct({
    kind: 'pick',
    type: "pick<{" + Object.keys(schema).join() + "}>",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    var d = Struct.default();

    if (value === undefined) {
      value = d;
    }

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = {};
    var failures = [];

    for (var k in Props) {
      var v = value[k];
      var p = path.concat(k);
      var b = branch.concat(v);
      var Prop = Props[k];

      if (v === undefined && d != null && k in d) {
        v = typeof d[k] === 'function' ? d[k](value, branch, path) : d[k];
      }

      var _Prop$check = Prop.check(v, b, p),
        pfs = _Prop$check[0],
        pr = _Prop$check[1];

      if (pfs) {
        failures.push.apply(failures, pfs);
      } else if (pr !== undefined && k in Props) {
        result[k] = pr;
      }
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createRecord = function createRecord(schema, defaults, struct) {
  invariant(Array.isArray(schema) && schema.length === 2, "Record structs must be defined as an array with two elements, but you passed: " + schema);
  var Key = struct(schema[0]);
  var Value = struct(schema[1]);
  var Struct = createStruct({
    kind: 'record',
    type: "record<" + Key.type + "," + Value.type + ">",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    // Record structs have a special default handling behavior, where the defaults
    // are for the entries themselves, not for the entire value. So we can't use
    // JavaScript's built-in default handling here.
    var defs = Struct.default();
    value = defs ? _objectSpread2({}, defs, {}, value) : value;

    if (kindOf(value) !== 'object') {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = {};
    var failures = [];

    for (var k in value) {
      var v = value[k];
      var p = path.concat(k);
      var b = branch.concat(v);

      var _Key$check = Key.check(k, b, p),
        kfs = _Key$check[0],
        kr = _Key$check[1];

      if (kfs) {
        failures.push.apply(failures, kfs);
      } else {
        var _Value$check = Value.check(v, b, p),
          vfs = _Value$check[0],
          vr = _Value$check[1];

        if (vfs) {
          failures.push.apply(failures, vfs);
        } else {
          result[kr] = vr;
        }
      }
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createScalar = function createScalar(schema, defaults, struct) {
  invariant(typeof schema === 'string', "Scalar structs must be defined as a string, but you passed: " + schema);
  var Types = struct.Types;
  invariant(schema in Types, "No struct validator function found for type \"" + schema + "\".");
  var Struct = struct(Types[schema], defaults);
  Struct.kind = 'scalar';
  Struct.type = schema;
  return Struct;
};

var createShorthand = function createShorthand(schema, defaults, struct) {
  if (isStruct(schema)) {
    return schema;
  }

  if (Array.isArray(schema)) {
    if (schema.length === 1) {
      var _schema = schema,
        first = _schema[0];
      return struct.array([first], defaults);
    } else if (schema.length > 1) {
      return struct.tuple(schema, defaults);
    }
  }

  if (typeof schema === 'function') {
    return struct.function(schema, defaults);
  }

  if (typeof schema === 'object') {
    return struct.object(schema, defaults);
  }

  if (typeof schema === 'string') {
    var optional = false;
    var Struct;

    if (schema.endsWith('?')) {
      optional = true;
      schema = schema.slice(0, -1);
    }

    if (schema.includes('|')) {
      var scalars = schema.split(/\s*\|\s*/g);
      Struct = struct.union(scalars, defaults);
    } else if (schema.includes('&')) {
      var _scalars = schema.split(/\s*&\s*/g);

      Struct = struct.intersection(_scalars, defaults);
    } else {
      Struct = struct.scalar(schema, defaults);
    }

    if (optional) {
      Struct = struct.union([Struct, 'undefined'], undefined);
    }

    return Struct;
  }

  throw new Error("A schema definition must be an object, array, string or function, but you passed: " + schema);
};

var createTuple = function createTuple(schema, defaults, struct) {
  invariant(Array.isArray(schema), "Tuple structs must be defined as an array, but you passed: " + schema);
  var Elements = schema.map(function (s) {
    return struct(s);
  });
  var Struct = createStruct({
    kind: 'tuple',
    type: "[" + Elements.map(function (S) {
      return S.type;
    }).join() + "]",
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    if (!Array.isArray(value)) {
      return [[Struct.fail({
        value: value,
        branch: branch,
        path: path
      })]];
    }

    var result = [];
    var failures = [];
    var length = Math.max(value.length, Elements.length);

    for (var i = 0; i < length; i++) {
      var Element = Elements[i];
      var v = value[i];
      var p = path.concat(i);
      var b = branch.concat(v);

      if (!Element) {
        failures.push(Struct.fail({
          type: undefined,
          value: v,
          path: p,
          branch: b
        }));
      } else {
        var _Element$check = Element.check(v, b, p),
          efs = _Element$check[0],
          er = _Element$check[1];

        if (efs) {
          failures.push.apply(failures, efs);
        } else {
          result[i] = er;
        }
      }
    }

    return failures.length ? [failures] : [undefined, result];
  };

  return Struct;
};

var createUnion = function createUnion(schema, defaults, struct) {
  invariant(Array.isArray(schema) && schema.length !== 0, "Union structs must be defined as a non-empty array, but you passed: " + schema);
  var Structs = schema.map(function (sch) {
    return struct(sch);
  });
  var type = Structs.map(function (s) {
    return s.type;
  }).join(' | ');
  var Struct = createStruct({
    kind: 'union',
    type: type,
    defaults: defaults,
    struct: struct
  });

  Struct.check = function (value, branch, path) {
    if (value === void 0) {
      value = Struct.default();
    }

    for (var _iterator = Structs, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _iterator[Symbol.iterator](); ;) {
      var _ref;

      if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
      } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
      }

      var _struct = _ref;

      var _struct$check = _struct.check(value, branch, path),
        fs = _struct$check[0],
        v = _struct$check[1];

      if (!fs) {
        return [undefined, v];
      }
    }

    return [[Struct.fail({
      value: value,
      branch: branch,
      path: path
    })]];
  };

  return Struct;
};

/**
 * Create a struct singleton with settings that include your own domain-specific
 * data `types`, and an optional custom `Error` class.
 */

var superstruct = function superstruct(settings) {
  if (settings === void 0) {
    settings = {};
  }

  var struct = function struct(schema, defaults) {
    return createShorthand(schema, defaults, struct);
  };

  struct.array = function (schema, defaults) {
    return createArray(schema, defaults, struct);
  };

  struct.dynamic = function (schema, defaults) {
    return createDynamic(schema, defaults, struct);
  };

  struct.enum = function (schema, defaults) {
    return createEnum(schema, defaults, struct);
  };

  struct.function = function (schema, defaults) {
    return createFunction(schema, defaults, struct);
  };

  struct.instance = function (schema, defaults) {
    return createInstance(schema, defaults, struct);
  };

  struct.interface = function (schema, defaults) {
    return createInterface(schema, defaults, struct);
  };

  struct.intersection = function (schema, defaults) {
    return createIntersection(schema, defaults, struct);
  };

  struct.lazy = function (schema, defaults) {
    return createLazy(schema, defaults, struct);
  };

  struct.literal = function (schema, defaults) {
    return createLiteral(schema, defaults, struct);
  };

  struct.object = function (schema, defaults) {
    return createObject(schema, defaults, struct);
  };

  struct.optional = function (schema, defaults) {
    return createUnion([schema, 'undefined'], defaults, struct);
  };

  struct.partial = function (schema, defaults) {
    return createPartial(schema, defaults, struct);
  };

  struct.pick = function (schema, defaults) {
    return createPick(schema, defaults, struct);
  };

  struct.record = function (schema, defaults) {
    return createRecord(schema, defaults, struct);
  };

  struct.scalar = function (schema, defaults) {
    return createScalar(schema, defaults, struct);
  };

  struct.size = function (schema, defaults) {
    return createSize(schema, defaults, struct);
  };

  struct.tuple = function (schema, defaults) {
    return createTuple(schema, defaults, struct);
  };

  struct.union = function (schema, defaults) {
    return createUnion(schema, defaults, struct);
  };

  struct.Error = settings.error || StructError;
  struct.Types = _objectSpread2({}, Types, {}, settings.types);
  return struct;
};

/**
 * The singleton instance of Superstruct that is exported by default, configured
 * with types for all of the JavaScript built-in data types.
 *
 * You can use it if you don't need any custom types. However, if you do want to
 * define custom types, use the [[superstruct]] factory to configure your own
 * [[Superstruct]] instance.
 */

var struct = superstruct();

let pendingIds = 0;
let callbackIds = 0;
const pending = new Map();
const callbacks = new Map();

const createWorker = (workerPath, workerName, workerMsgId) => {
  const worker = new Worker(workerPath, { name: workerName });

  worker.addEventListener('message', ({ data }) => {
    if (data) {
      const workerMsg = data[0];
      const id = data[1];
      const value = data[2];

      if (workerMsg === workerMsgId) {
        const err = data[3];
        const [resolve, reject, callbackIds] = pending.get(id);
        pending.delete(id);

        if (err) {
          reject(err);
        } else {
          if (callbackIds) {
            callbackIds.forEach(id => callbacks.delete(id));
          }
          resolve(value);
        }
      } else if (workerMsg === workerMsgId + '.cb') {
        try {
          callbacks.get(id)(...value);
        } catch (e) {
          console.error(e);
        }
      }
    }
  });

  return worker;
};

const createWorkerProxy = (worker, workerMsgId, exportedMethod) => (
  (...args) => new Promise((resolve, reject) => {
    let pendingId = pendingIds++;
    let i = 0;
    let argLen = args.length;
    let mainData = [resolve, reject];
    pending.set(pendingId, mainData);

    for (; i < argLen; i++) {
      if (typeof args[i] === 'function') {
        const callbackId = callbackIds++;
        callbacks.set(callbackId, args[i]);
        args[i] = [workerMsgId + '.cb', callbackId];
        (mainData[2] = mainData[2] || []).push(callbackId);
      }
    }
    const postMessage = (w) => (
      w.postMessage(
        [workerMsgId, pendingId, exportedMethod, args],
        args.filter(a => a instanceof ArrayBuffer)
      )
    );
    if (worker.then) {
      worker.then(postMessage);
    } else {
      postMessage(worker);
    }
  })
);

const workerName = 'jmespath.worker';
const workerMsgId = 'stencil.jmespath.worker';
const workerPath = /*@__PURE__*/new URL('jmespath.worker-6b65b82d.js', import.meta.url).href;
const worker = /*@__PURE__*/createWorker(workerPath, workerName, workerMsgId);

const jmespath = /*@__PURE__*/createWorkerProxy(worker, workerMsgId, 'jmespath');

// import { jqSearch } from '../workers/jq.worker';
// tslint:disable: object-literal-sort-keys
numberScale.defineScale('genome', {
  base: 1,
  k: 1e3,
  M: 1e6,
  G: 1e9,
  T: 1e12,
  P: 1e15,
  E: 1e18,
  Z: 1e21,
  Y: 1e24,
}, 1);
numberScale.defineScale('filesize', {
  '': 1024 ** 0,
  k: 1024 ** 1,
  M: 1024 ** 2,
  G: 1024 ** 3,
  T: 1024 ** 4,
  P: 1024 ** 5,
}, 1);
// tslint:enable: object-literal-sort-keys
const CoordinateTuple = struct(['number', 'number']);
const Coordinate = struct({ x: 'number', y: 'number' });
const RawHistogram = struct([CoordinateTuple]);
const Histogram = struct([Coordinate]);
const validateArray = (arrayIn) => {
  if (!Array.isArray(arrayIn))
    return arrayIn;
  try {
    RawHistogram(arrayIn);
    return arrayIn.map(([x, y]) => ({ x, y }));
  }
  catch (ignore) {
    // ignore
  }
  try {
    Histogram(arrayIn);
    const arrayOut = Object.entries(arrayIn.reduce((mergedCoordinates, { x, y }) => {
      if (y === 0)
        return mergedCoordinates;
      const xDefined = mergedCoordinates[x];
      mergedCoordinates[x] = xDefined ? mergedCoordinates[x] + y : y;
      return mergedCoordinates;
    }, {})).map(coords => ({ x: +coords[0], y: coords[1] }));
    return arrayOut;
  }
  catch (ignore) {
    // ignore
  }
  return arrayIn;
};
const transformValue = async (value, data) => {
  const isArrayValue = Array.isArray(value);
  if (typeof value === 'string' || typeof value === 'boolean' || typeof value === 'number' || isArrayValue) {
    return isArrayValue ? value : [value];
  }
  return Promise.all(Object.entries(value).map(async ([func, val]) => {
    return applyFunction(func, val, data);
  }));
};
const applyFunction = async (func, val, data) => {
  let result;
  let arg;
  let precision;
  let unit;
  let dividend;
  let divisor;
  switch (func) {
    case 'fn:sum':
      result = (await transformValue(val, data))[0] || [];
      return result.reduce((a, b) => a + b, 0);
    case 'fn:divide':
      [dividend, divisor] = val;
      dividend = typeof dividend === 'number' ? dividend : (await transformValue(dividend, data))[0] || 0;
      divisor = typeof divisor === 'number' ? divisor : (await transformValue(divisor, data))[0] || 0;
      return dividend / divisor;
    case 'fn:mod':
      [dividend, divisor] = val;
      dividend = typeof dividend === 'number' ? dividend : (await transformValue(dividend, data))[0] || 0;
      divisor = typeof divisor === 'number' ? divisor : (await transformValue(divisor, data))[0] || 0;
      return dividend % divisor;
    case 'fn:formatNumber':
      [arg, precision, unit] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      const formattedNumber = numberScale(result, {
        precision,
        recursive: 0,
        scale: 'SI',
        unit: unit || '',
      });
      const hasOne = (/[\d\.]+/g.exec(formattedNumber) || [''])[0] === '1';
      return `${formattedNumber}${hasOne ? '' : 's'}`;
    case 'fn:toFixed':
      [arg, precision, unit] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      return `${Number.parseFloat(result).toFixed(precision)}${unit || ''}`;
    case 'fn:mode':
      [arg, precision] = val;
      result = (await transformValue(arg, data))[0] || 0.0;
      result = result
        .sort((a, b) => a - b)
        .reduce((valueCount, newValue) => {
          const valueKey = Number.parseFloat(newValue).toFixed(precision);
          valueCount[valueKey] = (valueCount[valueKey] || 0) + 1;
          if (valueCount[valueKey] >= valueCount.modeCount) {
            valueCount.mode = newValue;
            valueCount.modeCount = valueCount[valueKey];
          }
          return valueCount;
        }, { mode: 0, modeCount: 0 });
      return result.mode;
    case 'fn:uniq':
      result = (await transformValue(val, data))[0] || [];
      return result.reduce((a, b) => {
        !a.includes(b) && a.push(b);
        return a;
      }, []);
    case 'fn:map':
      return Promise.all(val.map(async (v) => {
        return Object.assign({}, ...(await Promise.all(Object.entries(v).map(async ([mapKey, mapVal]) => {
          const returnVal = await transformValue(mapVal, data);
          return { [mapKey]: typeof returnVal === 'string' ? returnVal : returnVal[0] };
        }))));
      }));
    case 'fn:round':
      return Math.round((await transformValue(val, data))[0] || 0);
    // return (await transformValue(val, data))[0].reduce((a, b) => a + b, 0)
    case 'fn:count':
      return (await transformValue(val, data))[0].length;
    case 'fn:average':
      const averages = (await transformValue(val, data))[0] || [];
      return averages.reduce((a, b) => a + b, 0) / (averages.length || 1);
    case 'fn:jmespath':
      // console.info('JMESPATH', val, data, await jmespath(val, data))
      return jmespath(val, data);
    // case 'fn:jq':
    //   // console.info('JQ', val, data, jqSearch(data, val));
    //   return jqSearch(data, val);
    default:
      break;
  }
  return { [func]: val };
};
const processValue = async (data, value) => {
  if (typeof value === 'string')
    return value;
  const [result] = await transformValue(value, data);
  if (Array.isArray(result)) {
    return validateArray(result);
  }
  if (typeof result === 'number') {
    return result.toLocaleString();
  }
  return result;
};
const mapAttributesToProps = async (attributes, data) => {
  return Object.assign({}, ...(await Promise.all(Object.entries(attributes)
    .filter(([key]) => key.startsWith('@'))
    .map(async ([key, value]) => ({ [key.substr(1)]: await processValue(data, value) })))));
};

export { mapAttributesToProps as m, processValue as p };
