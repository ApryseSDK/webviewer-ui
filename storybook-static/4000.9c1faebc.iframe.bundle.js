(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4e3],{"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".MobilePanelWrapper{border-radius:4px;box-shadow:0 0 3px 0 var(--document-box-shadow);background:var(--component-background);overflow-y:auto;max-height:100%}@media(max-height:500px){.App:not(.is-web-component) .MobilePanelWrapper{overflow:auto;max-height:100%}}@container (max-height: 500px){.App.is-web-component .MobilePanelWrapper{overflow:auto;max-height:100%}}.open.MobilePanelWrapper{visibility:visible}.closed.MobilePanelWrapper{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.MobilePanelWrapper .swipe-indicator-wrapper .swipe-indicator{background:var(--swipe-indicator-bg);border-radius:2px;height:4px;width:38px;position:absolute;top:12px;margin-left:auto;margin-right:auto;left:0;right:0}@media(min-width:641px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .MobilePanelWrapper .swipe-indicator-wrapper .swipe-indicator,.MobilePanelWrapper .swipe-indicator-wrapper .App:not(.is-in-desktop-only-mode):not(.is-web-component) .swipe-indicator{display:none}}@container (min-width: 641px){.App.is-web-component:not(.is-in-desktop-only-mode) .MobilePanelWrapper .swipe-indicator-wrapper .swipe-indicator,.MobilePanelWrapper .swipe-indicator-wrapper .App.is-web-component:not(.is-in-desktop-only-mode) .swipe-indicator{display:none}}.MobilePanelWrapper{position:fixed;bottom:0;padding-bottom:10px;z-index:100;width:100%;height:100%;display:block;justify-content:center;align-items:center;overflow:hidden;background-color:var(--panel-background);transition:height,max-height .3s ease-out}.MobilePanelWrapper.full-size{max-height:100%}.MobilePanelWrapper.half-size{max-height:50%}.MobilePanelWrapper.small-size{max-height:140px;overflow:hidden}.MobilePanelWrapper .mobile-panel-body{top:-30px;position:relative}.MobilePanelWrapper .swipe-indicator-wrapper{position:relative;width:100%;height:60px;top:0;z-index:1;pointer-events:auto}.MobilePanelWrapper .swipe-indicator-wrapper .swipe-indicator{margin:10px auto;top:0}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_swipeable__WEBPACK_IMPORTED_MODULE_2__=(__webpack_require__("./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.scss"),__webpack_require__("./node_modules/react-swipeable/es/index.js")),helpers_getDeviceSize__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/helpers/getDeviceSize.js"),react_redux__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react-redux/es/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),selectors__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/redux/selectors/index.js"),actions__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/redux/actions/index.js"),classnames__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_7__),constants_panel__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./src/constants/panel.js"),hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/hooks/useResizeObserver/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var _obj,propTypes={children:prop_types__WEBPACK_IMPORTED_MODULE_10___default().node},minimumSizeForPanel=(_define_property(_obj={notesPanel:constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE,stylePanel:constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE,textEditingPanel:constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE,tabPanel:constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE},constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.FORM_FIELD,constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE),_define_property(_obj,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.INDEX,constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE),_obj),MobilePanelWrapper=function(param){var _children_props,children=param.children,isMobile=(0,helpers_getDeviceSize__WEBPACK_IMPORTED_MODULE_3__.IS)(),dispatch=(0,react_redux__WEBPACK_IMPORTED_MODULE_4__.wA)(),contentElement=null==children||null===(_children_props=children.props)||void 0===_children_props?void 0:_children_props.dataElement,_useSelector=_sliced_to_array((0,react_redux__WEBPACK_IMPORTED_MODULE_4__.d4)((function(state){return[selectors__WEBPACK_IMPORTED_MODULE_5__.A.isElementOpen(state,"MobilePanelWrapper"),selectors__WEBPACK_IMPORTED_MODULE_5__.A.isElementOpen(state,contentElement),selectors__WEBPACK_IMPORTED_MODULE_5__.A.getDocumentContentContainerWidthStyle(state),selectors__WEBPACK_IMPORTED_MODULE_5__.A.getMobilePanelSize(state),selectors__WEBPACK_IMPORTED_MODULE_5__.A.isElementDisabled(state,"searchAndReplace")]})),5),isOpen=_useSelector[0],isContentOpen=_useSelector[1],documentContainerWidthStyle=_useSelector[2],mobilePanelSize=_useSelector[3],isSearchAndReplaceDisabled=_useSelector[4],_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),2),style=_useState[0],setStyle=_useState[1],_useState1=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)({}),2),wrapperBodyStyle=_useState1[0],setWrapperBodyStyle=_useState1[1],setMobilePanelSize=function(size){dispatch(actions__WEBPACK_IMPORTED_MODULE_6__.A.setMobilePanelSize(size))},_useResizeObserver=_sliced_to_array((0,hooks_useResizeObserver__WEBPACK_IMPORTED_MODULE_9__.A)(),2),wrapperRef=_useResizeObserver[0],dimensions=_useResizeObserver[1];(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){var panelsStartingAtHalfSize=[constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.RUBBER_STAMP,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.STYLE,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.NOTES,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.SEARCH,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.TABS,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.TEXT_EDITING,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.REDACTION,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.FORM_FIELD,constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.INDEX];isOpen&&(panelsStartingAtHalfSize.includes(contentElement)?setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE):setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.SMALL_SIZE))}),[isOpen]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){isContentOpen||dispatch(actions__WEBPACK_IMPORTED_MODULE_6__.A.closeElement("MobilePanelWrapper"))}),[isContentOpen]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){setStyle({width:documentContainerWidthStyle})}),[documentContainerWidthStyle]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){null!==dimensions.height&&setWrapperBodyStyle({display:"flex",flexDirection:"column",height:dimensions.height-16})}),[dimensions]);var closePanel=function(){dispatch(actions__WEBPACK_IMPORTED_MODULE_6__.A.closeElement("MobilePanelWrapper")),dispatch(actions__WEBPACK_IMPORTED_MODULE_6__.A.closeElement(contentElement))};if(!isMobile||!isOpen)return null;var onContainerClick=function(e){e.stopPropagation()};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-element":"MobilePanelWrapper",className:classnames__WEBPACK_IMPORTED_MODULE_7___default()("MobilePanelWrapper",_define_property({},mobilePanelSize,!0)),ref:wrapperRef,style,role:"none",onClick:onContainerClick,onKeyDown:onContainerClick},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_swipeable__WEBPACK_IMPORTED_MODULE_2__.Hx,{onSwipedUp:function(){switch(mobilePanelSize){case constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.SMALL_SIZE:setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE);break;case constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE:setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.FULL_SIZE)}},onSwipedDown:function(){var currentMobilePanelSize=mobilePanelSize;currentMobilePanelSize===minimumSizeForPanel[contentElement]&&(currentMobilePanelSize=constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.SMALL_SIZE);var isSearchPanelActiveWithSearchAndReplace=!isSearchAndReplaceDisabled&&contentElement===constants_panel__WEBPACK_IMPORTED_MODULE_8__.BB.SEARCH;switch(currentMobilePanelSize){case constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.FULL_SIZE:setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE);break;case constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.HALF_SIZE:isSearchPanelActiveWithSearchAndReplace?closePanel():setMobilePanelSize(constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.SMALL_SIZE);break;case constants_panel__WEBPACK_IMPORTED_MODULE_8__.WA.SMALL_SIZE:closePanel()}},trackMouse:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"swipe-indicator-wrapper"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"swipe-indicator"}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"mobile-panel-body",style:wrapperBodyStyle},react__WEBPACK_IMPORTED_MODULE_0__.Children.map(children,(function(child){return react__WEBPACK_IMPORTED_MODULE_0__.cloneElement(child,{panelSize:mobilePanelSize})}))))};MobilePanelWrapper.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=MobilePanelWrapper;MobilePanelWrapper.__docgenInfo={description:"",methods:[],displayName:"MobilePanelWrapper",props:{children:{description:"",type:{name:"node"},required:!1}}}},"./src/components/Panel/Panel.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_Panel_Panel});var react=__webpack_require__("./node_modules/react/index.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),selectors=__webpack_require__("./src/redux/selectors/index.js"),getDeviceSize=__webpack_require__("./src/helpers/getDeviceSize.js"),Icon=__webpack_require__("./src/components/Icon/index.js"),actions=__webpack_require__("./src/redux/actions/index.js"),panel=(__webpack_require__("./src/components/Panel/Panel.scss"),__webpack_require__("./src/constants/panel.js")),ResizeBar=__webpack_require__("./src/components/ResizeBar/index.js"),device=__webpack_require__("./src/helpers/device.js"),MobilePanelWrapper=__webpack_require__("./src/components/ModularComponents/MobilePanelWrapper/MobilePanelWrapper.js");const ModularComponents_MobilePanelWrapper=MobilePanelWrapper.A;MobilePanelWrapper.A.__docgenInfo={description:"",methods:[],displayName:"MobilePanelWrapper",props:{children:{description:"",type:{name:"node"},required:!1}}};var prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types);function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var DesktopPanel=function(param){var children=param.children,_children_props=children.props,dataElement=_children_props.dataElement,isCustom=_children_props.isCustom,location=_children_props.location,isMobile=(0,getDeviceSize.IS)(),_useSelector=_sliced_to_array((0,es.d4)((function(state){return[selectors.A.getPanelWidth(state,dataElement),selectors.A.isInDesktopOnlyMode(state),selectors.A.isElementOpen(state,dataElement),selectors.A.isElementDisabled(state,dataElement),selectors.A.getCurrentToolbarGroup(state),selectors.A.isElementOpen(state,"header"),selectors.A.isElementOpen(state,"toolsHeader"),!selectors.A.isElementDisabled(state,"logoBar"),selectors.A.getFeatureFlags(state),selectors.A.getActiveTopHeaders(state),selectors.A.getIsMultiTab(state)]}),es.bN),11),currentWidth=_useSelector[0],isInDesktopOnlyMode=_useSelector[1],isOpen=_useSelector[2],isDisabled=_useSelector[3],currentToolbarGroup=_useSelector[4],isHeaderOpen=_useSelector[5],isToolsHeaderOpen=_useSelector[6],isLogoBarEnabled=_useSelector[7],featureFlags=_useSelector[8],activeTopHeaders=_useSelector[9],isMultiTabActive=_useSelector[10],dispatch=(0,es.wA)(),style={};if(!currentWidth||!isInDesktopOnlyMode&&isMobile)style={minWidth:"".concat(panel.fz,"px")};else{var widthStyle=isCustom?currentWidth-panel.Yj:currentWidth;style={width:"".concat(widthStyle,"px"),minWidth:"".concat(widthStyle,"px")}}var isVisible=!(!isOpen||isDisabled),isLeftSide=!location||"left"===location,isRightSide="right"===location,legacyToolsHeaderOpen=isToolsHeaderOpen&&"toolbarGroup-View"!==currentToolbarGroup,legacyAllHeadersHidden=!isHeaderOpen&&!legacyToolsHeaderOpen,customizableUI=null==featureFlags?void 0:featureFlags.customizableUI,onResize=function(_width){var maxAllowedWidth=window.innerWidth;device.lT&&(maxAllowedWidth-=30),dispatch(actions.A.setPanelWidth(dataElement,Math.min(_width,maxAllowedWidth)))};return react.createElement("div",{className:classnames_default()({ModularPanel:!0,closed:!isVisible,left:isLeftSide,right:isRightSide,"tools-header-open":customizableUI?2===activeTopHeaders.length:legacyToolsHeaderOpen,"tools-header-and-header-hidden":customizableUI?0===activeTopHeaders.length:legacyAllHeadersHidden,"logo-bar-enabled":isLogoBarEnabled,"modular-ui-panel":customizableUI,"multi-tab-active":isMultiTabActive}),"data-element":dataElement},isCustom&&"right"===location&&!isInDesktopOnlyMode&&!isMobile&&react.createElement(ResizeBar.A,{minWidth:panel.fz,dataElement:"".concat(dataElement,"ResizeBar"),onResize,leftDirection:!0}),react.createElement("div",{className:"ModularPanel-container ".concat(dataElement),style},!isInDesktopOnlyMode&&isMobile&&react.createElement("div",{className:"close-container"},react.createElement("div",{className:"close-icon-container",onClick:function(){dispatch(actions.A.closeElements([dataElement]))}},react.createElement(Icon.A,{glyph:"ic_close_black_24px",className:"close-icon"}))),children),isCustom&&"left"===location&&!isInDesktopOnlyMode&&!isMobile&&react.createElement(ResizeBar.A,{minWidth:panel.fz,dataElement:"".concat(dataElement,"ResizeBar"),onResize}))};DesktopPanel.propTypes={children:prop_types_default().shape({props:prop_types_default().shape({dataElement:prop_types_default().string.isRequired,isCustom:prop_types_default().bool,location:prop_types_default().string})})};var Panel_Panel=function(props){var isCustom=props.isCustom,dataElement=props.dataElement,location=props.location,isMobile=(0,getDeviceSize.IS)(),isOpen=_sliced_to_array((0,es.d4)((function(state){return[selectors.A.isElementOpen(state,dataElement)]})),1)[0],dispatch=(0,es.wA)(),children=react.cloneElement(props.children,{dataElement,isCustom,location}),panelsWithMobileVersion=[panel.BB.SIGNATURE_LIST,panel.BB.RUBBER_STAMP,panel.BB.STYLE,panel.BB.NOTES,panel.BB.SEARCH,panel.BB.TEXT_EDITING,panel.BB.TABS,panel.BB.REDACTION,panel.BB.FORM_FIELD,panel.BB.INDEX];return isOpen?isMobile&&panelsWithMobileVersion.includes(dataElement)?(dispatch(actions.A.openElement("MobilePanelWrapper")),react.createElement(ModularComponents_MobilePanelWrapper,null,props.children)):react.createElement(DesktopPanel,null,children):null};Panel_Panel.propTypes={children:prop_types_default().node,isCustom:prop_types_default().bool,dataElement:prop_types_default().string,location:prop_types_default().string};const components_Panel_Panel=Panel_Panel;Panel_Panel.__docgenInfo={description:"",methods:[],displayName:"Panel",props:{children:{description:"",type:{name:"node"},required:!1},isCustom:{description:"",type:{name:"bool"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},location:{description:"",type:{name:"string"},required:!1}}}},"./src/components/Panel/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Panel__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Panel/Panel.js");const __WEBPACK_DEFAULT_EXPORT__=_Panel__WEBPACK_IMPORTED_MODULE_0__.A;_Panel__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Panel",props:{children:{description:"",type:{name:"node"},required:!1},isCustom:{description:"",type:{name:"bool"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},location:{description:"",type:{name:"string"},required:!1}}}},"./src/hooks/useResizeObserver/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>hooks_useResizeObserver});var react=__webpack_require__("./node_modules/react/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const hooks_useResizeObserver=function(){var _useState=_sliced_to_array((0,react.useState)({width:null,height:null}),2),dimensions=_useState[0],setDimensions=_useState[1],elementRef=(0,react.useRef)(null);return(0,react.useEffect)((function(){var node=elementRef.current;if(node){var observer=new ResizeObserver((function(entries){var _iteratorNormalCompletion=!0,_didIteratorError=!1,_iteratorError=void 0;try{for(var _step,_iterator=entries[Symbol.iterator]();!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=!0){var entry=_step.value,observedWidth=entry.borderBoxSize[0].inlineSize,observedHeight=entry.borderBoxSize[0].blockSize;setDimensions({width:observedWidth,height:observedHeight})}}catch(err){_didIteratorError=!0,_iteratorError=err}finally{try{_iteratorNormalCompletion||null==_iterator.return||_iterator.return()}finally{if(_didIteratorError)throw _iteratorError}}}));return observer.observe(node),function(){observer.unobserve(node)}}}),[elementRef.current]),[elementRef,dimensions]}}}]);