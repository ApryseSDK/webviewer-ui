"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[1901],{"./src/components/ColorPalettePicker/ColorPalettePicker.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/redux/initialState.js"),_ColorPalettePicker__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/ColorPalettePicker/ColorPalettePicker.js"),react_i18next__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/ColorPalettePicker",component:_ColorPalettePicker__WEBPACK_IMPORTED_MODULE_3__.A,parameters:{customizableUI:!0}};var color={R:100,G:0,B:0,A:1},customColors=["#000000","#ff1111","#ffffff"];function Basic(){function noop(){}var props={t:_sliced_to_array((0,react_i18next__WEBPACK_IMPORTED_MODULE_4__.B)(),1)[0],color,customColors,getHexColor:noop,findCustomColorsIndex:noop,setColorToBeDeleted:noop};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store:(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_5__.U1)({reducer:function(){return src_redux_initialState__WEBPACK_IMPORTED_MODULE_2__.A}})},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ColorPalettePicker__WEBPACK_IMPORTED_MODULE_3__.A,props))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"function Basic() {\n  const [t] = useTranslation();\n  function noop() {}\n  const props = {\n    t,\n    color,\n    customColors,\n    getHexColor: noop,\n    findCustomColorsIndex: noop,\n    setColorToBeDeleted: noop\n  };\n  return <Provider store={configureStore({\n    reducer: () => initialState\n  })}>\n      <ColorPalettePicker {...props} />\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]}}]);