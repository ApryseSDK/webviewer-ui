(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[8695],{"./src/components/ColorPickerOverlay/ColorPickerOverlay.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_ColorPickerOverlay__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/ColorPickerOverlay/ColorPickerOverlay.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/redux/initialState.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/ColorPickerOverlay",component:_ColorPickerOverlay__WEBPACK_IMPORTED_MODULE_1__.A,parameters:{customizableUI:!0}};var store=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_4__.U1)({reducer:function(){return src_redux_initialState__WEBPACK_IMPORTED_MODULE_3__.A}}),BasicComponent=function(param){var children=param.children;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-element":"textColorButton"}),children)};function Basic(){return store.getState().viewer.openElements.colorPickerOverlay=!0,react__WEBPACK_IMPORTED_MODULE_0__.createElement(BasicComponent,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ColorPickerOverlay__WEBPACK_IMPORTED_MODULE_1__.A,{onStyleChange:function(){},portalElementId:"storybook-root"}))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"function Basic() {\n  store.getState().viewer.openElements.colorPickerOverlay = true;\n  return <BasicComponent>\n      <ColorPickerOverlay onStyleChange={() => {}} portalElementId={'storybook-root'} />\n    </BasicComponent>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPickerOverlay/ColorPickerOverlay.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".open.ColorPickerOverlay{visibility:visible}.closed.ColorPickerOverlay{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.ColorPickerOverlay{position:absolute;z-index:70;justify-content:center;align-items:center}.ColorPickerOverlay:empty{padding:0}.ColorPickerOverlay .buttons{display:flex}.ColorPickerOverlay .Button{margin:4px;width:32px;height:32px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPickerOverlay .Button{width:42px;height:42px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPickerOverlay .Button{width:42px;height:42px}}.ColorPickerOverlay .Button:hover{background:var(--popup-button-hover)}.ColorPickerOverlay .Button:hover:disabled{background:none}.ColorPickerOverlay .Button .Icon{width:18px;height:18px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPickerOverlay .Button .Icon{width:24px;height:24px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPickerOverlay .Button .Icon{width:24px;height:24px}}.is-vertical.ColorPickerOverlay .Button.main-menu-button{width:100%;border-radius:0;justify-content:flex-start;padding-left:var(--padding-small);padding-right:var(--padding-small);margin:0 0 var(--padding-tiny) 0}.is-vertical.ColorPickerOverlay .Button.main-menu-button:first-child{margin-top:var(--padding-tiny)}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .is-vertical.ColorPickerOverlay .Button.main-menu-button{width:100%;height:32px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .is-vertical.ColorPickerOverlay .Button.main-menu-button{width:100%;height:32px}}.is-vertical.ColorPickerOverlay .Button.main-menu-button .Icon{margin-right:10px}.is-vertical.ColorPickerOverlay .Button.main-menu-button span{white-space:nowrap}@keyframes bottom-up{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes up-bottom{0%{transform:translateY(0)}to{transform:translateY(100%)}}.ColorPickerOverlay{border-radius:4px;box-shadow:0 0 3px 0 var(--document-box-shadow);background:var(--component-background);display:flex;flex-direction:column;padding:16px;z-index:90}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/ColorPickerOverlay/ColorPickerOverlay.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPickerOverlay/ColorPickerOverlay.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ColorPickerOverlay/ColorPickerOverlay.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),react_dom__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-dom/index.js"),selectors__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/redux/selectors/index.js"),components_DataElementWrapper__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/DataElementWrapper/index.js"),components_ColorPalette__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/ColorPalette/index.js"),actions__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/redux/actions/index.js"),hooks_useOnClickOutside__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/hooks/useOnClickOutside.js"),helpers_getOverlayPositionBasedOn__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./src/helpers/getOverlayPositionBasedOn.js"),constants_dataElement__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/constants/dataElement.js"),classnames__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_9___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_9__),helpers_getRootNode__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./src/helpers/getRootNode.js");__webpack_require__("./src/components/ColorPickerOverlay/ColorPickerOverlay.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const __WEBPACK_DEFAULT_EXPORT__=function(param){var color=param.color,onStyleChange=param.onStyleChange,_param_portalElementId=param.portalElementId,portalElementId=void 0===_param_portalElementId?"app":_param_portalElementId,_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((function(){return{left:"555px",right:"auto",top:"auto"}})),2),position=_useState[0],setPosition=_useState[1],overlayRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),isOpen=_sliced_to_array((0,react_redux__WEBPACK_IMPORTED_MODULE_1__.d4)((function(state){return[selectors__WEBPACK_IMPORTED_MODULE_3__.A.isElementOpen(state,"colorPickerOverlay")]})),1)[0],dispatch=(0,react_redux__WEBPACK_IMPORTED_MODULE_1__.wA)();return(0,hooks_useOnClickOutside__WEBPACK_IMPORTED_MODULE_7__.A)(overlayRef,(function(e){var headerButton=(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_11__.Ay)().querySelector('[data-element="'.concat(constants_dataElement__WEBPACK_IMPORTED_MODULE_8__.A.OFFICE_EDITOR_TEXT_COLOR_BUTTON,'"]')),flyoutButton=(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_11__.Ay)().querySelector('[data-element="'.concat(constants_dataElement__WEBPACK_IMPORTED_MODULE_8__.A.OFFICE_EDITOR_COLOR_PICKER,'"]'));(null==headerButton?void 0:headerButton.contains(e.target))||(null==flyoutButton?void 0:flyoutButton.contains(e.target))||dispatch(actions__WEBPACK_IMPORTED_MODULE_6__.A.closeElements(["colorPickerOverlay"]))})),(0,react__WEBPACK_IMPORTED_MODULE_0__.useLayoutEffect)((function(){if(isOpen){var onResize=function(){var overlayPosition=(0,helpers_getOverlayPositionBasedOn__WEBPACK_IMPORTED_MODULE_12__.A)("textColorButton",overlayRef);setPosition(overlayPosition)};return onResize(),window.addEventListener("resize",onResize),function(){return window.removeEventListener("resize",onResize)}}}),[isOpen]),(0,react_dom__WEBPACK_IMPORTED_MODULE_2__.createPortal)(react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_DataElementWrapper__WEBPACK_IMPORTED_MODULE_4__.A,{"data-element":"colorPickerOverlay",className:classnames__WEBPACK_IMPORTED_MODULE_9___default()({ColorPickerOverlay:!0,Popup:!0,open:isOpen,closed:!isOpen}),style:position,ref:overlayRef},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_ColorPalette__WEBPACK_IMPORTED_MODULE_5__.A,{color,property:"TextColor",onStyleChange,useMobileMinMaxWidth:!0})),(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_11__.Ay)().getElementById(portalElementId))}}}]);