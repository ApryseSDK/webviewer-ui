(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[3207],{"./src/components/ZoomOverlay/ZoomOverlay.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),redux__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_ZoomOverlay__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/ZoomOverlay/ZoomOverlay.js"),constants_commonColors__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/constants/commonColors.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/ZoomOverlay",component:_ZoomOverlay__WEBPACK_IMPORTED_MODULE_2__.A};var initialState={viewer:{disabledElements:{},openElements:["zoomOverlay"],colorMap:[{colorMapKey:constants_commonColors__WEBPACK_IMPORTED_MODULE_3__.R[0]}],toolButtonObjects:{MarqueeZoomTool:{dataElement:"marqueeToolButton",showColor:"never"}},customElementOverrides:[{marqueeToolButton:{disabled:!0}}]}};var store=(0,redux__WEBPACK_IMPORTED_MODULE_4__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState}));function onClickZoomLevelOption(){console.log("onClickZoomLevelOption")}function fitToWidth(){console.log("fitToWidth")}function fitToPage(){console.log("fitToPage")}function onClickMarqueeZoom(){console.log("onClickMarqueeZoom")}function Basic(){var props={isMarqueeToolButtonDisabled:!1,isMarqueeZoomActive:!1,zoomList:[.1,.25,.5,1,1.25,1.5,2,4,8,16,64],currentZoomLevel:1.09,isReaderMode:!1,onClickMarqueeZoom,onClickZoomLevelOption,fitToWidth,fitToPage};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{width:150}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ZoomOverlay__WEBPACK_IMPORTED_MODULE_2__.A,props)))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"function Basic() {\n  const zoomList = [0.1, 0.25, 0.5, 1, 1.25, 1.5, 2, 4, 8, 16, 64];\n  const currentZoomLevel = 1.09;\n  const isReaderMode = false;\n  const props = {\n    isMarqueeToolButtonDisabled: false,\n    isMarqueeZoomActive: false,\n    zoomList,\n    currentZoomLevel,\n    isReaderMode,\n    onClickMarqueeZoom,\n    onClickZoomLevelOption,\n    fitToWidth,\n    fitToPage\n  };\n  return <Provider store={store}>\n      <div style={{\n      width: 150\n    }}>\n        <ZoomOverlay {...props} />\n      </div>\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/OverlayItem/OverlayItem.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.OverlayItem{border:none;background-color:transparent;margin:2px 0;display:flex;align-items:center;height:24px;padding:0 0 0 10px;cursor:pointer;width:100%}:host(:not([data-tabbing=true])) .OverlayItem,html:not([data-tabbing=true]) .OverlayItem{outline:none}.OverlayItem.selected,.OverlayItem:hover{background:var(--popup-button-hover)}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ToolButton/ToolButton.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.tool-button-container{display:flex;flex-direction:row;align-items:center;height:26px;margin:0 6px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .tool-button-container{margin:0 10px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .tool-button-container{margin:0 10px}}.tool-button-container .tool-button-arrow-container{width:13px;height:100%;margin-right:2px}.tool-button-container .tool-button-arrow-container .tool-button-arrow-inner-container{font-size:13px;display:flex;align-items:center;height:100%;cursor:pointer}.tool-button-container .tool-button-arrow-container .tool-button-arrow-inner-container .tool-button-arrow-down,.tool-button-container .tool-button-arrow-container .tool-button-arrow-inner-container .tool-button-arrow-up{width:13px;height:13px}.tool-button-container .tool-button-arrow-container .tool-button-arrow-inner-container .tool-button-arrow-up{margin-top:-1px}.tool-button-container .tool-button{display:flex;flex-direction:row;align-items:center;border-radius:4px;margin-right:1px}.tool-button-container .tool-button.Button{width:26px;height:26px}.tool-button-container .tool-button.Button:hover{background:var(--tools-overlay-button-hover)}.tool-button-container .tool-button.active,.tool-button-container .tool-button.Button.active{background:var(--tools-overlay-button-active)}.tool-button-container .tool-button.active .Icon{color:var(--selected-icon-color)}.tool-button-container .tool-button.active div:hover{background:none}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ZoomOverlay/ZoomOverlay.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.ZoomItem{border:none;background-color:transparent;display:flex;flex-direction:row;align-items:center;padding:2px 19px 2px 6px;cursor:pointer;width:100%}:host(:not([data-tabbing=true])) .ZoomItem,html:not([data-tabbing=true]) .ZoomItem{outline:none}.ZoomItem.selected,.ZoomItem:hover{background:var(--popup-button-hover)}.ZoomItem .Icon{margin:4px 8px 4px 4px}.ZoomItem Button{height:auto}.ZoomItem.Button{justify-content:flex-start}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/OverlayItem/OverlayItem.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/OverlayItem/OverlayItem.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ToolButton/ToolButton.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ToolButton/ToolButton.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ZoomOverlay/ZoomOverlay.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ZoomOverlay/ZoomOverlay.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ToolButton/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_ToolButton});var react=__webpack_require__("./node_modules/react/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),es=__webpack_require__("./node_modules/react-redux/es/index.js"),Button=__webpack_require__("./src/components/Button/index.js"),core=__webpack_require__("./src/core/index.js"),toolStylesExist=__webpack_require__("./src/helpers/toolStylesExist.js"),getToolStyles=__webpack_require__("./src/helpers/getToolStyles.js"),hotkeysManager=__webpack_require__("./src/helpers/hotkeysManager.js"),getColor=__webpack_require__("./src/helpers/getColor.js"),map=__webpack_require__("./src/constants/map.js"),defaultTool=__webpack_require__("./src/constants/defaultTool.js"),actions=__webpack_require__("./src/redux/actions/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js");__webpack_require__("./src/components/ToolButton/ToolButton.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={toolName:prop_types_default().string.isRequired,group:prop_types_default().string,className:prop_types_default().string},ToolButton_ToolButton=function(_param){var toolName=_param.toolName,className=_param.className,restProps=_object_without_properties(_param,["toolName","className"]),_useSelector=_sliced_to_array((0,es.d4)((function(state){return[selectors.A.getActiveToolName(state)===toolName,selectors.A.getIconColor(state,(0,map.YP)(toolName)),selectors.A.getToolButtonObject(state,toolName),selectors.A.getCustomElementOverrides(state,selectors.A.getToolButtonDataElement(state,toolName))]}),es.bN),4),isActive=_useSelector[0],iconColorKey=_useSelector[1],toolButtonObject=_useSelector[2],customOverrides=_useSelector[3],dispatch=(0,es.wA)(),_toolButtonObject_group=toolButtonObject.group,group=void 0===_toolButtonObject_group?"":_toolButtonObject_group,restObjectData=_object_without_properties(toolButtonObject,["group"]);(0,react.useEffect)((function(){void 0!==(null==customOverrides?void 0:customOverrides.disable)&&(customOverrides.disable?hotkeysManager.Ay.off(toolName):hotkeysManager.Ay.on(toolName))}),[customOverrides,toolName]);var color="",fillColor="",strokeColor="",showColor=(null==customOverrides?void 0:customOverrides.showColor)||toolButtonObject.showColor;if("always"===showColor||"active"===showColor&&isActive){var _toolStyles_iconColorKey_toHexString,_toolStyles_iconColorKey,toolStyles=(0,getToolStyles.A)(toolName);color=null==toolStyles||null===(_toolStyles_iconColorKey=toolStyles[iconColorKey])||void 0===_toolStyles_iconColorKey||null===(_toolStyles_iconColorKey_toHexString=_toolStyles_iconColorKey.toHexString)||void 0===_toolStyles_iconColorKey_toHexString?void 0:_toolStyles_iconColorKey_toHexString.call(_toolStyles_iconColorKey),fillColor=(0,getColor.A)(null==toolStyles?void 0:toolStyles.FillColor),strokeColor=(0,getColor.A)(null==toolStyles?void 0:toolStyles.StrokeColor),toolName.indexOf("AnnotationCreateFreeText")>-1&&0===(null==toolStyles?void 0:toolStyles.StrokeThickness)&&(strokeColor="ff000000")}return react.createElement(Button.A,function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({className:classnames_default()(_define_property({"tool-button":!0,hasStyles:(0,toolStylesExist.A)(toolName)},className,className)),onClick:function(){isActive?"AnnotationCreateStamp"!==toolName&&"AnnotationCreateRedaction"!==toolName&&"AnnotationEraserTool"!==toolName&&(0,toolStylesExist.A)(toolName)&&(dispatch(actions.A.toggleElement("toolStylePopup")),"AnnotationCreateRubberStamp"===toolName&&core.A.setToolMode(defaultTool.A)):("miscTools"===group&&dispatch(actions.A.closeElement("toolStylePopup")),core.A.setToolMode(toolName),dispatch(actions.A.setActiveToolGroup(group)),dispatch(actions.A.setLastPickedToolForGroup(group,toolName)),"AnnotationCreateRubberStamp"===toolName&&dispatch(actions.A.openElement("toolStylePopup")))},isActive,color,fillColor,strokeColor},restProps,restObjectData))};ToolButton_ToolButton.propTypes=propTypes;const components_ToolButton_ToolButton=ToolButton_ToolButton;ToolButton_ToolButton.__docgenInfo={description:"",methods:[],displayName:"ToolButton",props:{toolName:{description:"",type:{name:"string"},required:!0},group:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1}}};const components_ToolButton=components_ToolButton_ToolButton;components_ToolButton_ToolButton.__docgenInfo={description:"",methods:[],displayName:"ToolButton",props:{toolName:{description:"",type:{name:"string"},required:!0},group:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1}}}},"./src/components/ZoomOverlay/ZoomOverlay.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_ZoomOverlay_ZoomOverlay});var react=__webpack_require__("./node_modules/react/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),classnames=(__webpack_require__("./src/components/OverlayItem/OverlayItem.scss"),__webpack_require__("./node_modules/classnames/index.js")),classnames_default=__webpack_require__.n(classnames);function _defineProperties(target,props){for(var i=0;i<props.length;i++){var descriptor=props[i];descriptor.enumerable=descriptor.enumerable||!1,descriptor.configurable=!0,"value"in descriptor&&(descriptor.writable=!0),Object.defineProperty(target,descriptor.key,descriptor)}}function _get_prototype_of(o){return _get_prototype_of=Object.setPrototypeOf?Object.getPrototypeOf:function getPrototypeOf(o){return o.__proto__||Object.getPrototypeOf(o)},_get_prototype_of(o)}function _possible_constructor_return(self,call){return!call||"object"!==function _type_of(obj){return obj&&"undefined"!=typeof Symbol&&obj.constructor===Symbol?"symbol":typeof obj}(call)&&"function"!=typeof call?function _assert_this_initialized(self){if(void 0===self)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return self}(self):call}function _set_prototype_of(o,p){return _set_prototype_of=Object.setPrototypeOf||function setPrototypeOf(o,p){return o.__proto__=p,o},_set_prototype_of(o,p)}function _create_super(Derived){var hasNativeReflectConstruct=function _is_native_reflect_construct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}();return function _createSuperInternal(){var result,Super=_get_prototype_of(Derived);if(hasNativeReflectConstruct){var NewTarget=_get_prototype_of(this).constructor;result=Reflect.construct(Super,arguments,NewTarget)}else result=Super.apply(this,arguments);return _possible_constructor_return(this,result)}}var OverlayItem_OverlayItem=function(_superClass){!function _inherits(subClass,superClass){if("function"!=typeof superClass&&null!==superClass)throw new TypeError("Super expression must either be null or a function");subClass.prototype=Object.create(superClass&&superClass.prototype,{constructor:{value:subClass,writable:!0,configurable:!0}}),superClass&&_set_prototype_of(subClass,superClass)}(OverlayItem,_superClass);var _super=_create_super(OverlayItem);function OverlayItem(){return function _class_call_check(instance,Constructor){if(!(instance instanceof Constructor))throw new TypeError("Cannot call a class as a function")}(this,OverlayItem),_super.apply(this,arguments)}return function _create_class(Constructor,protoProps,staticProps){return protoProps&&_defineProperties(Constructor.prototype,protoProps),staticProps&&_defineProperties(Constructor,staticProps),Constructor}(OverlayItem,[{key:"render",value:function render(){var _this_props=this.props,buttonName=_this_props.buttonName,role=_this_props.role,selected=_this_props.selected;return react.createElement("button",{className:classnames_default()({OverlayItem:!0,selected}),onClick:this.props.onClick,"aria-label":buttonName,role},react.createElement("div",{className:"ButtonText"},buttonName))}}]),OverlayItem}(react.PureComponent);!function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}(OverlayItem_OverlayItem,"propTypes",{onClick:prop_types_default().func,buttonName:prop_types_default().string,role:prop_types_default().string,selected:prop_types_default().bool});const components_OverlayItem_OverlayItem=OverlayItem_OverlayItem;OverlayItem_OverlayItem.__docgenInfo={description:"",methods:[],displayName:"OverlayItem",props:{onClick:{description:"",type:{name:"func"},required:!1},buttonName:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},selected:{description:"",type:{name:"bool"},required:!1}}};const components_OverlayItem=components_OverlayItem_OverlayItem;components_OverlayItem_OverlayItem.__docgenInfo={description:"",methods:[],displayName:"OverlayItem",props:{onClick:{description:"",type:{name:"func"},required:!1},buttonName:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},selected:{description:"",type:{name:"bool"},required:!1}}};var ToolButton=__webpack_require__("./src/components/ToolButton/index.js"),Button=__webpack_require__("./src/components/Button/index.js");__webpack_require__("./src/components/ZoomOverlay/ZoomOverlay.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={zoomList:prop_types_default().arrayOf(prop_types_default().number).isRequired,currentZoomLevel:prop_types_default().number.isRequired,isReaderMode:prop_types_default().bool.isRequired,isMarqueeZoomActive:prop_types_default().bool.isRequired,onClickZoomLevelOption:prop_types_default().func.isRequired,onClickMarqueeZoom:prop_types_default().func.isRequired,fitToWidth:prop_types_default().func.isRequired,fitToPage:prop_types_default().func.isRequired,isMarqueeToolButtonDisabled:prop_types_default().bool};function ZoomOverlay_ZoomOverlay(props){var t=_sliced_to_array((0,useTranslation.B)(),1)[0],zoomList=props.zoomList,currentZoomLevel=props.currentZoomLevel,isReaderMode=props.isReaderMode,isMarqueeZoomActive=props.isMarqueeZoomActive,fitToWidth=props.fitToWidth,fitToPage=props.fitToPage,onClickZoomLevelOption=props.onClickZoomLevelOption,onClickMarqueeZoom=props.onClickMarqueeZoom,isMarqueeToolButtonDisabled=props.isMarqueeToolButtonDisabled;return react.createElement(react.Fragment,null,react.createElement(Button.A,{className:"ZoomItem",img:"icon-header-zoom-fit-to-width",label:t("action.fitToWidth"),ariaLabel:t("action.fitToWidth"),role:"option",onClick:fitToWidth}),!isReaderMode&&react.createElement(Button.A,{className:"ZoomItem",img:"icon-header-zoom-fit-to-page",label:t("action.fitToPage"),ariaLabel:t("action.fitToPage"),role:"option",onClick:fitToPage}),react.createElement("div",{className:"divider"}),zoomList.map((function(zoomValue,i){return react.createElement(components_OverlayItem,{key:i,onClick:function(){return onClickZoomLevelOption(zoomValue)},buttonName:"".concat(100*zoomValue,"%"),selected:currentZoomLevel===zoomValue,role:"option"})})),!isReaderMode&&react.createElement(react.Fragment,null,!isMarqueeToolButtonDisabled&&react.createElement("div",{className:"dividerSmall"}),react.createElement("div",{onClick:function(){return onClickMarqueeZoom()}},react.createElement(ToolButton.A,{className:classnames_default()({ZoomItem:!0,selected:isMarqueeZoomActive}),role:"option",toolName:"MarqueeZoomTool",label:t("tool.Marquee"),img:"icon-header-zoom-marquee"}))))}ZoomOverlay_ZoomOverlay.propTypes=propTypes;const components_ZoomOverlay_ZoomOverlay=ZoomOverlay_ZoomOverlay;ZoomOverlay_ZoomOverlay.__docgenInfo={description:"",methods:[],displayName:"ZoomOverlay",props:{zoomList:{description:"",type:{name:"arrayOf",value:{name:"number"}},required:!0},currentZoomLevel:{description:"",type:{name:"number"},required:!0},isReaderMode:{description:"",type:{name:"bool"},required:!0},isMarqueeZoomActive:{description:"",type:{name:"bool"},required:!0},onClickZoomLevelOption:{description:"",type:{name:"func"},required:!0},onClickMarqueeZoom:{description:"",type:{name:"func"},required:!0},fitToWidth:{description:"",type:{name:"func"},required:!0},fitToPage:{description:"",type:{name:"func"},required:!0},isMarqueeToolButtonDisabled:{description:"",type:{name:"bool"},required:!1}}}},"./src/helpers/getColor.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function __WEBPACK_DEFAULT_EXPORT__(color){var _color_toHexString;return((null==color||null===(_color_toHexString=color.toHexString)||void 0===_color_toHexString?void 0:_color_toHexString.call(color))||"").substring(1)}__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__})}}]);