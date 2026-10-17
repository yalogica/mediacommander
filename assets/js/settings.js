!function($) {
  "use strict";
  const UTILS_clone = obj => JSON.parse(JSON.stringify(obj)), UTILS_guid = () => ([ 1e7 ] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c => (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)), TYPES_TABLE = {
    loading: false,
    checked: false,
    selected: null,
    items: [],
    view: {
      page: 1,
      perpage: 7,
      first: 0,
      last: 0,
      total: 0
    },
    order: {
      column: null,
      type: null
    }
  }, App = {
    alight: null,
    scope: null,
    ui: {
      loader: {
        count: 0,
        timerId: null,
        $container: null
      },
      tabs: {
        items: [ "general", "permissions", "tools", "gopro" ],
        selected: 0,
        zindex: 4,
        fn: {
          is: tab => App.ui.tabs.selected >= 0 && App.ui.tabs.selected < App.ui.tabs.items.length && App.ui.tabs.items[App.ui.tabs.selected] == tab,
          click: (el, tab) => {
            App.ui.tabs.items[App.ui.tabs.selected] !== tab && ($(el).css({
              "z-index": App.ui.tabs.zindex++
            }), App.ui.tabs.selected = App.ui.tabs.items.indexOf(tab));
          }
        }
      }
    },
    default: {
      config: {
        default_color: null,
        enable_links: true,
        disable_counter: false,
        disable_ajax: false,
        infinite_scrolling: false,
        disable_search_bar: false,
        replace_media: false,
        uninstall_fully: false,
        media_hover_details: false,
        media_hover_details_list: []
      },
      securityprofiles: {
        profile: {
          id: null,
          owner: {
            type: null,
            id: null,
            title: null
          },
          access_type: {
            id: null,
            title: null
          },
          actions: {
            create: false,
            view: true,
            edit: false,
            delete: false,
            attach: false
          }
        }
      }
    },
    data: {
      isPro: false,
      ready: false,
      roles: [],
      media_hover_details: [],
      config: null,
      accessroles: [],
      foldertypes: UTILS_clone(TYPES_TABLE),
      securityprofiles: UTILS_clone(TYPES_TABLE),
      export: {
        filename: null,
        url: null
      },
      import: {
        file: null,
        clear: false,
        attachments: false,
        plugins: null
      }
    },
    modal: {
      $container: null,
      templates: {},
      fn: {
        show: (modalName, modalData, callback) => {
          function show(html, modalData, callback) {
            modalData.guid = modalData.guid ? modalData.guid : UTILS_guid();
            const $modal = $(html).attr({
              "data-modal-name": modalName,
              "data-modal-guid": modalData.guid
            });
            App.modal.$container.append($modal), feather.replace({
              "stroke-width": 2,
              width: 22,
              height: 22
            }), modalData.scope = App.alight($modal.get(0), {
              App: App,
              Modal: modalData
            }), $("body").addClass("mcmd-modal-active");
            const _self = this;
            setTimeout(() => {
              $modal.addClass("mcmd-active"), callback && callback.call(_self);
            }, 100);
          }
          App.modal.templates[modalName] ? show(App.modal.templates[modalName], modalData, callback) : App.fn.getData("template", {
            name: modalName
          }).done(html => {
            App.modal.templates[modalName] = html, show(App.modal.templates[modalName], modalData, callback);
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          });
        },
        close: modalData => {
          $(`[data-modal-guid='${modalData.guid}']`).removeClass("mcmd-active").remove(), 
          0 == $(".mcmd-modals").children().length && $("body").removeClass("mcmd-modal-active"), 
          modalData.scope.destroy(), modalData.scope = null;
        }
      }
    },
    fn: {
      isLicenseActive: () => true === App.globals.data.is_licensed,
      init: () => {
        App.notify = new MEDIACOMMANDER.PLUGINS.NOTIFY, App.colorpicker = new MEDIACOMMANDER.PLUGINS.COLORPICKER;
        const $app = $("#mcmd-app-settings");
        $app.removeAttr("style"), App.fn.initDefaults(), App.fn.build(), $.when(App.fn.config.load(), App.fn.foldertypes.load(), App.fn.securityprofiles.load()).done(() => {
          $app.addClass("mcmd-active"), setTimeout(() => {
            $app.find(".mcmd-sidebar").addClass("mcmd-new-transition");
          }, 1e3);
        }), feather.replace({
          "stroke-width": 2,
          width: 22,
          height: 22
        });
      },
      initDefaults: () => {
        App.default.securityprofiles.profile.access_type = {
          ...App.globals.data.accesstypes.commonfolders
        }, App.data.import.plugins = App.globals.data.plugins_to_import;
      },
      build: () => {
        App.ui.loader.$container = $("#mcmd-loader"), App.modal.$container = $("<div>").addClass("mcmd-modals").attr({
          tabindex: -1
        }), $("body").append(App.modal.$container).addClass("mcmd-app-settings-wrap");
      },
      loading: state => {
        App.ui.loader.count += state ? 1 : -1, App.ui.loader.count = App.ui.loader.count < 0 ? 0 : App.ui.loader.count, 
        clearTimeout(App.ui.loader.timerId), App.ui.loader.count ? App.ui.loader.$container.toggleClass("mcmd-active", true) : setTimeout(() => {
          App.ui.loader.$container.toggleClass("mcmd-active", false);
        }, 300);
      },
      processData: (endpoint, method, data = {}) => {
        const def = $.Deferred();
        App.fn.loading(true);
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
          data: "GET" == method ? $.param(data) : JSON.stringify(data)
        }).done(response => {
          response && response.success ? def.resolve(response.data) : def.reject();
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
      getData: (endpoint, data = {}) => App.fn.processData(endpoint, "GET", data),
      createData: (endpoint, data = {}) => App.fn.processData(endpoint, "POST", data),
      updateData: (endpoint, data = {}) => App.fn.processData(endpoint, "PUT", data),
      deleteData: (endpoint, data = {}) => App.fn.processData(endpoint, "DELETE", data),
      getTableView: (table, total) => {
        const page = table.view.page, pages = table.view.perpage ? Math.ceil(total / table.view.perpage) : 1;
        return {
          page: page,
          pages: pages,
          prev: page > 1 ? page - 1 : null,
          next: page < pages ? page + 1 : null,
          perpage: table.view.perpage,
          first: (table.view.page - 1) * table.view.perpage + 1,
          last: table.view.page * table.view.perpage - Math.max(table.view.perpage - table.items.length, 0),
          total: total
        };
      },
      selectOne: (e, value, data, scope) => {
        if (value) data.checked || (data.checked = value, scope ? scope.scan() : App.scope.scan()); else {
          let flag = true;
          for (const key in data.items) if (data.items[key].checked) {
            flag = false;
            break;
          }
          flag && (data.checked = value, scope ? scope.scan() : App.scope.scan());
        }
      },
      selectAll: (e, value, data, scope) => {
        for (const key in data.items) data.items[key].checked = value;
        scope ? scope.scan() : App.scope.scan();
      },
      config: {
        load: () => {
          const def = $.Deferred();
          return $.when(App.fn.getData("roles"), App.fn.getData("media-hover-details"), App.fn.getData("config")).done((roles, media_hover_details, config) => {
            if (App.data.roles = roles.items, App.data.media_hover_details = media_hover_details.items, 
            App.data.config = $.extend(true, {}, App.default.config, config), App.data.accessroles = config.roles ? config.roles : [], 
            App.data.config) for (let key in App.data.config) App.default.config.hasOwnProperty(key) || delete App.data.config[key];
            App.scope.scan();
            const $color = $("#mcmd-default-folder-color");
            App.colorpicker.set($color, App.data.config.default_color, {
              top: 6,
              left: -4
            }), $color.on("color", App.fn.config.onColor), def.resolve();
          }), {
            ...def.promise()
          };
        },
        onColor: (e, color) => {
          App.data.config.default_color = color || null;
        },
        onColorClick: e => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade"), e.stopImmediatePropagation();
        },
        onMediaDetailsChange: (e, data) => {
          {
            App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
            const value = $(e.target).prop("checked");
            $(e.target).prop("checked", !value);
          }
        },
        isMediaDetailsChecked: data => -1 !== App.data.config.media_hover_details_list.indexOf(data.id),
        onCheckboxChange: e => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade"), e.preventDefault(), e.stopImmediatePropagation();
        },
        save: () => {
          App.fn.loading(true), App.fn.updateData("config", App.data.config).done(() => {
            App.notify.show(App.globals.msg.success, "mcmd-success");
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          }).always(() => {
            App.fn.loading(false);
          });
        }
      },
      accessroles: {
        onChange: (e, data) => {
          {
            App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
            const value = $(e.target).prop("checked");
            $(e.target).prop("checked", !value);
          }
        },
        isChecked: data => -1 !== App.data.accessroles.indexOf(data.id),
        save: () => {
          App.fn.loading(true), App.fn.updateData("config", {
            roles: App.data.accessroles
          }).done(() => {
            App.notify.show(App.globals.msg.success, "mcmd-success");
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          }).always(() => {
            App.fn.loading(false);
          });
        }
      },
      foldertypes: {
        load: page => {
          function loadlist() {
            return App.data.foldertypes.loading = true, App.scope.scan(), App.fn.getData("foldertypes", {
              page: App.data.foldertypes.view.page,
              perpage: App.data.foldertypes.view.perpage
            }).done(data => {
              App.data.foldertypes.items = data.items.map(obj => ({
                ...obj,
                checked: false
              })), App.data.foldertypes.view = App.fn.getTableView(App.data.foldertypes, data.total), 
              App.data.foldertypes.checked = false, App.data.foldertypes.selected = null, App.data.foldertypes.loading = false, 
              App.scope.scan();
            });
          }
          return void 0 !== page ? App.fn.getData("foldertypes").done(data => {
            page = Math.min(Math.max(page, 1), Math.ceil(data.total / App.data.foldertypes.view.perpage)), 
            App.data.foldertypes.view.page = page, App.data.foldertypes.view.total = data.total, 
            loadlist();
          }) : loadlist();
        },
        prev: () => {
          App.fn.foldertypes.load(App.data.foldertypes.view.prev);
        },
        next: () => {
          App.fn.foldertypes.load(App.data.foldertypes.view.next);
        },
        isLock: item => ![ "attachment", "users" ].includes(item.type),
        select: item => {
          App.data.foldertypes.selected = App.data.foldertypes.selected !== item.id ? item.id : null;
        },
        dblclick: item => {
          App.data.foldertypes.selected = item.id, App.fn.foldertypes.edit();
        },
        createEdit: item => {
          App.data.foldertypes.loading = true, App.fn.getData("securityprofiles/all").done(data => {
            const modalData = {
              data: {
                item: item,
                securityprofiles: {
                  items: data.items,
                  none: {
                    id: null,
                    title: null
                  }
                },
                changed: !item.id
              },
              fn: {
                load: () => {
                  const index = modalData.data.securityprofiles.items.findIndex(item => item.id == modalData.data.item.security_profile.id);
                  modalData.data.item.security_profile = index >= 0 ? modalData.data.securityprofiles.items[index] : modalData.data.securityprofiles.none, 
                  modalData.scope.scan(), modalData.scope.watch("Modal.data.item", () => {
                    modalData.data.changed = true;
                  });
                },
                loading: state => {
                  modalData.loading = state, modalData.scope.scan();
                },
                close: () => {
                  App.modal.fn.close(modalData);
                },
                submit: () => {
                  modalData.fn.loading(true), (modalData.data.item.id ? App.fn.updateData("foldertypes/" + modalData.data.item.id, modalData.data.item) : App.fn.createData("foldertypes", modalData.data.item)).done(() => {
                    if (modalData.data.item.id) {
                      const index = App.data.foldertypes.items.findIndex(item => item.id == modalData.data.item.id);
                      App.data.foldertypes.items[index] = {
                        ...modalData.data.item
                      }, App.scope.scan();
                    } else App.fn.foldertypes.load();
                    App.notify.show(App.globals.msg.success, "mcmd-success");
                  }).fail(() => {
                    App.notify.show(App.globals.msg.failed, "mcmd-failed");
                  }).always(() => {
                    modalData.fn.loading(false), modalData.fn.close();
                  });
                }
              }
            };
            App.modal.fn.show("modal-folder-type", modalData, modalData.fn.load);
          }).always(() => {
            App.data.foldertypes.loading = false, App.scope.scan();
          });
        },
        create: () => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        edit: () => {
          const index = App.data.foldertypes.items.findIndex(item => item.id == App.data.foldertypes.selected), item = App.data.foldertypes.items[index];
          [ "attachment", "users" ].includes(item.type) ? (App.data.foldertypes.loading = true, 
          App.fn.getData(`foldertypes/${App.data.foldertypes.selected}`).done(item => {
            App.fn.foldertypes.createEdit(item);
          }).always(() => {
            App.data.foldertypes.loading = false, App.scope.scan();
          })) : App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        delete: () => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        unregistered: {
          popup: callback => {
            const modalData = {
              data: {
                items: [],
                selected: null
              },
              fn: {
                load: () => {
                  modalData.fn.loading(true), modalData.request = App.fn.getData("foldertypes/unregistered").done(data => {
                    modalData.data.items = data.items, modalData.scope.scan();
                  }).always(() => {
                    modalData.request = null, modalData.fn.loading(false);
                  });
                },
                loading: state => {
                  modalData.loading = state, modalData.scope.scan();
                },
                close: () => {
                  modalData.request && modalData.request.abort(), App.modal.fn.close(modalData);
                },
                submit: () => {
                  callback && callback.call(this, modalData.data.selected), modalData.fn.close();
                }
              }
            };
            App.modal.fn.show("modal-select-folder-type", modalData, modalData.fn.load);
          }
        }
      },
      securityprofiles: {
        load: page => {
          function loadlist() {
            return App.data.securityprofiles.loading = true, App.scope.scan(), App.fn.getData("securityprofiles", {
              page: App.data.securityprofiles.view.page,
              perpage: App.data.securityprofiles.view.perpage
            }).done(data => {
              App.data.securityprofiles.items = data.items.map(obj => ({
                ...obj,
                checked: false
              })), App.data.securityprofiles.view = App.fn.getTableView(App.data.securityprofiles, data.total), 
              App.data.securityprofiles.checked = false, App.data.securityprofiles.selected = null, 
              App.data.securityprofiles.loading = false, App.scope.scan();
            });
          }
          return void 0 !== page ? App.fn.getData("securityprofiles").done(data => {
            page = Math.min(Math.max(page, 1), Math.ceil(data.total / App.data.securityprofiles.view.perpage)), 
            App.data.securityprofiles.view.page = page, App.data.securityprofiles.view.total = data.total, 
            loadlist();
          }) : loadlist();
        },
        prev: () => {
          App.fn.securityprofiles.load(App.data.securityprofiles.view.prev);
        },
        next: () => {
          App.fn.securityprofiles.load(App.data.securityprofiles.view.next);
        },
        isLock: item => true,
        select: item => {
          App.data.securityprofiles.selected = App.data.securityprofiles.selected !== item.id ? item.id : null;
        },
        dblclick: item => {
          App.data.securityprofiles.selected = item.id, App.fn.securityprofiles.edit();
        },
        createEdit: item => {
          const modalData = {
            data: {
              item: {
                id: item.id,
                title: item.title,
                description: item.description,
                rights: UTILS_clone(TYPES_TABLE)
              },
              changed: !item.id,
              seed: 0
            },
            fn: {
              load: () => {
                modalData.data.item.rights.items = item.rights.map(obj => ({
                  ...obj,
                  checked: false
                })), modalData.data.item.rights.view = App.fn.getTableView(modalData.data.item.rights, modalData.data.item.rights.items.length), 
                modalData.data.item.rights.checked = false, modalData.data.item.rights.selected = null, 
                modalData.data.item.rights.loading = false, modalData.scope.scan(), modalData.scope.watch("Modal.data.item", () => {
                  modalData.data.changed = true;
                });
              },
              loading: state => {
                modalData.loading = state, modalData.scope.scan();
              },
              select: item => {
                modalData.data.item.rights.selected = modalData.data.item.rights.selected !== item.id ? item.id : null;
              },
              dblclick: item => {
                modalData.data.item.rights.selected = item.id, modalData.fn.edit();
              },
              createEdit: item => {
                modalData.fn.loading(true), App.fn.getData("securityprofiles/predefined").done(access_types => {
                  App.fn.securityprofiles.rights.popup(item, access_types.items, modalData.data.item.rights.items, right => {
                    if (right.id) {
                      const index = modalData.data.item.rights.items.findIndex(item => item.id == right.id);
                      modalData.data.item.rights.items[index] = right;
                    } else right.id = --modalData.data.seed, modalData.data.item.rights.items.push(right);
                    modalData.scope.scan();
                  });
                }).always(() => {
                  modalData.fn.loading(false);
                });
              },
              create: () => {
                const item = UTILS_clone(App.default.securityprofiles.profile);
                modalData.fn.createEdit(item);
              },
              edit: () => {
                const index = modalData.data.item.rights.items.findIndex(item => item.id == modalData.data.item.rights.selected), item = UTILS_clone(modalData.data.item.rights.items[index]);
                modalData.fn.createEdit(item);
              },
              delete: () => {
                const selected = modalData.data.item.rights.items.filter(obj => obj.checked).map(obj => obj.id), items = modalData.data.item.rights.items.filter(obj => !selected.includes(obj.id));
                modalData.data.item.rights.items = items, modalData.data.item.rights.view = App.fn.getTableView(modalData.data.item.rights, modalData.data.item.rights.items.length), 
                modalData.scope.scan();
              },
              close: () => {
                App.modal.fn.close(modalData);
              },
              submit: () => {
                const data = UTILS_clone(modalData.data.item);
                data.rights = data.rights.items.map(item => (delete item.checked, item)), modalData.fn.loading(true), 
                (modalData.data.item.id ? App.fn.updateData("securityprofiles/" + modalData.data.item.id, data) : App.fn.createData("securityprofiles", data)).done(() => {
                  if (modalData.data.item.id) {
                    const index = App.data.securityprofiles.items.findIndex(item => item.id == modalData.data.item.id);
                    App.data.securityprofiles.items[index] = {
                      ...modalData.data.item
                    }, App.scope.scan();
                  } else App.fn.securityprofiles.load(1);
                  App.notify.show(App.globals.msg.success, "mcmd-success");
                }).fail(() => {
                  App.notify.show(App.globals.msg.failed, "mcmd-failed");
                }).always(() => {
                  modalData.fn.loading(false), modalData.fn.close();
                });
              }
            }
          };
          App.modal.fn.show("modal-security-profile", modalData, modalData.fn.load);
        },
        create: () => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        edit: () => {
          [ "-1", "-2" ].includes(App.data.securityprofiles.selected) ? App.notify.show(App.globals.msg.builtin, "mcmd-warning") : App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        delete: () => {
          App.notify.show(App.globals.msg.upgrade, "mcmd-upgrade");
        },
        rights: {
          popup: (item, access_types, rights, callback) => {
            const modalData = {
              data: {
                item: UTILS_clone(item),
                access_types: {
                  items: access_types,
                  none: {
                    id: null,
                    title: null
                  }
                },
                changed: !item.id
              },
              fn: {
                load: () => {
                  const index = modalData.data.access_types.items.findIndex(item => item.id == modalData.data.item.access_type.id);
                  modalData.data.item.access_type = index >= 0 ? modalData.data.access_types.items[index] : modalData.data.access_types.none, 
                  modalData.scope.scan(), modalData.scope.watch("Modal.data.item", () => {
                    modalData.data.changed = true;
                  });
                },
                loading: state => {
                  modalData.loading = state, modalData.scope.scan();
                },
                selectUser: () => {
                  const registered = rights.filter(obj => "user" == obj.owner.type).map(obj => obj.owner.id);
                  App.fn.users.popup(registered, user => {
                    modalData.data.item.owner.type = user ? "user" : null, modalData.data.item.owner.id = user ? user.id : null, 
                    modalData.data.item.owner.title = user ? user.title : null, modalData.scope.scan();
                  });
                },
                selectRole: () => {
                  const registered = rights.filter(obj => "role" == obj.owner.type).map(obj => obj.owner.id);
                  App.fn.roles.popup(registered, role => {
                    modalData.data.item.owner.type = role ? "role" : null, modalData.data.item.owner.id = role ? role.id : null, 
                    modalData.data.item.owner.title = role ? role.title : null, modalData.scope.scan();
                  });
                },
                close: () => {
                  App.modal.fn.close(modalData);
                },
                submit: () => {
                  callback && callback.call(this, modalData.data.item), modalData.fn.close();
                }
              }
            };
            App.modal.fn.show("modal-security-profile-rights", modalData, modalData.fn.load);
          }
        }
      },
      roles: {
        popup: (registered, callback) => {
          const modalData = {
            data: {
              items: [],
              selected: null
            },
            fn: {
              load: () => {
                modalData.fn.loading(true), modalData.request = App.fn.getData("roles").done(data => {
                  modalData.data.items = data.items.filter(obj => !registered.includes(obj.id)), modalData.scope.scan();
                }).always(() => {
                  modalData.request = null, modalData.fn.loading(false);
                });
              },
              loading: state => {
                modalData.loading = state, modalData.scope.scan();
              },
              close: () => {
                modalData.request && modalData.request.abort(), App.modal.fn.close(modalData);
              },
              submit: () => {
                callback && callback.call(this, modalData.data.selected), modalData.fn.close();
              }
            }
          };
          App.modal.fn.show("modal-select-role", modalData, modalData.fn.load);
        }
      },
      users: {
        popup: (registered, callback) => {
          const modalData = {
            data: {
              items: [],
              selected: null
            },
            fn: {
              load: () => {
                modalData.fn.loading(true), modalData.request = App.fn.getData("users").done(data => {
                  modalData.data.items = data.items.filter(obj => !registered.includes(obj.id)), modalData.scope.scan();
                }).always(() => {
                  modalData.request = null, modalData.fn.loading(false);
                });
              },
              loading: state => {
                modalData.loading = state, modalData.scope.scan();
              },
              close: () => {
                modalData.request && modalData.request.abort(), App.modal.fn.close(modalData);
              },
              submit: () => {
                callback && callback.call(this, modalData.data.selected), modalData.fn.close();
              }
            }
          };
          App.modal.fn.show("modal-select-user", modalData, modalData.fn.load);
        }
      },
      tools: {
        export: () => {
          App.data.export.url = null, App.scope.scan(), App.fn.getData("export-csv").done(folders => {
            App.fn.tools.generateCSVFile(folders), App.notify.show(App.globals.msg.success, "mcmd-success");
          });
        },
        generateCSVFile: folders => {
          const data = folders.map((folder, index) => {
            let row = "";
            return 0 == index && (row += Object.keys(folder).map(key => [ key ]).join(",") + "\n"), 
            row += Object.keys(folder).map(key => (Array.isArray(folder[key]) && (folder[key] = folder[key].join("|")), 
            [ folder[key] ].join(","))), row;
          }).join("\n"), blob = new Blob([ data ], {
            type: "text/csv;charset=utf-8;"
          }), url = URL.createObjectURL(blob), d = new Date, noTimeDate = ("0" + d.getDate()).slice(-2) + "-" + ("0" + (d.getMonth() + 1)).slice(-2) + "-" + d.getFullYear();
          App.data.export.filename = "mediacommander-" + noTimeDate + ".csv", App.data.export.url = url, 
          App.scope.scan();
        },
        import: () => {
          const formData = new FormData;
          formData.append("file", App.data.import.file), formData.append("clear", App.data.import.clear), 
          formData.append("attachments", App.data.import.attachments), App.fn.loading(true), 
          $.ajax({
            url: App.globals.api.url + "/import-csv",
            type: "POST",
            data: formData,
            processData: false,
            contentType: false,
            headers: {
              "X-WP-Nonce": App.globals.api.nonce
            }
          }).done(response => {
            response && response.success ? App.notify.show(App.globals.msg.success, "mcmd-success") : App.notify.show(App.globals.msg.failed, "mcmd-failed");
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          }).always(() => {
            App.fn.loading(false);
          });
        },
        onFileToImportChange: input => {
          App.data.import.file = input.files[0], App.scope.scan();
        },
        clear: () => {
          const modalData = {
            fn: {
              loading: state => {
                modalData.loading = state, modalData.scope.scan();
              },
              close: () => {
                App.modal.fn.close(modalData);
              },
              submit: () => {
                App.modal.fn.close(modalData), App.fn.updateData("uninstall").done(url => {
                  App.notify.show(App.globals.msg.success, "mcmd-success"), window.location.replace(url);
                }).fail(() => {
                  App.notify.show(App.globals.msg.failed, "mcmd-failed");
                });
              }
            }
          };
          App.modal.fn.show("modal-confirm-clear-all", modalData);
        },
        importFromPlugin: key => {
          const plugin = App.data.import.plugins.find(plugin => plugin.key == key);
          plugin && !plugin.lock && ($(":focus").blur(), App.fn.loading(true), App.fn.createData("import/" + plugin.key).done(() => {
            App.notify.show(App.globals.msg.success, "mcmd-success"), plugin.lock = true, App.scope.scan();
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          }).always(() => {
            App.fn.loading(false);
          }));
        },
        recalculate: () => {
          App.fn.updateData("attachment/counters").done(() => {
            App.notify.show(App.globals.msg.success, "mcmd-success");
          }).fail(() => {
            App.notify.show(App.globals.msg.failed, "mcmd-failed");
          });
        }
      }
    }
  };
  alight.directives.al.toggle = {
    restrict: "EA",
    link: function(scope, element, expression, env) {
      const $el = $(element);
      if ($el.addClass("mcmd-toggle").html("&nbsp;"), $el.on("click", function(e) {
        env.setValue(expression, !env.getValue(expression)), env.scan(), function() {
          const callback = $el.data("callback");
          if (callback) {
            env.changeDetector.compile(callback)(scope);
          }
        }();
      }), void 0 === env.getValue(expression) && void 0 !== $el.attr("data-default")) {
        const val = $el.data("default");
        env.setValue(expression, val);
      }
      env.watch(expression, function(value) {
        value ? $el.addClass("mcmd-checked").removeClass("mcmd-unchecked") : $el.removeClass("mcmd-checked").addClass("mcmd-unchecked");
      }, {
        readOnly: true
      });
    }
  }, App.data.config = $.extend(true, {}, App.default.config), App.globals = mediacommander_settings_globals, 
  App.alight = alight, App.scope = alight(document.querySelectorAll("#mcmd-app-settings")[0], {
    App: App
  }), App.fn.init();
}(jQuery);