(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[1807],{"./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>_toConsumableArray});var arrayLikeToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");var unsupportedIterableToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return(0,arrayLikeToArray.A)(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||(0,unsupportedIterableToArray.A)(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},"./src/components/ThumbnailsPanel/ThumbnailsPanel.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Thumbnails:()=>Thumbnails,ThumbnailsMultiSelect:()=>ThumbnailsMultiSelect,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),components_Panel__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/Panel/index.js"),_ThumbnailsPanel__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/ThumbnailsPanel/ThumbnailsPanel.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/redux/initialState.js"),src_helpers_storybookHelper__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/helpers/storybookHelper.js"),_storybook_test__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/@storybook/test/dist/index.mjs");function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _ts_generator(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Thumbnails",component:_ThumbnailsPanel__WEBPACK_IMPORTED_MODULE_3__.A,parameters:{customizableUI:!0}};var _ref,myState=_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A),{viewer:_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A.viewer),{openElements:_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A.viewer.openElements),{thumbnailsPanel:!0,leftPanel:!0}),panelWidths:_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A.viewer.panelWidths),{leftPanel:264,thumbnailsPanel:300}),pageLabels:["1","2","3","4","5","6","7","8","9","10"]}),document:_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A.document),{totalPages:{1:10}}),featureFlags:{customizableUI:!0}}),Thumbnails=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store:(0,src_helpers_storybookHelper__WEBPACK_IMPORTED_MODULE_5__.y$)(myState)},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Panel__WEBPACK_IMPORTED_MODULE_2__.A,{dataElement:"thumbnailsPanel"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThumbnailsPanel__WEBPACK_IMPORTED_MODULE_3__.A,null)))};Thumbnails.play=(_ref=function _async_to_generator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}((function(param){var canvasElement,canvas,thumbnailContainer,thumbnails,thumbnail,thumbnailControls;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return canvasElement=param.canvasElement,canvas=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.ux)(canvasElement),thumbnailContainer=canvas.getByLabelText("Thumbnails"),[4,(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailContainer).toBeInTheDocument()];case 1:return _state.sent(),(thumbnails=canvas.getAllByRole("gridcell"))[0].focus(),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.Q4.keyboard("{Enter}")];case 2:return _state.sent(),thumbnail=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.ux)(thumbnails[0]).getAllByRole("button")[0],thumbnailControls=(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.ux)(thumbnail).getAllByRole("button"),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls).toHaveLength(3),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[0]).toHaveFocus(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[0]).toHaveAttribute("aria-current","page"),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.Q4.keyboard("{ArrowRight}")];case 3:return _state.sent(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[1]).toHaveFocus(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[1]).toHaveAttribute("aria-current","page"),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.Q4.keyboard("{ArrowRight}")];case 4:return _state.sent(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[2]).toHaveFocus(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnailControls[2]).toHaveAttribute("aria-current","page"),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.Q4.tab()];case 5:return _state.sent(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnails[1]).toHaveFocus(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_6__.E3)(thumbnails[1]).toHaveAttribute("aria-current","page"),[2]}}))})),function(_){return _ref.apply(this,arguments)});var ThumbnailsMultiSelect=function(){var state=_object_spread_props(_object_spread({},myState),{viewer:_object_spread_props(_object_spread({},myState.viewer),{thumbnailSelectingPages:!0})});return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store:(0,src_helpers_storybookHelper__WEBPACK_IMPORTED_MODULE_5__.y$)(state)},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Panel__WEBPACK_IMPORTED_MODULE_2__.A,{dataElement:"thumbnailsPanel"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ThumbnailsPanel__WEBPACK_IMPORTED_MODULE_3__.A,null)))};Thumbnails.parameters={...Thumbnails.parameters,docs:{...Thumbnails.parameters?.docs,source:{originalSource:'() => {\n  return <Provider store={createStore(myState)}>\n      <Panel dataElement="thumbnailsPanel">\n        <ThumbnailsPanel />\n      </Panel>\n    </Provider>;\n}',...Thumbnails.parameters?.docs?.source}}},ThumbnailsMultiSelect.parameters={...ThumbnailsMultiSelect.parameters,docs:{...ThumbnailsMultiSelect.parameters?.docs,source:{originalSource:'() => {\n  const state = {\n    ...myState,\n    viewer: {\n      ...myState.viewer,\n      thumbnailSelectingPages: true\n    }\n  };\n  return <Provider store={createStore(state)}>\n      <Panel dataElement="thumbnailsPanel">\n        <ThumbnailsPanel />\n      </Panel>\n    </Provider>;\n}',...ThumbnailsMultiSelect.parameters?.docs?.source}}};const __namedExportsOrder=["Thumbnails","ThumbnailsMultiSelect"]},"./node_modules/@storybook/test/dist sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/test/dist sync recursive",module.exports=webpackEmptyContext}}]);