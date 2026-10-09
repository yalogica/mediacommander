!function($) {
  "use strict";
  const FIELDS_TITLE = "title", FIELDS_SELECT = "select", FIELDS_COLLAPSE = "collapse", FIELDS_LABEL = "label", FIELDS_COLOR = "color", DEFAULT_TREE_CONFIG = {
    data: null,
    icon: '<svg viewBox="0 0 24 24"><path d="M 1.786 21 L 22.214 21 C 22.648 21 23 20.648 23 20.214 L 23 5.786 C 23 5.352 22.648 5 22.214 5 L 11 5 L 10.176 3.361 C 10.079 3.167 9.824 3.009 9.607 3.009 L 1.786 3.001 C 1.352 3 1 3.352 1 3.786 L 1 20.214 C 1 20.648 1.352 21 1.786 21 Z " fill="currentColor" style="filter:invert(0.05) brightness(0.6)"/><path d="M 1,7 V 20.159624 C 1,20.624144 1.3511577,21 1.7851562,21 H 22.214844 C 22.648841,21 23,20.624144 23,20.159624 V 7.08571 Z " fill="currentColor" style="filter:invert(0.05)"/><path d="m 7.5,12.5 v 3 h 9 v -3 z" fill="currentColor" style="filter:invert(0.05) brightness(.7)" class="mcmd-tree-icon-minus" /><path d="m 10.5,9.5 v 3 h -3 v 3 h 3 v 3 h 3 v -3 h 3 v -3 h -3 v -3 z" fill="currentColor" style="filter:invert(0.05) brightness(.7)" class="mcmd-tree-icon-plus" /></svg>',
    callback: {
      loading: null,
      move: null,
      collapse: null
    }
  }, DEFAULT_TREE_ITEM_CONFIG = {
    id: null,
    color: null,
    title: null,
    state: {
      selected: false,
      collapsed: false
    },
    items: []
  }, UTILS = {
    extend: function(out) {
      out = out || {};
      for (let i = 1; i < arguments.length; i++) {
        let obj = arguments[i];
        if (obj) for (let key in obj) obj.hasOwnProperty(key) && ("object" == typeof obj[key] && null != obj[key] ? obj[key] instanceof Array ? out[key] = obj[key].slice(0) : out[key] = UTILS.extend(out[key], obj[key]) : out[key] = obj[key]);
      }
      return out;
    },
    extendTreeCfg: function(options) {
      const cfg = UTILS.extend({}, DEFAULT_TREE_CONFIG, options);
      return delete cfg.data, cfg;
    },
    extendTreeItemCfg: function(options) {
      const cfg = UTILS.extend({}, DEFAULT_TREE_ITEM_CONFIG, options);
      return null == cfg.id && (cfg.id = UTILS.uuid()), cfg.state.selected = false, cfg.items = [], 
      cfg;
    },
    isArray: function(value) {
      return Array.isArray(value);
    },
    isString: function(value) {
      return "string" == typeof value;
    },
    uuid: function() {
      return ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16));
    }
  }, TREE = function() {
    const _private = new WeakMap;
    function Tree(container, options) {
      _private.set(this, {
        $container: null,
        dragdrop: {
          enabled: true,
          item: null,
          active: {
            flag: false,
            x: 0,
            y: 0,
            offset: 10
          },
          $ghost: null,
          $target: null,
          type: null
        },
        select: {
          list: []
        },
        config: null,
        data: [],
        ready: false
      }), this._init(container, options);
    }
    return Tree.prototype = {
      get VERSION() {
        return "1.0.0";
      },
      _init: function(container, options) {
        const scope = _private.get(this);
        scope.$container = $(container), scope.$container.length ? (scope.config = UTILS.extendTreeCfg(options), 
        scope.ready = false, this._create(options ? options.data : null)) : console.error("Tree: can't find the tree container");
      },
      _create: function(data) {
        this._buildDOM(), this._bind(), this._ready(data);
      },
      _buildDOM: function() {
        const scope = _private.get(this);
        scope.$container.addClass("mcmd-tree").attr({
          tabindex: 0
        }), scope.dragdrop.$ghost = $("<div>").addClass("mcmd-tree-drag-ghost");
        const $tree_nodes = $("<div>").addClass("mcmd-tree-nodes");
        scope.$container.append($tree_nodes);
      },
      _bind: function() {
        const scope = _private.get(this);
        scope._onToggleClick = this._onToggleClick.bind(this), scope._onItemClick = this._onItemClick.bind(this), 
        scope._onKeyDown = this._onKeyDown.bind(this), scope._onItemMouseDown = this._onItemMouseDown.bind(this), 
        scope._onItemMouseEnter = this._onItemMouseEnter.bind(this), scope._onItemMouseLeave = this._onItemMouseLeave.bind(this), 
        scope._onItemMouseMove = this._onItemMouseMove.bind(this), scope._onItemMouseUp = this._onItemMouseUp.bind(this), 
        scope.$container.on("keydown", scope._onKeyDown), scope.$container.on("click", ".mcmd-tree-icon", scope._onToggleClick), 
        scope.$container.on("click", ".mcmd-tree-item", scope._onItemClick), scope.$container.on("mousedown", ".mcmd-tree-item", scope._onItemMouseDown);
      },
      _loading: function(state) {
        const scope = _private.get(this);
        scope.config.callback.loading && "function" == typeof scope.config.callback.loading && scope.config.callback.loading.call(this, state);
      },
      _ready: function(data) {
        _private.get(this).$container.addClass("mcmd-tree-ready"), this._loading(true);
        for (let i in data) this._addItem(data[i]);
        this._loading(false);
      },
      _getData: function() {
        return _private.get(this).data;
      },
      _getFlatData: function() {
        const scope = _private.get(this), data = [];
        return function walk(items, parent, level) {
          for (let i in items) {
            const item = items[i];
            data.push({
              id: item.id,
              color: item.color,
              title: item.title,
              parent: parent,
              level: level,
              collapsed: item.state.collapsed
            }), walk(item.items, item.id, level + 1);
          }
        }(scope.data, null, 0), data.length ? data : null;
      },
      _getRootItems: function() {
        const scope = _private.get(this), data = [];
        for (let i in scope.data) {
          const item = scope.data[i];
          data.push({
            id: item.id,
            color: item.color,
            title: item.title,
            parent: null,
            level: 0,
            collapsed: item.state.collapsed
          });
        }
        return data.length ? data : null;
      },
      _filter: function(substring) {
        const scope = _private.get(this);
        substring ? (scope.$container.find(".mcmd-tree-node.mcmd-hidden").removeClass("mcmd-hidden"), 
        scope.$container.find(".mcmd-tree-title").each((i, el) => {
          const $title = $(el), title = $title.text(), $node = $title.parent().parent();
          !function(wildcard, str) {
            if (wildcard) {
              let w = wildcard.replace(/[.+^${}()|[\]\\]/g, "\\$&");
              return w = w.includes("*") || w.includes("?") ? w : "*" + w + "*", new RegExp(`^${w.replace(/\*/g, ".*").replace(/\?/g, ".")}$`, "i").test(str);
            }
            return false;
          }(substring, title) ? ($title.removeClass("mcmd-bold"), $node.addClass("mcmd-hidden")) : ($title.addClass("mcmd-bold"), 
          $node.parents(".mcmd-tree-node").removeClass("mcmd-hidden"));
        })) : (scope.$container.find(".mcmd-tree-node.mcmd-hidden").removeClass("mcmd-hidden"), 
        scope.$container.find(".mcmd-tree-title.mcmd-bold").removeClass("mcmd-bold"));
      },
      _addItemElement: function(item, parentItem) {
        const scope = _private.get(this), $nodes = this._resolveNodes(parentItem);
        if ($nodes) {
          const built = this._createItemElement(item);
          $nodes.append(built.$node), item.state.selected && scope.select.list.push(item);
        }
      },
      _removeItemElement: function(item, parent) {
        const scope = _private.get(this);
        if (scope.$container.find(`[data-id='${item.id}']`).parent().remove(), item.state.selected && scope.select.list.splice(scope.select.list.indexOf(item), 1), 
        parent && 0 === parent.items.length) {
          const $parentItem = scope.$container.find(`[data-id='${parent.id}']`), $nodes = $($parentItem.parent().find(".mcmd-tree-nodes").get(0));
          $parentItem.removeClass("mcmd-tree-has-children"), $nodes.remove();
        }
      },
      _updateItemElement: function(item, fields) {
        const scope = _private.get(this), $item = item ? scope.$container.find(`[data-id='${item.id}']`) : null;
        if ($item.length) {
          UTILS.isString(fields) && (fields = [ fields ]);
          for (let i in fields) switch (fields[i]) {
           case FIELDS_TITLE:
            $item.find(".mcmd-tree-title").text(item.title);
            break;

           case FIELDS_SELECT:
            $item.toggleClass("mcmd-tree-selected", item.state.selected);
            break;

           case FIELDS_COLLAPSE:
            $item.toggleClass("mcmd-tree-collapsed", item.state.collapsed);
            break;

           case FIELDS_LABEL:
            $item.find(".mcmd-tree-label").toggleClass("mcmd-tree-active", !!item.count).text(item.count);
            break;

           case FIELDS_COLOR:
            $item.find(".mcmd-tree-icon").css({
              color: item.color ? item.color : ""
            });
          }
        }
      },
      _createItemElement: function(item) {
        const scope = _private.get(this), $icon = $("<div>").addClass("mcmd-tree-icon").append(scope.config.icon), $title = $("<div>").addClass("mcmd-tree-title").text(item.title), $label = $("<div>").addClass("mcmd-tree-label").toggleClass("mcmd-tree-active", !!item.count).text(item.count), $item = $("<div>").addClass("mcmd-tree-item").attr({
          "data-id": item.id
        }).toggleClass("mcmd-tree-selected", item.state.selected).toggleClass("mcmd-tree-collapsed", item.state.collapsed), $node = $("<div>").addClass("mcmd-tree-node");
        return $icon.css({
          color: item.color ? item.color : ""
        }), $node.append($item.append($icon, $title, $label)), {
          $node: $node,
          $item: $item
        };
      },
      _buildItemTree: function(newItem, selected) {
        const self = this, built = this._createItemElement(newItem), $node = built.$node;
        if (newItem.state.selected && selected.push(newItem), newItem.items && newItem.items.length) {
          built.$item.addClass("mcmd-tree-has-children");
          const $childNodes = $("<div>").addClass("mcmd-tree-nodes"), fragment = document.createDocumentFragment();
          for (const i in newItem.items) {
            const $childNode = self._buildItemTree(newItem.items[i], selected);
            $childNode && fragment.appendChild($childNode[0]);
          }
          $childNodes.append(fragment), $node.append($childNodes);
        }
        return $node;
      },
      _resolveNodes: function(parentItem) {
        const scope = _private.get(this);
        if (!scope.config) return console.error("Tree: item cannot be added before the tree is initialized"), 
        null;
        if (parentItem) {
          const $parentItem = scope.$container.find(`[data-id='${parentItem.id}']`);
          if ($parentItem.length) {
            let $nodes = $($parentItem.parent().find(".mcmd-tree-nodes").get(0));
            return $nodes.length || ($nodes = $("<div>").addClass("mcmd-tree-nodes"), $parentItem.addClass("mcmd-tree-has-children"), 
            $parentItem.parent().append($nodes)), $nodes;
          }
          return null;
        }
        return scope.$container.addClass("mcmd-tree-has-children"), $(scope.$container.find(".mcmd-tree-nodes").get(0));
      },
      _registerItem: function(item, parentItemId) {
        const scope = _private.get(this), self = this;
        if (item && item.id && self._getItem(item.id)) return null;
        const newItem = UTILS.extendTreeItemCfg(item), parentItem = self._getItem(parentItemId);
        if (parentItem ? parentItem.items.push(newItem) : scope.data.push(newItem), item && item.items) for (const i in item.items) self._registerItem(item.items[i], newItem.id);
        return newItem;
      },
      _addItem: function(item, parentItemId) {
        const scope = _private.get(this), newItem = this._registerItem(item, parentItemId);
        if (!newItem) return null;
        const selected = [], $node = this._buildItemTree(newItem, selected), parentItem = this._getItem(parentItemId), $nodes = this._resolveNodes(parentItem);
        if ($nodes && $node) {
          const fragment = document.createDocumentFragment();
          fragment.appendChild($node[0]), $nodes.append(fragment);
          for (let i = 0; i < selected.length; i++) scope.select.list.push(selected[i]);
        }
        return newItem;
      },
      _getItem: function(itemId) {
        return function find(items, itemId) {
          let item = null;
          if (items) for (let i = 0; i < items.length && (item = items[i], item.id !== itemId) && (item = find(item.items, itemId), 
          !item); i++) ;
          return item;
        }(_private.get(this).data, itemId);
      },
      _getParentItem: function(itemId) {
        return function find(items, itemId, parent) {
          let item = null;
          if (items) for (let i = 0; i < items.length; i++) {
            if (item = items[i], item.id === itemId) {
              item = parent;
              break;
            }
            if (item = find(item.items, itemId, item), item) break;
          }
          return item;
        }(_private.get(this).data, itemId, null);
      },
      _getPrevItem: function(itemId, collapsed) {
        const scope = _private.get(this), parents = [];
        return function find(items, itemId) {
          let item = null;
          if (items) for (let i = 0; i < items.length; i++) {
            if (item = items[i], item.id === itemId) {
              if (i > 0) for (item = items[i - 1]; (!item.state.collapsed || collapsed) && item.items.length; ) item = item.items[item.items.length - 1]; else if (item = null, 
              parents.length) {
                const parent = parents[parents.length - 1];
                item = parent.items[parent.index];
              }
              break;
            }
            if (parents.push({
              index: i,
              items: items
            }), item = find(item.items, itemId), parents.pop(), item) break;
          }
          return item;
        }(scope.data, itemId);
      },
      _getNextItem: function(itemId, collapsed) {
        const scope = _private.get(this), parents = [];
        return function find(items, itemId) {
          let item = null;
          if (items) for (let i = 0; i < items.length; i++) {
            if (item = items[i], item.id === itemId) {
              if (item.state.collapsed && !collapsed || !item.items.length) if (i < items.length - 1) item = items[i + 1]; else for (item = null, 
              i = parents.length; i--; ) {
                const parent = parents[i];
                if (parent.index < parent.items.length - 1) {
                  item = parent.items[parent.index + 1];
                  break;
                }
              } else item = item.items.length ? item.items[0] : null;
              break;
            }
            if (parents.push({
              index: i,
              items: items
            }), item = find(item.items, itemId), parents.pop(), item) break;
          }
          return item;
        }(scope.data, itemId);
      },
      _getSelectedItems: function() {
        return _private.get(this).select.list;
      },
      _moveItem: function(itemId, targetId, type) {
        const scope = _private.get(this), item = this._getItem(itemId), target = this._getItem(targetId);
        if (null == item || null == target) return;
        this._loading(true);
        const $itemNode = scope.$container.find(`[data-id='${item.id}']`).parent(), $target = scope.$container.find(`[data-id='${target.id}']`), $targetNode = $target.parent(), parentItem = item ? this._getParentItem(item.id) : null, parentTarget = target ? this._getParentItem(target.id) : null, items = parentItem ? parentItem.items : scope.data, targetItems = parentTarget ? parentTarget.items : scope.data;
        for (let i = 0; i < items.length; i++) if (items[i].id === itemId) {
          items.splice(i, 1);
          break;
        }
        if ($itemNode.detach(), 0 === items.length && parentItem) {
          const $parentItem = scope.$container.find(`[data-id='${parentItem.id}']`), $nodes = $($parentItem.parent().find(".mcmd-tree-nodes").get(0));
          $parentItem.removeClass("mcmd-tree-has-children"), $nodes.remove();
        }
        switch (type) {
         case "inside":
          for (let i = 0; i < targetItems.length; i++) if (targetItems[i].id === targetId) {
            targetItems[i].items.push(item);
            let $nodes = $($target.parent().find(".mcmd-tree-nodes").get(0));
            $nodes.length || ($nodes = $("<div>").addClass("mcmd-tree-nodes"), $target.addClass("mcmd-tree-has-children"), 
            $target.parent().append($nodes)), $nodes.append($itemNode);
            break;
          }
          break;

         case "before":
          for (let i = 0; i < targetItems.length; i++) if (targetItems[i].id === targetId) {
            targetItems.splice(i, 0, item);
            break;
          }
          $targetNode.before($itemNode);
          break;

         case "after":
          for (let i = 0; i < targetItems.length; i++) if (targetItems[i].id === targetId) {
            targetItems.splice(i + 1, 0, item);
            break;
          }
          $targetNode.after($itemNode);
        }
        this._loading(false);
      },
      _removeItem: function(itemId) {
        const scope = _private.get(this), self = this;
        return function removeItem(itemId, items) {
          let item = null;
          if (items) for (let i = 0; i < items.length; i++) {
            if (item = items[i], items[i].id === itemId) {
              let count = item.items.length;
              for (;count--; ) removeItem(item.items[count].id, item.items);
              const parent = self._getParentItem(item.id);
              items.splice(i, 1), self._removeItemElement(item, parent);
              break;
            }
            if (item = removeItem(itemId, items[i].items), item) break;
          }
          return item;
        }(itemId, scope.data);
      },
      _collapseItem: function(itemId, state) {
        const scope = _private.get(this), item = this._getItem(itemId);
        if (item) {
          let flag = false;
          void 0 === state ? (flag = true, item.state.collapsed = !item.state.collapsed) : item.state.collapsed !== state && (flag = true, 
          item.state.collapsed = state), flag && (this._updateItemElement(item, FIELDS_COLLAPSE), 
          scope.config.callback.collapse && "function" == typeof scope.config.callback.collapse && scope.config.callback.collapse.call(this, item));
        }
      },
      _selectItem: function(itemId, state) {
        const scope = _private.get(this), item = this._getItem(itemId);
        if (item) {
          let flag = false;
          void 0 === state ? (flag = true, item.state.selected = !item.state.selected) : item.state.selected !== state && (flag = true, 
          item.state.selected = state), flag && (this._updateItemElement(item, FIELDS_SELECT), 
          item.state.selected && -1 === scope.select.list.indexOf(item) ? scope.select.list.push(item) : scope.select.list.splice(scope.select.list.indexOf(item), 1));
        }
      },
      _selectItemRange: function(startItemId, endItemId) {
        const scope = _private.get(this), list = [];
        if (startItemId && endItemId && startItemId !== endItemId) {
          !function selectRange(startItemId, endItemId, items, list) {
            if (items) for (let i = 0; i < items.length; i++) {
              let item = items[i];
              if (item.id === startItemId) {
                if (list.push(item), list.length > 1) return true;
              } else if (item.id === endItemId) {
                if (list.push(item), list.length > 1) return true;
              } else list.length && list.push(item);
              if (item.items.length && !item.state.collapsed && selectRange(startItemId, endItemId, item.items, list)) return true;
            }
            return false;
          }(startItemId, endItemId, scope.data, list);
          for (let i = 0; i < list.length; i++) !list[i].state.selected && this._selectItem(list[i].id, true, true);
        } else endItemId && this._selectItem(endItemId, true);
      },
      _clearSelection: function() {
        const scope = _private.get(this);
        for (let i = 0; i < scope.select.list.length; i++) {
          let item = scope.select.list[i];
          item.state.selected = false, this._updateItemElement(item, FIELDS_SELECT);
        }
        scope.select.list = [];
      },
      _getDragDropType: function(element, pageY) {
        const rc = element.getBoundingClientRect(), offset = pageY - window.scrollY - rc.top;
        return offset < rc.height / 4 ? "before" : offset > 3 * rc.height / 4 ? "after" : "inside";
      },
      _onKeyDown: function(e) {
        const scope = _private.get(this), item = scope.select.list[scope.select.list.length - 1];
        if (document.activeElement === scope.$container.get(0) && item) {
          switch (e.keyCode) {
           case 38:
            {
              const prevItem = this._getPrevItem(item.id, false);
              prevItem && (this._clearSelection(), this._selectItem(prevItem.id, true));
            }
            break;

           case 40:
            {
              const nextItem = this._getNextItem(item.id, false);
              nextItem && (this._clearSelection(), this._selectItem(nextItem.id, true));
            }
            break;

           case 37:
            this._collapseItem(item.id, true);
            break;

           case 39:
            this._collapseItem(item.id, false);
          }
          e.preventDefault();
        }
      },
      _onToggleClick: function(e) {
        e.preventDefault(), e.stopImmediatePropagation();
        const $item = $(e.currentTarget).parent(), itemId = $item ? $item.attr("data-id") : null;
        this._collapseItem(itemId);
      },
      _onItemClick: function(e) {
        const $item = $(e.currentTarget), itemId = $item ? $item.attr("data-id") : null;
        if (e.shiftKey || e.ctrlKey) {
          if (e.ctrlKey) this._selectItem(itemId); else if (e.shiftKey) {
            const scope = _private.get(this), startItemId = scope.select.list.length ? scope.select.list[scope.select.list.length - 1].id : null, endItemId = itemId;
            this._selectItemRange(startItemId, endItemId);
          }
        } else this._clearSelection();
      },
      _onItemMouseDown: function(e) {
        if (1 === e.which && !e.shiftKey && !e.ctrlKey) {
          e.stopImmediatePropagation();
          const scope = _private.get(this), itemId = $(e.currentTarget).attr("data-id"), item = this._getItem(itemId);
          scope.dragdrop.item = item;
          const $icon = $("<div>").addClass("mcmd-tree-icon"), $title = $("<div>").addClass("mcmd-tree-title").text(item.title), $label = $("<div>").addClass("mcmd-tree-label").text(scope.select.list.length);
          scope.dragdrop.active.flag = false, scope.dragdrop.active.x = e.pageX, scope.dragdrop.active.y = e.pageY, 
          scope.dragdrop.$ghost.empty().append($icon, $title, $label).appendTo("body"), scope.$container.addClass("mcmd-tree-dragging"), 
          scope.$container.on("mouseenter", ".mcmd-tree-item", scope._onItemMouseEnter), scope.$container.on("mouseleave", ".mcmd-tree-item", scope._onItemMouseLeave), 
          $(window).on("mousemove", scope._onItemMouseMove), $(window).on("mouseup", scope._onItemMouseUp);
        }
      },
      _onItemMouseEnter: function(e) {
        const scope = _private.get(this);
        scope.dragdrop.$target = $(e.currentTarget), scope.dragdrop.$target && scope.dragdrop.$target.removeClass("mcmd-tree-before mcmd-tree-inside mcmd-tree-after");
      },
      _onItemMouseLeave: function() {
        const scope = _private.get(this);
        scope.dragdrop.$target && scope.dragdrop.$target.removeClass("mcmd-tree-before mcmd-tree-inside mcmd-tree-after"), 
        scope.dragdrop.$target = null;
      },
      _onItemMouseMove: function(e) {
        const scope = _private.get(this);
        if (scope.dragdrop.active.flag) {
          if (scope.dragdrop.$ghost.addClass("mcmd-tree-active").css({
            top: e.clientY + 5 + "px",
            left: e.clientX + 5 + "px"
          }), !scope.dragdrop.$target) return;
          const dragdroptype = this._getDragDropType(scope.dragdrop.$target.get(0), e.pageY);
          scope.dragdrop.type !== dragdroptype && (scope.dragdrop.$target.removeClass("mcmd-tree-before mcmd-tree-inside mcmd-tree-after").addClass("mcmd-tree-" + dragdroptype), 
          scope.dragdrop.type = dragdroptype);
        } else if (scope.dragdrop.active.flag = Math.abs(scope.dragdrop.active.x - e.pageX) > scope.dragdrop.active.offset || Math.abs(scope.dragdrop.active.y - e.pageY) > scope.dragdrop.active.offset, 
        scope.dragdrop.active.flag) {
          const item = scope.dragdrop.item;
          item && !item.state.selected && (this._clearSelection(), this._selectItem(item.id)), 
          scope.dragdrop.$ghost.find(".mcmd-tree-label").text(scope.select.list.length);
        }
      },
      _onItemMouseUp: function() {
        const scope = _private.get(this);
        if (scope.dragdrop.$ghost.empty().css({
          top: null,
          left: null
        }).removeClass("mcmd-tree-active").detach(), scope.$container.removeClass("mcmd-tree-dragging"), 
        scope.dragdrop.active.flag && scope.dragdrop.$target) {
          const list = [], targetId = scope.dragdrop.$target ? scope.dragdrop.$target.attr("data-id") : null, type = scope.dragdrop.type;
          function fillDropList(items, parents, list) {
            if (items) for (let i = 0; i < items.length; i++) {
              let item = items[i];
              if (item.state.selected) {
                let flag = true;
                for (let j = 0; j < parents.length; j++) for (let k = 0; k < list.length; k++) if (list[k].id === parents[j].id) {
                  flag = false;
                  break;
                }
                flag && list.push(item);
              }
              item.items.length && (parents.push(item), fillDropList(item.items, parents, list), 
              parents.pop());
            }
          }
          function checkTargetId(list, targetId) {
            for (let i = 0; i < list.length; i++) {
              if (list[i].id === targetId) return false;
              if (list[i].items.length && !checkTargetId(list[i].items, targetId)) return false;
            }
            return true;
          }
          if (scope.dragdrop.$ghost.detach().empty(), scope.dragdrop.$target && scope.dragdrop.$target.removeClass("mcmd-tree-before mcmd-tree-inside mcmd-tree-after"), 
          scope.dragdrop.$target = null, scope.dragdrop.type = null, scope.dragdrop.item = null, 
          scope.$container.removeClass("mcmd-tree-dragging"), fillDropList(scope.data, [], list), 
          checkTargetId(list, targetId)) {
            const movedItems = [];
            for (let i = 0; i < list.length; i++) movedItems.push(list[i].id);
            function moveitems(items, target, type) {
              if ("after" === type) {
                let i = items.length;
                for (;i--; ) this._moveItem(items[i], target, type);
              } else for (let i = 0; i < items.length; i++) this._moveItem(items[i], target, type);
            }
            if (scope.config.callback.move && "function" == typeof scope.config.callback.move) {
              const parentItem = "inside" === type ? this._getItem(targetId) : this._getParentItem(targetId), parentId = parentItem ? parentItem.id : null, targetItems = (parentItem ? parentItem.items : scope.data).map(x => x.id);
              scope.config.callback.move.call(this, movedItems, parentId, targetId, targetItems, type, moveitems);
            } else moveitems.call(this, movedItems, targetId, type);
          }
        }
        scope.$container.off("mouseenter", ".mcmd-tree-item", scope._onItemMouseEnter), 
        scope.$container.off("mouseleave", ".mcmd-tree-item", scope._onItemMouseLeave), 
        $(window).off("mousemove", scope._onItemMouseMove), $(window).off("mouseup", scope._onItemMouseUp);
      },
      getIcon: function() {
        const scope = _private.get(this);
        return scope.config ? scope.config.icon : null;
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
      getRootItems: function() {
        return this._getRootItems();
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
      addItems: function(items, parentItemId) {
        const scope = _private.get(this), self = this, registered = [], selected = [];
        for (let i in items) {
          const newItem = self._registerItem(items[i], parentItemId);
          newItem && registered.push(newItem);
        }
        if (!registered.length) return registered;
        const parentItem = this._getItem(parentItemId), $nodes = this._resolveNodes(parentItem);
        if ($nodes) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < registered.length; i++) {
            const $node = self._buildItemTree(registered[i], selected);
            $node && fragment.appendChild($node[0]);
          }
          $nodes.append(fragment);
          for (let i = 0; i < selected.length; i++) scope.select.list.push(selected[i]);
        }
        return registered;
      },
      collapseItem: function(itemId, state) {
        return this._collapseItem(itemId, state);
      },
      removeItem: function(itemId) {
        this._removeItem(itemId);
      },
      updateItemTitle: function(itemId, title) {
        const item = this._getItem(itemId);
        item && (item.title = title, this._updateItemElement(item, FIELDS_TITLE));
      },
      updateItemColor: function(itemId, color) {
        const item = this._getItem(itemId);
        item && (item.color = color, this._updateItemElement(item, FIELDS_COLOR));
      },
      updateItemLabel: function(itemId, count) {
        const item = this._getItem(itemId);
        item && (item.count = parseInt(count, 10), this._updateItemElement(item, FIELDS_LABEL));
      },
      toggleDragDrop: function(state) {
        const scope = _private.get(this);
        state ? (!scope.dragdrop.enabled && scope.$container.on("mousedown", ".mcmd-tree-item", scope._onItemMouseDown), 
        scope.dragdrop.enabled = true) : (scope.dragdrop.enabled && scope.$container.off("mousedown", ".mcmd-tree-item", scope._onItemMouseDown), 
        scope.dragdrop.enabled = false);
      }
    }, Tree;
  }();
  window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {}, window.MEDIACOMMANDER.PLUGINS = window.MEDIACOMMANDER.PLUGINS ? window.MEDIACOMMANDER.PLUGINS : {}, 
  window.MEDIACOMMANDER.PLUGINS.TREE = function(container, options) {
    return new TREE(container, options);
  };
}(jQuery);