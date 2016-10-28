webpackJsonp([0],{

/***/ 1116:
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/*! tether 1.3.7 */

(function(root, factory) {
  if (true) {
    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
  } else if (typeof exports === 'object') {
    module.exports = factory(require, exports, module);
  } else {
    root.Tether = factory();
  }
}(this, function(require, exports, module) {

'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

var TetherBase = undefined;
if (typeof TetherBase === 'undefined') {
  TetherBase = { modules: [] };
}

var zeroElement = null;

// Same as native getBoundingClientRect, except it takes into account parent <frame> offsets
// if the element lies within a nested document (<frame> or <iframe>-like).
function getActualBoundingClientRect(node) {
  var boundingRect = node.getBoundingClientRect();

  // The original object returned by getBoundingClientRect is immutable, so we clone it
  // We can't use extend because the properties are not considered part of the object by hasOwnProperty in IE9
  var rect = {};
  for (var k in boundingRect) {
    rect[k] = boundingRect[k];
  }

  if (node.ownerDocument !== document) {
    var _frameElement = node.ownerDocument.defaultView.frameElement;
    if (_frameElement) {
      var frameRect = getActualBoundingClientRect(_frameElement);
      rect.top += frameRect.top;
      rect.bottom += frameRect.top;
      rect.left += frameRect.left;
      rect.right += frameRect.left;
    }
  }

  return rect;
}

function getScrollParents(el) {
  // In firefox if the el is inside an iframe with display: none; window.getComputedStyle() will return null;
  // https://bugzilla.mozilla.org/show_bug.cgi?id=548397
  var computedStyle = getComputedStyle(el) || {};
  var position = computedStyle.position;
  var parents = [];

  if (position === 'fixed') {
    return [el];
  }

  var parent = el;
  while ((parent = parent.parentNode) && parent && parent.nodeType === 1) {
    var style = undefined;
    try {
      style = getComputedStyle(parent);
    } catch (err) {}

    if (typeof style === 'undefined' || style === null) {
      parents.push(parent);
      return parents;
    }

    var _style = style;
    var overflow = _style.overflow;
    var overflowX = _style.overflowX;
    var overflowY = _style.overflowY;

    if (/(auto|scroll)/.test(overflow + overflowY + overflowX)) {
      if (position !== 'absolute' || ['relative', 'absolute', 'fixed'].indexOf(style.position) >= 0) {
        parents.push(parent);
      }
    }
  }

  parents.push(el.ownerDocument.body);

  // If the node is within a frame, account for the parent window scroll
  if (el.ownerDocument !== document) {
    parents.push(el.ownerDocument.defaultView);
  }

  return parents;
}

var uniqueId = (function () {
  var id = 0;
  return function () {
    return ++id;
  };
})();

var zeroPosCache = {};
var getOrigin = function getOrigin() {
  // getBoundingClientRect is unfortunately too accurate.  It introduces a pixel or two of
  // jitter as the user scrolls that messes with our ability to detect if two positions
  // are equivilant or not.  We place an element at the top left of the page that will
  // get the same jitter, so we can cancel the two out.
  var node = zeroElement;
  if (!node) {
    node = document.createElement('div');
    node.setAttribute('data-tether-id', uniqueId());
    extend(node.style, {
      top: 0,
      left: 0,
      position: 'absolute'
    });

    document.body.appendChild(node);

    zeroElement = node;
  }

  var id = node.getAttribute('data-tether-id');
  if (typeof zeroPosCache[id] === 'undefined') {
    zeroPosCache[id] = getActualBoundingClientRect(node);

    // Clear the cache when this position call is done
    defer(function () {
      delete zeroPosCache[id];
    });
  }

  return zeroPosCache[id];
};

function removeUtilElements() {
  if (zeroElement) {
    document.body.removeChild(zeroElement);
  }
  zeroElement = null;
};

function getBounds(el) {
  var doc = undefined;
  if (el === document) {
    doc = document;
    el = document.documentElement;
  } else {
    doc = el.ownerDocument;
  }

  var docEl = doc.documentElement;

  var box = getActualBoundingClientRect(el);

  var origin = getOrigin();

  box.top -= origin.top;
  box.left -= origin.left;

  if (typeof box.width === 'undefined') {
    box.width = document.body.scrollWidth - box.left - box.right;
  }
  if (typeof box.height === 'undefined') {
    box.height = document.body.scrollHeight - box.top - box.bottom;
  }

  box.top = box.top - docEl.clientTop;
  box.left = box.left - docEl.clientLeft;
  box.right = doc.body.clientWidth - box.width - box.left;
  box.bottom = doc.body.clientHeight - box.height - box.top;

  return box;
}

function getOffsetParent(el) {
  return el.offsetParent || document.documentElement;
}

var _scrollBarSize = null;
function getScrollBarSize() {
  if (_scrollBarSize) {
    return _scrollBarSize;
  }
  var inner = document.createElement('div');
  inner.style.width = '100%';
  inner.style.height = '200px';

  var outer = document.createElement('div');
  extend(outer.style, {
    position: 'absolute',
    top: 0,
    left: 0,
    pointerEvents: 'none',
    visibility: 'hidden',
    width: '200px',
    height: '150px',
    overflow: 'hidden'
  });

  outer.appendChild(inner);

  document.body.appendChild(outer);

  var widthContained = inner.offsetWidth;
  outer.style.overflow = 'scroll';
  var widthScroll = inner.offsetWidth;

  if (widthContained === widthScroll) {
    widthScroll = outer.clientWidth;
  }

  document.body.removeChild(outer);

  var width = widthContained - widthScroll;

  _scrollBarSize = { width: width, height: width };
  return _scrollBarSize;
}

function extend() {
  var out = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var args = [];

  Array.prototype.push.apply(args, arguments);

  args.slice(1).forEach(function (obj) {
    if (obj) {
      for (var key in obj) {
        if (({}).hasOwnProperty.call(obj, key)) {
          out[key] = obj[key];
        }
      }
    }
  });

  return out;
}

function removeClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.remove(cls);
      }
    });
  } else {
    var regex = new RegExp('(^| )' + name.split(' ').join('|') + '( |$)', 'gi');
    var className = getClassName(el).replace(regex, ' ');
    setClassName(el, className);
  }
}

function addClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    name.split(' ').forEach(function (cls) {
      if (cls.trim()) {
        el.classList.add(cls);
      }
    });
  } else {
    removeClass(el, name);
    var cls = getClassName(el) + (' ' + name);
    setClassName(el, cls);
  }
}

function hasClass(el, name) {
  if (typeof el.classList !== 'undefined') {
    return el.classList.contains(name);
  }
  var className = getClassName(el);
  return new RegExp('(^| )' + name + '( |$)', 'gi').test(className);
}

function getClassName(el) {
  // Can't use just SVGAnimatedString here since nodes within a Frame in IE have
  // completely separately SVGAnimatedString base classes
  if (el.className instanceof el.ownerDocument.defaultView.SVGAnimatedString) {
    return el.className.baseVal;
  }
  return el.className;
}

function setClassName(el, className) {
  el.setAttribute('class', className);
}

function updateClasses(el, add, all) {
  // Of the set of 'all' classes, we need the 'add' classes, and only the
  // 'add' classes to be set.
  all.forEach(function (cls) {
    if (add.indexOf(cls) === -1 && hasClass(el, cls)) {
      removeClass(el, cls);
    }
  });

  add.forEach(function (cls) {
    if (!hasClass(el, cls)) {
      addClass(el, cls);
    }
  });
}

var deferred = [];

var defer = function defer(fn) {
  deferred.push(fn);
};

var flush = function flush() {
  var fn = undefined;
  while (fn = deferred.pop()) {
    fn();
  }
};

var Evented = (function () {
  function Evented() {
    _classCallCheck(this, Evented);
  }

  _createClass(Evented, [{
    key: 'on',
    value: function on(event, handler, ctx) {
      var once = arguments.length <= 3 || arguments[3] === undefined ? false : arguments[3];

      if (typeof this.bindings === 'undefined') {
        this.bindings = {};
      }
      if (typeof this.bindings[event] === 'undefined') {
        this.bindings[event] = [];
      }
      this.bindings[event].push({ handler: handler, ctx: ctx, once: once });
    }
  }, {
    key: 'once',
    value: function once(event, handler, ctx) {
      this.on(event, handler, ctx, true);
    }
  }, {
    key: 'off',
    value: function off(event, handler) {
      if (typeof this.bindings === 'undefined' || typeof this.bindings[event] === 'undefined') {
        return;
      }

      if (typeof handler === 'undefined') {
        delete this.bindings[event];
      } else {
        var i = 0;
        while (i < this.bindings[event].length) {
          if (this.bindings[event][i].handler === handler) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }, {
    key: 'trigger',
    value: function trigger(event) {
      if (typeof this.bindings !== 'undefined' && this.bindings[event]) {
        var i = 0;

        for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
          args[_key - 1] = arguments[_key];
        }

        while (i < this.bindings[event].length) {
          var _bindings$event$i = this.bindings[event][i];
          var handler = _bindings$event$i.handler;
          var ctx = _bindings$event$i.ctx;
          var once = _bindings$event$i.once;

          var context = ctx;
          if (typeof context === 'undefined') {
            context = this;
          }

          handler.apply(context, args);

          if (once) {
            this.bindings[event].splice(i, 1);
          } else {
            ++i;
          }
        }
      }
    }
  }]);

  return Evented;
})();

TetherBase.Utils = {
  getActualBoundingClientRect: getActualBoundingClientRect,
  getScrollParents: getScrollParents,
  getBounds: getBounds,
  getOffsetParent: getOffsetParent,
  extend: extend,
  addClass: addClass,
  removeClass: removeClass,
  hasClass: hasClass,
  updateClasses: updateClasses,
  defer: defer,
  flush: flush,
  uniqueId: uniqueId,
  Evented: Evented,
  getScrollBarSize: getScrollBarSize,
  removeUtilElements: removeUtilElements
};
/* globals TetherBase, performance */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x6, _x7, _x8) { var _again = true; _function: while (_again) { var object = _x6, property = _x7, receiver = _x8; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x6 = parent; _x7 = property; _x8 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

if (typeof TetherBase === 'undefined') {
  throw new Error('You must include the utils.js file before tether.js');
}

var _TetherBase$Utils = TetherBase.Utils;
var getScrollParents = _TetherBase$Utils.getScrollParents;
var getBounds = _TetherBase$Utils.getBounds;
var getOffsetParent = _TetherBase$Utils.getOffsetParent;
var extend = _TetherBase$Utils.extend;
var addClass = _TetherBase$Utils.addClass;
var removeClass = _TetherBase$Utils.removeClass;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;
var flush = _TetherBase$Utils.flush;
var getScrollBarSize = _TetherBase$Utils.getScrollBarSize;
var removeUtilElements = _TetherBase$Utils.removeUtilElements;

function within(a, b) {
  var diff = arguments.length <= 2 || arguments[2] === undefined ? 1 : arguments[2];

  return a + diff >= b && b >= a - diff;
}

var transformKey = (function () {
  if (typeof document === 'undefined') {
    return '';
  }
  var el = document.createElement('div');

  var transforms = ['transform', 'WebkitTransform', 'OTransform', 'MozTransform', 'msTransform'];
  for (var i = 0; i < transforms.length; ++i) {
    var key = transforms[i];
    if (el.style[key] !== undefined) {
      return key;
    }
  }
})();

var tethers = [];

var position = function position() {
  tethers.forEach(function (tether) {
    tether.position(false);
  });
  flush();
};

function now() {
  if (typeof performance !== 'undefined' && typeof performance.now !== 'undefined') {
    return performance.now();
  }
  return +new Date();
}

(function () {
  var lastCall = null;
  var lastDuration = null;
  var pendingTimeout = null;

  var tick = function tick() {
    if (typeof lastDuration !== 'undefined' && lastDuration > 16) {
      // We voluntarily throttle ourselves if we can't manage 60fps
      lastDuration = Math.min(lastDuration - 16, 250);

      // Just in case this is the last event, remember to position just once more
      pendingTimeout = setTimeout(tick, 250);
      return;
    }

    if (typeof lastCall !== 'undefined' && now() - lastCall < 10) {
      // Some browsers call events a little too frequently, refuse to run more than is reasonable
      return;
    }

    if (pendingTimeout != null) {
      clearTimeout(pendingTimeout);
      pendingTimeout = null;
    }

    lastCall = now();
    position();
    lastDuration = now() - lastCall;
  };

  if (typeof window !== 'undefined' && typeof window.addEventListener !== 'undefined') {
    ['resize', 'scroll', 'touchmove'].forEach(function (event) {
      window.addEventListener(event, tick);
    });
  }
})();

var MIRROR_LR = {
  center: 'center',
  left: 'right',
  right: 'left'
};

var MIRROR_TB = {
  middle: 'middle',
  top: 'bottom',
  bottom: 'top'
};

var OFFSET_MAP = {
  top: 0,
  left: 0,
  middle: '50%',
  center: '50%',
  bottom: '100%',
  right: '100%'
};

var autoToFixedAttachment = function autoToFixedAttachment(attachment, relativeToAttachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (left === 'auto') {
    left = MIRROR_LR[relativeToAttachment.left];
  }

  if (top === 'auto') {
    top = MIRROR_TB[relativeToAttachment.top];
  }

  return { left: left, top: top };
};

var attachmentToOffset = function attachmentToOffset(attachment) {
  var left = attachment.left;
  var top = attachment.top;

  if (typeof OFFSET_MAP[attachment.left] !== 'undefined') {
    left = OFFSET_MAP[attachment.left];
  }

  if (typeof OFFSET_MAP[attachment.top] !== 'undefined') {
    top = OFFSET_MAP[attachment.top];
  }

  return { left: left, top: top };
};

function addOffset() {
  var out = { top: 0, left: 0 };

  for (var _len = arguments.length, offsets = Array(_len), _key = 0; _key < _len; _key++) {
    offsets[_key] = arguments[_key];
  }

  offsets.forEach(function (_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (typeof top === 'string') {
      top = parseFloat(top, 10);
    }
    if (typeof left === 'string') {
      left = parseFloat(left, 10);
    }

    out.top += top;
    out.left += left;
  });

  return out;
}

function offsetToPx(offset, size) {
  if (typeof offset.left === 'string' && offset.left.indexOf('%') !== -1) {
    offset.left = parseFloat(offset.left, 10) / 100 * size.width;
  }
  if (typeof offset.top === 'string' && offset.top.indexOf('%') !== -1) {
    offset.top = parseFloat(offset.top, 10) / 100 * size.height;
  }

  return offset;
}

var parseOffset = function parseOffset(value) {
  var _value$split = value.split(' ');

  var _value$split2 = _slicedToArray(_value$split, 2);

  var top = _value$split2[0];
  var left = _value$split2[1];

  return { top: top, left: left };
};
var parseAttachment = parseOffset;

var TetherClass = (function (_Evented) {
  _inherits(TetherClass, _Evented);

  function TetherClass(options) {
    var _this = this;

    _classCallCheck(this, TetherClass);

    _get(Object.getPrototypeOf(TetherClass.prototype), 'constructor', this).call(this);
    this.position = this.position.bind(this);

    tethers.push(this);

    this.history = [];

    this.setOptions(options, false);

    TetherBase.modules.forEach(function (module) {
      if (typeof module.initialize !== 'undefined') {
        module.initialize.call(_this);
      }
    });

    this.position();
  }

  _createClass(TetherClass, [{
    key: 'getClass',
    value: function getClass() {
      var key = arguments.length <= 0 || arguments[0] === undefined ? '' : arguments[0];
      var classes = this.options.classes;

      if (typeof classes !== 'undefined' && classes[key]) {
        return this.options.classes[key];
      } else if (this.options.classPrefix) {
        return this.options.classPrefix + '-' + key;
      } else {
        return key;
      }
    }
  }, {
    key: 'setOptions',
    value: function setOptions(options) {
      var _this2 = this;

      var pos = arguments.length <= 1 || arguments[1] === undefined ? true : arguments[1];

      var defaults = {
        offset: '0 0',
        targetOffset: '0 0',
        targetAttachment: 'auto auto',
        classPrefix: 'tether'
      };

      this.options = extend(defaults, options);

      var _options = this.options;
      var element = _options.element;
      var target = _options.target;
      var targetModifier = _options.targetModifier;

      this.element = element;
      this.target = target;
      this.targetModifier = targetModifier;

      if (this.target === 'viewport') {
        this.target = document.body;
        this.targetModifier = 'visible';
      } else if (this.target === 'scroll-handle') {
        this.target = document.body;
        this.targetModifier = 'scroll-handle';
      }

      ['element', 'target'].forEach(function (key) {
        if (typeof _this2[key] === 'undefined') {
          throw new Error('Tether Error: Both element and target must be defined');
        }

        if (typeof _this2[key].jquery !== 'undefined') {
          _this2[key] = _this2[key][0];
        } else if (typeof _this2[key] === 'string') {
          _this2[key] = document.querySelector(_this2[key]);
        }
      });

      addClass(this.element, this.getClass('element'));
      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('target'));
      }

      if (!this.options.attachment) {
        throw new Error('Tether Error: You must provide an attachment');
      }

      this.targetAttachment = parseAttachment(this.options.targetAttachment);
      this.attachment = parseAttachment(this.options.attachment);
      this.offset = parseOffset(this.options.offset);
      this.targetOffset = parseOffset(this.options.targetOffset);

      if (typeof this.scrollParents !== 'undefined') {
        this.disable();
      }

      if (this.targetModifier === 'scroll-handle') {
        this.scrollParents = [this.target];
      } else {
        this.scrollParents = getScrollParents(this.target);
      }

      if (!(this.options.enabled === false)) {
        this.enable(pos);
      }
    }
  }, {
    key: 'getTargetBounds',
    value: function getTargetBounds() {
      if (typeof this.targetModifier !== 'undefined') {
        if (this.targetModifier === 'visible') {
          if (this.target === document.body) {
            return { top: pageYOffset, left: pageXOffset, height: innerHeight, width: innerWidth };
          } else {
            var bounds = getBounds(this.target);

            var out = {
              height: bounds.height,
              width: bounds.width,
              top: bounds.top,
              left: bounds.left
            };

            out.height = Math.min(out.height, bounds.height - (pageYOffset - bounds.top));
            out.height = Math.min(out.height, bounds.height - (bounds.top + bounds.height - (pageYOffset + innerHeight)));
            out.height = Math.min(innerHeight, out.height);
            out.height -= 2;

            out.width = Math.min(out.width, bounds.width - (pageXOffset - bounds.left));
            out.width = Math.min(out.width, bounds.width - (bounds.left + bounds.width - (pageXOffset + innerWidth)));
            out.width = Math.min(innerWidth, out.width);
            out.width -= 2;

            if (out.top < pageYOffset) {
              out.top = pageYOffset;
            }
            if (out.left < pageXOffset) {
              out.left = pageXOffset;
            }

            return out;
          }
        } else if (this.targetModifier === 'scroll-handle') {
          var bounds = undefined;
          var target = this.target;
          if (target === document.body) {
            target = document.documentElement;

            bounds = {
              left: pageXOffset,
              top: pageYOffset,
              height: innerHeight,
              width: innerWidth
            };
          } else {
            bounds = getBounds(target);
          }

          var style = getComputedStyle(target);

          var hasBottomScroll = target.scrollWidth > target.clientWidth || [style.overflow, style.overflowX].indexOf('scroll') >= 0 || this.target !== document.body;

          var scrollBottom = 0;
          if (hasBottomScroll) {
            scrollBottom = 15;
          }

          var height = bounds.height - parseFloat(style.borderTopWidth) - parseFloat(style.borderBottomWidth) - scrollBottom;

          var out = {
            width: 15,
            height: height * 0.975 * (height / target.scrollHeight),
            left: bounds.left + bounds.width - parseFloat(style.borderLeftWidth) - 15
          };

          var fitAdj = 0;
          if (height < 408 && this.target === document.body) {
            fitAdj = -0.00011 * Math.pow(height, 2) - 0.00727 * height + 22.58;
          }

          if (this.target !== document.body) {
            out.height = Math.max(out.height, 24);
          }

          var scrollPercentage = this.target.scrollTop / (target.scrollHeight - height);
          out.top = scrollPercentage * (height - out.height - fitAdj) + bounds.top + parseFloat(style.borderTopWidth);

          if (this.target === document.body) {
            out.height = Math.max(out.height, 24);
          }

          return out;
        }
      } else {
        return getBounds(this.target);
      }
    }
  }, {
    key: 'clearCache',
    value: function clearCache() {
      this._cache = {};
    }
  }, {
    key: 'cache',
    value: function cache(k, getter) {
      // More than one module will often need the same DOM info, so
      // we keep a cache which is cleared on each position call
      if (typeof this._cache === 'undefined') {
        this._cache = {};
      }

      if (typeof this._cache[k] === 'undefined') {
        this._cache[k] = getter.call(this);
      }

      return this._cache[k];
    }
  }, {
    key: 'enable',
    value: function enable() {
      var _this3 = this;

      var pos = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      if (!(this.options.addTargetClasses === false)) {
        addClass(this.target, this.getClass('enabled'));
      }
      addClass(this.element, this.getClass('enabled'));
      this.enabled = true;

      this.scrollParents.forEach(function (parent) {
        if (parent !== _this3.target.ownerDocument) {
          parent.addEventListener('scroll', _this3.position);
        }
      });

      if (pos) {
        this.position();
      }
    }
  }, {
    key: 'disable',
    value: function disable() {
      var _this4 = this;

      removeClass(this.target, this.getClass('enabled'));
      removeClass(this.element, this.getClass('enabled'));
      this.enabled = false;

      if (typeof this.scrollParents !== 'undefined') {
        this.scrollParents.forEach(function (parent) {
          parent.removeEventListener('scroll', _this4.position);
        });
      }
    }
  }, {
    key: 'destroy',
    value: function destroy() {
      var _this5 = this;

      this.disable();

      tethers.forEach(function (tether, i) {
        if (tether === _this5) {
          tethers.splice(i, 1);
        }
      });

      // Remove any elements we were using for convenience from the DOM
      if (tethers.length === 0) {
        removeUtilElements();
      }
    }
  }, {
    key: 'updateAttachClasses',
    value: function updateAttachClasses(elementAttach, targetAttach) {
      var _this6 = this;

      elementAttach = elementAttach || this.attachment;
      targetAttach = targetAttach || this.targetAttachment;
      var sides = ['left', 'top', 'bottom', 'right', 'middle', 'center'];

      if (typeof this._addAttachClasses !== 'undefined' && this._addAttachClasses.length) {
        // updateAttachClasses can be called more than once in a position call, so
        // we need to clean up after ourselves such that when the last defer gets
        // ran it doesn't add any extra classes from previous calls.
        this._addAttachClasses.splice(0, this._addAttachClasses.length);
      }

      if (typeof this._addAttachClasses === 'undefined') {
        this._addAttachClasses = [];
      }
      var add = this._addAttachClasses;

      if (elementAttach.top) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.top);
      }
      if (elementAttach.left) {
        add.push(this.getClass('element-attached') + '-' + elementAttach.left);
      }
      if (targetAttach.top) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.top);
      }
      if (targetAttach.left) {
        add.push(this.getClass('target-attached') + '-' + targetAttach.left);
      }

      var all = [];
      sides.forEach(function (side) {
        all.push(_this6.getClass('element-attached') + '-' + side);
        all.push(_this6.getClass('target-attached') + '-' + side);
      });

      defer(function () {
        if (!(typeof _this6._addAttachClasses !== 'undefined')) {
          return;
        }

        updateClasses(_this6.element, _this6._addAttachClasses, all);
        if (!(_this6.options.addTargetClasses === false)) {
          updateClasses(_this6.target, _this6._addAttachClasses, all);
        }

        delete _this6._addAttachClasses;
      });
    }
  }, {
    key: 'position',
    value: function position() {
      var _this7 = this;

      var flushChanges = arguments.length <= 0 || arguments[0] === undefined ? true : arguments[0];

      // flushChanges commits the changes immediately, leave true unless you are positioning multiple
      // tethers (in which case call Tether.Utils.flush yourself when you're done)

      if (!this.enabled) {
        return;
      }

      this.clearCache();

      // Turn 'auto' attachments into the appropriate corner or edge
      var targetAttachment = autoToFixedAttachment(this.targetAttachment, this.attachment);

      this.updateAttachClasses(this.attachment, targetAttachment);

      var elementPos = this.cache('element-bounds', function () {
        return getBounds(_this7.element);
      });

      var width = elementPos.width;
      var height = elementPos.height;

      if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
        var _lastSize = this.lastSize;

        // We cache the height and width to make it possible to position elements that are
        // getting hidden.
        width = _lastSize.width;
        height = _lastSize.height;
      } else {
        this.lastSize = { width: width, height: height };
      }

      var targetPos = this.cache('target-bounds', function () {
        return _this7.getTargetBounds();
      });
      var targetSize = targetPos;

      // Get an actual px offset from the attachment
      var offset = offsetToPx(attachmentToOffset(this.attachment), { width: width, height: height });
      var targetOffset = offsetToPx(attachmentToOffset(targetAttachment), targetSize);

      var manualOffset = offsetToPx(this.offset, { width: width, height: height });
      var manualTargetOffset = offsetToPx(this.targetOffset, targetSize);

      // Add the manually provided offset
      offset = addOffset(offset, manualOffset);
      targetOffset = addOffset(targetOffset, manualTargetOffset);

      // It's now our goal to make (element position + offset) == (target position + target offset)
      var left = targetPos.left + targetOffset.left - offset.left;
      var top = targetPos.top + targetOffset.top - offset.top;

      for (var i = 0; i < TetherBase.modules.length; ++i) {
        var _module2 = TetherBase.modules[i];
        var ret = _module2.position.call(this, {
          left: left,
          top: top,
          targetAttachment: targetAttachment,
          targetPos: targetPos,
          elementPos: elementPos,
          offset: offset,
          targetOffset: targetOffset,
          manualOffset: manualOffset,
          manualTargetOffset: manualTargetOffset,
          scrollbarSize: scrollbarSize,
          attachment: this.attachment
        });

        if (ret === false) {
          return false;
        } else if (typeof ret === 'undefined' || typeof ret !== 'object') {
          continue;
        } else {
          top = ret.top;
          left = ret.left;
        }
      }

      // We describe the position three different ways to give the optimizer
      // a chance to decide the best possible way to position the element
      // with the fewest repaints.
      var next = {
        // It's position relative to the page (absolute positioning when
        // the element is a child of the body)
        page: {
          top: top,
          left: left
        },

        // It's position relative to the viewport (fixed positioning)
        viewport: {
          top: top - pageYOffset,
          bottom: pageYOffset - top - height + innerHeight,
          left: left - pageXOffset,
          right: pageXOffset - left - width + innerWidth
        }
      };

      var doc = this.target.ownerDocument;
      var win = doc.defaultView;

      var scrollbarSize = undefined;
      if (win.innerHeight > doc.documentElement.clientHeight) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.bottom -= scrollbarSize.height;
      }

      if (win.innerWidth > doc.documentElement.clientWidth) {
        scrollbarSize = this.cache('scrollbar-size', getScrollBarSize);
        next.viewport.right -= scrollbarSize.width;
      }

      if (['', 'static'].indexOf(doc.body.style.position) === -1 || ['', 'static'].indexOf(doc.body.parentElement.style.position) === -1) {
        // Absolute positioning in the body will be relative to the page, not the 'initial containing block'
        next.page.bottom = doc.body.scrollHeight - top - height;
        next.page.right = doc.body.scrollWidth - left - width;
      }

      if (typeof this.options.optimizations !== 'undefined' && this.options.optimizations.moveElement !== false && !(typeof this.targetModifier !== 'undefined')) {
        (function () {
          var offsetParent = _this7.cache('target-offsetparent', function () {
            return getOffsetParent(_this7.target);
          });
          var offsetPosition = _this7.cache('target-offsetparent-bounds', function () {
            return getBounds(offsetParent);
          });
          var offsetParentStyle = getComputedStyle(offsetParent);
          var offsetParentSize = offsetPosition;

          var offsetBorder = {};
          ['Top', 'Left', 'Bottom', 'Right'].forEach(function (side) {
            offsetBorder[side.toLowerCase()] = parseFloat(offsetParentStyle['border' + side + 'Width']);
          });

          offsetPosition.right = doc.body.scrollWidth - offsetPosition.left - offsetParentSize.width + offsetBorder.right;
          offsetPosition.bottom = doc.body.scrollHeight - offsetPosition.top - offsetParentSize.height + offsetBorder.bottom;

          if (next.page.top >= offsetPosition.top + offsetBorder.top && next.page.bottom >= offsetPosition.bottom) {
            if (next.page.left >= offsetPosition.left + offsetBorder.left && next.page.right >= offsetPosition.right) {
              // We're within the visible part of the target's scroll parent
              var scrollTop = offsetParent.scrollTop;
              var scrollLeft = offsetParent.scrollLeft;

              // It's position relative to the target's offset parent (absolute positioning when
              // the element is moved to be a child of the target's offset parent).
              next.offset = {
                top: next.page.top - offsetPosition.top + scrollTop - offsetBorder.top,
                left: next.page.left - offsetPosition.left + scrollLeft - offsetBorder.left
              };
            }
          }
        })();
      }

      // We could also travel up the DOM and try each containing context, rather than only
      // looking at the body, but we're gonna get diminishing returns.

      this.move(next);

      this.history.unshift(next);

      if (this.history.length > 3) {
        this.history.pop();
      }

      if (flushChanges) {
        flush();
      }

      return true;
    }

    // THE ISSUE
  }, {
    key: 'move',
    value: function move(pos) {
      var _this8 = this;

      if (!(typeof this.element.parentNode !== 'undefined')) {
        return;
      }

      var same = {};

      for (var type in pos) {
        same[type] = {};

        for (var key in pos[type]) {
          var found = false;

          for (var i = 0; i < this.history.length; ++i) {
            var point = this.history[i];
            if (typeof point[type] !== 'undefined' && !within(point[type][key], pos[type][key])) {
              found = true;
              break;
            }
          }

          if (!found) {
            same[type][key] = true;
          }
        }
      }

      var css = { top: '', left: '', right: '', bottom: '' };

      var transcribe = function transcribe(_same, _pos) {
        var hasOptimizations = typeof _this8.options.optimizations !== 'undefined';
        var gpu = hasOptimizations ? _this8.options.optimizations.gpu : null;
        if (gpu !== false) {
          var yPos = undefined,
              xPos = undefined;
          if (_same.top) {
            css.top = 0;
            yPos = _pos.top;
          } else {
            css.bottom = 0;
            yPos = -_pos.bottom;
          }

          if (_same.left) {
            css.left = 0;
            xPos = _pos.left;
          } else {
            css.right = 0;
            xPos = -_pos.right;
          }

          if (window.matchMedia) {
            // HubSpot/tether#207
            var retina = window.matchMedia('only screen and (min-resolution: 1.3dppx)').matches || window.matchMedia('only screen and (-webkit-min-device-pixel-ratio: 1.3)').matches;
            if (!retina) {
              xPos = Math.round(xPos);
              yPos = Math.round(yPos);
            }
          }

          css[transformKey] = 'translateX(' + xPos + 'px) translateY(' + yPos + 'px)';

          if (transformKey !== 'msTransform') {
            // The Z transform will keep this in the GPU (faster, and prevents artifacts),
            // but IE9 doesn't support 3d transforms and will choke.
            css[transformKey] += " translateZ(0)";
          }
        } else {
          if (_same.top) {
            css.top = _pos.top + 'px';
          } else {
            css.bottom = _pos.bottom + 'px';
          }

          if (_same.left) {
            css.left = _pos.left + 'px';
          } else {
            css.right = _pos.right + 'px';
          }
        }
      };

      var moved = false;
      if ((same.page.top || same.page.bottom) && (same.page.left || same.page.right)) {
        css.position = 'absolute';
        transcribe(same.page, pos.page);
      } else if ((same.viewport.top || same.viewport.bottom) && (same.viewport.left || same.viewport.right)) {
        css.position = 'fixed';
        transcribe(same.viewport, pos.viewport);
      } else if (typeof same.offset !== 'undefined' && same.offset.top && same.offset.left) {
        (function () {
          css.position = 'absolute';
          var offsetParent = _this8.cache('target-offsetparent', function () {
            return getOffsetParent(_this8.target);
          });

          if (getOffsetParent(_this8.element) !== offsetParent) {
            defer(function () {
              _this8.element.parentNode.removeChild(_this8.element);
              offsetParent.appendChild(_this8.element);
            });
          }

          transcribe(same.offset, pos.offset);
          moved = true;
        })();
      } else {
        css.position = 'absolute';
        transcribe({ top: true, left: true }, pos.page);
      }

      if (!moved) {
        var offsetParentIsBody = true;
        var currentNode = this.element.parentNode;
        while (currentNode && currentNode.nodeType === 1 && currentNode.tagName !== 'BODY') {
          if (getComputedStyle(currentNode).position !== 'static') {
            offsetParentIsBody = false;
            break;
          }

          currentNode = currentNode.parentNode;
        }

        if (!offsetParentIsBody) {
          this.element.parentNode.removeChild(this.element);
          this.element.ownerDocument.body.appendChild(this.element);
        }
      }

      // Any css change will trigger a repaint, so let's avoid one if nothing changed
      var writeCSS = {};
      var write = false;
      for (var key in css) {
        var val = css[key];
        var elVal = this.element.style[key];

        if (elVal !== val) {
          write = true;
          writeCSS[key] = val;
        }
      }

      if (write) {
        defer(function () {
          extend(_this8.element.style, writeCSS);
          _this8.trigger('repositioned');
        });
      }
    }
  }]);

  return TetherClass;
})(Evented);

TetherClass.modules = [];

TetherBase.position = position;

var Tether = extend(TetherClass, TetherBase);
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var extend = _TetherBase$Utils.extend;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

var BOUNDS_FORMAT = ['left', 'top', 'right', 'bottom'];

function getBoundingRect(tether, to) {
  if (to === 'scrollParent') {
    to = tether.scrollParents[0];
  } else if (to === 'window') {
    to = [pageXOffset, pageYOffset, innerWidth + pageXOffset, innerHeight + pageYOffset];
  }

  if (to === document) {
    to = to.documentElement;
  }

  if (typeof to.nodeType !== 'undefined') {
    (function () {
      var node = to;
      var size = getBounds(to);
      var pos = size;
      var style = getComputedStyle(to);

      to = [pos.left, pos.top, size.width + pos.left, size.height + pos.top];

      // Account any parent Frames scroll offset
      if (node.ownerDocument !== document) {
        var win = node.ownerDocument.defaultView;
        to[0] += win.pageXOffset;
        to[1] += win.pageYOffset;
        to[2] += win.pageXOffset;
        to[3] += win.pageYOffset;
      }

      BOUNDS_FORMAT.forEach(function (side, i) {
        side = side[0].toUpperCase() + side.substr(1);
        if (side === 'Top' || side === 'Left') {
          to[i] += parseFloat(style['border' + side + 'Width']);
        } else {
          to[i] -= parseFloat(style['border' + side + 'Width']);
        }
      });
    })();
  }

  return to;
}

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;
    var targetAttachment = _ref.targetAttachment;

    if (!this.options.constraints) {
      return true;
    }

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    if (width === 0 && height === 0 && typeof this.lastSize !== 'undefined') {
      var _lastSize = this.lastSize;

      // Handle the item getting hidden as a result of our positioning without glitching
      // the classes in and out
      width = _lastSize.width;
      height = _lastSize.height;
    }

    var targetSize = this.cache('target-bounds', function () {
      return _this.getTargetBounds();
    });

    var targetHeight = targetSize.height;
    var targetWidth = targetSize.width;

    var allClasses = [this.getClass('pinned'), this.getClass('out-of-bounds')];

    this.options.constraints.forEach(function (constraint) {
      var outOfBoundsClass = constraint.outOfBoundsClass;
      var pinnedClass = constraint.pinnedClass;

      if (outOfBoundsClass) {
        allClasses.push(outOfBoundsClass);
      }
      if (pinnedClass) {
        allClasses.push(pinnedClass);
      }
    });

    allClasses.forEach(function (cls) {
      ['left', 'top', 'right', 'bottom'].forEach(function (side) {
        allClasses.push(cls + '-' + side);
      });
    });

    var addClasses = [];

    var tAttachment = extend({}, targetAttachment);
    var eAttachment = extend({}, this.attachment);

    this.options.constraints.forEach(function (constraint) {
      var to = constraint.to;
      var attachment = constraint.attachment;
      var pin = constraint.pin;

      if (typeof attachment === 'undefined') {
        attachment = '';
      }

      var changeAttachX = undefined,
          changeAttachY = undefined;
      if (attachment.indexOf(' ') >= 0) {
        var _attachment$split = attachment.split(' ');

        var _attachment$split2 = _slicedToArray(_attachment$split, 2);

        changeAttachY = _attachment$split2[0];
        changeAttachX = _attachment$split2[1];
      } else {
        changeAttachX = changeAttachY = attachment;
      }

      var bounds = getBoundingRect(_this, to);

      if (changeAttachY === 'target' || changeAttachY === 'both') {
        if (top < bounds[1] && tAttachment.top === 'top') {
          top += targetHeight;
          tAttachment.top = 'bottom';
        }

        if (top + height > bounds[3] && tAttachment.top === 'bottom') {
          top -= targetHeight;
          tAttachment.top = 'top';
        }
      }

      if (changeAttachY === 'together') {
        if (tAttachment.top === 'top') {
          if (eAttachment.top === 'bottom' && top < bounds[1]) {
            top += targetHeight;
            tAttachment.top = 'bottom';

            top += height;
            eAttachment.top = 'top';
          } else if (eAttachment.top === 'top' && top + height > bounds[3] && top - (height - targetHeight) >= bounds[1]) {
            top -= height - targetHeight;
            tAttachment.top = 'bottom';

            eAttachment.top = 'bottom';
          }
        }

        if (tAttachment.top === 'bottom') {
          if (eAttachment.top === 'top' && top + height > bounds[3]) {
            top -= targetHeight;
            tAttachment.top = 'top';

            top -= height;
            eAttachment.top = 'bottom';
          } else if (eAttachment.top === 'bottom' && top < bounds[1] && top + (height * 2 - targetHeight) <= bounds[3]) {
            top += height - targetHeight;
            tAttachment.top = 'top';

            eAttachment.top = 'top';
          }
        }

        if (tAttachment.top === 'middle') {
          if (top + height > bounds[3] && eAttachment.top === 'top') {
            top -= height;
            eAttachment.top = 'bottom';
          } else if (top < bounds[1] && eAttachment.top === 'bottom') {
            top += height;
            eAttachment.top = 'top';
          }
        }
      }

      if (changeAttachX === 'target' || changeAttachX === 'both') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          left += targetWidth;
          tAttachment.left = 'right';
        }

        if (left + width > bounds[2] && tAttachment.left === 'right') {
          left -= targetWidth;
          tAttachment.left = 'left';
        }
      }

      if (changeAttachX === 'together') {
        if (left < bounds[0] && tAttachment.left === 'left') {
          if (eAttachment.left === 'right') {
            left += targetWidth;
            tAttachment.left = 'right';

            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'left') {
            left += targetWidth;
            tAttachment.left = 'right';

            left -= width;
            eAttachment.left = 'right';
          }
        } else if (left + width > bounds[2] && tAttachment.left === 'right') {
          if (eAttachment.left === 'left') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'right') {
            left -= targetWidth;
            tAttachment.left = 'left';

            left += width;
            eAttachment.left = 'left';
          }
        } else if (tAttachment.left === 'center') {
          if (left + width > bounds[2] && eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (left < bounds[0] && eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          }
        }
      }

      if (changeAttachY === 'element' || changeAttachY === 'both') {
        if (top < bounds[1] && eAttachment.top === 'bottom') {
          top += height;
          eAttachment.top = 'top';
        }

        if (top + height > bounds[3] && eAttachment.top === 'top') {
          top -= height;
          eAttachment.top = 'bottom';
        }
      }

      if (changeAttachX === 'element' || changeAttachX === 'both') {
        if (left < bounds[0]) {
          if (eAttachment.left === 'right') {
            left += width;
            eAttachment.left = 'left';
          } else if (eAttachment.left === 'center') {
            left += width / 2;
            eAttachment.left = 'left';
          }
        }

        if (left + width > bounds[2]) {
          if (eAttachment.left === 'left') {
            left -= width;
            eAttachment.left = 'right';
          } else if (eAttachment.left === 'center') {
            left -= width / 2;
            eAttachment.left = 'right';
          }
        }
      }

      if (typeof pin === 'string') {
        pin = pin.split(',').map(function (p) {
          return p.trim();
        });
      } else if (pin === true) {
        pin = ['top', 'left', 'right', 'bottom'];
      }

      pin = pin || [];

      var pinned = [];
      var oob = [];

      if (top < bounds[1]) {
        if (pin.indexOf('top') >= 0) {
          top = bounds[1];
          pinned.push('top');
        } else {
          oob.push('top');
        }
      }

      if (top + height > bounds[3]) {
        if (pin.indexOf('bottom') >= 0) {
          top = bounds[3] - height;
          pinned.push('bottom');
        } else {
          oob.push('bottom');
        }
      }

      if (left < bounds[0]) {
        if (pin.indexOf('left') >= 0) {
          left = bounds[0];
          pinned.push('left');
        } else {
          oob.push('left');
        }
      }

      if (left + width > bounds[2]) {
        if (pin.indexOf('right') >= 0) {
          left = bounds[2] - width;
          pinned.push('right');
        } else {
          oob.push('right');
        }
      }

      if (pinned.length) {
        (function () {
          var pinnedClass = undefined;
          if (typeof _this.options.pinnedClass !== 'undefined') {
            pinnedClass = _this.options.pinnedClass;
          } else {
            pinnedClass = _this.getClass('pinned');
          }

          addClasses.push(pinnedClass);
          pinned.forEach(function (side) {
            addClasses.push(pinnedClass + '-' + side);
          });
        })();
      }

      if (oob.length) {
        (function () {
          var oobClass = undefined;
          if (typeof _this.options.outOfBoundsClass !== 'undefined') {
            oobClass = _this.options.outOfBoundsClass;
          } else {
            oobClass = _this.getClass('out-of-bounds');
          }

          addClasses.push(oobClass);
          oob.forEach(function (side) {
            addClasses.push(oobClass + '-' + side);
          });
        })();
      }

      if (pinned.indexOf('left') >= 0 || pinned.indexOf('right') >= 0) {
        eAttachment.left = tAttachment.left = false;
      }
      if (pinned.indexOf('top') >= 0 || pinned.indexOf('bottom') >= 0) {
        eAttachment.top = tAttachment.top = false;
      }

      if (tAttachment.top !== targetAttachment.top || tAttachment.left !== targetAttachment.left || eAttachment.top !== _this.attachment.top || eAttachment.left !== _this.attachment.left) {
        _this.updateAttachClasses(eAttachment, tAttachment);
        _this.trigger('update', {
          attachment: eAttachment,
          targetAttachment: tAttachment
        });
      }
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return { top: top, left: left };
  }
});
/* globals TetherBase */

'use strict';

var _TetherBase$Utils = TetherBase.Utils;
var getBounds = _TetherBase$Utils.getBounds;
var updateClasses = _TetherBase$Utils.updateClasses;
var defer = _TetherBase$Utils.defer;

TetherBase.modules.push({
  position: function position(_ref) {
    var _this = this;

    var top = _ref.top;
    var left = _ref.left;

    var _cache = this.cache('element-bounds', function () {
      return getBounds(_this.element);
    });

    var height = _cache.height;
    var width = _cache.width;

    var targetPos = this.getTargetBounds();

    var bottom = top + height;
    var right = left + width;

    var abutted = [];
    if (top <= targetPos.bottom && bottom >= targetPos.top) {
      ['left', 'right'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === left || targetPosSide === right) {
          abutted.push(side);
        }
      });
    }

    if (left <= targetPos.right && right >= targetPos.left) {
      ['top', 'bottom'].forEach(function (side) {
        var targetPosSide = targetPos[side];
        if (targetPosSide === top || targetPosSide === bottom) {
          abutted.push(side);
        }
      });
    }

    var allClasses = [];
    var addClasses = [];

    var sides = ['left', 'top', 'right', 'bottom'];
    allClasses.push(this.getClass('abutted'));
    sides.forEach(function (side) {
      allClasses.push(_this.getClass('abutted') + '-' + side);
    });

    if (abutted.length) {
      addClasses.push(this.getClass('abutted'));
    }

    abutted.forEach(function (side) {
      addClasses.push(_this.getClass('abutted') + '-' + side);
    });

    defer(function () {
      if (!(_this.options.addTargetClasses === false)) {
        updateClasses(_this.target, addClasses, allClasses);
      }
      updateClasses(_this.element, addClasses, allClasses);
    });

    return true;
  }
});
/* globals TetherBase */

'use strict';

var _slicedToArray = (function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i['return']) _i['return'](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError('Invalid attempt to destructure non-iterable instance'); } }; })();

TetherBase.modules.push({
  position: function position(_ref) {
    var top = _ref.top;
    var left = _ref.left;

    if (!this.options.shift) {
      return;
    }

    var shift = this.options.shift;
    if (typeof this.options.shift === 'function') {
      shift = this.options.shift.call(this, { top: top, left: left });
    }

    var shiftTop = undefined,
        shiftLeft = undefined;
    if (typeof shift === 'string') {
      shift = shift.split(' ');
      shift[1] = shift[1] || shift[0];

      var _shift = shift;

      var _shift2 = _slicedToArray(_shift, 2);

      shiftTop = _shift2[0];
      shiftLeft = _shift2[1];

      shiftTop = parseFloat(shiftTop, 10);
      shiftLeft = parseFloat(shiftLeft, 10);
    } else {
      shiftTop = shift.top;
      shiftLeft = shift.left;
    }

    top += shiftTop;
    left += shiftLeft;

    return { top: top, left: left };
  }
});
return Tether;

}));


/***/ },

/***/ 1117:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var platform_browser_dynamic_1 = __webpack_require__(182);
// import { platformBrowser } from '@angular/platform-browser';
var app_module_1 = __webpack_require__(475);
// import { AppModuleNgFactory } from '../tmp/demo/app.module.ngfactory';
platform_browser_dynamic_1.platformBrowserDynamic().bootstrapModule(app_module_1.AppModule);
// platformBrowser().bootstrapModuleFactory(AppModuleNgFactory);


/***/ },

/***/ 116:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var button_component_1 = __webpack_require__(370);
var icogram_module_1 = __webpack_require__(161);
var l10n_module_1 = __webpack_require__(28);
var VCLButtonModule = (function () {
    function VCLButtonModule() {
    }
    VCLButtonModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, icogram_module_1.VCLIcogramModule, l10n_module_1.L10nModule],
            exports: [button_component_1.ButtonComponent],
            declarations: [button_component_1.ButtonComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLButtonModule);
    return VCLButtonModule;
}());
exports.VCLButtonModule = VCLButtonModule;


/***/ },

/***/ 161:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var icogram_component_1 = __webpack_require__(652);
var icon_module_1 = __webpack_require__(92);
var l10n_module_1 = __webpack_require__(28);
var VCLIcogramModule = (function () {
    function VCLIcogramModule() {
    }
    VCLIcogramModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, icon_module_1.VCLIconModule, l10n_module_1.L10nModule],
            exports: [icogram_component_1.IcogramComponent],
            declarations: [icogram_component_1.IcogramComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLIcogramModule);
    return VCLIcogramModule;
}());
exports.VCLIcogramModule = VCLIcogramModule;


/***/ },

/***/ 162:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var off_click_directive_1 = __webpack_require__(668);
var VCLOffClickModule = (function () {
    function VCLOffClickModule() {
    }
    VCLOffClickModule = __decorate([
        core_1.NgModule({
            declarations: [off_click_directive_1.OffClickDirective],
            exports: [off_click_directive_1.OffClickDirective]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLOffClickModule);
    return VCLOffClickModule;
}());
exports.VCLOffClickModule = VCLOffClickModule;


/***/ },

/***/ 239:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var demo_component_1 = __webpack_require__(367);
var metalist_demo_1 = __webpack_require__(624);
var dropdown_demo_1 = __webpack_require__(608);
var select_demo_1 = __webpack_require__(636);
var icon_demo_1 = __webpack_require__(614);
var icogram_demo_1 = __webpack_require__(612);
var button_demo_1 = __webpack_require__(604);
var button_group_demo_1 = __webpack_require__(602);
var layer_demo_1 = __webpack_require__(619);
var tether_demo_1 = __webpack_require__(640);
var link_demo_1 = __webpack_require__(621);
var radio_button_demo_1 = __webpack_require__(634);
var checkbox_demo_1 = __webpack_require__(606);
var form_control_label_demo_1 = __webpack_require__(610);
var input_demo_1 = __webpack_require__(616);
var popover_demo_1 = __webpack_require__(632);
var tab_nav_demo_1 = __webpack_require__(638);
var navigation_demo_1 = __webpack_require__(628);
var toolbar_demo_1 = __webpack_require__(642);
var wormhole_demo_1 = __webpack_require__(644);
var off_click_demo_1 = __webpack_require__(630);
var month_picker_demo_1 = __webpack_require__(626);
var l10n_demo_1 = __webpack_require__(617);
exports.DEMOS = [
    metalist_demo_1.default,
    dropdown_demo_1.default,
    select_demo_1.default,
    icon_demo_1.default,
    icogram_demo_1.default,
    button_demo_1.default,
    button_group_demo_1.default,
    layer_demo_1.default,
    tether_demo_1.default,
    link_demo_1.default,
    radio_button_demo_1.default,
    checkbox_demo_1.default,
    form_control_label_demo_1.default,
    input_demo_1.default,
    popover_demo_1.default,
    tab_nav_demo_1.default,
    navigation_demo_1.default,
    toolbar_demo_1.default,
    wormhole_demo_1.default,
    off_click_demo_1.default,
    month_picker_demo_1.default,
    l10n_demo_1.default
];
exports.GROUPED_DEMOS = function () {
    var itemsMap = {};
    exports.DEMOS.forEach(function (c) {
        if (itemsMap[c.category]) {
            itemsMap[c.category].push({
                label: c.name,
                route: ['/' + c.path],
                active: true,
            });
        }
        else {
            itemsMap[c.category] = [{
                    label: c.name,
                    route: ['/' + c.path],
                    active: true,
                }];
        }
    });
    return Object.keys(itemsMap).map(function (category) { return ({
        label: category,
        items: itemsMap[category],
        active: true,
    }); });
}();
exports.DEMO_DECLARATIONS = exports.DEMOS.map(function (dc) { return Object.keys(dc.tabs)
    .map(function (key) { return dc.tabs[key]; })
    .filter(function (o) { return typeof o === 'function'; }); });
exports.DEMO_ROUTES = (exports.DEMOS.map(function (dc) {
    return {
        path: dc.path,
        component: demo_component_1.DemoComponent,
        data: dc
    };
}));


/***/ },

/***/ 240:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var layer_component_1 = __webpack_require__(656);
exports.LayerBaseComponent = layer_component_1.LayerBaseComponent;
exports.LayerDirective = layer_component_1.LayerDirective;
var layer_service_1 = __webpack_require__(374);
exports.LayerService = layer_service_1.LayerService;
var off_click_module_1 = __webpack_require__(162);
var wormhole_module_1 = __webpack_require__(73);
var VCLLayerModule = (function () {
    function VCLLayerModule() {
    }
    VCLLayerModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, wormhole_module_1.VCLWormholeModule, off_click_module_1.VCLOffClickModule],
            exports: [layer_component_1.LayerBaseComponent, layer_component_1.LayerDirective],
            declarations: [layer_component_1.LayerBaseComponent, layer_component_1.LayerDirective],
            providers: [layer_service_1.LayerService]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLLayerModule);
    return VCLLayerModule;
}());
exports.VCLLayerModule = VCLLayerModule;


/***/ },

/***/ 241:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var link_component_1 = __webpack_require__(657);
var icogram_module_1 = __webpack_require__(161);
var l10n_module_1 = __webpack_require__(28);
var VCLLinkModule = (function () {
    function VCLLinkModule() {
    }
    VCLLinkModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule, icogram_module_1.VCLIcogramModule],
            exports: [link_component_1.LinkComponent],
            declarations: [link_component_1.LinkComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLLinkModule);
    return VCLLinkModule;
}());
exports.VCLLinkModule = VCLLinkModule;


/***/ },

/***/ 242:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var tether_component_1 = __webpack_require__(666);
var VCLTetherModule = (function () {
    function VCLTetherModule() {
    }
    VCLTetherModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule],
            exports: [tether_component_1.TetherComponent],
            declarations: [tether_component_1.TetherComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLTetherModule);
    return VCLTetherModule;
}());
exports.VCLTetherModule = VCLTetherModule;


/***/ },

/***/ 243:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
__webpack_require__(440);
;
exports.L10N_LOADER_CONFIG = new core_1.OpaqueToken('l10n.loader.config');
var L10nLoaderService = (function () {
    function L10nLoaderService() {
    }
    L10nLoaderService.prototype.getSupportedLocales = function () {
        return Observable_1.Observable.of([]);
    };
    return L10nLoaderService;
}());
exports.L10nLoaderService = L10nLoaderService;
var L10nStaticLoaderService = (function (_super) {
    __extends(L10nStaticLoaderService, _super);
    function L10nStaticLoaderService(config // TODO: L10nLoaderConfig - problem with ngc
        ) {
        _super.call(this);
        this.config = config;
    }
    L10nStaticLoaderService.prototype.flatten = function (locale, data) {
        var pkg = {};
        Object.keys(data).forEach(function (key) {
            if (data[key] && data[key][locale]) {
                pkg[key] = data[key][locale];
            }
        });
        return pkg;
    };
    L10nStaticLoaderService.prototype.getSupportedLocales = function () {
        var _this = this;
        var supportedLocales = [];
        Object.keys(this.config).forEach(function (key) {
            if (_this.config[key]) {
                Object.keys(_this.config[key]).forEach(function (locale) {
                    supportedLocales.push(locale);
                });
            }
        });
        // unique
        supportedLocales = Array.from(new Set(supportedLocales));
        return Observable_1.Observable.of(supportedLocales);
    };
    L10nStaticLoaderService.prototype.getTranslationPackage = function (locale) {
        var pkg = this.flatten(locale, this.config);
        return Observable_1.Observable.of(pkg);
    };
    L10nStaticLoaderService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.L10N_LOADER_CONFIG)), 
        __metadata('design:paramtypes', [Object])
    ], L10nStaticLoaderService);
    return L10nStaticLoaderService;
}(L10nLoaderService));
exports.L10nStaticLoaderService = L10nStaticLoaderService;
var L10nNoopLoaderService = (function (_super) {
    __extends(L10nNoopLoaderService, _super);
    function L10nNoopLoaderService() {
        _super.apply(this, arguments);
    }
    L10nNoopLoaderService.prototype.getTranslationPackage = function (locale) {
        return Observable_1.Observable.of({});
    };
    L10nNoopLoaderService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], L10nNoopLoaderService);
    return L10nNoopLoaderService;
}(L10nLoaderService));
exports.L10nNoopLoaderService = L10nNoopLoaderService;


/***/ },

/***/ 244:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var L10nParserService = (function () {
    function L10nParserService() {
    }
    return L10nParserService;
}());
exports.L10nParserService = L10nParserService;
var L10nFormatParserService = (function (_super) {
    __extends(L10nFormatParserService, _super);
    function L10nFormatParserService() {
        _super.apply(this, arguments);
    }
    L10nFormatParserService.prototype.parse = function (value) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return value.replace(/{(\d+)}/g, function (match, idx) {
            return typeof args[idx] === 'string' ? args[idx] : match;
        });
    };
    L10nFormatParserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], L10nFormatParserService);
    return L10nFormatParserService;
}(L10nParserService));
exports.L10nFormatParserService = L10nFormatParserService;


/***/ },

/***/ 245:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
var BehaviorSubject_1 = __webpack_require__(125);
__webpack_require__(439);
__webpack_require__(442);
__webpack_require__(443);
__webpack_require__(448);
__webpack_require__(445);
var l10n_loader_service_1 = __webpack_require__(243);
var l10n_parser_service_1 = __webpack_require__(244);
exports.L10N_CONFIG = new core_1.OpaqueToken('l10n.config');
;
var L10nService = (function () {
    function L10nService(config, // TODO: L10nConfig - problem with ngc
        loader, parser) {
        var _this = this;
        this.config = config;
        this.loader = loader;
        this.parser = parser;
        this.packages = {};
        this.locale = (config.locale || this.getNavigatorLang() || 'en-us').toLowerCase();
        this._locale$ = new BehaviorSubject_1.BehaviorSubject(this.locale);
        // Initialize the streams
        var supportedLocales$ = this.getSupportedLocales();
        // Set up stream of valid locale
        var locale$ = Observable_1.Observable.combineLatest(supportedLocales$, this.locale$, function (supportedLocales, locale) {
            if (supportedLocales.length > 0) {
                // If not supported use first locale as fallback
                return (supportedLocales.indexOf(locale) >= 0) ? locale : supportedLocales[0];
            }
            else {
                // If there are no supported locales, presume every locale as supported
                return locale;
            }
        });
        // Set up stream of valid fallback locale
        var fbLocale$ = Observable_1.Observable.combineLatest(supportedLocales$, locale$, function (supportedLocales, locale) {
            if (supportedLocales.length > 0 && supportedLocales[0] !== locale) {
                return supportedLocales[0];
            }
            else if (supportedLocales.length > 1 && supportedLocales[0] === locale) {
                return supportedLocales[1];
            }
            else {
                return null;
            }
        });
        this.package$ = locale$.switchMap(function (locale) { return _this.getTranslationPackage(locale); });
        // Setup the fallback package stream
        var fbPackageTemp$ = fbLocale$.switchMap(function (fbLocale) {
            return fbLocale ? _this.getTranslationPackage(fbLocale) : Observable_1.Observable.of({});
        });
        // The real fallback stream is a combination of the latest package and fallback package 
        this.fbPackage$ = Observable_1.Observable.combineLatest(this.package$, fbPackageTemp$, function (pkg, fbPkg) {
            return fbPkg ? Object.assign({}, fbPkg, pkg) : pkg;
        });
    }
    Object.defineProperty(L10nService.prototype, "locale$", {
        get: function () {
            return this._locale$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    /**
    * @internal
    */
    L10nService.prototype.getTranslationPackage = function (locale) {
        // Cache package streams and share
        if (!this.packages[locale]) {
            this.packages[locale] = this.loader
                .getTranslationPackage(locale)
                .publishReplay(1)
                .refCount();
        }
        return this.packages[locale];
    };
    /**
    * Gets supported locales
    */
    L10nService.prototype.getSupportedLocales = function () {
        // Cache supportedLocales and share
        if (!this.supportedLocales$) {
            this.supportedLocales$ = this.loader
                .getSupportedLocales()
                .map(function (sl) { return sl.map(function (locale) { return locale.toLowerCase(); }); })
                .publishReplay(1)
                .refCount();
        }
        return this.supportedLocales$;
    };
    /**
    * Set the current locale.
    * Emits new translation values to subscribers
    * @param locale
    */
    L10nService.prototype.setLocale = function (locale) {
        this.locale = locale.toLowerCase();
        this._locale$.next(this.locale);
    };
    /**
    * Looks up the value for the provided key in the current tranlsation package.
    * Falls back to the fbLocale translation package if the key is not found.
    * @param key
    * @param params
    * @returns {Observable<string>} The translated key
    */
    L10nService.prototype.localize = function (key) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.package$.switchMap(function (pkg) {
            return pkg[key] ? Observable_1.Observable.of(pkg) : _this.fbPackage$;
        }).map(function (pkg) {
            return pkg[key] ? (_a = _this.parser).parse.apply(_a, [pkg[key]].concat(args)) : key;
            var _a;
        });
    };
    // alias for localize
    L10nService.prototype.loc = function (key) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return this.localize.apply(this, [key].concat(args));
    };
    L10nService.prototype.getNavigatorLang = function () {
        if (typeof window !== 'undefined' && typeof window.navigator !== 'undefined') {
            var nav = window.navigator;
            if (nav['languages'] && nav['languages'].length > 0) {
                return nav['languages'][0];
            }
            else {
                return nav['language'] || nav['browserLanguage'];
            }
        }
    };
    L10nService = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.L10N_CONFIG)), 
        __metadata('design:paramtypes', [Object, (typeof (_a = typeof l10n_loader_service_1.L10nLoaderService !== 'undefined' && l10n_loader_service_1.L10nLoaderService) === 'function' && _a) || Object, (typeof (_b = typeof l10n_parser_service_1.L10nParserService !== 'undefined' && l10n_parser_service_1.L10nParserService) === 'function' && _b) || Object])
    ], L10nService);
    return L10nService;
    var _a, _b;
}());
exports.L10nService = L10nService;


/***/ },

/***/ 28:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var l10n_loader_service_1 = __webpack_require__(243);
var l10n_parser_service_1 = __webpack_require__(244);
var l10n_service_1 = __webpack_require__(245);
var l10n_pipe_1 = __webpack_require__(671);
var l10n_loader_service_2 = __webpack_require__(243);
exports.L10nNoopLoaderService = l10n_loader_service_2.L10nNoopLoaderService;
exports.L10nStaticLoaderService = l10n_loader_service_2.L10nStaticLoaderService;
var l10n_parser_service_2 = __webpack_require__(244);
exports.L10nFormatParserService = l10n_parser_service_2.L10nFormatParserService;
var l10n_service_2 = __webpack_require__(245);
exports.L10nService = l10n_service_2.L10nService;
var L10nModule = (function () {
    function L10nModule() {
    }
    L10nModule.forRoot = function (config) {
        return {
            ngModule: L10nModule,
            providers: [
                l10n_service_1.L10nService,
                {
                    provide: l10n_service_1.L10N_CONFIG,
                    useValue: config.config || {}
                },
                {
                    provide: l10n_loader_service_1.L10nLoaderService,
                    useClass: config.loader
                }, {
                    provide: l10n_loader_service_1.L10N_LOADER_CONFIG,
                    useValue: config.loaderConfig || {}
                }, {
                    provide: l10n_parser_service_1.L10nParserService,
                    useClass: config.parser || l10n_parser_service_1.L10nFormatParserService
                }
            ]
        };
    };
    L10nModule = __decorate([
        core_1.NgModule({
            imports: [],
            declarations: [
                l10n_pipe_1.L10nPipe
            ],
            exports: [
                l10n_pipe_1.L10nPipe
            ],
            providers: [
                // TODO: Remove provider. Should work when marked optional in pipe
                // not sure why it isn't
                {
                    provide: l10n_service_1.L10N_CONFIG,
                    useValue: {}
                },
                l10n_service_1.L10nService,
                {
                    provide: l10n_loader_service_1.L10nLoaderService,
                    useClass: l10n_loader_service_1.L10nNoopLoaderService
                },
                {
                    provide: l10n_loader_service_1.L10N_LOADER_CONFIG,
                    useValue: {}
                },
                {
                    provide: l10n_parser_service_1.L10nParserService,
                    useClass: l10n_parser_service_1.L10nFormatParserService
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], L10nModule);
    return L10nModule;
}());
exports.L10nModule = L10nModule;


/***/ },

/***/ 367:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var router_1 = __webpack_require__(101);
var core_1 = __webpack_require__(0);
var DemoContentComponent = (function () {
    function DemoContentComponent(vcRef, _componentFactoryResolver) {
        this.vcRef = vcRef;
        this._componentFactoryResolver = _componentFactoryResolver;
    }
    DemoContentComponent.prototype.ngOnChanges = function () {
        if (this.currentComponentRef) {
            this.currentComponentRef.destroy();
        }
        this.currentComponentRef = this.attachComponentPortal(this.component);
    };
    DemoContentComponent.prototype.ngOnDestroy = function () {
        if (this.currentComponentRef) {
            this.currentComponentRef.destroy();
        }
    };
    /** Attach the given ComponentPortal to DOM element using the ComponentFactoryResolver. */
    DemoContentComponent.prototype.attachComponentPortal = function (cmp) {
        var componentFactory = this._componentFactoryResolver.resolveComponentFactory(cmp);
        return this.vcRef.createComponent(componentFactory, this.vcRef.length, this.vcRef.parentInjector);
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', (typeof (_a = typeof core_1.Type !== 'undefined' && core_1.Type) === 'function' && _a) || Object)
    ], DemoContentComponent.prototype, "component", void 0);
    DemoContentComponent = __decorate([
        core_1.Directive({
            selector: 'demo-content',
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ComponentFactoryResolver !== 'undefined' && core_1.ComponentFactoryResolver) === 'function' && _c) || Object])
    ], DemoContentComponent);
    return DemoContentComponent;
    var _a, _b, _c;
}());
exports.DemoContentComponent = DemoContentComponent;
var DemoComponent = (function () {
    function DemoComponent(activatedRoute) {
        this.activatedRoute = activatedRoute;
        this.tabs = [];
    }
    DemoComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.activatedRoute.data.subscribe(function (data) {
            if (data && data.name) {
                _this.title = data.name;
                _this.component = data.component;
                if (data.tabs) {
                    _this.tabs = Object.keys(data.tabs).map(function (key) {
                        var type;
                        if (typeof data.tabs[key] === 'string' && key.endsWith('.md')) {
                            type = 'markdown';
                        }
                        else if (typeof data.tabs[key] === 'string') {
                            type = 'text';
                        }
                        else if (typeof data.tabs[key] === 'function') {
                            type = 'component';
                        }
                        return {
                            name: key,
                            content: data.tabs[key],
                            type: type
                        };
                    });
                }
                else {
                    _this.tabs = [];
                }
            }
            else {
                _this.title = null;
                _this.tabs = [];
            }
        });
    };
    DemoComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(811)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _a) || Object])
    ], DemoComponent);
    return DemoComponent;
    var _a;
}());
exports.DemoComponent = DemoComponent;


/***/ },

/***/ 368:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var HomeComponent = (function () {
    function HomeComponent() {
        this.readme = __webpack_require__(806);
    }
    HomeComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(814)
        }), 
        __metadata('design:paramtypes', [])
    ], HomeComponent);
    return HomeComponent;
}());
exports.HomeComponent = HomeComponent;


/***/ },

/***/ 369:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var button_group_component_1 = __webpack_require__(647);
var button_module_1 = __webpack_require__(116);
var l10n_module_1 = __webpack_require__(28);
var VCLButtonGroupModule = (function () {
    function VCLButtonGroupModule() {
    }
    VCLButtonGroupModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, button_module_1.VCLButtonModule, l10n_module_1.L10nModule],
            exports: [button_group_component_1.ButtonGroupComponent],
            declarations: [button_group_component_1.ButtonGroupComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLButtonGroupModule);
    return VCLButtonGroupModule;
}());
exports.VCLButtonGroupModule = VCLButtonGroupModule;


/***/ },

/***/ 370:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Observable_1 = __webpack_require__(1);
var core_1 = __webpack_require__(0);
__webpack_require__(803);
var ButtonComponent = (function () {
    function ButtonComponent(elementRef) {
        this.elementRef = elementRef;
        this.pressed = false; // `true` if a pointer device is conducting a `down` gesture on the button
        this.focused = false; // `true` if the element is focused  (CSS' :focus)
        this.hovered = false; // `true` if a pointer device is hovering the button (CSS' :hover)
        this.selected = false;
        this.busy = false; // State to indicate that the button is disabled as a operation is in progress
        this.flexLabel = false;
        this.autoBlur = true;
        this._press = new core_1.EventEmitter();
    }
    Object.defineProperty(ButtonComponent.prototype, "press", {
        get: function () {
            return this._press.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ButtonComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.press.subscribe(function () {
            if (_this.autoBlur) {
                if (_this.elementRef.nativeElement && _this.elementRef.nativeElement.blur) {
                    _this.elementRef.nativeElement.blur();
                }
            }
        });
    };
    ButtonComponent.prototype.onMouseEnter = function (e) { this.hovered = true; };
    ButtonComponent.prototype.onMouseLeave = function (e) { this.hovered = false; };
    ButtonComponent.prototype.onMouseUp = function (e) { this.pressed = false; };
    ButtonComponent.prototype.onMouseDown = function (e) { this.pressed = true; };
    ButtonComponent.prototype.onFocus = function (e) { this.focused = true; };
    ButtonComponent.prototype.onBlur = function (e) { this.focused = false; };
    ButtonComponent.prototype.onTap = function (e) { this._press.emit(e); };
    Object.defineProperty(ButtonComponent.prototype, "calculatedLabel", {
        get: function () {
            return (this.busy && this.busyLabel) ? this.busyLabel : this.label;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonComponent.prototype, "calculatedPrepIcon", {
        get: function () {
            return (this.busy && this.prepIconBusy) ? this.prepIconBusy : this.prepIcon;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonComponent.prototype, "calculatedAppIcon", {
        get: function () {
            return (this.busy && this.appIconBusy) ? this.appIconBusy : this.appIcon;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        // `true` if the element is focused  (CSS' :focus)
        core_1.HostBinding('class.vclHovered'), 
        __metadata('design:type', Boolean)
    ], ButtonComponent.prototype, "hovered", void 0);
    __decorate([
        // `true` if a pointer device is hovering the button (CSS' :hover)
        core_1.Input(),
        core_1.HostBinding('class.vclSelected'), 
        __metadata('design:type', Boolean)
    ], ButtonComponent.prototype, "selected", void 0);
    __decorate([
        core_1.HostBinding('attr.aria-label'),
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ButtonComponent.prototype, "busy", void 0);
    __decorate([
        // State to indicate that the button is disabled as a operation is in progress
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ButtonComponent.prototype, "flexLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "busyLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "prepIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "prepIconBusy", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], ButtonComponent.prototype, "autoBlur", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "appIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], ButtonComponent.prototype, "appIconBusy", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], ButtonComponent.prototype, "press", null);
    __decorate([
        core_1.HostListener('mouseenter', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onMouseEnter", null);
    __decorate([
        core_1.HostListener('mouseleave', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onMouseLeave", null);
    __decorate([
        core_1.HostListener('mouseup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onMouseUp", null);
    __decorate([
        core_1.HostListener('mousedown', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onMouseDown", null);
    __decorate([
        core_1.HostListener('onfocus', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onFocus", null);
    __decorate([
        core_1.HostListener('onblur', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onBlur", null);
    __decorate([
        core_1.HostListener('tap', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], ButtonComponent.prototype, "onTap", null);
    ButtonComponent = __decorate([
        core_1.Component({
            selector: '[vcl-button]',
            host: {
                '[class.vclButton]': 'true',
            },
            template: __webpack_require__(834),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], ButtonComponent);
    return ButtonComponent;
    var _a, _b;
}());
exports.ButtonComponent = ButtonComponent;


/***/ },

/***/ 371:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var icon_module_1 = __webpack_require__(92);
var checkbox_component_1 = __webpack_require__(648);
exports.CheckboxComponent = checkbox_component_1.CheckboxComponent;
var VCLCheckboxModule = (function () {
    function VCLCheckboxModule() {
    }
    VCLCheckboxModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, icon_module_1.VCLIconModule],
            exports: [checkbox_component_1.CheckboxComponent],
            declarations: [checkbox_component_1.CheckboxComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLCheckboxModule);
    return VCLCheckboxModule;
}());
exports.VCLCheckboxModule = VCLCheckboxModule;


/***/ },

/***/ 372:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var dropdown_component_1 = __webpack_require__(649);
var metalist_module_1 = __webpack_require__(375);
var l10n_module_1 = __webpack_require__(28);
var VCLDropdownModule = (function () {
    function VCLDropdownModule() {
    }
    VCLDropdownModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule, metalist_module_1.VCLMetalistModule],
            exports: [dropdown_component_1.DropdownComponent],
            declarations: [dropdown_component_1.DropdownComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLDropdownModule);
    return VCLDropdownModule;
}());
exports.VCLDropdownModule = VCLDropdownModule;


/***/ },

/***/ 373:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var IconService = (function () {
    function IconService() {
    }
    // A default name resolver following the CSS class name conventions of
    // the well-known Font Awesome icon font. Bascially it translates
    // `fa:user` into `fa fa-user`
    IconService.prototype.defaultNameResolver = function (icon) {
        var iconParts = icon.split(':');
        if (iconParts.length > 1) {
            var setName = iconParts[0];
            iconParts.shift();
            var iconClasses = iconParts.join(" " + setName + "-");
            return setName + " " + setName + "-" + iconClasses;
        }
        else {
            return icon;
        }
    };
    IconService.prototype.lookup = function (icon) {
        if (typeof icon === 'string' && icon) {
            var iconName = icon;
            var providerName = void 0;
            // Split on first : occurrence
            var iconParts = iconName.split(/:(.+)?/);
            if (iconParts.length === 0) {
                return icon;
            }
            else {
                providerName = iconParts[0];
                // TODO: for now, just hardcode to default resolver, later we need
                // a mapping between the provider and the resolver or each font
                // brings its own resolver.
                providerName = 'defaultNameResolver';
                return this[providerName](iconName);
            }
        }
        return icon;
    };
    IconService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], IconService);
    return IconService;
}());
exports.IconService = IconService;


/***/ },

/***/ 374:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
var LayerService = (function () {
    function LayerService() {
        this.visibleLayersChanged$ = new core_1.EventEmitter();
        this.subscriptions = new Map();
        this.layers = new Map();
    }
    Object.defineProperty(LayerService.prototype, "visibleLayersChanged", {
        get: function () {
            return this.visibleLayersChanged$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(LayerService.prototype, "visibleLayers", {
        get: function () {
            return Array.from(this.subscriptions.keys()).filter(function (layer) { return layer.visible; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerService.prototype, "currentZIndex", {
        get: function () {
            return this.visibleLayers
                .map(function (layer) { return layer.zIndex; })
                .reduce(function (pzIndex, czIndex) { return Math.max(pzIndex, czIndex); }, 0);
        },
        enumerable: true,
        configurable: true
    });
    LayerService.prototype.open = function (layerName, data) {
        if (this.layers.has(layerName)) {
            return this.layers.get(layerName).open(data);
        }
        else {
            return Observable_1.Observable.throw('Layer not found. ' + layerName);
        }
    };
    LayerService.prototype.close = function (layerName) {
        if (this.layers.has(layerName)) {
            this.layers.get(layerName).close();
        }
    };
    LayerService.prototype.register = function (layer) {
        var _this = this;
        var sub = layer.visibilityChange.subscribe(function (visible) {
            _this.visibleLayersChanged$.emit(_this.visibleLayers);
        });
        this.subscriptions.set(layer, sub);
        if (layer.name) {
            this.layers.set(layer.name, layer);
        }
    };
    LayerService.prototype.unregister = function (layer) {
        layer.close();
        if (layer.name) {
            this.layers.delete(name);
        }
        this.subscriptions.get(layer).unsubscribe();
        this.subscriptions.delete(layer);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], LayerService.prototype, "visibleLayersChanged", null);
    LayerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], LayerService);
    return LayerService;
    var _a;
}());
exports.LayerService = LayerService;


/***/ },

/***/ 375:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var metalist_component_1 = __webpack_require__(658);
var l10n_module_1 = __webpack_require__(28);
var VCLMetalistModule = (function () {
    function VCLMetalistModule() {
    }
    VCLMetalistModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule],
            exports: [metalist_component_1.MetalistComponent],
            declarations: [metalist_component_1.MetalistComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLMetalistModule);
    return VCLMetalistModule;
}());
exports.VCLMetalistModule = VCLMetalistModule;


/***/ },

/***/ 376:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var month_picker_component_1 = __webpack_require__(659);
var button_module_1 = __webpack_require__(116);
var l10n_module_1 = __webpack_require__(28);
var VCLMonthPickerModule = (function () {
    function VCLMonthPickerModule() {
    }
    VCLMonthPickerModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, button_module_1.VCLButtonModule, l10n_module_1.L10nModule],
            exports: [month_picker_component_1.MonthPickerComponent],
            declarations: [month_picker_component_1.MonthPickerComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLMonthPickerModule);
    return VCLMonthPickerModule;
}());
exports.VCLMonthPickerModule = VCLMonthPickerModule;


/***/ },

/***/ 377:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var navigation_component_1 = __webpack_require__(660);
var link_module_1 = __webpack_require__(241);
var l10n_module_1 = __webpack_require__(28);
var VCLNavigationModule = (function () {
    function VCLNavigationModule() {
    }
    VCLNavigationModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule, link_module_1.VCLLinkModule],
            exports: [navigation_component_1.NavigationComponent],
            declarations: [navigation_component_1.NavigationComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLNavigationModule);
    return VCLNavigationModule;
}());
exports.VCLNavigationModule = VCLNavigationModule;


/***/ },

/***/ 378:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var popover_component_1 = __webpack_require__(661);
exports.PopoverComponent = popover_component_1.PopoverComponent;
var tether_module_1 = __webpack_require__(242);
var VCLPopoverModule = (function () {
    function VCLPopoverModule() {
    }
    VCLPopoverModule = __decorate([
        core_1.NgModule({
            imports: [
                common_1.CommonModule,
                tether_module_1.VCLTetherModule,
            ],
            exports: [popover_component_1.PopoverComponent],
            declarations: [popover_component_1.PopoverComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLPopoverModule);
    return VCLPopoverModule;
}());
exports.VCLPopoverModule = VCLPopoverModule;


/***/ },

/***/ 379:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var icon_module_1 = __webpack_require__(92);
var radio_button_component_1 = __webpack_require__(662);
var VCLRadioButtonModule = (function () {
    function VCLRadioButtonModule() {
    }
    VCLRadioButtonModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, icon_module_1.VCLIconModule],
            exports: [radio_button_component_1.RadioButtonComponent],
            declarations: [radio_button_component_1.RadioButtonComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLRadioButtonModule);
    return VCLRadioButtonModule;
}());
exports.VCLRadioButtonModule = VCLRadioButtonModule;


/***/ },

/***/ 380:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var tab_nav_component_1 = __webpack_require__(665);
var l10n_module_1 = __webpack_require__(28);
var wormhole_module_1 = __webpack_require__(73);
var VCLTabNavModule = (function () {
    function VCLTabNavModule() {
    }
    VCLTabNavModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule, wormhole_module_1.VCLWormholeModule],
            exports: [tab_nav_component_1.TabComponent, tab_nav_component_1.TabContentDirective, tab_nav_component_1.TabLabelDirective, tab_nav_component_1.TabNavComponent],
            declarations: [tab_nav_component_1.TabComponent, tab_nav_component_1.TabContentDirective, tab_nav_component_1.TabLabelDirective, tab_nav_component_1.TabNavComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLTabNavModule);
    return VCLTabNavModule;
}());
exports.VCLTabNavModule = VCLTabNavModule;


/***/ },

/***/ 381:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var toolbar_component_1 = __webpack_require__(667);
var l10n_module_1 = __webpack_require__(28);
var VCLToolbarModule = (function () {
    function VCLToolbarModule() {
    }
    VCLToolbarModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule],
            exports: [toolbar_component_1.ToolbarComponent],
            declarations: [toolbar_component_1.ToolbarComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLToolbarModule);
    return VCLToolbarModule;
}());
exports.VCLToolbarModule = VCLToolbarModule;


/***/ },

/***/ 382:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var OverlayManagerService = (function () {
    function OverlayManagerService() {
        this.components = [];
    }
    OverlayManagerService.prototype.register = function (component) {
        var zIndex = 100;
        for (var i = 0; i < this.components.length; i++) {
            if (this.components[i].zIndex >= zIndex) {
                zIndex = this.components[i].zIndex;
            }
        }
        this.components.push(component);
        return zIndex + 10;
    };
    OverlayManagerService.prototype.unregister = function (component) {
        var index = this.components.indexOf(component);
        this.components.splice(index, 1);
        return -1;
    };
    OverlayManagerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], OverlayManagerService);
    return OverlayManagerService;
}());
exports.OverlayManagerService = OverlayManagerService;


/***/ },

/***/ 417:
/***/ function(module, exports) {

module.exports = "SelectionMode: Single<br>\n<vcl-button-group [(selectedIndex)]=\"idx1\" (change)=\"selectionChange1($event)\">\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 1\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 2\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 3\"></button>\n</vcl-button-group>\n<p>Selected index: {{idx1}}</p>\n\nSelectionMode: Multiple<br>\n<vcl-button-group [(selectedIndex)]=\"idx2\" (change)=\"selectionChange2($event)\" mode=\"multiple\">\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 1\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 2\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 3\"></button>\n</vcl-button-group>\n<p>Selected index: {{idx2}}</p>\n"

/***/ },

/***/ 418:
/***/ function(module, exports) {

module.exports = "<button vcl-button (click)=\"someAction($event)\" label=\"Action\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" label=\"Action with appended icon\" appIcon=\"fa:bolt\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" label=\"Action with prepended icon\" prepIcon=\"fa:bolt\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" class=\"vclSquare\" appIcon=\"fa:bolt\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" class=\"vclEmphasized\" label=\"Emphasized button\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" flexLabel=true label=\"Flexed Label\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" label=\"Action\" busy=true busyLabel='Busy label...'></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" label=\"Action with appended busy icon\" appIcon=\"fa:bolt\" busy=true appIconBusy=\"fa:spinner fa-pulse\"></button>\n<br><br>\n<button vcl-button (click)=\"someAction($event)\" label=\"Action with prepended busy icon\" prepIcon=\"fa:bolt\" busy=true prepIconBusy=\"fa:refresh fa-spin\"></button>\n<br><br>\n"

/***/ },

/***/ 419:
/***/ function(module, exports) {

module.exports = "Checkable:\n<vcl-checkbox [(checked)]=\"isChecked\"></vcl-checkbox>\n\n<br><br>\n<b>Checked:</b> {{isChecked}}\n\n<br><br>\n<button vcl-button (click)=\"isChecked=false\">Uncheck checkbox</button>\n\n<br><br>\nDisabled:\n<vcl-checkbox [disabled]=\"true\"></vcl-checkbox>\n"

/***/ },

/***/ 420:
/***/ function(module, exports) {

module.exports = "Selected Item: <span *ngIf=\"selectedItem\">{{selectedItem.label}}</span>\n\n<br>\n<br>\n<br>\n<button vcl-button (click)=\"expand()\">Show/hide</button>\n\n<vcl-dropdown (select)=\"onSelect($event)\" [(expanded)]=\"expanded\" [items]=\"items\" [maxSelectableItems]=\"1\" [tabindex]=\"77\" [expanded]=\"true\"></vcl-dropdown>\n"

/***/ },

/***/ 421:
/***/ function(module, exports) {

module.exports = "Non-wrapping label:\n\n<br>\n\n<label vcl-form-control-label label=\"Label text\" subLabel=\"Sub label text\" for=\"form-control-label-demo-checkbox-1\"></label>\n<vcl-checkbox [(checked)]=\"checkBox1Checked\" id=\"form-control-label-demo-checkbox-1\"></vcl-checkbox>\n\n<br>\n<br>\n\nWrapping label:<br>\n\n<label vcl-form-control-label label=\"Label 2 text\" subLabel=\"Sub label 2 text\">\n  <vcl-checkbox [(checked)]=\"checkBox2Checked\" id=\"form-control-label-demo-checkbox-2\"></vcl-checkbox>\n</label>\n\nDisabled label:<br>\n\n<label vcl-form-control-label label=\"Label 3 disabled\" disabled=true></label>\n\nRequired label:<br>\n\n<label vcl-form-control-label label=\"Label 3 required\" required=true requiredIndLabel=\"reqLabel\"></label>\n\nWrapped label:<br>\n\n<label vcl-form-control-label label=\"Label 3 disabled\" wrapping=true>\n  <vcl-checkbox [(checked)]=\"checkBox2Checked\" id=\"form-control-label-demo-checkbox-2\"></vcl-checkbox>\n</label>\n\n"

/***/ },

/***/ 422:
/***/ function(module, exports) {

module.exports = "<vcl-icogram label=\"some label\"></vcl-icogram>\n<br><br>\n<vcl-icogram label=\"icogram with accessible link\" prepIcon=\"fa:chevron-right\" href=\"http://example.org\"></vcl-icogram>\n<br><br>\n<vcl-icogram label=\"prep/app icons\" prepIcon=\"fa:chevron-right\" appIcon=\"fa:chevron-right\"></vcl-icogram>\n<br><br>\n<vcl-icogram label=\"flexed label\" appIcon=\"fa:chevron-right\" flexLabel=true class=\"vclLayoutHorizontal\"></vcl-icogram>\n<br><br>\n<vcl-icogram>\n  <vcl-icon icon=\"fa:cog\" [label]=\"'settings'\" hidden=\"false\"></vcl-icon>\n</vcl-icogram>\n<br><br>\n<vcl-icogram>\n  <span class=\"vclText\" flex>Prepended icon</span>\n  <div class=\"vclIcon fa fa-user\" aria-hidden=\"true\" aria-label=\"account\" role=\"img\"></div>\n</vcl-icogram>\n"

/***/ },

/***/ 423:
/***/ function(module, exports) {

module.exports = "Custom icon (from the <i>Font Awesome</i> icon font):\n<vcl-icon iconClass=\"vclIconSize2\" icon=\"fa fa-cog fa-2x\"></vcl-icon>\n\n<br><br>\n\nIcon provider based (from the <i>Font Awesome</i> icon font):\n<vcl-icon iconClass=\"vclIconSize2\" icon=\"fa:cog:2x\"></vcl-icon>\n\n<br><br>\n\nPNG image resource based:\n<vcl-icon [src]=\"'http://materialdesignicons.com/api/download/icon/png/E4A14909-3821-4DB1-A739-4DA464ABEEB7/36'\"></vcl-icon>\n\n<br><br>\n\nSVG image resource based:\n<vcl-icon [src]=\"'http://materialdesignicons.com/api/download/icon/png/E4A14909-3821-4DB1-A739-4DA464ABEEB7'\"></vcl-icon>\n\n<br><br>\n\nSVG use ref based:\n<svg style=\"display: none;\">\n<defs>\n<path id=\"twitter\" d=\"M100.001,17.942c-3.681,1.688-7.633,2.826-11.783,3.339\nc4.236-2.624,7.49-6.779,9.021-11.73c-3.965,2.432-8.354,4.193-13.026,5.146C80.47,10.575,75.138,8,69.234,8\nc-11.33,0-20.518,9.494-20.518,21.205c0,1.662,0.183,3.281,0.533,4.833c-17.052-0.884-32.168-9.326-42.288-22.155\nc-1.767,3.133-2.778,6.773-2.778,10.659c0,7.357,3.622,13.849,9.127,17.65c-3.363-0.109-6.525-1.064-9.293-2.651\nc-0.002,0.089-0.002,0.178-0.002,0.268c0,10.272,7.072,18.845,16.458,20.793c-1.721,0.484-3.534,0.744-5.405,0.744\nc-1.322,0-2.606-0.134-3.859-0.379c2.609,8.424,10.187,14.555,19.166,14.726c-7.021,5.688-15.867,9.077-25.48,9.077\nc-1.656,0-3.289-0.102-4.895-0.297C9.08,88.491,19.865,92,31.449,92c37.737,0,58.374-32.312,58.374-60.336\nc0-0.92-0.02-1.834-0.059-2.743C93.771,25.929,97.251,22.195,100.001,17.942L100.001,17.942z\"></path>\n</defs>\n</svg>\n<vcl-icon [svguse]=\"'#twitter'\" [class]=\"'vclIconSize1'\"></vcl-icon>\n"

/***/ },

/***/ 424:
/***/ function(module, exports) {

module.exports = "<input vcl-input [(ngModel)]=\"data1\">\n<br>\n<b>Input 1 value:</b> {{data1}}\n\n<br>\n<br>\n<br>\n<input vcl-input [(ngModel)]=\"data2\" selectAllOnFocus=true>\n<br>\n<b>Input 2 value:</b> {{data2}}\n\n<br>\n<br>\n<br>\n<input vcl-input [(typedValue)]=\"data3\" valueType=\"number\" selectAllOnFocus=true>\n<br>\n<b>Input 3 Typed value (number):</b> {{data3}}\n\n<br>\n<br>\n<br>\n<input vcl-input value='readOnly' readOnly=true>\n<br>\n<b>Input 4 (readOnly)</b>\n"

/***/ },

/***/ 425:
/***/ function(module, exports) {

module.exports = "<vcl-layer-base></vcl-layer-base>\n\n<button vcl-button (click)=\"layerNonModal.open()\" label=\"open non-modal layer per reference\"></button>\n<button vcl-button (click)=\"layer1.open()\" label=\"open modal layer\"></button>\n<button vcl-button (click)=\"openLayerWithData()\" label=\"open layer programmatically\"></button>\n\n<template vcl-layer #layerNonModal=\"layer\" [modal]=\"false\" [name]=\"'nonModal'\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">Non-modal layer title goes here</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        Non-modal layer text goes here<br><br>\n        <button vcl-button (click)=\"layerNonModal.close()\" label=\"close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n\n<template vcl-layer #layer1=\"layer\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">Modal layer 1 title goes here</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        Modal layer 1 text goes here<br><br>\n        <button vcl-button (click)=\"layer2.open()\" label=\"open Layer2\"></button>\n        <button vcl-button (click)=\"layer1.close()\" label=\"close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n\n<template vcl-layer #layer2=\"layer\" [modal]=\"false\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">Non-modal layer 2 title goes here</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        non-modal layer 2 text goes here<br><br>\n        <button vcl-button (click)=\"layer2.close()\" label=\"close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n\n<template vcl-layer #layerWithData=\"layer\" [modal]=\"false\" [name]=\"'withData'\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">{{layerWithData.data.title}}</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        Send data by pressing the buttons<br><br>\n        <button vcl-button (click)=\"layerWithData.send('send')\" label=\"Send data\"></button>\n        <button vcl-button (click)=\"layerWithData.close('close')\" label=\"close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n"

/***/ },

/***/ 426:
/***/ function(module, exports) {

module.exports = "Link with action:\n<br>\n<a vcl-link\n  (click)=\"someAction($event)\"\n  [label]=\"'Trigger test action'\"></a>\n<br><br>\n\nhref attribute only (label is automatically created):\n<br>\n<a vcl-link\n  [href]=\"'http://www.example.com'\"></a>\n<br><br>\n\nLabel and prepended icon:\n<br>\n<a vcl-link\n  [href]=\"'#'\"\n  [label]=\"'Example Link'\"\n  [prepIcon]=\"'fa:chevron-right'\"></a>\n<br><br>\n\n<!-- \nBlock usage:\n<br>\n<a vcl-link [href]=\"'#'\">\n  Label from block\n</a>\n<br><br>\n-->\n\nDisabled link:\n<br>\n<a vcl-link\n  [disabled]=\"true\"\n  [href]=\"'this is not considered as the link is disabled'\"\n  [label]=\"'Disabled link'\"></a>\n<br><br>\n\nLink with target _blank:\n<br>\n<a vcl-link\n  [href]=\"'https://github.com/ember-vcl'\"\n  [target]=\"'_blank'\"\n  [label]=\"'Target _blank link'\"></a>\n<br><br>\n\nLink with title and scheme:\n<br>\n<a vcl-link\n  [title]=\"'link title'\"\n  [scheme]=\"'tel'\"\n  [href]=\"'004971122222222'\"\n  [label]=\"'I\\'m a telephone number schemed link'\"></a>\n<br><br>\n"

/***/ },

/***/ 427:
/***/ function(module, exports) {

module.exports = "<vcl-metalist [items]=\"items\" [meta]=\"metaInformation\" #metalist>\n  <template let-item=\"item\" let-meta=\"meta\">\n    <div (tap)=\"select(meta)\">\n      Some HTML // {{item.name}}<span *ngIf=\"meta.selected\"> // selected</span> <span *ngIf=\"meta.marked\"> // marked</span>\n    </div>\n  </template>\n</vcl-metalist>\n\n<button vcl-button (tap)=\"metalist.prev()\">prev</button>\n<button vcl-button (tap)=\"metalist.next()\">next</button>\n"

/***/ },

/***/ 428:
/***/ function(module, exports) {

module.exports = "<vcl-month-picker\n  id=\"myStyledMonthPicker\"\n  [prevYearAvailable]=\"true\"\n  [nextYearAvailable]=\"true\"\n  [colors]=\"['#50E3C2', '#FF3CE6']\">\n</vcl-month-picker>\n\n<br><br>\n\n<button vcl-button #target\n  label=\"Expand\"\n  class=\"vclSquare\"\n  (click)=\"expandMonthPicker($event)\">\n</button>\n\n<vcl-popover\n  target='#target'\n  targetAttachment='bottom right'\n  attachment='top right'\n  [(open)]=\"expanded\">\n  <vcl-month-picker\n    [expandable]=\"true\"\n    [(expanded)]=\"expanded\"\n    [(currentYear)]=\"currentYear\"\n    [useShortNames]=\"true\"\n    [monthsPerRow]=\"4\"\n    (select)=\"onSelect($event)\"\n    (prevYearBtnTap)=\"onPreviousYearTap()\"\n    [prevYearAvailable]=\"prevYearAvailable\"\n    (nextYearBtnTap)=\"onNextYearTap()\"\n    [nextYearAvailable]=\"nextYearAvailable\">\n  </vcl-month-picker>\n</vcl-popover>\n"

/***/ },

/***/ 429:
/***/ function(module, exports) {

module.exports = "Horizontal navigation\n<vcl-navigation [navigationItems]=\"items\"></vcl-navigation>\n\nVertical navigation\n<vcl-navigation [navigationItems]=\"items2\" type=\"vertical\"></vcl-navigation>\n"

/***/ },

/***/ 430:
/***/ function(module, exports) {

module.exports = "<div (off-click)=\"offClick()\" style=\"border: 2px solid;background-color:red;width:300px;height:300px\">\n  DIV 1\n  <br>\n  Click somewhere outside to trigger off-click\n  <div style=\"border: 1px solid;background-color:green;width:50%;margin:auto; height:100px\">\n    DIV 2 \n    <br>\n    This is a subelement of DIV 1 \n  </div>\n</div>\n<br>\n<div *ngIf=\"clicks>0\">off-click triggered: {{clicks}}</div>\n<div *ngIf=\"clicks===0\">Click anywhere to trigger the off-click</div>\n  \n"

/***/ },

/***/ 431:
/***/ function(module, exports) {

module.exports = "<button vcl-button (click)=\"showPopover()\" label=\"show popover\"></button>\n\n<vcl-popover target='#target' [(open)]=\"open\" class='' [style]=\"style\">\n  popover text goes here <br>\n  <button vcl-button (click)=\"showPopover2()\" label=\"show popover2\" id=\"button1\"></button>\n  <button vcl-button (click)=\"closePopover()\" label=\"close popover\"></button>\n</vcl-popover>\n\n<vcl-popover target='#button1' [(open)]=\"open2\" [style]=\"style\">\n  popover 2 text goes here <br>\n</vcl-popover>\n\n<div id=\"target\" style=\"position: absolute; top: 200px; left: 200px; padding: 10px; border: 3px double green\">\n  this is the target\n</div>"

/***/ },

/***/ 432:
/***/ function(module, exports) {

module.exports = "Checkable:\n<vcl-radio-button [(checked)]=\"isChecked\"></vcl-radio-button>\n\n<br><br>\n<b>Checked:</b> {{isChecked}}\n\n<br><br>\n<button vcl-button (click)=\"isChecked=false\">Uncheck radio button</button>\n\n<br><br>\nDisabled:\n<vcl-radio-button [disabled]=\"true\"></vcl-radio-button>\n"

/***/ },

/***/ 433:
/***/ function(module, exports) {

module.exports = "<b>Single select</b><br>\n<vcl-select [items]=\"items\" (select)=\"onSelect($event)\"></vcl-select>\n<div *ngIf=\"selectedItemSingle\">\n  Selected: {{selectedItemSingle.label}}\n</div>\n\n<br>\n<br>\n<b>Multiselect, 3 Items selectable</b><br>\n\n<vcl-select [items]=\"items\" (select)=\"onSelectMulti($event)\" [maxSelectableItems]=\"3\"></vcl-select>\n<div *ngIf=\"selectedItemsMulti\">\n  Selected:\n  <ul>\n    <li *ngFor=\"let item of selectedItemsMulti\">{{item.label}}</li>\n  </ul>\n</div>\n"

/***/ },

/***/ 434:
/***/ function(module, exports) {

module.exports = "<h3>Default</h3>\n\n<vcl-tab-nav >\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>Content1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>Content2</template>\n  </vcl-tab>\n  <vcl-tab [disabled]=\"true\"><template vcl-tab-label>Tab3 disabled</template>\n    <template vcl-tab-content>Content3</template>\n  </vcl-tab>\n</vcl-tab-nav>\n\n<hr>\n\n<h3>With layout=\"right\"</h3>\n\n<vcl-tab-nav layout=\"right\" tabContentClass=\"vclSpan-70p\" tabsClass=\"vclSpan-30p\">\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>Content1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>Content2</template>\n  </vcl-tab>\n</vcl-tab-nav>\n\n<hr>\n\n<h3>With layout=\"left\"</h3>\n\n<vcl-tab-nav layout=\"left\" tabContentClass=\"vclSpan-70p\" tabsClass=\"vclSpan-30p\">\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>Content1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>Content2</template>\n  </vcl-tab>\n</vcl-tab-nav>\n\n<hr>\n\n<h3>With borders=true</h3>\n\n<vcl-tab-nav borders=true>\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>Content1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>Content2</template>\n  </vcl-tab>\n</vcl-tab-nav>\n\n\n<h3>With borders=true</h3>\n\n<vcl-tab-nav borders=true>\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>Content1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>Content2</template>\n  </vcl-tab>\n</vcl-tab-nav>\n\n<h3>Shared content template</h3>\n\n<vcl-tab-nav [(selectedTabIndex)]=\"tabIndex\">\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n  </vcl-tab>\n  <template vcl-tab-content>Shared Content Tab: {{tabIndex}}</template>\n</vcl-tab-nav>\n"

/***/ },

/***/ 435:
/***/ function(module, exports) {

module.exports = "<vcl-tether target='#target' targetAttachment='bottom right' attachment='top left' class='tethercontainer' zIndex='7'>\n  <div style=\"border: 1px solid red; padding: 20px; \">\n    tether text goes here\n  </div>\n</vcl-tether>\n\n<div id=\"target\" style=\"position: absolute; top: 200px; left: 200px; padding: 10px; border: 3px double green\">\n  this is the target\n</div>"

/***/ },

/***/ 436:
/***/ function(module, exports) {

module.exports = "<vcl-toolbar>\n  <button vcl-button class=\"vclTransparent\" appIcon=\"fa:navicon\"></button>\n  <button vcl-button class=\"vclTransparent\" appIcon=\"fa:plus\"></button>\n</vcl-toolbar>\n"

/***/ },

/***/ 437:
/***/ function(module, exports) {

module.exports = "The wormhole is defined above the hr\n<template generateWormhole #myFirstWormhole=\"wormhole\">\n  But is rendered below\n</template>\n<hr>\n<div [wormhole]=\"myFirstWormhole\">\n</div>\n\n\n"

/***/ },

/***/ 475:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var forms_1 = __webpack_require__(280);
var platform_browser_1 = __webpack_require__(131);
var index_1 = __webpack_require__(670);
var l10n_module_1 = __webpack_require__(28);
var app_component_1 = __webpack_require__(599);
var home_component_1 = __webpack_require__(368);
var markdown_component_1 = __webpack_require__(622);
var demo_component_1 = __webpack_require__(367);
var demos_1 = __webpack_require__(239);
var app_routes_1 = __webpack_require__(600);
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            providers: [
                app_routes_1.appRoutingProviders
            ],
            imports: [
                forms_1.FormsModule,
                platform_browser_1.BrowserModule,
                app_routes_1.routing,
                index_1.VCLModule,
                l10n_module_1.L10nModule.forRoot({
                    config: {},
                    loader: l10n_module_1.L10nStaticLoaderService,
                    loaderConfig: {}
                })
            ],
            declarations: [
                app_component_1.AppComponent,
                home_component_1.HomeComponent,
                demo_component_1.DemoComponent,
                markdown_component_1.MarkdownComponent,
                demo_component_1.DemoContentComponent
            ].concat((demos_1.DEMOS.map(function (dc) { return Object.keys(dc.tabs).map(function (key) { return dc.tabs[key]; }).filter(function (o) { return typeof o === 'function'; }); }))),
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;


/***/ },

/***/ 599:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(101);
var demos_1 = __webpack_require__(239);
// TODO: update typedef for fuse.js
// https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/fuse
var Fuse = __webpack_require__(802);
var AppComponent = (function () {
    function AppComponent(router, activatedRoute) {
        this.router = router;
        this.activatedRoute = activatedRoute;
        this.searchResults = [];
    }
    AppComponent.prototype.ngOnInit = function () {
        this.router.events.subscribe(function (path) {
            window.scrollTo(0, 0);
        });
    };
    AppComponent.prototype.search = function (text) {
        this.searchResults = new Fuse(demos_1.GROUPED_DEMOS, { keys: ['items.label'] })
            .search(text)
            .reduce(function (p, demoGroup) {
            return p.concat(new Fuse(demoGroup.items, { keys: ['label'] }).search(text));
        }, []);
    };
    Object.defineProperty(AppComponent.prototype, "demos", {
        get: function () {
            return demos_1.DEMOS;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(AppComponent.prototype, "groupedDemos", {
        get: function () {
            return this.searchResults.length
                ? this.searchResults
                : demos_1.GROUPED_DEMOS;
        },
        enumerable: true,
        configurable: true
    });
    AppComponent = __decorate([
        core_1.Component({
            selector: 'app',
            template: __webpack_require__(807)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object, (typeof (_b = typeof router_1.ActivatedRoute !== 'undefined' && router_1.ActivatedRoute) === 'function' && _b) || Object])
    ], AppComponent);
    return AppComponent;
    var _a, _b;
}());
exports.AppComponent = AppComponent;


/***/ },

/***/ 600:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var router_1 = __webpack_require__(101);
var home_component_1 = __webpack_require__(368);
var demos_1 = __webpack_require__(239);
exports.routes = [
    {
        path: '',
        component: home_component_1.HomeComponent,
    }
].concat(demos_1.DEMO_ROUTES);
exports.appRoutingProviders = [];
exports.routing = router_1.RouterModule.forRoot(exports.routes, {
    useHash: true
});


/***/ },

/***/ 601:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var ButtonGroupComponent = (function () {
    function ButtonGroupComponent() {
        this.idx1 = 1;
        this.idx2 = [0, 2];
    }
    ButtonGroupComponent.prototype.ngOnInit = function () { };
    ButtonGroupComponent.prototype.buttonClick = function (param) {
        console.log('buttonClick, param:', param);
    };
    ButtonGroupComponent.prototype.selectionChange1 = function (param) {
        console.log('selectionChange1, param:', param);
    };
    ButtonGroupComponent.prototype.selectionChange2 = function (param) {
        console.log('selectionChange2, param:', param);
    };
    ButtonGroupComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(417)
        }), 
        __metadata('design:paramtypes', [])
    ], ButtonGroupComponent);
    return ButtonGroupComponent;
}());
exports.ButtonGroupComponent = ButtonGroupComponent;


/***/ },

/***/ 602:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var button_group_component_1 = __webpack_require__(601);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Button Group',
    path: 'button-group',
    category: 'Buttons',
    tabs: {
        Demo: button_group_component_1.ButtonGroupComponent,
        'README.md': __webpack_require__(832),
        'demo.component.html': __webpack_require__(417),
        'demo.component.ts': __webpack_require__(808)
    }
};


/***/ },

/***/ 603:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var ButtonComponent = (function () {
    function ButtonComponent() {
    }
    ButtonComponent.prototype.someAction = function (param) {
        console.log('Action handler, param:', param);
    };
    ButtonComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(418)
        }), 
        __metadata('design:paramtypes', [])
    ], ButtonComponent);
    return ButtonComponent;
}());
exports.ButtonComponent = ButtonComponent;


/***/ },

/***/ 604:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var button_component_1 = __webpack_require__(603);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Button',
    path: 'button',
    category: 'Buttons',
    tabs: {
        Demo: button_component_1.ButtonComponent,
        'README.md': __webpack_require__(833),
        'demo.component.html': __webpack_require__(418),
        'demo.component.ts': __webpack_require__(809)
    }
};


/***/ },

/***/ 605:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var CheckboxComponent = (function () {
    function CheckboxComponent() {
        this.isChecked = false;
    }
    CheckboxComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(419)
        }), 
        __metadata('design:paramtypes', [])
    ], CheckboxComponent);
    return CheckboxComponent;
}());
exports.CheckboxComponent = CheckboxComponent;


/***/ },

/***/ 606:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var checkbox_component_1 = __webpack_require__(605);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Checkbox',
    path: 'checkbox',
    category: 'Inputs',
    tabs: {
        Demo: checkbox_component_1.CheckboxComponent,
        'README.md': __webpack_require__(835),
        'demo.component.html': __webpack_require__(419),
        'demo.component.ts': __webpack_require__(810)
    }
};


/***/ },

/***/ 607:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var DropdownComponent = (function () {
    function DropdownComponent() {
        this.expanded = true;
        this.items = [
            { label: 'item 1' },
            { label: 'item 2' },
            { label: 'item 3' },
            { label: 'item 4' },
            { label: 'item 5' },
            { label: 'item 6', sublabel: 'sublabel of item 6' },
            { label: 'item 7', sublabel: 'sublabel of item 7' },
            { label: 'item 8', sublabel: 'sublabel of item 8' },
            { label: 'item 9' },
            { label: 'item 10' }
        ];
    }
    DropdownComponent.prototype.ngOnInit = function () { };
    DropdownComponent.prototype.onSelect = function (selectedItems) {
        console.log(selectedItems);
        if (selectedItems && selectedItems[0]) {
            this.selectedItem = selectedItems[0];
        }
        else {
            this.selectedItem = null;
        }
    };
    DropdownComponent.prototype.expand = function () {
        this.expanded = !this.expanded;
    };
    DropdownComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(420)
        }), 
        __metadata('design:paramtypes', [])
    ], DropdownComponent);
    return DropdownComponent;
}());
exports.DropdownComponent = DropdownComponent;


/***/ },

/***/ 608:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var dropdown_component_1 = __webpack_require__(607);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Dropdown',
    path: 'dropdown',
    category: 'Inputs',
    tabs: {
        Demo: dropdown_component_1.DropdownComponent,
        'demo.component.html': __webpack_require__(420),
        'demo.component.ts': __webpack_require__(812)
    }
};


/***/ },

/***/ 609:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var FormControlLabelComponent = (function () {
    function FormControlLabelComponent() {
        this.checkboxChecked = false;
    }
    FormControlLabelComponent.prototype.ngOnInit = function () { };
    FormControlLabelComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(421)
        }), 
        __metadata('design:paramtypes', [])
    ], FormControlLabelComponent);
    return FormControlLabelComponent;
}());
exports.FormControlLabelComponent = FormControlLabelComponent;


/***/ },

/***/ 610:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var form_control_label_component_1 = __webpack_require__(609);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Form Control Label',
    path: 'form-control-label',
    category: 'Forms',
    tabs: {
        Demo: form_control_label_component_1.FormControlLabelComponent,
        'README.md': __webpack_require__(837),
        'demo.component.html': __webpack_require__(421),
        'demo.component.ts': __webpack_require__(813)
    }
};


/***/ },

/***/ 611:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var IcogramComponent = (function () {
    function IcogramComponent() {
    }
    IcogramComponent.prototype.ngOnInit = function () { };
    IcogramComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(422)
        }), 
        __metadata('design:paramtypes', [])
    ], IcogramComponent);
    return IcogramComponent;
}());
exports.IcogramComponent = IcogramComponent;


/***/ },

/***/ 612:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var icogram_component_1 = __webpack_require__(611);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Icogram',
    path: 'icogram',
    category: 'Images',
    tabs: {
        Demo: icogram_component_1.IcogramComponent,
        'README.md': __webpack_require__(839),
        'demo.component.html': __webpack_require__(422),
        'demo.component.ts': __webpack_require__(815)
    }
};


/***/ },

/***/ 613:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var IconComponent = (function () {
    function IconComponent() {
    }
    IconComponent.prototype.ngOnInit = function () { };
    IconComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(423)
        }), 
        __metadata('design:paramtypes', [])
    ], IconComponent);
    return IconComponent;
}());
exports.IconComponent = IconComponent;


/***/ },

/***/ 614:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var icon_component_1 = __webpack_require__(613);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Icon',
    path: 'icon',
    category: 'Images',
    tabs: {
        Demo: icon_component_1.IconComponent,
        'README.md': __webpack_require__(841),
        'demo.component.html': __webpack_require__(423),
        'demo.component.ts': __webpack_require__(816)
    }
};


/***/ },

/***/ 615:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var InputComponent = (function () {
    function InputComponent() {
    }
    InputComponent.prototype.ngOnInit = function () { };
    InputComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(424)
        }), 
        __metadata('design:paramtypes', [])
    ], InputComponent);
    return InputComponent;
}());
exports.InputComponent = InputComponent;


/***/ },

/***/ 616:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var input_component_1 = __webpack_require__(615);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Input',
    path: 'input',
    category: 'Inputs',
    tabs: {
        Demo: input_component_1.InputComponent,
        'README.md': __webpack_require__(843),
        'demo.component.html': __webpack_require__(424),
        'demo.component.ts': __webpack_require__(817)
    }
};


/***/ },

/***/ 617:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'L10n',
    path: 'l10n',
    category: 'Other',
    tabs: {
        'README.md': __webpack_require__(859),
    }
};


/***/ },

/***/ 618:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var layer_module_1 = __webpack_require__(240);
var core_1 = __webpack_require__(0);
var LayerComponent = (function () {
    function LayerComponent(layerService) {
        this.layerService = layerService;
    }
    LayerComponent.prototype.openLayerWithData = function () {
        this.layerService.open('withData', {
            title: 'This title is provided as an argument'
        }).subscribe(function (data) {
            // Layer sends data
            console.log(data);
        }, null, function () {
            // Layer is closed
            console.log('layer closed');
        });
    };
    LayerComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(425),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof layer_module_1.LayerService !== 'undefined' && layer_module_1.LayerService) === 'function' && _a) || Object])
    ], LayerComponent);
    return LayerComponent;
    var _a;
}());
exports.LayerComponent = LayerComponent;


/***/ },

/***/ 619:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var layer_component_1 = __webpack_require__(618);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Layer',
    path: 'layer',
    category: 'Layer',
    declarations: [layer_component_1.LayerComponent],
    tabs: {
        Demo: layer_component_1.LayerComponent,
        'README.md': __webpack_require__(844),
        'demo.component.html': __webpack_require__(425),
        'demo.component.ts': __webpack_require__(818)
    }
};


/***/ },

/***/ 620:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var LinkComponent = (function () {
    function LinkComponent() {
    }
    LinkComponent.prototype.ngOnInit = function () { };
    LinkComponent.prototype.someAction = function (param) {
        console.log('Action handler, param:', param);
    };
    LinkComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(426)
        }), 
        __metadata('design:paramtypes', [])
    ], LinkComponent);
    return LinkComponent;
}());
exports.LinkComponent = LinkComponent;


/***/ },

/***/ 621:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var link_component_1 = __webpack_require__(620);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Link',
    path: 'link',
    category: 'Links',
    tabs: {
        Demo: link_component_1.LinkComponent,
        'README.md': __webpack_require__(846),
        'demo.component.html': __webpack_require__(426),
        'demo.component.ts': __webpack_require__(819)
    }
};


/***/ },

/***/ 622:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var marked = __webpack_require__(804);
var style = __webpack_require__(820);
marked.setOptions({
    breaks: true
});
var MarkdownComponent = (function () {
    function MarkdownComponent() {
    }
    Object.defineProperty(MarkdownComponent.prototype, "marked", {
        get: function () {
            return marked(this.markdown);
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MarkdownComponent.prototype, "markdown", void 0);
    MarkdownComponent = __decorate([
        core_1.Component({
            template: '<div class="markdown-body" [innerHTML]="marked"></div>',
            styles: [style],
            selector: 'markdown',
        }), 
        __metadata('design:paramtypes', [])
    ], MarkdownComponent);
    return MarkdownComponent;
}());
exports.MarkdownComponent = MarkdownComponent;


/***/ },

/***/ 623:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var MetalistComponent = (function () {
    function MetalistComponent() {
        this.items = [
            { name: 'name 1' },
            { name: 'name 2' },
            { name: 'name 3' },
            { name: 'name 4' },
            { name: 'name 5' },
        ];
        this.metaInformation = [
            null,
            null,
            { selected: true }
        ];
    }
    MetalistComponent.prototype.ngOnInit = function () { };
    MetalistComponent.prototype.select = function (meta) {
        if (!meta.selected) {
            meta.selected = true;
        }
        else {
            meta.selected = false;
        }
        console.log('Meta informations: ', this.metaInformation);
    };
    MetalistComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(427)
        }), 
        __metadata('design:paramtypes', [])
    ], MetalistComponent);
    return MetalistComponent;
}());
exports.MetalistComponent = MetalistComponent;


/***/ },

/***/ 624:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var metalist_component_1 = __webpack_require__(623);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Metalist',
    path: 'metalist',
    category: 'Component',
    tabs: {
        Demo: metalist_component_1.MetalistComponent,
        'demo.component.html': __webpack_require__(427),
        'demo.component.ts': __webpack_require__(821)
    }
};


/***/ },

/***/ 625:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var MonthPickerComponent = (function () {
    function MonthPickerComponent() {
        this.expanded = false;
        this.thisYear = new Date().getUTCFullYear();
        this.currentYear = this.thisYear;
        this.prevYearAvailable = true;
        this.nextYearAvailable = false;
    }
    MonthPickerComponent.prototype.ngOnInit = function () { };
    MonthPickerComponent.prototype.expandMonthPicker = function () {
        this.expanded = !this.expanded;
    };
    MonthPickerComponent.prototype.onSelect = function (date) {
        console.log('onSelect():', date);
    };
    MonthPickerComponent.prototype.onPreviousYearTap = function () {
        console.log('onPreviousYearTap()');
        console.log('this.currentYear:', this.currentYear);
        if (this.currentYear < this.thisYear) {
            this.nextYearAvailable = true;
        }
    };
    MonthPickerComponent.prototype.onNextYearTap = function () {
        console.log('onNextYearTap()');
        console.log('this.currentYear:', this.currentYear);
        if (this.currentYear === this.thisYear) {
            this.nextYearAvailable = false;
        }
    };
    MonthPickerComponent = __decorate([
        core_1.Component({
            selector: 'month-picker',
            template: __webpack_require__(428),
        }), 
        __metadata('design:paramtypes', [])
    ], MonthPickerComponent);
    return MonthPickerComponent;
}());
exports.MonthPickerComponent = MonthPickerComponent;


/***/ },

/***/ 626:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var month_picker_component_1 = __webpack_require__(625);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Month Picker',
    path: 'month-picker',
    category: 'Inputs',
    tabs: {
        Demo: month_picker_component_1.MonthPickerComponent,
        'demo.component.html': __webpack_require__(428),
        'demo.component.ts': __webpack_require__(822)
    }
};


/***/ },

/***/ 627:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var NavigationComponent = (function () {
    function NavigationComponent() {
        this.items = [
            {
                label: 'Home',
                route: ['/navigation'],
                active: true,
                prepIcon: 'fa:home',
            },
            {
                label: 'Products',
                route: ['/navigation'],
                active: true,
                appIcon: 'fa:bicycle',
            },
            {
                label: 'Pre-selected Item',
                route: ['/navigation'],
                selected: true,
                active: true
            },
            {
                label: 'External link',
                href: 'https://searx.me',
                active: true,
            }
        ];
        this.items2 = [
            {
                label: 'Heading',
                heading: true,
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Item',
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Item',
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Another heading',
                heading: true,
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Item',
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Item',
                route: ['/navigation'],
                active: true
            },
            {
                label: 'Nested navigation',
                route: ['/navigation'],
                active: true,
                items: [
                    {
                        label: 'Level 2 Item',
                        route: ['/navigation'],
                        active: true
                    },
                    {
                        label: 'Level 2 Item',
                        route: ['/navigation'],
                        active: true
                    },
                    {
                        label: 'Level 2 navigation',
                        route: ['/navigation'],
                        active: true,
                        items: [
                            {
                                label: 'Level 3 Item',
                                route: ['/navigation'],
                                active: true
                            },
                            {
                                label: 'Level 3 Item',
                                route: ['/navigation'],
                                active: true
                            },
                            {
                                label: 'Level 3 Item',
                                route: ['/navigation'],
                                active: true
                            },
                        ],
                    },
                    {
                        label: 'Level 2 Item',
                        route: ['/navigation'],
                        active: true
                    },
                ]
            }
        ];
    }
    NavigationComponent.prototype.ngOnInit = function () { };
    NavigationComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(429)
        }), 
        __metadata('design:paramtypes', [])
    ], NavigationComponent);
    return NavigationComponent;
}());
exports.NavigationComponent = NavigationComponent;


/***/ },

/***/ 628:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var navigation_component_1 = __webpack_require__(627);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Navigation',
    path: 'navigation',
    category: 'Navigation',
    tabs: {
        Demo: navigation_component_1.NavigationComponent,
        'demo.component.html': __webpack_require__(429),
        'demo.component.ts': __webpack_require__(823)
    }
};


/***/ },

/***/ 629:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var OffClickComponent = (function () {
    function OffClickComponent() {
        this.clicks = 0;
    }
    OffClickComponent.prototype.offClick = function () {
        this.clicks++;
    };
    OffClickComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(430)
        }), 
        __metadata('design:paramtypes', [])
    ], OffClickComponent);
    return OffClickComponent;
}());
exports.OffClickComponent = OffClickComponent;


/***/ },

/***/ 630:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var off_click_component_1 = __webpack_require__(629);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Off Click',
    path: 'off-click',
    category: 'Other',
    tabs: {
        Demo: off_click_component_1.OffClickComponent,
        'README.md': __webpack_require__(857),
        'demo.component.html': __webpack_require__(430),
        'demo.component.ts': __webpack_require__(824)
    }
};


/***/ },

/***/ 631:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var PopoverComponent = (function () {
    function PopoverComponent() {
        this.open = false;
        this.open2 = false;
        this.state = 'inactive';
        this.style = {
            border: '3px double red',
            padding: '20px',
            overflow: 'hidden'
        };
    }
    PopoverComponent.prototype.showPopover = function () {
        this.open = true;
    };
    PopoverComponent.prototype.closePopover = function () {
        this.open = false;
    };
    PopoverComponent.prototype.showPopover2 = function () {
        this.open2 = true;
    };
    PopoverComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(431),
        }), 
        __metadata('design:paramtypes', [])
    ], PopoverComponent);
    return PopoverComponent;
}());
exports.PopoverComponent = PopoverComponent;


/***/ },

/***/ 632:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var popover_component_1 = __webpack_require__(631);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Popover',
    path: 'popover',
    category: 'Layer',
    tabs: {
        Demo: popover_component_1.PopoverComponent,
        'demo.component.html': __webpack_require__(431),
        'demo.component.ts': __webpack_require__(825)
    }
};


/***/ },

/***/ 633:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var RadioButtonComponent = (function () {
    function RadioButtonComponent() {
        this.isChecked = false;
    }
    RadioButtonComponent.prototype.ngOnInit = function () { };
    RadioButtonComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(432)
        }), 
        __metadata('design:paramtypes', [])
    ], RadioButtonComponent);
    return RadioButtonComponent;
}());
exports.RadioButtonComponent = RadioButtonComponent;


/***/ },

/***/ 634:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var radio_button_component_1 = __webpack_require__(633);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Radio Button',
    path: 'radio-button',
    category: 'Inputs',
    tabs: {
        Demo: radio_button_component_1.RadioButtonComponent,
        'README.md': __webpack_require__(852),
        'demo.component.html': __webpack_require__(432),
        'demo.component.ts': __webpack_require__(826)
    }
};


/***/ },

/***/ 635:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var SelectComponent = (function () {
    function SelectComponent() {
        this.items = [
            { label: 'item 1' },
            { label: 'item 2' },
            { label: 'item 3' },
            { label: 'item 4' },
            { label: 'item 5' },
            { label: 'item 6', sublabel: 'sublabel of item 6' },
            { label: 'item 7', sublabel: 'sublabel of item 7' },
            { label: 'item 8', sublabel: 'sublabel of item 8' },
            { label: 'item 9' },
            { label: 'item 10' }
        ];
    }
    SelectComponent.prototype.ngOnInit = function () { };
    SelectComponent.prototype.onSelect = function (items) {
        if (items.length) {
            this.selectedItemSingle = items[0];
        }
        else {
            this.selectedItemSingle = null;
        }
        console.log('Selected Items: ', items);
    };
    SelectComponent.prototype.onSelectMulti = function (items) {
        this.selectedItemsMulti = items;
        console.log('Selected Items: ', items);
    };
    SelectComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(433)
        }), 
        __metadata('design:paramtypes', [])
    ], SelectComponent);
    return SelectComponent;
}());
exports.SelectComponent = SelectComponent;


/***/ },

/***/ 636:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var select_component_1 = __webpack_require__(635);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Select',
    path: 'select',
    category: 'Inputs',
    tabs: {
        Demo: select_component_1.SelectComponent,
        'demo.component.html': __webpack_require__(433),
        'demo.component.ts': __webpack_require__(827)
    }
};


/***/ },

/***/ 637:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var TabNavComponent = (function () {
    function TabNavComponent() {
        this.tabIndex = 0;
    }
    TabNavComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(434)
        }), 
        __metadata('design:paramtypes', [])
    ], TabNavComponent);
    return TabNavComponent;
}());
exports.TabNavComponent = TabNavComponent;


/***/ },

/***/ 638:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var tab_nav_component_1 = __webpack_require__(637);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Tab Navigation',
    path: 'tab-nav',
    category: 'Navigation',
    tabs: {
        Demo: tab_nav_component_1.TabNavComponent,
        'README.md': __webpack_require__(854),
        'demo.component.html': __webpack_require__(434),
        'demo.component.ts': __webpack_require__(828)
    }
};


/***/ },

/***/ 639:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var TetherComponent = (function () {
    function TetherComponent() {
    }
    TetherComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(435)
        }), 
        __metadata('design:paramtypes', [])
    ], TetherComponent);
    return TetherComponent;
}());
exports.TetherComponent = TetherComponent;


/***/ },

/***/ 640:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var tether_component_1 = __webpack_require__(639);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Tether',
    path: 'tether',
    category: 'Other',
    tabs: {
        Demo: tether_component_1.TetherComponent,
        'demo.component.html': __webpack_require__(435),
        'demo.component.ts': __webpack_require__(829)
    }
};


/***/ },

/***/ 641:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var ToolbarComponent = (function () {
    function ToolbarComponent() {
    }
    ToolbarComponent.prototype.ngOnInit = function () { };
    ToolbarComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(436)
        }), 
        __metadata('design:paramtypes', [])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;


/***/ },

/***/ 642:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var toolbar_component_1 = __webpack_require__(641);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Toolbar',
    path: 'toolbar',
    category: 'Navigation',
    tabs: {
        Demo: toolbar_component_1.ToolbarComponent,
        'demo.component.html': __webpack_require__(436),
        'demo.component.ts': __webpack_require__(830)
    }
};


/***/ },

/***/ 643:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var wormhole_module_1 = __webpack_require__(73);
var WormholeComponent = (function () {
    function WormholeComponent() {
    }
    WormholeComponent.prototype.ngAfterViewInit = function () {
        console.log('myFirstWormhole', this.myFirstWormhole);
    };
    __decorate([
        core_1.ViewChild('myFirstWormhole'), 
        __metadata('design:type', (typeof (_a = typeof wormhole_module_1.WormholeGenerator !== 'undefined' && wormhole_module_1.WormholeGenerator) === 'function' && _a) || Object)
    ], WormholeComponent.prototype, "myFirstWormhole", void 0);
    WormholeComponent = __decorate([
        core_1.Component({
            template: __webpack_require__(437)
        }), 
        __metadata('design:paramtypes', [])
    ], WormholeComponent);
    return WormholeComponent;
    var _a;
}());
exports.WormholeComponent = WormholeComponent;


/***/ },

/***/ 644:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var wormhole_component_1 = __webpack_require__(643);
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    name: 'Wormhole',
    path: 'wormhole',
    category: 'Other',
    tabs: {
        Demo: wormhole_component_1.WormholeComponent,
        'README.md': __webpack_require__(858),
        'demo.component.html': __webpack_require__(437),
        'demo.component.ts': __webpack_require__(831)
    }
};


/***/ },

/***/ 645:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var http_1 = __webpack_require__(181);
var adv_http_service_1 = __webpack_require__(646);
exports.AdvHttp = adv_http_service_1.AdvHttp;
exports.ErrorHandlerService = adv_http_service_1.ErrorHandlerService;
exports.ADV_HTTP_CONFIG = adv_http_service_1.ADV_HTTP_CONFIG;
var AdvHttpModule = (function () {
    function AdvHttpModule() {
    }
    AdvHttpModule = __decorate([
        core_1.NgModule({
            imports: [http_1.HttpModule],
            providers: [
                adv_http_service_1.AdvHttp,
                {
                    provide: adv_http_service_1.ErrorHandlerService,
                    useClass: adv_http_service_1.ErrorHandlerService
                },
                {
                    provide: adv_http_service_1.AdvHttp,
                    useFactory: function (config, errorHandler, backend, defaultOptions) {
                        return new adv_http_service_1.AdvHttp(config, errorHandler, backend, defaultOptions);
                    },
                    deps: [adv_http_service_1.ADV_HTTP_CONFIG, adv_http_service_1.ErrorHandlerService, http_1.XHRBackend, http_1.RequestOptions]
                },
                {
                    provide: adv_http_service_1.ADV_HTTP_CONFIG,
                    useValue: {}
                }
            ]
        }), 
        __metadata('design:paramtypes', [])
    ], AdvHttpModule);
    return AdvHttpModule;
}());
exports.AdvHttpModule = AdvHttpModule;


/***/ },

/***/ 646:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var Observable_1 = __webpack_require__(1);
var ReplaySubject_1 = __webpack_require__(173);
__webpack_require__(446);
__webpack_require__(444);
__webpack_require__(441);
__webpack_require__(447);
var http_1 = __webpack_require__(181);
var core_1 = __webpack_require__(0);
/**
 *  Data caching
 */
var SyncableObservable = (function (_super) {
    __extends(SyncableObservable, _super);
    function SyncableObservable(source) {
        _super.call(this);
        this.source = source;
    }
    SyncableObservable.prototype._subscribe = function (subscriber) {
        return this.getDataSubject().subscribe(subscriber);
    };
    SyncableObservable.prototype.getDataSubject = function () {
        var subject = this._dataSubject;
        if (!subject) {
            this._dataSubject = new ReplaySubject_1.ReplaySubject(1);
        }
        return this._dataSubject;
    };
    SyncableObservable.prototype.sync = function () {
        var _this = this;
        var dataSubject = this.getDataSubject();
        if (this.sub) {
            this.sub.unsubscribe();
        }
        var sync$ = new Observable_1.Observable(function (observer) {
            var httpSub = _this.source.subscribe(function (data) {
                dataSubject.next(data);
                observer.next(data);
                observer.complete();
            }, function (err) {
                observer.error(err);
            });
            return function () {
                httpSub.unsubscribe();
            };
        }).publish();
        this.sub = sync$.connect();
        return sync$;
    };
    return SyncableObservable;
}(Observable_1.Observable));
exports.SyncableObservable = SyncableObservable;
Observable_1.Observable.prototype.syncable = function () {
    return new SyncableObservable(this);
};
/**
 *  Error handling
 */
(function (ErrorHandlingStrategy) {
    ErrorHandlingStrategy[ErrorHandlingStrategy["default"] = 0] = "default";
    ErrorHandlingStrategy[ErrorHandlingStrategy["retry"] = 1] = "retry";
    ErrorHandlingStrategy[ErrorHandlingStrategy["notify"] = 2] = "notify";
})(exports.ErrorHandlingStrategy || (exports.ErrorHandlingStrategy = {}));
var ErrorHandlingStrategy = exports.ErrorHandlingStrategy;
exports.ADV_HTTP_CONFIG = new core_1.OpaqueToken('adv.http.config');
var ErrorHandlerService = (function () {
    function ErrorHandlerService() {
    }
    ErrorHandlerService.prototype.notify = function (err) {
        console.log(err);
    };
    ErrorHandlerService.prototype.retry = function (err, retry, abort) {
        this.notify(err);
        abort();
    };
    ErrorHandlerService.prototype.transform = function (req$, errorStrategy) {
        var _this = this;
        // errorStrategy = errorStrategy || this.config.defaultErrorHandlingStrategy || ErrorHandlingStrategy.default;
        errorStrategy = errorStrategy || ErrorHandlingStrategy.default;
        if (errorStrategy && (errorStrategy === ErrorHandlingStrategy.notify || typeof errorStrategy === 'string')) {
            // Catch an error...
            req$ = req$.catch(function (err) {
                // ... and just pass it to the error handler
                // The error is rethrown so it can be catched
                if (errorStrategy === ErrorHandlingStrategy.notify) {
                    _this.notify(err);
                }
                else {
                    if (!_this[errorStrategy]) {
                        throw 'Error handling strategy not found: ' + errorStrategy;
                    }
                    _this[errorStrategy]();
                }
                return Observable_1.Observable.throw(err);
            });
        }
        else if (errorStrategy && errorStrategy === ErrorHandlingStrategy.retry) {
            req$ = req$.retryWhen(function (errors) {
                return errors.switchMap(function (err) {
                    return new Observable_1.Observable(function (observer) {
                        _this.retry(err, function () {
                            observer.next();
                        }, function () {
                            observer.error(err);
                        });
                    });
                });
            });
        }
        return req$;
    };
    ErrorHandlerService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], ErrorHandlerService);
    return ErrorHandlerService;
}());
exports.ErrorHandlerService = ErrorHandlerService;
var AdvHttp = (function (_super) {
    __extends(AdvHttp, _super);
    function AdvHttp(config, errorHandler, _backend, _defaultOptions) {
        _super.call(this, _backend, _defaultOptions);
        this.config = config;
        this.errorHandler = errorHandler;
    }
    AdvHttp.prototype.request = function (url, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.request.call(this, url, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.get = function (url, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.get.call(this, url, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.post = function (url, body, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.post.call(this, url, body, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.put = function (url, body, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.put.call(this, url, body, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.delete = function (url, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.delete.call(this, url, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.patch = function (url, body, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.patch.call(this, url, body, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.head = function (url, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.head.call(this, url, options), errorStrategy);
    };
    ;
    AdvHttp.prototype.options = function (url, options, errorStrategy) {
        return this.errorHandler.transform(_super.prototype.options.call(this, url, options), errorStrategy);
    };
    ;
    AdvHttp = __decorate([
        core_1.Injectable(),
        __param(0, core_1.Inject(exports.ADV_HTTP_CONFIG)), 
        __metadata('design:paramtypes', [Object, ErrorHandlerService, (typeof (_a = typeof http_1.ConnectionBackend !== 'undefined' && http_1.ConnectionBackend) === 'function' && _a) || Object, (typeof (_b = typeof http_1.RequestOptions !== 'undefined' && http_1.RequestOptions) === 'function' && _b) || Object])
    ], AdvHttp);
    return AdvHttp;
    var _a, _b;
}(http_1.Http));
exports.AdvHttp = AdvHttp;


/***/ },

/***/ 647:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Observable_1 = __webpack_require__(1);
var core_1 = __webpack_require__(0);
var button_component_1 = __webpack_require__(370);
(function (SelectionMode) {
    SelectionMode[SelectionMode["Single"] = 0] = "Single";
    SelectionMode[SelectionMode["Multiple"] = 1] = "Multiple";
})(exports.SelectionMode || (exports.SelectionMode = {}));
var SelectionMode = exports.SelectionMode;
var ButtonGroupComponent = (function () {
    function ButtonGroupComponent() {
        this.subscriptions = [];
        // If `Single`, a single button from the group can be selected
        // If `Multiple` multipe buttons can be selected
        this.selectionMode = SelectionMode.Single;
        this._selectedIndexChange = new core_1.EventEmitter();
        /* Event emitted when the group's value changes. */
        this._change = new core_1.EventEmitter();
    }
    Object.defineProperty(ButtonGroupComponent.prototype, "mode", {
        // String alias for selectionMode
        set: function (value) {
            if (value === 'multiple') {
                this.selectionMode = SelectionMode.Multiple;
            }
            else {
                this.selectionMode = SelectionMode.Single;
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(ButtonGroupComponent.prototype, "selectedIndexChange", {
        get: function () {
            return this._selectedIndexChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    Object.defineProperty(ButtonGroupComponent.prototype, "change", {
        get: function () {
            return this._change.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ButtonGroupComponent.prototype.ngOnChanges = function (changes) {
        if (changes['selectedIndex'] && changes['selectedIndex'].currentValue !== undefined) {
            this.initButtons();
        }
    };
    ButtonGroupComponent.prototype.ngOnDestroy = function () {
        this.dispose();
    };
    ButtonGroupComponent.prototype.ngAfterContentInit = function () {
        var _this = this;
        this.initButtons();
        // Reinitialize if buttons change
        this.buttons.changes.subscribe(function () {
            _this.initButtons();
        });
    };
    // - Dipose old Subscription
    // - Validate and init selectedIndex
    // - Subscribe to buttons press event
    ButtonGroupComponent.prototype.initButtons = function () {
        var _this = this;
        if (!this.buttons) {
            return;
        }
        // Unsubscribe from the old buttons
        this.dispose();
        // Validate the provided selectedIndex value
        var selectedIndex;
        if (this.selectionMode === SelectionMode.Single && typeof this.selectedIndex === 'number') {
            selectedIndex = [this.selectedIndex];
        }
        else if (this.selectionMode === SelectionMode.Multiple &&
            Array.isArray(this.selectedIndex) &&
            this.selectedIndex.every(function (n) { return typeof n === 'number'; })) {
            selectedIndex = this.selectedIndex;
        }
        // If valid selectedIndex is provided, change the button selected states
        if (selectedIndex) {
            this.buttons.forEach(function (btn, idx) {
                btn.selected = selectedIndex.indexOf(idx) >= 0;
            });
        }
        // Subscribe to buttons press event
        this.subscriptions = this.buttons.map(function (btn, idx) { return btn.press.subscribe(function () {
            if (_this.selectionMode === SelectionMode.Single) {
                _this.unselectAll();
                btn.selected = true;
                _this._change.emit({ source: btn, index: idx });
                _this._selectedIndexChange.emit(idx);
            }
            else {
                btn.selected = !btn.selected;
                var indexes = _this.buttons.map(function (btn, idx) { return ({ s: btn.selected, idx: idx }); }).filter(function (o) { return o.s; }).map(function (o) { return o.idx; });
                _this._change.emit({ source: btn, index: indexes });
                _this._selectedIndexChange.emit(indexes);
            }
        }); });
    };
    ButtonGroupComponent.prototype.unselectAll = function () {
        this.buttons.forEach(function (btn) { return btn.selected = false; });
    };
    ButtonGroupComponent.prototype.dispose = function () {
        this.subscriptions.forEach(function (s) { return s.unsubscribe(); });
        this.subscriptions = [];
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ButtonGroupComponent.prototype, "selectionMode", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String), 
        __metadata('design:paramtypes', [String])
    ], ButtonGroupComponent.prototype, "mode", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], ButtonGroupComponent.prototype, "selectedIndex", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], ButtonGroupComponent.prototype, "selectedIndexChange", null);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], ButtonGroupComponent.prototype, "change", null);
    __decorate([
        core_1.ContentChildren(button_component_1.ButtonComponent), 
        __metadata('design:type', (typeof (_b = typeof core_1.QueryList !== 'undefined' && core_1.QueryList) === 'function' && _b) || Object)
    ], ButtonGroupComponent.prototype, "buttons", void 0);
    ButtonGroupComponent = __decorate([
        core_1.Component({
            selector: 'vcl-button-group',
            host: {
                '[class.vclButtonGroup]': 'true',
            },
            template: "<ng-content></ng-content>",
            changeDetection: core_1.ChangeDetectionStrategy.OnPush,
        }), 
        __metadata('design:paramtypes', [])
    ], ButtonGroupComponent);
    return ButtonGroupComponent;
    var _a, _b;
}());
exports.ButtonGroupComponent = ButtonGroupComponent;


/***/ },

/***/ 648:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
var CheckboxComponent = (function () {
    function CheckboxComponent(elementRef) {
        this.elementRef = elementRef;
        this.checkedIcon = 'fa:check-square-o';
        this.uncheckedIcon = 'fa:square-o';
        this.disabled = false;
        this.tabindex = 0;
        /**
        Refelects the checked state, `true` is checked and `false` is unchecked
        @public
        */
        this.checked = false;
        /**
        Action fired when the `checked` state changes due to user interaction.
        */
        this._checkedChange = new core_1.EventEmitter();
    }
    Object.defineProperty(CheckboxComponent.prototype, "checkedChange", {
        get: function () {
            return this._checkedChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    CheckboxComponent.prototype.ngOnInit = function () { };
    CheckboxComponent.prototype.ngOnChanges = function (changes) {
        if (changes['checked']) {
            var checked = changes['checked'].currentValue;
            // this._checkedChange.emit(checked);
            this.focusMaintenance(checked);
        }
    };
    Object.defineProperty(CheckboxComponent.prototype, "clsVclDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxComponent.prototype, "attrAriaDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CheckboxComponent.prototype, "attrChecked", {
        get: function () {
            return !!this.checked;
        },
        enumerable: true,
        configurable: true
    });
    CheckboxComponent.prototype.onKeyup = function (e) {
        if (e.keyCode === 32) {
            return this.triggerChangeAction(e);
        }
    };
    CheckboxComponent.prototype.onClick = function (e) {
        return this.triggerChangeAction(e);
    };
    CheckboxComponent.prototype.triggerChangeAction = function (e) {
        e.preventDefault();
        if (this.disabled)
            return;
        this.checked = !this.checked;
        this._checkedChange.emit(this.checked);
    };
    CheckboxComponent.prototype.focusMaintenance = function (checked) {
        if (this.checked === true && this.elementRef.nativeElement) {
            this.elementRef.nativeElement.focus();
        }
    };
    Object.defineProperty(CheckboxComponent.prototype, "icon", {
        get: function () {
            return this.checked ? this.checkedIcon : this.uncheckedIcon;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "checkedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "uncheckedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.HostBinding('attr.tabindex'),
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "tabindex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "checked", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], CheckboxComponent.prototype, "checkedChange", null);
    __decorate([
        core_1.HostBinding('class.vclDisabled'), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "clsVclDisabled", null);
    __decorate([
        core_1.HostBinding('attr.aria-disabled'), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "attrAriaDisabled", null);
    __decorate([
        core_1.HostBinding('attr.checked'), 
        __metadata('design:type', Object)
    ], CheckboxComponent.prototype, "attrChecked", null);
    __decorate([
        core_1.HostListener('keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CheckboxComponent.prototype, "onKeyup", null);
    __decorate([
        core_1.HostListener('click', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], CheckboxComponent.prototype, "onClick", null);
    CheckboxComponent = __decorate([
        core_1.Component({
            selector: 'vcl-checkbox',
            template: "<vcl-icon [icon]=\"icon\"></vcl-icon><ng-content></ng-content>",
            host: {
                '[attr.role]': '"checkbox"',
                '[class.vclCheckbox]': 'true',
                '[class.vclScale130p]': 'true',
            },
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], CheckboxComponent);
    return CheckboxComponent;
    var _a, _b;
}());
exports.CheckboxComponent = CheckboxComponent;


/***/ },

/***/ 649:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
/**
*/
var DropdownComponent = (function () {
    function DropdownComponent() {
        this.select = new core_1.EventEmitter();
        this.tabindex = 0;
        this.expanded = false;
        this.expandedChange = new core_1.EventEmitter();
        this.maxSelectableItems = 1;
        this.minSelectableItems = 1;
        this.ariaRole = 'listbox';
        this.metaInformation = [];
    }
    DropdownComponent.prototype.selectItem = function (item, meta, metalist) {
        if (this.maxSelectableItems === 1) {
            this.expanded = false;
            this.expandedChange.emit(this.expanded);
            metalist.selectItem(item);
        }
        else {
            if (meta.selected) {
                metalist.deSelectItem(item);
            }
            else {
                metalist.selectItem(item);
            }
        }
    };
    DropdownComponent.prototype.onSelect = function (selectedItems) {
        this.select.emit(selectedItems);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], DropdownComponent.prototype, "select", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], DropdownComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DropdownComponent.prototype, "tabindex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], DropdownComponent.prototype, "expanded", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], DropdownComponent.prototype, "expandedChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DropdownComponent.prototype, "maxSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], DropdownComponent.prototype, "minSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], DropdownComponent.prototype, "ariaRole", void 0);
    DropdownComponent = __decorate([
        core_1.Component({
            selector: 'vcl-dropdown',
            template: __webpack_require__(836),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], DropdownComponent);
    return DropdownComponent;
    var _a;
}());
exports.DropdownComponent = DropdownComponent;


/***/ },

/***/ 650:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var FormControlLabelComponent = (function () {
    function FormControlLabelComponent() {
        this.disabled = false;
        this.requiredIndicatorCharacter = '•';
        // Whether the label prepends the child content
        this.prepend = false;
        // Whether the label wraps the labelled control
        this.wrapping = false;
        // Whether an indicator that an input in to the labelled control is required
        this.required = false;
    }
    __decorate([
        core_1.Input(),
        core_1.HostBinding('class.vclDisabled'), 
        __metadata('design:type', Boolean)
    ], FormControlLabelComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], FormControlLabelComponent.prototype, "requiredIndicatorCharacter", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], FormControlLabelComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], FormControlLabelComponent.prototype, "subLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], FormControlLabelComponent.prototype, "prepend", void 0);
    __decorate([
        core_1.Input(),
        core_1.HostBinding('class.vclFormControlLabelWrapping'), 
        __metadata('design:type', Boolean)
    ], FormControlLabelComponent.prototype, "wrapping", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], FormControlLabelComponent.prototype, "required", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], FormControlLabelComponent.prototype, "requiredIndLabel", void 0);
    FormControlLabelComponent = __decorate([
        core_1.Component({
            selector: '[vcl-form-control-label]',
            template: __webpack_require__(838),
            host: {
                '[class.vclFormControlLabel]': 'true',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], FormControlLabelComponent);
    return FormControlLabelComponent;
}());
exports.FormControlLabelComponent = FormControlLabelComponent;


/***/ },

/***/ 651:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var icon_module_1 = __webpack_require__(92);
var form_control_label_component_1 = __webpack_require__(650);
var l10n_module_1 = __webpack_require__(28);
var VCLFormControlLabelModule = (function () {
    function VCLFormControlLabelModule() {
    }
    VCLFormControlLabelModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, icon_module_1.VCLIconModule, l10n_module_1.L10nModule],
            exports: [form_control_label_component_1.FormControlLabelComponent],
            declarations: [form_control_label_component_1.FormControlLabelComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLFormControlLabelModule);
    return VCLFormControlLabelModule;
}());
exports.VCLFormControlLabelModule = VCLFormControlLabelModule;


/***/ },

/***/ 652:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var IcogramComponent = (function () {
    function IcogramComponent(elRef) {
        this.elRef = elRef;
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IcogramComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], IcogramComponent.prototype, "flexLabel", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IcogramComponent.prototype, "prepIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IcogramComponent.prototype, "appIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IcogramComponent.prototype, "prepIconSrc", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IcogramComponent.prototype, "appIconSrc", void 0);
    IcogramComponent = __decorate([
        core_1.Component({
            selector: 'vcl-icogram, [vcl-icogram]',
            host: {
                '[class.vclIcogram]': 'true',
                '[attr.role]': 'img'
            },
            template: __webpack_require__(840),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], IcogramComponent);
    return IcogramComponent;
    var _a;
}());
exports.IcogramComponent = IcogramComponent;


/***/ },

/***/ 653:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var icon_service_1 = __webpack_require__(373);
var IconComponent = (function () {
    function IconComponent(_iconService) {
        this._iconService = _iconService;
    }
    Object.defineProperty(IconComponent.prototype, "fontIconClass", {
        get: function () {
            if (this.icon) {
                return this._iconService.lookup(this.icon);
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IconComponent.prototype, "mergedIconClass", {
        get: function () {
            return (this.fontIconClass || '') + " " + (this.iconClass || '');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(IconComponent.prototype, "isAriaHidden", {
        // Do not hide from aria when a label is provided
        get: function () {
            return !this.label;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "src", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "svguse", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "iconClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "icon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], IconComponent.prototype, "ariaRole", void 0);
    IconComponent = __decorate([
        core_1.Component({
            selector: 'vcl-icon',
            template: __webpack_require__(842),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof icon_service_1.IconService !== 'undefined' && icon_service_1.IconService) === 'function' && _a) || Object])
    ], IconComponent);
    return IconComponent;
    var _a;
}());
exports.IconComponent = IconComponent;


/***/ },

/***/ 654:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Observable_1 = __webpack_require__(1);
var InputComponent = (function () {
    function InputComponent(elRef) {
        this.elRef = elRef;
        this.valueType = null;
        this.typedValue = null;
        this._typedValueChange = new core_1.EventEmitter();
        this.selectAllOnFocus = false;
    }
    Object.defineProperty(InputComponent.prototype, "typedValueChange", {
        get: function () {
            return this._typedValueChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    InputComponent.prototype.ngOnInit = function () { };
    InputComponent.prototype.onChange = function (value) {
        this._typedValueChange.emit(this.toType(value));
    };
    InputComponent.prototype.toType = function (value) {
        if (this.valueType === 'number') {
            var tValue = Number(value);
            return isNaN(tValue) ? 0 : tValue;
        }
        else {
            return value;
        }
    };
    InputComponent.prototype.onFocus = function (value) {
        if (this.selectAllOnFocus) {
            if (this.elRef && this.elRef.nativeElement) {
                this.elRef.nativeElement.select();
            }
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], InputComponent.prototype, "valueType", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], InputComponent.prototype, "typedValue", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], InputComponent.prototype, "typedValueChange", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], InputComponent.prototype, "selectAllOnFocus", void 0);
    __decorate([
        core_1.HostListener('input', ['$event.target.value']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], InputComponent.prototype, "onChange", null);
    __decorate([
        core_1.HostListener('focus', ['$event.target.value']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], InputComponent.prototype, "onFocus", null);
    InputComponent = __decorate([
        core_1.Directive({
            selector: '[vcl-input]',
            host: {
                '[class.vclInput]': 'true',
            },
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], InputComponent);
    return InputComponent;
    var _a, _b;
}());
exports.InputComponent = InputComponent;


/***/ },

/***/ 655:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var input_component_1 = __webpack_require__(654);
var VCLInputModule = (function () {
    function VCLInputModule() {
    }
    VCLInputModule = __decorate([
        core_1.NgModule({
            imports: [],
            exports: [input_component_1.InputComponent],
            declarations: [input_component_1.InputComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLInputModule);
    return VCLInputModule;
}());
exports.VCLInputModule = VCLInputModule;


/***/ },

/***/ 656:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Subject_1 = __webpack_require__(11);
var Observable_1 = __webpack_require__(1);
var core_1 = __webpack_require__(0);
var wormhole_module_1 = __webpack_require__(73);
var layer_service_1 = __webpack_require__(374);
var LayerBaseComponent = (function () {
    function LayerBaseComponent(layerService) {
        this.layerService = layerService;
        this.visibleLayers = [];
    }
    LayerBaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.sub = this.layerService.visibleLayersChanged.subscribe(function (visibleLayers) {
            _this.visibleLayers = visibleLayers;
        });
    };
    LayerBaseComponent.prototype.ngOnDestroy = function () {
        this.sub.unsubscribe();
    };
    LayerBaseComponent = __decorate([
        core_1.Component({
            selector: 'vcl-layer-base',
            template: __webpack_require__(845),
            animations: [
                core_1.trigger('boxState', []),
                core_1.trigger('layerState', [])
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof layer_service_1.LayerService !== 'undefined' && layer_service_1.LayerService) === 'function' && _a) || Object])
    ], LayerBaseComponent);
    return LayerBaseComponent;
    var _a;
}());
exports.LayerBaseComponent = LayerBaseComponent;
var LayerDirective = (function (_super) {
    __extends(LayerDirective, _super);
    function LayerDirective(templateRef, elementRef, layerService) {
        _super.call(this, templateRef);
        this.templateRef = templateRef;
        this.elementRef = elementRef;
        this.layerService = layerService;
        this.visibilityChange$ = new core_1.EventEmitter();
        this.modal = true;
        this.data = {};
        this.visible = false;
        this.coverzIndex = 10;
        this.zIndex = 11;
    }
    Object.defineProperty(LayerDirective.prototype, "visibilityChange", {
        get: function () {
            return this.visibilityChange$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(LayerDirective.prototype, "state", {
        get: function () {
            return this.visible ? 'open' : 'closed';
        },
        enumerable: true,
        configurable: true
    });
    LayerDirective.prototype.ngOnInit = function () {
        this.layerService.register(this);
    };
    LayerDirective.prototype.ngOnDestroy = function () {
        this.layerService.unregister(this);
    };
    LayerDirective.prototype.offClick = function () {
        if (!this.modal) {
            this.close();
        }
    };
    LayerDirective.prototype.setZIndex = function (zIndex) {
        if (zIndex === void 0) { zIndex = 10; }
        this.coverzIndex = zIndex;
        this.zIndex = zIndex + 1;
    };
    LayerDirective.prototype.toggle = function () {
        this.visible = !this.visible;
        this.visibilityChange$.emit(this.visible);
    };
    LayerDirective.prototype.open = function (data) {
        if (!this._instanceResults) {
            this._instanceResults = new Subject_1.Subject();
        }
        if (typeof data === 'object' && data) {
            this.data = data;
        }
        this.setZIndex(this.layerService.currentZIndex + 10);
        this.visible = true;
        this.visibilityChange$.emit(this.visible);
        return this._instanceResults.asObservable();
    };
    LayerDirective.prototype.send = function (result) {
        if (result !== undefined && this._instanceResults) {
            this._instanceResults.next(result);
        }
    };
    LayerDirective.prototype.close = function (result) {
        if (result !== undefined && this._instanceResults) {
            this._instanceResults.next(result);
            this._instanceResults.complete();
        }
        this.data = {};
        this._instanceResults = null;
        this.setZIndex();
        this.visible = false;
        this.visibilityChange$.emit(this.visible);
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], LayerDirective.prototype, "visibilityChange", null);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], LayerDirective.prototype, "modal", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LayerDirective.prototype, "name", void 0);
    LayerDirective = __decorate([
        core_1.Directive({
            selector: '[vcl-layer]',
            exportAs: 'layer',
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object, (typeof (_d = typeof layer_service_1.LayerService !== 'undefined' && layer_service_1.LayerService) === 'function' && _d) || Object])
    ], LayerDirective);
    return LayerDirective;
    var _a, _b, _c, _d;
}(wormhole_module_1.WormholeGenerator));
exports.LayerDirective = LayerDirective;


/***/ },

/***/ 657:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var LinkComponent = (function () {
    function LinkComponent() {
    }
    Object.defineProperty(LinkComponent.prototype, "attrHref", {
        get: function () {
            if (this.disabled)
                return null;
            return this.scheme
                ? this.scheme + ":" + this.href
                : this.href;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "href", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "label", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "title", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "scheme", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "prepIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "appIcon", void 0);
    __decorate([
        core_1.HostBinding('class.vclDisabled'),
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], LinkComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.HostBinding('attr.href'), 
        __metadata('design:type', String)
    ], LinkComponent.prototype, "attrHref", null);
    LinkComponent = __decorate([
        core_1.Component({
            selector: '[vcl-link]',
            template: __webpack_require__(847),
            host: {
                '[attr.touch-action]': 'touchAction',
                '[attr.aria-label]': 'title | loc',
                '[attr.title]': 'title | loc'
            },
        }), 
        __metadata('design:paramtypes', [])
    ], LinkComponent);
    return LinkComponent;
}());
exports.LinkComponent = LinkComponent;


/***/ },

/***/ 658:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
/**
*/
var MetalistComponent = (function () {
    function MetalistComponent() {
        this.select = new core_1.EventEmitter();
        this.minSelectableItems = 1;
        this.maxSelectableItems = 1;
        this.maxItemsSelected = false;
    }
    MetalistComponent.prototype.next = function () {
        var oldIndex = this.getMarkedItemIndex();
        if (oldIndex !== -1) {
            var newIndex = oldIndex + 1;
            if (this.items.length > newIndex) {
                this.setMarkedIndex(newIndex);
            }
        }
        else {
            this.setMarkedIndex(0);
        }
    };
    MetalistComponent.prototype.prev = function () {
        var oldIndex = this.getMarkedItemIndex();
        if (oldIndex !== -1) {
            var newIndex = oldIndex - 1;
            if (newIndex >= 0) {
                this.setMarkedIndex(newIndex);
            }
        }
    };
    MetalistComponent.prototype.ngOnInit = function () {
        if (!this.meta) {
            // create meta if not present
            this.meta = [];
        }
    };
    MetalistComponent.prototype.selectItem = function (item) {
        var itemIndex = this.items.indexOf(item);
        if (itemIndex === -1) {
            return;
        }
        // maxSelectableItems === 1 -> deselect old item
        if (this.maxSelectableItems === 1) {
            var metaItems = this.meta.filter(function (obj) {
                return obj && obj.selected === true;
            });
            for (var i = 0; i < metaItems.length; i++) {
                metaItems[i].selected = false;
            }
        }
        if (this.getSelectedItems().length < this.maxSelectableItems && this.meta[itemIndex]) {
            this.meta[itemIndex].selected = true;
        }
        this.select.emit(this.getSelectedItems());
    };
    MetalistComponent.prototype.deSelectItem = function (item) {
        var itemIndex = this.items.indexOf(item);
        if (itemIndex === -1) {
            return;
        }
        if (this.meta[itemIndex]) {
            this.meta[itemIndex].selected = false;
        }
        this.select.emit(this.getSelectedItems());
    };
    MetalistComponent.prototype.getSelectedItems = function () {
        var metaItems = this.meta.filter(function (obj) {
            return obj && obj.selected === true;
        });
        var result = [];
        for (var i = 0; i < metaItems.length; i++) {
            result.push(this.items[this.meta.indexOf(metaItems[i])]);
        }
        return result;
    };
    MetalistComponent.prototype.setSelectedItems = function () {
    };
    MetalistComponent.prototype.getMarkedItemIndex = function () {
        var meta = this.getMarkedItemMeta();
        if (meta) {
            return this.meta.indexOf(meta);
        }
        return -1;
    };
    MetalistComponent.prototype.getMarkedItemMeta = function () {
        return this.meta.filter(function (obj) {
            return obj && obj.marked === true;
        })[0];
    };
    MetalistComponent.prototype.setMarkedIndex = function (index) {
        // unset old item
        var oldItem = this.getMarkedItemMeta();
        if (oldItem) {
            oldItem.marked = false;
        }
        var meta = this.meta[index];
        if (meta) {
            meta.marked = true;
        }
    };
    MetalistComponent.prototype.setMarkedItem = function (item) {
        var markedIndex = this.items.indexOf(item);
        if (markedIndex !== -1) {
            this.setMarkedIndex(markedIndex);
        }
    };
    MetalistComponent.prototype.getMeta = function (item) {
        var key = this.items.indexOf(item);
        if (!this.meta[key]) {
            this.meta[key] = {};
        }
        return this.meta[key];
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MetalistComponent.prototype, "select", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], MetalistComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], MetalistComponent.prototype, "meta", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MetalistComponent.prototype, "minSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MetalistComponent.prototype, "maxSelectableItems", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Boolean)
    ], MetalistComponent.prototype, "maxItemsSelected", void 0);
    __decorate([
        core_1.ContentChild(core_1.TemplateRef), 
        __metadata('design:type', Object)
    ], MetalistComponent.prototype, "template", void 0);
    MetalistComponent = __decorate([
        core_1.Component({
            selector: 'vcl-metalist',
            template: __webpack_require__(848)
        }), 
        __metadata('design:paramtypes', [])
    ], MetalistComponent);
    return MetalistComponent;
}());
exports.MetalistComponent = MetalistComponent;


/***/ },

/***/ 659:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var MonthPickerComponent = (function () {
    function MonthPickerComponent() {
        this.yearMeta = {};
        this.prevYearBtnIcon = "fa:chevron-left";
        this.nextYearBtnIcon = "fa:chevron-right";
        this.closeBtnIcon = "fa:times";
        this.monthsPerRow = 3;
        this.expandable = false;
        this.expanded = true;
        this.expandedChange = new core_1.EventEmitter();
        this.maxYear = Number.MAX_SAFE_INTEGER;
        this.currentYear = new Date().getUTCFullYear();
        this.currentYearChange = new core_1.EventEmitter();
        this.useShortNames = false;
        this.useAvailableMonths = false;
        this.colors = null;
        this.minSelectableItems = 1;
        this.prevYearAvailable = false;
        this.nextYearAvailable = false;
        this.prevYearBtnTap = new core_1.EventEmitter();
        this.nextYearBtnTap = new core_1.EventEmitter();
        this.select = new core_1.EventEmitter();
        this.deselect = new core_1.EventEmitter();
        this.tabindex = 0;
    }
    MonthPickerComponent.prototype.ngOnInit = function () {
        this.months = (this.useShortNames ? MonthPickerComponent.monthNamesShort :
            MonthPickerComponent.monthNames).map(function (month) { return ({
            label: month
        }); });
        if (!this.maxSelectableItems) {
            this.maxSelectableItems = this.colors && this.colors.length || 1;
        }
        if (this.colors) {
            this.availableColors = this.colors.slice();
        }
        this.setYearMeta(this.currentYear);
    };
    MonthPickerComponent.prototype.setYearMeta = function (year) {
        if (!this.yearMeta[year]) {
            this.yearMeta[year] = this.createYearMeta(year);
        }
        this.currentMeta = this.yearMeta[year];
    };
    MonthPickerComponent.prototype.createYearMeta = function (year) {
        return this.months.map(function (monthMeta) { return new Object(); });
    };
    MonthPickerComponent.prototype.selectMonth = function (month, year) {
        if (year === void 0) { year = this.currentYear; }
        if (!this.isMonthAvailable(month, year)) {
            return;
        }
        var monthMeta = this.getYearMeta(year)[month];
        if (monthMeta.selected) {
            return this.deselectMonth(month, year);
        }
        if (this.maxSelectableItems === 1) {
            this.iterateMonthMetas(function (month, year, mMeta) {
                mMeta.selected = mMeta === monthMeta;
            });
        }
        else if (this.getSelectedDates().length < this.maxSelectableItems) {
            monthMeta.selected = true;
        }
        if (monthMeta.selected) {
            this.setMonthBackgroundColor(month, year);
            this.notifySelect(year + "." + month);
            if (this.maxSelectableItems === 1 && this.expandable) {
                this.expanded = false;
                this.expandedChange.emit(this.expanded);
            }
        }
    };
    MonthPickerComponent.prototype.isMonthAvailable = function (month, year) {
        return this.isDateInBounds(month, year) && (!this.useAvailableMonths ||
            this.yearMeta[year] && this.yearMeta[year][month].available);
    };
    MonthPickerComponent.prototype.isDateInBounds = function (month, year) {
        return this.isMonthInBounds(month) && this.isYearInBounds(year);
    };
    MonthPickerComponent.prototype.isMonthInBounds = function (month) {
        return month > -1 && month < this.months.length;
    };
    MonthPickerComponent.prototype.isYearInBounds = function (year) {
        return year > -1 && year < this.maxYear;
    };
    MonthPickerComponent.prototype.getYearMeta = function (year) {
        if (!this.yearMeta[year]) {
            this.yearMeta[year] = this.createYearMeta(year);
        }
        return this.yearMeta[year];
    };
    MonthPickerComponent.prototype.iterateMonthMetas = function (cb) {
        var _this = this;
        Object.keys(this.yearMeta).forEach(function (year) {
            _this.yearMeta[year].forEach(function (monthMeta, month) {
                cb(month, +year, monthMeta);
            });
        });
    };
    MonthPickerComponent.prototype.getSelectedDates = function () {
        var _this = this;
        var selectedDates = [];
        Object.keys(this.yearMeta).forEach(function (year) {
            _this.yearMeta[year].forEach(function (monthMeta, month) {
                if (monthMeta.selected) {
                    selectedDates.push(year + "." + month);
                }
            });
        });
        return selectedDates;
    };
    MonthPickerComponent.prototype.setMonthBackgroundColor = function (month, year) {
        var color = this.getMonthBackgroundColor();
        if (color) {
            var monthMeta = this.getYearMeta(year)[month];
            monthMeta.color = color;
        }
    };
    MonthPickerComponent.prototype.getMonthBackgroundColor = function () {
        if (this.availableColors && this.availableColors.length) {
            return this.availableColors.shift();
        }
    };
    MonthPickerComponent.prototype.deselectMonth = function (month, year) {
        if (year === void 0) { year = this.currentYear; }
        if (this.isMonthSelected(month, year)) {
            var monthMeta = this.getYearMeta(year)[month];
            monthMeta.selected = false;
            this.clearMonthBackgroundColor(month, year);
            this.notifyDeselect(year + "." + month);
        }
    };
    MonthPickerComponent.prototype.isMonthSelected = function (month, year) {
        return this.isDateInBounds(month, year) &&
            this.yearMeta[year] && this.yearMeta[year][month].selected;
    };
    MonthPickerComponent.prototype.clearMonthBackgroundColor = function (month, year) {
        if (this.availableColors) {
            var monthMeta = this.getYearMeta(year)[month];
            if (monthMeta.color) {
                this.availableColors.push(monthMeta.color);
                monthMeta.color = undefined;
            }
        }
    };
    MonthPickerComponent.prototype.deselectAllMonths = function () {
        var _this = this;
        this.iterateMonthMetas(function (month, year, monthMeta) {
            monthMeta.selected = false;
            _this.clearMonthBackgroundColor(month, year);
            _this.notifyDeselect(year + "." + month);
        });
    };
    MonthPickerComponent.prototype.addAvailableMonth = function (month, year) {
        if (this.isDateInBounds(month, year)) {
            this.getYearMeta(year)[month].available = true;
        }
    };
    MonthPickerComponent.prototype.removeAvailableMonth = function (month, year) {
        if (this.isDateInBounds(month, year) && this.yearMeta[year]) {
            this.yearMeta[year][month].available = false;
        }
    };
    MonthPickerComponent.prototype.removeAllAvailableMonths = function () {
        this.iterateMonthMetas(function (month, year, monthMeta) {
            monthMeta.available = false;
        });
    };
    MonthPickerComponent.prototype.onPrevYearTap = function () {
        if (this.prevYearAvailable) {
            this.currentYear--;
            this.setYearMeta(this.currentYear);
            this.currentYearChange.emit(this.currentYear);
            this.prevYearBtnTap.emit();
        }
    };
    MonthPickerComponent.prototype.onNextYearTap = function () {
        if (this.nextYearAvailable) {
            this.currentYear++;
            this.setYearMeta(this.currentYear);
            this.currentYearChange.emit(this.currentYear);
            this.nextYearBtnTap.emit();
        }
    };
    MonthPickerComponent.prototype.onCloseBtnTap = function () {
        if (this.expandable) {
            if (this.expanded) {
                this.expanded = false;
                this.expandedChange.emit(this.expanded);
            }
        }
    };
    MonthPickerComponent.prototype.notifySelect = function (date) {
        this.select.emit(date);
    };
    MonthPickerComponent.prototype.notifyDeselect = function (date) {
        this.deselect.emit(date);
    };
    MonthPickerComponent.prototype.isCurrentMonth = function (month, year) {
        if (year === void 0) { year = this.currentYear; }
        var now = new Date();
        return now.getFullYear() == year && now.getUTCMonth() === month;
    };
    MonthPickerComponent.prototype.getMonth = function (month) {
        return this.isMonthInBounds(month) ? this.months[month] : null;
    };
    MonthPickerComponent.monthNames = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ];
    MonthPickerComponent.monthNamesShort = MonthPickerComponent.monthNames
        .map(function (name) { return name.substr(0, 3); });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MonthPickerComponent.prototype, "prevYearBtnIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MonthPickerComponent.prototype, "nextYearBtnIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], MonthPickerComponent.prototype, "closeBtnIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "monthsPerRow", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "expandable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "expanded", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], MonthPickerComponent.prototype, "expandedChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "maxYear", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "currentYear", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _b) || Object)
    ], MonthPickerComponent.prototype, "currentYearChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "useShortNames", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "useAvailableMonths", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], MonthPickerComponent.prototype, "colors", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "maxSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "minSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "prevYearAvailable", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], MonthPickerComponent.prototype, "nextYearAvailable", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MonthPickerComponent.prototype, "prevYearBtnTap", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MonthPickerComponent.prototype, "nextYearBtnTap", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MonthPickerComponent.prototype, "select", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], MonthPickerComponent.prototype, "deselect", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], MonthPickerComponent.prototype, "tabindex", void 0);
    MonthPickerComponent = __decorate([
        core_1.Component({
            selector: 'vcl-month-picker',
            template: __webpack_require__(849),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], MonthPickerComponent);
    return MonthPickerComponent;
    var _a, _b;
}());
exports.MonthPickerComponent = MonthPickerComponent;


/***/ },

/***/ 660:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var router_1 = __webpack_require__(101);
var NavigationComponent = (function () {
    function NavigationComponent(router) {
        this.router = router;
        this.ariaRole = 'presentation';
        this.tabindex = 0;
        this.touchAction = 'pan-y';
        this.type = 'horizontal';
        this.subLevelHintIconClosed = 'fa:chevron-right';
        this.subLevelHintIconOpened = 'fa:chevron-down';
        this.subLevelHintIconSide = 'right';
        this.navigationItems = [];
        this.select = new core_1.EventEmitter();
    }
    NavigationComponent.prototype.ngOnInit = function () {
        var selectedItem = this._navigationItems.filter(function (item) { return item.selected; })[0];
        if (selectedItem) {
            this.selectItem(selectedItem);
        }
    };
    Object.defineProperty(NavigationComponent.prototype, "_navigationItems", {
        get: function () {
            return this.navigationItems.filter(function (item) { return item.active; });
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(NavigationComponent.prototype, "isVertical", {
        get: function () {
            return this.type === 'vertical';
        },
        enumerable: true,
        configurable: true
    });
    NavigationComponent.prototype.getPrepIcon = function (item) {
        return item.items && this.subLevelHintIconSide === 'left'
            ? item.opened
                ? this.subLevelHintIconOpened
                : this.subLevelHintIconClosed
            : item.prepIcon;
    };
    NavigationComponent.prototype.getAppIcon = function (item) {
        return item.items && this.subLevelHintIconSide === 'right'
            ? item.opened
                ? this.subLevelHintIconOpened
                : this.subLevelHintIconClosed
            : item.appIcon;
    };
    NavigationComponent.prototype.selectItem = function (item) {
        if (item == this.selectedItem || item.items) {
            return;
        }
        if (this.selectedItem) {
            this.selectedItem.selected = false;
        }
        item.selected = true;
        this.selectedItem = item;
        if (item.href) {
            window.location.href = item.href;
        }
        else if (item.route) {
            this.router.navigate(item.route);
        }
        this.select.emit(item);
    };
    NavigationComponent.prototype.onSelect = function (item) {
        if (this.selectedItem) {
            this.selectedItem.selected = false;
        }
        this.selectedItem = item;
        this.select.emit(item);
    };
    NavigationComponent.prototype.toggleMenu = function (item) {
        item.opened = !item.opened;
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], NavigationComponent.prototype, "selectedItem", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavigationComponent.prototype, "ariaRole", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], NavigationComponent.prototype, "tabindex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavigationComponent.prototype, "touchAction", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavigationComponent.prototype, "type", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavigationComponent.prototype, "subLevelHintIconClosed", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], NavigationComponent.prototype, "subLevelHintIconOpened", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], NavigationComponent.prototype, "subLevelHintIconSide", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], NavigationComponent.prototype, "navigationItems", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], NavigationComponent.prototype, "select", void 0);
    NavigationComponent = __decorate([
        core_1.Component({
            selector: 'vcl-navigation',
            template: __webpack_require__(850),
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof router_1.Router !== 'undefined' && router_1.Router) === 'function' && _a) || Object])
    ], NavigationComponent);
    return NavigationComponent;
    var _a;
}());
exports.NavigationComponent = NavigationComponent;


/***/ },

/***/ 661:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var overlayManager_service_1 = __webpack_require__(382);
var PopoverComponent = (function () {
    function PopoverComponent(overlayManger, myElement) {
        this.overlayManger = overlayManger;
        this.myElement = myElement;
        this.opening = false;
        this.class = 'vclPopOver';
        this.zIndex = 10;
        this.coverZIndex = -1;
        this.targetAttachment = 'bottom left';
        this.attachment = 'top left';
        this.open = false;
        this.layer = false;
        this.openChange = new core_1.EventEmitter();
        this.zIndexManaged = true;
        this.expandManaged = true;
        this.state = 'open';
    }
    PopoverComponent.prototype.close = function () {
        this.state = 'void';
        this.open = false;
        this.openChange.emit(this.open);
    };
    PopoverComponent.prototype.onClick = function (event) {
        if (!this.opening && this.expandManaged && event.path.indexOf(this.myElement.nativeElement) === -1) {
            this.close();
        }
        this.opening = false;
    };
    PopoverComponent.prototype.ngOnChanges = function (changes) {
        try {
            if (this.zIndexManaged) {
                if (changes.open.currentValue === true) {
                    this.zIndex = this.overlayManger.register(this);
                    this.coverZIndex = this.zIndex - 1;
                    this.opening = true;
                    this.state = 'open';
                }
                else if (changes.open.currentValue === false) {
                    this.state = 'void';
                    this.zIndex = this.overlayManger.unregister(this);
                    this.coverZIndex = -1;
                }
            }
        }
        catch (ex) { }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "target", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "style", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "class", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], PopoverComponent.prototype, "zIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "targetAttachment", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], PopoverComponent.prototype, "attachment", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PopoverComponent.prototype, "open", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PopoverComponent.prototype, "layer", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof core_1.EventEmitter !== 'undefined' && core_1.EventEmitter) === 'function' && _a) || Object)
    ], PopoverComponent.prototype, "openChange", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PopoverComponent.prototype, "zIndexManaged", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], PopoverComponent.prototype, "expandManaged", void 0);
    PopoverComponent = __decorate([
        core_1.Component({
            selector: 'vcl-popover',
            template: __webpack_require__(851),
            host: {
                '(document:click)': 'onClick($event)',
            },
            animations: [
                core_1.trigger('popOverState', [])
            ]
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof overlayManager_service_1.OverlayManagerService !== 'undefined' && overlayManager_service_1.OverlayManagerService) === 'function' && _b) || Object, (typeof (_c = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _c) || Object])
    ], PopoverComponent);
    return PopoverComponent;
    var _a, _b, _c;
}());
exports.PopoverComponent = PopoverComponent;


/***/ },

/***/ 662:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Observable_1 = __webpack_require__(1);
// TODO: This class is just a copy of the checkbox with slight modifications
// Use inheritance once supported
// https://github.com/angular/angular/issues/11606
var core_1 = __webpack_require__(0);
var RadioButtonComponent = (function () {
    function RadioButtonComponent(elementRef) {
        this.elementRef = elementRef;
        this.checkedIcon = 'fa:dot-circle-o';
        this.uncheckedIcon = 'fa:circle-o';
        this.disabled = false;
        this.tabindex = 0;
        /**
        Refelects the checked state, `true` is checked and `false` is unchecked
        @public
        */
        this.checked = false;
        /**
        Action fired when the `checked` state changes due to user interaction.
        */
        this._checkedChange = new core_1.EventEmitter();
    }
    Object.defineProperty(RadioButtonComponent.prototype, "checkedChange", {
        get: function () {
            return this._checkedChange.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    ;
    RadioButtonComponent.prototype.ngOnInit = function () { };
    RadioButtonComponent.prototype.ngOnChanges = function (changes) {
        if (changes['checked']) {
            var checked = changes['checked'].currentValue;
            // this._checkedChange.emit(checked);
            this.focusMaintenance(checked);
        }
    };
    Object.defineProperty(RadioButtonComponent.prototype, "clsVclDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadioButtonComponent.prototype, "attrAriaDisabled", {
        get: function () {
            return !!this.disabled;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(RadioButtonComponent.prototype, "attrChecked", {
        get: function () {
            return !!this.checked;
        },
        enumerable: true,
        configurable: true
    });
    RadioButtonComponent.prototype.onKeyup = function (e) {
        if (e.keyCode === 32) {
            return this.triggerChangeAction(e);
        }
    };
    RadioButtonComponent.prototype.onClick = function (e) {
        return this.triggerChangeAction(e);
    };
    RadioButtonComponent.prototype.triggerChangeAction = function (e) {
        e.preventDefault();
        if (this.disabled)
            return;
        this.checked = !this.checked;
        this._checkedChange.emit(this.checked);
    };
    RadioButtonComponent.prototype.focusMaintenance = function (checked) {
        if (this.checked === true && this.elementRef.nativeElement) {
            this.elementRef.nativeElement.focus();
        }
    };
    Object.defineProperty(RadioButtonComponent.prototype, "icon", {
        get: function () {
            return this.checked ? this.checkedIcon : this.uncheckedIcon;
        },
        enumerable: true,
        configurable: true
    });
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "checkedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "uncheckedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.HostBinding('attr.tabindex'),
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "tabindex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "checked", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_a = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _a) || Object)
    ], RadioButtonComponent.prototype, "checkedChange", null);
    __decorate([
        core_1.HostBinding('class.vclDisabled'), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "clsVclDisabled", null);
    __decorate([
        core_1.HostBinding('attr.aria-disabled'), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "attrAriaDisabled", null);
    __decorate([
        core_1.HostBinding('attr.checked'), 
        __metadata('design:type', Object)
    ], RadioButtonComponent.prototype, "attrChecked", null);
    __decorate([
        core_1.HostListener('keyup', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], RadioButtonComponent.prototype, "onKeyup", null);
    __decorate([
        core_1.HostListener('click', ['$event']), 
        __metadata('design:type', Function), 
        __metadata('design:paramtypes', [Object]), 
        __metadata('design:returntype', void 0)
    ], RadioButtonComponent.prototype, "onClick", null);
    RadioButtonComponent = __decorate([
        core_1.Component({
            selector: 'vcl-radio-button',
            template: "<vcl-icon [icon]=\"icon\"></vcl-icon><ng-content></ng-content>",
            host: {
                '[attr.role]': '"radio"',
                '[class.vclCheckbox]': 'true',
                '[class.vclScale130p]': 'true',
            },
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [(typeof (_b = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _b) || Object])
    ], RadioButtonComponent);
    return RadioButtonComponent;
    var _a, _b;
}());
exports.RadioButtonComponent = RadioButtonComponent;


/***/ },

/***/ 663:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
/**
*/
var SelectComponent = (function () {
    function SelectComponent() {
        this.ariaRole = 'list';
        this.clickInside = false;
        this.select = new core_1.EventEmitter();
        this.expanded = false;
        this.minSelectableItems = 1;
        this.maxSelectableItems = 1;
        this.expandedIcon = 'fa:chevron-up';
        this.collapsedIcon = 'fa:chevron-down';
        this.inputValue = 'label';
        this.emptyLabel = 'Select value';
        this.displayValue = this.emptyLabel;
    }
    SelectComponent.prototype.expand = function () {
        this.expanded = !this.expanded;
    };
    SelectComponent.prototype.onSelect = function (items) {
        this.clickInside = true;
        this.select.emit(items);
        if (items && items[0] && this.maxSelectableItems === 1) {
            this.displayValue = items[0][this.inputValue];
        }
        else if (!items || items.length === 0) {
            this.displayValue = this.emptyLabel;
        }
        else {
            var result = '';
            for (var i = 0; i < items.length; i++) {
                result += items[i][this.inputValue];
                if (i !== items.length - 1) {
                    result += ', ';
                }
            }
            this.displayValue = result;
        }
    };
    SelectComponent.prototype.onOutsideClick = function (event) {
        this.expanded = false;
    };
    __decorate([
        core_1.Output(), 
        __metadata('design:type', Object)
    ], SelectComponent.prototype, "select", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], SelectComponent.prototype, "expanded", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Array)
    ], SelectComponent.prototype, "items", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SelectComponent.prototype, "minSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], SelectComponent.prototype, "maxSelectableItems", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "expandedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "collapsedIcon", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "inputValue", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], SelectComponent.prototype, "emptyLabel", void 0);
    SelectComponent = __decorate([
        core_1.Component({
            selector: 'vcl-select',
            template: __webpack_require__(853),
            changeDetection: core_1.ChangeDetectionStrategy.OnPush
        }), 
        __metadata('design:paramtypes', [])
    ], SelectComponent);
    return SelectComponent;
}());
exports.SelectComponent = SelectComponent;


/***/ },

/***/ 664:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var dropdown_module_1 = __webpack_require__(372);
var button_module_1 = __webpack_require__(116);
var select_component_1 = __webpack_require__(663);
var l10n_module_1 = __webpack_require__(28);
var off_click_module_1 = __webpack_require__(162);
var VCLSelectModule = (function () {
    function VCLSelectModule() {
    }
    VCLSelectModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule, dropdown_module_1.VCLDropdownModule, button_module_1.VCLButtonModule, off_click_module_1.VCLOffClickModule],
            exports: [select_component_1.SelectComponent],
            declarations: [select_component_1.SelectComponent],
            providers: [],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLSelectModule);
    return VCLSelectModule;
}());
exports.VCLSelectModule = VCLSelectModule;


/***/ },

/***/ 665:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Observable_1 = __webpack_require__(1);
var wormhole_module_1 = __webpack_require__(73);
var core_1 = __webpack_require__(0);
var TabLabelDirective = (function (_super) {
    __extends(TabLabelDirective, _super);
    function TabLabelDirective(templateRef) {
        _super.call(this, templateRef);
        this.templateRef = templateRef;
    }
    TabLabelDirective = __decorate([
        core_1.Directive({
            selector: '[vcl-tab-label]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _a) || Object])
    ], TabLabelDirective);
    return TabLabelDirective;
    var _a;
}(wormhole_module_1.WormholeGenerator));
exports.TabLabelDirective = TabLabelDirective;
var TabContentDirective = (function (_super) {
    __extends(TabContentDirective, _super);
    function TabContentDirective(templateRef) {
        _super.call(this, templateRef);
        this.templateRef = templateRef;
    }
    TabContentDirective = __decorate([
        core_1.Directive({
            selector: '[vcl-tab-content]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _a) || Object])
    ], TabContentDirective);
    return TabContentDirective;
    var _a;
}(wormhole_module_1.WormholeGenerator));
exports.TabContentDirective = TabContentDirective;
var TabComponent = (function () {
    function TabComponent() {
        this.disabled = false;
        this.tabClass = '';
    }
    __decorate([
        core_1.ContentChild(TabLabelDirective), 
        __metadata('design:type', TabLabelDirective)
    ], TabComponent.prototype, "label", void 0);
    __decorate([
        core_1.ContentChild(TabContentDirective), 
        __metadata('design:type', TabContentDirective)
    ], TabComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Object)
    ], TabComponent.prototype, "disabled", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabComponent.prototype, "tabClass", void 0);
    TabComponent = __decorate([
        core_1.Directive({
            selector: 'vcl-tab'
        }), 
        __metadata('design:paramtypes', [])
    ], TabComponent);
    return TabComponent;
}());
exports.TabComponent = TabComponent;
var TabNavComponent = (function () {
    function TabNavComponent() {
        this.layout = '';
        this.tabbableClass = '';
        this.tabsClass = '';
        this.tabContentClass = '';
        // Sets vclTabStyleUni on vclTabs and removes vclNoBorder on vclTabContent when true
        this.borders = false;
        this.selectedTabIndex = 0;
        this.selectedTabIndexChange$ = new core_1.EventEmitter();
    }
    Object.defineProperty(TabNavComponent.prototype, "selectedTabIndexChange", {
        get: function () {
            return this.selectedTabIndexChange$.asObservable();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TabNavComponent.prototype, "tabsHaveContent", {
        // If any of the tabs has we do not render the shared content template
        // as it might be one the tabs content templates 
        get: function () {
            return this.tabs.some(function (tab) { return !!tab.content; });
        },
        enumerable: true,
        configurable: true
    });
    // Sets a valid selectedTabIndex
    TabNavComponent.prototype.selectTab = function (tab) {
        var tabs = this.tabs.toArray();
        var tabIdx;
        var tabComp;
        if (tab instanceof TabComponent) {
            tabIdx = tabs.indexOf(tab);
            tabComp = tab;
        }
        else if (typeof tab === 'number' && tabs[tab]) {
            tabIdx = tab;
            tabComp = tabs[tabIdx];
        }
        else {
            tabIdx = -1;
            tabComp = null;
        }
        if (tabIdx >= 0 && tab instanceof TabComponent && !tab.disabled) {
            this.selectedTabIndex = tabIdx;
            this.selectedTabIndexChange$.emit(tabIdx);
        }
    };
    __decorate([
        core_1.ContentChildren(TabComponent), 
        __metadata('design:type', (typeof (_a = typeof core_1.QueryList !== 'undefined' && core_1.QueryList) === 'function' && _a) || Object)
    ], TabNavComponent.prototype, "tabs", void 0);
    __decorate([
        core_1.ContentChild(TabContentDirective), 
        __metadata('design:type', TabContentDirective)
    ], TabNavComponent.prototype, "content", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabNavComponent.prototype, "layout", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabNavComponent.prototype, "tabbableClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabNavComponent.prototype, "tabsClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TabNavComponent.prototype, "tabContentClass", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Boolean)
    ], TabNavComponent.prototype, "borders", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TabNavComponent.prototype, "selectedTabIndex", void 0);
    __decorate([
        core_1.Output(), 
        __metadata('design:type', (typeof (_b = typeof Observable_1.Observable !== 'undefined' && Observable_1.Observable) === 'function' && _b) || Object)
    ], TabNavComponent.prototype, "selectedTabIndexChange", null);
    TabNavComponent = __decorate([
        core_1.Component({
            selector: 'vcl-tab-nav',
            template: __webpack_require__(855)
        }), 
        __metadata('design:paramtypes', [])
    ], TabNavComponent);
    return TabNavComponent;
    var _a, _b;
}());
exports.TabNavComponent = TabNavComponent;


/***/ },

/***/ 666:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var Tether = __webpack_require__(1116);
var TetherComponent = (function () {
    function TetherComponent(myElement) {
        this.myElement = myElement;
        this.id = 'tetherId' + Math.floor(Math.random() * 10000);
    }
    TetherComponent.prototype.ngAfterViewInit = function () {
        try {
            new Tether({
                element: '#' + this.id,
                target: this.target,
                attachment: this.attachment,
                targetAttachment: this.targetAttachment
            });
        }
        catch (ex) {
            console.log(ex);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TetherComponent.prototype, "target", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TetherComponent.prototype, "class", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], TetherComponent.prototype, "zIndex", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TetherComponent.prototype, "targetAttachment", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], TetherComponent.prototype, "attachment", void 0);
    TetherComponent = __decorate([
        core_1.Component({
            selector: 'vcl-tether',
            template: __webpack_require__(856)
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], TetherComponent);
    return TetherComponent;
    var _a;
}());
exports.TetherComponent = TetherComponent;


/***/ },

/***/ 667:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var ToolbarComponent = (function () {
    function ToolbarComponent() {
        this.ariaLevel = 1;
    }
    __decorate([
        core_1.Input(), 
        __metadata('design:type', Number)
    ], ToolbarComponent.prototype, "ariaLevel", void 0);
    ToolbarComponent = __decorate([
        core_1.Component({
            selector: 'vcl-toolbar',
            template: '<ng-content></ng-content>',
            host: {
                '[class.vclToolbar]': 'true',
                '[class.vclLayoutHorizontal]': 'true',
                '[class.vclLayoutJustified]': 'true',
                '[class.vclSecondary]': 'ariaLevel == 2',
                '[attr.aria-level]': 'ariaLevel',
                '[attr.role]': '"menubar"',
            }
        }), 
        __metadata('design:paramtypes', [])
    ], ToolbarComponent);
    return ToolbarComponent;
}());
exports.ToolbarComponent = ToolbarComponent;


/***/ },

/***/ 668:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var OffClickDirective = (function () {
    function OffClickDirective(elem) {
        this.elem = elem;
        this.offClick = new core_1.EventEmitter();
    }
    OffClickDirective.prototype.ngAfterViewInit = function () {
        var _this = this;
        if (typeof document !== 'undefined') {
            // Create the listener
            this.listener = function (ev) {
                var me = _this.elem.nativeElement;
                // Check if the target is the off-clicks element or an sub element 
                if (ev.target && me !== ev.target && !me.contains(ev.target)) {
                    _this.offClick.emit();
                }
            };
            // Wait for next run loop to attach the listener as it might be triggered by a current click event
            setTimeout(function () {
                document.addEventListener('click', _this.listener);
            }, 0);
        }
    };
    OffClickDirective.prototype.ngOnDestroy = function () {
        if (typeof document !== 'undefined' && this.listener) {
            document.removeEventListener('click', this.listener);
        }
    };
    __decorate([
        core_1.Output('off-click'), 
        __metadata('design:type', Object)
    ], OffClickDirective.prototype, "offClick", void 0);
    OffClickDirective = __decorate([
        core_1.Directive({
            selector: '[off-click]',
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ElementRef !== 'undefined' && core_1.ElementRef) === 'function' && _a) || Object])
    ], OffClickDirective);
    return OffClickDirective;
    var _a;
}());
exports.OffClickDirective = OffClickDirective;


/***/ },

/***/ 669:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
// The wormhole Directive is just a reference to a template
var WormholeGenerator = (function () {
    function WormholeGenerator(templateRef) {
        this.templateRef = templateRef;
    }
    Object.defineProperty(WormholeGenerator.prototype, "isConnected", {
        get: function () {
            return !!this.source;
        },
        enumerable: true,
        configurable: true
    });
    WormholeGenerator.prototype.disconnect = function () {
        this.source = null;
    };
    WormholeGenerator.prototype.connect = function (wormhole) {
        this.source = wormhole;
    };
    WormholeGenerator.prototype.getTemplateRef = function () {
        return this.templateRef;
    };
    WormholeGenerator = __decorate([
        core_1.Directive({
            selector: '[generateWormhole]',
            exportAs: 'wormhole',
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.TemplateRef !== 'undefined' && core_1.TemplateRef) === 'function' && _a) || Object])
    ], WormholeGenerator);
    return WormholeGenerator;
    var _a;
}());
exports.WormholeGenerator = WormholeGenerator;
var Wormhole = (function () {
    function Wormhole(viewContainerRef) {
        this.viewContainerRef = viewContainerRef;
        // TODO: workaround. Does not disconnect the view when destroying the element when true
        // ngOnDestroy is called before the animations are fully traversed. This would remove the wormhole's ContentChild
        // before it's host is removed from the DOM
        this.indisposable = false;
    }
    Object.defineProperty(Wormhole.prototype, "isConnected", {
        get: function () {
            return !!this.connectedWormhole;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Wormhole.prototype, "wormhole", {
        get: function () {
            return this._wormhole;
        },
        set: function (wormhole) {
            if (this.isConnected) {
                this.disconnect();
            }
            if (wormhole) {
                this.connect(wormhole);
                this._wormhole = wormhole;
            }
        },
        enumerable: true,
        configurable: true
    });
    Wormhole.prototype.connect = function (wormhole) {
        this.connectedWormhole = wormhole;
        wormhole.connect(this);
        var templateRef = wormhole.getTemplateRef();
        this.viewContainerRef.createEmbeddedView(templateRef);
    };
    Wormhole.prototype.disconnect = function () {
        if (this.connectedWormhole) {
            this.connectedWormhole.disconnect();
        }
        this.connectedWormhole = null;
        this.viewContainerRef.clear();
    };
    Wormhole.prototype.ngOnDestroy = function () {
        if (this.isConnected && !this.indisposable) {
            this.disconnect();
        }
    };
    __decorate([
        core_1.Input('wormhole'), 
        __metadata('design:type', WormholeGenerator)
    ], Wormhole.prototype, "wormhole", null);
    __decorate([
        core_1.Input('wormhole-indisposable'), 
        __metadata('design:type', Boolean)
    ], Wormhole.prototype, "indisposable", void 0);
    Wormhole = __decorate([
        core_1.Directive({
            selector: '[wormhole]'
        }), 
        __metadata('design:paramtypes', [(typeof (_a = typeof core_1.ViewContainerRef !== 'undefined' && core_1.ViewContainerRef) === 'function' && _a) || Object])
    ], Wormhole);
    return Wormhole;
    var _a;
}());
exports.Wormhole = Wormhole;


/***/ },

/***/ 670:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
var input_module_1 = __webpack_require__(655);
var core_1 = __webpack_require__(0);
var icon_module_1 = __webpack_require__(92);
var metalist_module_1 = __webpack_require__(375);
var dropdown_module_1 = __webpack_require__(372);
var select_module_1 = __webpack_require__(664);
var icogram_module_1 = __webpack_require__(161);
var button_module_1 = __webpack_require__(116);
var button_group_module_1 = __webpack_require__(369);
var layer_module_1 = __webpack_require__(240);
var tab_nav_module_1 = __webpack_require__(380);
var navigation_module_1 = __webpack_require__(377);
var toolbar_module_1 = __webpack_require__(381);
var tether_module_1 = __webpack_require__(242);
var link_module_1 = __webpack_require__(241);
var popover_module_1 = __webpack_require__(378);
var radio_button_module_1 = __webpack_require__(379);
var checkbox_module_1 = __webpack_require__(371);
var off_click_module_1 = __webpack_require__(162);
var form_control_label_module_1 = __webpack_require__(651);
var wormhole_module_1 = __webpack_require__(73);
var month_picker_module_1 = __webpack_require__(376);
__export(__webpack_require__(672));
__export(__webpack_require__(92));
__export(__webpack_require__(161));
__export(__webpack_require__(116));
__export(__webpack_require__(369));
__export(__webpack_require__(240));
__export(__webpack_require__(380));
__export(__webpack_require__(377));
__export(__webpack_require__(381));
__export(__webpack_require__(242));
__export(__webpack_require__(241));
__export(__webpack_require__(378));
__export(__webpack_require__(379));
__export(__webpack_require__(371));
__export(__webpack_require__(376));
__export(__webpack_require__(162));
__export(__webpack_require__(73));
__export(__webpack_require__(28));
__export(__webpack_require__(645));
var overlayManager_service_1 = __webpack_require__(382);
var VCLModule = (function () {
    function VCLModule() {
    }
    VCLModule = __decorate([
        core_1.NgModule({
            imports: [
                wormhole_module_1.VCLWormholeModule,
                icon_module_1.VCLIconModule,
                icogram_module_1.VCLIcogramModule,
                button_module_1.VCLButtonModule,
                button_group_module_1.VCLButtonGroupModule,
                layer_module_1.VCLLayerModule,
                tether_module_1.VCLTetherModule,
                link_module_1.VCLLinkModule,
                input_module_1.VCLInputModule,
                tab_nav_module_1.VCLTabNavModule,
                navigation_module_1.VCLNavigationModule,
                toolbar_module_1.VCLToolbarModule,
                popover_module_1.VCLPopoverModule,
                radio_button_module_1.VCLRadioButtonModule,
                checkbox_module_1.VCLCheckboxModule,
                form_control_label_module_1.VCLFormControlLabelModule,
                metalist_module_1.VCLMetalistModule,
                dropdown_module_1.VCLDropdownModule,
                select_module_1.VCLSelectModule,
                off_click_module_1.VCLOffClickModule,
                month_picker_module_1.VCLMonthPickerModule
            ],
            exports: [
                wormhole_module_1.VCLWormholeModule,
                icon_module_1.VCLIconModule,
                icogram_module_1.VCLIcogramModule,
                button_module_1.VCLButtonModule,
                button_group_module_1.VCLButtonGroupModule,
                layer_module_1.VCLLayerModule,
                tether_module_1.VCLTetherModule,
                link_module_1.VCLLinkModule,
                input_module_1.VCLInputModule,
                tab_nav_module_1.VCLTabNavModule,
                navigation_module_1.VCLNavigationModule,
                toolbar_module_1.VCLToolbarModule,
                popover_module_1.VCLPopoverModule,
                radio_button_module_1.VCLRadioButtonModule,
                checkbox_module_1.VCLCheckboxModule,
                form_control_label_module_1.VCLFormControlLabelModule,
                metalist_module_1.VCLMetalistModule,
                dropdown_module_1.VCLDropdownModule,
                select_module_1.VCLSelectModule,
                off_click_module_1.VCLOffClickModule,
                month_picker_module_1.VCLMonthPickerModule
            ],
            providers: [
                overlayManager_service_1.OverlayManagerService
            ],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLModule);
    return VCLModule;
}());
exports.VCLModule = VCLModule;


/***/ },

/***/ 671:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var core_1 = __webpack_require__(0);
var l10n_service_1 = __webpack_require__(245);
var L10nPipe = (function () {
    function L10nPipe(l10n) {
        this.l10n = l10n;
        this.args = [];
    }
    // Check if key and args match
    L10nPipe.prototype.compare = function (key) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        return key === this.key &&
            args.length === this.args.length &&
            args.every(function (v, idx) { return v === _this.args[idx]; });
    };
    L10nPipe.prototype.transform = function (key) {
        var _this = this;
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        // Dispose subscription if key or params are different
        if (!this.compare.apply(this, [key].concat(args)) && this.subscription) {
            this._dispose();
        }
        // store key and args for comparison
        this.key = key;
        this.args = args;
        if (!this.subscription) {
            this.subscription = (_a = this.l10n).localize.apply(_a, [key].concat(args)).subscribe(function (value) {
                _this.value = value;
            });
        }
        return this.value;
        var _a;
    };
    L10nPipe.prototype._dispose = function () {
        this.subscription.unsubscribe();
        this.value = null;
        this.subscription = null;
    };
    L10nPipe.prototype.ngOnDestroy = function () {
        if (this.subscription) {
            this._dispose();
        }
    };
    L10nPipe = __decorate([
        core_1.Pipe({
            name: 'loc',
            pure: false
        }),
        __param(0, core_1.Optional()), 
        __metadata('design:paramtypes', [(typeof (_a = typeof l10n_service_1.L10nService !== 'undefined' && l10n_service_1.L10nService) === 'function' && _a) || Object])
    ], L10nPipe);
    return L10nPipe;
    var _a;
}());
exports.L10nPipe = L10nPipe;


/***/ },

/***/ 672:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var core_1 = __webpack_require__(0);
function setAnimations(cls, animations) {
    setAnnotation(cls, 'animations', animations);
}
exports.setAnimations = setAnimations;
function setAnnotation(cls, key, value) {
    var annotation = getAnnotation(cls);
    // Change metadata
    annotation[key] = value;
    // Set metadata
    Reflect.defineMetadata('annotations', [new core_1.Component(annotation)], cls);
}
exports.setAnnotation = setAnnotation;
function SubComponent(annotation) {
    return function (cls) {
        var baseCls = Object.getPrototypeOf(cls.prototype).constructor;
        var baseClsAnnotation = getAnnotation(baseCls);
        Object.keys(baseClsAnnotation).forEach(function (key) {
            if (baseClsAnnotation[key] !== undefined && annotation[key] === undefined) {
                annotation[key] = baseClsAnnotation[key];
            }
        });
        Reflect.defineMetadata('annotations', [new core_1.Component(annotation)], cls);
    };
}
exports.SubComponent = SubComponent;
;
function getAnnotation(cls) {
    // Annotation is an array with 1 entry
    // TODO: Check if always one entry
    var clsAnnotations = Reflect.getMetadata('annotations', cls);
    if (!clsAnnotations && clsAnnotations.length < 1) {
        throw new Error('Invalid base class');
    }
    return clsAnnotations[0];
}


/***/ },

/***/ 73:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var wormhole_directive_1 = __webpack_require__(669);
exports.WormholeGenerator = wormhole_directive_1.WormholeGenerator;
exports.Wormhole = wormhole_directive_1.Wormhole;
var VCLWormholeModule = (function () {
    function VCLWormholeModule() {
    }
    VCLWormholeModule = __decorate([
        core_1.NgModule({
            exports: [wormhole_directive_1.Wormhole, wormhole_directive_1.WormholeGenerator],
            declarations: [wormhole_directive_1.Wormhole, wormhole_directive_1.WormholeGenerator]
        }), 
        __metadata('design:paramtypes', [])
    ], VCLWormholeModule);
    return VCLWormholeModule;
}());
exports.VCLWormholeModule = VCLWormholeModule;


/***/ },

/***/ 802:
/***/ function(module, exports, __webpack_require__) {

/**
 * @license
 * Fuse - Lightweight fuzzy-search
 *
 * Copyright (c) 2012-2016 Kirollos Risk <kirollos@gmail.com>.
 * All Rights Reserved. Apache Software License 2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License")
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
;(function (global) {
  'use strict'

  function log () {
    console.log.apply(console, arguments)
  }

  var defaultOptions = {
    // The name of the identifier property. If specified, the returned result will be a list
    // of the items' dentifiers, otherwise it will be a list of the items.
    id: null,

    // Indicates whether comparisons should be case sensitive.

    caseSensitive: false,

    // An array of values that should be included from the searcher's output. When this array
    // contains elements, each result in the list will be of the form `{ item: ..., include1: ..., include2: ... }`.
    // Values you can include are `score`, `matchedLocations`
    include: [],

    // Whether to sort the result list, by score
    shouldSort: true,

    // The search function to use
    // Note that the default search function ([[Function]]) must conform to the following API:
    //
    //  @param pattern The pattern string to search
    //  @param options The search option
    //  [[Function]].constructor = function(pattern, options)
    //
    //  @param text: the string to search in for the pattern
    //  @return Object in the form of:
    //    - isMatch: boolean
    //    - score: Int
    //  [[Function]].prototype.search = function(text)
    searchFn: BitapSearcher,

    // Default sort function
    sortFn: function (a, b) {
      return a.score - b.score
    },

    // The get function to use when fetching an object's properties.
    // The default will search nested paths *ie foo.bar.baz*
    getFn: deepValue,

    // List of properties that will be searched. This also supports nested properties.
    keys: [],

    // Will print to the console. Useful for debugging.
    verbose: false,

    // When true, the search algorithm will search individual words **and** the full string,
    // computing the final score as a function of both. Note that when `tokenize` is `true`,
    // the `threshold`, `distance`, and `location` are inconsequential for individual tokens.
    tokenize: false,

    // When true, the result set will only include records that match all tokens. Will only work
    // if `tokenize` is also true.
    matchAllTokens: false,

    // Regex used to separate words when searching. Only applicable when `tokenize` is `true`.
    tokenSeparator: / +/g
  }

  function Fuse (list, options) {
    var i
    var len
    var key
    var keys

    this.list = list
    this.options = options = options || {}

    // Add boolean type options
    for (i = 0, keys = ['sort', 'shouldSort', 'verbose', 'tokenize'], len = keys.length; i < len; i++) {
      key = keys[i]
      this.options[key] = key in options ? options[key] : defaultOptions[key]
    }
    // Add all other options
    for (i = 0, keys = ['searchFn', 'sortFn', 'keys', 'getFn', 'include', 'tokenSeparator'], len = keys.length; i < len; i++) {
      key = keys[i]
      this.options[key] = options[key] || defaultOptions[key]
    }
  }

  Fuse.VERSION = '2.5.0'

  /**
   * Sets a new list for Fuse to match against.
   * @param {Array} list
   * @return {Array} The newly set list
   * @public
   */
  Fuse.prototype.set = function (list) {
    this.list = list
    return list
  }

  Fuse.prototype.search = function (pattern) {
    if (this.options.verbose) log('\nSearch term:', pattern, '\n')

    this.pattern = pattern
    this.results = []
    this.resultMap = {}
    this._keyMap = null

    this._prepareSearchers()
    this._startSearch()
    this._computeScore()
    this._sort()

    var output = this._format()
    return output
  }

  Fuse.prototype._prepareSearchers = function () {
    var options = this.options
    var pattern = this.pattern
    var searchFn = options.searchFn
    var tokens = pattern.split(options.tokenSeparator)
    var i = 0
    var len = tokens.length

    if (this.options.tokenize) {
      this.tokenSearchers = []
      for (; i < len; i++) {
        this.tokenSearchers.push(new searchFn(tokens[i], options))
      }
    }
    this.fullSeacher = new searchFn(pattern, options)
  }

  Fuse.prototype._startSearch = function () {
    var options = this.options
    var getFn = options.getFn
    var list = this.list
    var listLen = list.length
    var keys = this.options.keys
    var keysLen = keys.length
    var key
    var weight
    var item = null
    var i
    var j

    // Check the first item in the list, if it's a string, then we assume
    // that every item in the list is also a string, and thus it's a flattened array.
    if (typeof list[0] === 'string') {
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        this._analyze('', list[i], i, i)
      }
    } else {
      this._keyMap = {}
      // Otherwise, the first item is an Object (hopefully), and thus the searching
      // is done on the values of the keys of each item.
      // Iterate over every item
      for (i = 0; i < listLen; i++) {
        item = list[i]
        // Iterate over every key
        for (j = 0; j < keysLen; j++) {
          key = keys[j]
          if (typeof key !== 'string') {
            weight = (1 - key.weight) || 1
            this._keyMap[key.name] = {
              weight: weight
            }
            if (key.weight <= 0 || key.weight > 1) {
              throw new Error('Key weight has to be > 0 and <= 1')
            }
            key = key.name
          } else {
            this._keyMap[key] = {
              weight: 1
            }
          }
          this._analyze(key, getFn(item, key, []), item, i)
        }
      }
    }
  }

  Fuse.prototype._analyze = function (key, text, entity, index) {
    var options = this.options
    var words
    var scores
    var exists = false
    var existingResult
    var averageScore
    var finalScore
    var scoresLen
    var mainSearchResult
    var tokenSearcher
    var termScores
    var word
    var tokenSearchResult
    var hasMatchInText
    var checkTextMatches
    var i
    var j

    // Check if the text can be searched
    if (text === undefined || text === null) {
      return
    }

    scores = []

    var numTextMatches = 0

    if (typeof text === 'string') {
      words = text.split(options.tokenSeparator)

      if (options.verbose) log('---------\nKey:', key)

      if (this.options.tokenize) {
        for (i = 0; i < this.tokenSearchers.length; i++) {
          tokenSearcher = this.tokenSearchers[i]

          if (options.verbose) log('Pattern:', tokenSearcher.pattern)

          termScores = []
          hasMatchInText = false

          for (j = 0; j < words.length; j++) {
            word = words[j]
            tokenSearchResult = tokenSearcher.search(word)
            var obj = {}
            if (tokenSearchResult.isMatch) {
              obj[word] = tokenSearchResult.score
              exists = true
              hasMatchInText = true
              scores.push(tokenSearchResult.score)
            } else {
              obj[word] = 1
              if (!this.options.matchAllTokens) {
                scores.push(1)
              }
            }
            termScores.push(obj)
          }

          if (hasMatchInText) {
            numTextMatches++
          }

          if (options.verbose) log('Token scores:', termScores)
        }

        averageScore = scores[0]
        scoresLen = scores.length
        for (i = 1; i < scoresLen; i++) {
          averageScore += scores[i]
        }
        averageScore = averageScore / scoresLen

        if (options.verbose) log('Token score average:', averageScore)
      }

      mainSearchResult = this.fullSeacher.search(text)
      if (options.verbose) log('Full text score:', mainSearchResult.score)

      finalScore = mainSearchResult.score
      if (averageScore !== undefined) {
        finalScore = (finalScore + averageScore) / 2
      }

      if (options.verbose) log('Score average:', finalScore)

      checkTextMatches = (this.options.tokenize && this.options.matchAllTokens) ? numTextMatches >= this.tokenSearchers.length : true

      if (options.verbose) log('Check Matches', checkTextMatches)

      // If a match is found, add the item to <rawResults>, including its score
      if ((exists || mainSearchResult.isMatch) && checkTextMatches) {
        // Check if the item already exists in our results
        existingResult = this.resultMap[index]

        if (existingResult) {
          // Use the lowest score
          // existingResult.score, bitapResult.score
          existingResult.output.push({
            key: key,
            score: finalScore,
            matchedIndices: mainSearchResult.matchedIndices
          })
        } else {
          // Add it to the raw result list
          this.resultMap[index] = {
            item: entity,
            output: [{
              key: key,
              score: finalScore,
              matchedIndices: mainSearchResult.matchedIndices
            }]
          }

          this.results.push(this.resultMap[index])
        }
      }
    } else if (isArray(text)) {
      for (i = 0; i < text.length; i++) {
        this._analyze(key, text[i], entity, index)
      }
    }
  }

  Fuse.prototype._computeScore = function () {
    var i
    var j
    var keyMap = this._keyMap
    var totalScore
    var output
    var scoreLen
    var score
    var weight
    var results = this.results
    var bestScore
    var nScore

    if (this.options.verbose) log('\n\nComputing score:\n')

    for (i = 0; i < results.length; i++) {
      totalScore = 0
      output = results[i].output
      scoreLen = output.length

      bestScore = 1

      for (j = 0; j < scoreLen; j++) {
        score = output[j].score
        weight = keyMap ? keyMap[output[j].key].weight : 1

        nScore = score * weight

        if (weight !== 1) {
          bestScore = Math.min(bestScore, nScore)
        } else {
          totalScore += nScore
          output[j].nScore = nScore
        }
      }

      if (bestScore === 1) {
        results[i].score = totalScore / scoreLen
      } else {
        results[i].score = bestScore
      }

      if (this.options.verbose) log(results[i])
    }
  }

  Fuse.prototype._sort = function () {
    var options = this.options
    if (options.shouldSort) {
      if (options.verbose) log('\n\nSorting....')
      this.results.sort(options.sortFn)
    }
  }

  Fuse.prototype._format = function () {
    var options = this.options
    var getFn = options.getFn
    var finalOutput = []
    var item
    var i
    var len
    var results = this.results
    var replaceValue
    var getItemAtIndex
    var include = options.include

    if (options.verbose) log('\n\nOutput:\n\n', results)

    // Helper function, here for speed-up, which replaces the item with its value,
    // if the options specifies it,
    replaceValue = options.id ? function (index) {
      results[index].item = getFn(results[index].item, options.id, [])[0]
    } : function () {}

    getItemAtIndex = function (index) {
      var record = results[index]
      var data
      var j
      var output
      var _item
      var _result

      // If `include` has values, put the item in the result
      if (include.length > 0) {
        data = {
          item: record.item
        }
        if (include.indexOf('matches') !== -1) {
          output = record.output
          data.matches = []
          for (j = 0; j < output.length; j++) {
            _item = output[j]
            _result = {
              indices: _item.matchedIndices
            }
            if (_item.key) {
              _result.key = _item.key
            }
            data.matches.push(_result)
          }
        }

        if (include.indexOf('score') !== -1) {
          data.score = results[index].score
        }

      } else {
        data = record.item
      }

      return data
    }

    // From the results, push into a new array only the item identifier (if specified)
    // of the entire item.  This is because we don't want to return the <results>,
    // since it contains other metadata
    for (i = 0, len = results.length; i < len; i++) {
      replaceValue(i)
      item = getItemAtIndex(i)
      finalOutput.push(item)
    }

    return finalOutput
  }

  // Helpers

  function deepValue (obj, path, list) {
    var firstSegment
    var remaining
    var dotIndex
    var value
    var i
    var len

    if (!path) {
      // If there's no path left, we've gotten to the object we care about.
      list.push(obj)
    } else {
      dotIndex = path.indexOf('.')

      if (dotIndex !== -1) {
        firstSegment = path.slice(0, dotIndex)
        remaining = path.slice(dotIndex + 1)
      } else {
        firstSegment = path
      }

      value = obj[firstSegment]
      if (value !== null && value !== undefined) {
        if (!remaining && (typeof value === 'string' || typeof value === 'number')) {
          list.push(value)
        } else if (isArray(value)) {
          // Search each item in the array.
          for (i = 0, len = value.length; i < len; i++) {
            deepValue(value[i], remaining, list)
          }
        } else if (remaining) {
          // An object. Recurse further.
          deepValue(value, remaining, list)
        }
      }
    }

    return list
  }

  function isArray (obj) {
    return Object.prototype.toString.call(obj) === '[object Array]'
  }

  /**
   * Adapted from "Diff, Match and Patch", by Google
   *
   *   http://code.google.com/p/google-diff-match-patch/
   *
   * Modified by: Kirollos Risk <kirollos@gmail.com>
   * -----------------------------------------------
   * Details: the algorithm and structure was modified to allow the creation of
   * <Searcher> instances with a <search> method which does the actual
   * bitap search. The <pattern> (the string that is searched for) is only defined
   * once per instance and thus it eliminates redundant re-creation when searching
   * over a list of strings.
   *
   * Licensed under the Apache License, Version 2.0 (the "License")
   * you may not use this file except in compliance with the License.
   */
  function BitapSearcher (pattern, options) {
    options = options || {}
    this.options = options
    this.options.location = options.location || BitapSearcher.defaultOptions.location
    this.options.distance = 'distance' in options ? options.distance : BitapSearcher.defaultOptions.distance
    this.options.threshold = 'threshold' in options ? options.threshold : BitapSearcher.defaultOptions.threshold
    this.options.maxPatternLength = options.maxPatternLength || BitapSearcher.defaultOptions.maxPatternLength

    this.pattern = options.caseSensitive ? pattern : pattern.toLowerCase()
    this.patternLen = pattern.length

    if (this.patternLen <= this.options.maxPatternLength) {
      this.matchmask = 1 << (this.patternLen - 1)
      this.patternAlphabet = this._calculatePatternAlphabet()
    }
  }

  BitapSearcher.defaultOptions = {
    // Approximately where in the text is the pattern expected to be found?
    location: 0,

    // Determines how close the match must be to the fuzzy location (specified above).
    // An exact letter match which is 'distance' characters away from the fuzzy location
    // would score as a complete mismatch. A distance of '0' requires the match be at
    // the exact location specified, a threshold of '1000' would require a perfect match
    // to be within 800 characters of the fuzzy location to be found using a 0.8 threshold.
    distance: 100,

    // At what point does the match algorithm give up. A threshold of '0.0' requires a perfect match
    // (of both letters and location), a threshold of '1.0' would match anything.
    threshold: 0.6,

    // Machine word size
    maxPatternLength: 32
  }

  /**
   * Initialize the alphabet for the Bitap algorithm.
   * @return {Object} Hash of character locations.
   * @private
   */
  BitapSearcher.prototype._calculatePatternAlphabet = function () {
    var mask = {},
      i = 0

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] = 0
    }

    for (i = 0; i < this.patternLen; i++) {
      mask[this.pattern.charAt(i)] |= 1 << (this.pattern.length - i - 1)
    }

    return mask
  }

  /**
   * Compute and return the score for a match with `e` errors and `x` location.
   * @param {number} errors Number of errors in match.
   * @param {number} location Location of match.
   * @return {number} Overall score for match (0.0 = good, 1.0 = bad).
   * @private
   */
  BitapSearcher.prototype._bitapScore = function (errors, location) {
    var accuracy = errors / this.patternLen,
      proximity = Math.abs(this.options.location - location)

    if (!this.options.distance) {
      // Dodge divide by zero error.
      return proximity ? 1.0 : accuracy
    }
    return accuracy + (proximity / this.options.distance)
  }

  /**
   * Compute and return the result of the search
   * @param {String} text The text to search in
   * @return {Object} Literal containing:
   *                          {Boolean} isMatch Whether the text is a match or not
   *                          {Decimal} score Overall score for the match
   * @public
   */
  BitapSearcher.prototype.search = function (text) {
    var options = this.options
    var i
    var j
    var textLen
    var location
    var threshold
    var bestLoc
    var binMin
    var binMid
    var binMax
    var start, finish
    var bitArr
    var lastBitArr
    var charMatch
    var score
    var locations
    var matches
    var isMatched
    var matchMask
    var matchedIndices
    var matchesLen
    var match

    text = options.caseSensitive ? text : text.toLowerCase()

    if (this.pattern === text) {
      // Exact match
      return {
        isMatch: true,
        score: 0,
        matchedIndices: [[0, text.length - 1]]
      }
    }

    // When pattern length is greater than the machine word length, just do a a regex comparison
    if (this.patternLen > options.maxPatternLength) {
      matches = text.match(new RegExp(this.pattern.replace(options.tokenSeparator, '|')))
      isMatched = !!matches

      if (isMatched) {
        matchedIndices = []
        for (i = 0, matchesLen = matches.length; i < matchesLen; i++) {
          match = matches[i]
          matchedIndices.push([text.indexOf(match), match.length - 1])
        }
      }

      return {
        isMatch: isMatched,
        // TODO: revisit this score
        score: isMatched ? 0.5 : 1,
        matchedIndices: matchedIndices
      }
    }

    location = options.location
    // Set starting location at beginning text and initialize the alphabet.
    textLen = text.length
    // Highest score beyond which we give up.
    threshold = options.threshold
    // Is there a nearby exact match? (speedup)
    bestLoc = text.indexOf(this.pattern, location)

    // a mask of the matches
    matchMask = []
    for (i = 0; i < textLen; i++) {
      matchMask[i] = 0
    }

    if (bestLoc != -1) {
      threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      // What about in the other direction? (speed up)
      bestLoc = text.lastIndexOf(this.pattern, location + this.patternLen)

      if (bestLoc != -1) {
        threshold = Math.min(this._bitapScore(0, bestLoc), threshold)
      }
    }

    bestLoc = -1
    score = 1
    locations = []
    binMax = this.patternLen + textLen

    for (i = 0; i < this.patternLen; i++) {
      // Scan for the best match; each iteration allows for one more error.
      // Run a binary search to determine how far from the match location we can stray
      // at this error level.
      binMin = 0
      binMid = binMax
      while (binMin < binMid) {
        if (this._bitapScore(i, location + binMid) <= threshold) {
          binMin = binMid
        } else {
          binMax = binMid
        }
        binMid = Math.floor((binMax - binMin) / 2 + binMin)
      }

      // Use the result from this iteration as the maximum for the next.
      binMax = binMid
      start = Math.max(1, location - binMid + 1)
      finish = Math.min(location + binMid, textLen) + this.patternLen

      // Initialize the bit array
      bitArr = Array(finish + 2)

      bitArr[finish + 1] = (1 << i) - 1

      for (j = finish; j >= start; j--) {
        charMatch = this.patternAlphabet[text.charAt(j - 1)]

        if (charMatch) {
          matchMask[j - 1] = 1
        }

        if (i === 0) {
          // First pass: exact match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch
        } else {
          // Subsequent passes: fuzzy match.
          bitArr[j] = ((bitArr[j + 1] << 1) | 1) & charMatch | (((lastBitArr[j + 1] | lastBitArr[j]) << 1) | 1) | lastBitArr[j + 1]
        }
        if (bitArr[j] & this.matchmask) {
          score = this._bitapScore(i, j - 1)

          // This match will almost certainly be better than any existing match.
          // But check anyway.
          if (score <= threshold) {
            // Indeed it is
            threshold = score
            bestLoc = j - 1
            locations.push(bestLoc)

            if (bestLoc > location) {
              // When passing loc, don't exceed our current distance from loc.
              start = Math.max(1, 2 * location - bestLoc)
            } else {
              // Already passed loc, downhill from here on in.
              break
            }
          }
        }
      }

      // No hope for a (better) match at greater error levels.
      if (this._bitapScore(i + 1, location) > threshold) {
        break
      }
      lastBitArr = bitArr
    }

    matchedIndices = this._getMatchedIndices(matchMask)

    // Count exact matches (those with a score of 0) to be "almost" exact
    return {
      isMatch: bestLoc >= 0,
      score: score === 0 ? 0.001 : score,
      matchedIndices: matchedIndices
    }
  }

  BitapSearcher.prototype._getMatchedIndices = function (matchMask) {
    var matchedIndices = []
    var start = -1
    var end = -1
    var i = 0
    var match
    var len = matchMask.length
    for (; i < len; i++) {
      match = matchMask[i]
      if (match && start === -1) {
        start = i
      } else if (!match && start !== -1) {
        end = i - 1
        matchedIndices.push([start, end])
        start = -1
      }
    }
    if (matchMask[i - 1]) {
      matchedIndices.push([start, i - 1])
    }
    return matchedIndices
  }

  // Export to Common JS Loader
  if (true) {
    // Node. Does not work with strict CommonJS, but
    // only CommonJS-like environments that support module.exports,
    // like Node.
    module.exports = Fuse
  } else if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(function () {
      return Fuse
    })
  } else {
    // Browser globals (root is window)
    global.Fuse = Fuse
  }

})(this)


/***/ },

/***/ 803:
/***/ function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_RESULT__;/*! Hammer.JS - v2.0.7 - 2016-04-22
 * http://hammerjs.github.io/
 *
 * Copyright (c) 2016 Jorik Tangelder;
 * Licensed under the MIT license */
(function(window, document, exportName, undefined) {
  'use strict';

var VENDOR_PREFIXES = ['', 'webkit', 'Moz', 'MS', 'ms', 'o'];
var TEST_ELEMENT = document.createElement('div');

var TYPE_FUNCTION = 'function';

var round = Math.round;
var abs = Math.abs;
var now = Date.now;

/**
 * set a timeout with a given scope
 * @param {Function} fn
 * @param {Number} timeout
 * @param {Object} context
 * @returns {number}
 */
function setTimeoutContext(fn, timeout, context) {
    return setTimeout(bindFn(fn, context), timeout);
}

/**
 * if the argument is an array, we want to execute the fn on each entry
 * if it aint an array we don't want to do a thing.
 * this is used by all the methods that accept a single and array argument.
 * @param {*|Array} arg
 * @param {String} fn
 * @param {Object} [context]
 * @returns {Boolean}
 */
function invokeArrayArg(arg, fn, context) {
    if (Array.isArray(arg)) {
        each(arg, context[fn], context);
        return true;
    }
    return false;
}

/**
 * walk objects and arrays
 * @param {Object} obj
 * @param {Function} iterator
 * @param {Object} context
 */
function each(obj, iterator, context) {
    var i;

    if (!obj) {
        return;
    }

    if (obj.forEach) {
        obj.forEach(iterator, context);
    } else if (obj.length !== undefined) {
        i = 0;
        while (i < obj.length) {
            iterator.call(context, obj[i], i, obj);
            i++;
        }
    } else {
        for (i in obj) {
            obj.hasOwnProperty(i) && iterator.call(context, obj[i], i, obj);
        }
    }
}

/**
 * wrap a method with a deprecation warning and stack trace
 * @param {Function} method
 * @param {String} name
 * @param {String} message
 * @returns {Function} A new function wrapping the supplied method.
 */
function deprecate(method, name, message) {
    var deprecationMessage = 'DEPRECATED METHOD: ' + name + '\n' + message + ' AT \n';
    return function() {
        var e = new Error('get-stack-trace');
        var stack = e && e.stack ? e.stack.replace(/^[^\(]+?[\n$]/gm, '')
            .replace(/^\s+at\s+/gm, '')
            .replace(/^Object.<anonymous>\s*\(/gm, '{anonymous}()@') : 'Unknown Stack Trace';

        var log = window.console && (window.console.warn || window.console.log);
        if (log) {
            log.call(window.console, deprecationMessage, stack);
        }
        return method.apply(this, arguments);
    };
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} target
 * @param {...Object} objects_to_assign
 * @returns {Object} target
 */
var assign;
if (typeof Object.assign !== 'function') {
    assign = function assign(target) {
        if (target === undefined || target === null) {
            throw new TypeError('Cannot convert undefined or null to object');
        }

        var output = Object(target);
        for (var index = 1; index < arguments.length; index++) {
            var source = arguments[index];
            if (source !== undefined && source !== null) {
                for (var nextKey in source) {
                    if (source.hasOwnProperty(nextKey)) {
                        output[nextKey] = source[nextKey];
                    }
                }
            }
        }
        return output;
    };
} else {
    assign = Object.assign;
}

/**
 * extend object.
 * means that properties in dest will be overwritten by the ones in src.
 * @param {Object} dest
 * @param {Object} src
 * @param {Boolean} [merge=false]
 * @returns {Object} dest
 */
var extend = deprecate(function extend(dest, src, merge) {
    var keys = Object.keys(src);
    var i = 0;
    while (i < keys.length) {
        if (!merge || (merge && dest[keys[i]] === undefined)) {
            dest[keys[i]] = src[keys[i]];
        }
        i++;
    }
    return dest;
}, 'extend', 'Use `assign`.');

/**
 * merge the values from src in the dest.
 * means that properties that exist in dest will not be overwritten by src
 * @param {Object} dest
 * @param {Object} src
 * @returns {Object} dest
 */
var merge = deprecate(function merge(dest, src) {
    return extend(dest, src, true);
}, 'merge', 'Use `assign`.');

/**
 * simple class inheritance
 * @param {Function} child
 * @param {Function} base
 * @param {Object} [properties]
 */
function inherit(child, base, properties) {
    var baseP = base.prototype,
        childP;

    childP = child.prototype = Object.create(baseP);
    childP.constructor = child;
    childP._super = baseP;

    if (properties) {
        assign(childP, properties);
    }
}

/**
 * simple function bind
 * @param {Function} fn
 * @param {Object} context
 * @returns {Function}
 */
function bindFn(fn, context) {
    return function boundFn() {
        return fn.apply(context, arguments);
    };
}

/**
 * let a boolean value also be a function that must return a boolean
 * this first item in args will be used as the context
 * @param {Boolean|Function} val
 * @param {Array} [args]
 * @returns {Boolean}
 */
function boolOrFn(val, args) {
    if (typeof val == TYPE_FUNCTION) {
        return val.apply(args ? args[0] || undefined : undefined, args);
    }
    return val;
}

/**
 * use the val2 when val1 is undefined
 * @param {*} val1
 * @param {*} val2
 * @returns {*}
 */
function ifUndefined(val1, val2) {
    return (val1 === undefined) ? val2 : val1;
}

/**
 * addEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function addEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.addEventListener(type, handler, false);
    });
}

/**
 * removeEventListener with multiple events at once
 * @param {EventTarget} target
 * @param {String} types
 * @param {Function} handler
 */
function removeEventListeners(target, types, handler) {
    each(splitStr(types), function(type) {
        target.removeEventListener(type, handler, false);
    });
}

/**
 * find if a node is in the given parent
 * @method hasParent
 * @param {HTMLElement} node
 * @param {HTMLElement} parent
 * @return {Boolean} found
 */
function hasParent(node, parent) {
    while (node) {
        if (node == parent) {
            return true;
        }
        node = node.parentNode;
    }
    return false;
}

/**
 * small indexOf wrapper
 * @param {String} str
 * @param {String} find
 * @returns {Boolean} found
 */
function inStr(str, find) {
    return str.indexOf(find) > -1;
}

/**
 * split string on whitespace
 * @param {String} str
 * @returns {Array} words
 */
function splitStr(str) {
    return str.trim().split(/\s+/g);
}

/**
 * find if a array contains the object using indexOf or a simple polyFill
 * @param {Array} src
 * @param {String} find
 * @param {String} [findByKey]
 * @return {Boolean|Number} false when not found, or the index
 */
function inArray(src, find, findByKey) {
    if (src.indexOf && !findByKey) {
        return src.indexOf(find);
    } else {
        var i = 0;
        while (i < src.length) {
            if ((findByKey && src[i][findByKey] == find) || (!findByKey && src[i] === find)) {
                return i;
            }
            i++;
        }
        return -1;
    }
}

/**
 * convert array-like objects to real arrays
 * @param {Object} obj
 * @returns {Array}
 */
function toArray(obj) {
    return Array.prototype.slice.call(obj, 0);
}

/**
 * unique array with objects based on a key (like 'id') or just by the array's value
 * @param {Array} src [{id:1},{id:2},{id:1}]
 * @param {String} [key]
 * @param {Boolean} [sort=False]
 * @returns {Array} [{id:1},{id:2}]
 */
function uniqueArray(src, key, sort) {
    var results = [];
    var values = [];
    var i = 0;

    while (i < src.length) {
        var val = key ? src[i][key] : src[i];
        if (inArray(values, val) < 0) {
            results.push(src[i]);
        }
        values[i] = val;
        i++;
    }

    if (sort) {
        if (!key) {
            results = results.sort();
        } else {
            results = results.sort(function sortUniqueArray(a, b) {
                return a[key] > b[key];
            });
        }
    }

    return results;
}

/**
 * get the prefixed property
 * @param {Object} obj
 * @param {String} property
 * @returns {String|Undefined} prefixed
 */
function prefixed(obj, property) {
    var prefix, prop;
    var camelProp = property[0].toUpperCase() + property.slice(1);

    var i = 0;
    while (i < VENDOR_PREFIXES.length) {
        prefix = VENDOR_PREFIXES[i];
        prop = (prefix) ? prefix + camelProp : property;

        if (prop in obj) {
            return prop;
        }
        i++;
    }
    return undefined;
}

/**
 * get a unique id
 * @returns {number} uniqueId
 */
var _uniqueId = 1;
function uniqueId() {
    return _uniqueId++;
}

/**
 * get the window object of an element
 * @param {HTMLElement} element
 * @returns {DocumentView|Window}
 */
function getWindowForElement(element) {
    var doc = element.ownerDocument || element;
    return (doc.defaultView || doc.parentWindow || window);
}

var MOBILE_REGEX = /mobile|tablet|ip(ad|hone|od)|android/i;

var SUPPORT_TOUCH = ('ontouchstart' in window);
var SUPPORT_POINTER_EVENTS = prefixed(window, 'PointerEvent') !== undefined;
var SUPPORT_ONLY_TOUCH = SUPPORT_TOUCH && MOBILE_REGEX.test(navigator.userAgent);

var INPUT_TYPE_TOUCH = 'touch';
var INPUT_TYPE_PEN = 'pen';
var INPUT_TYPE_MOUSE = 'mouse';
var INPUT_TYPE_KINECT = 'kinect';

var COMPUTE_INTERVAL = 25;

var INPUT_START = 1;
var INPUT_MOVE = 2;
var INPUT_END = 4;
var INPUT_CANCEL = 8;

var DIRECTION_NONE = 1;
var DIRECTION_LEFT = 2;
var DIRECTION_RIGHT = 4;
var DIRECTION_UP = 8;
var DIRECTION_DOWN = 16;

var DIRECTION_HORIZONTAL = DIRECTION_LEFT | DIRECTION_RIGHT;
var DIRECTION_VERTICAL = DIRECTION_UP | DIRECTION_DOWN;
var DIRECTION_ALL = DIRECTION_HORIZONTAL | DIRECTION_VERTICAL;

var PROPS_XY = ['x', 'y'];
var PROPS_CLIENT_XY = ['clientX', 'clientY'];

/**
 * create new input type manager
 * @param {Manager} manager
 * @param {Function} callback
 * @returns {Input}
 * @constructor
 */
function Input(manager, callback) {
    var self = this;
    this.manager = manager;
    this.callback = callback;
    this.element = manager.element;
    this.target = manager.options.inputTarget;

    // smaller wrapper around the handler, for the scope and the enabled state of the manager,
    // so when disabled the input events are completely bypassed.
    this.domHandler = function(ev) {
        if (boolOrFn(manager.options.enable, [manager])) {
            self.handler(ev);
        }
    };

    this.init();

}

Input.prototype = {
    /**
     * should handle the inputEvent data and trigger the callback
     * @virtual
     */
    handler: function() { },

    /**
     * bind the events
     */
    init: function() {
        this.evEl && addEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && addEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && addEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    },

    /**
     * unbind the events
     */
    destroy: function() {
        this.evEl && removeEventListeners(this.element, this.evEl, this.domHandler);
        this.evTarget && removeEventListeners(this.target, this.evTarget, this.domHandler);
        this.evWin && removeEventListeners(getWindowForElement(this.element), this.evWin, this.domHandler);
    }
};

/**
 * create new input type manager
 * called by the Manager constructor
 * @param {Hammer} manager
 * @returns {Input}
 */
function createInputInstance(manager) {
    var Type;
    var inputClass = manager.options.inputClass;

    if (inputClass) {
        Type = inputClass;
    } else if (SUPPORT_POINTER_EVENTS) {
        Type = PointerEventInput;
    } else if (SUPPORT_ONLY_TOUCH) {
        Type = TouchInput;
    } else if (!SUPPORT_TOUCH) {
        Type = MouseInput;
    } else {
        Type = TouchMouseInput;
    }
    return new (Type)(manager, inputHandler);
}

/**
 * handle input events
 * @param {Manager} manager
 * @param {String} eventType
 * @param {Object} input
 */
function inputHandler(manager, eventType, input) {
    var pointersLen = input.pointers.length;
    var changedPointersLen = input.changedPointers.length;
    var isFirst = (eventType & INPUT_START && (pointersLen - changedPointersLen === 0));
    var isFinal = (eventType & (INPUT_END | INPUT_CANCEL) && (pointersLen - changedPointersLen === 0));

    input.isFirst = !!isFirst;
    input.isFinal = !!isFinal;

    if (isFirst) {
        manager.session = {};
    }

    // source event is the normalized value of the domEvents
    // like 'touchstart, mouseup, pointerdown'
    input.eventType = eventType;

    // compute scale, rotation etc
    computeInputData(manager, input);

    // emit secret event
    manager.emit('hammer.input', input);

    manager.recognize(input);
    manager.session.prevInput = input;
}

/**
 * extend the data with some usable properties like scale, rotate, velocity etc
 * @param {Object} manager
 * @param {Object} input
 */
function computeInputData(manager, input) {
    var session = manager.session;
    var pointers = input.pointers;
    var pointersLength = pointers.length;

    // store the first input to calculate the distance and direction
    if (!session.firstInput) {
        session.firstInput = simpleCloneInputData(input);
    }

    // to compute scale and rotation we need to store the multiple touches
    if (pointersLength > 1 && !session.firstMultiple) {
        session.firstMultiple = simpleCloneInputData(input);
    } else if (pointersLength === 1) {
        session.firstMultiple = false;
    }

    var firstInput = session.firstInput;
    var firstMultiple = session.firstMultiple;
    var offsetCenter = firstMultiple ? firstMultiple.center : firstInput.center;

    var center = input.center = getCenter(pointers);
    input.timeStamp = now();
    input.deltaTime = input.timeStamp - firstInput.timeStamp;

    input.angle = getAngle(offsetCenter, center);
    input.distance = getDistance(offsetCenter, center);

    computeDeltaXY(session, input);
    input.offsetDirection = getDirection(input.deltaX, input.deltaY);

    var overallVelocity = getVelocity(input.deltaTime, input.deltaX, input.deltaY);
    input.overallVelocityX = overallVelocity.x;
    input.overallVelocityY = overallVelocity.y;
    input.overallVelocity = (abs(overallVelocity.x) > abs(overallVelocity.y)) ? overallVelocity.x : overallVelocity.y;

    input.scale = firstMultiple ? getScale(firstMultiple.pointers, pointers) : 1;
    input.rotation = firstMultiple ? getRotation(firstMultiple.pointers, pointers) : 0;

    input.maxPointers = !session.prevInput ? input.pointers.length : ((input.pointers.length >
        session.prevInput.maxPointers) ? input.pointers.length : session.prevInput.maxPointers);

    computeIntervalInputData(session, input);

    // find the correct target
    var target = manager.element;
    if (hasParent(input.srcEvent.target, target)) {
        target = input.srcEvent.target;
    }
    input.target = target;
}

function computeDeltaXY(session, input) {
    var center = input.center;
    var offset = session.offsetDelta || {};
    var prevDelta = session.prevDelta || {};
    var prevInput = session.prevInput || {};

    if (input.eventType === INPUT_START || prevInput.eventType === INPUT_END) {
        prevDelta = session.prevDelta = {
            x: prevInput.deltaX || 0,
            y: prevInput.deltaY || 0
        };

        offset = session.offsetDelta = {
            x: center.x,
            y: center.y
        };
    }

    input.deltaX = prevDelta.x + (center.x - offset.x);
    input.deltaY = prevDelta.y + (center.y - offset.y);
}

/**
 * velocity is calculated every x ms
 * @param {Object} session
 * @param {Object} input
 */
function computeIntervalInputData(session, input) {
    var last = session.lastInterval || input,
        deltaTime = input.timeStamp - last.timeStamp,
        velocity, velocityX, velocityY, direction;

    if (input.eventType != INPUT_CANCEL && (deltaTime > COMPUTE_INTERVAL || last.velocity === undefined)) {
        var deltaX = input.deltaX - last.deltaX;
        var deltaY = input.deltaY - last.deltaY;

        var v = getVelocity(deltaTime, deltaX, deltaY);
        velocityX = v.x;
        velocityY = v.y;
        velocity = (abs(v.x) > abs(v.y)) ? v.x : v.y;
        direction = getDirection(deltaX, deltaY);

        session.lastInterval = input;
    } else {
        // use latest velocity info if it doesn't overtake a minimum period
        velocity = last.velocity;
        velocityX = last.velocityX;
        velocityY = last.velocityY;
        direction = last.direction;
    }

    input.velocity = velocity;
    input.velocityX = velocityX;
    input.velocityY = velocityY;
    input.direction = direction;
}

/**
 * create a simple clone from the input used for storage of firstInput and firstMultiple
 * @param {Object} input
 * @returns {Object} clonedInputData
 */
function simpleCloneInputData(input) {
    // make a simple copy of the pointers because we will get a reference if we don't
    // we only need clientXY for the calculations
    var pointers = [];
    var i = 0;
    while (i < input.pointers.length) {
        pointers[i] = {
            clientX: round(input.pointers[i].clientX),
            clientY: round(input.pointers[i].clientY)
        };
        i++;
    }

    return {
        timeStamp: now(),
        pointers: pointers,
        center: getCenter(pointers),
        deltaX: input.deltaX,
        deltaY: input.deltaY
    };
}

/**
 * get the center of all the pointers
 * @param {Array} pointers
 * @return {Object} center contains `x` and `y` properties
 */
function getCenter(pointers) {
    var pointersLength = pointers.length;

    // no need to loop when only one touch
    if (pointersLength === 1) {
        return {
            x: round(pointers[0].clientX),
            y: round(pointers[0].clientY)
        };
    }

    var x = 0, y = 0, i = 0;
    while (i < pointersLength) {
        x += pointers[i].clientX;
        y += pointers[i].clientY;
        i++;
    }

    return {
        x: round(x / pointersLength),
        y: round(y / pointersLength)
    };
}

/**
 * calculate the velocity between two points. unit is in px per ms.
 * @param {Number} deltaTime
 * @param {Number} x
 * @param {Number} y
 * @return {Object} velocity `x` and `y`
 */
function getVelocity(deltaTime, x, y) {
    return {
        x: x / deltaTime || 0,
        y: y / deltaTime || 0
    };
}

/**
 * get the direction between two points
 * @param {Number} x
 * @param {Number} y
 * @return {Number} direction
 */
function getDirection(x, y) {
    if (x === y) {
        return DIRECTION_NONE;
    }

    if (abs(x) >= abs(y)) {
        return x < 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    return y < 0 ? DIRECTION_UP : DIRECTION_DOWN;
}

/**
 * calculate the absolute distance between two points
 * @param {Object} p1 {x, y}
 * @param {Object} p2 {x, y}
 * @param {Array} [props] containing x and y keys
 * @return {Number} distance
 */
function getDistance(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];

    return Math.sqrt((x * x) + (y * y));
}

/**
 * calculate the angle between two coordinates
 * @param {Object} p1
 * @param {Object} p2
 * @param {Array} [props] containing x and y keys
 * @return {Number} angle
 */
function getAngle(p1, p2, props) {
    if (!props) {
        props = PROPS_XY;
    }
    var x = p2[props[0]] - p1[props[0]],
        y = p2[props[1]] - p1[props[1]];
    return Math.atan2(y, x) * 180 / Math.PI;
}

/**
 * calculate the rotation degrees between two pointersets
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} rotation
 */
function getRotation(start, end) {
    return getAngle(end[1], end[0], PROPS_CLIENT_XY) + getAngle(start[1], start[0], PROPS_CLIENT_XY);
}

/**
 * calculate the scale factor between two pointersets
 * no scale is 1, and goes down to 0 when pinched together, and bigger when pinched out
 * @param {Array} start array of pointers
 * @param {Array} end array of pointers
 * @return {Number} scale
 */
function getScale(start, end) {
    return getDistance(end[0], end[1], PROPS_CLIENT_XY) / getDistance(start[0], start[1], PROPS_CLIENT_XY);
}

var MOUSE_INPUT_MAP = {
    mousedown: INPUT_START,
    mousemove: INPUT_MOVE,
    mouseup: INPUT_END
};

var MOUSE_ELEMENT_EVENTS = 'mousedown';
var MOUSE_WINDOW_EVENTS = 'mousemove mouseup';

/**
 * Mouse events input
 * @constructor
 * @extends Input
 */
function MouseInput() {
    this.evEl = MOUSE_ELEMENT_EVENTS;
    this.evWin = MOUSE_WINDOW_EVENTS;

    this.pressed = false; // mousedown state

    Input.apply(this, arguments);
}

inherit(MouseInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function MEhandler(ev) {
        var eventType = MOUSE_INPUT_MAP[ev.type];

        // on start we want to have the left mouse button down
        if (eventType & INPUT_START && ev.button === 0) {
            this.pressed = true;
        }

        if (eventType & INPUT_MOVE && ev.which !== 1) {
            eventType = INPUT_END;
        }

        // mouse must be down
        if (!this.pressed) {
            return;
        }

        if (eventType & INPUT_END) {
            this.pressed = false;
        }

        this.callback(this.manager, eventType, {
            pointers: [ev],
            changedPointers: [ev],
            pointerType: INPUT_TYPE_MOUSE,
            srcEvent: ev
        });
    }
});

var POINTER_INPUT_MAP = {
    pointerdown: INPUT_START,
    pointermove: INPUT_MOVE,
    pointerup: INPUT_END,
    pointercancel: INPUT_CANCEL,
    pointerout: INPUT_CANCEL
};

// in IE10 the pointer types is defined as an enum
var IE10_POINTER_TYPE_ENUM = {
    2: INPUT_TYPE_TOUCH,
    3: INPUT_TYPE_PEN,
    4: INPUT_TYPE_MOUSE,
    5: INPUT_TYPE_KINECT // see https://twitter.com/jacobrossi/status/480596438489890816
};

var POINTER_ELEMENT_EVENTS = 'pointerdown';
var POINTER_WINDOW_EVENTS = 'pointermove pointerup pointercancel';

// IE10 has prefixed support, and case-sensitive
if (window.MSPointerEvent && !window.PointerEvent) {
    POINTER_ELEMENT_EVENTS = 'MSPointerDown';
    POINTER_WINDOW_EVENTS = 'MSPointerMove MSPointerUp MSPointerCancel';
}

/**
 * Pointer events input
 * @constructor
 * @extends Input
 */
function PointerEventInput() {
    this.evEl = POINTER_ELEMENT_EVENTS;
    this.evWin = POINTER_WINDOW_EVENTS;

    Input.apply(this, arguments);

    this.store = (this.manager.session.pointerEvents = []);
}

inherit(PointerEventInput, Input, {
    /**
     * handle mouse events
     * @param {Object} ev
     */
    handler: function PEhandler(ev) {
        var store = this.store;
        var removePointer = false;

        var eventTypeNormalized = ev.type.toLowerCase().replace('ms', '');
        var eventType = POINTER_INPUT_MAP[eventTypeNormalized];
        var pointerType = IE10_POINTER_TYPE_ENUM[ev.pointerType] || ev.pointerType;

        var isTouch = (pointerType == INPUT_TYPE_TOUCH);

        // get index of the event in the store
        var storeIndex = inArray(store, ev.pointerId, 'pointerId');

        // start and mouse must be down
        if (eventType & INPUT_START && (ev.button === 0 || isTouch)) {
            if (storeIndex < 0) {
                store.push(ev);
                storeIndex = store.length - 1;
            }
        } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
            removePointer = true;
        }

        // it not found, so the pointer hasn't been down (so it's probably a hover)
        if (storeIndex < 0) {
            return;
        }

        // update the event in the store
        store[storeIndex] = ev;

        this.callback(this.manager, eventType, {
            pointers: store,
            changedPointers: [ev],
            pointerType: pointerType,
            srcEvent: ev
        });

        if (removePointer) {
            // remove from the store
            store.splice(storeIndex, 1);
        }
    }
});

var SINGLE_TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var SINGLE_TOUCH_TARGET_EVENTS = 'touchstart';
var SINGLE_TOUCH_WINDOW_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Touch events input
 * @constructor
 * @extends Input
 */
function SingleTouchInput() {
    this.evTarget = SINGLE_TOUCH_TARGET_EVENTS;
    this.evWin = SINGLE_TOUCH_WINDOW_EVENTS;
    this.started = false;

    Input.apply(this, arguments);
}

inherit(SingleTouchInput, Input, {
    handler: function TEhandler(ev) {
        var type = SINGLE_TOUCH_INPUT_MAP[ev.type];

        // should we handle the touch events?
        if (type === INPUT_START) {
            this.started = true;
        }

        if (!this.started) {
            return;
        }

        var touches = normalizeSingleTouches.call(this, ev, type);

        // when done, reset the started state
        if (type & (INPUT_END | INPUT_CANCEL) && touches[0].length - touches[1].length === 0) {
            this.started = false;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function normalizeSingleTouches(ev, type) {
    var all = toArray(ev.touches);
    var changed = toArray(ev.changedTouches);

    if (type & (INPUT_END | INPUT_CANCEL)) {
        all = uniqueArray(all.concat(changed), 'identifier', true);
    }

    return [all, changed];
}

var TOUCH_INPUT_MAP = {
    touchstart: INPUT_START,
    touchmove: INPUT_MOVE,
    touchend: INPUT_END,
    touchcancel: INPUT_CANCEL
};

var TOUCH_TARGET_EVENTS = 'touchstart touchmove touchend touchcancel';

/**
 * Multi-user touch events input
 * @constructor
 * @extends Input
 */
function TouchInput() {
    this.evTarget = TOUCH_TARGET_EVENTS;
    this.targetIds = {};

    Input.apply(this, arguments);
}

inherit(TouchInput, Input, {
    handler: function MTEhandler(ev) {
        var type = TOUCH_INPUT_MAP[ev.type];
        var touches = getTouches.call(this, ev, type);
        if (!touches) {
            return;
        }

        this.callback(this.manager, type, {
            pointers: touches[0],
            changedPointers: touches[1],
            pointerType: INPUT_TYPE_TOUCH,
            srcEvent: ev
        });
    }
});

/**
 * @this {TouchInput}
 * @param {Object} ev
 * @param {Number} type flag
 * @returns {undefined|Array} [all, changed]
 */
function getTouches(ev, type) {
    var allTouches = toArray(ev.touches);
    var targetIds = this.targetIds;

    // when there is only one touch, the process can be simplified
    if (type & (INPUT_START | INPUT_MOVE) && allTouches.length === 1) {
        targetIds[allTouches[0].identifier] = true;
        return [allTouches, allTouches];
    }

    var i,
        targetTouches,
        changedTouches = toArray(ev.changedTouches),
        changedTargetTouches = [],
        target = this.target;

    // get target touches from touches
    targetTouches = allTouches.filter(function(touch) {
        return hasParent(touch.target, target);
    });

    // collect touches
    if (type === INPUT_START) {
        i = 0;
        while (i < targetTouches.length) {
            targetIds[targetTouches[i].identifier] = true;
            i++;
        }
    }

    // filter changed touches to only contain touches that exist in the collected target ids
    i = 0;
    while (i < changedTouches.length) {
        if (targetIds[changedTouches[i].identifier]) {
            changedTargetTouches.push(changedTouches[i]);
        }

        // cleanup removed touches
        if (type & (INPUT_END | INPUT_CANCEL)) {
            delete targetIds[changedTouches[i].identifier];
        }
        i++;
    }

    if (!changedTargetTouches.length) {
        return;
    }

    return [
        // merge targetTouches with changedTargetTouches so it contains ALL touches, including 'end' and 'cancel'
        uniqueArray(targetTouches.concat(changedTargetTouches), 'identifier', true),
        changedTargetTouches
    ];
}

/**
 * Combined touch and mouse input
 *
 * Touch has a higher priority then mouse, and while touching no mouse events are allowed.
 * This because touch devices also emit mouse events while doing a touch.
 *
 * @constructor
 * @extends Input
 */

var DEDUP_TIMEOUT = 2500;
var DEDUP_DISTANCE = 25;

function TouchMouseInput() {
    Input.apply(this, arguments);

    var handler = bindFn(this.handler, this);
    this.touch = new TouchInput(this.manager, handler);
    this.mouse = new MouseInput(this.manager, handler);

    this.primaryTouch = null;
    this.lastTouches = [];
}

inherit(TouchMouseInput, Input, {
    /**
     * handle mouse and touch events
     * @param {Hammer} manager
     * @param {String} inputEvent
     * @param {Object} inputData
     */
    handler: function TMEhandler(manager, inputEvent, inputData) {
        var isTouch = (inputData.pointerType == INPUT_TYPE_TOUCH),
            isMouse = (inputData.pointerType == INPUT_TYPE_MOUSE);

        if (isMouse && inputData.sourceCapabilities && inputData.sourceCapabilities.firesTouchEvents) {
            return;
        }

        // when we're in a touch event, record touches to  de-dupe synthetic mouse event
        if (isTouch) {
            recordTouches.call(this, inputEvent, inputData);
        } else if (isMouse && isSyntheticEvent.call(this, inputData)) {
            return;
        }

        this.callback(manager, inputEvent, inputData);
    },

    /**
     * remove the event listeners
     */
    destroy: function destroy() {
        this.touch.destroy();
        this.mouse.destroy();
    }
});

function recordTouches(eventType, eventData) {
    if (eventType & INPUT_START) {
        this.primaryTouch = eventData.changedPointers[0].identifier;
        setLastTouch.call(this, eventData);
    } else if (eventType & (INPUT_END | INPUT_CANCEL)) {
        setLastTouch.call(this, eventData);
    }
}

function setLastTouch(eventData) {
    var touch = eventData.changedPointers[0];

    if (touch.identifier === this.primaryTouch) {
        var lastTouch = {x: touch.clientX, y: touch.clientY};
        this.lastTouches.push(lastTouch);
        var lts = this.lastTouches;
        var removeLastTouch = function() {
            var i = lts.indexOf(lastTouch);
            if (i > -1) {
                lts.splice(i, 1);
            }
        };
        setTimeout(removeLastTouch, DEDUP_TIMEOUT);
    }
}

function isSyntheticEvent(eventData) {
    var x = eventData.srcEvent.clientX, y = eventData.srcEvent.clientY;
    for (var i = 0; i < this.lastTouches.length; i++) {
        var t = this.lastTouches[i];
        var dx = Math.abs(x - t.x), dy = Math.abs(y - t.y);
        if (dx <= DEDUP_DISTANCE && dy <= DEDUP_DISTANCE) {
            return true;
        }
    }
    return false;
}

var PREFIXED_TOUCH_ACTION = prefixed(TEST_ELEMENT.style, 'touchAction');
var NATIVE_TOUCH_ACTION = PREFIXED_TOUCH_ACTION !== undefined;

// magical touchAction value
var TOUCH_ACTION_COMPUTE = 'compute';
var TOUCH_ACTION_AUTO = 'auto';
var TOUCH_ACTION_MANIPULATION = 'manipulation'; // not implemented
var TOUCH_ACTION_NONE = 'none';
var TOUCH_ACTION_PAN_X = 'pan-x';
var TOUCH_ACTION_PAN_Y = 'pan-y';
var TOUCH_ACTION_MAP = getTouchActionProps();

/**
 * Touch Action
 * sets the touchAction property or uses the js alternative
 * @param {Manager} manager
 * @param {String} value
 * @constructor
 */
function TouchAction(manager, value) {
    this.manager = manager;
    this.set(value);
}

TouchAction.prototype = {
    /**
     * set the touchAction value on the element or enable the polyfill
     * @param {String} value
     */
    set: function(value) {
        // find out the touch-action by the event handlers
        if (value == TOUCH_ACTION_COMPUTE) {
            value = this.compute();
        }

        if (NATIVE_TOUCH_ACTION && this.manager.element.style && TOUCH_ACTION_MAP[value]) {
            this.manager.element.style[PREFIXED_TOUCH_ACTION] = value;
        }
        this.actions = value.toLowerCase().trim();
    },

    /**
     * just re-set the touchAction value
     */
    update: function() {
        this.set(this.manager.options.touchAction);
    },

    /**
     * compute the value for the touchAction property based on the recognizer's settings
     * @returns {String} value
     */
    compute: function() {
        var actions = [];
        each(this.manager.recognizers, function(recognizer) {
            if (boolOrFn(recognizer.options.enable, [recognizer])) {
                actions = actions.concat(recognizer.getTouchAction());
            }
        });
        return cleanTouchActions(actions.join(' '));
    },

    /**
     * this method is called on each input cycle and provides the preventing of the browser behavior
     * @param {Object} input
     */
    preventDefaults: function(input) {
        var srcEvent = input.srcEvent;
        var direction = input.offsetDirection;

        // if the touch action did prevented once this session
        if (this.manager.session.prevented) {
            srcEvent.preventDefault();
            return;
        }

        var actions = this.actions;
        var hasNone = inStr(actions, TOUCH_ACTION_NONE) && !TOUCH_ACTION_MAP[TOUCH_ACTION_NONE];
        var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_Y];
        var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X) && !TOUCH_ACTION_MAP[TOUCH_ACTION_PAN_X];

        if (hasNone) {
            //do not prevent defaults if this is a tap gesture

            var isTapPointer = input.pointers.length === 1;
            var isTapMovement = input.distance < 2;
            var isTapTouchTime = input.deltaTime < 250;

            if (isTapPointer && isTapMovement && isTapTouchTime) {
                return;
            }
        }

        if (hasPanX && hasPanY) {
            // `pan-x pan-y` means browser handles all scrolling/panning, do not prevent
            return;
        }

        if (hasNone ||
            (hasPanY && direction & DIRECTION_HORIZONTAL) ||
            (hasPanX && direction & DIRECTION_VERTICAL)) {
            return this.preventSrc(srcEvent);
        }
    },

    /**
     * call preventDefault to prevent the browser's default behavior (scrolling in most cases)
     * @param {Object} srcEvent
     */
    preventSrc: function(srcEvent) {
        this.manager.session.prevented = true;
        srcEvent.preventDefault();
    }
};

/**
 * when the touchActions are collected they are not a valid value, so we need to clean things up. *
 * @param {String} actions
 * @returns {*}
 */
function cleanTouchActions(actions) {
    // none
    if (inStr(actions, TOUCH_ACTION_NONE)) {
        return TOUCH_ACTION_NONE;
    }

    var hasPanX = inStr(actions, TOUCH_ACTION_PAN_X);
    var hasPanY = inStr(actions, TOUCH_ACTION_PAN_Y);

    // if both pan-x and pan-y are set (different recognizers
    // for different directions, e.g. horizontal pan but vertical swipe?)
    // we need none (as otherwise with pan-x pan-y combined none of these
    // recognizers will work, since the browser would handle all panning
    if (hasPanX && hasPanY) {
        return TOUCH_ACTION_NONE;
    }

    // pan-x OR pan-y
    if (hasPanX || hasPanY) {
        return hasPanX ? TOUCH_ACTION_PAN_X : TOUCH_ACTION_PAN_Y;
    }

    // manipulation
    if (inStr(actions, TOUCH_ACTION_MANIPULATION)) {
        return TOUCH_ACTION_MANIPULATION;
    }

    return TOUCH_ACTION_AUTO;
}

function getTouchActionProps() {
    if (!NATIVE_TOUCH_ACTION) {
        return false;
    }
    var touchMap = {};
    var cssSupports = window.CSS && window.CSS.supports;
    ['auto', 'manipulation', 'pan-y', 'pan-x', 'pan-x pan-y', 'none'].forEach(function(val) {

        // If css.supports is not supported but there is native touch-action assume it supports
        // all values. This is the case for IE 10 and 11.
        touchMap[val] = cssSupports ? window.CSS.supports('touch-action', val) : true;
    });
    return touchMap;
}

/**
 * Recognizer flow explained; *
 * All recognizers have the initial state of POSSIBLE when a input session starts.
 * The definition of a input session is from the first input until the last input, with all it's movement in it. *
 * Example session for mouse-input: mousedown -> mousemove -> mouseup
 *
 * On each recognizing cycle (see Manager.recognize) the .recognize() method is executed
 * which determines with state it should be.
 *
 * If the recognizer has the state FAILED, CANCELLED or RECOGNIZED (equals ENDED), it is reset to
 * POSSIBLE to give it another change on the next cycle.
 *
 *               Possible
 *                  |
 *            +-----+---------------+
 *            |                     |
 *      +-----+-----+               |
 *      |           |               |
 *   Failed      Cancelled          |
 *                          +-------+------+
 *                          |              |
 *                      Recognized       Began
 *                                         |
 *                                      Changed
 *                                         |
 *                                  Ended/Recognized
 */
var STATE_POSSIBLE = 1;
var STATE_BEGAN = 2;
var STATE_CHANGED = 4;
var STATE_ENDED = 8;
var STATE_RECOGNIZED = STATE_ENDED;
var STATE_CANCELLED = 16;
var STATE_FAILED = 32;

/**
 * Recognizer
 * Every recognizer needs to extend from this class.
 * @constructor
 * @param {Object} options
 */
function Recognizer(options) {
    this.options = assign({}, this.defaults, options || {});

    this.id = uniqueId();

    this.manager = null;

    // default is enable true
    this.options.enable = ifUndefined(this.options.enable, true);

    this.state = STATE_POSSIBLE;

    this.simultaneous = {};
    this.requireFail = [];
}

Recognizer.prototype = {
    /**
     * @virtual
     * @type {Object}
     */
    defaults: {},

    /**
     * set options
     * @param {Object} options
     * @return {Recognizer}
     */
    set: function(options) {
        assign(this.options, options);

        // also update the touchAction, in case something changed about the directions/enabled state
        this.manager && this.manager.touchAction.update();
        return this;
    },

    /**
     * recognize simultaneous with an other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    recognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'recognizeWith', this)) {
            return this;
        }

        var simultaneous = this.simultaneous;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (!simultaneous[otherRecognizer.id]) {
            simultaneous[otherRecognizer.id] = otherRecognizer;
            otherRecognizer.recognizeWith(this);
        }
        return this;
    },

    /**
     * drop the simultaneous link. it doesnt remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRecognizeWith: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRecognizeWith', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        delete this.simultaneous[otherRecognizer.id];
        return this;
    },

    /**
     * recognizer can only run when an other is failing
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    requireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'requireFailure', this)) {
            return this;
        }

        var requireFail = this.requireFail;
        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        if (inArray(requireFail, otherRecognizer) === -1) {
            requireFail.push(otherRecognizer);
            otherRecognizer.requireFailure(this);
        }
        return this;
    },

    /**
     * drop the requireFailure link. it does not remove the link on the other recognizer.
     * @param {Recognizer} otherRecognizer
     * @returns {Recognizer} this
     */
    dropRequireFailure: function(otherRecognizer) {
        if (invokeArrayArg(otherRecognizer, 'dropRequireFailure', this)) {
            return this;
        }

        otherRecognizer = getRecognizerByNameIfManager(otherRecognizer, this);
        var index = inArray(this.requireFail, otherRecognizer);
        if (index > -1) {
            this.requireFail.splice(index, 1);
        }
        return this;
    },

    /**
     * has require failures boolean
     * @returns {boolean}
     */
    hasRequireFailures: function() {
        return this.requireFail.length > 0;
    },

    /**
     * if the recognizer can recognize simultaneous with an other recognizer
     * @param {Recognizer} otherRecognizer
     * @returns {Boolean}
     */
    canRecognizeWith: function(otherRecognizer) {
        return !!this.simultaneous[otherRecognizer.id];
    },

    /**
     * You should use `tryEmit` instead of `emit` directly to check
     * that all the needed recognizers has failed before emitting.
     * @param {Object} input
     */
    emit: function(input) {
        var self = this;
        var state = this.state;

        function emit(event) {
            self.manager.emit(event, input);
        }

        // 'panstart' and 'panmove'
        if (state < STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }

        emit(self.options.event); // simple 'eventName' events

        if (input.additionalEvent) { // additional event(panleft, panright, pinchin, pinchout...)
            emit(input.additionalEvent);
        }

        // panend and pancancel
        if (state >= STATE_ENDED) {
            emit(self.options.event + stateStr(state));
        }
    },

    /**
     * Check that all the require failure recognizers has failed,
     * if true, it emits a gesture event,
     * otherwise, setup the state to FAILED.
     * @param {Object} input
     */
    tryEmit: function(input) {
        if (this.canEmit()) {
            return this.emit(input);
        }
        // it's failing anyway
        this.state = STATE_FAILED;
    },

    /**
     * can we emit?
     * @returns {boolean}
     */
    canEmit: function() {
        var i = 0;
        while (i < this.requireFail.length) {
            if (!(this.requireFail[i].state & (STATE_FAILED | STATE_POSSIBLE))) {
                return false;
            }
            i++;
        }
        return true;
    },

    /**
     * update the recognizer
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        // make a new copy of the inputData
        // so we can change the inputData without messing up the other recognizers
        var inputDataClone = assign({}, inputData);

        // is is enabled and allow recognizing?
        if (!boolOrFn(this.options.enable, [this, inputDataClone])) {
            this.reset();
            this.state = STATE_FAILED;
            return;
        }

        // reset when we've reached the end
        if (this.state & (STATE_RECOGNIZED | STATE_CANCELLED | STATE_FAILED)) {
            this.state = STATE_POSSIBLE;
        }

        this.state = this.process(inputDataClone);

        // the recognizer has recognized a gesture
        // so trigger an event
        if (this.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED | STATE_CANCELLED)) {
            this.tryEmit(inputDataClone);
        }
    },

    /**
     * return the state of the recognizer
     * the actual recognizing happens in this method
     * @virtual
     * @param {Object} inputData
     * @returns {Const} STATE
     */
    process: function(inputData) { }, // jshint ignore:line

    /**
     * return the preferred touch-action
     * @virtual
     * @returns {Array}
     */
    getTouchAction: function() { },

    /**
     * called when the gesture isn't allowed to recognize
     * like when another is being recognized or it is disabled
     * @virtual
     */
    reset: function() { }
};

/**
 * get a usable string, used as event postfix
 * @param {Const} state
 * @returns {String} state
 */
function stateStr(state) {
    if (state & STATE_CANCELLED) {
        return 'cancel';
    } else if (state & STATE_ENDED) {
        return 'end';
    } else if (state & STATE_CHANGED) {
        return 'move';
    } else if (state & STATE_BEGAN) {
        return 'start';
    }
    return '';
}

/**
 * direction cons to string
 * @param {Const} direction
 * @returns {String}
 */
function directionStr(direction) {
    if (direction == DIRECTION_DOWN) {
        return 'down';
    } else if (direction == DIRECTION_UP) {
        return 'up';
    } else if (direction == DIRECTION_LEFT) {
        return 'left';
    } else if (direction == DIRECTION_RIGHT) {
        return 'right';
    }
    return '';
}

/**
 * get a recognizer by name if it is bound to a manager
 * @param {Recognizer|String} otherRecognizer
 * @param {Recognizer} recognizer
 * @returns {Recognizer}
 */
function getRecognizerByNameIfManager(otherRecognizer, recognizer) {
    var manager = recognizer.manager;
    if (manager) {
        return manager.get(otherRecognizer);
    }
    return otherRecognizer;
}

/**
 * This recognizer is just used as a base for the simple attribute recognizers.
 * @constructor
 * @extends Recognizer
 */
function AttrRecognizer() {
    Recognizer.apply(this, arguments);
}

inherit(AttrRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof AttrRecognizer
     */
    defaults: {
        /**
         * @type {Number}
         * @default 1
         */
        pointers: 1
    },

    /**
     * Used to check if it the recognizer receives valid input, like input.distance > 10.
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {Boolean} recognized
     */
    attrTest: function(input) {
        var optionPointers = this.options.pointers;
        return optionPointers === 0 || input.pointers.length === optionPointers;
    },

    /**
     * Process the input and return the state for the recognizer
     * @memberof AttrRecognizer
     * @param {Object} input
     * @returns {*} State
     */
    process: function(input) {
        var state = this.state;
        var eventType = input.eventType;

        var isRecognized = state & (STATE_BEGAN | STATE_CHANGED);
        var isValid = this.attrTest(input);

        // on cancel input and we've recognized before, return STATE_CANCELLED
        if (isRecognized && (eventType & INPUT_CANCEL || !isValid)) {
            return state | STATE_CANCELLED;
        } else if (isRecognized || isValid) {
            if (eventType & INPUT_END) {
                return state | STATE_ENDED;
            } else if (!(state & STATE_BEGAN)) {
                return STATE_BEGAN;
            }
            return state | STATE_CHANGED;
        }
        return STATE_FAILED;
    }
});

/**
 * Pan
 * Recognized when the pointer is down and moved in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function PanRecognizer() {
    AttrRecognizer.apply(this, arguments);

    this.pX = null;
    this.pY = null;
}

inherit(PanRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PanRecognizer
     */
    defaults: {
        event: 'pan',
        threshold: 10,
        pointers: 1,
        direction: DIRECTION_ALL
    },

    getTouchAction: function() {
        var direction = this.options.direction;
        var actions = [];
        if (direction & DIRECTION_HORIZONTAL) {
            actions.push(TOUCH_ACTION_PAN_Y);
        }
        if (direction & DIRECTION_VERTICAL) {
            actions.push(TOUCH_ACTION_PAN_X);
        }
        return actions;
    },

    directionTest: function(input) {
        var options = this.options;
        var hasMoved = true;
        var distance = input.distance;
        var direction = input.direction;
        var x = input.deltaX;
        var y = input.deltaY;

        // lock to axis?
        if (!(direction & options.direction)) {
            if (options.direction & DIRECTION_HORIZONTAL) {
                direction = (x === 0) ? DIRECTION_NONE : (x < 0) ? DIRECTION_LEFT : DIRECTION_RIGHT;
                hasMoved = x != this.pX;
                distance = Math.abs(input.deltaX);
            } else {
                direction = (y === 0) ? DIRECTION_NONE : (y < 0) ? DIRECTION_UP : DIRECTION_DOWN;
                hasMoved = y != this.pY;
                distance = Math.abs(input.deltaY);
            }
        }
        input.direction = direction;
        return hasMoved && distance > options.threshold && direction & options.direction;
    },

    attrTest: function(input) {
        return AttrRecognizer.prototype.attrTest.call(this, input) &&
            (this.state & STATE_BEGAN || (!(this.state & STATE_BEGAN) && this.directionTest(input)));
    },

    emit: function(input) {

        this.pX = input.deltaX;
        this.pY = input.deltaY;

        var direction = directionStr(input.direction);

        if (direction) {
            input.additionalEvent = this.options.event + direction;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Pinch
 * Recognized when two or more pointers are moving toward (zoom-in) or away from each other (zoom-out).
 * @constructor
 * @extends AttrRecognizer
 */
function PinchRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(PinchRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'pinch',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.scale - 1) > this.options.threshold || this.state & STATE_BEGAN);
    },

    emit: function(input) {
        if (input.scale !== 1) {
            var inOut = input.scale < 1 ? 'in' : 'out';
            input.additionalEvent = this.options.event + inOut;
        }
        this._super.emit.call(this, input);
    }
});

/**
 * Press
 * Recognized when the pointer is down for x ms without any movement.
 * @constructor
 * @extends Recognizer
 */
function PressRecognizer() {
    Recognizer.apply(this, arguments);

    this._timer = null;
    this._input = null;
}

inherit(PressRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PressRecognizer
     */
    defaults: {
        event: 'press',
        pointers: 1,
        time: 251, // minimal time of the pointer to be pressed
        threshold: 9 // a minimal movement is ok, but keep it low
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_AUTO];
    },

    process: function(input) {
        var options = this.options;
        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTime = input.deltaTime > options.time;

        this._input = input;

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (!validMovement || !validPointers || (input.eventType & (INPUT_END | INPUT_CANCEL) && !validTime)) {
            this.reset();
        } else if (input.eventType & INPUT_START) {
            this.reset();
            this._timer = setTimeoutContext(function() {
                this.state = STATE_RECOGNIZED;
                this.tryEmit();
            }, options.time, this);
        } else if (input.eventType & INPUT_END) {
            return STATE_RECOGNIZED;
        }
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function(input) {
        if (this.state !== STATE_RECOGNIZED) {
            return;
        }

        if (input && (input.eventType & INPUT_END)) {
            this.manager.emit(this.options.event + 'up', input);
        } else {
            this._input.timeStamp = now();
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Rotate
 * Recognized when two or more pointer are moving in a circular motion.
 * @constructor
 * @extends AttrRecognizer
 */
function RotateRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(RotateRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof RotateRecognizer
     */
    defaults: {
        event: 'rotate',
        threshold: 0,
        pointers: 2
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_NONE];
    },

    attrTest: function(input) {
        return this._super.attrTest.call(this, input) &&
            (Math.abs(input.rotation) > this.options.threshold || this.state & STATE_BEGAN);
    }
});

/**
 * Swipe
 * Recognized when the pointer is moving fast (velocity), with enough distance in the allowed direction.
 * @constructor
 * @extends AttrRecognizer
 */
function SwipeRecognizer() {
    AttrRecognizer.apply(this, arguments);
}

inherit(SwipeRecognizer, AttrRecognizer, {
    /**
     * @namespace
     * @memberof SwipeRecognizer
     */
    defaults: {
        event: 'swipe',
        threshold: 10,
        velocity: 0.3,
        direction: DIRECTION_HORIZONTAL | DIRECTION_VERTICAL,
        pointers: 1
    },

    getTouchAction: function() {
        return PanRecognizer.prototype.getTouchAction.call(this);
    },

    attrTest: function(input) {
        var direction = this.options.direction;
        var velocity;

        if (direction & (DIRECTION_HORIZONTAL | DIRECTION_VERTICAL)) {
            velocity = input.overallVelocity;
        } else if (direction & DIRECTION_HORIZONTAL) {
            velocity = input.overallVelocityX;
        } else if (direction & DIRECTION_VERTICAL) {
            velocity = input.overallVelocityY;
        }

        return this._super.attrTest.call(this, input) &&
            direction & input.offsetDirection &&
            input.distance > this.options.threshold &&
            input.maxPointers == this.options.pointers &&
            abs(velocity) > this.options.velocity && input.eventType & INPUT_END;
    },

    emit: function(input) {
        var direction = directionStr(input.offsetDirection);
        if (direction) {
            this.manager.emit(this.options.event + direction, input);
        }

        this.manager.emit(this.options.event, input);
    }
});

/**
 * A tap is ecognized when the pointer is doing a small tap/click. Multiple taps are recognized if they occur
 * between the given interval and position. The delay option can be used to recognize multi-taps without firing
 * a single tap.
 *
 * The eventData from the emitted event contains the property `tapCount`, which contains the amount of
 * multi-taps being recognized.
 * @constructor
 * @extends Recognizer
 */
function TapRecognizer() {
    Recognizer.apply(this, arguments);

    // previous time and center,
    // used for tap counting
    this.pTime = false;
    this.pCenter = false;

    this._timer = null;
    this._input = null;
    this.count = 0;
}

inherit(TapRecognizer, Recognizer, {
    /**
     * @namespace
     * @memberof PinchRecognizer
     */
    defaults: {
        event: 'tap',
        pointers: 1,
        taps: 1,
        interval: 300, // max time between the multi-tap taps
        time: 250, // max time of the pointer to be down (like finger on the screen)
        threshold: 9, // a minimal movement is ok, but keep it low
        posThreshold: 10 // a multi-tap can be a bit off the initial position
    },

    getTouchAction: function() {
        return [TOUCH_ACTION_MANIPULATION];
    },

    process: function(input) {
        var options = this.options;

        var validPointers = input.pointers.length === options.pointers;
        var validMovement = input.distance < options.threshold;
        var validTouchTime = input.deltaTime < options.time;

        this.reset();

        if ((input.eventType & INPUT_START) && (this.count === 0)) {
            return this.failTimeout();
        }

        // we only allow little movement
        // and we've reached an end event, so a tap is possible
        if (validMovement && validTouchTime && validPointers) {
            if (input.eventType != INPUT_END) {
                return this.failTimeout();
            }

            var validInterval = this.pTime ? (input.timeStamp - this.pTime < options.interval) : true;
            var validMultiTap = !this.pCenter || getDistance(this.pCenter, input.center) < options.posThreshold;

            this.pTime = input.timeStamp;
            this.pCenter = input.center;

            if (!validMultiTap || !validInterval) {
                this.count = 1;
            } else {
                this.count += 1;
            }

            this._input = input;

            // if tap count matches we have recognized it,
            // else it has began recognizing...
            var tapCount = this.count % options.taps;
            if (tapCount === 0) {
                // no failing requirements, immediately trigger the tap event
                // or wait as long as the multitap interval to trigger
                if (!this.hasRequireFailures()) {
                    return STATE_RECOGNIZED;
                } else {
                    this._timer = setTimeoutContext(function() {
                        this.state = STATE_RECOGNIZED;
                        this.tryEmit();
                    }, options.interval, this);
                    return STATE_BEGAN;
                }
            }
        }
        return STATE_FAILED;
    },

    failTimeout: function() {
        this._timer = setTimeoutContext(function() {
            this.state = STATE_FAILED;
        }, this.options.interval, this);
        return STATE_FAILED;
    },

    reset: function() {
        clearTimeout(this._timer);
    },

    emit: function() {
        if (this.state == STATE_RECOGNIZED) {
            this._input.tapCount = this.count;
            this.manager.emit(this.options.event, this._input);
        }
    }
});

/**
 * Simple way to create a manager with a default set of recognizers.
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Hammer(element, options) {
    options = options || {};
    options.recognizers = ifUndefined(options.recognizers, Hammer.defaults.preset);
    return new Manager(element, options);
}

/**
 * @const {string}
 */
Hammer.VERSION = '2.0.7';

/**
 * default settings
 * @namespace
 */
Hammer.defaults = {
    /**
     * set if DOM events are being triggered.
     * But this is slower and unused by simple implementations, so disabled by default.
     * @type {Boolean}
     * @default false
     */
    domEvents: false,

    /**
     * The value for the touchAction property/fallback.
     * When set to `compute` it will magically set the correct value based on the added recognizers.
     * @type {String}
     * @default compute
     */
    touchAction: TOUCH_ACTION_COMPUTE,

    /**
     * @type {Boolean}
     * @default true
     */
    enable: true,

    /**
     * EXPERIMENTAL FEATURE -- can be removed/changed
     * Change the parent input target element.
     * If Null, then it is being set the to main element.
     * @type {Null|EventTarget}
     * @default null
     */
    inputTarget: null,

    /**
     * force an input class
     * @type {Null|Function}
     * @default null
     */
    inputClass: null,

    /**
     * Default recognizer setup when calling `Hammer()`
     * When creating a new Manager these will be skipped.
     * @type {Array}
     */
    preset: [
        // RecognizerClass, options, [recognizeWith, ...], [requireFailure, ...]
        [RotateRecognizer, {enable: false}],
        [PinchRecognizer, {enable: false}, ['rotate']],
        [SwipeRecognizer, {direction: DIRECTION_HORIZONTAL}],
        [PanRecognizer, {direction: DIRECTION_HORIZONTAL}, ['swipe']],
        [TapRecognizer],
        [TapRecognizer, {event: 'doubletap', taps: 2}, ['tap']],
        [PressRecognizer]
    ],

    /**
     * Some CSS properties can be used to improve the working of Hammer.
     * Add them to this method and they will be set when creating a new Manager.
     * @namespace
     */
    cssProps: {
        /**
         * Disables text selection to improve the dragging gesture. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userSelect: 'none',

        /**
         * Disable the Windows Phone grippers when pressing an element.
         * @type {String}
         * @default 'none'
         */
        touchSelect: 'none',

        /**
         * Disables the default callout shown when you touch and hold a touch target.
         * On iOS, when you touch and hold a touch target such as a link, Safari displays
         * a callout containing information about the link. This property allows you to disable that callout.
         * @type {String}
         * @default 'none'
         */
        touchCallout: 'none',

        /**
         * Specifies whether zooming is enabled. Used by IE10>
         * @type {String}
         * @default 'none'
         */
        contentZooming: 'none',

        /**
         * Specifies that an entire element should be draggable instead of its contents. Mainly for desktop browsers.
         * @type {String}
         * @default 'none'
         */
        userDrag: 'none',

        /**
         * Overrides the highlight color shown when the user taps a link or a JavaScript
         * clickable element in iOS. This property obeys the alpha value, if specified.
         * @type {String}
         * @default 'rgba(0,0,0,0)'
         */
        tapHighlightColor: 'rgba(0,0,0,0)'
    }
};

var STOP = 1;
var FORCED_STOP = 2;

/**
 * Manager
 * @param {HTMLElement} element
 * @param {Object} [options]
 * @constructor
 */
function Manager(element, options) {
    this.options = assign({}, Hammer.defaults, options || {});

    this.options.inputTarget = this.options.inputTarget || element;

    this.handlers = {};
    this.session = {};
    this.recognizers = [];
    this.oldCssProps = {};

    this.element = element;
    this.input = createInputInstance(this);
    this.touchAction = new TouchAction(this, this.options.touchAction);

    toggleCssProps(this, true);

    each(this.options.recognizers, function(item) {
        var recognizer = this.add(new (item[0])(item[1]));
        item[2] && recognizer.recognizeWith(item[2]);
        item[3] && recognizer.requireFailure(item[3]);
    }, this);
}

Manager.prototype = {
    /**
     * set options
     * @param {Object} options
     * @returns {Manager}
     */
    set: function(options) {
        assign(this.options, options);

        // Options that need a little more setup
        if (options.touchAction) {
            this.touchAction.update();
        }
        if (options.inputTarget) {
            // Clean up existing event listeners and reinitialize
            this.input.destroy();
            this.input.target = options.inputTarget;
            this.input.init();
        }
        return this;
    },

    /**
     * stop recognizing for this session.
     * This session will be discarded, when a new [input]start event is fired.
     * When forced, the recognizer cycle is stopped immediately.
     * @param {Boolean} [force]
     */
    stop: function(force) {
        this.session.stopped = force ? FORCED_STOP : STOP;
    },

    /**
     * run the recognizers!
     * called by the inputHandler function on every movement of the pointers (touches)
     * it walks through all the recognizers and tries to detect the gesture that is being made
     * @param {Object} inputData
     */
    recognize: function(inputData) {
        var session = this.session;
        if (session.stopped) {
            return;
        }

        // run the touch-action polyfill
        this.touchAction.preventDefaults(inputData);

        var recognizer;
        var recognizers = this.recognizers;

        // this holds the recognizer that is being recognized.
        // so the recognizer's state needs to be BEGAN, CHANGED, ENDED or RECOGNIZED
        // if no recognizer is detecting a thing, it is set to `null`
        var curRecognizer = session.curRecognizer;

        // reset when the last recognizer is recognized
        // or when we're in a new session
        if (!curRecognizer || (curRecognizer && curRecognizer.state & STATE_RECOGNIZED)) {
            curRecognizer = session.curRecognizer = null;
        }

        var i = 0;
        while (i < recognizers.length) {
            recognizer = recognizers[i];

            // find out if we are allowed try to recognize the input for this one.
            // 1.   allow if the session is NOT forced stopped (see the .stop() method)
            // 2.   allow if we still haven't recognized a gesture in this session, or the this recognizer is the one
            //      that is being recognized.
            // 3.   allow if the recognizer is allowed to run simultaneous with the current recognized recognizer.
            //      this can be setup with the `recognizeWith()` method on the recognizer.
            if (session.stopped !== FORCED_STOP && ( // 1
                    !curRecognizer || recognizer == curRecognizer || // 2
                    recognizer.canRecognizeWith(curRecognizer))) { // 3
                recognizer.recognize(inputData);
            } else {
                recognizer.reset();
            }

            // if the recognizer has been recognizing the input as a valid gesture, we want to store this one as the
            // current active recognizer. but only if we don't already have an active recognizer
            if (!curRecognizer && recognizer.state & (STATE_BEGAN | STATE_CHANGED | STATE_ENDED)) {
                curRecognizer = session.curRecognizer = recognizer;
            }
            i++;
        }
    },

    /**
     * get a recognizer by its event name.
     * @param {Recognizer|String} recognizer
     * @returns {Recognizer|Null}
     */
    get: function(recognizer) {
        if (recognizer instanceof Recognizer) {
            return recognizer;
        }

        var recognizers = this.recognizers;
        for (var i = 0; i < recognizers.length; i++) {
            if (recognizers[i].options.event == recognizer) {
                return recognizers[i];
            }
        }
        return null;
    },

    /**
     * add a recognizer to the manager
     * existing recognizers with the same event name will be removed
     * @param {Recognizer} recognizer
     * @returns {Recognizer|Manager}
     */
    add: function(recognizer) {
        if (invokeArrayArg(recognizer, 'add', this)) {
            return this;
        }

        // remove existing
        var existing = this.get(recognizer.options.event);
        if (existing) {
            this.remove(existing);
        }

        this.recognizers.push(recognizer);
        recognizer.manager = this;

        this.touchAction.update();
        return recognizer;
    },

    /**
     * remove a recognizer by name or instance
     * @param {Recognizer|String} recognizer
     * @returns {Manager}
     */
    remove: function(recognizer) {
        if (invokeArrayArg(recognizer, 'remove', this)) {
            return this;
        }

        recognizer = this.get(recognizer);

        // let's make sure this recognizer exists
        if (recognizer) {
            var recognizers = this.recognizers;
            var index = inArray(recognizers, recognizer);

            if (index !== -1) {
                recognizers.splice(index, 1);
                this.touchAction.update();
            }
        }

        return this;
    },

    /**
     * bind event
     * @param {String} events
     * @param {Function} handler
     * @returns {EventEmitter} this
     */
    on: function(events, handler) {
        if (events === undefined) {
            return;
        }
        if (handler === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            handlers[event] = handlers[event] || [];
            handlers[event].push(handler);
        });
        return this;
    },

    /**
     * unbind event, leave emit blank to remove all handlers
     * @param {String} events
     * @param {Function} [handler]
     * @returns {EventEmitter} this
     */
    off: function(events, handler) {
        if (events === undefined) {
            return;
        }

        var handlers = this.handlers;
        each(splitStr(events), function(event) {
            if (!handler) {
                delete handlers[event];
            } else {
                handlers[event] && handlers[event].splice(inArray(handlers[event], handler), 1);
            }
        });
        return this;
    },

    /**
     * emit event to the listeners
     * @param {String} event
     * @param {Object} data
     */
    emit: function(event, data) {
        // we also want to trigger dom events
        if (this.options.domEvents) {
            triggerDomEvent(event, data);
        }

        // no handlers, so skip it all
        var handlers = this.handlers[event] && this.handlers[event].slice();
        if (!handlers || !handlers.length) {
            return;
        }

        data.type = event;
        data.preventDefault = function() {
            data.srcEvent.preventDefault();
        };

        var i = 0;
        while (i < handlers.length) {
            handlers[i](data);
            i++;
        }
    },

    /**
     * destroy the manager and unbinds all events
     * it doesn't unbind dom events, that is the user own responsibility
     */
    destroy: function() {
        this.element && toggleCssProps(this, false);

        this.handlers = {};
        this.session = {};
        this.input.destroy();
        this.element = null;
    }
};

/**
 * add/remove the css properties as defined in manager.options.cssProps
 * @param {Manager} manager
 * @param {Boolean} add
 */
function toggleCssProps(manager, add) {
    var element = manager.element;
    if (!element.style) {
        return;
    }
    var prop;
    each(manager.options.cssProps, function(value, name) {
        prop = prefixed(element.style, name);
        if (add) {
            manager.oldCssProps[prop] = element.style[prop];
            element.style[prop] = value;
        } else {
            element.style[prop] = manager.oldCssProps[prop] || '';
        }
    });
    if (!add) {
        manager.oldCssProps = {};
    }
}

/**
 * trigger dom event
 * @param {String} event
 * @param {Object} data
 */
function triggerDomEvent(event, data) {
    var gestureEvent = document.createEvent('Event');
    gestureEvent.initEvent(event, true, true);
    gestureEvent.gesture = data;
    data.target.dispatchEvent(gestureEvent);
}

assign(Hammer, {
    INPUT_START: INPUT_START,
    INPUT_MOVE: INPUT_MOVE,
    INPUT_END: INPUT_END,
    INPUT_CANCEL: INPUT_CANCEL,

    STATE_POSSIBLE: STATE_POSSIBLE,
    STATE_BEGAN: STATE_BEGAN,
    STATE_CHANGED: STATE_CHANGED,
    STATE_ENDED: STATE_ENDED,
    STATE_RECOGNIZED: STATE_RECOGNIZED,
    STATE_CANCELLED: STATE_CANCELLED,
    STATE_FAILED: STATE_FAILED,

    DIRECTION_NONE: DIRECTION_NONE,
    DIRECTION_LEFT: DIRECTION_LEFT,
    DIRECTION_RIGHT: DIRECTION_RIGHT,
    DIRECTION_UP: DIRECTION_UP,
    DIRECTION_DOWN: DIRECTION_DOWN,
    DIRECTION_HORIZONTAL: DIRECTION_HORIZONTAL,
    DIRECTION_VERTICAL: DIRECTION_VERTICAL,
    DIRECTION_ALL: DIRECTION_ALL,

    Manager: Manager,
    Input: Input,
    TouchAction: TouchAction,

    TouchInput: TouchInput,
    MouseInput: MouseInput,
    PointerEventInput: PointerEventInput,
    TouchMouseInput: TouchMouseInput,
    SingleTouchInput: SingleTouchInput,

    Recognizer: Recognizer,
    AttrRecognizer: AttrRecognizer,
    Tap: TapRecognizer,
    Pan: PanRecognizer,
    Swipe: SwipeRecognizer,
    Pinch: PinchRecognizer,
    Rotate: RotateRecognizer,
    Press: PressRecognizer,

    on: addEventListeners,
    off: removeEventListeners,
    each: each,
    merge: merge,
    extend: extend,
    assign: assign,
    inherit: inherit,
    bindFn: bindFn,
    prefixed: prefixed
});

// this prevents errors when Hammer is loaded in the presence of an AMD
//  style loader but by script tag, not by the loader.
var freeGlobal = (typeof window !== 'undefined' ? window : (typeof self !== 'undefined' ? self : {})); // jshint ignore:line
freeGlobal.Hammer = Hammer;

if (true) {
    !(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
        return Hammer;
    }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
} else if (typeof module != 'undefined' && module.exports) {
    module.exports = Hammer;
} else {
    window[exportName] = Hammer;
}

})(window, document, 'Hammer');


/***/ },

/***/ 804:
/***/ function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * marked - a markdown parser
 * Copyright (c) 2011-2014, Christopher Jeffrey. (MIT Licensed)
 * https://github.com/chjj/marked
 */

;(function() {

/**
 * Block-Level Grammar
 */

var block = {
  newline: /^\n+/,
  code: /^( {4}[^\n]+\n*)+/,
  fences: noop,
  hr: /^( *[-*_]){3,} *(?:\n+|$)/,
  heading: /^ *(#{1,6}) *([^\n]+?) *#* *(?:\n+|$)/,
  nptable: noop,
  lheading: /^([^\n]+)\n *(=|-){2,} *(?:\n+|$)/,
  blockquote: /^( *>[^\n]+(\n(?!def)[^\n]+)*\n*)+/,
  list: /^( *)(bull) [\s\S]+?(?:hr|def|\n{2,}(?! )(?!\1bull )\n*|\s*$)/,
  html: /^ *(?:comment *(?:\n|\s*$)|closed *(?:\n{2,}|\s*$)|closing *(?:\n{2,}|\s*$))/,
  def: /^ *\[([^\]]+)\]: *<?([^\s>]+)>?(?: +["(]([^\n]+)[")])? *(?:\n+|$)/,
  table: noop,
  paragraph: /^((?:[^\n]+\n?(?!hr|heading|lheading|blockquote|tag|def))+)\n*/,
  text: /^[^\n]+/
};

block.bullet = /(?:[*+-]|\d+\.)/;
block.item = /^( *)(bull) [^\n]*(?:\n(?!\1bull )[^\n]*)*/;
block.item = replace(block.item, 'gm')
  (/bull/g, block.bullet)
  ();

block.list = replace(block.list)
  (/bull/g, block.bullet)
  ('hr', '\\n+(?=\\1?(?:[-*_] *){3,}(?:\\n+|$))')
  ('def', '\\n+(?=' + block.def.source + ')')
  ();

block.blockquote = replace(block.blockquote)
  ('def', block.def)
  ();

block._tag = '(?!(?:'
  + 'a|em|strong|small|s|cite|q|dfn|abbr|data|time|code'
  + '|var|samp|kbd|sub|sup|i|b|u|mark|ruby|rt|rp|bdi|bdo'
  + '|span|br|wbr|ins|del|img)\\b)\\w+(?!:/|[^\\w\\s@]*@)\\b';

block.html = replace(block.html)
  ('comment', /<!--[\s\S]*?-->/)
  ('closed', /<(tag)[\s\S]+?<\/\1>/)
  ('closing', /<tag(?:"[^"]*"|'[^']*'|[^'">])*?>/)
  (/tag/g, block._tag)
  ();

block.paragraph = replace(block.paragraph)
  ('hr', block.hr)
  ('heading', block.heading)
  ('lheading', block.lheading)
  ('blockquote', block.blockquote)
  ('tag', '<' + block._tag)
  ('def', block.def)
  ();

/**
 * Normal Block Grammar
 */

block.normal = merge({}, block);

/**
 * GFM Block Grammar
 */

block.gfm = merge({}, block.normal, {
  fences: /^ *(`{3,}|~{3,})[ \.]*(\S+)? *\n([\s\S]*?)\s*\1 *(?:\n+|$)/,
  paragraph: /^/,
  heading: /^ *(#{1,6}) +([^\n]+?) *#* *(?:\n+|$)/
});

block.gfm.paragraph = replace(block.paragraph)
  ('(?!', '(?!'
    + block.gfm.fences.source.replace('\\1', '\\2') + '|'
    + block.list.source.replace('\\1', '\\3') + '|')
  ();

/**
 * GFM + Tables Block Grammar
 */

block.tables = merge({}, block.gfm, {
  nptable: /^ *(\S.*\|.*)\n *([-:]+ *\|[-| :]*)\n((?:.*\|.*(?:\n|$))*)\n*/,
  table: /^ *\|(.+)\n *\|( *[-:]+[-| :]*)\n((?: *\|.*(?:\n|$))*)\n*/
});

/**
 * Block Lexer
 */

function Lexer(options) {
  this.tokens = [];
  this.tokens.links = {};
  this.options = options || marked.defaults;
  this.rules = block.normal;

  if (this.options.gfm) {
    if (this.options.tables) {
      this.rules = block.tables;
    } else {
      this.rules = block.gfm;
    }
  }
}

/**
 * Expose Block Rules
 */

Lexer.rules = block;

/**
 * Static Lex Method
 */

Lexer.lex = function(src, options) {
  var lexer = new Lexer(options);
  return lexer.lex(src);
};

/**
 * Preprocessing
 */

Lexer.prototype.lex = function(src) {
  src = src
    .replace(/\r\n|\r/g, '\n')
    .replace(/\t/g, '    ')
    .replace(/\u00a0/g, ' ')
    .replace(/\u2424/g, '\n');

  return this.token(src, true);
};

/**
 * Lexing
 */

Lexer.prototype.token = function(src, top, bq) {
  var src = src.replace(/^ +$/gm, '')
    , next
    , loose
    , cap
    , bull
    , b
    , item
    , space
    , i
    , l;

  while (src) {
    // newline
    if (cap = this.rules.newline.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[0].length > 1) {
        this.tokens.push({
          type: 'space'
        });
      }
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      cap = cap[0].replace(/^ {4}/gm, '');
      this.tokens.push({
        type: 'code',
        text: !this.options.pedantic
          ? cap.replace(/\n+$/, '')
          : cap
      });
      continue;
    }

    // fences (gfm)
    if (cap = this.rules.fences.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'code',
        lang: cap[2],
        text: cap[3] || ''
      });
      continue;
    }

    // heading
    if (cap = this.rules.heading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[1].length,
        text: cap[2]
      });
      continue;
    }

    // table no leading pipe (gfm)
    if (top && (cap = this.rules.nptable.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i].split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // lheading
    if (cap = this.rules.lheading.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'heading',
        depth: cap[2] === '=' ? 1 : 2,
        text: cap[1]
      });
      continue;
    }

    // hr
    if (cap = this.rules.hr.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'hr'
      });
      continue;
    }

    // blockquote
    if (cap = this.rules.blockquote.exec(src)) {
      src = src.substring(cap[0].length);

      this.tokens.push({
        type: 'blockquote_start'
      });

      cap = cap[0].replace(/^ *> ?/gm, '');

      // Pass `top` to keep the current
      // "toplevel" state. This is exactly
      // how markdown.pl works.
      this.token(cap, top, true);

      this.tokens.push({
        type: 'blockquote_end'
      });

      continue;
    }

    // list
    if (cap = this.rules.list.exec(src)) {
      src = src.substring(cap[0].length);
      bull = cap[2];

      this.tokens.push({
        type: 'list_start',
        ordered: bull.length > 1
      });

      // Get each top-level item.
      cap = cap[0].match(this.rules.item);

      next = false;
      l = cap.length;
      i = 0;

      for (; i < l; i++) {
        item = cap[i];

        // Remove the list item's bullet
        // so it is seen as the next token.
        space = item.length;
        item = item.replace(/^ *([*+-]|\d+\.) +/, '');

        // Outdent whatever the
        // list item contains. Hacky.
        if (~item.indexOf('\n ')) {
          space -= item.length;
          item = !this.options.pedantic
            ? item.replace(new RegExp('^ {1,' + space + '}', 'gm'), '')
            : item.replace(/^ {1,4}/gm, '');
        }

        // Determine whether the next list item belongs here.
        // Backpedal if it does not belong in this list.
        if (this.options.smartLists && i !== l - 1) {
          b = block.bullet.exec(cap[i + 1])[0];
          if (bull !== b && !(bull.length > 1 && b.length > 1)) {
            src = cap.slice(i + 1).join('\n') + src;
            i = l - 1;
          }
        }

        // Determine whether item is loose or not.
        // Use: /(^|\n)(?! )[^\n]+\n\n(?!\s*$)/
        // for discount behavior.
        loose = next || /\n\n(?!\s*$)/.test(item);
        if (i !== l - 1) {
          next = item.charAt(item.length - 1) === '\n';
          if (!loose) loose = next;
        }

        this.tokens.push({
          type: loose
            ? 'loose_item_start'
            : 'list_item_start'
        });

        // Recurse.
        this.token(item, false, bq);

        this.tokens.push({
          type: 'list_item_end'
        });
      }

      this.tokens.push({
        type: 'list_end'
      });

      continue;
    }

    // html
    if (cap = this.rules.html.exec(src)) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: this.options.sanitize
          ? 'paragraph'
          : 'html',
        pre: !this.options.sanitizer
          && (cap[1] === 'pre' || cap[1] === 'script' || cap[1] === 'style'),
        text: cap[0]
      });
      continue;
    }

    // def
    if ((!bq && top) && (cap = this.rules.def.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.links[cap[1].toLowerCase()] = {
        href: cap[2],
        title: cap[3]
      };
      continue;
    }

    // table (gfm)
    if (top && (cap = this.rules.table.exec(src))) {
      src = src.substring(cap[0].length);

      item = {
        type: 'table',
        header: cap[1].replace(/^ *| *\| *$/g, '').split(/ *\| */),
        align: cap[2].replace(/^ *|\| *$/g, '').split(/ *\| */),
        cells: cap[3].replace(/(?: *\| *)?\n$/, '').split('\n')
      };

      for (i = 0; i < item.align.length; i++) {
        if (/^ *-+: *$/.test(item.align[i])) {
          item.align[i] = 'right';
        } else if (/^ *:-+: *$/.test(item.align[i])) {
          item.align[i] = 'center';
        } else if (/^ *:-+ *$/.test(item.align[i])) {
          item.align[i] = 'left';
        } else {
          item.align[i] = null;
        }
      }

      for (i = 0; i < item.cells.length; i++) {
        item.cells[i] = item.cells[i]
          .replace(/^ *\| *| *\| *$/g, '')
          .split(/ *\| */);
      }

      this.tokens.push(item);

      continue;
    }

    // top-level paragraph
    if (top && (cap = this.rules.paragraph.exec(src))) {
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'paragraph',
        text: cap[1].charAt(cap[1].length - 1) === '\n'
          ? cap[1].slice(0, -1)
          : cap[1]
      });
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      // Top-level should never reach here.
      src = src.substring(cap[0].length);
      this.tokens.push({
        type: 'text',
        text: cap[0]
      });
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return this.tokens;
};

/**
 * Inline-Level Grammar
 */

var inline = {
  escape: /^\\([\\`*{}\[\]()#+\-.!_>])/,
  autolink: /^<([^ >]+(@|:\/)[^ >]+)>/,
  url: noop,
  tag: /^<!--[\s\S]*?-->|^<\/?\w+(?:"[^"]*"|'[^']*'|[^'">])*?>/,
  link: /^!?\[(inside)\]\(href\)/,
  reflink: /^!?\[(inside)\]\s*\[([^\]]*)\]/,
  nolink: /^!?\[((?:\[[^\]]*\]|[^\[\]])*)\]/,
  strong: /^__([\s\S]+?)__(?!_)|^\*\*([\s\S]+?)\*\*(?!\*)/,
  em: /^\b_((?:[^_]|__)+?)_\b|^\*((?:\*\*|[\s\S])+?)\*(?!\*)/,
  code: /^(`+)\s*([\s\S]*?[^`])\s*\1(?!`)/,
  br: /^ {2,}\n(?!\s*$)/,
  del: noop,
  text: /^[\s\S]+?(?=[\\<!\[_*`]| {2,}\n|$)/
};

inline._inside = /(?:\[[^\]]*\]|[^\[\]]|\](?=[^\[]*\]))*/;
inline._href = /\s*<?([\s\S]*?)>?(?:\s+['"]([\s\S]*?)['"])?\s*/;

inline.link = replace(inline.link)
  ('inside', inline._inside)
  ('href', inline._href)
  ();

inline.reflink = replace(inline.reflink)
  ('inside', inline._inside)
  ();

/**
 * Normal Inline Grammar
 */

inline.normal = merge({}, inline);

/**
 * Pedantic Inline Grammar
 */

inline.pedantic = merge({}, inline.normal, {
  strong: /^__(?=\S)([\s\S]*?\S)__(?!_)|^\*\*(?=\S)([\s\S]*?\S)\*\*(?!\*)/,
  em: /^_(?=\S)([\s\S]*?\S)_(?!_)|^\*(?=\S)([\s\S]*?\S)\*(?!\*)/
});

/**
 * GFM Inline Grammar
 */

inline.gfm = merge({}, inline.normal, {
  escape: replace(inline.escape)('])', '~|])')(),
  url: /^(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/,
  del: /^~~(?=\S)([\s\S]*?\S)~~/,
  text: replace(inline.text)
    (']|', '~]|')
    ('|', '|https?://|')
    ()
});

/**
 * GFM + Line Breaks Inline Grammar
 */

inline.breaks = merge({}, inline.gfm, {
  br: replace(inline.br)('{2,}', '*')(),
  text: replace(inline.gfm.text)('{2,}', '*')()
});

/**
 * Inline Lexer & Compiler
 */

function InlineLexer(links, options) {
  this.options = options || marked.defaults;
  this.links = links;
  this.rules = inline.normal;
  this.renderer = this.options.renderer || new Renderer;
  this.renderer.options = this.options;

  if (!this.links) {
    throw new
      Error('Tokens array requires a `links` property.');
  }

  if (this.options.gfm) {
    if (this.options.breaks) {
      this.rules = inline.breaks;
    } else {
      this.rules = inline.gfm;
    }
  } else if (this.options.pedantic) {
    this.rules = inline.pedantic;
  }
}

/**
 * Expose Inline Rules
 */

InlineLexer.rules = inline;

/**
 * Static Lexing/Compiling Method
 */

InlineLexer.output = function(src, links, options) {
  var inline = new InlineLexer(links, options);
  return inline.output(src);
};

/**
 * Lexing/Compiling
 */

InlineLexer.prototype.output = function(src) {
  var out = ''
    , link
    , text
    , href
    , cap;

  while (src) {
    // escape
    if (cap = this.rules.escape.exec(src)) {
      src = src.substring(cap[0].length);
      out += cap[1];
      continue;
    }

    // autolink
    if (cap = this.rules.autolink.exec(src)) {
      src = src.substring(cap[0].length);
      if (cap[2] === '@') {
        text = cap[1].charAt(6) === ':'
          ? this.mangle(cap[1].substring(7))
          : this.mangle(cap[1]);
        href = this.mangle('mailto:') + text;
      } else {
        text = escape(cap[1]);
        href = text;
      }
      out += this.renderer.link(href, null, text);
      continue;
    }

    // url (gfm)
    if (!this.inLink && (cap = this.rules.url.exec(src))) {
      src = src.substring(cap[0].length);
      text = escape(cap[1]);
      href = text;
      out += this.renderer.link(href, null, text);
      continue;
    }

    // tag
    if (cap = this.rules.tag.exec(src)) {
      if (!this.inLink && /^<a /i.test(cap[0])) {
        this.inLink = true;
      } else if (this.inLink && /^<\/a>/i.test(cap[0])) {
        this.inLink = false;
      }
      src = src.substring(cap[0].length);
      out += this.options.sanitize
        ? this.options.sanitizer
          ? this.options.sanitizer(cap[0])
          : escape(cap[0])
        : cap[0]
      continue;
    }

    // link
    if (cap = this.rules.link.exec(src)) {
      src = src.substring(cap[0].length);
      this.inLink = true;
      out += this.outputLink(cap, {
        href: cap[2],
        title: cap[3]
      });
      this.inLink = false;
      continue;
    }

    // reflink, nolink
    if ((cap = this.rules.reflink.exec(src))
        || (cap = this.rules.nolink.exec(src))) {
      src = src.substring(cap[0].length);
      link = (cap[2] || cap[1]).replace(/\s+/g, ' ');
      link = this.links[link.toLowerCase()];
      if (!link || !link.href) {
        out += cap[0].charAt(0);
        src = cap[0].substring(1) + src;
        continue;
      }
      this.inLink = true;
      out += this.outputLink(cap, link);
      this.inLink = false;
      continue;
    }

    // strong
    if (cap = this.rules.strong.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.strong(this.output(cap[2] || cap[1]));
      continue;
    }

    // em
    if (cap = this.rules.em.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.em(this.output(cap[2] || cap[1]));
      continue;
    }

    // code
    if (cap = this.rules.code.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.codespan(escape(cap[2], true));
      continue;
    }

    // br
    if (cap = this.rules.br.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.br();
      continue;
    }

    // del (gfm)
    if (cap = this.rules.del.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.del(this.output(cap[1]));
      continue;
    }

    // text
    if (cap = this.rules.text.exec(src)) {
      src = src.substring(cap[0].length);
      out += this.renderer.text(escape(this.smartypants(cap[0])));
      continue;
    }

    if (src) {
      throw new
        Error('Infinite loop on byte: ' + src.charCodeAt(0));
    }
  }

  return out;
};

/**
 * Compile Link
 */

InlineLexer.prototype.outputLink = function(cap, link) {
  var href = escape(link.href)
    , title = link.title ? escape(link.title) : null;

  return cap[0].charAt(0) !== '!'
    ? this.renderer.link(href, title, this.output(cap[1]))
    : this.renderer.image(href, title, escape(cap[1]));
};

/**
 * Smartypants Transformations
 */

InlineLexer.prototype.smartypants = function(text) {
  if (!this.options.smartypants) return text;
  return text
    // em-dashes
    .replace(/---/g, '\u2014')
    // en-dashes
    .replace(/--/g, '\u2013')
    // opening singles
    .replace(/(^|[-\u2014/(\[{"\s])'/g, '$1\u2018')
    // closing singles & apostrophes
    .replace(/'/g, '\u2019')
    // opening doubles
    .replace(/(^|[-\u2014/(\[{\u2018\s])"/g, '$1\u201c')
    // closing doubles
    .replace(/"/g, '\u201d')
    // ellipses
    .replace(/\.{3}/g, '\u2026');
};

/**
 * Mangle Links
 */

InlineLexer.prototype.mangle = function(text) {
  if (!this.options.mangle) return text;
  var out = ''
    , l = text.length
    , i = 0
    , ch;

  for (; i < l; i++) {
    ch = text.charCodeAt(i);
    if (Math.random() > 0.5) {
      ch = 'x' + ch.toString(16);
    }
    out += '&#' + ch + ';';
  }

  return out;
};

/**
 * Renderer
 */

function Renderer(options) {
  this.options = options || {};
}

Renderer.prototype.code = function(code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  if (!lang) {
    return '<pre><code>'
      + (escaped ? code : escape(code, true))
      + '\n</code></pre>';
  }

  return '<pre><code class="'
    + this.options.langPrefix
    + escape(lang, true)
    + '">'
    + (escaped ? code : escape(code, true))
    + '\n</code></pre>\n';
};

Renderer.prototype.blockquote = function(quote) {
  return '<blockquote>\n' + quote + '</blockquote>\n';
};

Renderer.prototype.html = function(html) {
  return html;
};

Renderer.prototype.heading = function(text, level, raw) {
  return '<h'
    + level
    + ' id="'
    + this.options.headerPrefix
    + raw.toLowerCase().replace(/[^\w]+/g, '-')
    + '">'
    + text
    + '</h'
    + level
    + '>\n';
};

Renderer.prototype.hr = function() {
  return this.options.xhtml ? '<hr/>\n' : '<hr>\n';
};

Renderer.prototype.list = function(body, ordered) {
  var type = ordered ? 'ol' : 'ul';
  return '<' + type + '>\n' + body + '</' + type + '>\n';
};

Renderer.prototype.listitem = function(text) {
  return '<li>' + text + '</li>\n';
};

Renderer.prototype.paragraph = function(text) {
  return '<p>' + text + '</p>\n';
};

Renderer.prototype.table = function(header, body) {
  return '<table>\n'
    + '<thead>\n'
    + header
    + '</thead>\n'
    + '<tbody>\n'
    + body
    + '</tbody>\n'
    + '</table>\n';
};

Renderer.prototype.tablerow = function(content) {
  return '<tr>\n' + content + '</tr>\n';
};

Renderer.prototype.tablecell = function(content, flags) {
  var type = flags.header ? 'th' : 'td';
  var tag = flags.align
    ? '<' + type + ' style="text-align:' + flags.align + '">'
    : '<' + type + '>';
  return tag + content + '</' + type + '>\n';
};

// span level renderer
Renderer.prototype.strong = function(text) {
  return '<strong>' + text + '</strong>';
};

Renderer.prototype.em = function(text) {
  return '<em>' + text + '</em>';
};

Renderer.prototype.codespan = function(text) {
  return '<code>' + text + '</code>';
};

Renderer.prototype.br = function() {
  return this.options.xhtml ? '<br/>' : '<br>';
};

Renderer.prototype.del = function(text) {
  return '<del>' + text + '</del>';
};

Renderer.prototype.link = function(href, title, text) {
  if (this.options.sanitize) {
    try {
      var prot = decodeURIComponent(unescape(href))
        .replace(/[^\w:]/g, '')
        .toLowerCase();
    } catch (e) {
      return '';
    }
    if (prot.indexOf('javascript:') === 0 || prot.indexOf('vbscript:') === 0) {
      return '';
    }
  }
  var out = '<a href="' + href + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += '>' + text + '</a>';
  return out;
};

Renderer.prototype.image = function(href, title, text) {
  var out = '<img src="' + href + '" alt="' + text + '"';
  if (title) {
    out += ' title="' + title + '"';
  }
  out += this.options.xhtml ? '/>' : '>';
  return out;
};

Renderer.prototype.text = function(text) {
  return text;
};

/**
 * Parsing & Compiling
 */

function Parser(options) {
  this.tokens = [];
  this.token = null;
  this.options = options || marked.defaults;
  this.options.renderer = this.options.renderer || new Renderer;
  this.renderer = this.options.renderer;
  this.renderer.options = this.options;
}

/**
 * Static Parse Method
 */

Parser.parse = function(src, options, renderer) {
  var parser = new Parser(options, renderer);
  return parser.parse(src);
};

/**
 * Parse Loop
 */

Parser.prototype.parse = function(src) {
  this.inline = new InlineLexer(src.links, this.options, this.renderer);
  this.tokens = src.reverse();

  var out = '';
  while (this.next()) {
    out += this.tok();
  }

  return out;
};

/**
 * Next Token
 */

Parser.prototype.next = function() {
  return this.token = this.tokens.pop();
};

/**
 * Preview Next Token
 */

Parser.prototype.peek = function() {
  return this.tokens[this.tokens.length - 1] || 0;
};

/**
 * Parse Text Tokens
 */

Parser.prototype.parseText = function() {
  var body = this.token.text;

  while (this.peek().type === 'text') {
    body += '\n' + this.next().text;
  }

  return this.inline.output(body);
};

/**
 * Parse Current Token
 */

Parser.prototype.tok = function() {
  switch (this.token.type) {
    case 'space': {
      return '';
    }
    case 'hr': {
      return this.renderer.hr();
    }
    case 'heading': {
      return this.renderer.heading(
        this.inline.output(this.token.text),
        this.token.depth,
        this.token.text);
    }
    case 'code': {
      return this.renderer.code(this.token.text,
        this.token.lang,
        this.token.escaped);
    }
    case 'table': {
      var header = ''
        , body = ''
        , i
        , row
        , cell
        , flags
        , j;

      // header
      cell = '';
      for (i = 0; i < this.token.header.length; i++) {
        flags = { header: true, align: this.token.align[i] };
        cell += this.renderer.tablecell(
          this.inline.output(this.token.header[i]),
          { header: true, align: this.token.align[i] }
        );
      }
      header += this.renderer.tablerow(cell);

      for (i = 0; i < this.token.cells.length; i++) {
        row = this.token.cells[i];

        cell = '';
        for (j = 0; j < row.length; j++) {
          cell += this.renderer.tablecell(
            this.inline.output(row[j]),
            { header: false, align: this.token.align[j] }
          );
        }

        body += this.renderer.tablerow(cell);
      }
      return this.renderer.table(header, body);
    }
    case 'blockquote_start': {
      var body = '';

      while (this.next().type !== 'blockquote_end') {
        body += this.tok();
      }

      return this.renderer.blockquote(body);
    }
    case 'list_start': {
      var body = ''
        , ordered = this.token.ordered;

      while (this.next().type !== 'list_end') {
        body += this.tok();
      }

      return this.renderer.list(body, ordered);
    }
    case 'list_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.token.type === 'text'
          ? this.parseText()
          : this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'loose_item_start': {
      var body = '';

      while (this.next().type !== 'list_item_end') {
        body += this.tok();
      }

      return this.renderer.listitem(body);
    }
    case 'html': {
      var html = !this.token.pre && !this.options.pedantic
        ? this.inline.output(this.token.text)
        : this.token.text;
      return this.renderer.html(html);
    }
    case 'paragraph': {
      return this.renderer.paragraph(this.inline.output(this.token.text));
    }
    case 'text': {
      return this.renderer.paragraph(this.parseText());
    }
  }
};

/**
 * Helpers
 */

function escape(html, encode) {
  return html
    .replace(!encode ? /&(?!#?\w+;)/g : /&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function unescape(html) {
	// explicitly match decimal, hex, and named HTML entities 
  return html.replace(/&(#(?:\d+)|(?:#x[0-9A-Fa-f]+)|(?:\w+));?/g, function(_, n) {
    n = n.toLowerCase();
    if (n === 'colon') return ':';
    if (n.charAt(0) === '#') {
      return n.charAt(1) === 'x'
        ? String.fromCharCode(parseInt(n.substring(2), 16))
        : String.fromCharCode(+n.substring(1));
    }
    return '';
  });
}

function replace(regex, opt) {
  regex = regex.source;
  opt = opt || '';
  return function self(name, val) {
    if (!name) return new RegExp(regex, opt);
    val = val.source || val;
    val = val.replace(/(^|[^\[])\^/g, '$1');
    regex = regex.replace(name, val);
    return self;
  };
}

function noop() {}
noop.exec = noop;

function merge(obj) {
  var i = 1
    , target
    , key;

  for (; i < arguments.length; i++) {
    target = arguments[i];
    for (key in target) {
      if (Object.prototype.hasOwnProperty.call(target, key)) {
        obj[key] = target[key];
      }
    }
  }

  return obj;
}


/**
 * Marked
 */

function marked(src, opt, callback) {
  if (callback || typeof opt === 'function') {
    if (!callback) {
      callback = opt;
      opt = null;
    }

    opt = merge({}, marked.defaults, opt || {});

    var highlight = opt.highlight
      , tokens
      , pending
      , i = 0;

    try {
      tokens = Lexer.lex(src, opt)
    } catch (e) {
      return callback(e);
    }

    pending = tokens.length;

    var done = function(err) {
      if (err) {
        opt.highlight = highlight;
        return callback(err);
      }

      var out;

      try {
        out = Parser.parse(tokens, opt);
      } catch (e) {
        err = e;
      }

      opt.highlight = highlight;

      return err
        ? callback(err)
        : callback(null, out);
    };

    if (!highlight || highlight.length < 3) {
      return done();
    }

    delete opt.highlight;

    if (!pending) return done();

    for (; i < tokens.length; i++) {
      (function(token) {
        if (token.type !== 'code') {
          return --pending || done();
        }
        return highlight(token.text, token.lang, function(err, code) {
          if (err) return done(err);
          if (code == null || code === token.text) {
            return --pending || done();
          }
          token.text = code;
          token.escaped = true;
          --pending || done();
        });
      })(tokens[i]);
    }

    return;
  }
  try {
    if (opt) opt = merge({}, marked.defaults, opt);
    return Parser.parse(Lexer.lex(src, opt), opt);
  } catch (e) {
    e.message += '\nPlease report this to https://github.com/chjj/marked.';
    if ((opt || marked.defaults).silent) {
      return '<p>An error occured:</p><pre>'
        + escape(e.message + '', true)
        + '</pre>';
    }
    throw e;
  }
}

/**
 * Options
 */

marked.options =
marked.setOptions = function(opt) {
  merge(marked.defaults, opt);
  return marked;
};

marked.defaults = {
  gfm: true,
  tables: true,
  breaks: false,
  pedantic: false,
  sanitize: false,
  sanitizer: null,
  mangle: true,
  smartLists: false,
  silent: false,
  highlight: null,
  langPrefix: 'lang-',
  smartypants: false,
  headerPrefix: '',
  renderer: new Renderer,
  xhtml: false
};

/**
 * Expose
 */

marked.Parser = Parser;
marked.parser = Parser.parse;

marked.Renderer = Renderer;

marked.Lexer = Lexer;
marked.lexer = Lexer.lex;

marked.InlineLexer = InlineLexer;
marked.inlineLexer = InlineLexer.output;

marked.parse = marked;

if (true) {
  module.exports = marked;
} else if (typeof define === 'function' && define.amd) {
  define(function() { return marked; });
} else {
  this.marked = marked;
}

}).call(function() {
  return this || (typeof window !== 'undefined' ? window : global);
}());

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(51)))

/***/ },

/***/ 806:
/***/ function(module, exports) {

module.exports = "# ng-vcl\n\nA comprehensive library of components for Angular 2 with [VCL](http://vcl.github.io/) based styling.\n\n## Features\n\n- Theming/ styling through the [VCL](http://vcl.github.io/)\n- I18n baked in\n- Highly accessible HTML honoring [WAI-ARIA](https://www.w3.org/WAI/intro/aria) recommendations\n- Feature complete, we want you to be able to build standard apps using 80% ng-vcl components\n- Extensibility, it is possible to extend components to accomodate custom features\n- Straightforward APIs\n\n## Status\n\nng-vcl is in alpha and under heavy development.\nBreaking API changes might occur during alpha.\n\n## Installation\n\n```sh\nnpm install https://github.com/ng-vcl/ng-vcl.git\n```\n\n## Usage\n\n```js\n// Import the complete ng-vcl\nimport { VCLModule } from 'ng-vcl';\n// or specific components\nimport { VCLIconModule, VCLLayerModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [\n    VCLIconModule,\n    ...\n  ]\n})\nexport class AppModule { }\n```\n\n\n## Modules\n\n| Module           | Status                                       | Docs         |\n|------------------|----------------------------------------------|--------------|\n| vcl-button       |                                        Ready |  [README][1] |\n| vcl-button-group |                                        Ready |  [README][2] |\n| vcl-layer        |                                        Ready |  [README][3] |\n| vcl-icon         |                                        Ready |  [README][4] |\n\n [1]: https://github.com/ng-vcl/ng-vcl/blob/master/src/components/button/README.md\n [2]: https://github.com/ng-vcl/ng-vcl/blob/master/src/components/button-group/README.md\n [3]: https://github.com/ng-vcl/ng-vcl/blob/master/src/components/layer/README.md\n [4]: https://github.com/ng-vcl/ng-vcl/blob/master/src/components/icon/README.md\n\n\n## Demo / Docs\n\nOpen [https://ng-vcl.github.io/ng-vcl/](https://ng-vcl.github.io/ng-vcl/)\n\nOR\n\n```sh\ngit clone https://github.com/ng-vcl/ng-vcl.git\ncd ng-vcl\nnpm install\nnpm run demo\n```\nOpen [http://localhost:3000/](http://localhost:3000/) to see the demo browser.\n\n## Create docs\n\n```\nnpm run docs\n```\n"

/***/ },

/***/ 807:
/***/ function(module, exports) {

module.exports = "<div class=\"vclLayoutVertical docMain\">\n  <header class=\"vclApplicationHeader vclLayoutHorizontal vclLayoutCenter vclLayoutJustified\">\n    <div role=\"banner\">\n      <a href=\"#\" class=\"vclLayoutHorizontal vclLayoutCenter\">\n        <img class=\"vclResponsiveImage vclLogo\" role=\"presentation\" src=\"https://cdn.rawgit.com/ng-vcl/ng-vcl/master/gfx/angular_vcl.svg\">\n        <h1 class=\"vclAppName\">Angular VCL Demo Browser</h1>\n      </a>\n    </div>\n    <div><a href=\"https://github.com/ng-vcl/ng-vcl\" target=\"_blank\" title=\"to Github\">\n      <span class=\"vclIcon fa fa-github fa-3x\"></span> </a>\n    </div>\n  </header>\n  <div class=\"vclContentArea vclLayoutFlex vclLayoutHorizontal\">\n    <div class=\"vclLayoutVertical docNav\">\n      <div class=\"vclInputGroupEmb\">\n        <span class=\"vclPrepended\">\n          <vcl-icon icon=\"fa:search\"></vcl-icon>\n        </span>\n\n        <input vcl-input #searchInput (keyup)=\"search(searchInput.value)\"\n          class=\"vclNoBorder vclPrepItem vclAppItem searchInput\"\n          type=\"search\"\n          name=\"search\"\n          placeholder=\"Search Modules\"\n          autocomplete=\"off\"\n          autofocus />\n\n        <button vcl-button *ngIf=\"searchInput.value\"\n          (click)=\"searchInput.value = ''; search('')\" \n          class=\"vclButton vclTransparent vclSquare vclAppended\"\n          appIcon=\"fa:times-circle\"></button>\n      </div>\n\n      <vcl-navigation class=\"vclScrollable vclYOnHover vclLayoutFlex\"\n        [navigationItems]=\"groupedDemos\"\n        [type]=\"'vertical'\"\n        [subLevelHintIconSide]=\"'left'\"\n        [subLevelHintIconOpened]=\"'fa:angle-down'\"\n        [subLevelHintIconClosed]=\"'fa:angle-right'\"></vcl-navigation>\n    </div>\n    <div class=\"vclScrollable vclLayoutFlex docContent\">\n      <router-outlet></router-outlet>\n    </div>\n  </div>\n</div>\n"

/***/ },

/***/ 808:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'button-group.component.html'\n})\nexport class ButtonGroupComponent implements OnInit {\n\n  idx1 = 1;\n  idx2 = [0, 2];\n\n  constructor() { }\n\n  ngOnInit() { }\n\n  buttonClick(param) {\n    console.log('buttonClick, param:', param);\n  }\n\n  selectionChange1(param) {\n    console.log('selectionChange1, param:', param);\n  }\n\n  selectionChange2(param) {\n    console.log('selectionChange2, param:', param);\n  }\n}\n"

/***/ },

/***/ 809:
/***/ function(module, exports) {

module.exports = "import { Component } from '@angular/core';\n\n@Component({\n  templateUrl: 'button.component.html'\n})\nexport class ButtonComponent {\n  someAction(param) {\n    console.log('Action handler, param:', param);\n  }\n}\n"

/***/ },

/***/ 810:
/***/ function(module, exports) {

module.exports = "import { Component } from '@angular/core';\n\n@Component({\n  templateUrl: 'checkbox.component.html'\n})\nexport class CheckboxComponent {\n  isChecked = false;\n}\n"

/***/ },

/***/ 811:
/***/ function(module, exports) {

module.exports = "<h2 class=\"vclArticleHeader\"> {{title}}</h2>\n<div *ngIf=\"tabs.length>0\">\n  <vcl-tab-nav borders=true>\n    <vcl-tab *ngFor=\"let tab of tabs\">\n      <template vcl-tab-label>\n        {{tab.name}}\n      </template>\n      <template vcl-tab-content>\n        <demo-content *ngIf=\"tab.type==='component'\" [component]=\"tab.content\"></demo-content>\n        <markdown *ngIf=\"tab.type==='markdown'\" [markdown]=\"tab.content\"></markdown>\n        <div *ngIf=\"tab.type==='text'\"><pre>{{tab.content}}</pre></div>\n      </template>\n    </vcl-tab>\n  </vcl-tab-nav>\n</div>\n<div *ngIf=\"tabs.length===0\">\n  <demo-content [component]=\"component\"></demo-content>\n</div>\n"

/***/ },

/***/ 812:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'dropdown.component.html'\n})\nexport class DropdownComponent implements OnInit {\n\n  selectedItem: any;\n\n  expanded: boolean = true;\n\n  constructor() { }\n\n  ngOnInit() { }\n\n  items: any[] = [\n    { label: 'item 1' },\n    { label: 'item 2' },\n    { label: 'item 3' },\n    { label: 'item 4' },\n    { label: 'item 5' },\n    { label: 'item 6', sublabel: 'sublabel of item 6' },\n    { label: 'item 7', sublabel: 'sublabel of item 7' },\n    { label: 'item 8', sublabel: 'sublabel of item 8' },\n    { label: 'item 9' },\n    { label: 'item 10' }\n  ]\n\n  onSelect(selectedItems: any[]) {\n    console.log(selectedItems);\n    if (selectedItems && selectedItems[0]) {\n      this.selectedItem = selectedItems[0];\n    } else {\n      this.selectedItem = null;\n    }\n  }\n\n  expand() {\n    this.expanded = !this.expanded;\n  }\n}\n"

/***/ },

/***/ 813:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'form-control-label.component.html'\n})\nexport class FormControlLabelComponent implements OnInit {\n\n  checkboxChecked = false;\n  \n  constructor() { }\n\n  ngOnInit() { }\n\n}\n"

/***/ },

/***/ 814:
/***/ function(module, exports) {

module.exports = "<markdown [markdown]=\"readme\"></markdown>\n"

/***/ },

/***/ 815:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'icogram.component.html'\n})\nexport class IcogramComponent implements OnInit {\n  constructor() { }\n\n  ngOnInit() { }\n\n}\n"

/***/ },

/***/ 816:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'icon.component.html'\n})\nexport class IconComponent implements OnInit {\n  constructor() { }\n\n  ngOnInit() { }\n\n}\n"

/***/ },

/***/ 817:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'input.component.html'\n})\nexport class InputComponent implements OnInit {\n\n  constructor() { }\n\n  ngOnInit() { }\n\n}"

/***/ },

/***/ 818:
/***/ function(module, exports) {

module.exports = "import { LayerService } from './../../../src/components/layer/layer.module';\nimport { Component } from '@angular/core';\n\n@Component({\n  templateUrl: 'layer.component.html',\n})\nexport class LayerComponent {\n\n  constructor(private layerService: LayerService) {}\n\n  openLayerWithData() {\n    this.layerService.open('withData', {\n      title: 'This title is provided as an argument'\n    }).subscribe(data => {\n      // Layer sends data\n      console.log(data);\n    }, null, () => {\n      // Layer is closed\n      console.log('layer closed');\n    });\n  }\n}\n"

/***/ },

/***/ 819:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'link.component.html'\n})\nexport class LinkComponent implements OnInit {\n  constructor() { }\n\n  ngOnInit() { }\n\n  someAction(param) {\n    console.log('Action handler, param:', param);\n  }\n\n}\n"

/***/ },

/***/ 820:
/***/ function(module, exports) {

module.exports = ".markdown-body {\n  -ms-text-size-adjust: 100%;\n  -webkit-text-size-adjust: 100%;\n  line-height: 1.5;\n  color: #333;\n  font-family: -apple-system, BlinkMacSystemFont, \"Segoe UI\", Roboto, Helvetica, Arial, sans-serif, \"Apple Color Emoji\", \"Segoe UI Emoji\", \"Segoe UI Symbol\";\n  font-size: 16px;\n  line-height: 1.5;\n  word-wrap: break-word;\n}\n\n.markdown-body /deep/ .pl-c {\n  color: #969896;\n}\n\n.markdown-body /deep/ .pl-c1,\n.markdown-body /deep/ .pl-s .pl-v {\n  color: #0086b3;\n}\n\n.markdown-body /deep/ .pl-e,\n.markdown-body /deep/ .pl-en {\n  color: #795da3;\n}\n\n.markdown-body /deep/ .pl-smi,\n.markdown-body /deep/ .pl-s .pl-s1 {\n  color: #333;\n}\n\n.markdown-body /deep/ .pl-ent {\n  color: #63a35c;\n}\n\n.markdown-body /deep/ .pl-k {\n  color: #a71d5d;\n}\n\n.markdown-body /deep/ .pl-s,\n.markdown-body /deep/ .pl-pds,\n.markdown-body /deep/ .pl-s .pl-pse .pl-s1,\n.markdown-body /deep/ .pl-sr,\n.markdown-body /deep/ .pl-sr .pl-cce,\n.markdown-body /deep/ .pl-sr .pl-sre,\n.markdown-body /deep/ .pl-sr .pl-sra {\n  color: #183691;\n}\n\n.markdown-body /deep/ .pl-v {\n  color: #ed6a43;\n}\n\n.markdown-body /deep/ .pl-id {\n  color: #b52a1d;\n}\n\n.markdown-body /deep/ .pl-ii {\n  color: #f8f8f8;\n  background-color: #b52a1d;\n}\n\n.markdown-body /deep/ .pl-sr .pl-cce {\n  font-weight: bold;\n  color: #63a35c;\n}\n\n.markdown-body /deep/ .pl-ml {\n  color: #693a17;\n}\n\n.markdown-body /deep/ .pl-mh,\n.markdown-body /deep/ .pl-mh .pl-en,\n.markdown-body /deep/ .pl-ms {\n  font-weight: bold;\n  color: #1d3e81;\n}\n\n.markdown-body /deep/ .pl-mq {\n  color: #008080;\n}\n\n.markdown-body /deep/ .pl-mi {\n  font-style: italic;\n  color: #333;\n}\n\n.markdown-body /deep/ .pl-mb {\n  font-weight: bold;\n  color: #333;\n}\n\n.markdown-body /deep/ .pl-md {\n  color: #bd2c00;\n  background-color: #ffecec;\n}\n\n.markdown-body /deep/ .pl-mi1 {\n  color: #55a532;\n  background-color: #eaffea;\n}\n\n.markdown-body /deep/ .pl-mdr {\n  font-weight: bold;\n  color: #795da3;\n}\n\n.markdown-body /deep/ .pl-mo {\n  color: #1d3e81;\n}\n\n.markdown-body /deep/ .octicon {\n  display: inline-block;\n  vertical-align: text-top;\n  fill: currentColor;\n}\n\n.markdown-body /deep/ a {\n  background-color: transparent;\n  -webkit-text-decoration-skip: objects;\n}\n\n.markdown-body /deep/ a:active,\n.markdown-body /deep/ a:hover {\n  outline-width: 0;\n}\n\n.markdown-body /deep/ strong {\n  font-weight: inherit;\n}\n\n.markdown-body /deep/ strong {\n  font-weight: bolder;\n}\n\n.markdown-body /deep/ h1 {\n  font-size: 2em;\n  margin: 0.67em 0;\n}\n\n.markdown-body /deep/ img {\n  border-style: none;\n}\n\n.markdown-body /deep/ svg:not(:root) {\n  overflow: hidden;\n}\n\n.markdown-body /deep/ code,\n.markdown-body /deep/ kbd,\n.markdown-body /deep/ pre {\n  font-family: monospace, monospace;\n  font-size: 1em;\n}\n\n.markdown-body /deep/ hr {\n  box-sizing: content-box;\n  height: 0;\n  overflow: visible;\n}\n\n.markdown-body /deep/ input {\n  font: inherit;\n  margin: 0;\n}\n\n.markdown-body /deep/ input {\n  overflow: visible;\n}\n\n.markdown-body /deep/ [type=\"checkbox\"] {\n  box-sizing: border-box;\n  padding: 0;\n}\n\n.markdown-body /deep/ * {\n  box-sizing: border-box;\n}\n\n.markdown-body /deep/ input {\n  font-family: inherit;\n  font-size: inherit;\n  line-height: inherit;\n}\n\n.markdown-body /deep/ a {\n  color: #4078c0;\n  text-decoration: none;\n}\n\n.markdown-body /deep/ a:hover,\n.markdown-body /deep/ a:active {\n  text-decoration: underline;\n}\n\n.markdown-body /deep/ strong {\n  font-weight: 600;\n}\n\n.markdown-body /deep/ hr {\n  height: 0;\n  margin: 15px 0;\n  overflow: hidden;\n  background: transparent;\n  border: 0;\n  border-bottom: 1px solid #ddd;\n}\n\n.markdown-body /deep/ hr::before {\n  display: table;\n  content: \"\";\n}\n\n.markdown-body /deep/ hr::after {\n  display: table;\n  clear: both;\n  content: \"\";\n}\n\n.markdown-body /deep/ table {\n  border-spacing: 0;\n  border-collapse: collapse;\n}\n\n.markdown-body /deep/ td,\n.markdown-body /deep/ th {\n  padding: 0;\n}\n\n.markdown-body /deep/ h1,\n.markdown-body /deep/ h2,\n.markdown-body /deep/ h3,\n.markdown-body /deep/ h4,\n.markdown-body /deep/ h5,\n.markdown-body /deep/ h6 {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body /deep/ h1 {\n  font-size: 32px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ h2 {\n  font-size: 24px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ h3 {\n  font-size: 20px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ h4 {\n  font-size: 16px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ h5 {\n  font-size: 14px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ h6 {\n  font-size: 12px;\n  font-weight: 600;\n}\n\n.markdown-body /deep/ p {\n  margin-top: 0;\n  margin-bottom: 10px;\n}\n\n.markdown-body /deep/ blockquote {\n  margin: 0;\n}\n\n.markdown-body /deep/ ul,\n.markdown-body /deep/ ol {\n  padding-left: 0;\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body /deep/ ol ol,\n.markdown-body /deep/ ul ol {\n  list-style-type: lower-roman;\n}\n\n.markdown-body /deep/ ul ul ol,\n.markdown-body /deep/ ul ol ol,\n.markdown-body /deep/ ol ul ol,\n.markdown-body /deep/ ol ol ol {\n  list-style-type: lower-alpha;\n}\n\n.markdown-body /deep/ dd {\n  margin-left: 0;\n}\n\n.markdown-body /deep/ code {\n  font-family: Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  font-size: 12px;\n}\n\n.markdown-body /deep/ pre {\n  margin-top: 0;\n  margin-bottom: 0;\n  font: 12px Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n}\n\n.markdown-body /deep/ .octicon {\n  vertical-align: text-bottom;\n}\n\n.markdown-body /deep/ input {\n  -webkit-font-feature-settings: \"liga\" 0;\n  font-feature-settings: \"liga\" 0;\n}\n\n.markdown-body /deep/ .anchor {\n  float: left;\n  padding-right: 4px;\n  margin-left: -20px;\n  line-height: 1;\n}\n\n.markdown-body /deep/ .anchor:focus {\n  outline: none;\n}\n\n.markdown-body /deep/ p,\n.markdown-body /deep/ blockquote,\n.markdown-body /deep/ ul,\n.markdown-body /deep/ ol,\n.markdown-body /deep/ dl,\n.markdown-body /deep/ table,\n.markdown-body /deep/ pre {\n  margin-top: 0;\n  margin-bottom: 16px;\n}\n\n.markdown-body /deep/ hr {\n  height: 0.25em;\n  padding: 0;\n  margin: 24px 0;\n  background-color: #e7e7e7;\n  border: 0;\n}\n\n.markdown-body /deep/ blockquote {\n  padding: 0 1em;\n  color: #777;\n  border-left: 0.25em solid #ddd;\n}\n\n.markdown-body /deep/ blockquote>:first-child {\n  margin-top: 0;\n}\n\n.markdown-body /deep/ blockquote>:last-child {\n  margin-bottom: 0;\n}\n\n.markdown-body /deep/ kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font-size: 11px;\n  line-height: 10px;\n  color: #555;\n  vertical-align: middle;\n  background-color: #fcfcfc;\n  border: solid 1px #ccc;\n  border-bottom-color: #bbb;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #bbb;\n}\n\n.markdown-body /deep/ h1,\n.markdown-body /deep/ h2,\n.markdown-body /deep/ h3,\n.markdown-body /deep/ h4,\n.markdown-body /deep/ h5,\n.markdown-body /deep/ h6 {\n  margin-top: 24px;\n  margin-bottom: 16px;\n  font-weight: 600;\n  line-height: 1.25;\n}\n\n.markdown-body /deep/ h1 .octicon-link,\n.markdown-body /deep/ h2 .octicon-link,\n.markdown-body /deep/ h3 .octicon-link,\n.markdown-body /deep/ h4 .octicon-link,\n.markdown-body /deep/ h5 .octicon-link,\n.markdown-body /deep/ h6 .octicon-link {\n  color: #000;\n  vertical-align: middle;\n  visibility: hidden;\n}\n\n.markdown-body /deep/ h1:hover .anchor,\n.markdown-body /deep/ h2:hover .anchor,\n.markdown-body /deep/ h3:hover .anchor,\n.markdown-body /deep/ h4:hover .anchor,\n.markdown-body /deep/ h5:hover .anchor,\n.markdown-body /deep/ h6:hover .anchor {\n  text-decoration: none;\n}\n\n.markdown-body /deep/ h1:hover .anchor .octicon-link,\n.markdown-body /deep/ h2:hover .anchor .octicon-link,\n.markdown-body /deep/ h3:hover .anchor .octicon-link,\n.markdown-body /deep/ h4:hover .anchor .octicon-link,\n.markdown-body /deep/ h5:hover .anchor .octicon-link,\n.markdown-body /deep/ h6:hover .anchor .octicon-link {\n  visibility: visible;\n}\n\n.markdown-body /deep/ h1 {\n  padding-bottom: 0.3em;\n  font-size: 2em;\n  border-bottom: 1px solid #eee;\n}\n\n.markdown-body /deep/ h2 {\n  padding-bottom: 0.3em;\n  font-size: 1.5em;\n  border-bottom: 1px solid #eee;\n}\n\n.markdown-body /deep/ h3 {\n  font-size: 1.25em;\n}\n\n.markdown-body /deep/ h4 {\n  font-size: 1em;\n}\n\n.markdown-body /deep/ h5 {\n  font-size: 0.875em;\n}\n\n.markdown-body /deep/ h6 {\n  font-size: 0.85em;\n  color: #777;\n}\n\n.markdown-body /deep/ ul,\n.markdown-body /deep/ ol {\n  padding-left: 2em;\n}\n\n.markdown-body /deep/ ul ul,\n.markdown-body /deep/ ul ol,\n.markdown-body /deep/ ol ol,\n.markdown-body /deep/ ol ul {\n  margin-top: 0;\n  margin-bottom: 0;\n}\n\n.markdown-body /deep/ li>p {\n  margin-top: 16px;\n}\n\n.markdown-body /deep/ li+li {\n  margin-top: 0.25em;\n}\n\n.markdown-body /deep/ dl {\n  padding: 0;\n}\n\n.markdown-body /deep/ dl dt {\n  padding: 0;\n  margin-top: 16px;\n  font-size: 1em;\n  font-style: italic;\n  font-weight: bold;\n}\n\n.markdown-body /deep/ dl dd {\n  padding: 0 16px;\n  margin-bottom: 16px;\n}\n\n.markdown-body /deep/ table {\n  display: block;\n  width: 100%;\n  overflow: auto;\n}\n\n.markdown-body /deep/ table th {\n  font-weight: bold;\n}\n\n.markdown-body /deep/ table th,\n.markdown-body /deep/ table td {\n  padding: 6px 13px;\n  border: 1px solid #ddd;\n}\n\n.markdown-body /deep/ table tr {\n  background-color: #fff;\n  border-top: 1px solid #ccc;\n}\n\n.markdown-body /deep/ table tr:nth-child(2n) {\n  background-color: #f8f8f8;\n}\n\n.markdown-body /deep/ img {\n  max-width: 100%;\n  box-sizing: content-box;\n  background-color: #fff;\n}\n\n.markdown-body /deep/ code {\n  padding: 0;\n  padding-top: 0.2em;\n  padding-bottom: 0.2em;\n  margin: 0;\n  font-size: 85%;\n  background-color: rgba(0,0,0,0.04);\n  border-radius: 3px;\n}\n\n.markdown-body /deep/ code::before,\n.markdown-body /deep/ code::after {\n  letter-spacing: -0.2em;\n  content: \"\\00a0\";\n}\n\n.markdown-body /deep/ pre {\n  word-wrap: normal;\n}\n\n.markdown-body /deep/ pre>code {\n  padding: 0;\n  margin: 0;\n  font-size: 100%;\n  word-break: normal;\n  white-space: pre;\n  background: transparent;\n  border: 0;\n}\n\n.markdown-body /deep/ .highlight {\n  margin-bottom: 16px;\n}\n\n.markdown-body /deep/ .highlight pre {\n  margin-bottom: 0;\n  word-break: normal;\n}\n\n.markdown-body /deep/ .highlight pre,\n.markdown-body /deep/ pre {\n  padding: 16px;\n  overflow: auto;\n  font-size: 85%;\n  line-height: 1.45;\n  background-color: #f7f7f7;\n  border-radius: 3px;\n}\n\n.markdown-body /deep/ pre code {\n  display: inline;\n  max-width: auto;\n  padding: 0;\n  margin: 0;\n  overflow: visible;\n  line-height: inherit;\n  word-wrap: normal;\n  background-color: transparent;\n  border: 0;\n}\n\n.markdown-body /deep/ pre code::before,\n.markdown-body /deep/ pre code::after {\n  content: normal;\n}\n\n.markdown-body /deep/ .pl-0 {\n  padding-left: 0 !important;\n}\n\n.markdown-body /deep/ .pl-1 {\n  padding-left: 3px !important;\n}\n\n.markdown-body /deep/ .pl-2 {\n  padding-left: 6px !important;\n}\n\n.markdown-body /deep/ .pl-3 {\n  padding-left: 12px !important;\n}\n\n.markdown-body /deep/ .pl-4 {\n  padding-left: 24px !important;\n}\n\n.markdown-body /deep/ .pl-5 {\n  padding-left: 36px !important;\n}\n\n.markdown-body /deep/ .pl-6 {\n  padding-left: 48px !important;\n}\n\n.markdown-body /deep/ .full-commit .btn-outline:not(:disabled):hover {\n  color: #4078c0;\n  border: 1px solid #4078c0;\n}\n\n.markdown-body /deep/ kbd {\n  display: inline-block;\n  padding: 3px 5px;\n  font: 11px Consolas, \"Liberation Mono\", Menlo, Courier, monospace;\n  line-height: 10px;\n  color: #555;\n  vertical-align: middle;\n  background-color: #fcfcfc;\n  border: solid 1px #ccc;\n  border-bottom-color: #bbb;\n  border-radius: 3px;\n  box-shadow: inset 0 -1px 0 #bbb;\n}\n\n.markdown-body /deep/ :checked+.radio-label {\n  position: relative;\n  z-index: 1;\n  border-color: #4078c0;\n}\n\n.markdown-body /deep/ .task-list-item {\n  list-style-type: none;\n}\n\n.markdown-body /deep/ .task-list-item+.task-list-item {\n  margin-top: 3px;\n}\n\n.markdown-body /deep/ .task-list-item input {\n  margin: 0 0.2em 0.25em -1.6em;\n  vertical-align: middle;\n}\n\n.markdown-body /deep/ hr {\n  border-bottom-color: #eee;\n}`\n"

/***/ },

/***/ 821:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'metalist.component.html'\n})\nexport class MetalistComponent implements OnInit {\n  constructor() { }\n\n  ngOnInit() { }\n\n  items: any = [\n    { name: 'name 1' },\n    { name: 'name 2' },\n    { name: 'name 3' },\n    { name: 'name 4' },\n    { name: 'name 5' },\n  ]\n\n  metaInformation: any[] = [\n    null,\n    null,\n    { selected: true }\n  ];\n\n  select(meta: any) {\n    if (!meta.selected) {\n      meta.selected = true;\n    } else {\n      meta.selected = false;\n    }\n\n    console.log('Meta informations: ', this.metaInformation);\n  }\n}\n"

/***/ },

/***/ 822:
/***/ function(module, exports) {

module.exports = "import { Component } from '@angular/core';\n\n@Component({\n  selector: 'month-picker',\n  templateUrl: 'month-picker.component.html',\n})\nexport class MonthPickerComponent {\n\n  expanded: boolean = false;\n\n  thisYear: number = new Date().getUTCFullYear();\n\n  currentYear: number = this.thisYear;\n\n  prevYearAvailable: boolean = true;\n\n  nextYearAvailable: boolean = false;\n\n  constructor() { }\n\n  ngOnInit() { }\n\n  expandMonthPicker() {\n    this.expanded = !this.expanded;\n  }\n\n  onSelect(date: string) {\n    console.log('onSelect():', date);\n  }\n\n  onPreviousYearTap() {\n    console.log('onPreviousYearTap()');\n    console.log('this.currentYear:', this.currentYear);\n    if (this.currentYear < this.thisYear) {\n      this.nextYearAvailable = true;\n    }\n  }\n\n  onNextYearTap() {\n    console.log('onNextYearTap()');\n    console.log('this.currentYear:', this.currentYear);\n    if (this.currentYear === this.thisYear) {\n      this.nextYearAvailable = false;\n    }\n  }\n}\n\n"

/***/ },

/***/ 823:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'navigation.component.html'\n})\nexport class NavigationComponent implements OnInit {\n\n  constructor() { }\n\n  ngOnInit() { }\n\n  items = [\n    {\n      label: 'Home',\n      route: ['/navigation'],\n      active: true,\n      prepIcon: 'fa:home',\n    },\n    {\n      label: 'Products',\n      route: ['/navigation'],\n      active: true,\n      appIcon: 'fa:bicycle',\n    },\n    {\n      label: 'Pre-selected Item',\n      route: ['/navigation'],\n      selected: true,\n      active: true\n    },\n    {\n      label: 'External link',\n      href: 'https://searx.me',\n      active: true,\n    }\n  ];\n\n  items2 = [\n    {\n      label: 'Heading',\n      heading: true,\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Item',\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Item',\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Another heading',\n      heading: true,\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Item',\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Item',\n      route: ['/navigation'],\n      active: true\n    },\n    {\n      label: 'Nested navigation',\n      route: ['/navigation'],\n      active: true,\n      items: [\n        {\n          label: 'Level 2 Item',\n          route: ['/navigation'],\n          active: true\n        },\n        {\n          label: 'Level 2 Item',\n          route: ['/navigation'],\n          active: true\n        },\n        {\n          label: 'Level 2 navigation',\n          route: ['/navigation'],\n          active: true,\n          items: [\n            {\n              label: 'Level 3 Item',\n              route: ['/navigation'],\n              active: true\n            },\n            {\n              label: 'Level 3 Item',\n              route: ['/navigation'],\n              active: true\n            },\n            {\n              label: 'Level 3 Item',\n              route: ['/navigation'],\n              active: true\n            },\n          ],\n        },\n        {\n          label: 'Level 2 Item',\n          route: ['/navigation'],\n          active: true\n        },\n      ]\n    }\n  ];\n}\n"

/***/ },

/***/ 824:
/***/ function(module, exports) {

module.exports = "import { Component } from '@angular/core';\n\n@Component({\n  templateUrl: 'off-click.component.html'\n})\nexport class OffClickComponent  {\n  constructor() { }\n\n  clicks: number = 0;\n\n  offClick() {\n    this.clicks++;\n  }\n}\n"

/***/ },

/***/ 825:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit, Directive, Input,\n  trigger,\n  state,\n  style,\n  transition,\n  animate } from '@angular/core';\n\n@Component({\n  templateUrl: 'popover.component.html',\n})\nexport class PopoverComponent {\n\n  open: boolean = false;\n  open2: boolean = false;\n  state: string = 'inactive';\n\n  style = {\n    border: '3px double red',\n    padding: '20px',\n    overflow: 'hidden'\n  }\n\n  public showPopover() {\n    this.open = true;\n  }\n\n  public closePopover() {\n    this.open = false;\n  }\n\n  public showPopover2() {\n    this.open2 = true;\n  }\n}\n"

/***/ },

/***/ 826:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'radio-button.component.html'\n})\nexport class RadioButtonComponent implements OnInit {\n\n  isChecked = false;\n\n  constructor() { }\n\n  ngOnInit() { }\n\n}\n"

/***/ },

/***/ 827:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'select.component.html'\n})\nexport class SelectComponent implements OnInit {\n\n  items: any[] = [\n    { label: 'item 1' },\n    { label: 'item 2' },\n    { label: 'item 3' },\n    { label: 'item 4' },\n    { label: 'item 5' },\n    { label: 'item 6', sublabel: 'sublabel of item 6' },\n    { label: 'item 7', sublabel: 'sublabel of item 7' },\n    { label: 'item 8', sublabel: 'sublabel of item 8' },\n    { label: 'item 9' },\n    { label: 'item 10' }\n  ]\n\n  selectedItemSingle: any;\n\n  selectedItemsMulti: any[];\n\n  constructor() { }\n\n  ngOnInit() { }\n\n  onSelect(items: any[]) {\n    if (items.length) {\n      this.selectedItemSingle = items[0];\n    } else {\n      this.selectedItemSingle = null;\n    }\n    console.log('Selected Items: ', items);\n  }\n\n  onSelectMulti(items: any[]) {\n    this.selectedItemsMulti = items;\n    console.log('Selected Items: ', items);\n  }\n}\n"

/***/ },

/***/ 828:
/***/ function(module, exports) {

module.exports = "import { Component } from '@angular/core';\n\n@Component({\n  templateUrl: 'tab-nav.component.html'\n})\nexport class TabNavComponent {\n  tabIndex: number = 0;\n}\n"

/***/ },

/***/ 829:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'tether.component.html'\n})\nexport class TetherComponent {\n\n}"

/***/ },

/***/ 830:
/***/ function(module, exports) {

module.exports = "import { Component, OnInit } from '@angular/core';\n\n@Component({\n  templateUrl: 'toolbar.component.html'\n})\nexport class ToolbarComponent implements OnInit {\n\n  constructor() { }\n\n  ngOnInit() { }\n\n}\n"

/***/ },

/***/ 831:
/***/ function(module, exports) {

module.exports = "import { Component, ViewChild } from '@angular/core';\nimport { WormholeGenerator } from './../../../src/directives/wormhole/wormhole.module';\n\n@Component({\n  templateUrl: 'wormhole.component.html'\n})\nexport class WormholeComponent {\n\n  @ViewChild('myFirstWormhole')\n  myFirstWormhole: WormholeGenerator;\n\n  ngAfterViewInit() {\n    console.log('myFirstWormhole', this.myFirstWormhole);\n  }\n}\n"

/***/ },

/***/ 832:
/***/ function(module, exports) {

module.exports = "# vcl-button-group\n\nA button group which distributes space for each button equally to occupy 100% horizontal space.\n\n## Usage:\n\n```js\nimport { VCLButtonGroupModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLButtonGroupModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\n ```html\n<vcl-button-group (change)=\"selectionChanged($event)\" mode=\"single\">\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 1\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 2\"></button>\n  <button vcl-button (click)=\"buttonClick($event)\" label=\"Action 3\"></button>\n</vcl-button-group>\n ```\n\n### API \n\n#### Properties:\n\n| Name                  | Type                   | Default  | Description\n| --------------------- | ---------------------- | -------- |--------------\n| `mode`                | string                 | `single` | `single` or `multiple` \n| `selectedIndex` *(1)* | number, number[]       |          | 2-Way-Binding. The selected buttons.  \n\n#### Actions:\n\n| Name                | Parameters           | Description\n| ------------        | -------------------- | --------------\n| `change`            | ButtonGroupChange    | Triggered when the button is pressed\n\n#### Interfaces:\n\n```ts\ninterface ButtonGroupChange {\n  source: ButtonComponent;\n  index: number | number[];\n}\n```\n*(1) Supports Two-way binding*\n"

/***/ },

/***/ 833:
/***/ function(module, exports) {

module.exports = "# vcl-button\n\n`vcl-button` enhances the HTML `<button>` with styling and features.\nIt is the main control for triggering actions.\n\n## Usage:\n\n```js\nimport { VCLButtonModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLButtonModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\n ```html\n<button vcl-button (click)=\"someAction($event)\" label=\"Action\" appIcon=\"fa:bolt\"></button>\n ```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default  | Description\n| ------------        | ----------- | -------- |--------------\n| `label` *(1)*       | string      |          | Sets aria-label\n| `busy`              | boolean     | false    | State to indicate that an operation is in progress\n| `flexLabel` *(1)*   | boolean     | false    | The label gets a flex layout property if true \n| `prepIcon`          | string      |          | icon to be prepended to the label \n| `appIcon`           | string      |          | Same as prepIcon but appended \n| `prepIconBusy`      | string      |          | icon to be prepended to the label - displayed in the busy state \n| `appIconBusy`       | string      |          | Same as prepIconBusy but appended \n| `title`             | string      |          | Sets aria-label \n| `autoBlur`          | boolean     | true     | if true, the focus is removed via blur() after the action. \n\n#### Actions:\n\n| Name                | Description\n| ------------        | --------------\n| `press`             | Triggered when the button is pressed\n\n*(1) Supports l10n*\n"

/***/ },

/***/ 834:
/***/ function(module, exports) {

module.exports = "<span>\n  <ng-content></ng-content>\n  <vcl-icogram\n    [label]=\"calculatedLabel | loc\"\n    [flexLabel]=\"flexLabel | loc\"\n    [prepIcon]=\"calculatedPrepIcon\"\n    [appIcon]=\"calculatedAppIcon\">\n  </vcl-icogram>\n</span>\n"

/***/ },

/***/ 835:
/***/ function(module, exports) {

module.exports = "# vcl-checkbox\n\nA Checkbox utilizing `vcl-icon`\n\n## Usage:\n\n```js\nimport { VCLCheckboxModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLCheckboxModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\n ```html\n<vcl-checkbox [(checked)]=\"checked\"></vcl-checkbox> \n```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default            | Description\n| ------------        | ----------- | ------------------ |--------------\n| `checked` *(1)*     | boolean     | false              | 2-Way-Binding. State of checkbox \n| `checkedIcon`       | string      | fa:check-square-o  | Icon to be displayed when checked \n| `uncheckedIcon`     | string      | fa:square-o        | Icon to be displayed when unchecked\n| `tabindex`          | number      | 0                  | The tabindex of the checkbox\n\n*(1) Supports Two-way binding*\n"

/***/ },

/***/ 836:
/***/ function(module, exports) {

module.exports = "<ul class=\"vclDropdown\"\n  [class.vclOpen]=\"expanded\"\n  [attr.role]=\"ariaRole\"\n  [attr.tabindex]=\"tabindex\"\n  [attr.aria-multiselectable]=\"maxSelectableItems > 1\"\n  [attr.aria-expanded]=\"expanded\">\n  <vcl-metalist (select)=\"onSelect($event)\" #metalist [items]=\"items\" [meta]=\"metaInformation\" [maxSelectableItems]=\"maxSelectableItems\" [minSelectableItems]=\"minSelectableItems\">\n    <template let-item=\"item\" let-meta=\"meta\">\n      <li class=\"vclDropdownItem\"\n        [class.vclSelected]=\"meta.selected\"\n        [attr.aria-selected]=\"meta.selected\"\n        role=\"menuitem\"\n        tabindex=\"0\"\n        (tap)=\"selectItem(item, meta, metalist)\">\n        <div class=\"vclDropdownItemLabel\">\n          {{item.label}}\n        </div>\n        <div *ngIf=\"item.sublabel\" class=\"vclDropdownItemSubLabel\">\n          {{item.sublabel}}\n        </div>\n      </li>\n    </template>\n  </vcl-metalist>\n</ul>\n"

/***/ },

/***/ 837:
/***/ function(module, exports) {

module.exports = "# vcl-form-control-label\n\nLabel to describe form controls.\n\n## Usage:\n\nNon-wrapping label\n\n```html\n<label vcl-form-control-label label=\"Label text\" subLabel=\"Sub label text\" for=\"...\"></label>\n```\n\nWrapping label\n\n```html\n<label vcl-form-control-label label=\"Label text\" subLabel=\"Sub label text\">\n  ...\n</label>\n```\n\n### API \n\n#### Properties:\n\n| Name                         | Type        | Default  | Description\n| ---------------------------- | ----------- | -------- |--------------\n| `label` *(1)*                | string      |          | The label \n| `subLabel` *(1)*             | string      |          | The sublabel \n| `prepend`                    | boolean     | false    | Whether the label prepends the child content\n| `disabled`                   | boolean     | false    | Whether the label is disabled or not\n| `required`                   | boolean     | false    | Shows the required indicator when true\n| `requiredIndicatorCharacter` | string      | •        | The required indicator character\n| `requiredIndLabel` *(1)*     | string      |          | Accessible label for the required indicator\n| `wrapping`                   | boolean     | false    | Whether the label wraps the labelled control\n\n*(1) Supports l10n*\n"

/***/ },

/***/ 838:
/***/ function(module, exports) {

module.exports = "<ng-content *ngIf=\"prepend\"></ng-content>\n{{label | loc}}\n<em *ngIf=\"required\" class=\"vclRequiredIndicator\" aria-hidden=\"true\" [attr.aria-label]=\"requiredIndLabel | loc\">\n  {{requiredIndicatorCharacter}}\n</em>\n<label *ngIf=\"subLabel\" class=\"vclFormControlSubLabel\">\n  {{subLabel | loc}}\n</label>\n<ng-content *ngIf=\"!prepend\"></ng-content>\n"

/***/ },

/***/ 839:
/***/ function(module, exports) {

module.exports = "# vcl-icogram\n\nCombination of icon and text of which both are optional and can be permuted.\nIcons can be prepended or appended to a textual label and can be sourced from icon\nfonts or directly from file based imagery.\nThe component takes care of accessibility aspects such rendering appropriate aria\nattributes.\nIt also renders accessability labels for icons if no label for the icogram is\nprovided.\n\n\n## Usage:\n\n```html\n<vcl-icogram label=\"some label\" prepIcon=\"fa:chevron-right\" flexLabel=true></vcl-icogram>\n<vcl-icogram>\n  <vcl-icon icon=\"fa:close\"></vcl-icon>\n</vcl-icogram>\n```\n\n### API \n\n#### Properties:\n\n| Name                         | Type        | Default  | Description\n| ---------------------------- | ----------- | -------- |--------------\n| `label` *(1)*                | string      |          | The textual label \n| `flexLabel`                  | boolean     |          | the label gets a `vclLayoutFlex` class if true\n| `prepIcon`                   | string      |          | Icon as defined by the icon component\n| `appIcon`                    | string      |          | Same as `prepIcon` but appended\n| `prepIconSrc`                | string      |          | Image as defined by the icon component\n| `appIconSrc`                 | string      |          | Same as `prepIconSrc` but appended\n\n*(1) Supports l10n*\n"

/***/ },

/***/ 840:
/***/ function(module, exports) {

module.exports = "<ng-content></ng-content>\n<vcl-icon *ngIf=\"prepIcon\" [icon]=\"prepIcon\"></vcl-icon>\n<span *ngIf=\"!!label\" [class.vclLayoutFlex]=\"!!flexLabel\" class=\"vclText\">\n  {{label | loc}}\n</span>\n<vcl-icon *ngIf=\"appIcon\" [icon]=\"appIcon\"></vcl-icon>\n"

/***/ },

/***/ 841:
/***/ function(module, exports) {

module.exports = "# vcl-icon\n\nIcon which can be based on glyphs from icon fonts, inline svg and bitmaps.\n\nThe `label` is never displayed, it is only for accessibility with screen\nreaders.\nThe `hidden` attribute is only reflected in the `aria-hidden` property which\nallows to hide the icon to screen readers, if it is only of presentational character.\nSee http://www.filamentgroup.com/lab/bulletproof_icon_fonts.html for details.\n\n\n## Usage:\n\n```html\n<vcl-icon icon=\"icon-class\" label=\"chevron right\" hidden=\"false\"></vcl-icon>\n```\nor\n```html\n<vcl-icon src=\"...\"></vcl-icon>\n```\nor\n```html\n<vcl-icon svguse=\"...\"></vcl-icon>\n```\n\n### Class Provider\n\nTODO\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default  | Description\n| ------------        | ----------- | -------- |--------------\n| `icon`              | string      |          | Icon generator lookup via icon class provider\n| `src`               | string      |          | URL of a graphics resource\n| `svguse`            | string      |          | Generates an SVG `use` tag referencing the value\n| `iconClass`         | string      |          | Additional class\n| `label` *(1)*       | string      |          | `aria-label` \n| `ariaRole`          | string      |          | `aria-role`\n\n*(1) Supports l10n*\n"

/***/ },

/***/ 842:
/***/ function(module, exports) {

module.exports = "<span class=\"vclIcon {{iconClass}} {{fontIconClass}}\" [attr.aria-label]=\"label | loc\" [attr.aria-hidden]=\"isAriaHidden\" [attr.role]=\"ariaRole\">\n  <ng-content></ng-content>\n  <img *ngIf=\"src\" src=\"{{src}}\">\n  <svg *ngIf=\"svguse\" viewBox=\"0 0 100 100\" preserveAspectRatio=\"xMidYMid meet\">\n    <use xmlns:xlink=\"http://www.w3.org/1999/xlink\" attr.xlink:href=\"{{svguse}}\"></use>\n  </svg>\n</span>\n"

/***/ },

/***/ 843:
/***/ function(module, exports) {

module.exports = "# vcl-input\n\nEnhanced text input\n\n## Usage:\n\n ```html\n<input vcl-input [(ngModel)]=\"data1\">\n<input vcl-input [(ngModel)]=\"data2\" selectAllOnFocus=true>\n<input vcl-input [(typedValue)]=\"data3\" valueType=\"number\">\n```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default            | Description\n| ------------        | ----------- | ------------------ |--------------\n| `selectAllOnFocus`  | boolean     | false              | Selects \n| `typedValue` *(1)*  | any         |                    | The current value of the input element. Type is converted as specified in `valueType`  \n| `valueType`         | string      | string             | `string` or `number`. Type to use in `typedValue`\n\n*(1) Supports Two-way binding*\n"

/***/ },

/***/ 844:
/***/ function(module, exports) {

module.exports = "# vcl-layer\n\nA container which stacks up in the z-direction.\n\n## Usage:\n\n```js\nimport { VCLLayerModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLLayerModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\nThe vcl-layer-base defines the position in the DOM where the layers will appear when visible.\n\n```html\n<vcl-layer-base></vcl-layer-base>\n```\n\nA layer can be defined anywhere in your application\n\n```html\n<template vcl-layer #myLayer=\"layer\" [modal]=\"true\" [name]=\"myLayer\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">Title</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        Content\n        <button vcl-button (click)=\"myLayer.close()\" label=\"Close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n\n<button vcl-button (click)=\"myLayer.open()\" label=\"Open Layer\"></button>\n```\n\nThe `LayerService` can be used to open a Layer without having an actual reference.\nThe layer must have a name to use it with the Service.\n_This only works when the layer template is actually rendered on the page_\n\nAdditionaly you can pass to and receive data from the layer.\n\n```js\nimport { LayerService } from 'ng-vcl';\n\nexport class LayerComponent {\n\n  constructor(private layerService: LayerService) {}\n\n  openLayer() {\n    this.layerService.open('myLayer', {\n      // Data to pass to the Layer\n      title: 'My layers title',\n      content: 'My layers content'\n    }).subscribe(data => {\n      // Triggered when data is send from the layer\n    }, null, () => {\n      // Triggered when the layer is closed\n    });\n  }\n\n  closeLayer() {\n    this.layerService.close('myLayer');\n  }\n}\n```\n\n```html\n<template vcl-layer #myLayer=\"layer\" [modal]=\"true\" [name]=\"myLayer\">\n  <div class=\"vclPanel vclNoMargin\">\n    <div class=\"vclPanelHeader\">\n      <h3 class=\"vclPanelTitle\">{{myLayer.data.title}}</h3>\n    </div>\n    <div class=\"vclPanelBody\">\n      <p class=\"vclPanelContent\">\n        {{myLayer.data.content}}\n        <button vcl-button (click)=\"myLayer.send('data to send 1')\" label=\"Send data\"></button>\n        <button vcl-button (click)=\"myLayer.close('data to send 2')\" label=\"Close Layer\"></button>\n      </p>\n    </div>\n  </div>\n</template>\n\n<button vcl-button (click)=\"myLayer.open()\" label=\"Open Layer\"></button>\n```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default  | Description\n| ------------        | ----------- | -------- |--------------\n| `modal`             | boolean     | false    | Disables user interaction outside of the layer\n| `name`              | string      |          | The layer name for addressing it in the LayerService \n"

/***/ },

/***/ 845:
/***/ function(module, exports) {

module.exports = "<div *ngFor=\"let layer of visibleLayers\">\n  <div class=\"vclLayer\" role=\"dialog\" [@boxState]=\"layer.state\" [style.z-index]=\"layer.zIndex\">\n    <div class=\"vclLayerBox vclLayerGutterPadding\" (off-click)=\"layer.offClick()\">\n      <div [wormhole]=\"layer\" [wormhole-indisposable]=\"true\"></div>\n    </div>\n  </div>\n  <div *ngIf=\"layer.modal\" class=\"vclLayerCover\" [@layerState]=\"layer.state\" [style.z-index]=\"layer.coverzIndex\"></div>\n</div>\n"

/***/ },

/***/ 846:
/***/ function(module, exports) {

module.exports = "# vcl-link\n\nThe anchor tag with VCL and Angular awareness.\n\n## Usage\n\n```html\n<a vcl-link [href]=\"'http://www.example.com'\" [label]=\"'Example Link'\" [prepIcon]=\"'fa:chevron-right'\"></a>\n```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default  | Description\n| ------------        | ----------- | -------- |--------------\n| `href`              | string      |          | `href` attribute \n| `scheme`            | string      |          | URL scheme to be used, e. g. `tel`, `mailto` etc. \n| `label` *(1)*       | string      |          | textual label with automatic l10n lookup \n| `title` *(1)*       | string      |          | textual title with automatic Ember-i18n lookup \n| `prepIcon`          | string      |          | icon to be prepended to the label \n| `appIcon`           | string      |          | icon to be appended to the label \n| `disabled`          | boolean     | false    | disabled if `true` \n\n*(1) Supports l10n*\n"

/***/ },

/***/ 847:
/***/ function(module, exports) {

module.exports = "<ng-content></ng-content>\n<vcl-icogram \n  [label]=\"(label | loc) || href\"\n  [prepIcon]=\"prepIcon\"\n  [appIcon]=\"appIcon\">\n</vcl-icogram>\n"

/***/ },

/***/ 848:
/***/ function(module, exports) {

module.exports = "<template *ngFor=\"let item of items\" [ngTemplateOutlet]=\"template\" [ngOutletContext]=\"{item: item, meta: getMeta(item) }\"></template>\n"

/***/ },

/***/ 849:
/***/ function(module, exports) {

module.exports = "<div class=\"vclDatePicker\"\n    [class.vclLayoutHidden]=\"!expanded\">\n  <div class=\"vclDataGrid vclDGVAlignMiddle vclDGAlignCentered vclCalendar vclCalInput\"\n    [attr.role]=\"grid\"\n    [attr.tabindex]=\"tabindex\"\n    [attr.aria-multiselectable]=\"maxSelectableItems > 1\"\n    [attr.aria-expanded]=\"expanded\">\n\n    <div class=\"vclDGRow\">\n      <div class=\"vclToolbar vclLayoutFlex vclLayoutHorizontal vclLayoutJustified vclLayoutCenter\" role=\"menubar\" aria-level=\"1\">\n        <button vcl-button class=\"vclButton vclTransparent vclSquare\"\n          [class.vclDisabled]=\"!prevYearAvailable\"\n          [appIcon]=\"prevYearBtnIcon\"\n          (tap)=\"onPrevYearTap()\">\n        </button>\n\n        <span class=\"vclCalHeaderLabel\">{{ currentYear }}</span>\n\n        <button vcl-button class=\"vclButton vclTransparent vclSquare\"\n          [class.vclDisabled]=\"!nextYearAvailable\"\n          [appIcon]=\"nextYearBtnIcon\"\n          (tap)=\"onNextYearTap()\">\n        </button>\n\n        <button vcl-button *ngIf=\"expandable\" class=\"vclButton vclTransparent vclSquare\"\n          [appIcon]=\"closeBtnIcon\"\n          (tap)=\"onCloseBtnTap()\">\n        </button>\n      </div>\n    </div>\n\n    <div class=\"vclSeparator\"></div>\n\n    <template ngFor let-iM [ngForOf]=\"months\" let-i=\"index\">\n      <div *ngIf=\"i % monthsPerRow === 0\" class=\"vclDGRow\" role=\"row\">\n        <div *ngFor=\"let jM of months.slice(i, (i + monthsPerRow > months.length ? months.length : i + monthsPerRow)); let j = index;\"\n          (tap)=\"selectMonth(i+j)\"\n          class=\"vclDGCell vclCalItem\"\n          [class.vclAvailable]=\"!useAvailableMonths || currentMeta[i+j].available\"\n          [class.vclUnavailable]=\"useAvailableMonths && !currentMeta[i+j].available\"\n          [class.vclToday]=\"isCurrentMonth(i+j)\"\n          [class.vclOtherMonth]=\"!isCurrentMonth(i+j)\"\n          [class.vclDisabled]=\"useAvailableMonths && !currentMeta[i+j].available\"\n          [class.vclSelected]=\"currentMeta[i+j].selected\"\n          [style.background-color]=\"currentMeta[i+j].color\"\n          [style.order]=\"i+j\"\n          [attr.aria-selected]=\"currentMeta[i+j].selected\"\n          role=\"gridcell\"\n          tabindex=\"0\">\n            <div *ngIf=\"jM.label\" class=\"vclLayoutHorizontal vclLayoutCenterJustified vclMonthPickerListItemLabel\">\n              {{jM.label | loc}}\n            </div>\n\n            <div *ngIf=\"jM.sublabel\" class=\"vclLayoutHorizontal vclLayoutCenterJustified vclMonthPickerListItemSublabel\">\n              {{jM.sublabel | loc}}\n            </div>\n        </div>\n      </div>\n    </template>\n  </div>\n</div>\n"

/***/ },

/***/ 850:
/***/ function(module, exports) {

module.exports = "<nav class=\"vclNavigation\" [class.vclVertical]=\"isVertical\">\n  <ul>\n    <li *ngFor=\"let item of navigationItems\"\n        [class.vclSelected]=\"item.selected && !item.items\"\n        [class.vclOpen]=\"item.opened\"\n        [class.vclClose]=\"!item.opened\"\n        [class.vclNavigationHeading]=\"item.heading\"\n        [class.vclNavigationItem]=\"!item.heading\"\n        [attr.touch-action]=\"touchAction\"\n        [attr.aria-selected]=\"item.selected\"\n        [attr.role]=\"item.heading && 'sectionhead' || ariaRole\"\n        [attr.tabindex]=\"tabindex\">\n\n      <span *ngIf=\"item.heading\">\n        {{item.label | loc}}\n      </span>\n\n      <a vcl-link class=\"vclNavigationItemLabel\"\n        *ngIf=\"!item.heading\"\n        [label]=\"item.label | loc\"\n        [href]=\"item.href\"\n        [prepIcon]=\"getPrepIcon(item)\"\n        [appIcon]=\"getAppIcon(item)\"\n        (click)=\"item.items && toggleMenu(item)\"\n        (click)=\"selectItem(item)\">\n      </a>\n\n      <vcl-navigation *ngIf=\"item.items\"\n          [navigationItems]=\"item.items\"\n          [type]=\"type\"\n          [subLevelHintIconOpened]=\"subLevelHintIconOpened\"\n          [subLevelHintIconClosed]=\"subLevelHintIconClosed\"\n          [subLevelHintIconSide]=\"subLevelHintIconSide\"\n          [selectedItem]=\"selectedItem\"\n          (select)=\"onSelect($event)\">\n      </vcl-navigation>\n    </li>\n  </ul>\n</nav>\n"

/***/ },

/***/ 851:
/***/ function(module, exports) {

module.exports = "<vcl-tether\n  *ngIf=\"open\"\n  [zIndex]=\"zIndex\"\n  [class]=\"class\"\n  [target]=\"target\"\n  [targetAttachment]=\"targetAttachment\"\n  [attachment]=\"attachment\">\n  <div [ngStyle]=\"style\" [@popOverState]=\"state\">\n    <ng-content></ng-content>\n  </div>\n</vcl-tether>\n<div *ngIf=\"open && layer\" class=\"vclLayerCover\" [style.zIndex]=\"coverZIndex\" (click)=\"close()\"></div>\n"

/***/ },

/***/ 852:
/***/ function(module, exports) {

module.exports = "# vcl-radio-button\n\nA radio button utilizing `vcl-icon`\n\n## Usage:\n\n ```html\n<vcl-radio-button [(checked)]=\"checked\"></vcl-radio-button>```\n\n### API \n\n#### Properties:\n\n| Name                | Type        | Default            | Description\n| ------------        | ----------- | ------------------ |--------------\n| `checked` *(1)*     | boolean     | false              | 2-Way-Binding. State of radio button \n| `checkedIcon`       | string      | fa:check-square-o  | Icon to be displayed when checked \n| `uncheckedIcon`     | string      | fa:square-o        | Icon to be displayed when unchecked\n| `tabindex`          | number      | 0                  | The tabindex of the radio button\n\n*(1) Supports Two-way binding*\n"

/***/ },

/***/ 853:
/***/ function(module, exports) {

module.exports = "<div [attr.aria-autocomplete]=\"ariaRole\" class=\"vclSelect vclInputGroupEmb\" (off-click)=\"onOutsideClick()\">\n  <input (tap)=\"expand()\" class=\"vclInput\" [attr.value]=\"displayValue\" readonly>\n  <button vcl-button (click)=\"expand()\" class=\"vclTransparent vclSquare vclAppended\" [appIcon]=\"expanded ? expandedIcon : collapsedIcon\"></button>\n  <vcl-dropdown (select)=\"onSelect($event)\"\n    [(expanded)]=\"expanded\"\n    [items]=\"items\"\n    [minSelectableItems]=\"minSelectableItems\"\n    [maxSelectableItems]=\"maxSelectableItems\"\n    [tabindex]=\"0\" [expanded]=\"true\"></vcl-dropdown>\n</div>\n"

/***/ },

/***/ 854:
/***/ function(module, exports) {

module.exports = "# vcl-tab-nav\nThe tab nav allows to organize content in tabs.\nOnly one tab is visible at a given time.\n\n## Usage:\n\n```js\nimport { VCLTabNavModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLTabNavModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\n```html\n<vcl-tab-nav>\n  <vcl-tab>\n    <template vcl-tab-label>Tab1</template>\n    <template vcl-tab-content>\n      Content1\n    </template>\n  </vcl-tab>\n  <vcl-tab>\n    <template vcl-tab-label>Tab2</template>\n    <template vcl-tab-content>\n      Content2\n    </template>\n  </vcl-tab>\n  <vcl-tab [disabled]=\"true\"><template vcl-tab-label>Tab3 (disabled)</template>\n    <template vcl-tab-content>\n      Content3\n    </template>\n  </vcl-tab>\n</vcl-tab-nav>\n```\n\n### API \n\n#### vcl-tab-nav Properties:\n\n| Name                     | Type        | Default  | Description\n| ------------             | ----------- | -------- |--------------\n| `selectedTabIndex` *(1)* | number      |        0 | The index of the currently visible tab\n| `borders`                | boolean     |    false | Enables borders for the tab-nav\n| `layout`                 | string      |          | The layout: `null`, `\"left\"` or `\"right\"`\n| `tabbableClass`          | string      |          | Modifier classes for vclTabbable\n| `tabsClass`              | string      |          | Modifier classes for vclTabs\n| `tabContentClass`        | string      |          | Modifier classes for vclTabContent\n\n#### vcl-tab Properties:\n\n| Name                     | Type        | Default  | Description\n| ------------             | ----------- | -------- |--------------\n| `disabled`               | boolean     |   false  | Disables the tab when true   \n| `tabClass`               | string      |          | Modifier classes for vclTab   \n\n*(1) Supports Two-way binding*\n"

/***/ },

/***/ 855:
/***/ function(module, exports) {

module.exports = "<div class=\"vclTabbable {{tabbableClass}}\" \n     [class.vclTabsLeft]=\"layout==='left'\"\n     [class.vclTabsRight]=\"layout==='right'\">\n  <div class=\"vclTabs {{tabsClass}}\" [class.vclTabStyleUni]=\"!!borders\" role=\"tablist\">\n    <div *ngFor=\"let tab of tabs; let i = index\"\n         class=\"vclTab {{tab.tabClass}}\" role=\"tab\"\n         [class.vclDisabled]=\"tab.disabled\"\n         [class.vclSelected]=\"selectedTabIndex===i\"\n         [class.aria-selected]=\"selectedTabIndex===i\"\n         (tap)=\"selectTab(tab)\">\n      <div [wormhole]=\"tab.label\"></div>\n    </div>\n  </div>\n  <div *ngIf=\"tabsHaveContent\" class=\"vclTabContent {{tabContentClass}}\" [class.vclNoBorder]=\"!borders\">\n    <div role=\"tabpanel\" class=\"vclTabPanel\" *ngFor=\"let tab of tabs; let i = index\">\n      <div *ngIf=\"selectedTabIndex===i && tab.content\" [wormhole]=\"tab.content\" [wormhole-indisposable]=\"true\"></div>\n    </div>\n  </div>\n  <div *ngIf=\"!tabsHaveContent && content\" role=\"tabpanel\" class=\"vclTabPanel\">\n    <div [wormhole]=\"content\" [wormhole-indisposable]=\"true\"></div>\n  </div>\n</div>\n\n"

/***/ },

/***/ 856:
/***/ function(module, exports) {

module.exports = "<div [id]=\"id\" [class]=\"class\" [style.z-index]=\"zIndex\">\n  <ng-content></ng-content>\n</div>\n"

/***/ },

/***/ 857:
/***/ function(module, exports) {

module.exports = "# off-click directive\n\nThe off-click action fires when a click event is handled and its source is not(!) the element or any of its subelements.  \n\n## Usage:\n\n```js\nimport { VCLOffClickModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLOffClickModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\noffClick() is called when the click`s source is not DIV1 or DIV2  \n\n```html\n<div (off-click)=\"offClick()\">\n  DIV1\n  <div>\n    DIV2\n  </div>\n</div>\n```\n"

/***/ },

/***/ 858:
/***/ function(module, exports) {

module.exports = "# wormhole directive\n\nThe wormhole directive allows to render a template somewhere else in the DOM.\n\n## Usage:\n\n```js\nimport { VCLWormholeModule } from 'ng-vcl';\n\n@NgModule({\n  imports: [ VCLWormholeModule ],\n  ...\n})\nexport class AppComponent {}\n```\n\nUse the the generateWormhole directive to create a wormhole...\n```html\n\n<template generateWormhole #myFirstWormhole=\"wormhole\">\n  I am a wormhole\n</template>\n```\n\n...and connect it via the wormhole directive.\nThe wormhole template is rendered within the element.\n```html\n<div [wormhole]=\"myFirstWormhole\">\n  <!-- The myFirstWormhole template is rendered here -->\n</div>\n\n```\n\nGet a reference to the generated wormhole by using the @ViewChild(ren)/@ContentChild(ren) annotations\n```js\nimport { VCLWormholeGenerator } from 'ng-vcl';\n\n@Component(...)\nclass MyComp {\n  ...\n  @ViewChild('myFirstWormhole')\n  myFirstWormhole: WormholeGenerator;\n  ...\n}\n```\n"

/***/ },

/***/ 859:
/***/ function(module, exports) {

module.exports = "# L10n\n\n## Usage\n\n```js\n\nimport { NgModule } from '@angular/core';\nimport { L10nModule } from 'ng2-l10n';\nimport { AppComponent } from './app.component';\n\n@NgModule({\n  imports: [\n    L10nModule.forRoot({\n      loader: MyLoaderService,  // required - loader services class\n      loaderConfig: { ... },    // optional - loader configuration\n      parser: MyParserService,  // optional - parser service class\n      config: {\n        locale: \"en-us\"         // optional - default locale. Uses browsers default language if not provided\n      }\n    })\n  ],\n  declarations: [ AppComponent ],\n  bootstrap: [ AppComponent ]\n})\nexport class AppModule { }\n```\n\nUse the `loc` pipe in a template to localize a text\n\n```html\n\n<p>{{'HELLO_WORLD' | loc}}</p>\n\n```\n\n## Loader services\n\n### Static resource loader\n```\nL10nModule.forRoot({\n  loader: L10nStaticLoaderService,\n  loaderConfig: {\n    \"HELLO_WORLD\": {\n      \"en-us\": \"Hello World!\"\n      \"de-de\": \"Hallo Welt!\"\n    }\n  }\n});\n\n\n```\n\n### HTTP service TODO\n```js\nL10nModule.forRoot({\n  loader: L10nHTTPLoaderService,\n  loaderConfig: {\n    endpoint: 'URL_TO_JSON'\n  }\n});\n```\n\n\n\n```js\n\nclass AnyInjectableClass {\n  constructor(private l10n: L10nHTTPService) {\n    // Refetches the json    \n    this.l10n.refresh();\n  }\n}\n```\n\n## Custom loaders\n\n```js\n@Injectable()\nexport class L10nFancyLoaderService extends L10nLoaderService {\n  constructor(\n    @Inject(L10N_CONFIG) \n    private config: L10nConfig,\n    // other injections\n  ) { \n    super();\n    this.config; // loader config\n  }\n\n  // required\n  fetchTranslationPackage(locale:string) : Observable<TranslationPackage> {\n    // return your translation package as an Observable\n  }\n\n  // optional\n  getSupportedLocales() : Observable<string[]> {\n    // return an array of supported locales as an Observable\n  }\n}\n```\n\n## Template parameters\n\n```json\n{\n  \"HELLO_USER\": {\n    \"en-us\": \"Hello {0}!\",\n    \"de-de\": \"Hallo {0}!\"\n  }\n}\n```\n```json\n<span>{{HELLO_USER | loc:username}}</span>\n```\n"

/***/ },

/***/ 92:
/***/ function(module, exports, __webpack_require__) {

"use strict";
"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = __webpack_require__(0);
var common_1 = __webpack_require__(9);
var icon_component_1 = __webpack_require__(653);
exports.IconComponent = icon_component_1.IconComponent;
var icon_service_1 = __webpack_require__(373);
exports.IconService = icon_service_1.IconService;
var l10n_module_1 = __webpack_require__(28);
var VCLIconModule = (function () {
    function VCLIconModule() {
    }
    VCLIconModule.forRoot = function (config) {
        return {
            ngModule: VCLIconModule,
            providers: [
                {
                    provide: icon_service_1.IconService,
                    useClass: config.service || icon_service_1.IconService
                }
            ]
        };
    };
    VCLIconModule = __decorate([
        core_1.NgModule({
            imports: [common_1.CommonModule, l10n_module_1.L10nModule],
            exports: [icon_component_1.IconComponent],
            declarations: [icon_component_1.IconComponent],
            providers: [icon_service_1.IconService],
        }), 
        __metadata('design:paramtypes', [])
    ], VCLIconModule);
    return VCLIconModule;
}());
exports.VCLIconModule = VCLIconModule;


/***/ }

},[1117]);
//# sourceMappingURL=main.map