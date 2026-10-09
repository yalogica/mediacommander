!function($) {
  "use strict";
  const NOTIFY = function() {
    const _private = new WeakMap;
    function Notify() {
      _private.set(this, {
        $container: null,
        id: 0
      }), this._init();
    }
    return Notify.prototype = {
      _init: function() {
        this._buildDOM();
      },
      _buildDOM: function() {
        const scope = _private.get(this);
        scope.$container = $("<div>").addClass("mcmd-notify-container"), $("body").append(scope.$container);
      },
      _animationEvent: function() {
        const el = document.createElement("fakeelement"), animations = {
          animation: "animationend",
          MSAnimationEnd: "msAnimationEnd",
          OAnimation: "oAnimationEnd",
          MozAnimation: "mozAnimationEnd",
          WebkitAnimation: "webkitAnimationEnd"
        };
        for (let i in animations) if (void 0 !== el.style[i]) return animations[i];
        return null;
      },
      _getNotify: function(id) {
        const $item = _private.get(this).$container.find(`.mcmd-notify[data-id='${id}']`);
        return $item.length ? $item : null;
      },
      _showNotify: function($notify, id, timeout) {
        setTimeout(this.close.bind(this, id), timeout || 4e3);
      },
      _removeNotify: function($notify) {
        $notify.remove();
      },
      show: function(html, className, timeout) {
        const scope = _private.get(this), $notify = $("<div>").addClass("mcmd-notify").addClass(className).attr({
          "data-id": ++scope.id
        }), $title = $("<div>").addClass("mcmd-title").html(html);
        return $notify.append($title), scope.$container.append($notify), $notify.removeClass("mcmd-fx-show mcmd-fx-hide"), 
        $notify.addClass("mcmd-fx-show"), $notify.one(this._animationEvent(), this._showNotify.bind(this, $notify, scope.id, timeout)), 
        scope.id;
      },
      close: function(id) {
        const $notify = this._getNotify(id);
        $notify && ($notify.removeClass("mcmd-fx-show mcmd-fx-hide"), $notify.addClass("mcmd-fx-hide"), 
        $notify.one(this._animationEvent(), this._removeNotify.bind(this, $notify)));
      }
    }, Notify;
  }();
  window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {}, window.MEDIACOMMANDER.PLUGINS = window.MEDIACOMMANDER.PLUGINS ? window.MEDIACOMMANDER.PLUGINS : {}, 
  window.MEDIACOMMANDER.PLUGINS.NOTIFY = function() {
    return new NOTIFY;
  };
}(jQuery);