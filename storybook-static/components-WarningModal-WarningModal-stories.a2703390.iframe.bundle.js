(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[3519],{"./src/components/WarningModal/WarningModal.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_WarningModal__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/WarningModal/WarningModal.js"),constants_dataElement__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/constants/dataElement.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/WarningModal",component:_WarningModal__WEBPACK_IMPORTED_MODULE_2__.A};var initialState={viewer:{disabledElements:{},customElementOverrides:{},openElements:function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}({},constants_dataElement__WEBPACK_IMPORTED_MODULE_3__.A.WARNING_MODAL,!0),warning:{title:"Warning title",message:"This is a warning message"}}},Basic=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store:(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_4__.U1)({reducer:function(){return initialState}})},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_WarningModal__WEBPACK_IMPORTED_MODULE_2__.A,null))};Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"() => {\n  return <Provider store={configureStore({\n    reducer: () => initialState\n  })}>\n      <WarningModal />\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".ui__choice__input__icon{top:-6px!important}.ui__icon{align-items:baseline!important}.ui__choice{align-items:center}.ui__choice__input--switch .ui__choice__input__switch{height:14px!important;border-radius:24px!important;background-color:var(--gray-3)!important;border:none!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--disabled{opacity:.6;cursor:not-allowed}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked{background-color:var(--checked-option)!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked .ui__choice__input__toggle{left:12px!important}.ui__choice__input--switch .ui__choice__input__switch .ui__choice__input__toggle{height:10px!important;width:10px!important;background-color:var(--gray-0)!important;left:2px!important}.ui__choice__input--switch input:disabled{cursor:not-allowed!important}",""]),module.exports=exports},"./src/components/Choice/Choice.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Choice/Choice.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Choice/Choice.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/redux/selectors/index.js");__webpack_require__("./src/components/Choice/Choice.scss");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={dataElement:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string},Choice=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((function(_param,ref){var dataElement=_param.dataElement,props=_object_without_properties(_param,["dataElement"]);return(0,react_redux__WEBPACK_IMPORTED_MODULE_1__.d4)((function(state){return!!dataElement&&selectors__WEBPACK_IMPORTED_MODULE_2__.A.isElementDisabled(state,dataElement)}))?null:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__.G,_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},props),{ref,center:!0}))}));Choice.displayName="Choice",Choice.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=Choice;Choice.__docgenInfo={description:"",methods:[],displayName:"Choice",props:{dataElement:{description:"",type:{name:"string"},required:!1}}}}}]);