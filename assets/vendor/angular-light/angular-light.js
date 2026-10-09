/* @license
 Angular Light 0.14.0
 https://github.com/lega911/angular-light
 Released under the MIT License
*/
!function() {
  "use strict";
  function buildAlight() {
    var alight = function(element, data) {
      return alight.bootstrap(element, data);
    };
    alight.version = "0.14.0", alight.filters = {}, alight.text = {}, alight.core = {}, 
    alight.utils = {}, alight.option = {
      globalController: false,
      removeAttribute: true,
      domOptimization: true,
      domOptimizationRemoveEmpty: true,
      fastBinding: true
    }, alight.debug = {
      scan: 0,
      directive: false,
      watch: false,
      watchText: false,
      parser: false
    }, alight.ctrl = alight.controllers = {}, alight.d = alight.directives = {
      al: {},
      bo: {},
      $global: {}
    }, alight.hooks = {
      directive: [],
      binding: []
    }, alight.priority = {
      al: {
        app: 2e3,
        checked: 20,
        class: 30,
        css: 30,
        focused: 20,
        if: 700,
        ifnot: 700,
        model: 25,
        radio: 25,
        repeat: 1e3,
        select: 20,
        stop: -10,
        value: 20,
        on: 10
      },
      $component: 5,
      $attribute: -5
    };
    var css, head, s, callbacks, ready, ChangeDetector, ErrorValue, Root, WA, displayError, execWatchObject, get_time, innerEvents, notEqual, scanCore, watchAny, watchInitValue, watchText, _optimizeLineElements, Env, attrBinding, bindComment, bindElement, bindNode, bindText, sortByPriority, testDirective, ext, addAttr, exec, list, timer, clone, equal, index, prefix, assignmentOperator, isChar, isDigit, isSign, reserved, toDict, rx, chars, self, FastBinding, compileText, pathToEl, eventOption, execute, formatModifier, getValue, handler, keyCodes, makeEvent, setKeyModifier, Mapper, props, d2, f$ = alight.f$ = {}, removeItem = function(list, item) {
      var i = list.indexOf(item);
      i >= 0 ? list.splice(i, 1) : console.warn("trying to remove not exist item");
    };
    function makeSimpleFilter(filter, option) {
      var onStop, values = [], active = false, cd = option.cd, callback = option.callback;
      if (option.filterConf.args.length) {
        var watchers = [];
        option.filterConf.args.forEach(function(exp, i) {
          var w = cd.watch(exp, function(value) {
            values[i + 1] = value, handler();
          });
          w.$.isStatic || watchers.push(w);
        });
        var planned = false, handler = function() {
          planned || (planned = true, cd.watch("$onScanOnce", function() {
            if (planned = false, active) {
              var result = filter.apply(null, values);
              f$.isPromise(result) ? result.then(function(value) {
                callback(value), cd.scan();
              }) : callback(result);
            }
          }));
        };
        watchers.length && (onStop = function() {
          watchers.forEach(function(w) {
            return w.stop();
          });
        });
      } else handler = function() {
        var result = filter(values[0]);
        f$.isPromise(result) ? result.then(function(value) {
          callback(value), cd.scan();
        }) : callback(result);
      };
      return {
        onChange: function(value) {
          active = true, values[0] = value, handler();
        },
        onStop: onStop,
        watchMode: option.watchMode
      };
    }
    function setElementToName(scope, element, value, env) {
      env.setValue(env.attrArgument, element);
    }
    return f$.before = function(base, elm) {
      base.parentNode.insertBefore(elm, base);
    }, f$.after = function(base, elm) {
      var parent = base.parentNode, n = base.nextSibling;
      n ? parent.insertBefore(elm, n) : parent.appendChild(elm);
    }, f$.remove = function(elm) {
      var parent = elm.parentNode;
      parent && parent.removeChild(elm);
    }, f$.on = function(element, event, callback) {
      element.addEventListener(event, callback, false);
    }, f$.off = function(element, event, callback) {
      element.removeEventListener(event, callback, false);
    }, f$.isFunction = function(fn) {
      return fn && "[object Function]" === Object.prototype.toString.call(fn);
    }, f$.isObject = function(o) {
      return o && "[object Object]" === Object.prototype.toString.call(o);
    }, f$.isPromise = function(p) {
      return p && window.Promise && p instanceof window.Promise;
    }, f$.isElement = function(el) {
      return el instanceof HTMLElement;
    }, f$.addClass = function(element, name) {
      element.classList ? element.classList.add(name) : element.className += " " + name;
    }, f$.removeClass = function(element, name) {
      element.classList ? element.classList.remove(name) : element.className = element.className.replace(new RegExp("(^| )" + name.split(" ").join("|") + "( |$)", "gi"), " ");
    }, f$.rawAjax = function(args) {
      var request = new XMLHttpRequest;
      for (var i in request.open(args.type || "GET", args.url, true, args.username, args.password), 
      args.headers) request.setRequestHeader(i, args.headers[i]);
      args.success && (request.onload = function() {
        request.status >= 200 && request.status < 400 ? args.success(request.responseText) : args.error && args.error();
      }), args.error && (request.onerror = args.error), request.send(args.data || null);
    }, f$.ajaxCache = {}, f$.ajax = function(args) {
      if (args.username || args.password || args.headers || args.data || !args.cache) return f$.rawAjax(args);
      var queryType = args.type || "GET", cacheKey = queryType + ":" + args.url, d = f$.ajaxCache[cacheKey];
      d || (f$.ajaxCache[cacheKey] = d = {
        callback: []
      }), d.result ? args.success && args.success(d.result) : (d.callback.push(args), 
      d.loading || (d.loading = true, f$.rawAjax({
        type: queryType,
        url: args.url,
        success: function(result) {
          d.loading = false, d.result = result;
          for (var i = 0; i < d.callback.length; i++) d.callback[i].success && d.callback[i].success(result);
          d.callback.length = 0;
        },
        error: function() {
          d.loading = false;
          for (var i = 0; i < d.callback.length; i++) d.callback[i].error && d.callback[i].error();
          d.callback.length = 0;
        }
      })));
    }, css = '@charset "UTF-8";[al-cloak],[hidden],.al-hide{display:none !important;}', 
    head = document.querySelectorAll("head")[0], (s = document.createElement("style")).setAttribute("type", "text/css"), 
    s.styleSheet ? s.styleSheet.cssText = css : s.appendChild(document.createTextNode(css)), 
    head.appendChild(s), f$.ready = (callbacks = [], ready = false, f$.on(document, "DOMContentLoaded", function onReady() {
      ready = true, f$.off(document, "DOMContentLoaded", onReady);
      for (var i = 0; i < callbacks.length; i++) callbacks[i]();
      callbacks.length = 0;
    }), function(callback) {
      ready ? callback() : callbacks.push(callback);
    }), window.jQuery && (window.jQuery.fn.alight = function(data) {
      var elements = [];
      if (this.each(function(i, el) {
        return elements.push(el);
      }), elements.length) return alight(elements, data);
    }), alight.core.getFilter = function(name, cd) {
      var filter = cd.locals[name];
      if (filter && (f$.isFunction(filter) || filter.init || filter.fn)) return filter;
      if (filter = alight.filters[name]) return filter;
      throw "Filter not found: " + name;
    }, alight.core.buildFilterNode = function(cd, filterConf, filter, callback) {
      if (f$.isFunction(filter)) return makeSimpleFilter(filter, {
        cd: cd,
        filterConf: filterConf,
        callback: callback
      });
      if (filter.init) return filter.init.call(cd, cd.scope, filterConf.raw, {
        setValue: callback,
        conf: filterConf,
        changeDetector: cd
      });
      if (f$.isFunction(filter.fn)) return makeSimpleFilter(filter.fn, {
        cd: cd,
        filterConf: filterConf,
        callback: callback,
        watchMode: filter.watchMode
      });
      throw "Wrong filter: " + filterConf.name;
    }, alight.ChangeDetector = function(scope) {
      var cd, root;
      return root = new Root, cd = new ChangeDetector(root, scope || {}), root.topCD = cd, 
      cd;
    }, (Root = function() {
      return this.watchers = {
        any: [],
        finishBinding: [],
        finishScan: [],
        finishScanOnce: [],
        onScanOnce: []
      }, this.status = null, this.extraLoop = false, this.finishBinding_lock = false, 
      this.lateScan = false, this.topCD = null, this;
    }).prototype.destroy = function() {
      if (this.watchers.any.length = 0, this.watchers.finishBinding.length = 0, this.watchers.finishScan.length = 0, 
      this.watchers.finishScanOnce.length = 0, this.watchers.onScanOnce.length = 0, this.topCD) return this.topCD.destroy();
    }, (ChangeDetector = function(root, scope) {
      this.scope = scope, this.locals = scope, this.root = root, this.watchList = [], 
      this.destroy_callbacks = [], this.parent = null, this.children = [], this.rwatchers = {
        any: [],
        finishScan: [],
        elEvents: []
      };
    }).prototype.new = function(scope, option) {
      var Locals, cd;
      return option = option || {}, null == scope && (scope = this.scope), (cd = new ChangeDetector(this.root, scope)).parent = this, 
      scope === this.scope && (option.locals ? ((Locals = this._ChildLocals) || (this._ChildLocals = Locals = function() {
        return this.$$root = scope, this;
      }, Locals.prototype = this.locals), cd.locals = new Locals) : cd.locals = this.locals), 
      this.children.push(cd), cd;
    }, ChangeDetector.prototype.destroy = function() {
      var cd, d, i, j, k, l, len, len1, len2, len3, len4, len5, m, n, o, ref, ref1, ref2, ref3, ref4, ref5, root, wa;
      for (root = (cd = this).root, cd.scope = null, cd.parent && removeItem(cd.parent.children, cd), 
      j = 0, len = (ref = cd.destroy_callbacks).length; j < len; j++) (0, ref[j])();
      for (k = 0, len1 = (ref1 = cd.children.slice()).length; k < len1; k++) ref1[k].destroy();
      for (cd.destroy_callbacks.length = 0, l = 0, len2 = (ref2 = cd.watchList).length; l < len2; l++) (d = ref2[l]).onStop && d.onStop();
      for (cd.watchList.length = 0, m = 0, len3 = (ref3 = cd.rwatchers.any).length; m < len3; m++) wa = ref3[m], 
      removeItem(root.watchers.any, wa);
      for (cd.rwatchers.any.length = 0, n = 0, len4 = (ref4 = cd.rwatchers.finishScan).length; n < len4; n++) wa = ref4[n], 
      removeItem(root.watchers.finishScan, wa);
      for (cd.rwatchers.finishScan.length = 0, o = 0, len5 = (ref5 = this.rwatchers.elEvents).length; o < len5; o++) i = ref5[o], 
      f$.off(i[0], i[1], i[2]);
      this.rwatchers.elEvents.length = 0, root.topCD === cd && (root.topCD = null, root.destroy());
    }, WA = function(callback) {
      return this.cb = callback;
    }, watchAny = function(cd, key, callback) {
      var root, wa;
      return root = cd.root, wa = new WA(callback), cd.rwatchers[key].push(wa), root.watchers[key].push(wa), 
      {
        stop: function() {
          return removeItem(cd.rwatchers[key], wa), removeItem(root.watchers[key], wa);
        }
      };
    }, ChangeDetector.prototype.on = function(element, eventName, callback) {
      return f$.on(element, eventName, callback), this.rwatchers.elEvents.push([ element, eventName, callback ]);
    }, innerEvents = {
      $any: function(cd, callback) {
        return watchAny(cd, "any", callback);
      },
      $finishScan: function(cd, callback) {
        return watchAny(cd, "finishScan", callback);
      },
      $finishScanOnce: function(cd, callback) {
        cd.root.watchers.finishScanOnce.push(callback);
      },
      $onScanOnce: function(cd, callback) {
        cd.root.watchers.onScanOnce.push(callback);
      },
      $destroy: function(cd, callback) {
        cd.destroy_callbacks.push(callback);
      },
      $finishBinding: function(cd, callback) {
        cd.root.watchers.finishBinding.push(callback);
      }
    }, watchInitValue = function() {}, ChangeDetector.prototype.watch = function(name, callback, option) {
      var cd, ce, d, exp, ie, isFunction, isStatic, key, r, scope;
      if (ie = innerEvents[name]) return ie(this, callback);
      if (true === (option = option || {}) && (option = {
        isArray: true
      }), option.init && console.warn("watch.init is depricated"), (cd = this).root, scope = cd.scope, 
      f$.isFunction(name) ? (exp = name, key = alight.utils.getId(), isFunction = true) : (isFunction = false, 
      exp = null, "::" === (name = name.trim()).slice(0, 2) && (name = name.slice(2), 
      option.oneTime = true), key = name, key = option.deep ? "d#" + key : option.isArray ? "a#" + key : "v#" + key), 
      alight.debug.watch && console.log("$watch", name), isStatic = false, !isFunction) if (option.watchText) exp = option.watchText.fn; else {
        if ((ce = alight.utils.compile.expression(name)).filter) return function(cd, ce, prevCallback, option) {
          var watchMode = null, oneTime = option.oneTime;
          if (option.isArray ? watchMode = "array" : option.deep && (watchMode = "deep"), 
          !prevCallback) {
            var watchObject_1 = {
              el: option.element,
              ea: option.elementAttr
            };
            prevCallback = function(value) {
              execWatchObject(cd.scope, watchObject_1, value);
            };
          }
          for (var chain = alight.utils.parsFilter(ce.filter), onStop = [], i = chain.result.length - 1; i >= 0; i--) {
            var filter = alight.core.getFilter(chain.result[i].name, cd), node = alight.core.buildFilterNode(cd, chain.result[i], filter, prevCallback);
            node.watchMode && (watchMode = node.watchMode), node.onStop && onStop.push(node.onStop), 
            prevCallback = node.onChange;
          }
          return option = {
            oneTime: oneTime
          }, "array" === watchMode ? option.isArray = true : "deep" === watchMode && (option.deep = true), 
          onStop.length && (option.onStop = function() {
            onStop.forEach(function(fn) {
              return fn();
            }), onStop.length = 0;
          }), cd.watch(ce.expression, prevCallback, option);
        }(cd, ce, callback, option);
        isStatic = ce.isSimple && 0 === ce.simpleVariables.length, exp = ce.fn;
      }
      return option.deep && (option.isArray = false), d = {
        isStatic: isStatic,
        isArray: Boolean(option.isArray),
        extraLoop: !option.readOnly,
        deep: true === option.deep ? 10 : option.deep,
        value: watchInitValue,
        callback: callback,
        exp: exp,
        src: "" + name,
        onStop: option.onStop || null,
        el: option.element || null,
        ea: option.elementAttr || null
      }, isStatic ? cd.watch("$onScanOnce", function() {
        return execWatchObject(scope, d, d.exp(scope));
      }) : cd.watchList.push(d), r = {
        $: d,
        stop: function() {
          var e, error;
          if (option.onStop) try {
            option.onStop();
          } catch (error) {
            e = error, alight.exceptionHandler(e, "Error in onStop of watcher: " + name, name);
          }
          if (!d.isStatic) return removeItem(cd.watchList, d);
        },
        refresh: function() {
          var value;
          return (value = d.exp(cd.locals)) && d.deep ? d.value = alight.utils.clone(value, d.deep) : value && d.isArray ? d.value = value.slice() : d.value = value;
        }
      }, option.oneTime && (d.callback = function(value) {
        if (void 0 !== value) return r.stop(), callback(value);
      }), r;
    }, ChangeDetector.prototype.watchGroup = function(keys, callback) {
      var cd, group, j, key, len, planned;
      if (cd = this, !callback && f$.isFunction(keys) && (callback = keys, keys = null), 
      planned = false, group = function() {
        if (!planned) return planned = true, cd.watch("$onScanOnce", function() {
          return planned = false, callback();
        });
      }, keys) for (j = 0, len = keys.length; j < len; j++) key = keys[j], cd.watch(key, group);
      return group;
    }, get_time = window.performance ? function() {
      return Math.floor(performance.now());
    } : function() {
      return (new Date).getTime();
    }, notEqual = function(a, b) {
      var i, j, len, ta;
      if (null === a || null === b) return true;
      if ((ta = typeof a) !== typeof b) return true;
      if ("object" === ta) {
        if (a.length !== b.length) return true;
        for (i = j = 0, len = a.length; j < len; i = ++j) if (a[i] !== b[i]) return true;
      }
      return false;
    }, execWatchObject = function(scope, w, value) {
      w.el ? w.ea ? w.el.setAttribute(w.ea, value) : w.el.nodeValue = value : w.callback.call(scope, value);
    }, displayError = function(e, cd, w, option) {
      var args, text;
      return args = {
        src: w.src,
        scope: cd.scope,
        locals: cd.locals
      }, w.el && (args.element = w.el), text = 1 === option ? "$scan, error in callback: " : "$scan, error in expression: ", 
      alight.exceptionHandler(e, text + w.src, args);
    }, ErrorValue = function() {}, scanCore = function(topCD, result) {
      var a0, a1, cd, changes, e, error, error1, extraLoop, index, j, last, len, locals, mutated, queue, ref, total, value, w;
      if (topCD.root, extraLoop = false, changes = 0, total = 0, topCD) {
        for (queue = [], index = 0, cd = topCD; cd; ) {
          for (locals = cd.locals, total += cd.watchList.length, j = 0, len = (ref = cd.watchList.slice()).length; j < len; j++) {
            last = (w = ref[j]).value;
            try {
              value = w.exp(locals);
            } catch (error) {
              e = error, value = ErrorValue;
            }
            if (last !== value) {
              if (mutated = false, w.isArray ? (a0 = Array.isArray(last)) === (a1 = Array.isArray(value)) ? a0 ? notEqual(last, value) && (mutated = true, 
              w.value = value.slice()) : (mutated = true, w.value = value) : (mutated = true, 
              w.value = a1 ? value.slice() : value) : w.deep ? alight.utils.equal(last, value, w.deep) || (mutated = true, 
              w.value = alight.utils.clone(value, w.deep)) : (mutated = true, w.value = value), 
              mutated) if (mutated = false, value === ErrorValue) displayError(e, cd, w); else {
                changes++;
                try {
                  w.el ? w.ea ? null != value ? w.el.setAttribute(w.ea, value) : w.el.removeAttribute(w.ea) : w.el.nodeValue = value : (last === watchInitValue && (last = void 0), 
                  "$scanNoChanges" !== w.callback.call(cd.scope, value, last) && w.extraLoop && (extraLoop = true));
                } catch (error1) {
                  displayError(e = error1, cd, w, 1);
                }
              }
              alight.debug.scan > 1 && console.log("changed:", w.src);
            }
          }
          queue.push.apply(queue, cd.children), cd = queue[index++];
        }
        result.total = total, result.changes = changes, result.extraLoop = extraLoop;
      }
    }, ChangeDetector.prototype.digest = function() {
      var duration, j, len, mainLoop, onScanOnce, result, root, start, totalChanges;
      for (root = this.root, mainLoop = 10, totalChanges = 0, alight.debug.scan && (start = get_time()), 
      result = {
        total: 0,
        changes: 0,
        extraLoop: false,
        src: "",
        scope: null,
        element: null
      }; mainLoop; ) {
        if (mainLoop--, root.extraLoop = false, root.watchers.onScanOnce.length) for (onScanOnce = root.watchers.onScanOnce.slice(), 
        root.watchers.onScanOnce.length = 0, j = 0, len = onScanOnce.length; j < len; j++) onScanOnce[j].call(root);
        if (scanCore(this, result), totalChanges += result.changes, !result.extraLoop && !root.extraLoop && !root.watchers.onScanOnce.length) break;
      }
      return alight.debug.scan && (duration = get_time() - start, console.log("$scan: loops: (" + (10 - mainLoop) + "), last-loop changes: " + result.changes + ", watches: " + result.total + " / " + duration + "ms")), 
      result.mainLoop = mainLoop, result.totalChanges = totalChanges, result;
    }, ChangeDetector.prototype.scan = function(cfg) {
      var finishScanOnce, j, k, l, len, len1, len2, ref, ref1, result, root;
      if (root = this.root, cfg = cfg || {}, !alight.option.zone || cfg.zone) {
        if (f$.isFunction(cfg) && (cfg = {
          callback: cfg
        }), cfg.callback && root.watchers.finishScanOnce.push(cfg.callback), cfg.late) {
          if (root.lateScan) return;
          return root.lateScan = true, void alight.nextTick(function() {
            if (root.lateScan) return root.topCD.scan();
          });
        }
        if ("scaning" !== root.status) {
          if (root.lateScan = false, root.status = "scaning", (result = root.topCD ? root.topCD.digest() : {}).totalChanges) for (j = 0, 
          len = (ref = root.watchers.any).length; j < len; j++) (0, ref[j])();
          for (root.status = null, k = 0, len1 = (ref1 = root.watchers.finishScan).length; k < len1; k++) (0, 
          ref1[k])();
          for (finishScanOnce = root.watchers.finishScanOnce.slice(), root.watchers.finishScanOnce.length = 0, 
          l = 0, len2 = finishScanOnce.length; l < len2; l++) finishScanOnce[l].call(root);
          if (0 === result.mainLoop) throw "Infinity loop detected";
          return result;
        }
        root.extraLoop = true;
      }
    }, alight.core.ChangeDetector = ChangeDetector, ChangeDetector.prototype.compile = function(expression, option) {
      return alight.utils.compile.expression(expression, option).fn;
    }, ChangeDetector.prototype.setValue = function(name, value) {
      var e, error, fn, j, key, len, locals, msg, ref, rx;
      fn = this.compile(name + " = $value", {
        input: [ "$value" ],
        no_return: true
      });
      try {
        return fn(this.locals, value);
      } catch (error) {
        if (e = error, msg = "can't set variable: " + name, alight.debug.parser && console.warn(msg), 
        ("" + e).indexOf("TypeError") >= 0 && (rx = name.match(/^([\w\d\.]+)\.[\w\d]+$/)) && rx[1]) {
          for (locals = this.locals, j = 0, len = (ref = rx[1].split(".")).length; j < len; j++) void 0 === locals[key = ref[j]] && (locals[key] = {}), 
          locals = locals[key];
          try {
            return void fn(this.locals, value);
          } catch (error1) {}
        }
        return alight.exceptionHandler(e, msg, {
          name: name,
          value: value
        });
      }
    }, ChangeDetector.prototype.eval = function(exp) {
      return this.compile(exp)(this.locals);
    }, ChangeDetector.prototype.getValue = function(name) {
      return this.eval(name);
    }, alight.text.$base = function(option) {
      var cd, dir, env, point, scope;
      if (point = option.point, !(dir = (scope = (cd = option.cd).scope).$ns && scope.$ns.text ? scope.$ns.text[option.name] : alight.text[option.name])) throw "No directive alight.text." + option.name;
      return env = {
        changeDetector: cd,
        setter: function(value) {
          if (option.update) return point.value = null === value ? "" : "" + value, option.update();
        },
        setterRaw: function(value) {
          if (option.updateRaw) return point.value = null === value ? "" : "" + value, option.updateRaw();
        },
        finally: function(value) {
          if (option.finally) return point.value = null === value ? "" : "" + value, point.type = "text", 
          option.finally(), option.update = null, option.finally = null;
        }
      }, dir.call(cd, env.setter, option.exp, scope, env);
    }, watchText = function(expression, callback, config) {
      var canUseSimpleBuilder, cd, ce, d, data, doFinally, doUpdate, doUpdateRaw, exp, fireCallback, fn, i, j, k, l, len, len1, len2, lname, name, noCache, privateValue, resultValue, st, updatePlanned, value, w, watchCount, watchObject;
      if (config = config || {}, cd = this, alight.debug.watchText && console.log("$watchText", expression), 
      st = alight.utils.compile.buildSimpleText(expression, null)) cd.watch(expression, callback, {
        watchText: st,
        element: config.element,
        elementAttr: config.elementAttr
      }); else {
        for (data = alight.utils.parsText(expression), watchCount = 0, canUseSimpleBuilder = true, 
        noCache = false, doUpdate = doUpdateRaw = doFinally = function() {}, j = 0, len = data.length; j < len; j++) if ("expression" === (d = data[j]).type) if (lname = (exp = d.list.join("|")).match(/^([^\w\d\s\$"'\(\u0410-\u044F\u0401\u0451]+)/)) d.isDir = true, 
        "#" === (name = lname[1]) ? (i = exp.indexOf(" ")) < 0 ? (name = exp.substring(1), 
        exp = "") : (name = exp.slice(1, i), exp = exp.slice(i)) : exp = exp.substring(name.length), 
        alight.text.$base({
          name: name,
          exp: exp,
          cd: cd,
          point: d,
          update: function() {
            return doUpdate();
          },
          updateRaw: function() {
            return doUpdateRaw();
          },
          finally: function() {
            return doUpdate(), doFinally();
          }
        }), noCache = true, "text" !== d.type && (canUseSimpleBuilder = false); else if ((ce = alight.utils.compile.expression(exp, {
          string: true
        })).filter) watchCount++, canUseSimpleBuilder = false, d.watched = true, function(d) {
          cd.watch(exp, function(value) {
            return null == value && (value = ""), d.value = value, doUpdate();
          });
        }(d); else {
          if (d.fn = ce.fn, !ce.rawExpression) throw "Error";
          ce.isSimple && 0 === ce.simpleVariables.length ? (d.type = "text", d.value = d.fn()) : (d.re = ce.rawExpression, 
          watchCount++);
        }
        if (canUseSimpleBuilder) {
          if (!watchCount) {
            for (value = "", k = 0, len1 = data.length; k < len1; k++) d = data[k], value += d.value;
            return void cd.watch("$onScanOnce", function() {
              return execWatchObject(cd.scope, {
                callback: callback,
                el: config.element,
                ea: config.elementAttr
              }, value);
            });
          }
          return st = noCache ? alight.utils.compile.buildSimpleText(null, data) : alight.utils.compile.buildSimpleText(expression, data), 
          void cd.watch(expression, callback, {
            watchText: {
              fn: st.fn
            },
            element: config.element,
            elementAttr: config.elementAttr
          });
        }
        if (watchObject = {
          callback: callback,
          el: config.element,
          ea: config.elementAttr
        }, data.scope = cd.scope, fn = alight.utils.compile.buildText(expression, data), 
        doUpdateRaw = function() {
          return execWatchObject(cd.scope, watchObject, fn());
        }, watchCount) {
          for (w = null, resultValue = "", doUpdate = function() {
            resultValue = fn();
          }, doFinally = function() {
            var l, len2;
            for (i = true, l = 0, len2 = data.length; l < len2; l++) if ("expression" === (d = data[l]).type) {
              i = false;
              break;
            }
            i && (cd.watch("$finishScanOnce", function() {
              return w.stop();
            }), config.onStatic && config.onStatic());
          }, privateValue = function() {
            return resultValue;
          }, l = 0, len2 = data.length; l < len2; l++) if ("expression" === (d = data[l]).type) {
            if (d.isDir || d.watched) continue;
            d.watched = true, function(d, exp) {
              cd.watch(exp, function(value) {
                return null == value && (value = ""), d.value = value, doUpdate();
              });
            }(d, d.list.join(" | "));
          }
          doUpdate(), w = cd.watch(privateValue, callback, {
            element: config.element,
            elementAttr: config.elementAttr
          });
        } else updatePlanned = false, fireCallback = function() {
          return updatePlanned = false, doUpdateRaw();
        }, (doUpdate = function() {
          if (!updatePlanned) return updatePlanned = true, cd.watch("$onScanOnce", fireCallback);
        })();
      }
    }, ChangeDetector.prototype.watchText = watchText, _optimizeLineElements = {
      TR: 1,
      TD: 1,
      LI: 1
    }, alight.utils.optmizeElement = function(element, noRemove) {
      var current, d, data, e, exp, i, j, k, len, len1, mark, n, next, prev, prevLineElement, ref, result, text, wrapped;
      if (1 === element.nodeType) {
        for (noRemove = noRemove || !alight.option.domOptimizationRemoveEmpty, "PRE" === element.nodeName && (noRemove = true), 
        !(e = element.firstChild) || 3 !== e.nodeType || e.nodeValue.trim() || noRemove || (f$.remove(e), 
        e = element.firstChild), prevLineElement = false; e; ) next = e.nextSibling, !prevLineElement || 3 !== e.nodeType || e.nodeValue.trim() || noRemove ? (prevLineElement = 1 === e.nodeType && _optimizeLineElements[e.nodeName], 
        alight.utils.optmizeElement(e, noRemove)) : f$.remove(e), e = next;
        !(e = element.lastChild) || 3 !== e.nodeType || e.nodeValue.trim() || noRemove || f$.remove(e);
      } else if (3 === element.nodeType) {
        if (text = element.data, mark = alight.utils.pars_start_tag, (i = text.indexOf(mark)) < 0) return;
        if (text.slice(i + mark.length).indexOf(mark) < 0) return;
        for (prev = "t", result = [ current = {
          value: ""
        } ], j = 0, len = (data = alight.utils.parsText(text)).length; j < len; j++) "text" === (d = data[j]).type ? current.value += d.value : (exp = d.list.join("|"), 
        wrapped = alight.utils.pars_start_tag + exp + alight.utils.pars_finish_tag, exp.match(/^([^\w\d\s\$"'\(\u0410-\u044F\u0401\u0451]+)/) ? ("t" === prev || "d" === prev ? current.value += wrapped : (current = {
          value: wrapped
        }, result.push(current)), prev = "d") : 1 === d.list.length ? ("t" === prev || "v" === prev ? current.value += wrapped : (current = {
          value: wrapped
        }, result.push(current)), prev = "v") : "t" === prev ? current.value += wrapped : (current = {
          value: wrapped
        }, result.push(current)));
        if (result.length < 2) return;
        for ((e = element).data = result[0].value, k = 0, len1 = (ref = result.slice(1)).length; k < len1; k++) d = ref[k], 
        n = document.createTextNode(d.value), f$.after(e, n), e = n;
      }
    }, alight.hooks.attribute = ext = [], ext.push({
      code: "dataPrefix",
      fn: function() {
        "data-" === this.attrName.slice(0, 5) && (this.attrName = this.attrName.slice(5));
      }
    }), ext.push({
      code: "colonNameSpace",
      fn: function() {
        var name, parts;
        this.directive || this.name || ((parts = this.attrName.match(/^(\w+)[\-\:](.+)$/)) ? (this.ns = parts[1], 
        name = parts[2]) : (this.ns = "$global", name = this.attrName), (parts = name.match(/^([^\.]+)\.(.*)$/)) && (name = parts[1], 
        this.attrArgument = parts[2]), this.name = name.replace(/(-\w)/g, function(m) {
          return m.substring(1).toUpperCase();
        }));
      }
    }), ext.push({
      code: "getGlobalDirective",
      fn: function() {
        var path;
        if (!this.directive) {
          if (!(path = alight.d[this.ns])) return this.result = "noNS", void (this.stop = true);
          this.directive = path[this.name], this.directive || ("$global" === this.ns ? this.result = "noNS" : this.result = "noDirective", 
          this.stop = true);
        }
      }
    }), ext.push({
      code: "cloneDirective",
      fn: function() {
        var dir, k, name, ns, r, v;
        if (r = this.directive, ns = this.ns, name = this.name, dir = {}, f$.isFunction(r)) dir.init = r; else {
          if (!f$.isObject(r)) throw "Wrong directive: " + ns + "." + name;
          for (k in r) v = r[k], dir[k] = v;
        }
        if (dir.priority = r.priority || alight.priority[ns] && alight.priority[ns][name] || 0, 
        dir.restrict = r.restrict || "A", dir.restrict.indexOf(this.attrType) < 0) throw "Directive has wrong binding (attribute/element): " + name;
        this.directive = dir;
      }
    }), ext.push({
      code: "preprocessor",
      fn: function() {
        var directive, name, ns;
        ns = this.ns, name = this.name, (directive = this.directive).$init = function(cd, element, value, env) {
          var doProcess, dscope;
          if (doProcess = function() {
            var i, j, l, len;
            for (i = j = 0, len = (l = dscope.procLine).length; j < len; i = ++j) if (l[i].fn.call(dscope), 
            dscope.isDeferred) {
              dscope.procLine = l.slice(i + 1);
              break;
            }
            return dscope.async = true, null;
          }, dscope = {
            element: element,
            value: value,
            cd: cd,
            env: env,
            ns: ns,
            name: name,
            doBinding: false,
            directive: directive,
            isDeferred: false,
            procLine: alight.hooks.directive,
            makeDeferred: function() {
              return dscope.isDeferred = true, dscope.doBinding = true, dscope.retStopBinding = true, 
              dscope.async = false, function() {
                if (dscope.isDeferred = false, dscope.async) return doProcess();
              };
            }
          }, directive.stopBinding && (env.stopBinding = true), doProcess(), dscope.retStopBinding) return "stopBinding";
        };
      }
    }), function() {
      var ext;
      (ext = alight.hooks.directive).push({
        code: "init",
        fn: function() {
          var result;
          this.directive.init && (alight.debug.directive && this.directive.scope && console.warn(this.ns + "-" + this.name + " uses scope and init together, probably you need use link instead of init"), 
          this.env.changeDetector = this.cd, (result = this.directive.init.call(this.env, this.cd.scope, this.element, this.value, this.env)) && result.start && result.start());
        }
      }), ext.push({
        code: "templateUrl",
        fn: function() {
          var callback, ds;
          ds = this, this.directive.templateUrl && (callback = this.makeDeferred(), f$.ajax({
            cache: true,
            url: this.directive.templateUrl,
            success: function(html) {
              return ds.directive.template = html, callback();
            },
            error: callback
          }));
        }
      }), ext.push({
        code: "template",
        fn: function() {
          var el;
          this.directive.template && (1 === this.element.nodeType ? this.element.innerHTML = this.directive.template : 8 === this.element.nodeType && ((el = document.createElement("p")).innerHTML = this.directive.template.trim(), 
          el = el.firstChild, f$.after(this.element, el), this.element = el, this.doBinding = true));
        }
      }), ext.push({
        code: "scope",
        fn: function() {
          var childCD, parentCD;
          if (this.directive.scope) {
            switch (parentCD = this.cd, this.directive.scope) {
             case true:
              childCD = parentCD.new({
                $parent: parentCD.scope
              });
              break;

             case "root":
              childCD = alight.ChangeDetector({
                $parent: parentCD.scope
              }), parentCD.watch("$destroy", function() {
                return childCD.destroy();
              });
              break;

             default:
              throw "Wrong scope value: " + this.directive.scope;
            }
            this.env.parentChangeDetector = parentCD, this.cd = childCD, this.doBinding = true, 
            this.retStopBinding = true;
          }
        }
      }), ext.push({
        code: "link",
        fn: function() {
          var result;
          this.directive.link && (this.env.changeDetector = this.cd, (result = this.directive.link.call(this.env, this.cd.scope, this.element, this.value, this.env)) && result.start && result.start());
        }
      }), ext.push({
        code: "scopeBinding",
        fn: function() {
          this.doBinding && !this.env.stopBinding && alight.bind(this.cd, this.element, {
            skip_attr: this.env.skippedAttr()
          });
        }
      });
    }(), addAttr = function(attrName, args, base) {
      var attr;
      "A" === args.attr_type ? ((attr = base || {}).priority = alight.priority.$attribute, 
      attr.is_attr = true, attr.name = attrName, attr.attrName = attrName, attr.element = args.element, 
      args.list.push(attr)) : "M" === args.attr_type && args.list.push(base);
    }, testDirective = function(attrName, args) {
      var attrSelf, j, len, ref;
      if (args.skip_attr.indexOf(attrName) >= 0) return addAttr(attrName, args, {
        skip: true
      });
      for (attrSelf = {
        attrName: attrName,
        attrType: args.attr_type,
        element: args.element,
        cd: args.cd,
        result: null
      }, j = 0, len = (ref = alight.hooks.attribute).length; j < len && (ref[j].fn.call(attrSelf), 
      !attrSelf.stop); j++) ;
      if ("noNS" !== attrSelf.result) return "noDirective" === attrSelf.result ? "E" === args.attr_type ? void args.list.push({
        name: attrName,
        priority: -10,
        attrName: attrName,
        noDirective: true
      }) : void addAttr(attrName, args, {
        noDirective: true
      }) : void args.list.push({
        name: attrName,
        directive: attrSelf.directive,
        priority: attrSelf.directive.priority,
        attrName: attrName,
        attrArgument: attrSelf.attrArgument
      });
      addAttr(attrName, args);
    }, sortByPriority = function(a, b) {
      return a.priority === b.priority ? 0 : a.priority > b.priority ? -1 : 1;
    }, attrBinding = function(cd, element, value, attrName) {
      var text;
      if (!((text = value).indexOf(alight.utils.pars_start_tag) < 0)) return cd.watchText(text, null, {
        element: element,
        elementAttr: attrName
      }), true;
    }, bindText = function(cd, element, option) {
      var text;
      if (!((text = element.data).indexOf(alight.utils.pars_start_tag) < 0)) return cd.watchText(text, null, {
        element: element
      }), text;
    }, bindComment = function(cd, element, option) {
      var args, d, dirName, directive, e, env, error, i, list, text, value;
      if ("directive:" === (text = element.nodeValue.trim()).slice(0, 10)) {
        if ((i = (text = text.slice(10).trim()).indexOf(" ")) >= 0 ? (dirName = text.slice(0, +(i - 1) + 1 || 9e9), 
        value = text.slice(i + 1)) : (dirName = text, value = ""), args = {
          list: list = [],
          element: element,
          attr_type: "M",
          cd: cd,
          skip_attr: []
        }, testDirective(dirName, args), (d = list[0]).noDirective) throw "Comment directive not found: " + dirName;
        directive = d.directive, env = new Env({
          element: element,
          attrName: d.attrName,
          attributes: list
        }), alight.debug.directive && console.log("bind", d.attrName, value, d);
        try {
          directive.$init(cd, element, value, env);
        } catch (error) {
          e = error, alight.exceptionHandler(e, "Error in directive: " + d.name, {
            value: value,
            env: env,
            cd: cd,
            scope: cd.scope,
            element: element
          });
        }
        return env.skipToElement ? {
          directive: 1,
          skipToElement: env.skipToElement
        } : {
          directive: 1,
          skipToElement: null
        };
      }
    }, (Env = function(option) {
      var k, v;
      for (k in option) v = option[k], this[k] = v;
      return this;
    }).prototype.takeAttr = function(name, skip) {
      var attr, j, len, ref;
      for (1 === arguments.length && (skip = true), j = 0, len = (ref = this.attributes).length; j < len; j++) if ((attr = ref[j]).attrName === name) return skip && (attr.skip = true), 
      this.element.getAttribute(name) || true;
    }, Env.prototype.skippedAttr = function() {
      var attr, j, len, ref, results;
      for (results = [], j = 0, len = (ref = this.attributes).length; j < len; j++) (attr = ref[j]).skip && results.push(attr.attrName);
      return results;
    }, Env.prototype.scan = function(option) {
      return this.changeDetector.scan(option);
    }, Env.prototype.on = function(element, eventname, callback) {
      return this.changeDetector.on(element, eventname, callback);
    }, Env.prototype.watch = function(name, callback, option) {
      return this.changeDetector.watch(name, callback, option);
    }, Env.prototype.watchGroup = function(keys, callback) {
      return this.changeDetector.watchGroup(keys, callback);
    }, Env.prototype.watchText = function(expression, callback, option) {
      return this.changeDetector.watchText(expression, callback, option);
    }, Env.prototype.getValue = function(name) {
      return this.changeDetector.getValue(name);
    }, Env.prototype.setValue = function(name, value) {
      return this.changeDetector.setValue(name, value);
    }, Env.prototype.eval = function(exp) {
      return this.changeDetector.eval(exp);
    }, Env.prototype.new = function(scope, option) {
      return true === option ? option = {
        locals: true
      } : true === scope && null == option && (scope = null, option = {
        locals: true
      }), this.changeDetector.new(scope, option);
    }, Env.prototype.bind = function(_cd, _element, _option) {
      var a, cd, count, element, j, len, option;
      for (this.stopBinding = true, count = 0, j = 0, len = arguments.length; j < len; j++) (a = arguments[j]) instanceof ChangeDetector && (cd = a, 
      count += 1), f$.isElement(a) && (element = a, count += 1);
      return (option = arguments[count]) || (option = {
        skip: this.skippedAttr()
      }), element || (element = this.element), cd || (cd = this.changeDetector), alight.bind(cd, element, option);
    }, bindElement = function(cd, element, config) {
      var args, attr, attrName, bindResult, childElement, childNodes, childOption, d, directive, e, env, error, fastBinding, fb, index, j, len, len1, len2, list, n, o, r, ref, ref1, skipChildren, skipToElement, skip_attr, value;
      if (bindResult = {
        directive: 0,
        hook: 0,
        skipToElement: null,
        fb: fb = {
          attr: [],
          dir: [],
          children: []
        }
      }, skipChildren = false, skip_attr = (config = config || {}).skip_attr, true === config.skip ? config.skip_top = true : skip_attr || (skip_attr = config.skip || []), 
      skip_attr instanceof Array || (skip_attr = [ skip_attr ]), !config.skip_top) {
        for (args = {
          list: list = [],
          element: element,
          skip_attr: skip_attr,
          attr_type: "E",
          cd: cd
        }, attrName = element.nodeName.toLowerCase(), testDirective(attrName, args), "script" !== attrName && "style" !== attrName || (skipChildren = true), 
        args.attr_type = "A", j = 0, len = (ref = element.attributes).length; j < len; j++) attr = ref[j], 
        testDirective(attr.name, args);
        if (config.attachDirective) for (attrName in ref1 = config.attachDirective) ref1[attrName], 
        testDirective(attrName, args);
        for (n = 0, len1 = (list = list.sort(sortByPriority)).length; n < len1; n++) if (!(d = list[n]).skip) {
          if (d.noDirective) throw "Directive not found: " + d.name;
          if (d.skip = true, value = config.attachDirective && config.attachDirective[d.attrName] ? config.attachDirective[d.attrName] : element.getAttribute(d.attrName), 
          d.is_attr) attrBinding(cd, element, value, d.attrName) && fb.attr.push({
            attrName: d.attrName,
            value: value
          }); else {
            directive = d.directive, env = new Env({
              element: element,
              attrName: d.attrName,
              attrArgument: d.attrArgument || null,
              attributes: list,
              stopBinding: false,
              elementCanBeRemoved: config.elementCanBeRemoved,
              fbElement: config.fbElement
            }), alight.debug.directive && console.log("bind", d.attrName, value, d);
            try {
              "stopBinding" === directive.$init(cd, element, value, env) && (skipChildren = true);
            } catch (error) {
              e = error, alight.exceptionHandler(e, "Error in directive: " + d.attrName, {
                value: value,
                env: env,
                cd: cd,
                scope: cd.scope,
                element: element
              });
            }
            if (env.fastBinding ? (fastBinding = f$.isFunction(env.fastBinding) ? env.fastBinding : directive.init, 
            fb.dir.push({
              fb: fastBinding,
              attrName: d.attrName,
              value: value,
              attrArgument: env.attrArgument,
              fbData: env.fbData
            })) : bindResult.directive++, env.stopBinding) {
              skipChildren = true;
              break;
            }
            env.skipToElement && (bindResult.skipToElement = env.skipToElement);
          }
        }
      }
      if (!skipChildren) for (skipToElement = null, childNodes = function() {
        var len2, o, ref2, results;
        for (results = [], o = 0, len2 = (ref2 = element.childNodes).length; o < len2; o++) childElement = ref2[o], 
        results.push(childElement);
        return results;
      }(), index = o = 0, len2 = childNodes.length; o < len2; index = ++o) (childElement = childNodes[index]) && (skipToElement ? skipToElement === childElement && (skipToElement = null) : (config.fbElement && (childOption = {
        fbElement: config.fbElement.childNodes[index]
      }), r = bindNode(cd, childElement, childOption), bindResult.directive += r.directive, 
      bindResult.hook += r.hook, skipToElement = r.skipToElement, r.fb && (r.fb.text || r.fb.attr && r.fb.attr.length || r.fb.dir && r.fb.dir.length || r.fb.children && r.fb.children.length) && fb.children.push({
        index: index,
        fb: r.fb
      })));
      return bindResult;
    }, bindNode = function(cd, element, option) {
      var h, j, len, r, ref, result, text;
      if (result = {
        directive: 0,
        hook: 0,
        skipToElement: null,
        fb: null
      }, alight.hooks.binding.length) for (j = 0, len = (ref = alight.hooks.binding).length; j < len; j++) if (h = ref[j], 
      result.hook += 1, (r = h.fn(cd, element, option)) && r.owner) return result;
      return 1 === element.nodeType ? (r = bindElement(cd, element, option), result.directive += r.directive, 
      result.hook += r.hook, result.skipToElement = r.skipToElement, result.fb = r.fb) : 3 === element.nodeType ? (text = bindText(cd, element)) && (result.fb = {
        text: text
      }) : 8 === element.nodeType && (r = bindComment(cd, element)) && (result.directive += r.directive, 
      result.skipToElement = r.skipToElement), result;
    }, alight.nextTick = (timer = null, list = [], exec = function() {
      var callback, dlist, e, error, it, j, len, self;
      for (timer = null, dlist = list.slice(), list.length = 0, j = 0, len = dlist.length; j < len; j++) {
        callback = (it = dlist[j])[0], self = it[1];
        try {
          callback.call(self);
        } catch (error) {
          e = error, alight.exceptionHandler(e, "$nextTick, error in function", {
            fn: callback,
            self: self
          });
        }
      }
      return null;
    }, function(callback) {
      if (list.push([ callback, this ]), !timer) return timer = setTimeout(exec, 0);
    }), alight.bind = function(changeDetector, element, option) {
      var finishBinding, j, len, lst, result, root;
      if (!changeDetector) throw "No changeDetector";
      if (!element) throw "No element";
      if (option = option || {}, alight.option.domOptimization && !option.noDomOptimization && alight.utils.optmizeElement(element), 
      (finishBinding = !(root = changeDetector.root).finishBinding_lock) && (root.finishBinding_lock = true, 
      root.bindingResult = {
        directive: 0,
        hook: 0
      }), result = bindNode(changeDetector, element, option), root.bindingResult.directive += result.directive, 
      root.bindingResult.hook += result.hook, changeDetector.digest(), finishBinding) {
        for (root.finishBinding_lock = false, lst = root.watchers.finishBinding.slice(), 
        root.watchers.finishBinding.length = 0, j = 0, len = lst.length; j < len; j++) (0, 
        lst[j])();
        result.total = root.bindingResult;
      }
      return result;
    }, function() {
      function zoneJSInvoker(_0, zone, _2, task, _4, args) {
        task.callback.apply(null, args);
        var root = zone._properties.root;
        root && root.topCD && root.topCD.scan({
          zone: true
        });
      }
      var bind = alight.bind;
      alight.bind = function(cd, el, option) {
        var root = cd.root, oz = alight.option.zone;
        if (oz) {
          var Z = true === oz ? Zone : oz, zone = root.zone;
          if (zone || (root.zone = zone = Z.current.fork({
            name: Z.current.name + ".x",
            properties: {
              root: root
            },
            onInvokeTask: zoneJSInvoker
          })), Z.current !== zone) return root.zone.run(bind, null, [ cd, el, option ]);
        }
        return bind(cd, el, option);
      };
    }(), alight.bootstrap = function(input, data) {
      if (!input) return alight.bootstrap("[al-app]"), alight.bootstrap("[al\\:app]"), 
      void alight.bootstrap("[data-al-app]");
      var changeDetector;
      if (input instanceof alight.core.ChangeDetector) changeDetector = input, input = data; else if (data instanceof alight.core.ChangeDetector) changeDetector = data; else if (f$.isFunction(data)) {
        var scope = {};
        changeDetector = alight.ChangeDetector(scope), data.call(changeDetector, scope);
      } else data && (changeDetector = alight.ChangeDetector(data));
      if (Array.isArray(input)) {
        for (var result = void 0, _i = 0, input_1 = input; _i < input_1.length; _i++) {
          var item = input_1[_i];
          result = alight.bootstrap(item, changeDetector);
        }
        return result;
      }
      if ("string" == typeof input) {
        result = void 0;
        for (var _a = 0, elements_1 = document.querySelectorAll(input); _a < elements_1.length; _a++) {
          var element = elements_1[_a];
          result = alight.bootstrap(element, changeDetector);
        }
        return result;
      }
      if (changeDetector || (changeDetector = alight.ChangeDetector()), f$.isElement(input)) {
        for (var ctrlKey, ctrlName, option, _b = 0, _c = [ "al-app", "al:app", "data-al-app" ]; _b < _c.length && (ctrlKey = _c[_b], 
        ctrlName = input.getAttribute(ctrlKey), input.removeAttribute(ctrlKey), !ctrlName); _b++) ;
        return ctrlName && (option = {
          skip_attr: [ ctrlKey ],
          attachDirective: {}
        }, alight.d.al.ctrl ? option.attachDirective["al-ctrl"] = ctrlName : option.attachDirective[ctrlName + "!"] = ""), 
        alight.bind(changeDetector, input, option), changeDetector;
      }
      alight.exceptionHandler("Error in bootstrap", "Error input arguments", {
        input: input
      });
    }, alight.utils.getId = (prefix = function() {
      var d, k, n, r, symbols;
      for (symbols = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".split(""), 
      n = Math.floor((new Date).valueOf() / 1e3) - 1388512800, r = ""; n > 0; ) k = n - 62 * (d = Math.floor(n / 62)), 
      n = d, r = symbols[k] + r;
      return r;
    }(), index = 1, function() {
      return prefix + "#" + index++;
    }), alight.utils.clone = clone = function(d, lvl) {
      var i, k, r, v;
      if (null == lvl && (lvl = 128), lvl < 1) return null;
      if (!d) return d;
      if ("object" == typeof d) {
        if (d instanceof Array) return r = function() {
          var j, len, results;
          for (results = [], j = 0, len = d.length; j < len; j++) i = d[j], results.push(clone(i, lvl - 1));
          return results;
        }();
        if (d instanceof Date) return new Date(d.valueOf());
        if (d.nodeType && "function" == typeof d.cloneNode) return d;
        for (k in r = {}, d) v = d[k], "$" !== k[0] && (r[k] = clone(v, lvl - 1));
        return r;
      }
      return d;
    }, alight.utils.equal = equal = function(a, b, lvl) {
      var i, j, k, len, set, ta, v;
      if (null == lvl && (lvl = 128), lvl < 1) return true;
      if (!a || !b) return a === b;
      if ((ta = typeof a) !== typeof b) return false;
      if ("object" === ta) {
        if (a instanceof Array) {
          if (a.length !== b.length) return false;
          for (i = j = 0, len = a.length; j < len; i = ++j) if (v = a[i], !equal(v, b[i], lvl - 1)) return false;
          return true;
        }
        if (a instanceof Date) return a.valueOf() === b.valueOf();
        if (a.nodeType && "function" == typeof a.cloneNode) return a === b;
        for (k in set = {}, a) if (v = a[k], "$" !== k[0] && (set[k] = true, !equal(v, b[k], lvl - 1))) return false;
        for (k in b) if (v = b[k], "$" !== k[0] && !set[k] && !equal(v, a[k], lvl - 1)) return false;
        return true;
      }
      return a === b;
    }, alight.exceptionHandler = function(e, title, locals) {
      var output;
      return output = [], title && output.push(title), e && e.message && output.push(e.message), 
      locals && output.push(locals), e && output.push(e.stack ? e.stack : e), console.error.apply(console, output);
    }, toDict = function() {
      var i, len, result;
      for (result = {}, i = 0, len = arguments.length; i < len; i++) result[arguments[i]] = true;
      return result;
    }, reserved = toDict("instanceof", "typeof", "in", "null", "true", "false", "undefined", "return"), 
    rx = /[a-zA-Z\u0410-\u044F\u0401\u0451_\.\$]/, isChar = function(x) {
      return x.match(rx);
    }, isDigit = function(x) {
      return x.charCodeAt() >= 48 && x.charCodeAt() <= 57;
    }, chars = toDict("+", "-", ">", "<", "=", "&", "|", "^", "!", "~"), isSign = function(x) {
      return chars[x] || false;
    }, assignmentOperator = toDict("=", "+=", "-=", "++", "--", "|=", "^=", "&=", "!=", "<<=", ">>="), 
    alight.utils.parsExpression = function(expression, option) {
      var build, convert, data, getFirstPart, inputKeywords, pars, ret, splitVariable, toElvis, uniq;
      return inputKeywords = toDict.apply(null, (option = option || {}).input || []), 
      uniq = 1, pars = function(option) {
        var a, an, ap, bracket, child, commitText, digit, filter, freeText, index, leftVariable, level, line, result, sign, status, stopKey, stringKey, stringValue, variable, variableChildren;
        for (line = option.line, result = option.result || [], index = option.index || 0, 
        level = option.level || 0, stopKey = option.stopKey || null, variable = "", leftVariable = null, 
        variableChildren = [], sign = "", digit = "", status = false, stringKey = "", stringValue = "", 
        freeText = "", bracket = 0, filter = null, commitText = function() {
          return freeText && result.push({
            type: "free",
            value: freeText
          }), freeText = "";
        }; index <= line.length; ) if (ap = line[index - 1], a = line[index++] || "", an = line[index], 
        (status && freeText || !a) && commitText(), "string" !== status) {
          if ("key" === status) {
            if (isChar(a) || isDigit(a)) {
              variable += a;
              continue;
            }
            if ("[" === a) {
              if (variable += a, !(child = pars({
                line: line,
                index: index,
                level: level + 1,
                stopKey: "]"
              })).stopKeyOk) throw "Error expression";
              index = child.index, variable += "###" + child.uniq + "###]", variableChildren.push(child);
              continue;
            }
            if ("?" === a && ("." === an || "(" === an || "[" === an)) {
              variable += a;
              continue;
            }
            if ("(" === a) {
              if (variable += a, !(child = pars({
                line: line,
                index: index,
                level: level + 1,
                stopKey: ")"
              })).stopKeyOk) throw "Error expression";
              index = child.index, variable += "###" + child.uniq + "###)", variableChildren.push(child);
              continue;
            }
            leftVariable = {
              type: "key",
              value: variable,
              start: index - variable.length - 1,
              finish: index - 1,
              children: variableChildren
            }, result.push(leftVariable), status = "", variable = "", variableChildren = [];
          } else if ("sign" === status) {
            if (isSign(a)) {
              sign += a;
              continue;
            }
            if ("|" === sign && 0 === level && 0 === bracket) {
              filter = line.substring(index - 1), index = line.length + 1;
              continue;
            }
            (assignmentOperator[sign] || "=" === sign[0] && "=" !== sign[1]) && (leftVariable.assignment = true), 
            result.push({
              type: "sign",
              value: sign
            }), status = "", sign = "";
          } else if ("digit" === status) {
            if (isDigit(a) || "." === a) {
              digit += a;
              continue;
            }
            result.push({
              type: "digit",
              value: digit
            }), digit = "";
          }
          if (isChar(a)) status = "key", variable += a; else if (isSign(a)) status = "sign", 
          sign += a; else if (isDigit(a)) status = "digit", digit += a; else if ('"' !== a && "'" !== a) {
            if (a === stopKey) return commitText(), {
              result: result,
              index: index,
              stopKeyOk: true,
              uniq: uniq++
            };
            "(" === a && bracket++, ")" === a && bracket--, "{" !== a ? (":" === a && "}" === stopKey && (leftVariable.type = "free"), 
            freeText += a) : (commitText(), child = pars({
              line: line,
              index: index,
              level: level + 1,
              stopKey: "}"
            }), result.push({
              type: "{}",
              child: child
            }), index = child.index);
          } else stringKey = a, status = "string", stringValue += a;
        } else {
          if (a === stringKey && "\\" !== ap) {
            stringValue += a, result.push({
              type: "string",
              value: stringValue
            }), stringValue = "", stringKey = "", status = "";
            continue;
          }
          stringValue += a;
        }
        return commitText(), {
          result: result,
          index: index,
          filter: filter
        };
      }, data = pars({
        line: expression
      }), ret = {
        isSimple: !data.filter,
        simpleVariables: []
      }, data.filter ? (ret.expression = expression.substring(0, expression.length - data.filter.length - 1), 
      ret.filter = data.filter) : ret.expression = expression, splitVariable = function(variable) {
        var parts;
        return {
          count: (parts = variable.split(/[\.\[\(\?]/)).length,
          firstPart: parts[0]
        };
      }, toElvis = function(name, isReserved) {
        return isReserved ? "($$=" + name + ",$$==null)?undefined:" : "($$=$$" + name + ",$$==null)?undefined:";
      }, getFirstPart = function(name) {
        return name.split(/[\.\[\(\?]/)[0];
      }, convert = function(variable) {
        var firstPart, full, i, isReserved, last, len, p, parts, ref, result;
        if ("this" === variable) return "$$scope";
        if (firstPart = getFirstPart(variable), isReserved = reserved[firstPart] || inputKeywords[firstPart], 
        "this" === firstPart && (variable = "$$scope" + variable.slice(4), isReserved = true), 
        1 === (parts = variable.split("?")).length) return isReserved ? variable : "$$scope." + variable;
        for (isReserved ? (result = toElvis(parts[0], true), full = parts[0]) : (result = toElvis("scope." + parts[0]), 
        full = "scope." + parts[0]), i = 0, len = (ref = parts.slice(1, parts.length - 1)).length; i < len; i++) "(" === (p = ref[i])[0] ? result += toElvis(full + p, isReserved) : (result += toElvis(p), 
        full += p);
        return "(" === (last = parts[parts.length - 1])[0] ? (isReserved || (result += "$$"), 
        result += full + last) : result += "$$" + last, "(" + result + ")";
      }, build = function(part) {
        var c, childName, d, i, j, key, len, len1, name, ref, ref1, result, sv;
        for (result = "", i = 0, len = (ref = part.result).length; i < len; i++) if ("key" !== (d = ref[i]).type) "{}" !== d.type ? result += d.value : result += "{" + build(d.child) + "}"; else {
          if (d.assignment ? (name = "this" === (sv = splitVariable(d.value)).firstPart ? "$$scope" + d.value.substring(4) : inputKeywords[sv.firstPart] ? d.value : sv.count < 2 ? "($$scope.$$root || $$scope)." + d.value : "$$scope." + d.value, 
          ret.isSimple = false) : reserved[d.value] ? name = d.value : (name = convert(d.value), 
          ret.simpleVariables.push(name)), d.children.length) for (j = 0, len1 = (ref1 = d.children).length; j < len1; j++) key = "###" + (c = ref1[j]).uniq + "###", 
          childName = build(c), name = name.split(key).join(childName);
          result += name;
        }
        return result;
      }, ret.result = build(data), alight.debug.parser && console.log(expression, ret), 
      ret;
    }, alight.utils.parsFilter = function(text) {
      var d, r, result;
      for (result = [], text = text.trim(); text; ) {
        if (!(d = text.match(/^(\w+)([^\w])(.*)$/))) {
          if (!(d = text.match(/^(\w+)$/))) return null;
          result.push({
            name: d[1],
            args: [],
            raw: ""
          });
          break;
        }
        "|" === d[2] ? (result.push({
          name: d[1],
          args: [],
          raw: ""
        }), text = d[3]) : (r = alight.utils.parsArguments(d[3], {
          stop: "|"
        }), result.push({
          name: d[1],
          args: r.result,
          raw: d[3].slice(0, r.length)
        }), text = d[3].slice(r.length + 1).trim());
      }
      return {
        result: result
      };
    }, alight.utils.parsArguments = function(text, option) {
      var a, arg, args, bracket, index, push, string0, string1;
      for (option = option || {}, index = 0, args = [], arg = "", bracket = 0, string0 = false, 
      string1 = false, push = function() {
        arg && (args.push(arg), arg = "");
      }; index <= text.length; ) if (a = text[index] || "", index++, string0) arg += a, 
      '"' === a && (string0 = false); else if (string1) arg += a, "'" === a && (string1 = false); else if ('"' !== a) if ("'" !== a) if (bracket) arg += a, 
      "(" === a && bracket++, ")" === a && bracket--; else if (" " !== a && "," !== a) {
        if (option.stop && option.stop === a) {
          push();
          break;
        }
        "(" === a && (bracket = 1), arg += a;
      } else push(); else arg += a, string1 = true; else arg += a, string0 = true;
      return push(), {
        result: args,
        length: index - 1
      };
    }, function() {
      var cache, clone, rawParsText;
      alight.utils.pars_start_tag = "{{", alight.utils.pars_finish_tag = "}}", rawParsText = function(line) {
        var finish_tag, get_part, index, pars, prev_index, result, rexp, start_tag;
        return start_tag = alight.utils.pars_start_tag, finish_tag = alight.utils.pars_finish_tag, 
        result = [], index = 0, prev_index = 0, get_part = function(count) {
          var r;
          return count = count || 1, r = line.substring(prev_index, index - count), prev_index = index, 
          r;
        }, rexp = null, pars = function(lvl, stop, force) {
          var a, a2, an;
          for (lvl || (rexp = {
            type: "expression",
            list: []
          }, result.push(rexp)), a = null; index < line.length; ) {
            if (a2 = a + (a = line[index]), an = line[index += 1], a === stop) return;
            if (!force) {
              if (a2 === finish_tag && 0 === lvl) return rexp.list.push(get_part(2)), true;
              "(" === a ? pars(lvl + 1, ")") : "{" === a ? pars(lvl + 1, "}") : '"' === a ? pars(lvl + 1, '"', true) : "'" === a ? pars(lvl + 1, "'", true) : "|" === a && 0 === lvl && ("|" === an ? index += 1 : rexp.list.push(get_part()));
            }
          }
        }, function() {
          var a, prev, r, text;
          for (prev = null, a = null; index < line.length; ) if (prev = a, a = line[index], 
          index += 1, prev + a === start_tag) {
            if ((text = get_part(2)) && result.push({
              type: "text",
              value: text
            }), !pars(0)) throw "Wrong expression" + line;
            a = null;
          }
          if (r = get_part(-1)) return result.push({
            type: "text",
            value: r
          });
        }(), alight.debug.parser && console.log("parsText", result), result;
      }, cache = {}, clone = function(result) {
        var i, k;
        return function() {
          var j, len, results;
          for (results = [], j = 0, len = result.length; j < len; j++) i = result[j], k = {
            type: i.type,
            value: i.value
          }, i.list && (k.list = i.list.slice()), results.push(k);
          return results;
        }();
      }, alight.utils.parsText = function(line) {
        var result;
        return (result = cache[line]) || (cache[line] = result = rawParsText(line)), clone(result);
      };
    }(), alight.utils.compile = self = {}, self.cache = {}, self.Function = Function, 
    self.expression = function(src, cfg) {
      var args, e, error, exp, fn, funcCache, hash, result;
      if (cfg = cfg || {}, hash = (src = src.trim()) + "#", hash += cfg.no_return ? "+" : "-", 
      hash += cfg.string ? "s" : "v", cfg.input && (hash += cfg.input.join(",")), funcCache = self.cache[hash]) return funcCache;
      exp = (funcCache = alight.utils.parsExpression(src, {
        input: cfg.input
      })).result, cfg.no_return || false ? result = "var $$;" + exp : cfg.string && !funcCache.filter ? (result = "var $$, __ = (" + exp + "); return '' + (__ || (__ == null?'':__))", 
      funcCache.rawExpression = "(__=" + exp + ") || (__ == null?'':__)") : result = "var $$;return (" + exp + ")";
      try {
        cfg.input ? ((args = cfg.input.slice()).unshift("$$scope"), args.push(result), fn = self.Function.apply(null, args)) : fn = self.Function("$$scope", result);
      } catch (error) {
        throw e = error, alight.exceptionHandler(e, "Wrong expression: " + src, {
          src: src,
          cfg: cfg
        }), "Wrong expression: " + exp;
      }
      return funcCache.fn = fn, self.cache[hash] = funcCache;
    }, self.cacheText = {}, self.buildText = function(text, data) {
      var d, escapedValue, fn, i, index, len, result;
      if (fn = self.cacheText[text]) return function() {
        return fn.call(data);
      };
      for (result = [], index = i = 0, len = data.length; i < len; index = ++i) "expression" === (d = data[index]).type ? d.fn ? result.push("this[" + index + "].fn(this.scope)") : result.push("((x=this[" + index + "].value) || (x == null?'':x))") : d.value && (escapedValue = d.value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n"), 
      result.push('"' + escapedValue + '"'));
      return result = result.join(" + "), fn = self.Function("var x; return (" + result + ")"), 
      self.cacheText[text] = fn, function() {
        return fn.call(data);
      };
    }, self.cacheSimpleText = {}, self.buildSimpleText = function(text, data) {
      var d, escapedValue, i, index, item, len, result, simpleVariables;
      if ((item = text ? self.cacheSimpleText[text] : null) || !data) return item || null;
      for (result = [], simpleVariables = [], index = i = 0, len = data.length; i < len; index = ++i) "expression" === (d = data[index]).type ? (result.push("(" + d.re + ")"), 
      d.simpleVariables && simpleVariables.push.apply(simpleVariables, d.simpleVariables)) : d.value && (escapedValue = d.value.replace(/\\/g, "\\\\").replace(/"/g, '\\"').replace(/\n/g, "\\n"), 
      result.push('"' + escapedValue + '"'));
      return result = result.join(" + "), item = {
        fn: self.Function("$$scope", "var $$, __; return (" + result + ")"),
        simpleVariables: simpleVariables
      }, text && (self.cacheSimpleText[text] = item), item;
    }, pathToEl = function(path) {
      var j, len, result;
      if (!path.length) return "el";
      for (result = "el", j = 0, len = path.length; j < len; j++) result += ".childNodes[" + path[j] + "]";
      return result;
    }, compileText = function(text) {
      var ce, d, data, j, key, len;
      for (j = 0, len = (data = alight.utils.parsText(text)).length; j < len; j++) if ("expression" === (d = data[j]).type) {
        if (d.list.length > 1) return null;
        if ("#" === (key = d.list[0])[0]) return null;
        if ("=" === key[0]) return null;
        if ("::" === key.slice(0, 2)) return null;
        if (!(ce = alight.utils.compile.expression(key, {
          string: true
        })).rawExpression) throw "Error";
        d.re = ce.rawExpression;
      }
      return alight.utils.compile.buildSimpleText(text, data).fn;
    }, alight.core.fastBinding = function(bindResult) {
      if (alight.option.fastBinding && !bindResult.directive && !bindResult.hook && bindResult.fb) return new FastBinding(bindResult);
    }, FastBinding = function(bindResult) {
      var path, self, source, walk;
      return source = [], (self = this).fastWatchFn = [], path = [], (walk = function(fb, deep) {
        var d, fn, it, j, k, key, l, len, len1, len2, ref, ref1, ref2, rel, rtext, text;
        if (fb.dir) for (rel = pathToEl(path), j = 0, len = (ref = fb.dir).length; j < len; j++) d = ref[j], 
        source.push("s.dir(" + self.fastWatchFn.length + ", " + rel + ");"), self.fastWatchFn.push(d);
        if (fb.attr) for (k = 0, len1 = (ref1 = fb.attr).length; k < len1; k++) text = (it = ref1[k]).value, 
        key = it.attrName, rel = pathToEl(path), fn = compileText(text), rtext = text.replace(/"/g, '\\"').replace(/\n/g, "\\n"), 
        fn ? (source.push('s.fw("' + rtext + '", ' + self.fastWatchFn.length + ", " + rel + ', "' + key + '");'), 
        self.fastWatchFn.push(fn)) : source.push("s.wt('" + rtext + "', " + rel + ", '" + key + "');");
        if (fb.text && (rel = pathToEl(path), fn = compileText(fb.text), rtext = fb.text.replace(/"/g, '\\"').replace(/\n/g, "\\n"), 
        fn ? (source.push('s.fw("' + rtext + '", ' + self.fastWatchFn.length + ", " + rel + ");"), 
        self.fastWatchFn.push(fn)) : source.push('s.wt("' + rtext + '", ' + rel + ");")), 
        fb.children) for (l = 0, len2 = (ref2 = fb.children).length; l < len2; l++) it = ref2[l], 
        path.length = deep + 1, path[deep] = it.index, walk(it.fb, deep + 1);
      })(bindResult.fb, 0), source = source.join("\n"), self.resultFn = alight.utils.compile.Function("s", "el", "f$", source), 
      this;
    }, FastBinding.prototype.bind = function(cd, element) {
      this.currentCD = cd, this.resultFn(this, element, f$);
    }, FastBinding.prototype.dir = function(fnIndex, el) {
      var cd, d, env, r;
      d = this.fastWatchFn[fnIndex], cd = this.currentCD, env = new Env({
        attrName: d.attrName,
        attrArgument: d.attrArgument,
        changeDetector: cd,
        fbData: d.fbData
      }), (r = d.fb.call(env, cd.scope, el, d.value, env)) && r.start && r.start();
    }, FastBinding.prototype.fw = function(text, fnIndex, element, attr) {
      var cd, fn, value, w;
      cd = this.currentCD, w = {
        isStatic: false,
        isArray: false,
        extraLoop: false,
        deep: false,
        value: value = (fn = this.fastWatchFn[fnIndex])(cd.locals),
        callback: null,
        exp: fn,
        src: text,
        onStop: null,
        el: element,
        ea: attr || null
      }, cd.watchList.push(w), execWatchObject(cd.scope, w, value);
    }, FastBinding.prototype.wt = function(expression, element, attr) {
      this.currentCD.watchText(expression, null, {
        element: element,
        elementAttr: attr
      });
    }, alight.hooks.attribute.unshift({
      code: "events",
      fn: function() {
        var d;
        (d = this.attrName.match(/^\@([\w\.\-]+)$/)) && (this.ns = "al", this.name = "on", 
        this.attrArgument = d[1]);
      }
    }), alight.hooks.eventModifier = {}, (setKeyModifier = function(name, key) {
      return alight.hooks.eventModifier[name] = {
        event: [ "keydown", "keypress", "keyup" ],
        fn: function(event, env) {
          event[key] || (env.stop = true);
        }
      };
    })("alt", "altKey"), setKeyModifier("control", "ctrlKey"), setKeyModifier("ctrl", "ctrlKey"), 
    setKeyModifier("meta", "metaKey"), setKeyModifier("shift", "shiftKey"), alight.hooks.eventModifier.self = function(event, env) {
      if (event.target !== env.element) return env.stop = true;
    }, alight.hooks.eventModifier.once = {
      beforeExec: function(event, env) {
        return env.unbind();
      }
    }, formatModifier = function(modifier, filterByEvents) {
      var e, i, inuse, len, ref, result;
      if (result = {}, "string" == typeof modifier ? result.event = modifier : "object" == typeof modifier && modifier.event && (result.event = modifier.event), 
      "string" == typeof result.event && (result.event = result.event.split(/\s+/)), filterByEvents && result.event) {
        for (inuse = false, i = 0, len = (ref = result.event).length; i < len; i++) if (e = ref[i], 
        filterByEvents.indexOf(e) >= 0) {
          inuse = true;
          break;
        }
        if (!inuse) return null;
      }
      return f$.isFunction(modifier) ? result.fn = modifier : modifier.fn && (result.fn = modifier.fn), 
      modifier.beforeExec && (result.beforeExec = modifier.beforeExec), modifier.init && (result.init = modifier.init), 
      result;
    }, alight.d.al.on = function(scope, element, expression, env) {
      var evConstructor, eventName;
      env.attrArgument && (alight.option.removeAttribute && (element.removeAttribute(env.attrName), 
      env.fbElement && env.fbElement.removeAttribute(env.attrName)), eventName = env.attrArgument.split(".")[0], 
      (evConstructor = function() {}).prototype = makeEvent(env.attrArgument, eventOption[eventName]), 
      expression && (evConstructor.prototype.fn = env.changeDetector.compile(expression, {
        no_return: true,
        input: [ "$event", "$element", "$value" ]
      })), evConstructor.prototype.expression = expression, env.fastBinding = function(scope, element, expression, env) {
        var callback, e, ev, i, len, ref;
        for ((ev = new evConstructor).scope = scope, ev.element = element, ev.cd = env.changeDetector, 
        callback = function(e) {
          return handler(ev, e);
        }, i = 0, len = (ref = ev.eventList).length; i < len; i++) e = ref[i], f$.on(element, e, callback);
        ev.initFn && ev.initFn(scope, element, expression, env), ev.unbind = function() {
          var j, len1, ref1;
          for (j = 0, len1 = (ref1 = ev.eventList).length; j < len1; j++) e = ref1[j], f$.off(element, e, callback);
        }, env.changeDetector.watch("$destroy", ev.unbind);
      }, env.fastBinding(scope, element, expression, env));
    }, keyCodes = {
      enter: 13,
      tab: 9,
      delete: 46,
      backspace: 8,
      esc: 27,
      space: 32,
      up: 38,
      down: 40,
      left: 37,
      right: 39
    }, eventOption = {
      click: {
        stop: true,
        prevent: true
      },
      dblclick: {
        stop: true,
        prevent: true
      },
      submit: {
        stop: true,
        prevent: true
      },
      keyup: {
        filterByKey: true
      },
      keypress: {
        filterByKey: true
      },
      keydown: {
        filterByKey: true
      }
    }, makeEvent = function(attrArgument, option) {
      var args, ev, eventName, filterByKey, i, k, len, modifier, ref;
      for (ev = {
        attrArgument: attrArgument,
        throttle: null,
        throttleTime: 0,
        debounce: null,
        debounceId: null,
        initFn: null,
        eventList: null,
        stop: (option = option || {}).stop || false,
        prevent: option.prevent || false,
        scan: true,
        modifiers: []
      }, eventName = (args = attrArgument.split("."))[0], filterByKey = null, (modifier = alight.hooks.eventModifier[eventName]) && (modifier = formatModifier(modifier)).event && (ev.eventList = modifier.event, 
      modifier.fn && ev.modifiers.push(modifier), modifier.init && (ev.initFn = modifier.init)), 
      ev.eventList || (ev.eventList = [ eventName ]), i = 0, len = (ref = args.slice(1)).length; i < len; i++) "stop" !== (k = ref[i]) ? "prevent" !== k ? "nostop" !== k ? "noprevent" !== k ? "noscan" !== k ? "throttle-" !== k.substring(0, 9) ? "debounce-" !== k.substring(0, 9) ? (modifier = alight.hooks.eventModifier[k]) ? (modifier = formatModifier(modifier, ev.eventList)) && ev.modifiers.push(modifier) : option.filterByKey && (null === filterByKey && (filterByKey = {}), 
      keyCodes[k] && (k = keyCodes[k]), filterByKey[k] = true) : ev.debounce = Number(k.substring(9)) : ev.throttle = Number(k.substring(9)) : ev.scan = false : ev.prevent = false : ev.stop = false : ev.prevent = true : ev.stop = true;
      return ev.filterByKey = filterByKey, ev;
    }, getValue = function(ev, event) {
      var element;
      return "checkbox" === (element = ev.element).type ? element.checked : "radio" === element.type ? element.value || element.checked : event.component ? event.value : element.value;
    }, execute = function(ev, event) {
      var error, error1, i, len, modifier, ref;
      for (i = 0, len = (ref = ev.modifiers).length; i < len; i++) (modifier = ref[i]).beforeExec && modifier.beforeExec(event, ev);
      if (ev.fn) try {
        ev.fn(ev.cd.locals, event, ev.element, getValue(ev, event));
      } catch (error1) {
        error = error1, alight.exceptionHandler(error, "Error in event: " + ev.attrArgument + " = " + ev.expression, {
          attr: ev.attrArgument,
          exp: ev.expression,
          scope: ev.scope,
          cd: ev.cd,
          element: ev.element,
          event: event
        });
      }
      ev.scan && ev.cd.scan();
    }, handler = function(ev, event) {
      var EV, env, i, len, modifier, ref;
      if (!ev.filterByKey || ev.filterByKey[event.keyCode]) {
        if (ev.modifiers.length) for ((EV = function() {}).prototype = ev, (env = new EV).stop = false, 
        i = 0, len = (ref = ev.modifiers).length; i < len; i++) if ((modifier = ref[i]).fn && (modifier.fn(event, env), 
        env.stop)) return;
        ev.prevent && event.preventDefault(), ev.stop && event.stopPropagation(), ev.debounce ? (ev.debounceId && clearTimeout(ev.debounceId), 
        ev.debounceId = setTimeout(function() {
          return ev.debounceId = null, execute(ev, event);
        }, ev.debounce)) : ev.throttle ? ev.throttleTime < Date.now() && (ev.throttleTime = Date.now() + ev.throttle, 
        execute(ev, event)) : execute(ev, event);
      }
    }, alight.hooks.attribute.unshift({
      code: "directDirective",
      fn: function() {
        var d = this.attrName.match(/^(.*)\!$/);
        if (d) {
          var name = d[1].replace(/(-\w)/g, function(m) {
            return m.substring(1).toUpperCase();
          }), fn = this.cd.locals[name] || alight.ctrl[name] || alight.option.globalController && window[name];
          f$.isFunction(fn) ? this.directive = function(scope, element, value, env) {
            var cd = env.changeDetector;
            if (value) {
              for (var args = alight.utils.parsArguments(value), values = Array(args.result.length), i = 0; i < args.result.length; i++) values[i] = alight.utils.compile.expression(args.result[i], {
                input: [ "$element", "$env" ]
              }).fn(cd.locals, element, env);
              fn.apply(cd, values);
            } else fn.call(cd, scope, element, value, env);
          } : (this.result = "noDirective", this.stop = true);
        }
      }
    }), alight.hooks.attribute.unshift({
      code: "elementVariable",
      fn: function() {
        var d = this.attrName.match(/^#([\w\.]*)$/);
        d && (this.directive = setElementToName, this.attrArgument = d[1]);
      }
    }), alight.d.al.value = function(scope, element, variable, env) {
      var updateModel, watch;
      return env.fastBinding = true, updateModel = function() {
        env.setValue(variable, element.value), watch.refresh(), env.scan();
      }, env.on(element, "input", updateModel), env.on(element, "change", updateModel), 
      watch = env.watch(variable, function(value) {
        return null == value && (value = ""), element.value = value, "$scanNoChanges";
      });
    }, alight.d.al.checked = function(scope, element, name, env) {
      var fbData = env.fbData = {
        opt: {},
        watch: []
      };
      function eattr(attrName) {
        var result = env.takeAttr(attrName);
        return alight.option.removeAttribute && (element.removeAttribute(attrName), env.fbElement && env.fbElement.removeAttribute(attrName)), 
        result;
      }
      function takeAttr(name, attrName) {
        var text = eattr(attrName);
        if (text) return fbData.opt[name] = text, true;
        var exp = eattr(":" + attrName) || eattr("al-attr." + attrName);
        return exp ? (fbData.watch.push([ exp, name ]), true) : void 0;
      }
      function applyOpt(opt, env, updateDOM) {
        for (var k in env.fbData.opt) opt[k] = env.fbData.opt[k];
        for (var _loop_1 = function(w) {
          var name_1 = w[1];
          env.watch(w[0], function(value) {
            opt[name_1] = value, updateDOM();
          });
        }, _i = 0, _a = env.fbData.watch; _i < _a.length; _i++) {
          _loop_1(_a[_i]);
        }
      }
      takeAttr("value", "value") ? env.fastBinding = function(scope, element, name, env) {
        var watch, array = null;
        function updateDOM() {
          return element.checked = array && array.indexOf(opt.value) >= 0, "$scanNoChanges";
        }
        var opt = {};
        applyOpt(opt, env, updateDOM), watch = env.watch(name, function(input) {
          array = input, Array.isArray(array) || (array = null), updateDOM();
        }, {
          isArray: true
        }), env.on(element, "change", function() {
          if (array || (array = [], env.setValue(name, array)), element.checked) array.indexOf(opt.value) < 0 && array.push(opt.value); else {
            var i = array.indexOf(opt.value);
            i >= 0 && array.splice(i, 1);
          }
          watch.refresh(), env.scan();
        });
      } : (takeAttr("true", "true-value"), takeAttr("false", "false-value"), env.fastBinding = function(scope, element, name, env) {
        var value, watch, opt = {
          true: true,
          false: false
        };
        function updateDOM() {
          return element.checked = value === opt.true, "$scanNoChanges";
        }
        applyOpt(opt, env, updateDOM), watch = env.watch(name, function(input) {
          value = input, updateDOM();
        }), env.on(element, "change", function() {
          value = element.checked ? opt.true : opt.false, env.setValue(name, value), watch.refresh(), 
          env.scan();
        });
      }), env.fastBinding(scope, element, name, env);
    }, alight.d.al.if = function(scope, element, name, env) {
      var self;
      return env.elementCanBeRemoved ? (alight.exceptionHandler(null, env.attrName + " can't control element because of " + env.elementCanBeRemoved, {
        scope: scope,
        element: element,
        value: name,
        env: env
      }), {}) : (env.stopBinding = true, self = {
        item: null,
        childCD: null,
        base_element: null,
        top_element: null,
        start: function() {
          self.prepare(), self.watchModel();
        },
        prepare: function() {
          self.base_element = element, self.top_element = document.createComment(" " + env.attrName + ": " + name + " "), 
          f$.before(element, self.top_element), f$.remove(element);
        },
        updateDom: function(value) {
          value ? self.insertBlock(value) : self.removeBlock();
        },
        removeBlock: function() {
          self.childCD && (self.childCD.destroy(), self.childCD = null, self.removeDom(self.item), 
          self.item = null);
        },
        insertBlock: function() {
          self.childCD || (self.item = self.base_element.cloneNode(true), self.insertDom(self.top_element, self.item), 
          self.childCD = env.changeDetector.new(), alight.bind(self.childCD, self.item, {
            skip_attr: env.skippedAttr(),
            elementCanBeRemoved: env.attrName
          }));
        },
        watchModel: function() {
          env.watch(name, self.updateDom);
        },
        removeDom: function(element) {
          f$.remove(element);
        },
        insertDom: function(base, element) {
          f$.after(base, element);
        }
      });
    }, alight.d.al.ifnot = function(scope, element, name, env) {
      var self;
      return (self = alight.d.al.if(scope, element, name, env)).updateDom = function(value) {
        value ? self.removeBlock() : self.insertBlock();
      }, self;
    }, alight.directives.al.repeat = {
      restrict: "AM",
      init: function(parentScope, element, exp, env) {
        var CD, self;
        return env.elementCanBeRemoved ? (alight.exceptionHandler(null, env.attrName + " can't control element because of " + env.elementCanBeRemoved, {
          scope: parentScope,
          element: element,
          value: exp,
          env: env
        }), {}) : (env.stopBinding = true, CD = env.changeDetector, self = {
          start: function() {
            self.parsExpression(), self.prepareDom(), self.buildUpdateDom(), self.watchModel();
          },
          parsExpression: function() {
            var r, s;
            if ("(" === (s = exp.trim())[0]) if (self.objectMode = true, r = s.match(/\((\w+),\s*(\w+)\)\s+in\s+(.+)\s+orderBy:(.+)\s*$/)) self.objectKey = r[1], 
            self.objectValue = r[2], self.expression = r[3] + " | toArray:" + self.objectKey + "," + self.objectValue + " | orderBy:" + r[4], 
            self.nameOfKey = "$item", self.trackExpression = "$item." + self.objectKey; else {
              if (!(r = s.match(/\((\w+),\s*(\w+)\)\s+in\s+(.+)\s*$/))) throw "Wrong repeat: " + exp;
              self.objectKey = r[1], self.objectValue = r[2], self.expression = r[3] + " | toArray:" + self.objectKey + "," + self.objectValue, 
              self.nameOfKey = "$item", self.trackExpression = "$item." + self.objectKey;
            } else {
              if ((r = s.match(/(.*) track by ([\w\.\$\(\)]+)/)) && (self.trackExpression = r[2], 
              s = r[1]), !(r = s.match(/\s*(\w+)\s+in\s+(.+)/))) throw "Wrong repeat: " + exp;
              self.nameOfKey = r[1], self.expression = r[2];
            }
          },
          watchModel: function() {
            var flags;
            flags = self.objectMode ? {
              deep: true
            } : {
              isArray: true
            }, self.watch = CD.watch(self.expression, self.updateDom, flags);
          },
          prepareDom: function() {
            var el, element_list, i, len, t2;
            if (8 === element.nodeType) {
              for (self.top_element = element, self.element_list = element_list = [], el = element.nextSibling; el; ) {
                if (8 === el.nodeType && "/directive:" === (t2 = el.nodeValue.trim().split(/\s+/))[0] && "al-repeat" === t2[1]) {
                  env.skipToElement = el;
                  break;
                }
                element_list.push(el), el = el.nextSibling;
              }
              for (i = 0, len = element_list.length; i < len; i++) el = element_list[i], f$.remove(el);
            } else self.base_element = element, self.top_element = document.createComment(" " + exp + " "), 
            f$.before(element, self.top_element), f$.remove(element), alight.option.removeAttribute && element.removeAttribute(env.attrName);
          },
          makeChild: function(item, index, list) {
            var childCD;
            return childCD = CD.new(null, {
              locals: true
            }), self.updateLocals(childCD, item, index, list), childCD;
          },
          updateLocals: function(childCD, item, index, list) {
            var locals;
            locals = childCD.locals, self.objectMode ? (locals[self.objectKey] = item[self.objectKey], 
            locals[self.objectValue] = item[self.objectValue]) : locals[self.nameOfKey] = item, 
            locals.$index = index, locals.$first = 0 === index, locals.$last = index === list.length - 1;
          },
          rawUpdateDom: function(removes, inserts) {
            var e, i, it, j, len, len1;
            for (i = 0, len = removes.length; i < len; i++) e = removes[i], f$.remove(e);
            for (j = 0, len1 = inserts.length; j < len1; j++) it = inserts[j], f$.after(it.after, it.element);
          },
          buildUpdateDom: function() {
            return self.updateDom = function() {
              var _getId, _id, fastBinding, generator, getResultList, index, node_by_id, node_del, node_get, node_set, nodes, skippedAttrs, version, fn;
              return nodes = [], index = 0, fastBinding = null, version = 0, skippedAttrs = env.skippedAttr(), 
              "$index" === self.trackExpression ? (node_by_id = {}, node_get = function(item) {
                return node_by_id[index] || null;
              }, node_del = function(node) {
                null != node.$id && delete node_by_id[node.$id];
              }, node_set = function(item, node) {
                node.$id = index, node_by_id[index] = node;
              }) : self.trackExpression ? (node_by_id = {}, fn = CD.compile(self.trackExpression, {
                input: [ "$id", self.nameOfKey ]
              }), _getId = function(a, b) {
                return fn(CD.scope, a, b);
              }, _id = function(item) {
                var id;
                return (id = item.$alite_id) ? id : id = item.$alite_id = alight.utils.getId();
              }, node_get = function(item) {
                var $id;
                return null != ($id = _getId(_id, item)) ? node_by_id[$id] : null;
              }, node_del = function(node) {
                var $id;
                null != ($id = node.$id) && delete node_by_id[$id];
              }, node_set = function(item, node) {
                var $id;
                $id = _getId(_id, item), node.$id = $id, node_by_id[$id] = node;
              }) : window.Map ? (node_by_id = new Map, node_get = function(item) {
                return node_by_id.get(item);
              }, node_del = function(node) {
                node_by_id.delete(node.item);
              }, node_set = function(item, node) {
                node_by_id.set(item, node);
              }) : (node_by_id = {}, node_get = function(item) {
                var $id;
                return "object" != typeof item ? node_by_id[item] || null : ($id = item.$alite_id) ? node_by_id[$id] : null;
              }, node_del = function(node) {
                var $id;
                $id = node.$id, node_by_id[$id] && (node.$id = null, delete node_by_id[$id]);
              }, node_set = function(item, node) {
                var $id;
                "object" == typeof item ? ($id = alight.utils.getId(), item.$alite_id = $id, node.$id = $id, 
                node_by_id[$id] = node) : (node.$id = item, node_by_id[item] = node);
              }), generator = [], getResultList = function(input) {
                var size, t;
                if ("object" !== (t = typeof input)) {
                  if ("number" === t) size = Math.floor(input); else if ("string" === t && (size = Math.floor(input), 
                  isNaN(size))) return [];
                  if (size < generator.length) generator.length = size; else for (;generator.length < size; ) generator.push(generator.length);
                  return generator;
                }
                return input && input.length ? input : [];
              }, self.element_list ? function(input) {
                var applyList, bel, childCD, dom_inserts, dom_removes, el, elLast, element_list, i, it, item, item_value, j, k, l, last_element, len, len1, len2, len3, len4, len5, len6, len7, list, m, n, next2, node, nodes2, o, p, prev_moved, prev_node, ref, ref1, ref2;
                for (list = getResultList(input), last_element = self.top_element, dom_inserts = [], 
                nodes2 = [], i = 0, len = nodes.length; i < len; i++) (node = nodes[i]).active = false;
                for (index = j = 0, len1 = list.length; j < len1; index = ++j) item = list[index], 
                (node = node_get(item)) && (node.active = true);
                for (dom_removes = [], k = 0, len2 = nodes.length; k < len2; k++) if (!(node = nodes[k]).active) {
                  for (node.prev && (node.prev.next = node.next), node.next && (node.next.prev = node.prev), 
                  node_del(node), node.CD.destroy(), l = 0, len3 = (ref = node.element_list).length; l < len3; l++) el = ref[l], 
                  dom_removes.push(el);
                  node.next = null, node.prev = null, node.element_list = null;
                }
                for (applyList = [], prev_node = null, prev_moved = false, elLast = self.element_list.length - 1, 
                index = m = 0, len4 = list.length; m < len4; index = ++m) if (item_value = item = list[index], 
                node = node_get(item)) {
                  if (self.updateLocals(node.CD, item, index, list), node.prev === prev_node) {
                    if (prev_moved) for (n = 0, len5 = (ref1 = node.element_list).length; n < len5; n++) el = ref1[n], 
                    dom_inserts.push({
                      element: el,
                      after: last_element
                    }), last_element = el;
                    prev_node = node, last_element = node.element_list[elLast], node.active = true, 
                    nodes2.push(node);
                    continue;
                  }
                  for (node.prev = prev_node, prev_node && (prev_node.next = node), o = 0, len6 = (ref2 = node.element_list).length; o < len6; o++) el = ref2[o], 
                  dom_inserts.push({
                    element: el,
                    after: last_element
                  }), last_element = el;
                  prev_moved = true, prev_node = node, node.active = true, nodes2.push(node);
                } else childCD = self.makeChild(item_value, index, list), element_list = function() {
                  var len7, p, ref3, results;
                  for (results = [], p = 0, len7 = (ref3 = self.element_list).length; p < len7; p++) bel = ref3[p], 
                  el = bel.cloneNode(true), applyList.push({
                    cd: childCD,
                    el: el
                  }), dom_inserts.push({
                    element: el,
                    after: last_element
                  }), results.push(last_element = el);
                  return results;
                }(), node_set(item, node = {
                  CD: childCD,
                  element_list: element_list,
                  prev: prev_node,
                  next: null,
                  active: true,
                  item: item
                }), prev_node ? (next2 = prev_node.next, prev_node.next = node, node.next = next2, 
                next2 && (next2.prev = node)) : 0 === index && nodes[0] && (next2 = nodes[0], node.next = next2, 
                next2.prev = node), prev_node = node, nodes2.push(node);
                for (nodes = nodes2, self.rawUpdateDom(dom_removes, dom_inserts), dom_removes.length = 0, 
                dom_inserts.length = 0, p = 0, len7 = applyList.length; p < len7; p++) it = applyList[p], 
                alight.bind(it.cd, it.el, {
                  skip_attr: skippedAttrs,
                  elementCanBeRemoved: env.attrName,
                  noDomOptimization: true
                });
              } : function(input) {
                var applyList, childCD, dom_inserts, dom_removes, fbElement, i, it, item, item_value, j, k, last_element, len, len1, len2, list, next2, node, nodes2, prev_moved, prev_node, r;
                for (list = getResultList(input), last_element = self.top_element, version++, dom_inserts = [], 
                nodes2 = [], applyList = [], prev_node = null, prev_moved = false, index = i = 0, 
                len = list.length; i < len; index = ++i) if (item_value = item = list[index], node = node_get(item)) {
                  if (self.updateLocals(node.CD, item, index, list), node.prev === prev_node) {
                    prev_moved && dom_inserts.push({
                      element: node.element,
                      after: prev_node.element
                    }), prev_node = node, last_element = node.element, node.version = version, nodes2.push(node);
                    continue;
                  }
                  node.prev = prev_node, prev_node && (prev_node.next = node), dom_inserts.push({
                    element: node.element,
                    after: last_element
                  }), prev_moved = true, last_element = node.element, prev_node = node, node.version = version, 
                  nodes2.push(node);
                } else childCD = self.makeChild(item_value, index, list), element = self.base_element.cloneNode(true), 
                null === fastBinding ? (fbElement = self.base_element.cloneNode(true), r = alight.bind(childCD, element, {
                  skip_attr: skippedAttrs,
                  elementCanBeRemoved: env.attrName,
                  noDomOptimization: true,
                  fbElement: fbElement
                }), (fastBinding = alight.core.fastBinding(r) || false) && (self.base_element = fbElement)) : applyList.push({
                  cd: childCD,
                  el: element
                }), dom_inserts.push({
                  element: element,
                  after: last_element
                }), last_element = element, node_set(item, node = {
                  CD: childCD,
                  element: element,
                  prev: prev_node,
                  next: null,
                  version: version,
                  item: item
                }), prev_node ? (next2 = prev_node.next, prev_node.next = node, node.next = next2, 
                next2 && (next2.prev = node)) : 0 === index && nodes[0] && (next2 = nodes[0], node.next = next2, 
                next2.prev = node), prev_node = node, nodes2.push(node);
                for (dom_removes = [], j = 0, len1 = nodes.length; j < len1; j++) (node = nodes[j]).version !== version && (node.prev && (node.prev.next = node.next), 
                node.next && (node.next.prev = node.prev), node_del(node), node.CD.destroy(), dom_removes.push(node.element), 
                node.next = null, node.prev = null, node.element = null);
                for (nodes = nodes2, self.rawUpdateDom(dom_removes, dom_inserts), dom_removes.length = 0, 
                dom_inserts.length = 0, k = 0, len2 = applyList.length; k < len2; k++) it = applyList[k], 
                fastBinding ? fastBinding.bind(it.cd, it.el) : alight.bind(it.cd, it.el, {
                  skip_attr: skippedAttrs,
                  elementCanBeRemoved: env.attrName,
                  noDomOptimization: true
                });
              };
            }();
          }
        });
      }
    }, alight.d.al.init = function(scope, element, exp, env) {
      var cd, e, error, fb, fn, input;
      alight.option.removeAttribute && (element.removeAttribute(env.attrName), env.fbElement && env.fbElement.removeAttribute(env.attrName)), 
      cd = env.changeDetector, input = [ "$element" ], "window" === env.attrArgument && input.push("window");
      try {
        fn = cd.compile(exp, {
          no_return: true,
          input: input
        }), env.fastBinding = fb = function(scope, element, exp, env) {
          return fn(env.changeDetector.locals, element, window);
        }, fb(0, element, 0, env);
      } catch (error) {
        e = error, alight.exceptionHandler(e, "al-init, error in expression: " + exp, {
          exp: exp,
          scope: scope,
          cd: cd,
          element: element
        }), env.fastBinding = function() {};
      }
    }, alight.d.al.app = {
      stopBinding: true
    }, alight.d.al.stop = {
      restrict: "AE",
      stopBinding: true
    }, alight.d.al.cloak = function(scope, element, name, env) {
      element.removeAttribute(env.attrName), name && f$.removeClass(element, name);
    }, alight.d.al.html = {
      restrict: "AM",
      priority: 100,
      modifier: {},
      link: function(scope, element, inputName, env) {
        var self;
        return env.elementCanBeRemoved && 8 !== element.nodeType ? (alight.exceptionHandler(null, env.attrName + " can't control element because of " + env.elementCanBeRemoved, {
          scope: scope,
          element: element,
          value: inputName,
          env: env
        }), {}) : (env.stopBinding = true, self = {
          baseElement: null,
          topElement: null,
          activeElement: null,
          childCD: null,
          name: inputName,
          watchMode: null,
          start: function() {
            self.parsing(), self.prepare(), self.watchModel();
          },
          parsing: function() {
            var i, len, modifierName, ref;
            if (env.attrArgument) for (i = 0, len = (ref = env.attrArgument.split(".")).length; i < len; i++) "literal" !== (modifierName = ref[i]) ? "tpl" !== modifierName ? alight.d.al.html.modifier[modifierName] && alight.d.al.html.modifier[modifierName](self, {
              scope: scope,
              element: element,
              inputName: inputName,
              env: env
            }) : self.watchMode = "tpl" : self.watchMode = "literal";
          },
          prepare: function() {
            8 === element.nodeType ? (self.baseElement = null, self.topElement = element) : (self.baseElement = element, 
            self.topElement = document.createComment(" " + env.attrName + ": " + inputName + " "), 
            f$.before(element, self.topElement), f$.remove(element));
          },
          removeBlock: function() {
            var el, i, len, ref;
            if (self.childCD && (self.childCD.destroy(), self.childCD = null), self.activeElement) {
              if (Array.isArray(self.activeElement)) for (i = 0, len = (ref = self.activeElement).length; i < len; i++) el = ref[i], 
              self.removeDom(el); else self.removeDom(self.activeElement);
              self.activeElement = null;
            }
          },
          insertBlock: function(html) {
            var current, el, t;
            if (self.baseElement) self.activeElement = self.baseElement.cloneNode(false), self.activeElement.innerHTML = html, 
            self.insertDom(self.topElement, self.activeElement), self.childCD = env.changeDetector.new(), 
            alight.bind(self.childCD, self.activeElement, {
              skip_attr: env.skippedAttr(),
              elementCanBeRemoved: env.attrName
            }); else for ((t = document.createElement("body")).innerHTML = html, current = self.topElement, 
            self.activeElement = [], self.childCD = env.changeDetector.new(); el = t.firstChild; ) self.insertDom(current, el), 
            current = el, self.activeElement.push(el), alight.bind(self.childCD, current, {
              skip_attr: env.skippedAttr(),
              elementCanBeRemoved: env.attrName
            });
          },
          updateDom: function(html) {
            self.removeBlock(), html && self.insertBlock(html);
          },
          removeDom: function(element) {
            f$.remove(element);
          },
          insertDom: function(base, element) {
            f$.after(base, element);
          },
          watchModel: function() {
            "literal" === self.watchMode ? self.updateDom(self.name) : "tpl" === self.watchMode ? env.watchText(self.name, self.updateDom) : env.watch(self.name, self.updateDom);
          }
        });
      }
    }, alight.d.al.html.modifier.id = function(self) {
      return self.updateDom = function(id) {
        var html, tpl;
        self.removeBlock(), (tpl = document.getElementById(id)) && (html = tpl.innerHTML) && self.insertBlock(html);
      };
    }, alight.d.al.html.modifier.url = function(self) {
      return self.loadHtml = function(cfg) {
        f$.ajax(cfg);
      }, self.updateDom = function(url) {
        url ? self.loadHtml({
          cache: true,
          url: url,
          success: function(html) {
            self.removeBlock(), self.insertBlock(html);
          },
          error: self.removeBlock
        }) : self.removeBlock();
      };
    }, alight.d.al.html.modifier.scope = function(self, option) {
      var d, oneTime, outerName;
      if (2 === (d = self.name.split(":")).length) self.name = d[0], outerName = d[1]; else {
        if (d = self.name.match(/(.+)\:\s*\:\:([\d\w]+)$/)) oneTime = true; else if (oneTime = false, 
        !(d = self.name.match(/(.+)\:\s*([\.\w]+)$/))) throw "Wrong expression " + self.name;
        self.name = d[1], outerName = d[2];
      }
      return self.insertBlock = function(html) {
        var childCD, parentCD, w;
        self.activeElement = self.baseElement.cloneNode(false), self.activeElement.innerHTML = html, 
        self.insertDom(self.topElement, self.activeElement), parentCD = option.env.changeDetector, 
        (childCD = self.childCD = parentCD.new(null, {
          locals: true
        })).locals.outer = null, w = parentCD.watch(outerName, function(outerValue) {
          return childCD.locals.outer = outerValue;
        }, {
          oneTime: oneTime
        }), self.childCD.watch("$destroy", function() {
          return w.stop();
        }), alight.bind(self.childCD, self.activeElement, {
          skip_attr: option.env.skippedAttr()
        });
      };
    }, alight.d.al.html.modifier.inline = function(self, option) {
      var originalPrepare;
      return originalPrepare = self.prepare, self.prepare = function() {
        return originalPrepare(), option.env.setValue(self.name, self.baseElement.innerHTML);
      };
    }, alight.d.al.radio = function(scope, element, name, env) {
      var key, value, watch;
      return key = env.takeAttr("al-value"), value = key ? env.eval(key) : env.takeAttr("value"), 
      env.on(element, "change", function() {
        env.setValue(name, value), watch.refresh(), env.scan();
      }), watch = env.watch(name, function(newValue) {
        return element.checked = value === newValue, "$scanNoChanges";
      });
    }, window.Map ? ((Mapper = function() {
      return this.idByItem = new Map, this.itemById = {}, this.index = 1, this;
    }).prototype.acquire = function(item) {
      var id;
      return id = "i" + this.index++, this.idByItem.set(item, id), this.itemById[id] = item, 
      id;
    }, Mapper.prototype.release = function(id) {
      var item;
      item = this.itemById[id], delete this.itemById[id], this.idByItem.delete(item);
    }, Mapper.prototype.replace = function(id, item) {
      var old;
      old = this.itemById[id], this.idByItem.delete(old), this.idByItem.set(item, id), 
      this.itemById[id] = item;
    }, Mapper.prototype.getId = function(item) {
      return this.idByItem.get(item);
    }, Mapper.prototype.getItem = function(id) {
      return this.itemById[id] || null;
    }) : ((Mapper = function() {
      return this.itemById = {
        "i#null": null
      }, this;
    }).prototype.acquire = function(item) {
      var id;
      return null === item ? "i#null" : ("object" == typeof item ? (id = item.$alite_id) || (item.$alite_id = id = alight.utils.getId()) : id = "" + item, 
      this.itemById[id] = item, id);
    }, Mapper.prototype.release = function(id) {
      delete this.itemById[id];
    }, Mapper.prototype.replace = function(id, item) {
      this.itemById[id] = item;
    }, Mapper.prototype.getId = function(item) {
      return null === item ? "i#null" : "object" == typeof item ? item.$alite_id : "" + item;
    }, Mapper.prototype.getItem = function(id) {
      return this.itemById[id] || null;
    }), alight.d.al.select = function(scope, element, key, env) {
      var cd, lastValue, mapper, onChangeDOM, setValueOfElement, watch;
      return cd = env.changeDetector.new(), env.stopBinding = true, cd.$select = {
        mapper: mapper = new Mapper
      }, lastValue = null, cd.$select.change = function() {
        return alight.nextTick(function() {
          return setValueOfElement(lastValue);
        });
      }, setValueOfElement = function(value) {
        var id;
        return (id = mapper.getId(value)) ? element.value = id : element.selectedIndex = -1;
      }, watch = cd.watch(key, function(value) {
        return lastValue = value, setValueOfElement(value);
      }), onChangeDOM = function(event) {
        return lastValue = mapper.getItem(event.target.value), cd.setValue(key, lastValue), 
        watch.refresh(), cd.scan();
      }, env.on(element, "input", onChangeDOM), env.on(element, "change", onChangeDOM), 
      alight.bind(cd, element, {
        skip_attr: env.skippedAttr()
      });
    }, alight.d.al.option = function(scope, element, key, env) {
      var cd, id, j, mapper, select, step;
      for (cd = step = env.changeDetector, j = 0; j <= 4 && !(select = step.$select); ++j) step = step.parent || {};
      select ? (mapper = select.mapper, id = null, cd.watch(key, function(item) {
        id ? mapper.getId(item) !== id ? (mapper.release(id), id = mapper.acquire(item), 
        element.value = id, select.change()) : mapper.replace(id, item) : (id = mapper.acquire(item), 
        element.value = id, select.change());
      }), cd.watch("$destroy", function() {
        return mapper.release(id), select.change();
      })) : alight.exceptionHandler("", "Error in al-option - al-select is not found", {
        cd: cd,
        scope: cd.scope,
        element: element,
        value: key
      });
    }, alight.hooks.attribute.unshift({
      code: "attribute",
      fn: function() {
        var d, value;
        (d = this.attrName.match(/^\:([\w\.\-]+)$/)) && ("html" === (value = d[1]).split(".")[0] ? (this.name = "html", 
        value = value.substring(5)) : this.name = "attr", this.ns = "al", this.attrArgument = value);
      }
    }), props = {
      checked: "checked",
      readonly: "readOnly",
      value: "value",
      selected: "selected",
      muted: "muted",
      disabled: "disabled",
      hidden: "hidden"
    }, alight.d.al.attr = function(scope, element, key, env) {
      var args, attrName, d, fn, isTemplate, list, prop, setter, styleName, watch;
      if (env.attrArgument) {
        if (d = env.attrArgument.split("."), attrName = d[0], prop = props[attrName], isTemplate = d.indexOf("tpl") > 0, 
        alight.option.removeAttribute && (element.removeAttribute(env.attrName), env.fbElement && env.fbElement.removeAttribute(env.attrName)), 
        args = {
          readOnly: true
        }, setter = null, "style" === attrName) {
          if (!d[1]) throw "Style is not declared";
          styleName = d[1].replace(/(-\w)/g, function(m) {
            return m.substring(1).toUpperCase();
          }), setter = function(element, value) {
            return null == value && (value = ""), element.style[styleName] = value;
          };
        } else "class" === attrName && d.length > 1 ? (isTemplate = false, list = d.slice(1), 
        setter = function(element, value) {
          var c, i, j, len, len1;
          if (value) for (i = 0, len = list.length; i < len; i++) c = list[i], f$.addClass(element, c); else for (j = 0, 
          len1 = list.length; j < len1; j++) c = list[j], f$.removeClass(element, c);
        }) : "focus" === attrName ? setter = function(element, value) {
          return value ? element.focus() : element.blur();
        } : prop ? setter = function(element, value) {
          if (void 0 === value && (value = null), element[prop] !== value) return element[prop] = value;
        } : (args.element = element, args.elementAttr = attrName);
        watch = isTemplate ? "watchText" : "watch", fn = setter ? function(scope, element, _, env) {
          return env.changeDetector[watch](key, function(value) {
            return setter(element, value);
          }, args);
        } : function(scope, element, _, env) {
          return env.changeDetector[watch](key, null, {
            readOnly: true,
            element: element,
            elementAttr: attrName
          });
        }, fn(scope, element, key, env), env.fastBinding = fn;
      }
    }, alight.d.al.model = function(scope, element, value, env) {
      var name;
      if ("select" === (name = element.nodeName.toLowerCase())) return alight.d.al.select.call(this, scope, element, value, env);
      if ("input" === name) {
        if ("checkbox" === element.type) return alight.d.al.checked.call(this, scope, element, value, env);
        if ("radio" === element.type) return alight.d.al.radio.call(this, scope, element, value, env);
      }
      return alight.d.al.value.call(this, scope, element, value, env);
    }, alight.filters.slice = function(value, a, b) {
      return value ? b ? value.slice(a, b) : value.slice(a) : null;
    }, d2 = function(x) {
      return x < 10 ? "0" + x : "" + x;
    }, alight.filters.date = function(value, format) {
      var d, i, len, r, x;
      if (!value) return "";
      for (r = format, i = 0, len = (x = [ [ /yyyy/g, (value = new Date(value)).getFullYear() ], [ /mm/g, d2(value.getMonth() + 1) ], [ /dd/g, d2(value.getDate()) ], [ /HH/g, d2(value.getHours()) ], [ /MM/g, d2(value.getMinutes()) ], [ /SS/g, d2(value.getSeconds()) ] ]).length; i < len; i++) d = x[i], 
      r = r.replace(d[0], d[1]);
      return r;
    }, alight.filters.json = {
      watchMode: "deep",
      fn: function(value) {
        return JSON.stringify(alight.utils.clone(value), null, 4);
      }
    }, alight.filters.filter = function(input, _a, _b) {
      var d, i, j, k, key, len, len1, result, svalue, v, value;
      if (2 === arguments.length) key = null, value = _a; else {
        if (3 !== arguments.length) return input;
        key = _a, value = _b;
      }
      if (!input || null == value || "" === value) return input;
      if (result = [], svalue = ("" + value).toLowerCase(), key) for (i = 0, len = input.length; i < len; i++) ((d = input[i])[key] === value || ("" + d[key]).toLowerCase().indexOf(svalue) >= 0) && result.push(d); else for (j = 0, 
      len1 = input.length; j < len1; j++) for (k in d = input[j]) ((v = d[k]) === value || ("" + v).toLowerCase().indexOf(svalue) >= 0) && result.push(d);
      return result;
    }, alight.filters.orderBy = function(value, key, reverse) {
      return !value instanceof Array ? null : (reverse = reverse ? 1 : -1, value.sort(function(a, b) {
        return a[key] < b[key] ? -reverse : a[key] > b[key] ? reverse : 0;
      }));
    }, alight.filters.throttle = {
      init: function(scope, delay, env) {
        var to;
        return delay = Number(delay), to = null, {
          onChange: function(value) {
            return to && clearTimeout(to), to = setTimeout(function() {
              return to = null, env.setValue(value), env.changeDetector.scan();
            }, delay);
          }
        };
      }
    }, alight.filters.toArray = {
      init: function(scope, exp, env) {
        var keyName, result, valueName;
        return 2 === env.conf.args.length ? (keyName = env.conf.args[0], valueName = env.conf.args[1]) : (keyName = "key", 
        valueName = "value"), result = [], {
          watchMode: "deep",
          onChange: function(obj) {
            var d, key, value;
            for (key in result.length = 0, obj) value = obj[key], (d = {})[keyName] = key, d[valueName] = value, 
            result.push(d);
            return env.setValue(result);
          }
        };
      }
    }, alight.filters.storeTo = {
      init: function(scope, key, env) {
        return {
          onChange: function(value) {
            return env.changeDetector.setValue(key, value), env.setValue(value);
          }
        };
      }
    }, alight.text["="] = function(callback, expression, scope, env) {
      var ce;
      if ((ce = alight.utils.compile.expression(expression)).filters) throw "Conflict: bindonce and filters, use one-time binding";
      env.finally(ce.fn(env.changeDetector.locals));
    }, alight.text["::"] = function(callback, expression, scope, env) {
      env.changeDetector.watch(expression, function(value) {
        return env.finally(value);
      }, {
        oneTime: true
      });
    }, function() {
      var f$ = alight.f$;
      function toCamelCase(name) {
        return name.replace(/(-\w)/g, function(m) {
          return m.substring(1).toUpperCase();
        });
      }
      function makeWatch(_a) {
        var fn, listener = _a.listener, childCD = _a.childCD, name = _a.name, parentName = _a.parentName, parentCD = _a.parentCD, watchOption = {};
        if (name = toCamelCase(name), listener && true !== listener) if (f$.isFunction(listener)) fn = listener; else {
          if (fn = listener.onChange, "copy" === listener || "copy" === listener.watchMode) return void (fn ? fn(parentName) : childCD.scope[name] = parentName);
          "array" !== listener && "array" !== listener.watchMode || (watchOption.isArray = true), 
          "deep" !== listener && "deep" !== listener.watchMode || (watchOption.deep = true);
        }
        fn || (fn = function(value) {
          childCD.scope[name] = value, childCD.scan();
        }), parentCD.watch(parentName, fn, watchOption);
      }
      alight.component = function(attrName, constructor) {
        var ns, name, parts = attrName.match(/^(\w+)[\-](.+)$/);
        parts ? (ns = parts[1], name = parts[2]) : (ns = "$global", name = attrName), name = toCamelCase(name), 
        alight.d[ns] || (alight.d[ns] = {}), alight.d[ns][name] = {
          restrict: "E",
          stopBinding: true,
          priority: alight.priority.$component,
          init: function(_parentScope, element, _value, parentEnv) {
            var scope = {
              $sendEvent: function(eventName, value) {
                var event = new CustomEvent(eventName);
                event.value = value, event.component = true, element.dispatchEvent(event);
              }
            }, parentCD = parentEnv.changeDetector.new(), childCD = alight.ChangeDetector(scope), env = new Env({
              element: element,
              attributes: parentEnv.attributes,
              changeDetector: childCD,
              parentChangeDetector: parentCD
            });
            try {
              var option = constructor.call(childCD, scope, element, env) || {};
            } catch (e) {
              return void alight.exceptionHandler(e, "Error in component <" + attrName + ">: ", {
                element: element,
                scope: scope,
                cd: childCD
              });
            }
            option.onStart && childCD.watch("$finishBinding", function() {
              option.onStart(), childCD.scan();
            });
            var parentDestroyed = false;
            parentCD.watch("$destroy", function() {
              parentDestroyed = true, childCD.destroy();
            }), childCD.watch("$destroy", function() {
              option.onDestroy && option.onDestroy(), parentDestroyed || parentCD.destroy();
            });
            for (var _i = 0, _a = element.attributes; _i < _a.length; _i++) {
              if ("#" === (attr = _a[_i]).name[0]) {
                var name_1 = attr.name.slice(1);
                if (name_1) {
                  option.api ? parentCD.setValue(name_1, option.api) : parentCD.setValue(name_1, scope);
                  break;
                }
              }
            }
            function watchProp(key, listener) {
              var name = ":" + key, value = env.takeAttr(name);
              if (!value) {
                if (!(value = env.takeAttr(key))) return;
                listener = "copy";
              }
              makeWatch({
                childCD: childCD,
                listener: listener,
                name: key,
                parentName: value,
                parentCD: parentCD
              });
            }
            if (option.props) if (Array.isArray(option.props)) for (var _b = 0, _c = option.props; _b < _c.length; _b++) {
              watchProp(key = _c[_b], true);
            } else for (var key in option.props) watchProp(key, option.props[key]); else for (var _d = 0, _e = element.attributes; _d < _e.length; _d++) {
              var attr, propName = (attr = _e[_d]).name, propValue = attr.value;
              if (propValue) {
                var parts_1 = propName.match(/^\:(.*)$/);
                parts_1 && makeWatch({
                  childCD: childCD,
                  name: parts_1[1],
                  parentName: propValue,
                  parentCD: parentCD
                });
              }
            }
            var scanned = false;
            if (parentCD.watch("$onScanOnce", function() {
              return scanned = true;
            }), option.template && (element.innerHTML = option.template), option.templateId) {
              var templateElement = document.getElementById(option.templateId);
              if (!templateElement) throw "No template " + option.templateId;
              element.innerHTML = templateElement.innerHTML;
            }
            function binding(async) {
              scanned || parentCD.digest(), alight.bind(childCD, element, {
                skip: true
              });
            }
            option.templateUrl ? f$.ajax({
              url: option.templateUrl,
              cache: true,
              success: function(template) {
                element.innerHTML = template, binding(true);
              },
              error: function() {
                console.error("Template is not loaded", option.templateUrl);
              }
            }) : binding();
          }
        };
      };
    }(), alight;
  }
  var alight = buildAlight();
  alight.makeInstance = buildAlight, "function" == typeof alightInitCallback ? alightInitCallback(alight) : "object" == typeof module && "object" == typeof module.exports ? module.exports = alight : (alight.option.globalController = true, 
  window.alight = alight, alight.f$.ready(alight.bootstrap));
}();