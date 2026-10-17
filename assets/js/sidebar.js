!function($) {
  "use strict";
  const App = {
    data: {
      media: false,
      mediaBrowse: false,
      modal: false,
      hidden: false,
      width: {
        current: 260,
        min: 260,
        max: 800
      },
      ui: {
        $container: null,
        $sidebar: null,
        $sidebarInner: null,
        $splitter: null,
        $toggle: null,
        $list: null,
        $tree: null,
        $mediaframe: null
      },
      uploader: {
        $container: null,
        instance: null,
        list: []
      },
      loader: {
        counter: 0,
        $spin: null,
        $lock: null,
        request: null
      },
      dragdrop: {
        $ghost: null,
        $target: null,
        items: null,
        mode: null,
        isTouch: false,
        timerId: null
      },
      splitter: {
        cursor: {
          startWidth: 0,
          start: 0,
          prev: 0,
          current: 0
        }
      },
      folder: {
        active: null,
        prev: null,
        copy: null
      },
      tree: null,
      filter: {
        timerId: null
      },
      click: {
        folder: null,
        timerId: null
      },
      contextmenu: {
        list: null
      }
    },
    fn: {
      isLicenseActive: () => true === App.globals.data.is_licensed,
      run: () => {
        if (App.globals = mediacommander_sidebar_globals, App.globals.data.type) if (App.notify = new MEDIACOMMANDER.PLUGINS.NOTIFY, 
        App.colorpicker = new MEDIACOMMANDER.PLUGINS.COLORPICKER, App.data.meta = $.extend({}, App.globals.data.meta), 
        "attachment" == App.globals.data.type) {
          const listmode = $("#view-switch-list").hasClass("current");
          if (App.data.media = !(listmode || "undefined" == typeof wp || !wp.media || !wp.media.view), 
          App.data.media) {
            if ("function" == typeof wp.Uploader && $.extend(wp.Uploader.prototype, {
              init: function() {
                this.uploader && (App.data.uploader.instance = this.uploader, this.uploader.bind("FileFiltered", function(uploader, file) {
                  file._folder = App.data.folder.active;
                }), this.uploader.bind("FilesAdded", function(uploader, files) {
                  for (const file of files) App.fn.uploader.addFile(file);
                  App.fn.uploader.updateHeader(), App.fn.uploader.open();
                }), this.uploader.bind("BeforeUpload", function(uploader, file) {
                  if (file._folder) {
                    const params = uploader.settings.multipart_params, folder = parseInt(file._folder);
                    folder > 0 ? params.folder = folder : "folder" in params && delete params.folder;
                  }
                }), this.uploader.bind("UploadProgress", function(uploader, file) {}), this.uploader.bind("FileUploaded", function(uploader, file) {
                  App.fn.uploader.completeFile(file);
                }), this.uploader.bind("UploadComplete", function(uploader, files) {
                  App.fn.uploader.complete();
                }));
              }
            }), wp.media.view.AttachmentsBrowser) {
              const attachmentsBrowser = wp.media.view.AttachmentsBrowser;
              wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                createToolbar: function() {
                  App.data.attachmentsBrowser = this, App.data.mediaBrowse = !!(this.model.attributes.router && "browse" == this.model.attributes.router), 
                  App.fn.updateMediaGridSort(), attachmentsBrowser.prototype.createToolbar.apply(this, arguments);
                }
              });
            }
            if (wp.media.view.Attachment && wp.media.view.Attachment.Library) {
              const attachmentLibraryView = wp.media.view.Attachment.Library;
              wp.media.view.Attachment.Library = wp.media.view.Attachment.Library.extend({
                render: function() {
                  return attachmentLibraryView.prototype.render.apply(this, arguments), this.model && this.model.get("mcmd_is_link") ? (this.$el.addClass("mcmd-is-link"), 
                  this.$el.find(".mcmd-link-badge").length || this.$el.append('<span class="mcmd-link-badge" title="Link"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg></span>')) : (this.$el.removeClass("mcmd-is-link"), 
                  this.$el.find(".mcmd-link-badge").remove()), this;
                }
              });
            }
            if (wp.media.view.MediaFrame.EditAttachments) {
              const editAttachments = wp.media.view.MediaFrame.EditAttachments;
              wp.media.view.MediaFrame.EditAttachments = wp.media.view.MediaFrame.EditAttachments.extend({
                initialize: function() {
                  App.data.editAttachments = this, editAttachments.prototype.initialize.apply(this, arguments);
                },
                updateMediaData: function() {
                  const _self = App.data.editAttachments;
                  fetch(_self.model.attributes.url, {
                    cache: "reload",
                    mode: "no-cors"
                  }).then(() => {
                    _self.model.fetch().done(() => {
                      _self.rerender(_self.model);
                    });
                  });
                }
              });
            }
          }
          $("body").hasClass("upload-php") ? (App.fn.ajaxPrefilter(), App.fn.loadSidebar()) : App.data.media && wp.media.view.Modal && (wp && wp.blocks && App.fn.ajaxPrefilter(), 
          wp.media.view.Modal.prototype.on("prepare", App.fn.onMediaModalPrepare), wp.media.view.Modal.prototype.on("open", App.fn.onMediaModalOpen), 
          wp.media.view.Modal.prototype.on("close", App.fn.onMediaModalClose));
        } else App.fn.loadSidebar();
      },
      ajaxPrefilter: () => {
        $.ajaxPrefilter((options, originalOptions, jqXHR) => {
          "POST" === originalOptions.type && originalOptions.data && "query-attachments" == originalOptions.data.action && App.data.mediaBrowse && (originalOptions.data = $.extend(originalOptions.data, {
            mediacommander_mode: "grid"
          }), options.data = $.param(originalOptions.data));
        });
      },
      processData: (endpoint, method, data = {}, noLoading, noLock) => {
        const def = $.Deferred();
        !noLoading && App.fn.loading(true, noLock);
        const $ajax = $.ajax({
          url: App.globals.api.url + "/" + endpoint,
          type: "GET" == method ? "GET" : "POST",
          cache: false,
          dataType: "json",
          contentType: "GET" != method && "application/json",
          headers: {
            "X-WP-Nonce": App.globals.api.nonce,
            "X-HTTP-Method-Override": method
          },
          data: "GET" === method ? $.param(data) : JSON.stringify(data)
        }).done(response => {
          response && response.success ? def.resolve(response.data) : def.reject();
        }).fail(() => {
          def.reject();
        }).always(() => {
          !noLoading && App.fn.loading(false);
        });
        return {
          ...def.promise(),
          abort: $ajax.abort
        };
      },
      getData: (endpoint, data = {}, noLoading, noLock) => App.fn.processData(endpoint, "GET", data, noLoading, noLock),
      createData: (endpoint, data = {}, noLoading, noLock) => App.fn.processData(endpoint, "POST", data, noLoading, noLock),
      updateData: (endpoint, data = {}, noLoading, noLock) => App.fn.processData(endpoint, "PUT", data, noLoading, noLock),
      deleteData: (endpoint, data = {}, noLoading, noLock) => App.fn.processData(endpoint, "DELETE", data, noLoading, noLock),
      loadProposal: () => {
        App.data.hidden = "true" === Cookies.get("mcmd-sidebar-hidden"), App.fn.prebuild(), 
        App.fn.updateWidth(), App.fn.getData("template", {
          name: "proposal"
        }).done(html => {
          App.fn.build(html, true), $.when(App.fn.updateWidth()).done(() => {
            App.fn.bind(true), App.fn.ready();
          });
        });
      },
      loadSidebar: () => {
        App.data.hidden = "true" === Cookies.get("mcmd-sidebar-hidden"), App.fn.prebuild(), 
        App.fn.updateWidth(), App.data.contextmenu.list = App.globals.contextmenu, App.fn.build(App.globals.template), 
        $.when(App.fn.updateWidth(), App.fn.updateFoldersData()).done(() => {
          App.fn.updateNoticeAndSearch(), App.fn.activateFolder(App.data.meta.folder, true, true), 
          App.fn.collapseFolders(App.data.meta.collapsed), App.fn.initAttachments(), App.fn.bind(), 
          App.fn.ready();
        });
      },
      loading: (state, noLock) => {
        state ? (App.data.loader.counter++, App.data.loader.$spin.toggleClass("mcmd-active", true), 
        App.data.loader.$lock.toggleClass("mcmd-active", !noLock)) : (App.data.loader.counter--, 
        App.data.loader.counter <= 0 && (App.data.loader.$spin.toggleClass("mcmd-active", false), 
        App.data.loader.$lock.toggleClass("mcmd-active", false), App.data.loader.counter = 0));
      },
      prebuild: () => {
        if (App.data.loader.$spin = $("<div>").addClass("mcmd-spin"), App.data.loader.$lock = $("<div>").addClass("mcmd-lock"), 
        App.data.ui.$container = $("<div>").addClass("mcmd-container").toggleClass("mcmd-hidden", App.data.hidden), 
        App.data.ui.$sidebar = $("<div>").addClass("mcmd-sidebar").toggleClass("mcmd-disable-tree-labels", App.globals.data.disable_counter).toggleClass("mcmd-disable-search-bar", App.globals.data.disable_search_bar), 
        App.data.ui.$sidebarInner = $("<div>").addClass("mcmd-sidebar-inner"), App.data.ui.$splitter = $("<div>").addClass("mcmd-splitter"), 
        App.data.ui.$toggle = $("<div>").addClass("mcmd-toggle"), App.data.ui.$list = $("<div>").addClass("mcmd-list"), 
        App.data.ui.$minitools = $("<div>").addClass("mcmd-minitools"), App.data.ui.$minitools.append(App.data.ui.$toggle, App.data.loader.$spin), 
        !App.data.modal) {
          const topOffset = $("#wpadminbar").outerHeight(), bottomOffset = $("#wpfooter").outerHeight(), offset = 34;
          App.data.ui.$sidebar.css({
            position: "sticky",
            top: `${topOffset}px`,
            height: `calc(100vh - ${topOffset + bottomOffset}px - ${offset}px)`,
            width: App.data.width.current
          });
          const $wrap = (() => {
            for (const wrap of $("#wpbody .wrap")) if (!$(wrap).is(":empty")) return $(wrap);
            return null;
          })();
          $wrap.wrap(App.data.ui.$list), App.data.ui.$list = $wrap.parent(), App.data.ui.$list.wrap(App.data.ui.$container).before(App.data.ui.$sidebar, App.data.ui.$splitter).append(App.data.ui.$minitools), 
          App.data.ui.$container = App.data.ui.$sidebar.parent().addClass("mcmd-screen-type");
          const $ph_toolbar = $("<div>").addClass("mcmd-ph-toolbar"), $ph_panel = $("<div>").addClass("mcmd-ph-panel"), $ph_panel_tree = $("<div>").addClass("mcmd-ph-panel-tree");
          App.data.ui.$sidebar.append(App.data.ui.$sidebarInner.append($ph_toolbar, $ph_panel, $ph_panel_tree));
        }
      },
      build: (html, proposal) => {
        if (App.data.ui.$sidebarInner.empty().append(html), App.data.ui.$sidebar.append(App.data.ui.$sidebarInner, App.data.loader.$lock), 
        App.data.ui.$tree = App.data.ui.$sidebar.find("#mcmd-tree"), proposal || (App.globals.data.default_color && document.documentElement.style.setProperty("--mcmd-default-folder-color", App.globals.data.default_color), 
        !App.globals.data.rights.c && App.data.ui.$sidebar.find("#mcmd-btn-create").remove(), 
        "attachment" !== App.globals.data.type && App.data.ui.$sidebar.find("#mcmd-btn-sort").remove(), 
        App.globals.data.rights.c || App.data.ui.$sidebar.find("#mcmd-toolbar").remove()), 
        App.data.modal) {
          const $mediaframe = $(".media-modal:visible .media-frame").first();
          $mediaframe.length ? (App.data.ui.$mediaframe = $mediaframe, App.data.ui.$mediaframe.prepend(App.data.ui.$container.append(App.data.ui.$sidebar)), 
          App.data.ui.$mediaframe.find(".media-frame-title").prepend(App.data.ui.$minitools), 
          App.data.ui.$container.addClass("mcmd-modal-type")) : console.warn("MediaCommander: media frame not found in modal, sidebar not attached");
        }
        if (!proposal) {
          const options = {
            callback: {
              loading: App.fn.loading,
              move: App.fn.moveFolders,
              collapse: App.fn.collapseFolder
            }
          };
          App.data.tree = MEDIACOMMANDER.PLUGINS.TREE(App.data.ui.$tree, options);
        }
        App.fn.uploader.build();
      },
      bind: proposal => {
        App.data.ui.$toggle.on("click", App.fn.onToggleContainer), App.data.ui.$splitter.on("mousedown", App.fn.onSplitterMouseDown), 
        proposal || (App.data.ui.$sidebar.find("#mcmd-btn-create").on("click", App.fn.onFolderCreate), 
        App.data.ui.$sidebar.find("#mcmd-btn-sort").on("click", App.fn.onFolderSort), App.data.ui.$sidebar.find("#mcmd-search-input").on("input", App.fn.onSearchInput), 
        App.data.ui.$sidebar.find("#mcmd-search-clear").on("click", App.fn.onSearchClear), 
        App.data.ui.$sidebar.on("click", ".mcmd-tree-item", App.fn.onFolderClick), App.data.ui.$sidebar.on("dblclick", ".mcmd-tree-item", App.fn.onFolderDblClick), 
        App.data.ui.$sidebar.on("contextmenu", ".mcmd-tree-item", App.fn.onContextMenu), 
        $(document).ajaxComplete(App.fn.onAjaxComplete), "attachment" == App.globals.data.type && App.globals.data.media_hover_details && $(document).on("mouseover", ".attachment", App.fn.onShowMediaDetails));
      },
      ready: () => {
        App.data.ui.$sidebar.addClass("mcmd-active"), App.data.ui.$splitter.addClass("mcmd-active"), 
        App.data.ui.$toggle.addClass("mcmd-active"), App.data.ui.$container.addClass("mcmd-active"), 
        App.data.ui.$mediaframe && App.data.ui.$mediaframe.toggleClass("mcmd-active", !App.data.hidden), 
        App.data.ui.$sidebar.find("#mcmd-toolbar").addClass("mcmd-active"), App.data.ui.$sidebar.find("#mcmd-panel").addClass("mcmd-active"), 
        App.data.ui.$sidebar.find("#mcmd-panel-search").addClass("mcmd-active");
        const target = App.data.ui.$sidebar.find("#mcmd-panel-tree").get(0);
        if (target) {
          const {OverlayScrollbars: OverlayScrollbars} = OverlayScrollbarsGlobal;
          OverlayScrollbars(target, {
            scrollbars: {
              autoHide: "leave",
              autoHideDelay: 100
            }
          });
        }
      },
      updateMeta: noLoading => {
        const folders = App.data.tree.getFlatData(), collapsed = folders ? folders.filter(item => item.collapsed).map(item => item.id) : null, meta = {
          folder: App.data.folder.active,
          collapsed: collapsed,
          sort: App.data.meta.sort
        };
        return App.data.meta.folder = meta.folder, App.data.meta.collapsed = meta.collapsed, 
        App.fn.updateData("meta", {
          type: App.globals.data.type,
          meta: meta
        }, noLoading, true);
      },
      updateWidth: width => {
        width = (width = width || Cookies.get("mcmd-sidebar-width")) || 0, width = Math.min(Math.max(width, App.data.width.min), App.data.width.max), 
        App.data.width.current = width, App.data.ui.$sidebar.css({
          width: width
        });
      },
      updateNoticeAndSearch: () => {
        const flag = App.globals.data.rights.c && !(App.data.tree && App.data.tree.hasItems());
        App.data.ui.$sidebar.find("#mcmd-notice-create").toggleClass("mcmd-active", flag), 
        App.data.ui.$sidebar.find("#mcmd-search").toggleClass("mcmd-active", !flag), App.data.ui.$sidebar.find("#mcmd-panel-tree").toggleClass("mcmd-active", !flag);
      },
      updateMediaGridSort: () => {
        if (App.data.mediaBrowse) {
          const sort = {
            orderby: "date",
            order: "DESC"
          };
          switch (App.data.meta.sort.items) {
           case "name-asc":
            sort.orderby = "title", sort.order = "ASC";
            break;

           case "name-desc":
            sort.orderby = "title", sort.order = "DESC";
            break;

           case "date-asc":
            sort.orderby = "date", sort.order = "ASC";
            break;

           case "date-desc":
            sort.orderby = "date", sort.order = "DESC";
            break;

           case "mod-asc":
            sort.orderby = "modified", sort.order = "ASC";
            break;

           case "mod-desc":
            sort.orderby = "modified", sort.order = "DESC";
            break;

           case "author-asc":
            sort.orderby = "authorName", sort.order = "ASC";
            break;

           case "author-desc":
            sort.orderby = "authorName", sort.order = "DESC";
          }
          App.data.attachmentsBrowser && App.data.attachmentsBrowser.collection && App.data.attachmentsBrowser.collection.props.set({
            orderby: sort.orderby,
            order: sort.order
          });
        }
      },
      updateMediaGridData: () => {
        App.fn.updateMediaGridSort(), App.data.attachmentsBrowser && App.data.attachmentsBrowser.collection && App.data.attachmentsBrowser.collection.props.set({
          ignore: +new Date
        });
      },
      updateListData: url => {
        const def = $.Deferred();
        App.fn.loading(true, true);
        const $ajax = $.ajax({
          method: "GET",
          url: url,
          dataType: "html"
        }).done(html => {
          def.resolve(html);
        }).fail(() => {
          def.reject();
        }).always(() => {
          App.fn.loading(false);
        });
        return {
          ...def.promise(),
          abort: $ajax.abort
        };
      },
      updateFoldersData: () => App.fn.getData("folders", {
        type: App.globals.data.type
      }).done(data => {
        const folders = data && void 0 !== data.folders ? data.folders : data;
        folders && folders.length && App.data.tree.addItems(folders), App.fn.applyCounters(data && data.counters);
      }).fail(() => {
        App.notify.show(App.globals.msg.failed, "mcmd-failed");
      }),
      applyCounters: counters => {
        if (counters) for (const c of counters) App.data.tree.updateItemLabel(c.id, c.count), 
        -1 != c.id && -2 != c.id || App.data.ui.$sidebar.find(`.mcmd-tree-item[data-id='${c.id}'] .mcmd-tree-label`).toggleClass("mcmd-tree-active", 0 != c.count).text(c.count);
      },
      updateFoldersAttachCount: folders => {
        if (App.globals.data.disable_counter) {
          const def = $.Deferred();
          return def.resolve(), def.promise();
        }
        return App.fn.getData("attachment/counters", {
          type: App.globals.data.type,
          folders: folders
        }).done(counters => {
          App.fn.applyCounters(counters);
        });
      },
      reinitWordPressStuff: () => {
        if (window.inlineEditPost && window.inlineEditPost.init(), "plugins" === App.globals.data.type) {
          const $update_js = $("#updates-js");
          $update_js.length && $update_js.remove().appendTo("head");
        }
      },
      initAttachments: () => {
        App.data.dragdrop.$ghost = $("<div>").addClass("mcmd-attachment-drag-ghost"), App.data.media ? App.globals.data.rights.a && $(".media-frame .media-frame-content").on("mousedown touchstart", ".attachment", App.fn.onAttachmentDown) : (App.data.ui.$list.toggleClass("mcmd-can-attach", App.globals.data.rights.a), 
        App.globals.data.rights.a && $("#the-list").on("mousedown touchstart", ".check-column", App.fn.onAttachmentDown));
      },
      dropAttachments: (folder, attachments, mode = "move") => {
        folder && App.data.folder.active != folder && attachments && attachments.length && ("link" !== mode || -1 != folder && -2 != folder) && App.fn.updateData("attach", {
          type: App.globals.data.type,
          folder: folder,
          attachments: attachments,
          link: "link" === mode,
          from: App.data.folder.active
        }).done(folders => {
          App.fn.updateFoldersAttachCount(folders), App.fn.activateFolder(App.data.folder.active, false, true);
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      activateFolder: (folder, noAction, force) => {
        (App.data.folder.active != folder || force) && (App.data.folder.prev = App.data.folder.active, 
        App.data.folder.active = folder, App.data.meta.folder = folder, App.data.ui.$sidebar.find(".mcmd-tree-item.mcmd-active").removeClass("mcmd-active"), 
        App.data.ui.$sidebar.find(`.mcmd-tree-item[data-id='${folder}']`).addClass("mcmd-active"), 
        noAction || (App.data.loader.request && App.data.loader.request.abort(), App.data.loader.request = App.fn.updateMeta(), 
        App.data.loader.request.done(() => {
          if (App.data.media) App.fn.updateMediaGridData(); else {
            const paged = Url.queryString("paged");
            ("string" == typeof paged || paged instanceof String) && Url.updateSearchParam("paged", "1", false), 
            App.globals.data.disable_ajax ? window.location.reload() : (App.data.loader.request = App.fn.updateListData(location.href), 
            App.data.loader.request.done(html => {
              const $wrap = (() => {
                for (const wrap of $(html).find("#wpbody .wrap")) if (!$(wrap).is(":empty")) return $(wrap);
                return null;
              })();
              $wrap && (App.data.ui.$list.find(".wrap")[0].innerHTML = $wrap[0].innerHTML, App.fn.initAttachments(), 
              App.fn.reinitWordPressStuff());
            }).fail(() => {
              App.data.loader.request = null;
            }).always(() => {
              App.data.loader.request = null;
            }));
          }
        }).fail(() => {
          App.data.loader.request = null;
        }).always(() => {})));
      },
      collapseFolders: folders => {
        if (folders && folders.length) for (const folder of folders) App.data.tree.collapseItem(folder, true);
      },
      createFolders: (names, color, parent) => {
        names && names.length && App.fn.createData("folders", {
          type: App.globals.data.type,
          names: names,
          color: color,
          parent: parent
        }).done(folders => {
          for (const folder of folders) App.data.tree.addItem({
            id: folder.id,
            title: folder.title,
            color: folder.color
          }, parent);
          App.fn.updateNoticeAndSearch();
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      renameFolder: (folder, name) => {
        App.fn.updateData("folders", {
          type: App.globals.data.type,
          action: "rename",
          folders: [ folder ],
          name: name
        }).done(folders => {
          for (const folder of folders) App.data.tree.updateItemTitle(folder, name);
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      colorFolders: (folders, color) => {
        folders && folders.length && App.fn.updateData("folders", {
          type: App.globals.data.type,
          action: "color",
          folders: folders,
          color: color
        }).done(folders => {
          for (const folder of folders) App.data.tree.updateItemColor(folder, color);
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      moveFolders: function(folders, parent, target, targetItems, type, callback) {
        const self = this;
        let sorting = [];
        switch (type) {
         case "before":
          sorting = JSON.parse(JSON.stringify(targetItems)), sorting = sorting.filter(item => !folders.includes(item)), 
          sorting.splice(sorting.indexOf(target), 0, ...folders);
          break;

         case "after":
          sorting = JSON.parse(JSON.stringify(targetItems)), sorting = sorting.filter(item => !folders.includes(item)), 
          sorting.splice(sorting.indexOf(target) + 1, 0, ...folders);
          break;

         case "inside":
          sorting = targetItems.concat(folders);
        }
        App.fn.updateData("folders", {
          type: App.globals.data.type,
          action: "move",
          folders: folders,
          parent: parent,
          sorting: sorting
        }).done(folders => {
          callback && "function" == typeof callback && callback.call(self, folders, target, type);
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      collapseFolder: function() {
        App.data.loader.request && App.data.loader.request.abort(), App.data.loader.request = App.fn.updateMeta(true), 
        App.data.loader.request.always(() => {
          App.data.loader.request = null;
        });
      },
      copyFolders: (src, dst) => {
        App.fn.createData("copyfolder", {
          type: App.globals.data.type,
          src: src,
          dst: dst
        }).done(folders => {
          for (const folder of folders) App.data.tree.addItem(folder, folder.parent);
          App.fn.updateNoticeAndSearch();
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      deleteFolders: (folders, deleteAttachments) => {
        folders && folders.length && App.fn.deleteData("folders", {
          type: App.globals.data.type,
          folders: folders,
          deleteAttachments: deleteAttachments
        }).done(folders => {
          let refresh = false;
          for (const folder of folders) App.data.tree.removeItem(folder), refresh || App.data.folder.active != folder || (refresh = true), 
          App.data.folder.copy == folder && (App.data.folder.copy = null);
          App.fn.updateNoticeAndSearch(), App.fn.updateFoldersAttachCount(), App.data.folder.active < 0 ? App.fn.activateFolder(App.data.folder.active, false, true) : refresh && App.fn.activateFolder(-1);
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      downloadFolders: folders => {
        folders && folders.length && App.fn.getData("folders/download/url", {
          type: App.globals.data.type,
          folders: folders
        }).done(url => {
          window.open(url, "_blank");
        }).fail(() => {
          App.notify.show(App.globals.msg.failed, "mcmd-failed");
        });
      },
      filterFolders: str => {
        clearTimeout(App.data.filter.timerId), App.data.filter.timerId = setTimeout(() => {
          App.data.tree.filter(str);
        }, 500);
      },
      onToggleContainer: () => {
        App.data.hidden = !App.data.hidden, App.data.ui.$container.toggleClass("mcmd-hidden", App.data.hidden), 
        App.data.ui.$mediaframe && App.data.ui.$mediaframe.toggleClass("mcmd-active", !App.data.hidden), 
        Cookies.set("mcmd-sidebar-hidden", App.data.hidden);
      },
      onSplitterMouseDown: e => {
        e.preventDefault(), e.stopImmediatePropagation(), App.data.splitter.cursor.startWidth = App.data.width.current, 
        App.data.splitter.cursor.start = App.data.splitter.prev = App.data.splitter.cursor.current = e.pageX, 
        $(window).on("mousemove", App.fn.onSplitterMouseMove), $(window).on("mouseup", App.fn.onSplitterMouseUp);
      },
      onSplitterMouseMove: e => {
        App.data.splitter.cursor.prev = App.data.splitter.cursor.current, App.data.splitter.cursor.current = e.pageX, 
        App.data.width.current = App.data.splitter.cursor.startWidth + (App.data.splitter.cursor.current - App.data.splitter.cursor.start), 
        Cookies.set("mcmd-sidebar-width", App.data.width.current), App.fn.updateWidth(App.data.width.current);
      },
      onSplitterMouseUp: () => {
        $(window).off("mousemove", App.fn.onSplitterMouseMove), $(window).off("mouseup", App.fn.onSplitterMouseUp);
      },
      closeActiveForms: () => {
        $("#mcmd-form-create").removeClass("ifs-active"), $("#mcmd-form-sort").removeClass("ifs-active");
      },
      onFolderCreate: () => {
        if (!App.globals.data.rights.c) return;
        const $form = $("#mcmd-form-create");
        if ($form.hasClass("mcmd-active")) return void $form.removeClass("mcmd-active");
        function close() {
          $form.removeClass("mcmd-active");
        }
        App.fn.closeActiveForms();
        const $folderName = $form.find("#mcmd-folder-name"), $folderParent = $form.find("#mcmd-folder-parent"), $folderColor = $form.find("#mcmd-folder-color");
        $folderName.val(""), App.colorpicker.set($folderColor, null), $folderParent.off().empty().append($("<option>").val(0).text(App.globals.msg.parent_folder));
        const data = App.data.tree.getFlatData();
        for (const key in data) {
          const folder = data[key];
          $folderParent.append($("<option>").val(folder.id).html("&nbsp;&nbsp;".repeat(folder.level) + folder.title));
        }
        $form.off("click"), $form.one("click", ".mcmd-close", () => {
          close();
        }), $form.one("click", ".mcmd-submit", () => {
          const folderNames = $folderName.val().split(",").map(s => s.trim()), folderParent = $folderParent.val(), folderColor = App.colorpicker.get($folderColor);
          App.fn.createFolders(folderNames, folderColor, folderParent), close();
        }), $form.addClass("mcmd-active");
      },
      onFolderCreateBuiltin: parent => {
        if (!App.globals.data.rights.c) return;
        const $parent = App.data.ui.$tree.find(`.mcmd-tree-item[data-id=${parent}]`);
        if (!$parent.length) return;
        const $nodes = $("<div>").addClass("mcmd-tree-nodes"), $node = $("<div>").addClass("mcmd-tree-node"), $item = $("<div>").addClass("mcmd-tree-item mcmd-tree-edited"), $icon = $("<div>").addClass("mcmd-tree-icon").append(App.data.tree.getIcon()), $edit = $("<div>").addClass("mcmd-tree-edit").attr({
          id: "mcmd-tree-edit"
        }), $input = $("<input>").addClass("mcmd-tree-input").attr({
          spellcheck: "false",
          autocomplete: "off"
        }), $enter = $("<div>").addClass("mcmd-tree-btn-enter");
        function close() {
          $nodes.remove(), App.data.tree.toggleDragDrop(true);
        }
        App.data.tree.toggleDragDrop(false), $parent.parent().append($nodes.append($node.append($item.append($icon, $edit.append($input, $enter))))), 
        $input.focus().val(App.globals.msg.new_folder).one("blur", () => {
          close();
        }).on("keyup", e => {
          if ((13 == e.keyCode || 27 == e.keyCode) && (close(), 13 == e.keyCode)) {
            const folderNames = $input.val().split(",").map(s => s.trim());
            App.fn.createFolders(folderNames, null, parent);
          }
        });
      },
      onFolderCopy: folder => {
        App.data.folder.copy = folder;
      },
      onFolderPaste: folder => {
        null != App.data.folder.copy && App.fn.copyFolders(App.data.folder.copy, folder);
      },
      onFolderDelete: folders => {
        const $modal = $("<div>").addClass("mcmd-modal"), $form = $("#mcmd-form-delete").clone();
        function close() {
          $modal.remove();
        }
        $form.off("click"), $form.one("click", ".mcmd-close", () => {
          close();
        }), $form.one("click", ".mcmd-submit", () => {
          const deleteAttachments = $form.find("#mcmd-delete-attachments").is(":checked");
          App.fn.deleteFolders(folders.map(s => s.id), deleteAttachments), close();
        }), $("body").append($modal.append($form)), setTimeout(() => {
          $modal.addClass("mcmd-active"), $form.addClass("mcmd-active");
        });
      },
      onFolderDownload: folders => {
        App.fn.downloadFolders(folders.map(s => s.id));
      },
      onFolderSort: () => {
        const $form = $("#mcmd-form-sort");
        if ($form.hasClass("mcmd-active")) return void $form.removeClass("mcmd-active");
        App.fn.closeActiveForms();
        let sort = App.data.meta.sort.items;
        sort && $form.find(`.mcmd-sort-types [data="${sort}"]`).addClass("mcmd-active"), 
        $form.find(".mcmd-sort-type").off().on("click", e => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        }), $form.off("click"), $form.one("click", ".mcmd-close", () => {
          $form.removeClass("mcmd-active");
        }), $form.addClass("mcmd-active");
      },
      onFolderClick: e => {
        if (clearTimeout(App.data.click.timerId), !e.shiftKey && !e.ctrlKey && !$(e.target).hasClass("mcmd-tree-icon") && 1 === e.detail) {
          const $item = $(e.currentTarget);
          $item.hasClass("mcmd-tree-edited") || (App.data.click.folder = $item.attr("data-id"), 
          App.data.click.timerId = setTimeout(App.fn.onFolderClickAction, 300));
        }
      },
      onFolderClickAction: () => {
        App.data.click.timerId = null;
        const folder = App.data.click.folder;
        -1 != folder && -2 != folder || App.data.tree.clearSelection(), App.fn.activateFolder(folder);
      },
      onFolderDblClick: e => {
        if (App.globals.data.rights.e && !e.shiftKey && !e.ctrlKey && !$(e.target).hasClass("mcmd-tree-icon") && e.detail > 1) {
          e.preventDefault();
          const $item = $(e.currentTarget), folderId = $item.attr("data-id"), folder = App.data.tree.getItem(folderId);
          if (!folder || $item.hasClass("mcmd-tree-edited")) return;
          const $edit = $("<div>").addClass("mcmd-tree-edit").attr({
            id: "mcmd-tree-edit"
          }), $input = $("<input>").addClass("mcmd-tree-input").attr({
            spellcheck: "false",
            autocomplete: "off"
          }), $enter = $("<div>").addClass("mcmd-tree-btn-enter");
          function close() {
            $edit.remove(), $item.removeClass("mcmd-tree-edited"), App.data.tree.toggleDragDrop(true);
          }
          App.data.tree.toggleDragDrop(false), $item.append($edit.append($input, $enter)).addClass("mcmd-tree-edited"), 
          $input.focus().val(folder.title).one("blur", () => {
            close();
          }).on("keyup", e => {
            if ((13 == e.keyCode || 27 == e.keyCode) && (close(), 13 == e.keyCode)) {
              const folderName = $input.val();
              $item.find(".mcmd-tree-title").text(folderName), App.fn.renameFolder(folder.id, folderName);
            }
          });
        }
      },
      onContextMenu: e => {
        if (!App.globals.data.rights.c && !App.globals.data.rights.e && !App.globals.data.rights.d) return;
        const $folder = $(e.currentTarget), folderId = $folder.attr("data-id");
        if (-1 == folderId || -2 == folderId) return;
        const folder = App.data.tree.getItem(folderId);
        folder.state.selected || (App.data.tree.clearSelection(), App.data.tree.selectItem(folderId, true)), 
        e.preventDefault();
        const folders = App.data.tree.getSelectedItems(), $menu = $("<div>").addClass("mcmd-contextmenu").attr({
          tabindex: -1
        }), $body = $("body"), close = () => {
          $menu.remove(), App.data.tree.clearSelection();
        }, color_callback = color => {
          App.fn.colorFolders(folders.map(s => s.id), color), close();
        };
        for (const item of App.data.contextmenu.list) {
          if (!App.globals.data.rights.c && "c" == item.right || !App.globals.data.rights.v && "v" == item.right || !App.globals.data.rights.e && "e" == item.right || !App.globals.data.rights.d && "d" == item.right) continue;
          if ("attachment" !== App.globals.data.type && "download" == item.id) continue;
          const $item = $("<div>").addClass("mcmd-item").attr({
            "data-id": item.id
          }), $icon = $("<div>").addClass("mcmd-icon").html(item.icon), $title = $("<div>").addClass("mcmd-title").text(item.title);
          switch ($menu.append($item.append($icon, $title)), item.id) {
           case "create":
            $menu.append($("<div>").addClass("mcmd-splitter"));
            break;

           case "color":
            {
              const $submenu = $("<div>").addClass("mcmd-submenu");
              new MEDIACOMMANDER.PLUGINS.COLORPICKER(folder.color, $submenu, color_callback);
              $item.append($submenu), $item.on("mouseover mouseout", e => {
                $submenu.toggleClass("mcmd-active", "mouseover" == e.type), "mouseover" !== e.type && $menu.focus();
              });
            }
            break;

           case "paste":
            $item.toggleClass("mcmd-disabled", null == App.data.folder.copy);
            break;

           case "delete":
            $item.addClass("mcmd-alert");
          }
        }
        const top = (e = e.originalEvent).clientY, left = e.clientX;
        $menu.css({
          top: top,
          left: left
        }).on("blur", e => {
          e.currentTarget.contains(e.relatedTarget) || close();
        }).on("click", ".mcmd-item", e => {
          switch ($(e.target).data("id")) {
           case "create":
            App.fn.onFolderCreateBuiltin(folderId), close();
            break;

           case "rename":
            {
              const event = new MouseEvent("dblclick", {
                bubbles: true,
                detail: 2
              });
              $folder[0].dispatchEvent(event), close();
            }
            break;

           case "copy":
            App.fn.onFolderCopy(folderId), close();
            break;

           case "paste":
            App.fn.onFolderPaste(folderId), close();
            break;

           case "delete":
            App.fn.onFolderDelete(folders), close();
            break;

           case "download":
            App.fn.onFolderDownload(folders), close();
          }
        }), $body.append($menu), $menu.focus();
      },
      onSearchInput: e => {
        App.fn.filterFolders(e.target.value);
      },
      onSearchClear: () => {
        $("#mcmd-search-input").val(""), App.fn.filterFolders();
      },
      onAttachmentFolderEnter: e => {
        App.data.dragdrop.$target = $(e.currentTarget).addClass("mcmd-droppable");
      },
      onAttachmentFolderLeave: () => {
        App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass("mcmd-droppable"), 
        App.data.dragdrop.$target = null;
      },
      onAttachmentFolderUnderPointer: e => {
        const $target = $(document.elementFromPoint(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY)).closest(".mcmd-tree-item");
        App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass("mcmd-droppable"), 
        App.data.dragdrop.$target = null, $target.length && (App.data.dragdrop.$target = $target.addClass("mcmd-droppable"));
      },
      onAttachmentDown: e => {
        const isTouch = "touchstart" === e.type && e.originalEvent.touches && 1 == e.originalEvent.touches.length;
        if (1 === e.which || isTouch) if (App.data.media) {
          if (App.data.mediaBrowse) {
            !isTouch && e.preventDefault(), !isTouch && e.stopImmediatePropagation();
            const items = [];
            $('.media-frame .media-frame-content .attachment[aria-checked="true"]').each(function() {
              items.push($(this).attr("data-id"));
            }), 0 == items.length && items.push($(e.currentTarget).attr("data-id")), items.length && (App.data.dragdrop.isTouch = isTouch, 
            App.data.dragdrop.items = items, App.data.dragdrop.$ghost.text("Move Items (" + items.length + ")").appendTo("body"), 
            isTouch ? (document.addEventListener("touchmove", App.fn.onTouchMove, {
              passive: false
            }), $(window).on("touchmove", App.fn.onAttachmentFolderUnderPointer), $(window).on("touchmove", App.fn.onAttachmentMove), 
            $(window).on("touchend", App.fn.onAttachmentUp)) : (App.data.ui.$sidebar.on("mouseenter", ".mcmd-tree-item", App.fn.onAttachmentFolderEnter), 
            App.data.ui.$sidebar.on("mouseleave", ".mcmd-tree-item", App.fn.onAttachmentFolderLeave), 
            $(window).on("mousemove", App.fn.onAttachmentMove), $(window).on("mouseup", App.fn.onAttachmentUp), 
            $(window).on("keydown keyup", App.fn.onAttachmentKeys)));
          }
        } else {
          !isTouch && e.preventDefault(), !isTouch && e.stopImmediatePropagation();
          const items = [];
          let name = "post";
          switch (App.globals.data.type) {
           case "attachment":
            name = "media";
            break;

           case "users":
            name = "users";
            break;

           case "plugins":
            name = "checked";
          }
          $(`#the-list input[name='${name}[]']:checked`).each(function() {
            items.push($(this).val());
          }), 0 == items.length && items.push($(e.currentTarget).find("input").val()), items.length && (App.data.dragdrop.isTouch = isTouch, 
          App.data.dragdrop.items = items, App.data.dragdrop.$ghost.text("Move Items (" + items.length + ")").appendTo("body"), 
          isTouch ? (document.addEventListener("touchmove", App.fn.onTouchMove, {
            passive: false
          }), $(window).on("touchmove", App.fn.onAttachmentFolderUnderPointer), $(window).on("touchmove", App.fn.onAttachmentMove), 
          $(window).on("touchend", App.fn.onAttachmentUp)) : (App.data.ui.$sidebar.on("mouseenter", ".mcmd-tree-item", App.fn.onAttachmentFolderEnter), 
          App.data.ui.$sidebar.on("mouseleave", ".mcmd-tree-item", App.fn.onAttachmentFolderLeave), 
          $(window).on("mousemove", App.fn.onAttachmentMove), $(window).on("mouseup", App.fn.onAttachmentUp), 
          $(window).on("keydown keyup", App.fn.onAttachmentKeys)));
        }
      },
      updateDragMode: isLink => {
        isLink && !App.globals.data.enable_links && (isLink = false), isLink !== ("link" === App.data.dragdrop.mode) && (App.data.dragdrop.mode = isLink ? "link" : "move", 
        App.data.dragdrop.$ghost.text(isLink ? "Create Links (" + App.data.dragdrop.items.length + ")" : "Move Items (" + App.data.dragdrop.items.length + ")").toggleClass("mcmd-link-mode", isLink)), 
        $("body").toggleClass("mcmd-link-dragging", isLink);
      },
      onAttachmentKeys: e => {
        App.data.dragdrop.items && App.data.dragdrop.items.length && ("Alt" === e.key && e.preventDefault(), 
        App.fn.updateDragMode(e.altKey || e.ctrlKey && e.shiftKey));
      },
      onAttachmentMove: e => {
        App.data.dragdrop.items && App.data.dragdrop.items.length && (e = App.data.dragdrop.isTouch ? e.originalEvent.touches[0] : e, 
        App.data.dragdrop.$ghost.addClass("mcmd-active").css({
          top: e.clientY + 5 + "px",
          left: e.clientX + 5 + "px"
        }), App.data.dragdrop.isTouch || App.fn.updateDragMode(e.altKey || e.ctrlKey && e.shiftKey));
      },
      onAttachmentUp: () => {
        const folder = App.data.dragdrop.$target ? App.data.dragdrop.$target.attr("data-id") : null, items = App.data.dragdrop.items, mode = App.data.dragdrop.mode || "move";
        App.data.dragdrop.$ghost.text("").removeClass("mcmd-active mcmd-link-mode").detach(), 
        App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass("mcmd-droppable"), 
        App.data.dragdrop.$target = null, App.data.dragdrop.items = null, App.data.dragdrop.mode = null, 
        $("body").removeClass("mcmd-link-dragging"), clearTimeout(App.data.dragdrop.timerId), 
        App.data.dragdrop.timerId = null, App.data.dragdrop.isTouch ? (document.removeEventListener("touchmove", App.fn.onTouchMove, {
          passive: false
        }), $(window).off("touchmove", App.fn.onAttachmentFolderUnderPointer), $(window).off("touchmove", App.fn.onAttachmentMove), 
        $(window).off("touchend", App.fn.onAttachmentUp)) : (App.data.ui.$sidebar.off("mouseenter", ".mcmd-tree-item", App.fn.onAttachmentFolderEnter), 
        App.data.ui.$sidebar.off("mouseleave", ".mcmd-tree-item", App.fn.onAttachmentFolderLeave), 
        $(window).off("mousemove", App.fn.onAttachmentMove), $(window).off("mouseup", App.fn.onAttachmentUp), 
        $(window).off("keydown keyup", App.fn.onAttachmentKeys)), App.fn.dropAttachments(folder, items, mode);
      },
      onMediaModalPrepare: () => {},
      onMediaModalOpen: () => {
        App.data.modal || (App.data.modal = true, wp && wp.blocks ? App.fn.loadSidebar() : App.fn.loadProposal());
      },
      onMediaModalClose: () => {
        App.data.modal = false, App.data.ui.$container && App.data.ui.$container.remove(), 
        App.data.ui.$minitools && App.data.ui.$minitools.remove(), App.data.ui.$mediaframe && App.data.ui.$mediaframe.removeClass("mcmd-active");
      },
      onAjaxComplete: (e, request, options) => {
        if (null != options.data && "string" == typeof options.data && options.data.indexOf("action=delete-post") > -1) {
          const folders = App.data.tree.getFlatData(), folders_to_refresh = folders ? folders.map(item => item.id) : null;
          App.fn.activateFolder(App.data.folder.active, false, true), App.fn.updateFoldersAttachCount(folders_to_refresh), 
          App.fn.updateNoticeAndSearch();
        }
      },
      onShowMediaDetails: e => {
        const $target = $(e.target);
        if (!$target.hasClass("mcmd-has-preview-details")) {
          const dataId = $target.attr("data-id");
          if (dataId) {
            const attachment = window.wp.media.attachment(dataId);
            attachment.attributes && attachment.attributes.preview_details && ($target.addClass("mcmd-has-preview-details"), 
            $(".attachment[data-id=" + dataId + "] .attachment-preview").prepend(attachment.attributes.preview_details));
          }
        }
      },
      onTouchMove: e => {
        e.preventDefault(), clearTimeout(App.data.dragdrop.timerId);
        e.touches[0].clientY < 30 ? App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null, -window.innerHeight / 5), 150) : e.touches[0].clientY > window.innerHeight - 30 && (App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null, window.innerHeight / 5), 150));
      },
      scroll: offset => {
        window.scrollBy({
          top: offset,
          behavior: "smooth"
        }), App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null, offset), 150);
      },
      formatBytes: bytes => {
        let l = 0, n = parseInt(bytes, 10) || 0;
        for (;n >= 1024 && ++l; ) n /= 1024;
        return n.toFixed(n < 10 && l > 0 ? 1 : 0) + " " + [ "bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB" ][l];
      },
      uploader: {
        build: () => {
          App.data.uploader.$container = $("<div>").addClass("mcmd-uploader"), App.data.uploader.$header = $("<div>").addClass("mcmd-header").text("Upload"), 
          App.data.uploader.$title = $("<div>").addClass("mcmd-title"), App.data.uploader.$count = $("<div>").addClass("mcmd-count"), 
          App.data.uploader.$close = $("<div>").addClass("mcmd-close").html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z "></path></svg>'), 
          App.data.uploader.$data = $("<div>").addClass("mcmd-data"), App.data.uploader.$container.append(App.data.uploader.$header.append(App.data.uploader.$title, App.data.uploader.$count, App.data.uploader.$close), App.data.uploader.$data), 
          App.data.ui.$container.append(App.data.uploader.$container), App.data.uploader.$close.on("click", App.fn.uploader.close);
        },
        open: () => {
          App.data.uploader.$container.addClass("mcmd-active");
        },
        close: () => {
          App.data.uploader.$container.removeClass("mcmd-active"), App.data.uploader.$close.removeClass("mcmd-active"), 
          App.data.uploader.$data.empty();
          App.data.uploader.list.filter(item => !item.loaded).length && (App.data.uploader.instance.stop(), 
          App.fn.uploader.complete()), App.data.uploader.list = [];
        },
        complete: () => {
          const folders = App.data.uploader.list.map(item => item.folder).filter((item, index, a) => a.indexOf(item) == index);
          App.fn.activateFolder(App.data.folder.active, false, true), App.fn.updateFoldersAttachCount(folders), 
          App.fn.updateNoticeAndSearch();
        },
        addFile: file => {
          const item = {
            id: file.id,
            folder: file._folder,
            loaded: false
          };
          App.data.uploader.list.push(item);
          const folder = App.data.tree.getItem(file._folder), $item = $("<div>").addClass("mcmd-item").attr({
            "data-id": file.id
          }), $title = $("<div>").addClass("mcmd-title").text(file.name), $size = $("<div>").addClass("mcmd-info").text(App.fn.formatBytes(file.size) + (folder ? " [" + folder.title + "]" : ""));
          App.data.uploader.$data.prepend($item.append($title, $size));
        },
        completeFile: file => {
          App.data.uploader.$data.find(`.mcmd-item[data-id="${file.id}"]`).addClass("mcmd-loaded");
          for (const item of App.data.uploader.list) if (item.id === file.id) {
            item.loaded = true;
            break;
          }
          App.fn.uploader.updateHeader();
        },
        updateHeader: () => {
          const loaded = App.data.uploader.list.filter(item => item.loaded).length;
          App.data.uploader.$count.text(`${loaded} / ${App.data.uploader.list.length}`);
        }
      },
      replacemedia: {
        open: btn => {
          const modal = {
            data: {
              $modal: $("<div>").addClass("mcmd-modal"),
              $form: $("#mcmd-form-replace-media").clone(),
              attachment: $(btn).attr("data-attachment-id"),
              file: null
            },
            fn: {
              build: () => {
                modal.data.$fileDropZone = modal.data.$form.find(".mcmd-file-drop-zone"), modal.data.$fileUpload = modal.data.$form.find(".mcmd-file-upload"), 
                modal.data.$imagePreview = modal.data.$form.find(".mcmd-image-preview"), modal.data.$fileSelect = modal.data.$form.find(".mcmd-file-select"), 
                modal.data.$fileSubmit = modal.data.$form.find(".mcmd-btn.mcmd-submit"), modal.data.$loader = modal.data.$form.find(".mcmd-loader"), 
                $("body").append(modal.data.$modal.append(modal.data.$form)), setTimeout(() => {
                  modal.data.$modal.addClass("mcmd-active"), modal.data.$form.addClass("mcmd-active");
                });
              },
              bind: () => {
                modal.data.$form.on("click", ".mcmd-close", modal.fn.close), modal.data.$form.on("click", ".mcmd-submit", modal.fn.submit), 
                modal.data.$modal.on("dragenter dragover drop", () => false), modal.data.$fileUpload.on("change", modal.fn.selectFile), 
                modal.data.$fileSelect.on("click", () => {
                  modal.data.$fileUpload.click();
                });
                (new XMLHttpRequest).upload && (modal.data.$fileDropZone.on("dragover dragleave", modal.fn.dragHover), 
                modal.data.$fileDropZone.on("drop", modal.fn.selectFile));
              },
              loading: state => {
                modal.data.$loader.toggleClass("mcmd-active", state);
              },
              dragHover: e => (e.currentTarget.contains(e.relatedTarget) || modal.data.$fileDropZone.toggleClass("mcmd-hover", "dragover" === e.type), 
              false),
              selectFile: e => {
                modal.data.file = null, modal.data.$fileSubmit.addClass("mcmd-hidden"), modal.fn.dragHover(e);
                const files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;
                if (1 == files.length) {
                  const file = files[0];
                  /\.(?=gif|jpg|png|jpeg)/gi.test(file.name) ? (modal.data.file = file, modal.data.$fileDropZone.addClass("mcmd-preview"), 
                  modal.data.$imagePreview.get(0).src = URL.createObjectURL(modal.data.file), modal.data.$fileSubmit.removeClass("mcmd-hidden")) : (modal.data.$fileDropZone.removeClass("mcmd-preview"), 
                  modal.data.$fileDropZone.get(0).reset());
                } else App.notify.show(App.globals.msg.failed, "mcmd-failed");
              },
              show: () => {
                modal.fn.build(), modal.fn.bind();
              },
              close: () => {
                modal.data.$modal.remove();
              },
              submit: () => {
                if (null == modal.data.file) return;
                const formData = new FormData;
                formData.append("file", modal.data.file), formData.append("attachment", modal.data.attachment), 
                modal.fn.loading(true), $.ajax({
                  url: App.globals.api.url + "/replace-media",
                  type: "POST",
                  data: formData,
                  processData: false,
                  contentType: false,
                  headers: {
                    "X-WP-Nonce": App.globals.api.nonce
                  }
                }).done(response => {
                  response && response.success ? (modal.fn.close(), App.notify.show(App.globals.msg.success, "mcmd-success"), 
                  App.fn.activateFolder(App.data.folder.active, false, true), App.data.editAttachments && App.data.editAttachments.updateMediaData()) : App.notify.show(App.globals.msg.failed, "mcmd-failed");
                }).fail(() => {
                  App.notify.show(App.globals.msg.failed, "mcmd-failed");
                }).always(() => {
                  modal.fn.loading(false);
                });
              }
            }
          };
          modal.fn.show();
        }
      }
    }
  };
  $(() => {
    App.fn.run();
  }), window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {}, 
  window.MEDIACOMMANDER.APP = App;
}(jQuery);