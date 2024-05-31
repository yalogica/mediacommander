;(function($) {
    'use strict';

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
            run: () => {
                console.log('MediaCommander: version ' + mediacommander_sidebar_globals.data.version);
                App.globals = mediacommander_sidebar_globals;

                // the type is defined, so it is necessary to build the sidebar with folders
                if(App.globals.data.type) {
                    App.notify = new MEDIACOMMANDER.PLUGINS.NOTIFY();
                    App.colorpicker = new MEDIACOMMANDER.PLUGINS.COLORPICKER();
                    App.data.meta = $.extend({}, App.globals.data.meta);
                    App.data.ticket = App.globals.data.ticket;

                    if(App.globals.data.type == 'attachment') {
                        const listmode = $('#view-switch-list').hasClass('current');
                        App.data.media = !listmode && typeof wp !== 'undefined' && wp.media && wp.media.view ? true : false;

                        if(App.data.media) {
                            if(typeof wp.Uploader === 'function') {
                                $.extend(wp.Uploader.prototype, {
                                    init: function () {
                                        if (this.uploader) {
                                            App.data.uploader.instance = this.uploader;

                                            this.uploader.bind('FileFiltered', function(uploader, file) {
                                                file._folder = App.data.folder.active;
                                            });
                                            this.uploader.bind('FilesAdded', function(uploader, files) {
                                                for(const file of files) {
                                                    App.fn.uploader.addFile(file);
                                                }
                                                App.fn.uploader.updateHeader();
                                                App.fn.uploader.open();
                                            });
                                            this.uploader.bind('BeforeUpload', function(uploader, file) {
                                                if(file._folder) {
                                                    const params = uploader.settings.multipart_params;
                                                    const folder = parseInt(file._folder);
                                                    if (folder > 0) {
                                                        params.folder = folder;
                                                    } else if ('folder' in params) {
                                                        delete params.folder;
                                                    }
                                                }
                                            });
                                            this.uploader.bind('UploadProgress', function(uploader, file) {
                                            });
                                            this.uploader.bind('FileUploaded', function(uploader, file) {
                                                App.fn.uploader.completeFile(file);
                                            });
                                            this.uploader.bind('UploadComplete', function(uploader, files) {
                                                App.fn.uploader.complete();
                                            });
                                        }
                                    }
                                });
                            }

                            if(wp.media.view.AttachmentsBrowser) {
                                const attachmentsBrowser = wp.media.view.AttachmentsBrowser;
                                wp.media.view.AttachmentsBrowser = wp.media.view.AttachmentsBrowser.extend({
                                    createToolbar: function () {
                                        App.data.attachmentsBrowser = this;
                                        App.data.mediaBrowse = !!(this.model.attributes.router && this.model.attributes.router == 'browse');
                                        App.fn.updateMediaGridSort();
                                        attachmentsBrowser.prototype.createToolbar.apply(this, arguments);
                                    }
                                });
                            }

                            if(wp.media.view.MediaFrame.EditAttachments) {
                                const editAttachments = wp.media.view.MediaFrame.EditAttachments;
                                wp.media.view.MediaFrame.EditAttachments = wp.media.view.MediaFrame.EditAttachments.extend({
                                    initialize: function () {
                                        App.data.editAttachments = this;
                                        editAttachments.prototype.initialize.apply(this, arguments);
                                    },
                                    updateMediaData: function() {
                                        const _self = App.data.editAttachments;

                                        fetch(_self.model.attributes.url, {cache: 'reload', mode: 'no-cors'}).then(() => {
                                            _self.model.fetch().done(() => {
                                                _self.rerender(_self.model);
                                            });
                                        });
                                    }
                                });
                            }
                        }

                        if($('body').hasClass('upload-php')) {
                            App.fn.ajaxPrefilter();
                            App.fn.loadSidebar();
                        } else if(App.data.media && wp.media.view.Modal) {
                            if(App.data.ticket) {
                                App.fn.ajaxPrefilter();
                            } else {
                                if(wp && wp.blocks) {
                                    App.fn.ajaxPrefilter();
                                }
                            }
                            wp.media.view.Modal.prototype.on('prepare', App.fn.onMediaModalPrepare);
                            wp.media.view.Modal.prototype.on('open', App.fn.onMediaModalOpen);
                            wp.media.view.Modal.prototype.on('close', App.fn.onMediaModalClose);
                        }
                    } else {
                        App.fn.loadSidebar();
                    }
                }
            },
            ajaxPrefilter: () => {
                $.ajaxPrefilter((options, originalOptions, jqXHR) => {
                    if(originalOptions.type === 'POST' && originalOptions.data && originalOptions.data.action == 'query-attachments' && App.data.mediaBrowse) {
                        originalOptions.data = $.extend(originalOptions.data, {mediacommander_mode: 'grid'});
                        options.data = $.param(originalOptions.data);
                    }
                });
            },
            processData: (endpoint, method, data = {}, noLoading, noLock) => {
                const def = $.Deferred();

                !noLoading && App.fn.loading(true, noLock);
                const $ajax = $.ajax({
                    url: App.globals.api.url + '/' + endpoint,
                    type: method == 'GET' ? 'GET' : 'POST',
                    cache: false,
                    dataType: 'json',
                    contentType: 'application/json',
                    headers: { 'X-WP-Nonce': App.globals.api.nonce, 'X-HTTP-Method-Override': method },
                    data: method === 'GET' ? data : JSON.stringify(data)
                }).done((response) => {
                    if(response && response.success) {
                        def.resolve(response.data);
                    } else {
                        def.reject();
                    }
                }).fail(() => {
                    def.reject();
                }).always(() => {
                    !noLoading && App.fn.loading(false);
                });

                return {...def.promise(), abort: $ajax.abort};
            },
            getData: (endpoint, data = {}, noLoading, noLock) => {
                return App.fn.processData(endpoint, 'GET', data, noLoading, noLock);
            },
            createData: (endpoint, data = {}, noLoading, noLock) => {
                return App.fn.processData(endpoint, 'POST', data, noLoading, noLock);
            },
            updateData: (endpoint, data = {}, noLoading, noLock) => {
                return App.fn.processData(endpoint, 'PUT', data, noLoading, noLock);
            },
            deleteData: (endpoint, data = {}, noLoading, noLock) => {
                return App.fn.processData(endpoint, 'DELETE', data, noLoading, noLock);
            },
            loadProposal: () => {
                App.data.hidden = Cookies.get('mcmd-sidebar-hidden') === 'true';
                App.fn.prebuild();
                App.fn.updateWidth();

                App.fn.getData('template', {name: 'proposal'}).done((html) => {
                    App.fn.build(html, true);
                    $.when(
                        App.fn.updateWidth()
                    ).done(() => {
                        App.fn.bind(true);
                        App.fn.ready();
                    });
                });
            },
            loadSidebar: () => {
                App.data.hidden = Cookies.get('mcmd-sidebar-hidden') === 'true';
                App.fn.prebuild();
                App.fn.updateWidth();

                $.when(
                    App.fn.getData('contextmenu'),
                    App.fn.getData('meta', {type: App.globals.data.type}),
                    App.fn.getData('template', {name: 'sidebar'})
                ).done((contextmenu, meta, template) => {
                    App.data.contextmenu.list = contextmenu;
                    App.data.meta = meta;

                    App.fn.build(template);
                    $.when(
                        App.fn.updateWidth(),
                        App.fn.updateFoldersData(),
                        App.fn.updateFoldersAttachCount()
                    ).done(() => {
                        App.fn.updateNoticeAndSearch();
                        App.fn.activateFolder(App.data.meta.folder, true, true);
                        App.fn.collapseFolders(App.data.meta.collapsed);
                        App.fn.initAttachments();
                        App.fn.bind();
                        App.fn.ready();
                    });
                });
            },
            loading: (state, noLock) => {
                if(state) {
                    App.data.loader.counter++;
                    App.data.loader.$spin.toggleClass('mcmd-active', true);
                    App.data.loader.$lock.toggleClass('mcmd-active', !noLock);
                } else {
                    App.data.loader.counter--;
                    if(App.data.loader.counter <= 0) {
                        App.data.loader.$spin.toggleClass('mcmd-active', false);
                        App.data.loader.$lock.toggleClass('mcmd-active', false);
                        App.data.loader.counter = 0;
                    }
                }
            },
            prebuild: () => {
                App.data.loader.$spin = $('<div>').addClass('mcmd-spin');
                App.data.loader.$lock = $('<div>').addClass('mcmd-lock');

                App.data.ui.$container = $('<div>').addClass('mcmd-container').toggleClass('mcmd-hidden', App.data.hidden);
                App.data.ui.$sidebar = $('<div>').addClass('mcmd-sidebar').toggleClass('mcmd-disable-tree-labels', App.globals.data.disable_counter).toggleClass('mcmd-disable-search-bar', App.globals.data.disable_search_bar);
                App.data.ui.$splitter = $('<div>').addClass('mcmd-splitter');
                App.data.ui.$toggle = $('<div>').addClass('mcmd-toggle');
                App.data.ui.$list = $('<div>').addClass('mcmd-list');

                App.data.ui.$minitools = $('<div>').addClass('mcmd-minitools');
                App.data.ui.$minitools.append(App.data.ui.$toggle, App.data.loader.$spin);

                if(!App.data.modal) {
                    const offset = $('#wpadminbar').height();
                    App.data.ui.$sidebar.css({
                        'position': 'sticky',
                        'top': offset + 'px',
                        'height': 'calc(100% - 1px)',
                        'width': App.data.width.current
                    });

                    const $wrap = (() => {
                        for (const wrap of $('#wpbody .wrap')) {
                            if (!$(wrap).is(':empty')) {
                                return $(wrap);
                            }
                        }
                        return null;
                    })();
                    $wrap.wrap(App.data.ui.$list);
                    App.data.ui.$list = $wrap.parent();

                    App.data.ui.$list.wrap(App.data.ui.$container).before(App.data.ui.$sidebar, App.data.ui.$splitter).append(App.data.ui.$minitools);
                    App.data.ui.$container = App.data.ui.$sidebar.parent().addClass('mcmd-screen-type');

                    // preload holders
                    const $ph_toolbar = $('<div>').addClass('mcmd-ph-toolbar');
                    const $ph_panel = $('<div>').addClass('mcmd-ph-panel');
                    const $ph_panel_tree = $('<div>').addClass('mcmd-ph-panel-tree');

                    App.data.ui.$sidebar.append($ph_toolbar, $ph_panel, $ph_panel_tree);
                }
            },
            build: (html, proposal) => {
                App.data.ui.$sidebar.empty().append(html).append(App.data.loader.$lock);
                App.data.ui.$tree = App.data.ui.$sidebar.find('#mcmd-tree');

                if(!proposal) {
                    App.globals.data.default_color && document.documentElement.style.setProperty('--mcmd-default-folder-color', App.globals.data.default_color);
                    !App.globals.data.rights.c && App.data.ui.$sidebar.find('#mcmd-btn-create').remove();
                    App.globals.data.type !== 'attachment' && App.data.ui.$sidebar.find('#mcmd-btn-sort').remove();

                    if (!App.globals.data.rights.c) {
                        App.data.ui.$sidebar.find('#mcmd-toolbar').remove();
                    }
                }

                if(App.data.modal) {
                    const $modal = $('div[id^="__wp-uploader-id-"].supports-drag-drop:visible');

                    App.data.ui.$mediaframe = $(`#${$modal.attr('id')} .media-frame`);
                    App.data.ui.$mediaframe.prepend(App.data.ui.$container.append(App.data.ui.$sidebar));
                    App.data.ui.$mediaframe.find('.media-frame-title').prepend(App.data.ui.$minitools);
                    App.data.ui.$container.addClass('mcmd-modal-type');
                }

                if(!proposal) {
                    const options = {
                        callback: {
                            loading: App.fn.loading,
                            move: App.fn.moveFolders,
                            collapse: App.fn.collapseFolder
                        }
                    }
                    App.data.tree = MEDIACOMMANDER.PLUGINS.TREE('#mcmd-tree', options);
                }

                App.fn.uploader.build();
            },
            bind: (proposal) => {
                App.data.ui.$toggle.on('click', App.fn.onToggleContainer);
                App.data.ui.$splitter.on('mousedown', App.fn.onSplitterMouseDown);

                if(!proposal) {
                    App.data.ui.$sidebar.find('#mcmd-btn-create').on('click', App.fn.onFolderCreate);
                    App.data.ui.$sidebar.find('#mcmd-btn-sort').on('click', App.fn.onFolderSort);
                    App.data.ui.$sidebar.find('#mcmd-search-input').on('input', App.fn.onSearchInput);
                    App.data.ui.$sidebar.find('#mcmd-search-clear').on('click', App.fn.onSearchClear);
                    App.data.ui.$sidebar.on('click', '.mcmd-tree-item', App.fn.onFolderClick);
                    App.data.ui.$sidebar.on('dblclick', '.mcmd-tree-item', App.fn.onFolderDblClick);
                    App.data.ui.$sidebar.on('contextmenu', '.mcmd-tree-item', App.fn.onContextMenu);
                    $(document).ajaxComplete(App.fn.onAjaxComplete);

                    if(App.globals.data.type == 'attachment' && App.globals.data.media_hover_details) {
                        $(document).on('mouseover', '.attachment', App.fn.onShowMediaDetails);
                    }
                }
            },
            ready: () => {
                App.data.ui.$sidebar.addClass('mcmd-active');
                App.data.ui.$splitter.addClass('mcmd-active');
                App.data.ui.$toggle.addClass('mcmd-active');
                App.data.ui.$container.addClass('mcmd-active');
                App.data.ui.$mediaframe && App.data.ui.$mediaframe.toggleClass('mcmd-active', !App.data.hidden);

                App.data.ui.$sidebar.find('#mcmd-toolbar').addClass('mcmd-active');
                App.data.ui.$sidebar.find('#mcmd-panel').addClass('mcmd-active');
            },
            updateMeta: (noLoading) => {
                const folders = App.data.tree.getFlatData();
                const collapsed = folders ? folders.filter(item => item.collapsed).map(item => item.id) : null;
                const meta = {
                    folder: App.data.folder.active,
                    collapsed: collapsed,
                    sort: App.data.meta.sort
                };
                return App.fn.updateData('meta', {type: App.globals.data.type, meta: meta}, noLoading, true);
            },
            updateWidth: (width) => {
                width = width ? width : Cookies.get('mcmd-sidebar-width');
                width = width ? width : 0;
                width = Math.min(Math.max(width, App.data.width.min), App.data.width.max);

                App.data.width.current = width;
                App.data.ui.$sidebar.css({'width': width});
            },
            updateNoticeAndSearch: () => {
                const flag = App.globals.data.rights.c && !(App.data.tree && App.data.tree.hasItems());
                App.data.ui.$sidebar.find('#mcmd-notice-create').toggleClass('mcmd-active', flag);
                App.data.ui.$sidebar.find('#mcmd-search').toggleClass('mcmd-active', !flag);
                App.data.ui.$sidebar.find('#mcmd-panel-tree').toggleClass('mcmd-active', !flag);
            },
            updateMediaGridSort: () => {
                if(App.data.mediaBrowse) {
                    const sort = {orderby: 'date', order: 'DESC'};
                    switch (App.data.meta.sort.items) {
                        case 'name-asc': {
                            sort.orderby = 'title';
                            sort.order = 'ASC';
                        }
                            break;
                        case 'name-desc': {
                            sort.orderby = 'title';
                            sort.order = 'DESC';
                        }
                            break;
                        case 'date-asc': {
                            sort.orderby = 'date';
                            sort.order = 'ASC';
                        }
                            break;
                        case 'date-desc': {
                            sort.orderby = 'date';
                            sort.order = 'DESC';
                        }
                            break;
                        case 'mod-asc': {
                            sort.orderby = 'modified';
                            sort.order = 'ASC';
                        }
                            break;
                        case 'mod-desc': {
                            sort.orderby = 'modified';
                            sort.order = 'DESC';
                        }
                            break;
                        case 'author-asc': {
                            sort.orderby = 'authorName';
                            sort.order = 'ASC';
                        }
                            break;
                        case 'author-desc': {
                            sort.orderby = 'authorName';
                            sort.order = 'DESC';
                        }
                            break;
                    }

                    if (App.data.attachmentsBrowser && App.data.attachmentsBrowser.collection) {
                        App.data.attachmentsBrowser.collection.props.set({
                            orderby: sort.orderby,
                            order: sort.order
                        });
                    }
                }
            },
            updateMediaGridData: () => {
                App.fn.updateMediaGridSort();
                if(App.data.attachmentsBrowser && App.data.attachmentsBrowser.collection) {
                    App.data.attachmentsBrowser.collection.props.set({ignore: + new Date});
                }
            },
            updateListData: (url) => {
                const def = $.Deferred();

                App.fn.loading(true, true);
                const $ajax = $.ajax({
                    method: 'GET',
                    url: url,
                    dataType: 'html'
                }).done((html) => {
                    def.resolve(html);
                }).fail(() => {
                    def.reject();
                }).always(() => {
                    App.fn.loading(false);
                });

                return {...def.promise(), abort: $ajax.abort};
            },
            updateFoldersData: () => {
                return App.fn.getData('folders', {type: App.globals.data.type}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.addItem(folder);
                    }
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            updateFoldersAttachCount: (folders) => {
                if(App.globals.data.disable_counter) {
                    const def = $.Deferred();
                    def.resolve();
                    return def.promise();
                }

                return App.fn.getData('attachment/counters', {type: App.globals.data.type, folders: folders}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.updateItemLabel(folder.id, folder.count);

                        if(folder.id == -1 || folder.id == -2) {
                            App.data.ui.$sidebar.find(`.mcmd-tree-item[data-id='${folder.id}'] .mcmd-tree-label`).toggleClass('mcmd-tree-active', folder.count != 0).text(folder.count);
                        }
                    }
                });
            },
            reinitWordPressStuff: () => {
                window.inlineEditPost && window.inlineEditPost.init();

                if(App.globals.data.type === 'plugins') {
                    const $update_js = $('#updates-js');
                    $update_js.length && $update_js.remove().appendTo('head');
                }
            },
            initAttachments: () => {
                App.data.dragdrop.$ghost = $('<div>').addClass('mcmd-attachment-drag-ghost');

                if(App.data.media) {
                    if (App.globals.data.rights.a) {
                        $('.media-frame .media-frame-content').on('mousedown touchstart', '.attachment', App.fn.onAttachmentDown);
                    }
                } else {
                    App.data.ui.$list.toggleClass('mcmd-can-attach', App.globals.data.rights.a);
                    if (App.globals.data.rights.a) {
                        $('#the-list').on('mousedown touchstart', '.check-column', App.fn.onAttachmentDown);
                    }
                }
            },
            dropAttachments: (folder, attachments) => {
                if(!(folder && App.data.folder.active != folder && attachments && attachments.length)) {
                    return;
                }

                App.fn.updateData('attach',{type: App.globals.data.type, folder: folder, attachments: attachments}).done((folders) => {
                    App.fn.updateFoldersAttachCount(folders);
                    App.fn.activateFolder(App.data.folder.active, false, true);
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            activateFolder: (folder, noAction, force) => {
                if(App.data.folder.active == folder && !force) {
                    return;
                }

                App.data.folder.prev = App.data.folder.active;
                App.data.folder.active = folder;

                App.data.ui.$sidebar.find('.mcmd-tree-item.mcmd-active').removeClass('mcmd-active');
                App.data.ui.$sidebar.find(`.mcmd-tree-item[data-id='${folder}']`).addClass('mcmd-active');

                if(!noAction) {
                    App.data.loader.request && App.data.loader.request.abort();
                    App.data.loader.request = App.fn.updateMeta();
                    App.data.loader.request.done(() => {
                        if(App.data.media) {
                            App.fn.updateMediaGridData();
                        } else {
                            const paged = Url.queryString('paged');
                            if(typeof paged === 'string' || paged instanceof String) {
                                Url.updateSearchParam('paged', '1', false);
                            }

                            if(App.globals.data.disable_ajax) {
                                window.location.reload();
                            } else {
                                App.data.loader.request = App.fn.updateListData(location.href);
                                App.data.loader.request.done((html) => {
                                    const $wrap = (() => {
                                        for(const wrap of $(html).find('#wpbody .wrap')) {
                                            if(!$(wrap).is(':empty')) {
                                                return $(wrap);
                                            }
                                        }
                                        return null;
                                    })();

                                    if($wrap) {
                                        App.data.ui.$list.find('.wrap')[0].innerHTML = $wrap[0].innerHTML;
                                        App.fn.initAttachments();
                                        App.fn.reinitWordPressStuff();
                                    }
                                }).fail(() => {
                                    App.data.loader.request = null;
                                }).always(() => {
                                    App.data.loader.request = null;
                                });
                            }
                        }
                    }).fail(() => {
                        App.data.loader.request = null;
                    }).always(() => {
                    });
                }
            },
            collapseFolders: (folders) => {
                if(!folders || !folders.length) {
                    return;
                }

                for(const folder of folders) {
                    App.data.tree.collapseItem(folder, true);
                }
            },
            createFolders: (names, color, parent) => {
                if(!(names && names.length))
                    return;

                App.fn.createData('folders',{type: App.globals.data.type, names: names, color: color, parent: parent}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.addItem({id: folder.id, title: folder.title, color: folder.color}, parent);
                    }
                    App.fn.updateNoticeAndSearch();
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            renameFolder: (folder, name) => {
                App.fn.updateData('folders', {type: App.globals.data.type, action: 'rename', folders: [folder], name: name}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.updateItemTitle(folder, name);
                    }
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            colorFolders: (folders, color) => {
                if(!(folders && folders.length)) {
                    return;
                }

                App.fn.updateData('folders',{type: App.globals.data.type, action: 'color', folders: folders, color: color}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.updateItemColor(folder, color);
                    }
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            moveFolders: function(folders, parent, target, targetItems, type, callback) {
                const self = this;

                let sorting = [];
                switch(type) {
                    case 'before': {
                        sorting = JSON.parse(JSON.stringify(targetItems));
                        sorting = sorting.filter((item) => !folders.includes(item));
                        sorting.splice(sorting.indexOf(target), 0, ...folders);
                    } break;
                    case 'after': {
                        sorting = JSON.parse(JSON.stringify(targetItems));
                        sorting = sorting.filter((item) => !folders.includes(item));
                        sorting.splice(sorting.indexOf(target)+1, 0, ...folders);
                    } break;
                    case 'inside': {
                        if(App.data.ticket) {
                            sorting = targetItems.concat(folders);
                        } else {
                            App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                            return;
                        }
                    } break;
                }

                App.fn.updateData('folders',{type: App.globals.data.type, action: 'move', folders: folders, parent: parent, sorting: sorting}).done((folders) => {
                    if(callback && typeof callback == 'function') {
                        callback.call(self, folders, target, type);
                    }
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            collapseFolder: function() {
                App.data.loader.request && App.data.loader.request.abort();
                App.data.loader.request = App.fn.updateMeta(true);
                App.data.loader.request.always(() => {
                    App.data.loader.request = null;
                });
            },
            copyFolders: (src, dst) => {
                App.fn.createData('copyfolder', {type: App.globals.data.type, src: src, dst: dst}).done((folders) => {
                    for(const folder of folders) {
                        App.data.tree.addItem(folder, folder.parent);
                    }
                    App.fn.updateNoticeAndSearch();
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            deleteFolders: (folders) => {
                if(!(folders && folders.length)) {
                    return;
                }

                App.fn.deleteData('folders', {type: App.globals.data.type, folders: folders}).done((folders) => {
                    let refresh = false;
                    for (const folder of folders) {
                        App.data.tree.removeItem(folder);

                        if (!refresh && App.data.folder.active == folder) {
                            refresh = true;
                        }

                        if (App.data.folder.copy == folder) {
                            App.data.folder.copy = null;
                        }
                    }
                    App.fn.updateNoticeAndSearch();
                    App.fn.updateFoldersAttachCount();

                    if(App.data.folder.active < 0) {
                        App.fn.activateFolder(App.data.folder.active, false, true);
                    } else if(refresh) {
                        App.fn.activateFolder(-1);
                    }
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            downloadFolders: (folders) => {
                if(!(folders && folders.length)) {
                    return;
                }

                App.fn.getData('folders/download/url',{type: App.globals.data.type, folders: folders}).done((url) => {
                    window.open(url, '_blank');
                }).fail(() => {
                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                });
            },
            filterFolders: (str) => {
                clearTimeout(App.data.filter.timerId);
                App.data.filter.timerId = setTimeout(() => {
                    App.data.tree.filter(str);
                }, 500);
            },
            onToggleContainer: () => {
                App.data.hidden = !App.data.hidden;
                App.data.ui.$container.toggleClass('mcmd-hidden', App.data.hidden);
                App.data.ui.$mediaframe && App.data.ui.$mediaframe.toggleClass('mcmd-active', !App.data.hidden);
                Cookies.set('mcmd-sidebar-hidden', App.data.hidden);
            },
            onSplitterMouseDown: (e) => {
                e.preventDefault();
                e.stopImmediatePropagation();

                App.data.splitter.cursor.startWidth = App.data.width.current;
                App.data.splitter.cursor.start = App.data.splitter.prev = App.data.splitter.cursor.current = e.pageX;

                $(window).on('mousemove', App.fn.onSplitterMouseMove);
                $(window).on('mouseup', App.fn.onSplitterMouseUp);
            },
            onSplitterMouseMove: (e) => {
                App.data.splitter.cursor.prev = App.data.splitter.cursor.current;
                App.data.splitter.cursor.current = e.pageX;

                App.data.width.current = App.data.splitter.cursor.startWidth + (App.data.splitter.cursor.current - App.data.splitter.cursor.start);

                Cookies.set('mcmd-sidebar-width', App.data.width.current);
                App.fn.updateWidth(App.data.width.current);
            },
            onSplitterMouseUp: () => {
                $(window).off('mousemove', App.fn.onSplitterMouseMove);
                $(window).off('mouseup', App.fn.onSplitterMouseUp);
            },
            onFolderCreate: () => {
                if(!App.globals.data.rights.c) {
                    return;
                }

                const $form = $('#mcmd-form-create');

                if($form.hasClass('mcmd-active')) {
                    $form.removeClass('mcmd-active');
                    return;
                }

                function close() {
                    $form.removeClass('mcmd-active');
                }

                $('#mcmd-form-sort').removeClass('mcmd-active');

                const $folderName = $form.find('#mcmd-folder-name');
                const $folderParent = $form.find('#mcmd-folder-parent');
                const $folderColor = $form.find('#mcmd-folder-color');

                $folderName.val('');
                App.colorpicker.set($folderColor, null);

                $folderParent.off().empty().append($('<option>').val(0).text(App.globals.msg.parent_folder));

                const data = App.data.tree.getFlatData();
                for (const key in data) {
                    const folder = data[key];
                    if(App.data.ticket) {
                        $folderParent.append($('<option>').val(folder.id).html('&nbsp;&nbsp;'.repeat(folder.level) + folder.title).prop('selected', folder.id === App.data.folder.active));
                    } else {
                        $folderParent.append($('<option>').val(folder.id).html('&nbsp;&nbsp;'.repeat(folder.level) + folder.title));
                    }
                }

                if(!App.data.ticket) {
                    $folderParent.change((e) => {
                        e.target.selectedIndex = 0;
                        App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                    });
                }

                $form.off('click');
                $form.one('click', '.mcmd-close', () => {
                    close();
                });
                $form.one('click', '.mcmd-submit', () => {
                    const folderNames = $folderName.val().split(',').map(s => s.trim());
                    const folderParent = $folderParent.val();
                    const folderColor = App.colorpicker.get($folderColor);

                    App.fn.createFolders(folderNames, folderColor, folderParent);
                    close();
                });
                $form.addClass('mcmd-active');
            },
            onFolderCreateBuiltin: (parent) => {
                if(!App.globals.data.rights.c) {
                    return;
                }

                const $parent = App.data.ui.$tree.find(`.mcmd-tree-item[data-id=${parent}]`);

                if(!$parent.length) {
                    return;
                }

                const $nodes = $('<div>').addClass('mcmd-tree-nodes');
                const $node = $('<div>').addClass('mcmd-tree-node');
                const $item = $('<div>').addClass('mcmd-tree-item mcmd-tree-edited');
                const $icon = $('<div>').addClass('mcmd-tree-icon').append(App.data.tree.getIcon());
                const $edit = $('<div>').addClass('mcmd-tree-edit').attr({'id':'mcmd-tree-edit'});
                const $input = $('<input>').addClass('mcmd-tree-input').attr({'spellcheck':'false','autocomplete':'off'});
                const $enter = $('<div>').addClass('mcmd-tree-btn-enter');

                App.data.tree.toggleDragDrop(false);
                function close() {
                    $nodes.remove();
                    App.data.tree.toggleDragDrop(true);
                }

                $parent.parent().append($nodes.append($node.append($item.append($icon, $edit.append($input, $enter)))));

                $input.focus().val(App.globals.msg.new_folder)
                .one('blur', () => {
                    close();
                })
                .on('keyup', (e) => {
                    if(e.keyCode == 13 || e.keyCode == 27) {
                        close();

                        if(e.keyCode == 13) {
                            const folderNames = $input.val().split(',').map(s => s.trim());
                            App.fn.createFolders(folderNames, null, parent);
                        }
                    }
                });
            },
            onFolderCopy: (folder) => {
                App.data.folder.copy = folder;
            },
            onFolderPaste: (folder) => {
                if(App.data.folder.copy == null) {
                    return;
                }
                App.fn.copyFolders(App.data.folder.copy, folder);
            },
            onFolderDelete: (folders) => {
                const $modal = $('<div>').addClass('mcmd-modal');
                const $form = $('#mcmd-form-delete').clone();
                function close() {
                    $modal.remove();
                }

                $form.off('click');
                $form.one('click', '.mcmd-close', () => {
                    close();
                });
                $form.one('click', '.mcmd-submit', () => {
                    App.fn.deleteFolders(folders.map(s => s.id));
                    close();
                });
                $('body').append($modal.append($form));

                setTimeout(() => {
                    $modal.addClass('mcmd-active');
                    $form.addClass('mcmd-active');
                });
            },
            onFolderDownload: (folders) => {
                App.fn.downloadFolders(folders.map(s => s.id));
            },
            onFolderSort: () => {
                const $form = $('#mcmd-form-sort');

                if($form.hasClass('mcmd-active')) {
                    $form.removeClass('mcmd-active');
                    return;
                }

                $('#mcmd-form-create').removeClass('mcmd-active');

                let sort = App.data.meta.sort.items;
                sort && $form.find(`.mcmd-sort-types [data="${sort}"]`).addClass('mcmd-active');

                $form.find('.mcmd-sort-type').off().on('click', (e) => {
                    if(App.data.ticket) {
                        const $el = $(e.target);
                        const data = $el.attr('data');

                        $form.find('.mcmd-sort-type').removeClass('mcmd-active');

                        $el.toggleClass('mcmd-active', sort !== data);
                        sort = sort === data ? null : data;

                        if (App.data.meta.sort.items !== sort) {
                            App.data.meta.sort.items = sort;

                            App.data.loader.request && App.data.loader.request.abort();
                            App.data.loader.request = App.fn.updateMeta();
                            App.data.loader.request.always(() => {
                                App.data.loader.request = null;
                                App.fn.activateFolder(App.data.folder.active, false, true);
                            });
                        }
                    } else {
                        App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                    }
                });
                $form.off('click');
                $form.one('click', '.mcmd-close', () => {
                    $form.removeClass('mcmd-active');
                });
                $form.addClass('mcmd-active');
            },
            onFolderClick: (e) => {
                clearTimeout(App.data.click.timerId);
                if(!e.shiftKey && !e.ctrlKey && !$(e.target).hasClass('mcmd-tree-toggle') && e.detail === 1) {
                    const $item = $(e.currentTarget);

                    if(!$item.hasClass('mcmd-tree-edited')) {
                        App.data.click.folder = $item.attr('data-id');
                        App.data.click.timerId = setTimeout(App.fn.onFolderClickAction, 300);
                    }
                }
            },
            onFolderClickAction: () => {
                App.data.click.timerId = null;

                const folder = App.data.click.folder;
                if(folder == -1 || folder == -2) {
                    App.data.tree.clearSelection();
                }
                App.fn.activateFolder(folder);
            },
            onFolderDblClick: (e) => {
                if(!App.globals.data.rights.e) {
                    return;
                }

                e.preventDefault();
                const $item = $(e.currentTarget);
                const folderId = $item.attr('data-id');
                const folder = App.data.tree.getItem(folderId);

                if(!folder || $item.hasClass('mcmd-tree-edited')) {
                    return;
                }

                const $edit = $('<div>').addClass('mcmd-tree-edit').attr({'id':'mcmd-tree-edit'});
                const $input = $('<input>').addClass('mcmd-tree-input').attr({'spellcheck':'false','autocomplete':'off'});
                const $enter = $('<div>').addClass('mcmd-tree-btn-enter');

                App.data.tree.toggleDragDrop(false);
                function close() {
                    $edit.remove();
                    $item.removeClass('mcmd-tree-edited');
                    App.data.tree.toggleDragDrop(true);
                }

                $item.append($edit.append($input, $enter)).addClass('mcmd-tree-edited');
                $input.focus().val(folder.title)
                .one('blur', () => {
                        close();
                    })
                .on('keyup', (e) => {
                        if(e.keyCode == 13 || e.keyCode == 27) {
                            close();

                            if(e.keyCode == 13) {
                                const folderName = $input.val();
                                $item.find('.mcmd-tree-title').text(folderName);
                                App.fn.renameFolder(folder.id, folderName);
                            }
                        }
                    });
            },
            onContextMenu: (e) => {
                if(!App.globals.data.rights.c && !App.globals.data.rights.e && !App.globals.data.rights.d) {
                    return;
                }

                const $folder = $(e.currentTarget);
                const folderId = $folder.attr('data-id');

                if(folderId == -1 || folderId == -2) {
                    return;
                }

                const folder = App.data.tree.getItem(folderId);
                if(!folder.state.selected) {
                    App.data.tree.clearSelection();
                    App.data.tree.selectItem(folderId, true);
                }

                e.preventDefault();

                const folders = App.data.tree.getSelectedItems();
                const $menu = $('<div>').addClass('mcmd-contextmenu').attr({'tabindex':-1});
                const $body = $('body');

                const close = () => {
                    $menu.remove();
                    App.data.tree.clearSelection();
                }
                const color_callback = (color) => {
                    App.fn.colorFolders(folders.map(s => s.id), color);
                    close();
                }

                for(const item of App.data.contextmenu.list) {
                    if( (!App.globals.data.rights.c && item.right == 'c') ||
                        (!App.globals.data.rights.v && item.right == 'v') ||
                        (!App.globals.data.rights.e && item.right == 'e') ||
                        (!App.globals.data.rights.d && item.right == 'd')) {
                        continue;
                    }

                    if(App.globals.data.type !== 'attachment' && item.id == 'download') {
                       continue;
                    }

                    const $item = $('<div>').addClass('mcmd-item').attr({'data-id':item.id});
                    const $icon = $('<div>').addClass('mcmd-icon').html(item.icon);
                    const $title = $('<div>').addClass('mcmd-title').text(item.title);
                    $menu.append($item.append($icon, $title));

                    switch(item.id) {
                        case 'create': {
                            $menu.append($('<div>').addClass('mcmd-splitter'));
                        } break;
                        case 'color': {
                            const $submenu = $('<div>').addClass('mcmd-submenu');
                            const colorpicker = new MEDIACOMMANDER.PLUGINS.COLORPICKER(folder.color, $submenu, color_callback);

                            $item.append($submenu);
                            $item.on('mouseover mouseout', (e) => {
                                $submenu.toggleClass('mcmd-active', e.type == 'mouseover');
                                e.type !== 'mouseover' && $menu.focus();
                            });
                        } break;
                        case 'paste': {
                            $item.toggleClass('mcmd-disabled', App.data.folder.copy == null);
                        } break;
                        case 'delete': {
                            $item.addClass('mcmd-alert');
                        } break;
                    }
                }

                e = e.originalEvent;
                const top = e.clientY;
                const left = e.clientX;

                $menu.css({
                    'top':top,
                    'left':left
                }).on('blur', (e) => {
                    if(!e.currentTarget.contains(e.relatedTarget)) {
                        close();
                    }
                }).on('click', '.mcmd-item', (e) => {
                    const $item = $(e.target);
                    const id = $item.data('id');
                    switch(id) {
                        case 'create': {
                            if(App.data.ticket) {
                                App.fn.onFolderCreateBuiltin(folderId);
                            } else {
                                App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                            }
                            close();
                        } break;
                        case 'rename': {
                            $folder.dblclick();
                            close();
                        } break;
                        case 'copy': {
                            if(App.data.ticket) {
                                App.fn.onFolderCopy(folderId);
                            } else {
                                App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                            }
                            close();
                        } break;
                        case 'paste': {
                            if(App.data.ticket) {
                                App.fn.onFolderPaste(folderId);
                            } else {
                                App.notify.show(App.globals.msg.upgrade, 'mcmd-upgrade');
                            }
                            close();
                        } break;
                        case 'delete': {
                            App.fn.onFolderDelete(folders);
                            close();
                        } break;
                        case 'download': {
                            App.fn.onFolderDownload(folders);
                            close();
                        } break;
                    }
                });

                $body.append($menu);
                $menu.focus();
            },
            onSearchInput: (e) => {
                App.fn.filterFolders(e.target.value);
            },
            onSearchClear: () => {
                $('#mcmd-search-input').val('');
                App.fn.filterFolders();
            },
            onAttachmentFolderEnter: (e) => {
                App.data.dragdrop.$target = $(e.currentTarget).addClass('mcmd-droppable');
            },
            onAttachmentFolderLeave: () => {
                App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass('mcmd-droppable');
                App.data.dragdrop.$target = null;
            },
            onAttachmentFolderUnderPointer: (e) => {
                const $element = $(document.elementFromPoint(e.originalEvent.touches[0].clientX, e.originalEvent.touches[0].clientY));
                const $target = $element.closest('.mcmd-tree-item');

                App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass('mcmd-droppable');
                App.data.dragdrop.$target = null;

                if($target.length) {
                    App.data.dragdrop.$target = $target.addClass('mcmd-droppable');
                }
            },
            onAttachmentDown: (e) => {
                const isTouch = e.type === 'touchstart' && e.originalEvent.touches && e.originalEvent.touches.length == 1;
                if(e.which === 1 || isTouch) {  // left mouse button click or one touch event
                    if(App.data.media) {
                        if (App.data.mediaBrowse) {
                            !isTouch && e.preventDefault();
                            !isTouch && e.stopImmediatePropagation();

                            const items = [];
                            $('.media-frame .media-frame-content .attachment[aria-checked="true"]').each(function () {
                                items.push($(this).attr('data-id'));
                            });

                            if (items.length == 0) {
                                items.push($(e.currentTarget).attr('data-id'));
                            }

                            if (items.length) {
                                App.data.dragdrop.isTouch = isTouch;
                                App.data.dragdrop.items = items;
                                App.data.dragdrop.$ghost.text('Move ' + items.length + ' items').appendTo('body');

                                if (isTouch) {
                                    document.addEventListener('touchmove', App.fn.onTouchMove, {passive: false});

                                    $(window).on('touchmove', App.fn.onAttachmentFolderUnderPointer);
                                    $(window).on('touchmove', App.fn.onAttachmentMove);
                                    $(window).on('touchend', App.fn.onAttachmentUp);
                                } else {
                                    App.data.ui.$sidebar.on('mouseenter', '.mcmd-tree-item', App.fn.onAttachmentFolderEnter);
                                    App.data.ui.$sidebar.on('mouseleave', '.mcmd-tree-item', App.fn.onAttachmentFolderLeave);

                                    $(window).on('mousemove', App.fn.onAttachmentMove);
                                    $(window).on('mouseup', App.fn.onAttachmentUp);
                                }
                            }
                        }
                    } else {
                        !isTouch && e.preventDefault();
                        !isTouch && e.stopImmediatePropagation();

                        const items = [];

                        let name = 'post';
                        switch(App.globals.data.type) {
                            case 'attachment': name = 'media'; break;
                            case 'users': name = 'users'; break;
                            case 'plugins': name = 'checked'; break;
                        }

                        $(`#the-list input[name='${name}[]']:checked`).each(function () {
                            items.push($(this).val());
                        });

                        if(items.length == 0) {
                            items.push($(e.currentTarget).find('input').val());
                        }

                        if(items.length) {
                            App.data.dragdrop.isTouch = isTouch;
                            App.data.dragdrop.items = items;
                            App.data.dragdrop.$ghost.text('Move ' + items.length + ' items').appendTo('body');

                            if(isTouch) {
                                document.addEventListener('touchmove', App.fn.onTouchMove, {passive: false});

                                $(window).on('touchmove', App.fn.onAttachmentFolderUnderPointer);
                                $(window).on('touchmove', App.fn.onAttachmentMove);
                                $(window).on('touchend', App.fn.onAttachmentUp);
                            } else {
                                App.data.ui.$sidebar.on('mouseenter', '.mcmd-tree-item', App.fn.onAttachmentFolderEnter);
                                App.data.ui.$sidebar.on('mouseleave', '.mcmd-tree-item', App.fn.onAttachmentFolderLeave);

                                $(window).on('mousemove', App.fn.onAttachmentMove);
                                $(window).on('mouseup', App.fn.onAttachmentUp);
                            }
                        }
                    }
                }
            },
            onAttachmentMove: (e) => {
                if(App.data.dragdrop.items && App.data.dragdrop.items.length) {
                    e = App.data.dragdrop.isTouch ? e.originalEvent.touches[0] : e;
                    App.data.dragdrop.$ghost.addClass('mcmd-active').css({
                        top: e.clientY + 5 + 'px',
                        left: e.clientX + 5 + 'px'
                    });
                }
            },
            onAttachmentUp: () => {
                const folder = App.data.dragdrop.$target ? App.data.dragdrop.$target.attr('data-id') : null;
                const items = App.data.dragdrop.items;

                App.data.dragdrop.$ghost.text('').removeClass('mcmd-active').detach();
                App.data.dragdrop.$target && App.data.dragdrop.$target.removeClass('mcmd-droppable');
                App.data.dragdrop.$target = null;
                App.data.dragdrop.items = null;

                clearTimeout(App.data.dragdrop.timerId);
                App.data.dragdrop.timerId = null;

                if(App.data.dragdrop.isTouch) {
                    document.removeEventListener('touchmove', App.fn.onTouchMove, {passive: false});

                    $(window).off('touchmove', App.fn.onAttachmentFolderUnderPointer);
                    $(window).off('touchmove', App.fn.onAttachmentMove);
                    $(window).off('touchend', App.fn.onAttachmentUp);
                } else {
                    App.data.ui.$sidebar.off('mouseenter', '.mcmd-tree-item', App.fn.onAttachmentFolderEnter);
                    App.data.ui.$sidebar.off('mouseleave', '.mcmd-tree-item', App.fn.onAttachmentFolderLeave);

                    $(window).off('mousemove', App.fn.onAttachmentMove);
                    $(window).off('mouseup', App.fn.onAttachmentUp);
                }

                App.fn.dropAttachments(folder, items);
            },
            onMediaModalPrepare: () => {
            },
            onMediaModalOpen: () => {
                if(App.data.modal) {
                    return;
                }
                App.data.modal = true;

                if(App.data.ticket) {
                    App.fn.loadSidebar();
                } else {
                    wp && wp.blocks ? App.fn.loadSidebar() : App.fn.loadProposal();
                }
            },
            onMediaModalClose: () => {
                App.data.modal = false;
                App.data.ui.$container && App.data.ui.$container.remove();
                App.data.ui.$minitools && App.data.ui.$minitools.remove();
                App.data.ui.$mediaframe && App.data.ui.$mediaframe.removeClass('mcmd-active');
            },
            onAjaxComplete: (e, request, options) => {
                if(options.data != undefined && typeof options.data == 'string' && options.data.indexOf('action=delete-post') > -1) {
                    const folders = App.data.tree.getFlatData();
                    const folders_to_refresh = folders ? folders.map(item => item.id) : null;

                    App.fn.activateFolder(App.data.folder.active, false, true);
                    App.fn.updateFoldersAttachCount(folders_to_refresh);
                    App.fn.updateNoticeAndSearch();
                }
            },
            onShowMediaDetails: (e) => {
                const $target = $(e.target);
                if(!$target.hasClass('mcmd-has-preview-details')) {
                    const dataId = $target.attr('data-id');
                    if(dataId) {
                        const attachment = window.wp.media.attachment(dataId);
                        if(attachment.attributes && attachment.attributes.preview_details) {
                            $target.addClass('mcmd-has-preview-details');
                            $('.attachment[data-id=' + dataId + '] .attachment-preview').prepend(attachment.attributes.preview_details);
                        }
                    }
                }
            },
            onTouchMove: (e) => {
                e.preventDefault();
                clearTimeout(App.data.dragdrop.timerId);

                const offset = 30;
                if(e.touches[0].clientY < offset) {
                    App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null,-window.innerHeight / 5), 150);
                } else if(e.touches[0].clientY > window.innerHeight - offset) {
                    App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null, window.innerHeight / 5), 150);
                }
            },
            scroll: (offset) => {
                // emulate scrolling for touch devices
                window.scrollBy({top: offset, behavior: 'smooth'});
                App.data.dragdrop.timerId = setTimeout(App.fn.scroll.bind(null, offset), 150);
            },
            formatBytes: (bytes) => {
                const units = ['bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
                let l = 0, n = parseInt(bytes, 10) || 0;

                while(n >= 1024 && ++l) {
                    n = n/1024;
                }

                return(n.toFixed(n < 10 && l > 0 ? 1 : 0) + ' ' + units[l]);
            },
            uploader: {
                build: () => {
                    App.data.uploader.$container = $('<div>').addClass('mcmd-uploader');
                    App.data.uploader.$header = $('<div>').addClass('mcmd-header').text('Upload');
                    App.data.uploader.$title = $('<div>').addClass('mcmd-title');
                    App.data.uploader.$count = $('<div>').addClass('mcmd-count');
                    App.data.uploader.$close = $('<div>').addClass('mcmd-close').html('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d=" M 7.734 6.281 L 6.328 7.688 L 10.609 11.969 L 6.266 16.313 L 7.672 17.719 L 12.016 13.375 L 16.328 17.688 L 17.734 16.281 L 13.422 11.969 L 17.672 7.719 L 16.266 6.313 L 12.016 10.563 L 7.734 6.281 Z "></path></svg>');
                    App.data.uploader.$data = $('<div>').addClass('mcmd-data');
                    App.data.uploader.$container.append(App.data.uploader.$header.append(App.data.uploader.$title, App.data.uploader.$count, App.data.uploader.$close), App.data.uploader.$data);

                    App.data.ui.$container.append(App.data.uploader.$container);

                    App.data.uploader.$close.on('click', App.fn.uploader.close);
                },
                open: () => {
                    App.data.uploader.$container.addClass('mcmd-active');
                },
                close: () => {
                    App.data.uploader.$container.removeClass('mcmd-active');
                    App.data.uploader.$close.removeClass('mcmd-active');
                    App.data.uploader.$data.empty();

                    const unloaded = App.data.uploader.list.filter(item => !item.loaded).length;
                    if(unloaded) {
                        App.data.uploader.instance.stop();
                        App.fn.uploader.complete();
                    }
                    App.data.uploader.list = [];
                },
                complete: () => {
                    const folders = App.data.uploader.list.map(item => (item.folder)).filter((item, index, a) => a.indexOf(item) == index);
                    App.fn.activateFolder(App.data.folder.active, false, true);
                    App.fn.updateFoldersAttachCount(folders);
                    App.fn.updateNoticeAndSearch();
                },
                addFile: (file) => {
                    const item = {
                        id: file.id,
                        folder: file._folder,
                        loaded: false
                    }
                    App.data.uploader.list.push(item);

                    const folder = App.data.tree.getItem(file._folder);
                    const $item = $('<div>').addClass('mcmd-item').attr({'data-id': file.id});
                    const $title = $('<div>').addClass('mcmd-title').text(file.name);
                    const $size = $('<div>').addClass('mcmd-info').text(App.fn.formatBytes(file.size) + (folder ? ' [' + folder.title + ']' : ''));

                    App.data.uploader.$data.prepend($item.append($title, $size));
                },
                completeFile: (file) => {
                    const $item = App.data.uploader.$data.find(`.mcmd-item[data-id="${file.id}"]`);
                    $item.addClass('mcmd-loaded');

                    for(const item of App.data.uploader.list) {
                        if(item.id === file.id) {
                            item.loaded = true;
                            break;
                        }
                    }
                    App.fn.uploader.updateHeader();
                },
                updateHeader: () => {
                    const loaded = App.data.uploader.list.filter(item => item.loaded).length;
                    App.data.uploader.$count.text(`${loaded} / ${App.data.uploader.list.length}`);
                }
            },
            replacemedia: {
                open: (btn) => {
                    const modal = {
                        data: {
                            $modal: $('<div>').addClass('mcmd-modal'),
                            $form: $('#mcmd-form-replace-media').clone(),
                            attachment: $(btn).attr('data-attachment-id'),
                            file: null
                        },
                        fn: {
                            build: () => {
                                modal.data.$fileDropZone = modal.data.$form.find('.mcmd-file-drop-zone');
                                modal.data.$fileUpload = modal.data.$form.find('.mcmd-file-upload');
                                modal.data.$imagePreview = modal.data.$form.find('.mcmd-image-preview');
                                modal.data.$fileSelect = modal.data.$form.find('.mcmd-file-select');
                                modal.data.$fileSubmit = modal.data.$form.find('.mcmd-btn.mcmd-submit');
                                modal.data.$loader = modal.data.$form.find('.mcmd-loader');

                                $('body').append(modal.data.$modal.append(modal.data.$form));

                                setTimeout(() => {
                                    modal.data.$modal.addClass('mcmd-active');
                                    modal.data.$form.addClass('mcmd-active');
                                });
                            },
                            bind: () => {
                                modal.data.$form.on('click', '.mcmd-close', modal.fn.close);
                                modal.data.$form.on('click', '.mcmd-submit', modal.fn.submit);
                                modal.data.$modal.on('dragenter dragover drop', () => { return false; });

                                modal.data.$fileUpload.on('change', modal.fn.selectFile);
                                modal.data.$fileSelect.on('click', () => { modal.data.$fileUpload.click() } );

                                const xhr = new XMLHttpRequest();
                                if (xhr.upload) {
                                    modal.data.$fileDropZone.on('dragover dragleave', modal.fn.dragHover);
                                    modal.data.$fileDropZone.on('drop', modal.fn.selectFile);
                                }
                            },
                            loading: (state) => {
                                modal.data.$loader.toggleClass('mcmd-active', state);
                            },
                            dragHover: (e) => {
                                if(!e.currentTarget.contains(e.relatedTarget)) {
                                    modal.data.$fileDropZone.toggleClass('mcmd-hover', e.type === 'dragover');
                                }
                                return false;
                            },
                            selectFile: (e) => {
                                modal.data.file = null;
                                modal.data.$fileSubmit.addClass('mcmd-hidden');

                                modal.fn.dragHover(e);

                                const files = e.originalEvent.target.files || e.originalEvent.dataTransfer.files;
                                if (files.length == 1) {
                                    const file = files[0];
                                    const flag = (/\.(?=gif|jpg|png|jpeg)/gi).test(file.name);
                                    if (flag) {
                                        modal.data.file = file;
                                        modal.data.$fileDropZone.addClass('mcmd-preview');
                                        modal.data.$imagePreview.get(0).src = URL.createObjectURL(modal.data.file);
                                        modal.data.$fileSubmit.removeClass('mcmd-hidden');
                                    } else {
                                        modal.data.$fileDropZone.removeClass('mcmd-preview');
                                        modal.data.$fileDropZone.get(0).reset();
                                    }
                                } else {
                                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                                }
                            },
                            show: () => {
                                modal.fn.build();
                                modal.fn.bind();
                            },
                            close: () => {
                                modal.data.$modal.remove();
                            },
                            submit: () => {
                                if (modal.data.file == null) {
                                    return;
                                }

                                const formData = new FormData();
                                formData.append('file', modal.data.file);
                                formData.append('attachment', modal.data.attachment);

                                modal.fn.loading(true);
                                $.ajax({
                                    url: App.globals.api.url + '/' + 'replace-media',
                                    type: 'POST',
                                    data: formData,
                                    processData: false,
                                    contentType: false,
                                    headers: { 'X-WP-Nonce': App.globals.api.nonce },
                                }).done((response) => {
                                    if(response && response.success) {
                                        modal.fn.close();
                                        App.notify.show(App.globals.msg.success, 'mcmd-success');
                                        App.fn.activateFolder(App.data.folder.active, false, true);
                                        App.data.editAttachments && App.data.editAttachments.updateMediaData();
                                    } else {
                                        App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                                    }
                                }).fail(() => {
                                    App.notify.show(App.globals.msg.failed, 'mcmd-failed');
                                }).always(() => {
                                    modal.fn.loading(false);
                                });
                            }
                        }
                    }
                    modal.fn.show();
                }
            }
        }
    }

    $(() => {
        App.fn.run();
    });

    window.MEDIACOMMANDER = window.MEDIACOMMANDER ? window.MEDIACOMMANDER : {};
    window.MEDIACOMMANDER.APP = App;
})(jQuery);