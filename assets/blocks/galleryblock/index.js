((wp, $) => {
  "use strict";
  const __ = wp.i18n.__, {registerBlockType: registerBlockType} = wp.blocks, {serverSideRender: serverSideRender} = wp, {createElement: el, Component: Component, Fragment: Fragment} = wp.element, {Panel: Panel, PanelBody: PanelBody, SelectControl: SelectControl, RangeControl: RangeControl} = wp.components, {InspectorControls: InspectorControls} = wp.blockEditor;
  registerBlockType("mediacommander/image-gallery", {
    edit: class extends Component {
      constructor() {
        super(...arguments), this.state = {
          folders: [],
          imageSizes: []
        };
      }
      processData(endpoint, method, data = {}) {
        const def = $.Deferred(), $ajax = $.ajax({
          url: MediaCommanderGalleryBlock.api.url + "/" + endpoint,
          type: "GET" == method ? "GET" : "POST",
          cache: false,
          dataType: "json",
          contentType: "application/json",
          headers: {
            "X-WP-Nonce": MediaCommanderGalleryBlock.api.nonce,
            "X-HTTP-Method-Override": method
          },
          data: "GET" === method ? data : JSON.stringify(data)
        }).done(response => {
          response && response.success ? def.resolve(response.data) : def.reject();
        }).fail(() => {
          def.reject();
        }).always(() => {});
        return {
          ...def.promise(),
          abort: $ajax.abort
        };
      }
      getData(endpoint, data = {}) {
        return this.processData(endpoint, "GET", data);
      }
      componentDidMount() {
        this.getData("folders", {
          type: "attachment"
        }).done(data => {
          const list = [ {
            value: "",
            label: "None"
          } ];
          !function createList(folders, level, list) {
            for (const folder of folders) list.push({
              value: folder.id,
              label: "-".repeat(level) + (level ? " " : "") + folder.title
            }), folder.items && folder.items.length && createList(folder.items, level + 1, list);
          }(data && void 0 !== data.folders ? data.folders : data, 0, list), this.setState({
            folders: list
          });
        });
        const imageSizes = MediaCommanderGalleryBlock.data.imageSizes;
        this.setState({
          imageSizes: Object.keys(imageSizes).map(key => ({
            value: key,
            label: imageSizes[key]
          }))
        });
      }
      render() {
        return el(Fragment, {}, el(InspectorControls, {}, el(Panel, {}, el(PanelBody, {
          title: __("Gallery Settings"),
          initialOpen: true
        }, el(SelectControl, {
          label: __("Folder"),
          value: this.props.attributes.folder,
          options: this.state.folders,
          onChange: value => {
            this.props.setAttributes({
              folder: value
            });
          }
        }), el(RangeControl, {
          label: __("Columns"),
          value: this.props.attributes.columns,
          min: 1,
          max: 12,
          onChange: value => {
            this.props.setAttributes({
              columns: value
            });
          }
        }), el(RangeControl, {
          label: __("Max Items"),
          value: this.props.attributes.max,
          min: 0,
          onChange: value => {
            this.props.setAttributes({
              max: value
            });
          }
        }), el(SelectControl, {
          label: __("Image Size"),
          value: this.props.attributes.imageSize,
          options: this.state.imageSizes,
          onChange: value => {
            this.props.setAttributes({
              imageSize: value
            });
          }
        })))), el(serverSideRender, {
          block: "mediacommander/image-gallery",
          attributes: this.props.attributes
        }));
      }
    },
    save: class extends Component {
      render() {
        return null;
      }
    }
  });
})(window.wp, window.jQuery);