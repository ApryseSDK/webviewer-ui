"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4151],{"./src/components/Model3DModal/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>components_Model3DModal});var react=__webpack_require__("./node_modules/react/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js"),actions=__webpack_require__("./src/redux/actions/index.js"),core=__webpack_require__("./src/core/index.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),Model3DModal=__webpack_require__("./src/components/Model3DModal/Model3DModal.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}function Model3DModalContainer(props){var close3DModal=props.close3DModal,rest=_object_without_properties(props,["close3DModal"]),closeModal=(0,react.useCallback)((function(){close3DModal()}),[close3DModal]),newProps=_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},rest),{closeModal});return react.createElement(Model3DModal.A,newProps)}const Model3DModal_Model3DModalContainer=Model3DModalContainer;Model3DModalContainer.__docgenInfo={description:"",methods:[],displayName:"Model3DModalContainer"};var dataElement=__webpack_require__("./src/constants/dataElement.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function Model3DModalRedux_define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function Model3DModalRedux_object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function Model3DModalRedux_ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function Model3DModalRedux(props){var dispatch=(0,es.wA)(),_useState=_sliced_to_array((0,react.useState)(""),2),url=_useState[0],setURL=_useState[1],_useState1=_sliced_to_array((0,react.useState)({}),2),file=_useState1[0],setFile=_useState1[1],_useState2=_sliced_to_array((0,react.useState)({fileError:"",urlError:""}),2),error=_useState2[0],setError=_useState2[1],fileInput=react.createRef(),urlInput=react.createRef(),_useSelector=_sliced_to_array((0,es.d4)((function(state){return[selectors.A.isElementDisabled(state,dataElement.A.MODEL3D_MODAL),selectors.A.isElementOpen(state,dataElement.A.MODEL3D_MODAL)]})),2),isDisabled=_useSelector[0],isOpen=_useSelector[1];(0,react.useEffect)((function(){var onToolUpdated=function(){dispatch(actions.A.closeElement(dataElement.A.MODEL3D_MODAL))};return core.A.addEventListener("toolUpdated",onToolUpdated),function(){return core.A.removeEventListener("toolUpdated",onToolUpdated)}}),[]),(0,react.useEffect)((function(){isOpen&&(urlInput.current.focus(),dispatch(actions.A.closeElements([dataElement.A.PRINT_MODAL,dataElement.A.LOADING_MODAL,dataElement.A.PROGRESS_MODAL,dataElement.A.ERROR_MODAL,dataElement.A.OPEN_FILE_MODAL])))}),[dispatch,isOpen]);var newProps=Model3DModalRedux_object_spread_props(function Model3DModalRedux_object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){Model3DModalRedux_define_property(target,key,source[key])}))}return target}({},props),{isDisabled,isOpen,close3DModal:function(){dispatch(actions.A.closeElement(dataElement.A.MODEL3D_MODAL)),setURL(""),setFile({}),setError({}),fileInput.current&&(fileInput.current.value=null)},fileInput,urlInput,error,setError,file,setFile,url,setURL});return react.createElement(Model3DModal_Model3DModalContainer,newProps)}const Model3DModal_Model3DModalRedux=Model3DModalRedux;Model3DModalRedux.__docgenInfo={description:"",methods:[],displayName:"Model3DModalRedux"};const components_Model3DModal=Model3DModal_Model3DModalRedux;Model3DModal_Model3DModalRedux.__docgenInfo={description:"",methods:[],displayName:"Model3DModalRedux"}}}]);