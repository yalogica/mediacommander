/*!
 * OverlayScrollbars
 * Version: 2.10.0
 *
 * Copyright (c) Rene Haas | KingSora.
 * https://github.com/KingSora
 *
 * Released under the MIT license.
 */
var OverlayScrollbarsGlobal = function(t) {
  "use strict";
  const createCache = (t, n) => {
    const {o: o, i: s, u: e} = t;
    let r, c = o;
    const cacheUpdateContextual = (t, n) => {
      const o = c, l = t, i = n || (s ? !s(o, l) : o !== l);
      return (i || e) && (c = l, r = o), [ c, i, r ];
    };
    return [ n ? t => cacheUpdateContextual(n(c, r), t) : cacheUpdateContextual, t => [ c, !!t, r ] ];
  }, o = "undefined" != typeof window && "undefined" != typeof HTMLElement && !!window.document ? window : {}, s = Math.max, e = Math.min, c = Math.round, r = Math.abs, l = Math.sign, i = o.cancelAnimationFrame, a = o.requestAnimationFrame, u = o.setTimeout, _ = o.clearTimeout, getApi = t => void 0 !== o[t] ? o[t] : void 0, d = getApi("MutationObserver"), f = getApi("IntersectionObserver"), v = getApi("ResizeObserver"), p = getApi("ScrollTimeline"), isUndefined = t => void 0 === t, isNull = t => null === t, isNumber = t => "number" == typeof t, isString = t => "string" == typeof t, isBoolean = t => "boolean" == typeof t, isFunction = t => "function" == typeof t, isArray = t => Array.isArray(t), isObject = t => "object" == typeof t && !isArray(t) && !isNull(t), isArrayLike = t => {
    const n = !!t && t.length, o = isNumber(n) && n > -1 && n % 1 == 0;
    return !!(isArray(t) || !isFunction(t) && o) && (!(n > 0 && isObject(t)) || n - 1 in t);
  }, isPlainObject = t => !!t && t.constructor === Object, isHTMLElement = t => t instanceof HTMLElement, isElement = t => t instanceof Element, animationCurrentTime = () => performance.now(), animateNumber = (t, n, o, e, c) => {
    let r = 0;
    const l = animationCurrentTime(), u = s(0, o), frame = o => {
      const i = animationCurrentTime(), d = i - l >= u, f = o ? 1 : 1 - (s(0, l + u - i) / u || 0), v = (n - t) * (isFunction(c) ? c(f, f * u, 0, 1, u) : f) + t, p = d || 1 === f;
      e && e(v, f, p), r = p ? 0 : a(() => frame());
    };
    return frame(), t => {
      i(r), t && frame(t);
    };
  };
  function each(t, n) {
    if (isArrayLike(t)) for (let o = 0; o < t.length && false !== n(t[o], o, t); o++) ; else t && each(Object.keys(t), o => n(t[o], o, t));
    return t;
  }
  const inArray = (t, n) => t.indexOf(n) >= 0, concat = (t, n) => t.concat(n), push = (t, n, o) => (o || isString(n) || !isArrayLike(n) ? t.push(n) : Array.prototype.push.apply(t, n), 
  t), from = t => Array.from(t || []), createOrKeepArray = t => isArray(t) ? t : !isString(t) && isArrayLike(t) ? from(t) : [ t ], isEmptyArray = t => !!t && !t.length, deduplicateArray = t => from(new Set(t)), runEachAndClear = (t, n, o) => {
    each(t, t => !t || t.apply(void 0, n || [])), !o && (t.length = 0);
  }, h = "paddingTop", g = "paddingRight", b = "paddingLeft", y = "paddingBottom", w = "marginLeft", S = "marginRight", m = "marginBottom", O = "overflowX", $ = "overflowY", C = "width", x = "height", H = "visible", E = "hidden", z = "scroll", equal = (t, n, o, s) => {
    if (t && n) {
      let e = true;
      return each(o, o => {
        (s ? s(t[o]) : t[o]) !== (s ? s(n[o]) : n[o]) && (e = false);
      }), e;
    }
    return false;
  }, equalWH = (t, n) => equal(t, n, [ "w", "h" ]), equalXY = (t, n) => equal(t, n, [ "x", "y" ]), equalTRBL = (t, n) => equal(t, n, [ "t", "r", "b", "l" ]), noop = () => {}, bind = (t, ...n) => t.bind(0, ...n), selfClearTimeout = t => {
    let n;
    const o = t ? u : a, s = t ? _ : i;
    return [ e => {
      s(n), n = o(() => e(), isFunction(t) ? t() : t);
    }, () => s(n) ];
  }, debounce = (t, n) => {
    const {_: o, v: s, p: e, S: c} = n || {};
    let r, l, d, f, v = noop;
    const p = function(n) {
      v(), _(r), f = r = l = void 0, v = noop, t.apply(this, n);
    }, mergeParms = t => c && l ? c(l, t) : t, flush = () => {
      v !== noop && p(mergeParms(d) || d);
    }, h = function() {
      const t = from(arguments), n = isFunction(o) ? o() : o;
      if (isNumber(n) && n >= 0) {
        const o = isFunction(s) ? s() : s, c = isNumber(o) && o >= 0, h = n > 0 ? u : a, g = n > 0 ? _ : i, y = mergeParms(t) || t, w = p.bind(0, y);
        let S;
        v(), e && !f ? (w(), f = true, S = h(() => f = void 0, n)) : (S = h(w, n), c && !r && (r = u(flush, o))), 
        v = () => g(S), l = d = y;
      } else p(t);
    };
    return h.m = flush, h;
  }, hasOwnProperty = (t, n) => Object.prototype.hasOwnProperty.call(t, n), keys = t => t ? Object.keys(t) : [], assignDeep = (t, n, o, s, e, c, r) => {
    const l = [ n, o, s, e, c, r ];
    return "object" == typeof t && !isNull(t) || isFunction(t) || (t = {}), each(l, n => {
      each(n, (o, s) => {
        const e = n[s];
        if (t === e) return true;
        const c = isArray(e);
        if (e && isPlainObject(e)) {
          const n = t[s];
          let o = n;
          c && !isArray(n) ? o = [] : c || isPlainObject(n) || (o = {}), t[s] = assignDeep(o, e);
        } else t[s] = c ? e.slice() : e;
      });
    }), t;
  }, removeUndefinedProperties = (t, n) => each(assignDeep({}, t), (t, o, s) => {
    void 0 === t ? delete s[o] : n && t && isPlainObject(t) && (s[o] = removeUndefinedProperties(t, n));
  }), isEmptyObject = t => !keys(t).length, capNumber = (t, n, o) => s(t, e(n, o)), getDomTokensArray = t => deduplicateArray((isArray(t) ? t : (t || "").split(" ")).filter(t => t)), getAttr = (t, n) => t && t.getAttribute(n), hasAttr = (t, n) => t && t.hasAttribute(n), setAttrs = (t, n, o) => {
    each(getDomTokensArray(n), n => {
      t && t.setAttribute(n, String(o || ""));
    });
  }, removeAttrs = (t, n) => {
    each(getDomTokensArray(n), n => t && t.removeAttribute(n));
  }, domTokenListAttr = (t, n) => {
    const o = getDomTokensArray(getAttr(t, n)), s = bind(setAttrs, t, n), domTokenListOperation = (t, n) => {
      const s = new Set(o);
      return each(getDomTokensArray(t), t => {
        s[n](t);
      }), from(s).join(" ");
    };
    return {
      O: t => s(domTokenListOperation(t, "delete")),
      $: t => s(domTokenListOperation(t, "add")),
      C: t => {
        const n = getDomTokensArray(t);
        return n.reduce((t, n) => t && o.includes(n), n.length > 0);
      }
    };
  }, removeAttrClass = (t, n, o) => (domTokenListAttr(t, n).O(o), bind(addAttrClass, t, n, o)), addAttrClass = (t, n, o) => (domTokenListAttr(t, n).$(o), 
  bind(removeAttrClass, t, n, o)), addRemoveAttrClass = (t, n, o, s) => (s ? addAttrClass : removeAttrClass)(t, n, o), hasAttrClass = (t, n, o) => domTokenListAttr(t, n).C(o), createDomTokenListClass = t => domTokenListAttr(t, "class"), removeClass = (t, n) => {
    createDomTokenListClass(t).O(n);
  }, addClass = (t, n) => (createDomTokenListClass(t).$(n), bind(removeClass, t, n)), find = (t, n) => {
    const o = n ? isElement(n) && n : document;
    return o ? from(o.querySelectorAll(t)) : [];
  }, is = (t, n) => isElement(t) && t.matches(n), isBodyElement = t => is(t, "body"), contents = t => t ? from(t.childNodes) : [], parent = t => t && t.parentElement, closest = (t, n) => isElement(t) && t.closest(n), getFocusedElement = t => (t || document).activeElement, liesBetween = (t, n, o) => {
    const s = closest(t, n), e = t && ((t, n) => {
      const o = n ? isElement(n) && n : document;
      return o && o.querySelector(t);
    })(o, s), c = closest(e, n) === s;
    return !(!s || !e) && (s === t || e === t || c && closest(closest(t, o), n) !== s);
  }, removeElements = t => {
    each(createOrKeepArray(t), t => {
      const n = parent(t);
      t && n && n.removeChild(t);
    });
  }, appendChildren = (t, n) => bind(removeElements, t && n && each(createOrKeepArray(n), n => {
    n && t.appendChild(n);
  })), createDiv = t => {
    const n = document.createElement("div");
    return setAttrs(n, "class", t), n;
  }, createDOM = t => {
    const n = createDiv();
    return n.innerHTML = t.trim(), each(contents(n), t => removeElements(t));
  }, getCSSVal = (t, n) => t.getPropertyValue(n) || t[n] || "", validFiniteNumber = t => {
    const n = t || 0;
    return isFinite(n) ? n : 0;
  }, parseToZeroOrNumber = t => validFiniteNumber(parseFloat(t || "")), roundCssNumber = t => Math.round(1e4 * t) / 1e4, numberToCssPx = t => `${roundCssNumber(validFiniteNumber(t))}px`;
  function setStyles(t, n) {
    t && n && each(n, (n, o) => {
      try {
        const s = t.style, e = isNull(n) || isBoolean(n) ? "" : isNumber(n) ? numberToCssPx(n) : n;
        0 === o.indexOf("--") ? s.setProperty(o, e) : s[o] = e;
      } catch (s) {}
    });
  }
  function getStyles(t, n, s) {
    const e = isString(n);
    let c = e ? "" : {};
    if (t) {
      const r = o.getComputedStyle(t, s) || t.style;
      c = e ? getCSSVal(r, n) : from(n).reduce((t, n) => (t[n] = getCSSVal(r, n), t), c);
    }
    return c;
  }
  const topRightBottomLeft = (t, n, o) => {
    const s = n ? `${n}-` : "", e = o ? `-${o}` : "", c = `${s}top${e}`, r = `${s}right${e}`, l = `${s}bottom${e}`, i = `${s}left${e}`, a = getStyles(t, [ c, r, l, i ]);
    return {
      t: parseToZeroOrNumber(a[c]),
      r: parseToZeroOrNumber(a[r]),
      b: parseToZeroOrNumber(a[l]),
      l: parseToZeroOrNumber(a[i])
    };
  }, getTrasformTranslateValue = (t, n) => "translate" + (isObject(t) ? `(${t.x},${t.y})` : `${n ? "X" : "Y"}(${t})`), I = {
    w: 0,
    h: 0
  }, getElmWidthHeightProperty = (t, n) => n ? {
    w: n[`${t}Width`],
    h: n[`${t}Height`]
  } : I, getWindowSize = t => getElmWidthHeightProperty("inner", t || o), A = bind(getElmWidthHeightProperty, "offset"), D = bind(getElmWidthHeightProperty, "client"), M = bind(getElmWidthHeightProperty, "scroll"), getFractionalSize = t => {
    const n = parseFloat(getStyles(t, C)) || 0, o = parseFloat(getStyles(t, x)) || 0;
    return {
      w: n - c(n),
      h: o - c(o)
    };
  }, getBoundingClientRect = t => t.getBoundingClientRect(), domRectHasDimensions = t => !!(t && (t[x] || t[C])), domRectAppeared = (t, n) => {
    const o = domRectHasDimensions(t);
    return !domRectHasDimensions(n) && o;
  }, removeEventListener = (t, n, o, s) => {
    each(getDomTokensArray(n), n => {
      t && t.removeEventListener(n, o, s);
    });
  }, addEventListener = (t, n, o, s) => {
    var e;
    const c = null == (e = s && s.H) || e, r = s && s.I || false, l = s && s.A || false, i = {
      passive: c,
      capture: r
    };
    return bind(runEachAndClear, getDomTokensArray(n).map(n => {
      const s = l ? e => {
        removeEventListener(t, n, s, r), o && o(e);
      } : o;
      return t && t.addEventListener(n, s, i), bind(removeEventListener, t, n, s, r);
    }));
  }, stopPropagation = t => t.stopPropagation(), preventDefault = t => t.preventDefault(), stopAndPrevent = t => stopPropagation(t) || preventDefault(t), scrollElementTo = (t, n) => {
    const {x: o, y: s} = isNumber(n) ? {
      x: n,
      y: n
    } : n || {};
    isNumber(o) && (t.scrollLeft = o), isNumber(s) && (t.scrollTop = s);
  }, getElementScroll = t => ({
    x: t.scrollLeft,
    y: t.scrollTop
  }), sanitizeScrollCoordinates = (t, n) => {
    const {D: o, M: s} = t, {w: e, h: c} = n, sanitizeAxis = (t, n, o) => {
      let s = l(t) * o, e = l(n) * o;
      if (s === e) {
        const o = r(t), c = r(n);
        e = o > c ? 0 : e, s = o < c ? 0 : s;
      }
      return s = s === e ? 0 : s, [ s + 0, e + 0 ];
    }, [i, a] = sanitizeAxis(o.x, s.x, e), [u, _] = sanitizeAxis(o.y, s.y, c);
    return {
      D: {
        x: i,
        y: u
      },
      M: {
        x: a,
        y: _
      }
    };
  }, isDefaultDirectionScrollCoordinates = ({D: t, M: n}) => {
    const getAxis = (t, n) => 0 === t && t <= n;
    return {
      x: getAxis(t.x, n.x),
      y: getAxis(t.y, n.y)
    };
  }, getScrollCoordinatesPercent = ({D: t, M: n}, o) => {
    const getAxis = (t, n, o) => capNumber(0, 1, (t - o) / (t - n) || 0);
    return {
      x: getAxis(t.x, n.x, o.x),
      y: getAxis(t.y, n.y, o.y)
    };
  }, focusElement = t => {
    t && t.focus && t.focus({
      preventScroll: true
    });
  }, manageListener = (t, n) => {
    each(createOrKeepArray(n), t);
  }, createEventListenerHub = t => {
    const n = new Map, removeEvent = (t, o) => {
      if (t) {
        const s = n.get(t);
        manageListener(t => {
          s && s[t ? "delete" : "clear"](t);
        }, o);
      } else n.forEach(t => {
        t.clear();
      }), n.clear();
    }, addEvent = (t, o) => {
      if (isString(t)) {
        const s = n.get(t) || new Set;
        return n.set(t, s), manageListener(t => {
          isFunction(t) && s.add(t);
        }, o), bind(removeEvent, t, o);
      }
      isBoolean(o) && o && removeEvent();
      const s = keys(t), e = [];
      return each(s, n => {
        const o = t[n];
        o && push(e, addEvent(n, o));
      }), bind(runEachAndClear, e);
    };
    return addEvent(t || {}), [ addEvent, removeEvent, (t, o) => {
      each(from(n.get(t)), t => {
        o && !isEmptyArray(o) ? t.apply(0, o) : t();
      });
    } ];
  }, opsStringify = t => JSON.stringify(t, (t, n) => {
    if (isFunction(n)) throw 0;
    return n;
  }), getPropByPath = (t, n) => t ? `${n}`.split(".").reduce((t, n) => t && hasOwnProperty(t, n) ? t[n] : void 0, t) : void 0, T = {
    paddingAbsolute: false,
    showNativeOverlaidScrollbars: false,
    update: {
      elementEvents: [ [ "img", "load" ] ],
      debounce: [ 0, 33 ],
      attributes: null,
      ignoreMutation: null
    },
    overflow: {
      x: "scroll",
      y: "scroll"
    },
    scrollbars: {
      theme: "os-theme-dark",
      visibility: "auto",
      autoHide: "never",
      autoHideDelay: 1300,
      autoHideSuspend: false,
      dragScroll: true,
      clickScroll: false,
      pointers: [ "mouse", "touch", "pen" ]
    }
  }, getOptionsDiff = (t, n) => {
    const o = {};
    return each(concat(keys(n), keys(t)), s => {
      const e = t[s], c = n[s];
      if (isObject(e) && isObject(c)) assignDeep(o[s] = {}, getOptionsDiff(e, c)), isEmptyObject(o[s]) && delete o[s]; else if (hasOwnProperty(n, s) && c !== e) {
        let t = true;
        if (isArray(e) || isArray(c)) try {
          opsStringify(e) === opsStringify(c) && (t = false);
        } catch (r) {}
        t && (o[s] = c);
      }
    }), o;
  }, createOptionCheck = (t, n, o) => s => [ getPropByPath(t, s), o || void 0 !== getPropByPath(n, s) ], k = "data-overlayscrollbars", R = "os-environment", V = `${R}-scrollbar-hidden`, L = `${k}-initialize`, U = "noClipping", P = `${k}-body`, N = k, j = `${k}-viewport`, B = O, F = $, X = "arrange", Y = "measuring", G = "scrollbarHidden", K = `${k}-padding`, Q = `${k}-content`, Z = "os-size-observer", tt = `${Z}-appear`, nt = `${Z}-listener`, ot = `${nt}-scroll`, st = `${nt}-item`, et = `${st}-final`, lt = "os-scrollbar", it = `${lt}-rtl`, at = `${lt}-horizontal`, ut = `${lt}-vertical`, _t = `${lt}-track`, dt = `${lt}-handle`, ft = `${lt}-visible`, vt = `${lt}-cornerless`, pt = `${lt}-interaction`, ht = `${lt}-unusable`, gt = `${lt}-auto-hide`, bt = `${gt}-hidden`, yt = `${lt}-wheel`, wt = `${_t}-interactive`, St = `${dt}-interactive`;
  let mt;
  let Ot;
  const createEnvironment = () => {
    const getNativeScrollbarSize = (t, n, o) => {
      appendChildren(document.body, t), appendChildren(document.body, t);
      const s = D(t), e = A(t), c = getFractionalSize(n);
      return o && removeElements(t), {
        x: e.h - s.h + c.h,
        y: e.w - s.w + c.w
      };
    }, s = createDOM(`<div class="${R}"><div></div><style>${`.${R}{scroll-behavior:auto!important;position:fixed;opacity:0;visibility:hidden;overflow:scroll;height:200px;width:200px;z-index:-1}.${R} div{width:200%;height:200%;margin:10px 0}.${V}{scrollbar-width:none!important}.${V}::-webkit-scrollbar,.${V}::-webkit-scrollbar-corner{appearance:none!important;display:none!important;width:0!important;height:0!important}`}</style></div>`)[0], e = s.firstChild, c = s.lastChild, r = mt;
    r && (c.nonce = r);
    const [l, , i] = createEventListenerHub(), [a, u] = createCache({
      o: getNativeScrollbarSize(s, e),
      i: equalXY
    }, bind(getNativeScrollbarSize, s, e, true)), [_] = u(), d = (t => {
      let n = false;
      const o = addClass(t, V);
      try {
        n = "none" === getStyles(t, "scrollbar-width") || "none" === getStyles(t, "display", "::-webkit-scrollbar");
      } catch (s) {}
      return o(), n;
    })(s), f = {
      x: 0 === _.x,
      y: 0 === _.y
    }, v = {
      elements: {
        host: null,
        padding: !d,
        viewport: t => d && isBodyElement(t) && t,
        content: false
      },
      scrollbars: {
        slot: true
      },
      cancel: {
        nativeScrollbarsOverlaid: false,
        body: null
      }
    }, h = assignDeep({}, T), g = bind(assignDeep, {}, h), b = bind(assignDeep, {}, v), y = {
      T: _,
      k: f,
      R: d,
      V: !!p,
      L: bind(l, "r"),
      U: b,
      P: t => assignDeep(v, t) && b(),
      N: g,
      q: t => assignDeep(h, t) && g(),
      j: assignDeep({}, v),
      B: assignDeep({}, h)
    };
    if (removeAttrs(s, "style"), removeElements(s), addEventListener(o, "resize", () => {
      i("r", []);
    }), isFunction(o.matchMedia) && !d && (!f.x || !f.y)) {
      const addZoomListener = t => {
        const n = o.matchMedia(`(resolution: ${o.devicePixelRatio}dppx)`);
        addEventListener(n, "change", () => {
          t(), addZoomListener(t);
        }, {
          A: true
        });
      };
      addZoomListener(() => {
        const [t, n] = a();
        assignDeep(y.T, t), i("r", [ n ]);
      });
    }
    return y;
  }, getEnvironment = () => (Ot || (Ot = createEnvironment()), Ot), resolveInitialization = (t, n) => isFunction(n) ? n.apply(0, t) : n, staticInitializationElement = (t, n, o, s) => {
    const e = isUndefined(s) ? o : s;
    return resolveInitialization(t, e) || n.apply(0, t);
  }, dynamicInitializationElement = (t, n, o, s) => {
    const e = isUndefined(s) ? o : s, c = resolveInitialization(t, e);
    return !!c && (isHTMLElement(c) ? c : n.apply(0, t));
  }, $t = new WeakMap, getInstance = t => $t.get(t), createDOMObserver = (t, n, o, s) => {
    let e = false;
    const {F: c, X: r, Y: l, W: i, G: a, J: u} = s || {}, _ = debounce(() => e && o(true), {
      _: 33,
      v: 99
    }), [f, v] = ((t, n, o) => {
      let s = false;
      const e = !!o && new WeakMap, updateElements = c => {
        if (e && o) {
          const r = o.map(n => {
            const [o, s] = n || [];
            return [ s && o ? (c || find)(o, t) : [], s ];
          });
          each(r, o => each(o[0], c => {
            const r = o[1], l = e.get(c) || [];
            if (t.contains(c) && r) {
              const t = addEventListener(c, r, o => {
                s ? (t(), e.delete(c)) : n(o);
              });
              e.set(c, push(l, t));
            } else runEachAndClear(l), e.delete(c);
          }));
        }
      };
      return updateElements(), [ () => {
        s = true;
      }, updateElements ];
    })(t, _, l), h = r || [], g = concat(c || [], h), observerCallback = (e, c) => {
      if (!isEmptyArray(c)) {
        const r = a || noop, l = u || noop, _ = [], d = [];
        let f = false, p = false;
        if (each(c, o => {
          const {attributeName: e, target: c, type: a, oldValue: u, addedNodes: v, removedNodes: g} = o, b = "attributes" === a, y = "childList" === a, w = t === c, S = b && e, m = S && getAttr(c, e || ""), O = isString(m) ? m : null, $ = S && u !== O, C = inArray(h, e) && $;
          if (n && (y || !w)) {
            const n = b && $, a = n && i && is(c, i), f = (a ? !r(c, e, u, O) : !b || n) && !l(o, !!a, t, s);
            each(v, t => push(_, t)), each(g, t => push(_, t)), p = p || f;
          }
          !n && w && $ && !r(c, e, u, O) && (push(d, e), f = f || C);
        }), v(t => deduplicateArray(_).reduce((n, o) => (push(n, find(t, o)), is(o, t) ? push(n, o) : n), [])), 
        n) return !e && p && o(false), [ false ];
        if (!isEmptyArray(d) || f) {
          const t = [ deduplicateArray(d), f ];
          return !e && o.apply(0, t), t;
        }
      }
    }, b = new d(bind(observerCallback, false));
    return [ () => (b.observe(t, {
      attributes: true,
      attributeOldValue: true,
      attributeFilter: g,
      subtree: n,
      childList: n,
      characterData: n
    }), e = true, () => {
      e && (f(), b.disconnect(), e = false);
    }), () => {
      if (e) return _.m(), observerCallback(true, b.takeRecords());
    } ];
  }, Ct = {}, xt = {}, registerPluginModuleInstances = (t, n, o) => keys(t).map(s => {
    const {static: e, instance: c} = t[s], [r, l, i] = o || [], a = o ? c : e;
    if (a) {
      const t = o ? a(r, l, n) : a(n);
      return (i || xt)[s] = t;
    }
  }), getStaticPluginModuleInstance = t => xt[t], Et = "__osSizeObserverPlugin", zt = (() => ({
    [Et]: {
      static: () => (t, n, o) => {
        const s = 3333333, e = "scroll", c = createDOM(`<div class="${st}" dir="ltr"><div class="${st}"><div class="${et}"></div></div><div class="${st}"><div class="${et}" style="width: 200%; height: 200%"></div></div></div>`), r = c[0], l = r.lastChild, u = r.firstChild, _ = null == u ? void 0 : u.firstChild;
        let p, d = A(r), f = d, v = false;
        const reset = () => {
          scrollElementTo(u, s), scrollElementTo(l, s);
        }, onResized = t => {
          p = 0, v && (d = f, n(true === t));
        }, onScroll = t => {
          f = A(r), v = !t || !equalWH(f, d), t ? (stopPropagation(t), v && !p && (i(p), p = a(onResized))) : onResized(false === t), 
          reset();
        }, h = [ appendChildren(t, c), addEventListener(u, e, onScroll), addEventListener(l, e, onScroll) ];
        return addClass(t, ot), setStyles(_, {
          [C]: s,
          [x]: s
        }), a(reset), [ o ? bind(onScroll, false) : reset, h ];
      }
    }
  }))(), getShowNativeOverlaidScrollbars = (t, n) => {
    const {k: o} = n, [s, e] = t("showNativeOverlaidScrollbars");
    return [ s && o.x && o.y, e ];
  }, overflowIsVisible = t => 0 === t.indexOf(H), createViewportOverflowState = (t, n) => {
    const getAxisOverflowStyle = (t, n, o, s) => {
      const e = t === H ? E : t.replace(`${H}-`, ""), c = overflowIsVisible(t), r = overflowIsVisible(o);
      if (!n && !s) return E;
      if (c && r) return H;
      if (c) {
        return n && s ? e : n ? H : E;
      }
      return n ? e : r && s ? H : E;
    }, o = {
      x: getAxisOverflowStyle(n.x, t.x, n.y, t.y),
      y: getAxisOverflowStyle(n.y, t.y, n.x, t.x)
    };
    return {
      K: o,
      Z: {
        x: o.x === z,
        y: o.y === z
      }
    };
  }, It = "__osScrollbarsHidingPlugin", At = (() => ({
    [It]: {
      static: () => ({
        tt: (t, n, o, s, e) => {
          const {nt: c, ot: r} = t, {R: l, k: i, T: a} = s, u = !c && !l && (i.x || i.y), [_] = getShowNativeOverlaidScrollbars(e, s), _getViewportOverflowHideOffset = t => {
            const {Z: n} = t, o = l || _ ? 0 : 42, getHideOffsetPerAxis = (t, n, s) => [ n && !l ? t ? o : s : 0, t && !!o ], [s, e] = getHideOffsetPerAxis(i.x, n.x, a.x), [c, r] = getHideOffsetPerAxis(i.y, n.y, a.y);
            return {
              st: {
                x: s,
                y: c
              },
              et: {
                x: e,
                y: r
              }
            };
          }, _hideNativeScrollbars = (t, {ct: o}, s) => {
            if (!c) {
              const e = assignDeep({}, {
                [S]: 0,
                [m]: 0,
                [w]: 0
              }), {st: c, et: r} = _getViewportOverflowHideOffset(t), {x: l, y: i} = r, {x: a, y: u} = c, {rt: _} = n, d = o ? w : S, f = o ? b : g, v = _[d], p = _[m], h = _[f], O = _[y];
              return e[C] = `calc(100% + ${u + -1 * v}px)`, e[d] = -u + v, e[m] = -a + p, s && (e[f] = h + (i ? u : 0), 
              e[y] = O + (l ? a : 0)), e;
            }
          };
          return {
            lt: _getViewportOverflowHideOffset,
            it: (t, s, e) => {
              if (u) {
                const {rt: c} = n, {st: l, et: i} = _getViewportOverflowHideOffset(t), {x: a, y: u} = i, {x: _, y: d} = l, {ct: f} = o, p = c[f ? g : b], h = c.paddingTop, y = s.w + e.w, w = s.h + e.h, S = {
                  w: d && u ? d + y - p + "px" : "",
                  h: _ && a ? _ + w - h + "px" : ""
                };
                setStyles(r, {
                  "--os-vaw": S.w,
                  "--os-vah": S.h
                });
              }
              return u;
            },
            ut: t => {
              if (u) {
                const s = t || (() => {
                  const getStatePerAxis = t => {
                    const n = getStyles(r, t);
                    return [ n, n === z ];
                  }, [t, n] = getStatePerAxis(O), [o, s] = getStatePerAxis($);
                  return {
                    K: {
                      x: t,
                      y: o
                    },
                    Z: {
                      x: n,
                      y: s
                    }
                  };
                })(), {rt: e} = n, {et: c} = _getViewportOverflowHideOffset(s), {x: l, y: i} = c, a = {}, assignProps = t => each(t, t => {
                  a[t] = e[t];
                });
                l && assignProps([ m, h, y ]), i && assignProps([ w, S, b, g ]);
                const _ = getStyles(r, keys(a)), d = removeAttrClass(r, j, X);
                return setStyles(r, a), [ () => {
                  setStyles(r, assignDeep({}, _, _hideNativeScrollbars(s, o, u))), d();
                }, s ];
              }
              return [ noop ];
            },
            _t: _hideNativeScrollbars
          };
        }
      })
    }
  }))(), Dt = "__osClickScrollPlugin", Mt = (() => ({
    [Dt]: {
      static: () => (t, n, o, s) => {
        let e = false, c = noop;
        const [i, a] = selfClearTimeout(133), u = Math.sign(n), _ = o * u, d = _ / 2, easing = t => 1 - (1 - t) * (1 - t), easedEndPressAnimation = (n, o) => animateNumber(n, o, 222, t, easing), linearPressAnimation = (o, s) => animateNumber(o, n - _, 133 * s, (o, s, e) => {
          t(o), e && (c = easedEndPressAnimation(o, n));
        }), f = animateNumber(0, _, 222, (r, l, a) => {
          if (t(r), a && (s(e), !e)) {
            const t = n - r;
            Math.sign(t - d) === u && i(() => {
              const s = t - _, e = Math.sign(s) === u;
              c = e ? linearPressAnimation(r, Math.abs(s) / o) : easedEndPressAnimation(r, n);
            });
          }
        }, easing);
        return t => {
          e = true, t && f(), a(), c();
        };
      }
    }
  }))(), createSizeObserver = (t, n, o) => {
    const {dt: s} = o || {}, e = getStaticPluginModuleInstance(Et), [c] = createCache({
      o: false,
      u: true
    });
    return () => {
      const o = [], l = createDOM(`<div class="${Z}"><div class="${nt}"></div></div>`)[0], i = l.firstChild, onSizeChangedCallbackProxy = t => {
        let s = false, e = false;
        if (t instanceof ResizeObserverEntry) {
          const [n, , o] = c(t.contentRect), r = domRectHasDimensions(n);
          e = domRectAppeared(n, o), s = !e && !r;
        } else e = true === t;
        s || n({
          ft: true,
          dt: e
        });
      };
      if (v) {
        const t = new v(t => onSizeChangedCallbackProxy(t.pop()));
        t.observe(i), push(o, () => {
          t.disconnect();
        });
      } else {
        if (!e) return noop;
        {
          const [t, n] = e(i, onSizeChangedCallbackProxy, s);
          push(o, concat([ addClass(l, tt), addEventListener(l, "animationstart", t) ], n));
        }
      }
      return bind(runEachAndClear, push(o, appendChildren(t, l)));
    };
  }, createTrinsicObserver = (t, n) => {
    let o;
    const s = createDiv("os-trinsic-observer"), [e] = createCache({
      o: false
    }), triggerOnTrinsicChangedCallback = (t, o) => {
      if (t) {
        const s = e((t => 0 === t.h || t.isIntersecting || t.intersectionRatio > 0)(t)), [, c] = s;
        return c && !o && n(s) && [ s ];
      }
    }, intersectionObserverCallback = (t, n) => triggerOnTrinsicChangedCallback(n.pop(), t);
    return [ () => {
      const n = [];
      if (f) o = new f(bind(intersectionObserverCallback, false), {
        root: t
      }), o.observe(s), push(n, () => {
        o.disconnect();
      }); else {
        const onSizeChanged = () => {
          const t = A(s);
          triggerOnTrinsicChangedCallback(t);
        };
        push(n, createSizeObserver(s, onSizeChanged)()), onSizeChanged();
      }
      return bind(runEachAndClear, push(n, appendChildren(t, s)));
    }, () => o && intersectionObserverCallback(true, o.takeRecords()) ];
  }, createObserversSetup = (t, n, o, s) => {
    let e, c, r, l, i, a;
    const u = `[${N}]`, _ = `[${j}]`, d = [ "id", "class", "style", "open", "wrap", "cols", "rows" ], {vt: f, ht: p, ot: h, gt: g, bt: b, nt: y, yt: w, wt: S, St: m, Ot: O} = t, getDirectionIsRTL = t => "rtl" === getStyles(t, "direction"), $ = {
      $t: false,
      ct: getDirectionIsRTL(f)
    }, C = getEnvironment(), x = getStaticPluginModuleInstance(It), [H] = createCache({
      i: equalWH,
      o: {
        w: 0,
        h: 0
      }
    }, () => {
      const s = x && x.tt(t, n, $, C, o).ut, c = !(w && y) && hasAttrClass(p, N, U), r = !y && S(X), l = r && getElementScroll(g), i = l && O(), a = m(Y, c), u = r && s && s()[0], _ = M(h), d = getFractionalSize(h);
      return u && u(), scrollElementTo(g, l), i && i(), c && a(), {
        w: _.w + d.w,
        h: _.h + d.h
      };
    }), E = debounce(s, {
      _: () => e,
      v: () => c,
      S(t, n) {
        const [o] = t, [s] = n;
        return [ concat(keys(o), keys(s)).reduce((t, n) => (t[n] = o[n] || s[n], t), {}) ];
      }
    }), setDirection = t => {
      const n = getDirectionIsRTL(f);
      assignDeep(t, {
        Ct: a !== n
      }), assignDeep($, {
        ct: n
      }), a = n;
    }, onTrinsicChanged = (t, n) => {
      const [o, e] = t, c = {
        xt: e
      };
      return assignDeep($, {
        $t: o
      }), !n && s(c), c;
    }, onSizeChanged = ({ft: t, dt: n}) => {
      const e = !(t && !n) && C.R ? E : s, c = {
        ft: t || n,
        dt: n
      };
      setDirection(c), e(c);
    }, onContentMutation = (t, n) => {
      const [, o] = H(), e = {
        Ht: o
      };
      setDirection(e);
      return o && !n && (t ? s : E)(e), e;
    }, onHostMutation = (t, n, o) => {
      const s = {
        Et: n
      };
      return setDirection(s), n && !o && E(s), s;
    }, [z, I] = b ? createTrinsicObserver(p, onTrinsicChanged) : [], A = !y && createSizeObserver(p, onSizeChanged, {
      dt: true
    }), [D, T] = createDOMObserver(p, false, onHostMutation, {
      X: d,
      F: d
    }), k = y && v && new v(t => {
      const n = t[t.length - 1].contentRect;
      onSizeChanged({
        ft: true,
        dt: domRectAppeared(n, i)
      }), i = n;
    }), R = debounce(() => {
      const [, t] = H();
      s({
        Ht: t
      });
    }, {
      _: 222,
      p: true
    });
    return [ () => {
      k && k.observe(p);
      const t = A && A(), n = z && z(), o = D(), s = C.L(t => {
        t ? E({
          zt: t
        }) : R();
      });
      return () => {
        k && k.disconnect(), t && t(), n && n(), l && l(), o(), s();
      };
    }, ({It: t, At: n, Dt: o}) => {
      const s = {}, [i] = t("update.ignoreMutation"), [a, f] = t("update.attributes"), [v, p] = t("update.elementEvents"), [g, w] = t("update.debounce"), m = n || o;
      if (p || f) {
        r && r(), l && l();
        const [t, n] = createDOMObserver(b || h, true, onContentMutation, {
          F: concat(d, a || []),
          Y: v,
          W: u,
          J: (t, n) => {
            const {target: o, attributeName: s} = t;
            return !(n || !s || y) && liesBetween(o, u, _) || !!closest(o, `.${lt}`) || !!(t => isFunction(i) && i(t))(t);
          }
        });
        l = t(), r = n;
      }
      if (w) if (E.m(), isArray(g)) {
        const t = g[0], n = g[1];
        e = isNumber(t) && t, c = isNumber(n) && n;
      } else isNumber(g) ? (e = g, c = false) : (e = false, c = false);
      if (m) {
        const t = T(), n = I && I(), o = r && r();
        t && assignDeep(s, onHostMutation(t[0], t[1], m)), n && assignDeep(s, onTrinsicChanged(n[0], m)), 
        o && assignDeep(s, onContentMutation(o[0], m));
      }
      return setDirection(s), s;
    }, $ ];
  }, createScrollbarsSetupElements = (t, n, o, s) => {
    const e = "--os-viewport-percent", c = "--os-scroll-percent", r = "--os-scroll-direction", {U: l} = getEnvironment(), {scrollbars: i} = l(), {slot: a} = i, {vt: u, ht: _, ot: d, Mt: f, gt: v, yt: h, nt: g} = n, {scrollbars: b} = f ? {} : t, {slot: y} = b || {}, w = [], S = [], m = [], O = dynamicInitializationElement([ u, _, d ], () => g && h ? u : _, a, y), initScrollTimeline = t => {
      if (p) {
        const n = new p({
          source: v,
          axis: t
        }), _addScrollPercentAnimation = t => {
          const o = t.Tt.animate({
            clear: [ "left" ],
            [c]: [ 0, 1 ]
          }, {
            timeline: n
          });
          return () => o.cancel();
        };
        return {
          kt: _addScrollPercentAnimation
        };
      }
    }, $ = {
      x: initScrollTimeline("x"),
      y: initScrollTimeline("y")
    }, scrollbarStructureAddRemoveClass = (t, n, o) => {
      const s = o ? addClass : removeClass;
      each(t, t => {
        s(t.Tt, n);
      });
    }, scrollbarStyle = (t, n) => {
      each(t, t => {
        const [o, s] = n(t);
        setStyles(o, s);
      });
    }, scrollbarsAddRemoveClass = (t, n, o) => {
      const s = isBoolean(o), c = !s || !o;
      (!s || o) && scrollbarStructureAddRemoveClass(S, t, n), c && scrollbarStructureAddRemoveClass(m, t, n);
    }, generateScrollbarDOM = t => {
      const n = t ? "x" : "y", e = createDiv(`${lt} ${t ? at : ut}`), c = createDiv(_t), r = createDiv(dt), l = {
        Tt: e,
        Ut: c,
        Pt: r
      }, i = $[n];
      return push(t ? S : m, l), push(w, [ appendChildren(e, c), appendChildren(c, r), bind(removeElements, e), i && i.kt(l), s(l, scrollbarsAddRemoveClass, t) ]), 
      l;
    }, C = bind(generateScrollbarDOM, true), x = bind(generateScrollbarDOM, false);
    return C(), x(), [ {
      Nt: () => {
        const t = (() => {
          const {Rt: t, Vt: n} = o, getAxisValue = (t, n) => capNumber(0, 1, t / (t + n) || 0);
          return {
            x: getAxisValue(n.x, t.x),
            y: getAxisValue(n.y, t.y)
          };
        })(), createScrollbarStyleFn = t => n => [ n.Tt, {
          [e]: roundCssNumber(t) + ""
        } ];
        scrollbarStyle(S, createScrollbarStyleFn(t.x)), scrollbarStyle(m, createScrollbarStyleFn(t.y));
      },
      qt: () => {
        if (!p) {
          const {Lt: t} = o, n = getScrollCoordinatesPercent(t, getElementScroll(v)), createScrollbarStyleFn = t => n => [ n.Tt, {
            [c]: roundCssNumber(t) + ""
          } ];
          scrollbarStyle(S, createScrollbarStyleFn(n.x)), scrollbarStyle(m, createScrollbarStyleFn(n.y));
        }
      },
      jt: () => {
        const {Lt: t} = o, n = isDefaultDirectionScrollCoordinates(t), createScrollbarStyleFn = t => n => [ n.Tt, {
          [r]: t ? "0" : "1"
        } ];
        scrollbarStyle(S, createScrollbarStyleFn(n.x)), scrollbarStyle(m, createScrollbarStyleFn(n.y));
      },
      Bt: () => {
        if (g && !h) {
          const {Rt: t, Lt: n} = o, s = isDefaultDirectionScrollCoordinates(n), e = getScrollCoordinatesPercent(n, getElementScroll(v)), styleScrollbarPosition = n => {
            const {Tt: o} = n, c = parent(o) === d && o, getTranslateValue = (t, n, o) => {
              const s = n * t;
              return numberToCssPx(o ? s : -s);
            };
            return [ c, c && {
              transform: getTrasformTranslateValue({
                x: getTranslateValue(e.x, t.x, s.x),
                y: getTranslateValue(e.y, t.y, s.y)
              })
            } ];
          };
          scrollbarStyle(S, styleScrollbarPosition), scrollbarStyle(m, styleScrollbarPosition);
        }
      },
      Ft: scrollbarsAddRemoveClass,
      Xt: {
        Yt: S,
        Wt: C,
        Gt: bind(scrollbarStyle, S)
      },
      Jt: {
        Yt: m,
        Wt: x,
        Gt: bind(scrollbarStyle, m)
      }
    }, () => (appendChildren(O, S[0].Tt), appendChildren(O, m[0].Tt), bind(runEachAndClear, w)) ];
  }, createScrollbarsSetupEvents = (t, n, o, s) => (e, l, i) => {
    const {ht: a, ot: _, nt: d, gt: f, Kt: v, Ot: p} = n, {Tt: h, Ut: g, Pt: b} = e, [y, w] = selfClearTimeout(333), [S, m] = selfClearTimeout(444), scrollOffsetElementScrollBy = t => {
      isFunction(f.scrollBy) && f.scrollBy({
        behavior: "smooth",
        left: t.x,
        top: t.y
      });
    };
    let O = true;
    return bind(runEachAndClear, [ addEventListener(b, "pointermove pointerleave", s), addEventListener(h, "pointerenter", () => {
      l(pt, true);
    }), addEventListener(h, "pointerleave pointercancel", () => {
      l(pt, false);
    }), !d && addEventListener(h, "mousedown", () => {
      const t = getFocusedElement();
      (hasAttr(t, j) || hasAttr(t, N) || t === document.body) && u(bind(focusElement, _), 25);
    }), addEventListener(h, "wheel", t => {
      const {deltaX: n, deltaY: o, deltaMode: s} = t;
      O && 0 === s && parent(h) === a && scrollOffsetElementScrollBy({
        x: n,
        y: o
      }), O = false, l(yt, true), y(() => {
        O = true, l(yt);
      }), preventDefault(t);
    }, {
      H: false,
      I: true
    }), addEventListener(h, "pointerdown", bind(addEventListener, v, "click", stopAndPrevent, {
      A: true,
      I: true,
      H: false
    }), {
      I: true
    }), (() => {
      const n = "pointerup pointercancel lostpointercapture", s = "client" + (i ? "X" : "Y"), e = i ? C : x, l = i ? "left" : "top", a = i ? "w" : "h", u = i ? "x" : "y", createRelativeHandleMove = (t, n) => s => {
        const {Rt: e} = o, c = A(g)[a] - A(b)[a], l = n * s / c * e[u];
        scrollElementTo(f, {
          [u]: t + l
        });
      }, _ = [];
      return addEventListener(g, "pointerdown", o => {
        const i = closest(o.target, `.${dt}`) === b, d = i ? b : g, h = t.scrollbars, y = h[i ? "dragScroll" : "clickScroll"], {button: w, isPrimary: O, pointerType: $} = o, {pointers: C} = h;
        if (0 === w && O && y && (C || []).includes($)) {
          runEachAndClear(_), m();
          const t = !i && (o.shiftKey || "instant" === y), h = bind(getBoundingClientRect, b), w = bind(getBoundingClientRect, g), getHandleOffset = (t, n) => (t || h())[l] - (n || w())[l], O = c(getBoundingClientRect(f)[e]) / A(f)[a] || 1, $ = createRelativeHandleMove(getElementScroll(f)[u], 1 / O), C = o[s], x = h(), H = w(), E = x[e], z = getHandleOffset(x, H) + E / 2, I = C - H[l], D = i ? 0 : I - z, releasePointerCapture = t => {
            runEachAndClear(k), d.releasePointerCapture(t.pointerId);
          }, M = i || t, T = p(), k = [ addEventListener(v, n, releasePointerCapture), addEventListener(v, "selectstart", t => preventDefault(t), {
            H: false
          }), addEventListener(g, n, releasePointerCapture), M && addEventListener(g, "pointermove", t => $(D + (t[s] - C))), M && (() => {
            const t = getElementScroll(f);
            T();
            const n = getElementScroll(f), o = {
              x: n.x - t.x,
              y: n.y - t.y
            };
            (r(o.x) > 3 || r(o.y) > 3) && (p(), scrollElementTo(f, t), scrollOffsetElementScrollBy(o), 
            S(T));
          }) ];
          if (d.setPointerCapture(o.pointerId), t) $(D); else if (!i) {
            const t = getStaticPluginModuleInstance(Dt);
            if (t) {
              const n = t($, D, E, t => {
                t ? T() : push(k, T);
              });
              push(k, n), push(_, bind(n, true));
            }
          }
        }
      });
    })(), w, m ]);
  }, createStructureSetupElements = t => {
    const n = getEnvironment(), {U: s, R: e} = n, {elements: c} = s(), {padding: r, viewport: l, content: i} = c, a = isHTMLElement(t), u = a ? {} : t, {elements: _} = u, {padding: d, viewport: f, content: v} = _ || {}, p = a ? t : u.target, h = isBodyElement(p), g = p.ownerDocument, b = g.documentElement, getDocumentWindow = () => g.defaultView || o, y = bind(staticInitializationElement, [ p ]), w = bind(dynamicInitializationElement, [ p ]), S = bind(createDiv, ""), m = bind(y, S, l), C = bind(w, S, i), x = m(f), H = x === p, E = H && h, z = !H && C(v), I = !H && x === z, D = E ? b : x, T = E ? D : p, k = !H && w(S, r, d), R = !I && z, V = [ R, D, k, T ].map(t => isHTMLElement(t) && !parent(t) && t), elementIsGenerated = t => t && inArray(V, t), U = !elementIsGenerated(D) && (t => {
      const n = A(t), o = M(t), s = getStyles(t, O), e = getStyles(t, $);
      return o.w - n.w > 0 && !overflowIsVisible(s) || o.h - n.h > 0 && !overflowIsVisible(e);
    })(D) ? D : p, B = E ? b : D, X = {
      vt: p,
      ht: T,
      ot: D,
      ln: k,
      bt: R,
      gt: B,
      Qt: E ? g : D,
      an: h ? b : U,
      Kt: g,
      yt: h,
      Mt: a,
      nt: H,
      un: getDocumentWindow,
      wt: t => hasAttrClass(D, j, t),
      St: (t, n) => addRemoveAttrClass(D, j, t, n),
      Ot: () => addRemoveAttrClass(B, j, "scrolling", true)
    }, {vt: Y, ht: J, ln: Z, ot: tt, bt: nt} = X, ot = [ () => {
      removeAttrs(J, [ N, L ]), removeAttrs(Y, L), h && removeAttrs(b, [ L, N ]);
    } ];
    let st = contents([ nt, tt, Z, J, Y ].find(t => t && !elementIsGenerated(t)));
    const et = E ? Y : nt || tt, ct = bind(runEachAndClear, ot);
    return [ X, () => {
      const t = getDocumentWindow(), n = getFocusedElement(), unwrap = t => {
        appendChildren(parent(t), contents(t)), removeElements(t);
      }, prepareWrapUnwrapFocus = t => addEventListener(t, "focusin focusout focus blur", stopAndPrevent, {
        I: true,
        H: false
      }), o = "tabindex", s = getAttr(tt, o), c = prepareWrapUnwrapFocus(n);
      return setAttrs(J, N, H ? "" : "host"), setAttrs(Z, K, ""), setAttrs(tt, j, ""), 
      setAttrs(nt, Q, ""), H || (setAttrs(tt, o, s || "-1"), h && setAttrs(b, P, "")), 
      appendChildren(et, st), appendChildren(J, Z), appendChildren(Z || J, !H && tt), 
      appendChildren(tt, nt), push(ot, [ c, () => {
        const t = getFocusedElement(), n = elementIsGenerated(tt), e = n && t === tt ? Y : t, c = prepareWrapUnwrapFocus(e);
        removeAttrs(Z, K), removeAttrs(nt, Q), removeAttrs(tt, j), h && removeAttrs(b, P), 
        s ? setAttrs(tt, o, s) : removeAttrs(tt, o), elementIsGenerated(nt) && unwrap(nt), 
        n && unwrap(tt), elementIsGenerated(Z) && unwrap(Z), focusElement(e), c();
      } ]), e && !H && (addAttrClass(tt, j, G), push(ot, bind(removeAttrs, tt, j))), focusElement(!H && h && n === Y && t.top === t ? tt : n), 
      c(), st = 0, ct;
    }, ct ];
  }, createTrinsicUpdateSegment = ({bt: t}) => ({Zt: n, _n: o, Dt: s}) => {
    const {xt: e} = n || {}, {$t: c} = o;
    t && (e || s) && setStyles(t, {
      [x]: c && "100%"
    });
  }, createPaddingUpdateSegment = ({ht: t, ln: n, ot: o, nt: s}, e) => {
    const [c, r] = createCache({
      i: equalTRBL,
      o: topRightBottomLeft()
    }, bind(topRightBottomLeft, t, "padding", ""));
    return ({It: t, Zt: l, _n: i, Dt: a}) => {
      let [u, _] = r(a);
      const {R: d} = getEnvironment(), {ft: f, Ht: v, Ct: p} = l || {}, {ct: O} = i, [$, x] = t("paddingAbsolute");
      (f || _ || (a || v)) && ([u, _] = c(a));
      const E = !s && (x || p || _);
      if (E) {
        const t = !$ || !n && !d, s = u.r + u.l, c = u.t + u.b, r = {
          [S]: t && !O ? -s : 0,
          [m]: t ? -c : 0,
          [w]: t && O ? -s : 0,
          top: t ? -u.t : 0,
          right: t ? O ? -u.r : "auto" : 0,
          left: t ? O ? "auto" : -u.l : 0,
          [C]: t && `calc(100% + ${s}px)`
        }, l = {
          [h]: t ? u.t : 0,
          [g]: t ? u.r : 0,
          [y]: t ? u.b : 0,
          [b]: t ? u.l : 0
        };
        setStyles(n || o, r), setStyles(o, l), assignDeep(e, {
          ln: u,
          dn: !t,
          rt: n ? l : assignDeep({}, r, l)
        });
      }
      return {
        fn: E
      };
    };
  }, createOverflowUpdateSegment = (t, n) => {
    const e = getEnvironment(), {ht: c, ln: r, ot: l, nt: i, Qt: u, gt: _, yt: d, St: f, un: v} = t, {R: p} = e, h = d && i, g = bind(s, 0), b = {
      display: () => false,
      direction: t => "ltr" !== t,
      flexDirection: t => t.endsWith("-reverse"),
      writingMode: t => "horizontal-tb" !== t
    }, y = keys(b), w = {
      i: equalWH,
      o: {
        w: 0,
        h: 0
      }
    }, S = {
      i: equalXY,
      o: {}
    }, setMeasuringMode = t => {
      f(Y, !h && t);
    }, getMeasuredScrollCoordinates = t => {
      const n = y.some(n => {
        const o = t[n];
        return o && b[n](o);
      });
      if (!n) return {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 1,
          y: 1
        }
      };
      setMeasuringMode(true);
      const o = getElementScroll(_), s = f("noContent", true), e = addEventListener(u, z, t => {
        const n = getElementScroll(_);
        t.isTrusted && n.x === o.x && n.y === o.y && stopPropagation(t);
      }, {
        I: true,
        A: true
      });
      scrollElementTo(_, {
        x: 0,
        y: 0
      }), s();
      const c = getElementScroll(_), r = M(_);
      scrollElementTo(_, {
        x: r.w,
        y: r.h
      });
      const l = getElementScroll(_);
      scrollElementTo(_, {
        x: l.x - c.x < 1 && -r.w,
        y: l.y - c.y < 1 && -r.h
      });
      const i = getElementScroll(_);
      return scrollElementTo(_, o), a(() => e()), {
        D: c,
        M: i
      };
    }, getOverflowAmount = (t, n) => {
      const s = o.devicePixelRatio % 1 != 0 ? 1 : 0, e = {
        w: g(t.w - n.w),
        h: g(t.h - n.h)
      };
      return {
        w: e.w > s ? e.w : 0,
        h: e.h > s ? e.h : 0
      };
    }, [m, O] = createCache(w, bind(getFractionalSize, l)), [$, C] = createCache(w, bind(M, l)), [x, I] = createCache(w), [A] = createCache(S), [T, k] = createCache(w), [R] = createCache(S), [V] = createCache({
      i: (t, n) => equal(t, n, y),
      o: {}
    }, () => (t => !!t && (t => !!(t.offsetWidth || t.offsetHeight || t.getClientRects().length))(t))(l) ? getStyles(l, y) : {}), [L, P] = createCache({
      i: (t, n) => equalXY(t.D, n.D) && equalXY(t.M, n.M),
      o: {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 0,
          y: 0
        }
      }
    }), q = getStaticPluginModuleInstance(It), createViewportOverflowStyleClassName = (t, n) => `${n ? B : F}${(t => {
      const n = String(t || "");
      return n ? n[0].toUpperCase() + n.slice(1) : "";
    })(t)}`, setViewportOverflowStyle = t => {
      const createAllOverflowStyleClassNames = t => [ H, E, z ].map(n => createViewportOverflowStyleClassName(n, t)), n = createAllOverflowStyleClassNames(true).concat(createAllOverflowStyleClassNames()).join(" ");
      f(n), f(keys(t).map(n => createViewportOverflowStyleClassName(t[n], "x" === n)).join(" "), true);
    };
    return ({It: o, Zt: s, _n: i, Dt: a}, {fn: u}) => {
      const {ft: _, Ht: d, Ct: b, dt: y, zt: w} = s || {}, S = q && q.tt(t, n, i, e, o), {it: H, ut: E, _t: z} = S || {}, [M, j] = getShowNativeOverlaidScrollbars(o, e), [B, F] = o("overflow"), X = overflowIsVisible(B.x), Y = overflowIsVisible(B.y);
      let J = O(a), Q = C(a), Z = I(a), tt = k(a);
      j && p && f(G, !M);
      {
        hasAttrClass(c, N, U) && setMeasuringMode(true);
        const [t] = E ? E() : [], [n] = J = m(a), [o] = Q = $(a), s = D(l), e = h && getWindowSize(v()), r = {
          w: g(o.w + n.w),
          h: g(o.h + n.h)
        }, i = {
          w: g((e ? e.w : s.w + g(s.w - o.w)) + n.w),
          h: g((e ? e.h : s.h + g(s.h - o.h)) + n.h)
        };
        t && t(), tt = T(i), Z = x(getOverflowAmount(r, i), a);
      }
      const [nt, ot] = tt, [st, et] = Z, [ct, rt] = Q, [lt, it] = J, [at, ut] = A({
        x: st.w > 0,
        y: st.h > 0
      }), _t = X && Y && (at.x || at.y) || X && at.x && !at.y || Y && at.y && !at.x, dt = u || b || w || it || rt || ot || et || F || j || true, ft = createViewportOverflowState(at, B), [vt, pt] = R(ft.K), [ht, gt] = V(a), bt = b || y || gt || ut || a, [yt, wt] = bt ? L(getMeasuredScrollCoordinates(ht), a) : P();
      return dt && (pt && setViewportOverflowStyle(ft.K), z && H && setStyles(l, z(ft, i, H(ft, ct, lt)))), 
      setMeasuringMode(false), addRemoveAttrClass(c, N, U, _t), addRemoveAttrClass(r, K, U, _t), 
      assignDeep(n, {
        K: vt,
        Vt: {
          x: nt.w,
          y: nt.h
        },
        Rt: {
          x: st.w,
          y: st.h
        },
        rn: at,
        Lt: sanitizeScrollCoordinates(yt, st)
      }), {
        en: pt,
        nn: ot,
        sn: et,
        cn: wt || et,
        vn: bt
      };
    };
  }, createStructureSetup = t => {
    const [n, o, s] = createStructureSetupElements(t), e = {
      ln: {
        t: 0,
        r: 0,
        b: 0,
        l: 0
      },
      dn: false,
      rt: {
        [S]: 0,
        [m]: 0,
        [w]: 0,
        [h]: 0,
        [g]: 0,
        [y]: 0,
        [b]: 0
      },
      Vt: {
        x: 0,
        y: 0
      },
      Rt: {
        x: 0,
        y: 0
      },
      K: {
        x: E,
        y: E
      },
      rn: {
        x: false,
        y: false
      },
      Lt: {
        D: {
          x: 0,
          y: 0
        },
        M: {
          x: 0,
          y: 0
        }
      }
    }, {vt: c, gt: r, nt: l, Ot: i} = n, {R: a, k: u} = getEnvironment(), _ = !a && (u.x || u.y), d = [ createTrinsicUpdateSegment(n), createPaddingUpdateSegment(n, e), createOverflowUpdateSegment(n, e) ];
    return [ o, t => {
      const n = {}, s = _ && getElementScroll(r), e = s && i();
      return each(d, o => {
        assignDeep(n, o(t, n) || {});
      }), scrollElementTo(r, s), e && e(), !l && scrollElementTo(c, 0), n;
    }, e, n, s ];
  }, createSetups = (t, n, o, s, e) => {
    let c = false;
    const r = createOptionCheck(n, {}), [l, i, a, u, _] = createStructureSetup(t), [d, f, v] = createObserversSetup(u, a, r, t => {
      update({}, t);
    }), [p, h, , g] = ((t, n, o, s, e, c) => {
      let r, l, i, a, u, _ = noop, d = 0;
      const isHoverablePointerType = t => "mouse" === t.pointerType, [f, v] = selfClearTimeout(), [p, h] = selfClearTimeout(100), [g, b] = selfClearTimeout(100), [y, w] = selfClearTimeout(() => d), [S, m] = createScrollbarsSetupElements(t, e, s, createScrollbarsSetupEvents(n, e, s, t => isHoverablePointerType(t) && manageScrollbarsAutoHideInstantInteraction())), {ht: O, Qt: $, yt: C} = e, {Ft: x, Nt: E, qt: I, jt: A, Bt: D} = S, manageScrollbarsAutoHide = (t, n) => {
        if (w(), t) x(bt); else {
          const t = bind(x, bt, true);
          d > 0 && !n ? y(t) : t();
        }
      }, manageScrollbarsAutoHideInstantInteraction = () => {
        (i ? r : a) || (manageScrollbarsAutoHide(true), p(() => {
          manageScrollbarsAutoHide(false);
        }));
      }, manageAutoHideSuspension = t => {
        x(gt, t, true), x(gt, t, false);
      }, onHostMouseEnter = t => {
        isHoverablePointerType(t) && (r = i, i && manageScrollbarsAutoHide(true));
      }, M = [ w, h, b, v, () => _(), addEventListener(O, "pointerover", onHostMouseEnter, {
        A: true
      }), addEventListener(O, "pointerenter", onHostMouseEnter), addEventListener(O, "pointerleave", t => {
        isHoverablePointerType(t) && (r = false, i && manageScrollbarsAutoHide(false));
      }), addEventListener(O, "pointermove", t => {
        isHoverablePointerType(t) && l && manageScrollbarsAutoHideInstantInteraction();
      }), addEventListener($, "scroll", t => {
        f(() => {
          I(), manageScrollbarsAutoHideInstantInteraction();
        }), c(t), D();
      }) ];
      return [ () => bind(runEachAndClear, push(M, m())), ({It: t, Dt: n, Zt: e, tn: c}) => {
        const {nn: r, sn: f, en: v, cn: p} = c || {}, {Ct: h, dt: b} = e || {}, {ct: y} = o, {k: w} = getEnvironment(), {K: S, rn: m} = s, [O, M] = t("showNativeOverlaidScrollbars"), [T, k] = t("scrollbars.theme"), [R, V] = t("scrollbars.visibility"), [L, U] = t("scrollbars.autoHide"), [P, N] = t("scrollbars.autoHideSuspend"), [q] = t("scrollbars.autoHideDelay"), [j, B] = t("scrollbars.dragScroll"), [F, X] = t("scrollbars.clickScroll"), [Y, W] = t("overflow"), G = b && !n, J = m.x || m.y, K = r || f || p || h || n, Q = v || V || W, Z = O && w.x && w.y, setScrollbarVisibility = (t, n, o) => {
          const s = t.includes(z) && (R === H || "auto" === R && n === z);
          return x(ft, s, o), s;
        };
        if (d = q, G && (P && J ? (manageAutoHideSuspension(false), _(), g(() => {
          _ = addEventListener($, "scroll", bind(manageAutoHideSuspension, true), {
            A: true
          });
        })) : manageAutoHideSuspension(true)), M && x("os-theme-none", Z), k && (x(u), x(T, true), 
        u = T), N && !P && manageAutoHideSuspension(true), U && (l = "move" === L, i = "leave" === L, 
        a = "never" === L, manageScrollbarsAutoHide(a, true)), B && x(St, j), X && x(wt, !!F), 
        Q) {
          const t = setScrollbarVisibility(Y.x, S.x, true), n = setScrollbarVisibility(Y.y, S.y, false);
          x(vt, !(t && n));
        }
        K && (I(), E(), D(), p && A(), x(ht, !m.x, true), x(ht, !m.y, false), x(it, y && !C));
      }, {}, S ];
    })(t, n, v, a, u, e), updateHintsAreTruthy = t => keys(t).some(n => !!t[n]), update = (t, e) => {
      if (o()) return false;
      const {pn: r, Dt: l, At: a, hn: u} = t, _ = r || {}, d = !!l || !c, p = {
        It: createOptionCheck(n, _, d),
        pn: _,
        Dt: d
      };
      if (u) return h(p), false;
      const g = e || f(assignDeep({}, p, {
        At: a
      })), b = i(assignDeep({}, p, {
        _n: v,
        Zt: g
      }));
      h(assignDeep({}, p, {
        Zt: g,
        tn: b
      }));
      const y = updateHintsAreTruthy(g), w = updateHintsAreTruthy(b), S = y || w || !isEmptyObject(_) || d;
      return c = true, S && s(t, {
        Zt: g,
        tn: b
      }), S;
    };
    return [ () => {
      const {an: t, gt: n, Ot: o} = u, s = getElementScroll(t), e = [ d(), l(), p() ], c = o();
      return scrollElementTo(n, s), c(), bind(runEachAndClear, e);
    }, update, () => ({
      gn: v,
      bn: a
    }), {
      yn: u,
      wn: g
    }, _ ];
  }, OverlayScrollbars = (t, n, o) => {
    const {N: s} = getEnvironment(), e = isHTMLElement(t), c = e ? t : t.target, r = getInstance(c);
    if (n && !r) {
      let r = false;
      const l = [], i = {}, validateOptions = t => {
        const n = removeUndefinedProperties(t, true), o = getStaticPluginModuleInstance("__osOptionsValidationPlugin");
        return o ? o(n, true) : n;
      }, a = assignDeep({}, s(), validateOptions(n)), [u, _, d] = createEventListenerHub(), [f, v, p] = createEventListenerHub(o), triggerEvent = (t, n) => {
        p(t, n), d(t, n);
      }, [h, g, b, y, w] = createSetups(t, a, () => r, ({pn: t, Dt: n}, {Zt: o, tn: s}) => {
        const {ft: e, Ct: c, xt: r, Ht: l, Et: i, dt: a} = o, {nn: u, sn: _, en: d, cn: f} = s;
        triggerEvent("updated", [ S, {
          updateHints: {
            sizeChanged: !!e,
            directionChanged: !!c,
            heightIntrinsicChanged: !!r,
            overflowEdgeChanged: !!u,
            overflowAmountChanged: !!_,
            overflowStyleChanged: !!d,
            scrollCoordinatesChanged: !!f,
            contentMutation: !!l,
            hostMutation: !!i,
            appear: !!a
          },
          changedOptions: t || {},
          force: !!n
        } ]);
      }, t => triggerEvent("scroll", [ S, t ])), destroy = t => {
        (t => {
          $t.delete(t);
        })(c), runEachAndClear(l), r = true, triggerEvent("destroyed", [ S, t ]), _(), v();
      }, S = {
        options(t, n) {
          if (t) {
            const o = n ? s() : {}, e = getOptionsDiff(a, assignDeep(o, validateOptions(t)));
            isEmptyObject(e) || (assignDeep(a, e), g({
              pn: e
            }));
          }
          return assignDeep({}, a);
        },
        on: f,
        off: (t, n) => {
          t && n && v(t, n);
        },
        state() {
          const {gn: t, bn: n} = b(), {ct: o} = t, {Vt: s, Rt: e, K: c, rn: l, ln: i, dn: a, Lt: u} = n;
          return assignDeep({}, {
            overflowEdge: s,
            overflowAmount: e,
            overflowStyle: c,
            hasOverflow: l,
            scrollCoordinates: {
              start: u.D,
              end: u.M
            },
            padding: i,
            paddingAbsolute: a,
            directionRTL: o,
            destroyed: r
          });
        },
        elements() {
          const {vt: t, ht: n, ln: o, ot: s, bt: e, gt: c, Qt: r} = y.yn, {Xt: l, Jt: i} = y.wn, translateScrollbarStructure = t => {
            const {Pt: n, Ut: o, Tt: s} = t;
            return {
              scrollbar: s,
              track: o,
              handle: n
            };
          }, translateScrollbarsSetupElement = t => {
            const {Yt: n, Wt: o} = t, s = translateScrollbarStructure(n[0]);
            return assignDeep({}, s, {
              clone: () => {
                const t = translateScrollbarStructure(o());
                return g({
                  hn: true
                }), t;
              }
            });
          };
          return assignDeep({}, {
            target: t,
            host: n,
            padding: o || s,
            viewport: s,
            content: e || s,
            scrollOffsetElement: c,
            scrollEventElement: r,
            scrollbarHorizontal: translateScrollbarsSetupElement(l),
            scrollbarVertical: translateScrollbarsSetupElement(i)
          });
        },
        update: t => g({
          Dt: t,
          At: true
        }),
        destroy: bind(destroy, false),
        plugin: t => i[keys(t)[0]]
      };
      return push(l, [ w ]), ((t, n) => {
        $t.set(t, n);
      })(c, S), registerPluginModuleInstances(Ct, OverlayScrollbars, [ S, u, i ]), ((t, n) => {
        const {nativeScrollbarsOverlaid: o, body: s} = n || {}, {k: e, R: c, U: r} = getEnvironment(), {nativeScrollbarsOverlaid: l, body: i} = r().cancel, a = null != o ? o : l, u = isUndefined(s) ? i : s, _ = (e.x || e.y) && a, d = t && (isNull(u) ? !c : u);
        return !!_ || !!d;
      })(y.yn.yt, !e && t.cancel) ? (destroy(true), S) : (push(l, h()), triggerEvent("initialized", [ S ]), 
      S.update(), S);
    }
    return r;
  };
  return OverlayScrollbars.plugin = t => {
    const n = isArray(t), o = n ? t : [ t ], s = o.map(t => registerPluginModuleInstances(t, OverlayScrollbars)[0]);
    return (t => {
      each(t, t => each(t, (n, o) => {
        Ct[o] = t[o];
      }));
    })(o), n ? s : s[0];
  }, OverlayScrollbars.valid = t => {
    const n = t && t.elements, o = isFunction(n) && n();
    return isPlainObject(o) && !!getInstance(o.target);
  }, OverlayScrollbars.env = () => {
    const {T: t, k: n, R: o, V: s, j: e, B: c, U: r, P: l, N: i, q: a} = getEnvironment();
    return assignDeep({}, {
      scrollbarsSize: t,
      scrollbarsOverlaid: n,
      scrollbarsHiding: o,
      scrollTimeline: s,
      staticDefaultInitialization: e,
      staticDefaultOptions: c,
      getDefaultInitialization: r,
      setDefaultInitialization: l,
      getDefaultOptions: i,
      setDefaultOptions: a
    });
  }, OverlayScrollbars.nonce = t => {
    mt = t;
  }, t.ClickScrollPlugin = Mt, t.OverlayScrollbars = OverlayScrollbars, t.ScrollbarsHidingPlugin = At, 
  t.SizeObserverPlugin = zt, Object.defineProperty(t, Symbol.toStringTag, {
    value: "Module"
  }), t;
}({});