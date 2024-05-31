;(function($) {
    'use strict';

    const NOTIFY = function() {
        const _private = new WeakMap();

        function Notify() {
            _private.set(this, {
                $container: null,
                id: 0
            });

            this._init();
        }
        Notify.prototype = {
            //=============================================
            // Properties & methods (shared for all instances)
            //=============================================
            //=============================================
            // Private Methods
            //=============================================
            _init: function() {
                this._buildDOM();
            },

            _buildDOM: function() {
                const scope = _private.get(this);

                scope.$container = $('<div>').addClass('mcmd-notify-container');
                $('body').append(scope.$container);
            },

            _animationEvent: function() {
                const el = document.createElement('fakeelement');
                const animations = {
                    'animation'      : 'animationend',
                    'MSAnimationEnd' : 'msAnimationEnd',
                    'OAnimation'     : 'oAnimationEnd',
                    'MozAnimation'   : 'mozAnimationEnd',
                    'WebkitAnimation': 'webkitAnimationEnd'
                }
                for (let i in animations){
                    if (el.style[i] !== undefined){
                        return animations[i];
                    }
                }
                return null;
            },

            _getNotify: function(id) {
                const scope = _private.get(this);
                const $item = scope.$container.find(`.mcmd-notify[data-id='${id}']`);
                return $item.length ? $item : null;
            },

            _showNotify: function($notify, id, timeout) {
                setTimeout(this.close.bind(this, id), timeout ? timeout : 4000);
            },

            _removeNotify: function($notify) {
                $notify.remove();
            },
            //=============================================
            // Public Methods
            //=============================================
            show: function(html, className, timeout) {
                const scope = _private.get(this);

                const $notify = $('<div>').addClass('mcmd-notify').addClass(className).attr({'data-id': ++scope.id});
                const $title = $('<div>').addClass('mcmd-title').html(html);
                $notify.append($title);

                scope.$container.append($notify);

                $notify.removeClass('mcmd-fx-show mcmd-fx-hide');
                $notify.addClass('mcmd-fx-show');
                $notify.one(this._animationEvent(), this._showNotify.bind(this, $notify, scope.id, timeout));

                return scope.id;
            },

            close: function(id) {
                const $notify = this._getNotify(id);
                if ($notify) {
                    $notify.removeClass('mcmd-fx-show mcmd-fx-hide');
                    $notify.addClass('mcmd-fx-hide');
                    $notify.one(this._animationEvent(), this._removeNotify.bind(this, $notify));
                }
            }
        }

        return Notify;
    }();

    // Always export us to window global
    window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {};
    window.MEDIACOMMANDER.PLUGINS = window.MEDIACOMMANDER.PLUGINS ? window.MEDIACOMMANDER.PLUGINS : {};
    window.MEDIACOMMANDER.PLUGINS.NOTIFY = function() { return new NOTIFY(); };
}(jQuery));