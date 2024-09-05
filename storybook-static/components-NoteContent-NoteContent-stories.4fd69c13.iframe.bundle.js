(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[575],{"./src/components/NoteContent/NoteContent.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,BasicWithSkipAutoLink:()=>BasicWithSkipAutoLink,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__,testProps:()=>testProps,testPropsWithSkipAutoLink:()=>testPropsWithSkipAutoLink});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_NoteContent__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/NoteContent/NoteContent.js"),_Note_Context__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/Note/Context.js"),helpers_initialColorStates__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/helpers/initialColorStates.js"),redux__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/react-redux/es/index.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Note/NoteContent",component:_NoteContent__WEBPACK_IMPORTED_MODULE_1__.A,includeStories:["Basic","BasicWithSkipAutoLink"],excludeStories:["testProps","testPropsWithSkipAutoLink"]};var initialState={viewer:{disabledElements:{},customElementOverrides:{},activeDocumentViewerKey:1,colorMap:{1:helpers_initialColorStates__WEBPACK_IMPORTED_MODULE_4__.D[0]}}};var store=(0,redux__WEBPACK_IMPORTED_MODULE_5__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState})),context={pendingEditTextMap:{},pendingReplyMap:{},pendingAttachmentMap:{},isSelected:!1,searchInput:""},mockAnnotation={Author:"Mikel Landa",getReplies:function(){return[1,2,3]},getStatus:function(){return""},isReply:function(){return!1},getAssociatedNumber:function(){return 1},StrokeColor:{R:255,G:205,B:69,A:1,toHexString:function(){return helpers_initialColorStates__WEBPACK_IMPORTED_MODULE_4__.D[0]}},FillColor:{R:255,G:205,B:69,A:1,toHexString:function(){return helpers_initialColorStates__WEBPACK_IMPORTED_MODULE_4__.D[0]}},getCustomData:function(key){return{"trn-annot-preview":""}[key]},getContents:function(){return"This is test.com"},getRichTextStyle:function(){},getAttachments:function(){return[]},getSkipAutoLink:function(){return!1}},testProps={icon:"icon-tool-shape-rectangle",language:"en",noteDateFormat:"MMM D, LT",iconColor:"StrokeColor",annotation:mockAnnotation,isReply:!1,isUnread:!1,renderAuthorName:function(){return"Mikel Landa"},isStateDisabled:!1,isEditing:!1},mockAnnotationWithSkipAutoLink=_object_spread_props(_object_spread({},mockAnnotation),{getSkipAutoLink:function(){return!0}}),testPropsWithSkipAutoLink=_object_spread_props(_object_spread({},testProps),{annotation:mockAnnotationWithSkipAutoLink});function Basic(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_3__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Note_Context__WEBPACK_IMPORTED_MODULE_2__.A.Provider,{value:context},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{height:"200px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NoteContent__WEBPACK_IMPORTED_MODULE_1__.A,testProps))))}function BasicWithSkipAutoLink(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_3__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Note_Context__WEBPACK_IMPORTED_MODULE_2__.A.Provider,{value:context},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{height:"200px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_NoteContent__WEBPACK_IMPORTED_MODULE_1__.A,testPropsWithSkipAutoLink))))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"function Basic() {\n  return <Provider store={store}>\n      <NoteContext.Provider value={context}>\n        <div style={{\n        height: '200px'\n      }}>\n          <NoteContent {...testProps} />\n        </div>\n      </NoteContext.Provider>\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}},BasicWithSkipAutoLink.parameters={...BasicWithSkipAutoLink.parameters,docs:{...BasicWithSkipAutoLink.parameters?.docs,source:{originalSource:"function BasicWithSkipAutoLink() {\n  return <Provider store={store}>\n      <NoteContext.Provider value={context}>\n        <div style={{\n        height: '200px'\n      }}>\n          <NoteContent {...testPropsWithSkipAutoLink} />\n        </div>\n      </NoteContext.Provider>\n    </Provider>;\n}",...BasicWithSkipAutoLink.parameters?.docs?.source}}};const __namedExportsOrder=["testProps","testPropsWithSkipAutoLink","Basic","BasicWithSkipAutoLink"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".ui__choice__input__icon{top:-6px!important}.ui__icon{align-items:baseline!important}.ui__choice{align-items:center}.ui__choice__input--switch .ui__choice__input__switch{height:14px!important;border-radius:24px!important;background-color:var(--gray-3)!important;border:none!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--disabled{opacity:.6;cursor:not-allowed}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked{background-color:var(--checked-option)!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked .ui__choice__input__toggle{left:12px!important}.ui__choice__input--switch .ui__choice__input__switch .ui__choice__input__toggle{height:10px!important;width:10px!important;background-color:var(--gray-0)!important;left:2px!important}.ui__choice__input--switch input:disabled{cursor:not-allowed!important}",""]),module.exports=exports},"./src/components/Choice/Choice.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Choice/Choice.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Choice/Choice.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/redux/selectors/index.js");__webpack_require__("./src/components/Choice/Choice.scss");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={dataElement:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string},Choice=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((function(_param,ref){var dataElement=_param.dataElement,props=_object_without_properties(_param,["dataElement"]);return(0,react_redux__WEBPACK_IMPORTED_MODULE_1__.d4)((function(state){return!!dataElement&&selectors__WEBPACK_IMPORTED_MODULE_2__.A.isElementDisabled(state,dataElement)}))?null:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__.G,_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},props),{ref,center:!0}))}));Choice.displayName="Choice",Choice.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=Choice;Choice.__docgenInfo={description:"",methods:[],displayName:"Choice",props:{dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/components/Choice/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Choice__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Choice/Choice.js");const __WEBPACK_DEFAULT_EXPORT__=_Choice__WEBPACK_IMPORTED_MODULE_0__.A;_Choice__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Choice",props:{dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/components/DataElementWrapper/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_DataElementWrapper});var prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),react=__webpack_require__("./node_modules/react/index.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={id:prop_types_default().string,children:prop_types_default().node,dataElement:prop_types_default().string,type:prop_types_default().string};var DataElementWrapper=react.forwardRef((function(_param,ref){var _param_type=_param.type,type=void 0===_param_type?"div":_param_type,children=_param.children,dataElement=_param.dataElement,props=_object_without_properties(_param,["type","children","dataElement"]),isDisabled=function useIsDisabledWithDefaultValue(selector){var defaultValue=arguments.length>1&&void 0!==arguments[1]&&arguments[1];try{return(0,es.d4)(selector)}catch(e){e.message}return defaultValue}((function(state){return selectors.A.isElementDisabled(state,dataElement)}));return isDisabled?null:"button"===type?react.createElement("button",_object_spread({ref,"data-element":dataElement},props),children):react.createElement("div",_object_spread({ref,"data-element":dataElement},props),children)}));DataElementWrapper.displayName="DataElementWrapper",DataElementWrapper.propTypes=propTypes;const DataElementWrapper_DataElementWrapper=DataElementWrapper;DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1}}};const components_DataElementWrapper=DataElementWrapper_DataElementWrapper;DataElementWrapper_DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/helpers/getColor.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function __WEBPACK_DEFAULT_EXPORT__(color){var _color_toHexString;return((null==color||null===(_color_toHexString=color.toHexString)||void 0===_color_toHexString?void 0:_color_toHexString.call(color))||"").substring(1)}__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__})},"./src/helpers/getOverlayPositionBasedOn.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/helpers/getRootNode.js");function __WEBPACK_DEFAULT_EXPORT__(element,overlay,isTabletAndMobile){var selector=arguments.length>3&&void 0!==arguments[3]?arguments[3]:"data-element",isApryseWebViewerWebComponent=window.isApryseWebViewerWebComponent,innerWidth=isApryseWebViewerWebComponent?(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__.Ay)().host.clientWidth:window.innerWidth,innerHeight=isApryseWebViewerWebComponent?(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__.Ay)().host.clientHeight:window.innerHeight,button=(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__.Ay)().querySelector("[".concat(selector,'="').concat(element,'"]')),left=0,right="auto";if(!button||!overlay.current)return{left:-9999,right};var _button_getBoundingClientRect=button.getBoundingClientRect(),buttonBottom=_button_getBoundingClientRect.bottom,buttonLeft=_button_getBoundingClientRect.left,_overlay_current_getBoundingClientRect=overlay.current.getBoundingClientRect(),overlayWidth=_overlay_current_getBoundingClientRect.width,overlayHeight=_overlay_current_getBoundingClientRect.height,rootLeft=isApryseWebViewerWebComponent?(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__.Ay)().host.getBoundingClientRect().left:0;if(buttonLeft-rootLeft+overlayWidth>innerWidth){left=innerWidth-6-overlayWidth,right="auto"}else left=buttonLeft-rootLeft,right="auto";var verticalGap=isTabletAndMobile?14:6,top=buttonBottom-(isApryseWebViewerWebComponent?(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_0__.Ay)().host.getBoundingClientRect().top:0)+verticalGap;if(buttonBottom>100&&buttonBottom+overlayHeight>innerHeight){var calculatedTop=innerHeight-overlayHeight-verticalGap;top=calculatedTop>0?calculatedTop:0}return{left:isNaN(left)?left:Math.max(left,0),right,top}}},"./src/helpers/initialColorStates.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{D:()=>initialColors,k:()=>initialTextColors});var initialColors=["#e44234","#ff8d00","#ffcd45","#5cc96e","#25d2d1","#597ce2","#c544ce","#7d2e25","#a84f1d","#e99e38","#347842","#167e7d","#354a87","#76287b","#ffffff","#cdcdcd","#9c9c9c","#696969","#272727","#000000"],initialTextColors=["#000000","#272727","#696969","#9c9c9c","#cdcdcd","#ffffff","#7d2e25","#a84f1d","#e99e38","#347842","#167e7d","#354a87","#76287b","#e44234","#ff8d00","#ffcd45","#5cc96e","#25d2d1","#597ce2","#c544ce"]},"./src/hooks/useDidUpdate.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function __WEBPACK_DEFAULT_EXPORT__(){var callback=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},deps=arguments.length>1?arguments[1]:void 0,didMount=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){if(didMount.current)return callback();didMount.current=!0}),deps)}},"./src/hooks/useOnClickOutside.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),helpers_getRootNode__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/helpers/getRootNode.js");function __WEBPACK_DEFAULT_EXPORT__(ref,handler){(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){var listener=function(event){ref.current&&!ref.current.contains(event.target)&&handler(event)},browserDocument=document;return window.isApryseWebViewerWebComponent&&(browserDocument=(0,helpers_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)().getElementById("app")),browserDocument.addEventListener("mousedown",listener),browserDocument.addEventListener("touchstart",listener),function(){browserDocument.removeEventListener("mousedown",listener),browserDocument.removeEventListener("touchstart",listener)}}),[ref,handler])}}}]);