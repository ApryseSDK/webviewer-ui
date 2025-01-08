/*! For license information please see 6927.e570ac6e.iframe.bundle.js.LICENSE.txt */
"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[6927],{"./node_modules/react/cjs/react-jsx-runtime.production.min.js":(__unused_webpack_module,exports,__webpack_require__)=>{__webpack_require__("./node_modules/object-assign/index.js");var f=__webpack_require__("./node_modules/react/index.js"),g=60103;if(60107,"function"==typeof Symbol&&Symbol.for){var h=Symbol.for;g=h("react.element"),h("react.fragment")}var m=f.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED.ReactCurrentOwner,n=Object.prototype.hasOwnProperty,p={key:!0,ref:!0,__self:!0,__source:!0};function q(c,a,k){var b,d={},e=null,l=null;for(b in void 0!==k&&(e=""+k),void 0!==a.key&&(e=""+a.key),void 0!==a.ref&&(l=a.ref),a)n.call(a,b)&&!p.hasOwnProperty(b)&&(d[b]=a[b]);if(c&&c.defaultProps)for(b in a=c.defaultProps)void 0===d[b]&&(d[b]=a[b]);return{$$typeof:g,type:c,key:e,ref:l,props:d,_owner:m.current}}exports.jsx=q},"./node_modules/react/jsx-runtime.js":(module,__unused_webpack_exports,__webpack_require__)=>{module.exports=__webpack_require__("./node_modules/react/cjs/react-jsx-runtime.production.min.js")},"./src/components/DataElementWrapper/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>components_DataElementWrapper});var prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),react=__webpack_require__("./node_modules/react/index.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={id:prop_types_default().string,children:prop_types_default().node,dataElement:prop_types_default().string,type:prop_types_default().string,ariaLabel:prop_types_default().string};var DataElementWrapper=react.forwardRef((function(_param,ref){var _param_type=_param.type,type=void 0===_param_type?"div":_param_type,children=_param.children,dataElement=_param.dataElement,ariaLabel=_param.ariaLabel,props=_object_without_properties(_param,["type","children","dataElement","ariaLabel"]),isDisabled=function useIsDisabledWithDefaultValue(selector){var defaultValue=arguments.length>1&&void 0!==arguments[1]&&arguments[1];try{return(0,es.d4)(selector)}catch(e){e.message}return defaultValue}((function(state){return selectors.A.isElementDisabled(state,dataElement)}));return isDisabled?null:"button"===type?react.createElement("button",_object_spread({ref,"data-element":dataElement,"aria-label":ariaLabel},props),children):react.createElement("div",_object_spread({ref,"data-element":dataElement},props),children)}));DataElementWrapper.displayName="DataElementWrapper",DataElementWrapper.propTypes=propTypes;const DataElementWrapper_DataElementWrapper=DataElementWrapper;DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},ariaLabel:{description:"Accessibility",type:{name:"string"},required:!1}}};const components_DataElementWrapper=DataElementWrapper_DataElementWrapper;DataElementWrapper_DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},ariaLabel:{description:"Accessibility",type:{name:"string"},required:!1}}}},"./src/components/Outline/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _Outline__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Outline/Outline.js");const __WEBPACK_DEFAULT_EXPORT__=_Outline__WEBPACK_IMPORTED_MODULE_0__.A;_Outline__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[{name:"getNode",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Outline",props:{outline:{description:"",type:{name:"object"},required:!0},setMultiSelected:{description:"",type:{name:"func"},required:!1},moveOutlineInward:{description:"",type:{name:"func"},required:!0},moveOutlineBeforeTarget:{description:"",type:{name:"func"},required:!0},moveOutlineAfterTarget:{description:"",type:{name:"func"},required:!0},connectDragSource:{description:"",type:{name:"func"},required:!1},connectDragPreview:{description:"",type:{name:"func"},required:!1},connectDropTarget:{description:"",type:{name:"func"},required:!1},isDragging:{description:"",type:{name:"bool"},required:!1},isDraggedUpwards:{description:"",type:{name:"bool"},required:!1},isDraggedDownwards:{description:"",type:{name:"bool"},required:!1}}}}}]);