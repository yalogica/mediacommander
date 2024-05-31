;(function($) {
    'use strict';

    const VERSION = '1.0.0';
    const FIELDS = {
        TITLE: 'title',
        SELECT: 'select',
        COLLAPSE: 'collapse',
        LABEL: 'label',
        COLOR: 'color'
    };
    const DEFAULT_TREE_CONFIG = {
        data: null,
        icon: {
            normal: '<svg viewBox="0 0 24 24">\n' +
                    ' <path d="m1.786 21h20.428c0.434 0 0.786-0.352 0.786-0.786v-14.428c0-0.434-0.352-0.786-0.786-0.786h-11.214l-0.824-1.639c-0.097-0.194-0.352-0.352-0.569-0.352l-7.821-8e-3c-0.434-1e-3 -0.786 0.351-0.786 0.785v16.428c0 0.434 0.352 0.786 0.786 0.786z" fill="currentColor" filter="invert(0.05) brightness(0.8)"/>\n' +
                    ' <path d="M 1.786,21 H 22.214 C 22.648,21 23,20.648 23,20.214 V 7 H 1 V 20.214 C 1,20.648 1.352,21 1.786,21 Z" fill="currentColor" style="filter:invert(0.1)"/>\n' +
                    '</svg>'
        },
        callback: {
            loading: null, // loading(state)
            move: null, // move(items, target, type, callback)
            collapse: null // collapse(item)
        }
    };
    const DEFAULT_TREE_ITEM_CONFIG = {
        id: null,
        color: null, //'#ff0000',
        title: null,
        state: {
            selected: false,
            collapsed: false
        },
        items: []
    };
    const UTILS = {
        extend: function(out) {
            out = out || {};

            for(let i=1; i<arguments.length; i++) {
                let obj = arguments[i];

                if(!obj) continue;

                for(let key in obj) {
                    if(obj.hasOwnProperty(key)) {
                        if(typeof obj[key] === 'object' && obj[key] != null) {
                            if(obj[key] instanceof Array) {
                                out[key] = obj[key].slice(0);
                            } else {
                                out[key] = UTILS.extend(out[key], obj[key]);
                            }
                        } else {
                            out[key] = obj[key];
                        }
                    }
                }
            }

            return out;
        },
        extendTreeCfg: function(options) {
            const cfg = UTILS.extend({}, DEFAULT_TREE_CONFIG, options);
            delete cfg.data;
            return cfg;
        },
        extendTreeItemCfg: function(options) {
            const cfg = UTILS.extend({}, DEFAULT_TREE_ITEM_CONFIG, options);

            if(cfg.id == null) {
                cfg.id = UTILS.uuid();
            }
            cfg.state.selected = false;
            cfg.items = [];

            return cfg;
        },
        isArray: function(value) {
            return Array.isArray(value);
        },
        isString: function(value) {
            return typeof value == 'string';
        },
        uuid: function() {
            return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
                (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
            );
        }
    };

    const TREE = function() {
        const _private = new WeakMap();

        function Tree(container, options) {
            _private.set(this, {
                $container: null,
                dragdrop: {
                    enabled: true,
                    item: null,
                    active: {flag:false, x:0, y:0, offset:10},
                    $ghost: null,
                    $target: null,
                    type: null // 'before', 'inside', 'after'
                },
                select: {
                    list: []
                },
                config: null,
                data: [],
                ready: false
            });

            this._init(container, options);
        }
        Tree.prototype = {
            //=============================================
            // Properties & methods (shared for all instances)
            //=============================================
            get VERSION() {
                return VERSION;
            },

            //=============================================
            // Private Methods
            //=============================================
            _init: function(container, options) {
                const scope = _private.get(this);
                scope.$container = $(container);

                if(scope.$container.length) {
                    scope.config = UTILS.extendTreeCfg(options);
                    scope.ready = false;

                    this._create(options ? options.data : null);
                } else {
                    console.error('Tree: can\'t find the tree container');
                }
            },

            _create: function(data) {
                this._buildDOM();
                this._bind();
                this._ready(data);
            },

            _buildDOM: function() {
                const scope = _private.get(this);

                scope.$container.addClass('mcmd-tree').attr({'tabindex':0});
                scope.dragdrop.$ghost = $('<div>').addClass('mcmd-tree-drag-ghost');

                const $tree_nodes = $('<div>').addClass('mcmd-tree-nodes');
                scope.$container.append($tree_nodes);
            },

            _bind: function() {
                const scope = _private.get(this);

                scope._onToggleClick = this._onToggleClick.bind(this);
                scope._onItemClick = this._onItemClick.bind(this);
                scope._onKeyDown = this._onKeyDown.bind(this);
                scope._onItemMouseDown = this._onItemMouseDown.bind(this);
                scope._onItemMouseEnter = this._onItemMouseEnter.bind(this);
                scope._onItemMouseLeave = this._onItemMouseLeave.bind(this);
                scope._onItemMouseMove = this._onItemMouseMove.bind(this);
                scope._onItemMouseUp = this._onItemMouseUp.bind(this);

                scope.$container.on('keydown', scope._onKeyDown);
                scope.$container.on('click', '.mcmd-tree-toggle', scope._onToggleClick);
                scope.$container.on('click', '.mcmd-tree-item', scope._onItemClick);
                scope.$container.on('mousedown', '.mcmd-tree-item', scope._onItemMouseDown);
            },

            _loading: function(state) {
                const scope = _private.get(this);

                if(scope.config.callback.loading && typeof scope.config.callback.loading == 'function') { // make sure the callback is a function
                    scope.config.callback.loading.call(this, state);
                }
            },

            _ready: function(data) {
                const scope = _private.get(this);

                scope.$container.addClass('mcmd-tree-ready');

                this._loading(true);
                for(let i in data) {
                    this._addItem(data[i]);
                }
                this._loading(false);
            },

            _getData: function() {
                const scope = _private.get(this);
                return scope.data;
            },

            _getFlatData: function() {
                const scope = _private.get(this);
                const data = [];

                function walk(items, parent, level) {
                    for (let i in items) {
                        const item = items[i];
                        data.push({
                            id: item.id,
                            color: item.color,
                            title: item.title,
                            parent: parent,
                            level: level,
                            collapsed: item.state.collapsed
                        });
                        walk(item.items, item.id, level+1);
                    }
                }
                walk(scope.data, null, 0);

                return data.length ? data : null;
            },

            _filter: function(substring) {
                function compare(wildcard, str) {
                    if(wildcard) {
                        let w = wildcard.replace(/[.+^${}()|[\]\\]/g, '\\$&');
                        w = w.includes('*') || w.includes('?') ? w : '*' + w + '*';
                        const regexp = new RegExp(`^${w.replace(/\*/g,'.*').replace(/\?/g,'.')}$`, 'i');
                        return regexp.test(str);
                    }
                    return false;
                }

                const scope = _private.get(this);
                if(substring) {
                    scope.$container.find('.mcmd-tree-node.mcmd-hidden').removeClass('mcmd-hidden');
                    scope.$container.find('.mcmd-tree-title').each((i, el) => {
                        const $title = $(el);
                        const title = $title.text();
                        const $item = $title.parent();
                        const $node = $item.parent();

                        if(compare(substring, title)) {
                            $title.addClass('mcmd-bold');
                            $node.parents('.mcmd-tree-node').removeClass('mcmd-hidden');
                        } else {
                            $title.removeClass('mcmd-bold');
                            $node.addClass('mcmd-hidden');
                        }
                    });
                } else {
                    scope.$container.find('.mcmd-tree-node.mcmd-hidden').removeClass('mcmd-hidden');
                    scope.$container.find('.mcmd-tree-title.mcmd-bold').removeClass('mcmd-bold')
                }
            },

            _addItemElement: function(item, parentItem) {
                const scope = _private.get(this);
                let $nodes = null;

                if(parentItem) {
                    const $parentItem = scope.$container.find(`[data-id='${parentItem.id}']`);

                    if($parentItem.length) {
                        $nodes = $($parentItem.parent().find('.mcmd-tree-nodes').get(0));
                        if (!$nodes.length) {
                            $nodes = $('<div>').addClass('mcmd-tree-nodes');

                            $parentItem.addClass('mcmd-tree-has-children');
                            $parentItem.parent().append($nodes);
                        }
                    }
                } else {
                    $nodes = $(scope.$container.find('.mcmd-tree-nodes').get(0));
                    scope.$container.addClass('mcmd-tree-has-children');
                }

                if($nodes) {
                    const $node = $('<div>').addClass('mcmd-tree-node');
                    const $item = $('<div>').addClass('mcmd-tree-item').attr({'data-id': item.id});
                    const $toggle = $('<div>').addClass('mcmd-tree-toggle');
                    const $icon = $('<div>').addClass('mcmd-tree-icon').append(scope.config.icon.normal);
                    const $title = $('<div>').addClass('mcmd-tree-title');
                    const $label = $('<div>').addClass('mcmd-tree-label');

                    $nodes.append($node.append($item.append($toggle, $icon, $title, $label)));

                    this._updateItemElement(item, [FIELDS.TITLE, FIELDS.SELECT, FIELDS.COLLAPSE, FIELDS.LABEL, FIELDS.COLOR]);
                    item.state.selected && scope.select.list.push(item);
                }
            },

            _removeItemElement: function(item, parent) {
                const scope = _private.get(this);
                const $item = scope.$container.find(`[data-id='${item.id}']`);

                $item.parent().remove();
                item.state.selected && scope.select.list.splice(scope.select.list.indexOf(item),1);

                if(parent && parent.items.length === 0) {
                    const $parentItem = scope.$container.find(`[data-id='${parent.id}']`);
                    const $nodes = $($parentItem.parent().find('.mcmd-tree-nodes').get(0));

                    $parentItem.removeClass('mcmd-tree-has-children');
                    $nodes.remove();
                }
            },

            _updateItemElement: function(item, fields) {
                const scope = _private.get(this);
                const $item = item ? scope.$container.find(`[data-id='${item.id}']`) : null;

                if(!$item.length) {
                    return;
                }

                if(UTILS.isString(fields)) {
                    fields = [fields];
                }

                for(let i in fields) {
                    switch(fields[i]) {
                        case FIELDS.TITLE: $item.find('.mcmd-tree-title').text(item.title); break;
                        case FIELDS.SELECT: {
                            $item.toggleClass('mcmd-tree-selected', item.state.selected);
                        } break;
                        case FIELDS.COLLAPSE: $item.toggleClass('mcmd-tree-collapsed', item.state.collapsed); break;
                        case FIELDS.LABEL: $item.find('.mcmd-tree-label').toggleClass('mcmd-tree-active', !!item.count).text(item.count); break;
                        case FIELDS.COLOR: $item.find('.mcmd-tree-icon').css({'color': item.color ? item.color : ''}); break;
                    }
                }
            },

            _addItem: function(item, parentItemId) {
                const scope = _private.get(this);
                const self = this;

                function addItem(item, parentItemId) {
                    if(item && item.id && self._getItem(item.id)) {
                        return null;
                    }

                    const newItem = UTILS.extendTreeItemCfg(item);
                    const parentItem = self._getItem(parentItemId);
                    parentItem ? parentItem.items.push(newItem) : scope.data.push(newItem);

                    self._addItemElement(newItem, parentItem);

                    if(item) {
                        for(const i in item.items) {
                            addItem(item.items[i], newItem.id);
                        }
                    }

                    return newItem;
                }

                return addItem(item, parentItemId);
            },

            _getItem: function(itemId) {
                const scope = _private.get(this);

                function find(items, itemId) {
                    let item = null;
                    if(items) {
                        for(let i=0; i < items.length; i++) {
                            item = items[i];
                            if (item.id === itemId) break;
                            item = find(item.items, itemId);
                            if (item) break;
                        }
                    }
                    return item;
                }

                return find(scope.data, itemId);
            },

            _getParentItem: function(itemId) {
                const scope = _private.get(this);

                function find(items, itemId, parent) {
                    let item = null;
                    if(items) {
                        for(let i=0; i < items.length; i++) {
                            item = items[i];
                            if (item.id === itemId) {
                                item = parent;
                                break;
                            }
                            item = find(item.items, itemId, item);
                            if (item) break;
                        }
                    }
                    return item;
                }

                return find(scope.data, itemId, null);
            },

            _getPrevItem: function(itemId, collapsed) {
                const scope = _private.get(this);
                const parents = [];

                function find(items, itemId) {
                    let item = null;
                    if(items) {
                        for(let i=0; i < items.length; i++) {
                            item = items[i];

                            if (item.id === itemId) {
                                if (i > 0) {
                                    item = items[i - 1];
                                    while ((!item.state.collapsed || collapsed) && item.items.length) {
                                        item = item.items[item.items.length - 1];
                                    }
                                } else {
                                    item = null;
                                    if (parents.length) {
                                        const parent = parents[parents.length - 1];
                                        item = parent.items[parent.index];
                                    }
                                }
                                break;
                            }

                            parents.push({index: i, items: items});
                            item = find(item.items, itemId, item);
                            parents.pop();

                            if (item) break;
                        }
                    }
                    return item;
                }

                return find(scope.data, itemId);
            },

            _getNextItem: function(itemId, collapsed) {
                const scope = _private.get(this);
                const parents = [];

                function find(items, itemId) {
                    let item = null;
                    if(items) {
                        for(let i = 0; i < items.length; i++) {
                            item = items[i];

                            if(item.id === itemId) {
                                if ((!item.state.collapsed || collapsed) && item.items.length) {
                                    item = item.items.length ? item.items[0] : null;
                                } else {
                                    if (i < items.length - 1) {
                                        item = items[i + 1];
                                    } else {
                                        item = null;

                                        i = parents.length;
                                        while (i--) {
                                            const parent = parents[i];
                                            if (parent.index < parent.items.length - 1) {
                                                item = parent.items[parent.index + 1];
                                                break;
                                            }
                                        }
                                    }
                                }
                                break;
                            }

                            parents.push({index: i, items: items});
                            item = find(item.items, itemId, item);
                            parents.pop();

                            if(item) break;
                        }
                    }
                    return item;
                }

                return find(scope.data, itemId);
            },

            _getSelectedItems: function() {
                const scope = _private.get(this);
                return scope.select.list;
            },

            _moveItem: function(itemId, targetId, type) {
                const scope = _private.get(this);
                const item = this._getItem(itemId);
                const target = this._getItem(targetId);

                if(item == null || target == null) {
                    return;
                }

                this._loading(true);

                const $item = scope.$container.find(`[data-id='${item.id}']`);
                const $itemNode = $item.parent();
                const $target = scope.$container.find(`[data-id='${target.id}']`);
                const $targetNode = $target.parent();
                const parentItem = item ? this._getParentItem(item.id) : null;
                const parentTarget = target ? this._getParentItem(target.id) : null;
                const items = parentItem ? parentItem.items : scope.data;
                const targetItems = parentTarget ? parentTarget.items : scope.data;

                for(let i=0; i < items.length; i++) {
                    if(items[i].id === itemId) {
                        items.splice(i, 1);
                        break;
                    }
                }
                $itemNode.detach();

                if(items.length === 0 && parentItem) {
                    const $parentItem = scope.$container.find(`[data-id='${parentItem.id}']`);
                    const $nodes = $($parentItem.parent().find('.mcmd-tree-nodes').get(0));

                    $parentItem.removeClass('mcmd-tree-has-children');
                    $nodes.remove();
                }

                switch(type) {
                    case 'inside': {
                        for(let i=0; i < targetItems.length; i++) {
                            if(targetItems[i].id === targetId) {
                                targetItems[i].items.push(item);

                                let $nodes = $($target.parent().find('.mcmd-tree-nodes').get(0));
                                if(!$nodes.length) {
                                    $nodes = $('<div>').addClass('mcmd-tree-nodes');

                                    $target.addClass('mcmd-tree-has-children');
                                    $target.parent().append($nodes);
                                }
                                $nodes.append($itemNode);
                                break;
                            }
                        }
                    } break;
                    case 'before': {
                        for(let i=0; i < targetItems.length; i++) {
                            if (targetItems[i].id === targetId) {
                                targetItems.splice(i, 0, item);
                                break;
                            }
                        }
                        $targetNode.before($itemNode);
                    }
                        break;
                    case 'after': {
                        for(let i=0; i < targetItems.length; i++) {
                            if (targetItems[i].id === targetId) {
                                targetItems.splice(i+1, 0, item);
                                break;
                            }
                        }
                        $targetNode.after($itemNode);
                    }
                        break;
                }

                this._loading(false);
            },

            _removeItem: function(itemId) {
                const scope = _private.get(this);
                const self = this;

                function removeItem(itemId, items) {
                    let item = null;
                    if (items) {
                        for (let i = 0; i < items.length; i++) {
                            item = items[i];
                            if (items[i].id === itemId) {
                                let count = item.items.length;
                                while (count--) {
                                    removeItem(item.items[count].id, item.items);
                                }

                                const parent = self._getParentItem(item.id);
                                items.splice(i, 1);
                                self._removeItemElement(item, parent);

                                break;
                            }
                            item = removeItem(itemId, items[i].items);
                            if (item) break;
                        }
                    }
                    return item;
                }

                return removeItem(itemId, scope.data);
            },

            _collapseItem: function(itemId, state) {
                const scope = _private.get(this);
                const item = this._getItem(itemId);

                if(item) {
                    let flag = false;

                    if(state === undefined) {
                        flag = true;
                        item.state.collapsed = !item.state.collapsed;
                    } else if (item.state.collapsed !== state) {
                        flag = true;
                        item.state.collapsed = state;
                    }

                    if(flag) {
                        this._updateItemElement(item, FIELDS.COLLAPSE);

                        if(scope.config.callback.collapse && typeof scope.config.callback.collapse == 'function') { // make sure the callback is a function
                            scope.config.callback.collapse.call(this, item);
                        }
                    }
                }
            },

            _selectItem: function(itemId, state) {
                const scope = _private.get(this);
                const item = this._getItem(itemId);

                if (item) {
                    let flag = false;

                    if (state === undefined) {
                        flag = true;
                        item.state.selected = !item.state.selected;
                    } else if (item.state.selected !== state) {
                        flag = true;
                        item.state.selected = state;
                    }

                    if (flag) {
                        this._updateItemElement(item, FIELDS.SELECT);

                        if (item.state.selected && scope.select.list.indexOf(item) === -1) {
                            scope.select.list.push(item);
                        } else {
                            scope.select.list.splice(scope.select.list.indexOf(item), 1);
                        }
                    }
                }
            },

            _selectItemRange: function(startItemId, endItemId) {
                const scope = _private.get(this);
                const list = [];

                function selectRange(startItemId, endItemId, items, list) {
                    if (items) {
                        for (let i = 0; i < items.length; i++) {
                            let item = items[i];
                            if (item.id === startItemId) {
                                list.push(item);
                                if (list.length > 1) return true;
                            } else if (item.id === endItemId) {
                                list.push(item);
                                if (list.length > 1) return true;
                            } else if (list.length) {
                                list.push(item);
                            }
                            if (item.items.length && !item.state.collapsed) {
                                if (selectRange(startItemId, endItemId, item.items, list)) {
                                    return true;
                                }
                            }
                        }
                    }
                    return false;
                }

                if (startItemId && endItemId && startItemId !== endItemId) {
                    selectRange(startItemId, endItemId, scope.data, list);
                    for(let i=0; i < list.length; i++) {
                        !list[i].state.selected && this._selectItem(list[i].id, true, true);
                    }
                } else if (endItemId) {
                    this._selectItem(endItemId, true);
                }
            },

            _clearSelection: function() {
                const scope = _private.get(this);

                for(let i=0; i < scope.select.list.length; i++) {
                    let item = scope.select.list[i];

                    item.state.selected = false;
                    this._updateItemElement(item, FIELDS.SELECT);
                }
                scope.select.list = [];
            },

            _getDragDropType: function(element, pageY) {
                const rc = element.getBoundingClientRect();
                const offset = pageY - window.scrollY - rc.top;

                if(offset < rc.height / 4) return 'before';
                if(offset > rc.height * 3 / 4) return 'after';

                return 'inside';
            },

            _onKeyDown: function(e) {
                const scope = _private.get(this);
                const item = scope.select.list[scope.select.list.length-1];

                if(document.activeElement !== scope.$container.get(0) || !item) {
                    return;
                }

                switch(e.keyCode) {
                    case 38: { // up
                        const prevItem = this._getPrevItem(item.id, false);
                        if(prevItem) {
                            this._clearSelection();
                            this._selectItem(prevItem.id, true);
                        }
                    } break;
                    case 40: { // down
                        const nextItem = this._getNextItem(item.id, false);
                        if(nextItem) {
                            this._clearSelection();
                            this._selectItem(nextItem.id, true);
                        }
                    } break;
                    case 37: this._collapseItem(item.id, true); break;
                    case 39: this._collapseItem(item.id, false); break;
                }

                e.preventDefault();
            },

            _onToggleClick: function(e) {
                e.preventDefault();
                e.stopImmediatePropagation();

                const $item = $(e.currentTarget).parent();
                const itemId = $item ? $item.attr('data-id') : null;

                this._collapseItem(itemId);
            },

            _onItemClick: function(e) {
                const $item = $(e.currentTarget);
                const itemId = $item ? $item.attr('data-id') : null;

                if (!e.shiftKey && !e.ctrlKey) {
                    this._clearSelection();
                } else if(e.ctrlKey) {
                    this._selectItem(itemId);
                } else if(e.shiftKey) {
                    const scope = _private.get(this);
                    const startItemId = scope.select.list.length ? scope.select.list[scope.select.list.length-1].id : null;
                    const endItemId = itemId;

                    this._selectItemRange(startItemId, endItemId);
                }
            },

            _onItemMouseDown: function(e) {
                if(e.which === 1 && !e.shiftKey && !e.ctrlKey && !$(e.target).hasClass('mcmd-tree-toggle')) {
                    //e.preventDefault();
                    e.stopImmediatePropagation();

                    const scope = _private.get(this);

                    const $item = $(e.currentTarget);
                    const itemId = $item.attr('data-id');
                    const item = this._getItem(itemId);

                    scope.dragdrop.item = item;

                    const $icon = $('<div>').addClass('mcmd-tree-icon');
                    const $title = $('<div>').addClass('mcmd-tree-title').text(item.title);
                    const $label = $('<div>').addClass('mcmd-tree-label').text(scope.select.list.length);

                    scope.dragdrop.active.flag = false;
                    scope.dragdrop.active.x = e.pageX;
                    scope.dragdrop.active.y = e.pageY;

                    scope.dragdrop.$ghost.empty().append($icon, $title, $label).appendTo('body');
                    scope.$container.addClass('mcmd-tree-dragging');

                    scope.$container.on('mouseenter', '.mcmd-tree-item', scope._onItemMouseEnter);
                    scope.$container.on('mouseleave', '.mcmd-tree-item', scope._onItemMouseLeave);

                    $(window).on('mousemove', scope._onItemMouseMove);
                    $(window).on('mouseup', scope._onItemMouseUp);
                }
            },

            _onItemMouseEnter: function(e) {
                const scope = _private.get(this);
                scope.dragdrop.$target = $(e.currentTarget);
                scope.dragdrop.$target && scope.dragdrop.$target.removeClass('mcmd-tree-before mcmd-tree-inside mcmd-tree-after');
            },

            _onItemMouseLeave: function() {
                const scope = _private.get(this);
                scope.dragdrop.$target && scope.dragdrop.$target.removeClass('mcmd-tree-before mcmd-tree-inside mcmd-tree-after');
                scope.dragdrop.$target = null;
            },

            _onItemMouseMove: function(e) {
                const scope = _private.get(this);

                if(scope.dragdrop.active.flag) {
                    scope.dragdrop.$ghost.addClass('mcmd-tree-active').css({
                        top: e.clientY + 5 + 'px',
                        left: e.clientX + 5 + 'px'
                    });

                    if (!scope.dragdrop.$target) {
                        return;
                    }

                    const dragdroptype = this._getDragDropType(scope.dragdrop.$target.get(0), e.pageY); // before, inside, after
                    if (scope.dragdrop.type !== dragdroptype) {
                        scope.dragdrop.$target.removeClass('mcmd-tree-before mcmd-tree-inside mcmd-tree-after').addClass('mcmd-tree-' + dragdroptype);
                        scope.dragdrop.type = dragdroptype;
                    }
                } else {
                    scope.dragdrop.active.flag = Math.abs(scope.dragdrop.active.x - e.pageX) > scope.dragdrop.active.offset || Math.abs(scope.dragdrop.active.y - e.pageY) > scope.dragdrop.active.offset;
                    if(scope.dragdrop.active.flag) {
                        const item = scope.dragdrop.item;
                        if(item && !item.state.selected) {
                            this._clearSelection();
                            this._selectItem(item.id);
                        }
                        scope.dragdrop.$ghost.find('.mcmd-tree-label').text(scope.select.list.length);
                    }
                }
            },

            _onItemMouseUp: function() {
                const scope = _private.get(this);

                scope.dragdrop.$ghost.empty().css({top: null, left: null}).removeClass('mcmd-tree-active').detach();
                scope.$container.removeClass('mcmd-tree-dragging');

                if(scope.dragdrop.active.flag && scope.dragdrop.$target) {
                    const list = [];
                    const targetId = scope.dragdrop.$target ? scope.dragdrop.$target.attr('data-id') : null;
                    const type = scope.dragdrop.type;

                    scope.dragdrop.$ghost.detach().empty();
                    scope.dragdrop.$target && scope.dragdrop.$target.removeClass('mcmd-tree-before mcmd-tree-inside mcmd-tree-after');
                    scope.dragdrop.$target = null;
                    scope.dragdrop.type = null;
                    scope.dragdrop.item = null;

                    scope.$container.removeClass('mcmd-tree-dragging');

                    function fillDropList(items, parents, list) {
                        if (items) {
                            for (let i = 0; i < items.length; i++) {
                                let item = items[i];

                                if (item.state.selected) {
                                    let flag = true;

                                    for (let j = 0; j < parents.length; j++) {
                                        for (let k = 0; k < list.length; k++) {
                                            if (list[k].id === parents[j].id) {
                                                flag = false;
                                                break;
                                            }
                                        }
                                    }

                                    if (flag) {
                                        list.push(item);
                                    }
                                }

                                if (item.items.length) {
                                    parents.push(item);
                                    fillDropList(item.items, parents, list);
                                    parents.pop();
                                }
                            }
                        }
                    }
                    fillDropList(scope.data, [], list);

                    function checkTargetId(list, targetId) {
                        for(let i=0; i < list.length; i++) {
                            if(list[i].id === targetId) {
                                return false;
                            }
                            if(list[i].items.length) {
                                if(!checkTargetId(list[i].items, targetId)) {
                                    return false;
                                }
                            }
                        }
                        return true;
                    }
                    if(checkTargetId(list, targetId)) {
                        const movedItems = [];
                        for(let i=0; i < list.length; i++) {
                            movedItems.push(list[i].id);
                        }

                        function moveitems(items, target, type) {
                            if(type === 'after') {
                                let i = items.length;
                                while (i--) {
                                    this._moveItem(items[i], target, type);
                                }
                            } else {
                                for (let i = 0; i < items.length; i++) {
                                    this._moveItem(items[i], target, type);
                                }
                            }
                        }

                        if(scope.config.callback.move && typeof scope.config.callback.move == 'function') { // make sure the callback is a function
                            const parentItem = type === 'inside' ? this._getItem(targetId) : this._getParentItem(targetId);
                            const parentId = parentItem ? parentItem.id : null;
                            const parentItems = parentItem ? parentItem.items : scope.data;
                            const targetItems = parentItems.map(x => x.id);

                            scope.config.callback.move.call(this, movedItems, parentId, targetId, targetItems, type, moveitems);
                        } else {
                            moveitems.call(this, movedItems, targetId, type);
                        }
                    }
                }

                scope.$container.off('mouseenter', '.mcmd-tree-item', scope._onItemMouseEnter);
                scope.$container.off('mouseleave', '.mcmd-tree-item', scope._onItemMouseLeave);

                $(window).off('mousemove', scope._onItemMouseMove);
                $(window).off('mouseup', scope._onItemMouseUp);
            },

            //=============================================
            // Public Methods
            //=============================================
            getIcon: function() {
                const scope = _private.get(this);
                return scope.config.icon.normal;
            },

            getData: function() {
                return this._getData();
            },

            hasItems: function() {
                const scope = _private.get(this);
                return scope.data && scope.data.length > 0;
            },

            getFlatData: function() {
                return this._getFlatData();
            },

            getItem: function(itemId) {
                return this._getItem(itemId);
            },

            getParentItem: function(itemId) {
                return this._getParentItem(itemId);
            },

            selectItem: function(itemId, state) {
                this._selectItem(itemId, state);
            },

            getSelectedItems: function() {
                return this._getSelectedItems();
            },

            clearSelection: function() {
                this._clearSelection();
            },

            filter: function(filter) {
                this._filter(filter);
            },

            addItem: function(item, parentItemId) {
                return this._addItem(item, parentItemId);
            },

            collapseItem: function(itemId, state) {
                return this._collapseItem(itemId, state);
            },

            removeItem: function(itemId) {
                this._removeItem(itemId);
            },

            updateItemTitle: function(itemId, title) {
                const item = this._getItem(itemId);
                if(item) {
                    item.title = title;
                    this._updateItemElement(item, FIELDS.TITLE);
                }
            },

            updateItemColor: function(itemId, color) {
                const item = this._getItem(itemId);
                if(item) {
                    item.color = color;
                    this._updateItemElement(item, FIELDS.COLOR);
                }
            },

            updateItemLabel: function(itemId, count) {
                const item = this._getItem(itemId);
                if(item) {
                    item.count = parseInt(count, 10);
                    this._updateItemElement(item, FIELDS.LABEL);
                }
            },

            toggleDragDrop: function(state) {
                const scope = _private.get(this);

                if(state) {
                    !scope.dragdrop.enabled && scope.$container.on('mousedown', '.mcmd-tree-item', scope._onItemMouseDown);
                    scope.dragdrop.enabled = true;
                } else {
                    scope.dragdrop.enabled && scope.$container.off('mousedown', '.mcmd-tree-item', scope._onItemMouseDown);
                    scope.dragdrop.enabled = false;
                }
            }
        }

        return Tree;
    }();

    // Always export us to window global
    window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {};
    window.MEDIACOMMANDER.PLUGINS = window.MEDIACOMMANDER.PLUGINS ? window.MEDIACOMMANDER.PLUGINS : {};
    window.MEDIACOMMANDER.PLUGINS.TREE = function(container, options) { return new TREE(container, options); };
}(jQuery));