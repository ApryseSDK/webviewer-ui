(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4590],{"./src/components/ModularComponents/PresetButton/PresetButton.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ContentEditButton:()=>ContentEditButton,CreatePortfolioButton:()=>CreatePortfolioButton,DownloadButton:()=>DownloadButton,FilePickerButton:()=>FilePickerButton,FormFieldEditButton:()=>FormFieldEditButton,FullscreenButton:()=>FullscreenButton,NewDocumentButton:()=>NewDocumentButton,PrintButton:()=>PrintButton,RedoButton:()=>RedoButton,SaveAsButton:()=>SaveAsButton,SettingsButton:()=>SettingsButton,UndoButton:()=>UndoButton,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/redux/initialState.js"),_PresetButton__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/ModularComponents/PresetButton/PresetButton.js"),src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/constants/customizationVariables.js");const __WEBPACK_DEFAULT_EXPORT__={title:"ModularComponents/PresetButton",component:_PresetButton__WEBPACK_IMPORTED_MODULE_3__.A,parameters:{customizableUI:!0}};src_redux_initialState__WEBPACK_IMPORTED_MODULE_2__.A.viewer.activeDocumentViewerKey=1;var store=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_5__.U1)({reducer:function(){return src_redux_initialState__WEBPACK_IMPORTED_MODULE_2__.A}}),prepareButtonStory=function(buttonType){var props={buttonType};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PresetButton__WEBPACK_IMPORTED_MODULE_3__.A,props))};function UndoButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.UNDO)}function RedoButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.REDO)}function NewDocumentButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.NEW_DOCUMENT)}function FilePickerButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.FILE_PICKER)}function DownloadButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.DOWNLOAD)}function FullscreenButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.FULLSCREEN)}function SaveAsButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.SAVE_AS)}function PrintButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.PRINT)}function CreatePortfolioButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.CREATE_PORTFOLIO)}function SettingsButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.SETTINGS)}function FormFieldEditButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.FORM_FIELD_EDIT)}function ContentEditButton(){return prepareButtonStory(src_constants_customizationVariables__WEBPACK_IMPORTED_MODULE_4__.dQ.CONTENT_EDIT)}UndoButton.parameters={...UndoButton.parameters,docs:{...UndoButton.parameters?.docs,source:{originalSource:"function UndoButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.UNDO);\n}",...UndoButton.parameters?.docs?.source}}},RedoButton.parameters={...RedoButton.parameters,docs:{...RedoButton.parameters?.docs,source:{originalSource:"function RedoButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.REDO);\n}",...RedoButton.parameters?.docs?.source}}},NewDocumentButton.parameters={...NewDocumentButton.parameters,docs:{...NewDocumentButton.parameters?.docs,source:{originalSource:"function NewDocumentButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.NEW_DOCUMENT);\n}",...NewDocumentButton.parameters?.docs?.source}}},FilePickerButton.parameters={...FilePickerButton.parameters,docs:{...FilePickerButton.parameters?.docs,source:{originalSource:"function FilePickerButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.FILE_PICKER);\n}",...FilePickerButton.parameters?.docs?.source}}},DownloadButton.parameters={...DownloadButton.parameters,docs:{...DownloadButton.parameters?.docs,source:{originalSource:"function DownloadButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.DOWNLOAD);\n}",...DownloadButton.parameters?.docs?.source}}},FullscreenButton.parameters={...FullscreenButton.parameters,docs:{...FullscreenButton.parameters?.docs,source:{originalSource:"function FullscreenButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.FULLSCREEN);\n}",...FullscreenButton.parameters?.docs?.source}}},SaveAsButton.parameters={...SaveAsButton.parameters,docs:{...SaveAsButton.parameters?.docs,source:{originalSource:"function SaveAsButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.SAVE_AS);\n}",...SaveAsButton.parameters?.docs?.source}}},PrintButton.parameters={...PrintButton.parameters,docs:{...PrintButton.parameters?.docs,source:{originalSource:"function PrintButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.PRINT);\n}",...PrintButton.parameters?.docs?.source}}},CreatePortfolioButton.parameters={...CreatePortfolioButton.parameters,docs:{...CreatePortfolioButton.parameters?.docs,source:{originalSource:"function CreatePortfolioButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.CREATE_PORTFOLIO);\n}",...CreatePortfolioButton.parameters?.docs?.source}}},SettingsButton.parameters={...SettingsButton.parameters,docs:{...SettingsButton.parameters?.docs,source:{originalSource:"function SettingsButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.SETTINGS);\n}",...SettingsButton.parameters?.docs?.source}}},FormFieldEditButton.parameters={...FormFieldEditButton.parameters,docs:{...FormFieldEditButton.parameters?.docs,source:{originalSource:"function FormFieldEditButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.FORM_FIELD_EDIT);\n}",...FormFieldEditButton.parameters?.docs?.source}}},ContentEditButton.parameters={...ContentEditButton.parameters,docs:{...ContentEditButton.parameters?.docs,source:{originalSource:"function ContentEditButton() {\n  return prepareButtonStory(PRESET_BUTTON_TYPES.CONTENT_EDIT);\n}",...ContentEditButton.parameters?.docs?.source}}};const __namedExportsOrder=["UndoButton","RedoButton","NewDocumentButton","FilePickerButton","DownloadButton","FullscreenButton","SaveAsButton","PrintButton","CreatePortfolioButton","SettingsButton","FormFieldEditButton","ContentEditButton"]},"./node_modules/blob-stream/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{var WritableStream=__webpack_require__("?c02f").Writable,util=__webpack_require__("./node_modules/util/util.js"),Blob=__webpack_require__("./node_modules/blob/index.js"),URL=__webpack_require__.g.URL||__webpack_require__.g.webkitURL||__webpack_require__.g.mozURL;function BlobStream(){if(!(this instanceof BlobStream))return new BlobStream;WritableStream.call(this),this._chunks=[],this._blob=null,this.length=0}util.inherits(BlobStream,WritableStream),BlobStream.prototype._write=function(chunk,encoding,callback){chunk instanceof Uint8Array||(chunk=new Uint8Array(chunk)),this.length+=chunk.length,this._chunks.push(chunk),callback()},BlobStream.prototype.toBlob=function(type){return type=type||"application/octet-stream",this._blob||(this._blob=new Blob(this._chunks,{type}),this._chunks=[]),this._blob.type!==type&&(this._blob=new Blob([this._blob],{type})),this._blob},BlobStream.prototype.toBlobURL=function(type){return URL.createObjectURL(this.toBlob(type))},module.exports=BlobStream},"./node_modules/blob/index.js":(module,__unused_webpack_exports,__webpack_require__)=>{var BlobBuilder=__webpack_require__.g.BlobBuilder||__webpack_require__.g.WebKitBlobBuilder||__webpack_require__.g.MSBlobBuilder||__webpack_require__.g.MozBlobBuilder,blobSupported=function(){try{return 2===new Blob(["hi"]).size}catch(e){return!1}}(),blobSupportsArrayBufferView=blobSupported&&function(){try{return 2===new Blob([new Uint8Array([1,2])]).size}catch(e){return!1}}(),blobBuilderSupported=BlobBuilder&&BlobBuilder.prototype.append&&BlobBuilder.prototype.getBlob;function mapArrayBufferViews(ary){for(var i=0;i<ary.length;i++){var chunk=ary[i];if(chunk.buffer instanceof ArrayBuffer){var buf=chunk.buffer;if(chunk.byteLength!==buf.byteLength){var copy=new Uint8Array(chunk.byteLength);copy.set(new Uint8Array(buf,chunk.byteOffset,chunk.byteLength)),buf=copy.buffer}ary[i]=buf}}}function BlobBuilderConstructor(ary,options){options=options||{};var bb=new BlobBuilder;mapArrayBufferViews(ary);for(var i=0;i<ary.length;i++)bb.append(ary[i]);return options.type?bb.getBlob(options.type):bb.getBlob()}function BlobConstructor(ary,options){return mapArrayBufferViews(ary),new Blob(ary,options||{})}module.exports=blobSupported?blobSupportsArrayBufferView?__webpack_require__.g.Blob:BlobConstructor:blobBuilderSupported?BlobBuilderConstructor:void 0},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ModularComponents/Flyout/Flyout.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.Flyout.mobile .swipe-indicator{background:#818a92;background:var(--swipe-indicator-bg);border-radius:2px;height:4px;width:38px;position:absolute;top:12px;margin-left:auto;margin-right:auto;left:0;right:0}@media(min-width:641px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .Flyout.mobile .swipe-indicator,.Flyout.mobile .App:not(.is-in-desktop-only-mode):not(.is-web-component) .swipe-indicator{display:none}}@container (min-width: 641px){.App.is-web-component:not(.is-in-desktop-only-mode) .Flyout.mobile .swipe-indicator,.Flyout.mobile .App.is-web-component:not(.is-in-desktop-only-mode) .swipe-indicator{display:none}}:root{--blue-1:#e7edf3;--blue-2:#dde6ee;--blue-3:#cfd8e0;--blue-4:#c7d2dd;--blue-5:#2b73ab;--blue-6:#1a466b;--gray-0:#fff;--gray-1:#f8f9fa;--gray-2:#f1f3f5;--gray-3:#e7ebee;--gray-4:#cfd4da;--gray-5:#abb5bd;--gray-6:#818a92;--gray-7:#697077;--gray-8:#485056;--gray-9:#343a40;--gray-10:#21242a;--gray-11:#16181c;--gray-12:#101214;--gray-13:#000;--yellow-1:rgba(250,206,0,0.50196);--red:#d52a2a;--green:#006d41;--component-background:var(--gray-0);--mobile-presets-background:var(--gray-1);--faded-component-background:var(--gray-2);--toggle-zoom-overlay-background:var(--gray-2);--ribbons-background:var(--gray-3);--document-background-color:var(--gray-2);--error-text-color:var(--red);--error-border-color:var(--red);--panel-background:var(--gray-0);--slider-filled:var(--gray-9);--slider-background:var(--gray-6);--badge-fill:var(--gray-8);--badge-text-color:var(--gray-0);--view-header-icon-active-fill:var(--blue-5);--text-color:var(--gray-9);--faded-text:var(--gray-7);--placeholder-text:var(--gray-7);--ribbon-active-color:var(--blue-5);--ribbon-hover-color:var(--blue-6);--no-presets-text:var(--gray-6);--disabled-text:var(--gray-5);--disabled-icon:var(--gray-5);--scroll-chevron-color:var(--gray-6);--icon-color:var(--gray-6);--selected-icon-color:var(--gray-8);--view-header-button-hover:var(--gray-2);--view-header-button-active:var(--gray-2);--popup-button-hover:var(--gray-2);--popup-button-active:var(--gray-2);--dropdown-item-active-text:var(--gray-0);--dropdown-item-active-icon:var(--gray-0);--primary-button:var(--blue-5);--primary-button-text:var(--gray-0);--primary-button-hover:var(--blue-6);--secondary-button-border:var(--blue-5);--secondary-button-text:var(--blue-5);--secondary-button-hover:var(--blue-6);--box-shadow:var(--gray-6);--document-box-shadow:var(--gray-7);--divider:var(--gray-4);--reply-divider:var(--gray-3);--side-panel-border:var(--divider);--border:var(--gray-6);--lighter-border:var(--gray-4);--focus-border:var(--blue-5);--hover-border:var(--blue-6);--color-palette-border:var(--blue-5);--image-signature-drop-background:var(--blue-1);--image-signature-drop-border:var(--blue-5);--file-picker-drop-background:var(--blue-1);--file-picker-drop-border:var(--blue-5);--signature-draw-background:var(--gray-2);--modal-stroke-and-border:var(--gray-4);--modal-negative-space:rgba(0,0,0,0.3);--spinner-negative-space:rgba(0,0,0,0.3);--white-color-palette-border:var(--border);--list-separator-color:var(--gray-7);--scrollbar-color:var(--gray-6);--note-box-shadow:var(--gray-7);--note-box-shadow-expanded:rgba(134,142,150,0.24);--tools-header-background:var(--gray-2);--view-header-background:var(--gray-1);--tools-overlay-background:var(--gray-0);--tools-button-hover:var(--gray-2);--tools-button-active:var(--gray-2);--tools-overlay-button-hover:var(--blue-1);--tools-overlay-button-active:var(--blue-2);--fileAttachment-title-padding:0;--fileAttachment-list-padding:24px;--outline-color:var(--blue-5);--outline-hover:var(--gray-2);--outline-selected:var(--gray-2);--outline-selected-border:var(--blue-5);--preset-background:var(--gray-1);--scale-overlay-item-hover:var(--dropdown-item-hover);--oe-table-dropdown-highlight:var(--gray-5);--bookmark-outline-hover-border:var(--blue-5);--checked-option:var(--blue-5);--multi-tab-header-background:var(--tool-header-background);--multi-tab-active-tab-background:var(--gray-0);--multi-tab-divider:var(--gray-6);--multi-tab-hover-border:var(--blue-6);--multi-tab-border:1px solid var(--gray-6);--multi-tab-text-color:var(--gray-9);--multi-tab-active-text-color:var(--gray-9);--multi-tab-add-button-padding:8px;--multi-tab-border-radius:4px;--multi-tab-divider-height:22px;--multi-tab-header-height:36px;--multi-tab-divider-top:8px;--multi-tab-flyout-hover:var(--blue-6);--multi-tab-flyout-hover-text:var(--gray-0);--multi-tab-toggle-button-active:var(--blue-5);--file-preview-background:var(--gray-2);--tab-border-color:var(--border);--tab-border-color-hover:var(--blue-6);--tab-background-color-hover:var(--faded-component-background);--tab-color-selected:var(--blue-5);--tab-text-color-selected:var(--gray-0);--dropdown-item-hover:var(--blue-6);--dropdown-item-active:var(--blue-5);--dropdown-item-text-hover:var(--gray-0);--disabled-button-color:rgba(43,115,171,0.5);--tab-footer-button-color:var(--gray-0);--x-button-hover-color:var(--gray-2);--slider-filler:drop-shadow(0px 0px 1px hsla(0,0%,56.9%,0.7));--style-icon-color:var(--icon-color);--cell-border-size:30px;--cell-outer-border-size:30px;--button-icon-color-active:var(--blue-5);--slider-svg-hieght:25px;--slider-input-focus:var(--blue-5);--colorpicker-tool-shadow:inset 0 0 0 1px var(--blue-6);--colorpicker-tool-bg:var(--tools-button-hover);--input-switch-default-color:var(--gray-6);--focus-visible-outline:2px solid var(--gray-10);--change-list-old-bg:#fff2f2;--change-list-new-bg:#e8faf3;--swipe-indicator-bg:var(--gray-6);--slider-height:5px;--slider-thumb-size:18px;--slider-thumb-margin:-6px}.Flyout{z-index:90;position:absolute;display:flex;background:#fff;background:var(--gray-0);border-radius:4px}.Flyout .FlyoutContainer{overflow-y:auto;overflow-x:hidden;z-index:200;background-color:#fff;background-color:var(--component-background);min-width:140px;max-width:328px;padding:4px 0;margin:0;font-size:var(--font-size-default);font-family:var(--font-family);border:1px solid #cfd4da;border:1px solid var(--divider);border-radius:4px;text-overflow:ellipsis}.Flyout .FlyoutContainer .divider{margin:6px 0;width:100%;height:1px;background-color:#cfd4da;background-color:var(--divider)}.Flyout .FlyoutContainer .divider+.divider,.Flyout .FlyoutContainer .divider+.flyout-item-container:empty+.divider,.Flyout .FlyoutContainer .divider:first-child,.Flyout .FlyoutContainer .divider:last-child{display:none}.Flyout .FlyoutContainer .flyout-item-dropdown-container{display:flex}.Flyout .FlyoutContainer .flyout-item-container{height:32px;margin:4px 0;display:flex;flex-direction:row;align-items:center;justify-content:center;width:100%;min-width:-moz-max-content;min-width:max-content}.Flyout .FlyoutContainer .flyout-item-container:empty{display:none}.Flyout .FlyoutContainer .flyout-item-container .menu-icon{width:24px;height:24px;margin-right:8px}.Flyout .FlyoutContainer .flyout-item-container .icon-open-submenu{cursor:pointer;justify-self:flex-end;width:16px;height:16px;margin-right:0;padding-top:2px;display:flex}.Flyout .FlyoutContainer .flyout-item-container .menu-icon.Icon svg path{justify-self:flex-start}.Flyout .FlyoutContainer .flyout-item-container .flyout-item,.Flyout .FlyoutContainer .flyout-item-container .menu-container{border:none;background-color:transparent;display:flex;flex-direction:row;align-items:center;width:100%;height:100%;min-width:-moz-max-content;min-width:max-content;box-sizing:border-box;padding:4px 8px;margin:0 2px;grid-gap:10px;gap:10px;white-space:nowrap}.Flyout .FlyoutContainer .flyout-item-container .flyout-item,:host(:not([data-tabbing=true])) .Flyout .FlyoutContainer .flyout-item-container .menu-container,html:not([data-tabbing=true]) .Flyout .FlyoutContainer .flyout-item-container .menu-container{outline:none}.Flyout .FlyoutContainer .flyout-item-container .flyout-item:not(.back-button),.Flyout .FlyoutContainer .flyout-item-container .menu-container:not(.back-button){justify-content:space-between}.Flyout .FlyoutContainer .flyout-item-container .flyout-item:not(:disabled),.Flyout .FlyoutContainer .flyout-item-container .menu-container:not(:disabled){cursor:pointer}.Flyout .FlyoutContainer .flyout-item-container .flyout-item.focus-visible,.Flyout .FlyoutContainer .flyout-item-container .flyout-item:focus-visible,.Flyout .FlyoutContainer .flyout-item-container .menu-container.focus-visible,.Flyout .FlyoutContainer .flyout-item-container .menu-container:focus-visible{outline:2px solid #21242a;outline:var(--focus-visible-outline)}.Flyout .FlyoutContainer .flyout-item-container .flyout-item[disabled],.Flyout .FlyoutContainer .flyout-item-container .menu-container[disabled]{color:#abb5bd;color:var(--gray-5)}.Flyout .FlyoutContainer .flyout-item-container .flyout-item .icon-label-wrapper,.Flyout .FlyoutContainer .flyout-item-container .menu-container .icon-label-wrapper{display:flex;align-items:center}.Flyout .FlyoutContainer .flyout-item-container .flyout-item .flyout-item-label,.Flyout .FlyoutContainer .flyout-item-container .menu-container .flyout-item-label{text-transform:capitalize;justify-self:flex-start;font-size:var(--font-size-default);margin-right:10px}.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled){background-color:#1a466b;background-color:var(--blue-6)}.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled){background-color:#2b73ab;background-color:var(--blue-5)}.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled),.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled){color:#fff;color:var(--gray-0)}.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .Icon,.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .Icon svg *,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .Icon,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .Icon svg *{color:#fff;color:var(--gray-0);fill:#fff;fill:var(--gray-0)}.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .flyout-item-label,.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .hotkey-wrapper,.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .ZoomText .label,.Flyout .FlyoutContainer .flyout-item-container.active:not(.disabled) .ZoomText .value,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .flyout-item-label,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .hotkey-wrapper,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .ZoomText .label,.Flyout .FlyoutContainer .flyout-item-container:hover:not(.disabled) .ZoomText .value{color:#fff;color:var(--gray-0)}.Flyout .FlyoutContainer .flyout-item-container .custom-element-wrapper{display:flex}.Flyout .FlyoutContainer .flyout-item-container .ZoomItem{padding:0}.Flyout .FlyoutContainer .flyout-item-container .ZoomItem:hover{background:transparent}.Flyout .FlyoutContainer .flyout-item-container .ZoomItem .Icon{margin-left:0}.Flyout .FlyoutContainer .flyout-item-container .hotkey-wrapper{color:#697077;color:var(--gray-7);margin-left:8px;margin-right:2px}.Flyout .FlyoutContainer .flyout-item-container.disabled{cursor:default}.Flyout .FlyoutContainer .flyout-item-container.disabled .Icon,.Flyout .FlyoutContainer .flyout-item-container.disabled .Icon svg *,.Flyout .FlyoutContainer .flyout-item-container.disabled button{color:#abb5bd;color:var(--gray-5)}.Flyout .FlyoutContainer .flyout-item-container.disabled .hotkey-wrapper{color:#abb5bd;color:var(--gray-5);pointer-events:none}.Flyout .FlyoutContainer .flyout-item-container.zoom-options .flyout-item{justify-content:space-between}.Flyout .FlyoutContainer .flyout-item-container button.back-button{padding:0;border:none;background-color:transparent;font-size:var(--font-size-default)!important}:host(:not([data-tabbing=true])) .Flyout .FlyoutContainer .flyout-item-container button.back-button,html:not([data-tabbing=true]) .Flyout .FlyoutContainer .flyout-item-container button.back-button{outline:none}.Flyout .FlyoutContainer .flyout-item-container button.back-button.focus-visible,.Flyout .FlyoutContainer .flyout-item-container button.back-button:focus-visible{outline:2px solid #21242a;outline:var(--focus-visible-outline)}.Flyout .FlyoutContainer .flyout-item-container button.back-button .Icon{width:16px;height:16px;margin-right:16px}.Flyout .FlyoutContainer .flyout-item-container button.back-button:hover,.Flyout .FlyoutContainer .flyout-item-container button.back-button:hover .hotkey-wrapper,.Flyout .FlyoutContainer .flyout-item-container button.back-button:hover .Icon,.Flyout .FlyoutContainer .flyout-item-container button.back-button:hover .Icon svg *,.Flyout .FlyoutContainer .flyout-item-container button.back-button:hover .ZoomText .label .value{color:#fff;color:var(--gray-0)}.Flyout .FlyoutContainer .flyout-label{padding:8px 18px 8px 12px;font-weight:700}.Flyout.legacy-ui .flyout-item-container:hover:not([disabled]):not(.disabled){background-color:#f1f3f5;background-color:var(--popup-button-hover)}.Flyout.legacy-ui .flyout-item-container:hover:not([disabled]):not(.disabled) .flyout-item-label{color:#343a40;color:var(--text-color)}.Flyout.legacy-ui .flyout-item-container:hover:not([disabled]):not(.disabled) .Icon svg *{color:#818a92;color:var(--icon-color)}.Flyout.mobile{position:fixed;width:100%;left:0;bottom:0;border-radius:0;border-top-left-radius:4px;border-top-right-radius:4px;border:0;box-shadow:0 0 3px 0 #697077;box-shadow:0 0 3px 0 var(--document-box-shadow);padding:30px 0 12px;z-index:110}.Flyout.mobile .FlyoutContainer{min-width:100%;border:none}.Flyout.mobile .FlyoutContainer .flyout-item-container:hover{background-color:transparent;background-color:initial}.Flyout.mobile .FlyoutContainer .flyout-item-container:hover .flyout-item-label{color:#343a40;color:var(--text-color)}.Flyout.mobile .FlyoutContainer .flyout-item-container:hover .Icon svg *{color:#818a92;color:var(--icon-color);fill:#818a92;fill:var(--icon-color)}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./node_modules/lodash/_baseRange.js":module=>{var nativeCeil=Math.ceil,nativeMax=Math.max;module.exports=function baseRange(start,end,step,fromRight){for(var index=-1,length=nativeMax(nativeCeil((end-start)/(step||1)),0),result=Array(length);length--;)result[fromRight?length:++index]=start,start+=step;return result}},"./node_modules/lodash/_baseTrim.js":(module,__unused_webpack_exports,__webpack_require__)=>{var trimmedEndIndex=__webpack_require__("./node_modules/lodash/_trimmedEndIndex.js"),reTrimStart=/^\s+/;module.exports=function baseTrim(string){return string?string.slice(0,trimmedEndIndex(string)+1).replace(reTrimStart,""):string}},"./node_modules/lodash/_createRange.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseRange=__webpack_require__("./node_modules/lodash/_baseRange.js"),isIterateeCall=__webpack_require__("./node_modules/lodash/_isIterateeCall.js"),toFinite=__webpack_require__("./node_modules/lodash/toFinite.js");module.exports=function createRange(fromRight){return function(start,end,step){return step&&"number"!=typeof step&&isIterateeCall(start,end,step)&&(end=step=void 0),start=toFinite(start),void 0===end?(end=start,start=0):end=toFinite(end),step=void 0===step?start<end?1:-1:toFinite(step),baseRange(start,end,step,fromRight)}}},"./node_modules/lodash/_isIterateeCall.js":(module,__unused_webpack_exports,__webpack_require__)=>{var eq=__webpack_require__("./node_modules/lodash/eq.js"),isArrayLike=__webpack_require__("./node_modules/lodash/isArrayLike.js"),isIndex=__webpack_require__("./node_modules/lodash/_isIndex.js"),isObject=__webpack_require__("./node_modules/lodash/isObject.js");module.exports=function isIterateeCall(value,index,object){if(!isObject(object))return!1;var type=typeof index;return!!("number"==type?isArrayLike(object)&&isIndex(index,object.length):"string"==type&&index in object)&&eq(object[index],value)}},"./node_modules/lodash/_trimmedEndIndex.js":module=>{var reWhitespace=/\s/;module.exports=function trimmedEndIndex(string){for(var index=string.length;index--&&reWhitespace.test(string.charAt(index)););return index}},"./node_modules/lodash/range.js":(module,__unused_webpack_exports,__webpack_require__)=>{var range=__webpack_require__("./node_modules/lodash/_createRange.js")();module.exports=range},"./node_modules/lodash/toFinite.js":(module,__unused_webpack_exports,__webpack_require__)=>{var toNumber=__webpack_require__("./node_modules/lodash/toNumber.js");module.exports=function toFinite(value){return value?Infinity===(value=toNumber(value))||-Infinity===value?17976931348623157e292*(value<0?-1:1):value==value?value:0:0===value?value:0}},"./node_modules/lodash/toNumber.js":(module,__unused_webpack_exports,__webpack_require__)=>{var baseTrim=__webpack_require__("./node_modules/lodash/_baseTrim.js"),isObject=__webpack_require__("./node_modules/lodash/isObject.js"),isSymbol=__webpack_require__("./node_modules/lodash/isSymbol.js"),reIsBadHex=/^[-+]0x[0-9a-f]+$/i,reIsBinary=/^0b[01]+$/i,reIsOctal=/^0o[0-7]+$/i,freeParseInt=parseInt;module.exports=function toNumber(value){if("number"==typeof value)return value;if(isSymbol(value))return NaN;if(isObject(value)){var other="function"==typeof value.valueOf?value.valueOf():value;value=isObject(other)?other+"":other}if("string"!=typeof value)return 0===value?value:+value;value=baseTrim(value);var isBinary=reIsBinary.test(value);return isBinary||reIsOctal.test(value)?freeParseInt(value.slice(2),isBinary?2:8):reIsBadHex.test(value)?NaN:+value}},"./src/components/ModularComponents/Flyout/Flyout.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ModularComponents/Flyout/Flyout.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ModularComponents/FlyoutItemContainer/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>ModularComponents_FlyoutItemContainer});var react=__webpack_require__("./node_modules/react/index.js"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),Icon=__webpack_require__("./src/components/Icon/index.js");__webpack_require__("./src/components/ModularComponents/Flyout/Flyout.scss");var FlyoutItemContainer=(0,react.forwardRef)((function(props,ref){var obj,key,value,label=props.label,title=props.title,dataElement=props.dataElement,disabled=props.disabled,additionalClass=props.additionalClass,icon=props.icon,ariaKeyshortcuts=props.ariaKeyshortcuts,children=props.children,index=props.index,isChild=props.isChild,elementDOM=props.elementDOM,onKeyDownHandler=props.onKeyDownHandler,onClickHandler=props.onClickHandler,t=(0,useTranslation.B)().t;return react.createElement("li",{key:label,ref,className:classnames_default()((obj={"flyout-item-container":!0,disabled},key=additionalClass,value=!0,key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj))},function(){if(elementDOM)return react.createElement("div",{className:"custom-element-wrapper"},icon,elementDOM);var flyoutItemLabel=null!=label?label:title,finalLabel="string"==typeof flyoutItemLabel?t(flyoutItemLabel):flyoutItemLabel;return react.createElement("button",{className:"flyout-item",disabled,onClick:onClickHandler(props,isChild,index),"aria-disabled":disabled,onKeyDown:onKeyDownHandler,"data-element":dataElement},react.createElement("div",{className:"icon-label-wrapper"},icon,finalLabel&&react.createElement("span",{className:"flyout-item-label"},finalLabel)),ariaKeyshortcuts&&react.createElement("span",{className:"hotkey-wrapper"},"(".concat(ariaKeyshortcuts,")")),children&&react.createElement(Icon.A,{className:"icon-open-submenu",glyph:"icon-chevron-right"}))}())}));FlyoutItemContainer.propTypes={label:prop_types_default().oneOfType([prop_types_default().string,prop_types_default().object]),title:prop_types_default().string,dataElement:prop_types_default().string,disabled:prop_types_default().bool,additionalClass:prop_types_default().string,icon:prop_types_default().node,ariaKeyshortcuts:prop_types_default().string,children:prop_types_default().array,index:prop_types_default().number,isChild:prop_types_default().bool,elementDOM:prop_types_default().node,onKeyDownHandler:prop_types_default().func,onClickHandler:prop_types_default().func},FlyoutItemContainer.displayName="FlyoutItemContainer";const FlyoutItemContainer_FlyoutItemContainer=FlyoutItemContainer;FlyoutItemContainer.__docgenInfo={description:"",methods:[],displayName:"FlyoutItemContainer",props:{label:{description:"",type:{name:"union",value:[{name:"string"},{name:"object"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},disabled:{description:"",type:{name:"bool"},required:!1},additionalClass:{description:"",type:{name:"string"},required:!1},icon:{description:"",type:{name:"node"},required:!1},ariaKeyshortcuts:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"array"},required:!1},index:{description:"",type:{name:"number"},required:!1},isChild:{description:"",type:{name:"bool"},required:!1},elementDOM:{description:"",type:{name:"node"},required:!1},onKeyDownHandler:{description:"",type:{name:"func"},required:!1},onClickHandler:{description:"",type:{name:"func"},required:!1}}};const ModularComponents_FlyoutItemContainer=FlyoutItemContainer_FlyoutItemContainer;FlyoutItemContainer_FlyoutItemContainer.__docgenInfo={description:"",methods:[],displayName:"FlyoutItemContainer",props:{label:{description:"",type:{name:"union",value:[{name:"string"},{name:"object"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},disabled:{description:"",type:{name:"bool"},required:!1},additionalClass:{description:"",type:{name:"string"},required:!1},icon:{description:"",type:{name:"node"},required:!1},ariaKeyshortcuts:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"array"},required:!1},index:{description:"",type:{name:"number"},required:!1},isChild:{description:"",type:{name:"bool"},required:!1},elementDOM:{description:"",type:{name:"node"},required:!1},onKeyDownHandler:{description:"",type:{name:"func"},required:!1},onClickHandler:{description:"",type:{name:"func"},required:!1}}}}}]);