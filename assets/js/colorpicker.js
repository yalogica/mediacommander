;(function($) {
    'use strict';

    const COLORPICKER = function() {
        const _private = new WeakMap();

        function ColorPicker(color, $parent, callback) {
            _private.set(this, {
                type: $parent ? 'embed' : 'popup',
                $parent: $parent ? $parent : $('body'),
                $container: null,
                $element: null,
                selectedColor: color ? color : null,
                colors: [],
                callback: callback ? callback : null,
                offset: { top: 0, left: 0}
            });

            this._init();
        }
        ColorPicker.prototype = {
            //=============================================
            // Properties & methods (shared for all instances)
            //=============================================
            //=============================================
            // Private Methods
            //=============================================
            _init: function () {
                const scope = _private.get(this);

                this._buildColors();
                this._buildDOM();
                this._bind();
                this._selectColor(scope.selectedColor);
            },

            _buildDOM: function () {
                const scope = _private.get(this);

                const template = "<div>" +
                    '<div id="mcmd-colorpicker-saved-colors" class="mcmd-colorpicker-colors">' + this._renderSavedColors() + '</div>' +
                    '<div class="mcmd-colorpicker-line"></div>' +
                    '<div class="mcmd-colorpicker-colors">' + this._renderMainColors() + '</div>' +
                    '<div class="mcmd-colorpicker-line"></div>' +
                    '<div class="mcmd-colorpicker-row">' +
                        '<div class="mcmd-colorpicker-input-text-wrap">' +
                            '<input class="mcmd-colorpicker-input-text" type="text" maxlength="7">' +
                            '<i class="mcmd-colorpicker-clear">&times;</i>' +
                        '</div>' +
                        '<div class="mcmd-colorpicker-input-color-wrap">' +
                            '<input class="mcmd-colorpicker-input-color" type="color" value="#ffffff">' +
                            '<div class="mcmd-colorpicker-preview-wrap">' +
                                '<div class="mcmd-colorpicker-preview"></div>' +
                            '</div>' +
                        '</div>' +
                        '<div class="mcmd-colorpicker-button mcmd-colorpicker-button-submit">OK</div>' +
                    '</div>' +
                    '</div>';
                scope.$container = $(template).toggleClass('mcmd-colorpicker-embed', scope.type == 'embed').toggleClass('mcmd-colorpicker-popup', scope.type == 'popup');
                scope.$parent.append(scope.$container);
            },

            _bind: function() {
                const scope = _private.get(this);

                scope.$container.on('click', '.mcmd-colorpicker-colors .mcmd-colorpicker-color', this._clickColor.bind(this));
                scope.$container.on('dblclick', '.mcmd-colorpicker-colors .mcmd-colorpicker-color', this._dblclickColor.bind(this));
                scope.$container.on('click', '.mcmd-colorpicker-clear', this._clearColor.bind(this));
                scope.$container.on('click', '.mcmd-colorpicker-button-submit', this._submit.bind(this));

                scope.$container.find('.mcmd-colorpicker-input-text').on('input', this._setColorFromInput.bind(this));
                scope.$container.find('.mcmd-colorpicker-input-color').on('input', this._setColorFromPreview.bind(this));

                $(window).on('resize', this._resize.bind(this));
                document.addEventListener('mousedown', this._mousedown.bind(this), {capture: true});
            },

            _renderMainColors: function() {
                const scope = _private.get(this);

                let html = '';
                for(let i=0;i<3;i++) {
                    html += '<div class="mcmd-colorpicker-row">';
                    for(const color of scope.colors[i]) {
                        html += '<div class="mcmd-colorpicker-color" data-color="' + color + '" style="background-color:' + color + '"></div>';
                    }
                    html += '</div>';
                }

                return html;
            },

            _renderSavedColors: function() {
                const scope = _private.get(this);

                const saved = Cookies.get('mcmd-colorpicker-colors') ? JSON.parse(Cookies.get('mcmd-colorpicker-colors')) : [null, null, null, null, null];

                let html = '';
                html += '<div class="mcmd-colorpicker-row">';
                html += '<div class="mcmd-colorpicker-color mcmd-colorpicker-color-save" title="add to pallete"></div>';
                for(const key in scope.colors[3]) {
                    const color = saved[key] ? saved[key] : scope.colors[3][key];
                    html += '<div class="mcmd-colorpicker-color" data-color="' + color + '" style="background-color:' + color + '"></div>';
                }
                html += '</div>';

                return html;
            },

            _buildColors: function() {
                const scope = _private.get(this);

                scope.colors.push(['#e49086','#f2b78f','#fde7ab','#cddf7b','#8fcaf2','#db96d9']);
                scope.colors.push(['#d35141','#e98746','#fbd25e','#b3cf3c','#46a8e9','#c65bbb']);
                scope.colors.push(['#aa2b22','#c85f19','#fabc0f','#819526','#1981c8','#9d3aa7']);
                scope.colors.push(['#000000','#222222','#444444','#666666','#888888']);
            },

            _show: function(e) {
                const scope = _private.get(this);

                scope.$element = $(e.currentTarget);
                this._place(scope.$element);
                this._selectColor(this.get(scope.$element));
                scope.$container.find("#mcmd-colorpicker-saved-colors").empty().append(this._renderSavedColors());
                scope.$container.addClass('mcmd-active');
            },

            _close: function() {
                const scope = _private.get(this);

                scope.$element = null;
                scope.$container.removeClass('mcmd-active');
            },

            _mousedown: function(e) {
                const scope = _private.get(this);

                if(scope.$element) {
                    if(!(scope.$element.is(e.target) || scope.$container.is(e.target) || scope.$container.find(e.target).length)) {
                        this._close();
                    }
                }
            },

            _place: function($element) {
                const scope = _private.get(this);

                const doc = document.documentElement;
                const left = (window.scrollX || doc.scrollLeft) - (doc.clientLeft || 0);
                const top = (window.scrollY || doc.scrollTop)  - (doc.clientTop || 0);
                const rc = $element.offset();
                const offset = { top: rc.top - top, left: rc.left - left };
                const height = $element.outerHeight(false);

                scope.$container.css({top: offset.top + scope.offset.top + height, left: offset.left + scope.offset.left});
            },

            _resize: function() {
                const scope = _private.get(this);
                if(scope.$element) {
                    this._place(scope.$element);
                }
            },

            _selectColor: function(color) {
                const scope = _private.get(this);

                if(color && color.length != 0) {
                    scope.selectedColor = color;
                    $('.mcmd-colorpicker-input-text', scope.$container).val(color);
                    $('.mcmd-colorpicker-input-color', scope.$container).val(color);
                    $('.mcmd-colorpicker-preview', scope.$container).css({'background': color ? color : ''});
                } else {
                    scope.selectedColor = null;
                    $('.mcmd-colorpicker-input-text', scope.$container).val('');
                    $('.mcmd-colorpicker-input-color', scope.$container).val('#ffffff');
                    $('.mcmd-colorpicker-preview', scope.$container).css({'background': ''});
                }
            },

            _clearColor: function() {
                this._selectColor();
            },

            _saveColor: function() {
                const scope = _private.get(this);

                if(scope.selectedColor) {
                     const colors = Cookies.get('mcmd-colorpicker-colors') ? JSON.parse(Cookies.get('mcmd-colorpicker-colors')) : [null, null, null, null, null, null];
                     if(colors[0] !== scope.selectedColor) {
                         for (let i = colors.length - 1; i > 0; i--) {
                             colors[i] = colors[i - 1];
                         }
                         colors[0] = scope.selectedColor;
                         Cookies.set('mcmd-colorpicker-colors', JSON.stringify(colors));
                     }
                    scope.$container.find('#mcmd-colorpicker-saved-colors').html(this._renderSavedColors());
                }
            },

            _clickColor: function(e) {
                const $color = $(e.currentTarget);
                if($color.hasClass('mcmd-colorpicker-color-save')) {
                    this._saveColor();
                } else {
                    this._selectColor($(e.currentTarget).attr('data-color'));
                }
            },

            _dblclickColor: function(e) {
                const $color = $(e.currentTarget);
                if(!$color.hasClass('mcmd-colorpicker-color-save')) {
                    this._selectColor($(e.currentTarget).attr('data-color'));
                    this._submit();
                }
            },

            _setColorFromInput: function(e) {
                const scope = _private.get(this);

                scope.selectedColor = $('.mcmd-colorpicker-input-text', scope.$container).val();
                if(scope.selectedColor[0] != '#')  {
                    scope.selectedColor = '#' + scope.selectedColor;
                    $('.mcmd-colorpicker-input-text', scope.$container).val(scope.selectedColor);
                }

                if(scope.selectedColor.length > 0) {
                    $('.mcmd-colorpicker-input-color', scope.$container).val(scope.selectedColor);
                    $('.mcmd-colorpicker-preview', scope.$container).css({'background': scope.selectedColor ? scope.selectedColor : ''});
                } else {
                    $('.mcmd-colorpicker-input-color', scope.$container).val('#fff');
                    $('.mcmd-colorpicker-preview', scope.$container).css({'background': ''});
                }
            },

            _setColorFromPreview: function(e) {
                this._selectColor(e.target.value);
            },

            _submit: function() {
                const scope = _private.get(this);

                if(scope.$element) {
                    scope.$element.attr({'data-color': scope.selectedColor}).css({'background': scope.selectedColor ? scope.selectedColor : ''}).trigger('color', scope.selectedColor);
                } else {
                    if(scope.callback && typeof scope.callback == 'function') {
                        scope.callback.call(null, scope.selectedColor);
                    }
                }
                this._close();
            },
            //=============================================
            // Public Methods
            //=============================================
            set: function($element, color, offset) {
                const scope = _private.get(this);

                scope.offset.top = offset && offset.top ? offset.top : 0;
                scope.offset.left = offset && offset.left ? offset.left : 0;

                if (!$element.data('colorpicker')) {
                    $element.on('click', this._show.bind(this));
                }
                $element.data({'colorpicker': true})
                    .attr({'data-color': color ? color : null})
                    .css({'background': color ? color : ''});

            },
            get: function($element) {
                if($element.data('colorpicker')) {
                    const color = $element.attr('data-color');
                    return color ? color.toUpperCase() : null;
                }
                return null;
            }
        }

        return ColorPicker;
    }();

    // Always export us to window global
    window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {};
    window.MEDIACOMMANDER.PLUGINS = window.MEDIACOMMANDER.PLUGINS ? window.MEDIACOMMANDER.PLUGINS : {};
    window.MEDIACOMMANDER.PLUGINS.COLORPICKER = function(color, $container, callback) { return new COLORPICKER(color, $container, callback); };
}(jQuery));