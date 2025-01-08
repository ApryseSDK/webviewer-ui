(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[7759],{"./src/components/CreatableList/CreatableList.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_CreatableListContainer__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/CreatableList/CreatableListContainer.js"),redux__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/redux/es/redux.js"),react_dnd__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/react-dnd/dist/esm/core/DndProvider.js"),react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/react-dnd-html5-backend/dist/esm/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/CreatableList",component:_CreatableListContainer__WEBPACK_IMPORTED_MODULE_1__.A};var initialState={viewer:{disabledElements:{},customElementOverrides:{}}};var store=(0,redux__WEBPACK_IMPORTED_MODULE_3__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState})),props={options:[{displayValue:"",value:""},{displayValue:"AB",value:"AB"},{displayValue:"AK",value:"AK"},{displayValue:"AL",value:"AL"},{displayValue:"AR",value:"AR"},{displayValue:"AZ",value:"AZ"},{displayValue:"BC",value:"BC"}],onOptionsUpdated:function(options){console.log({options})}};function Basic(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{id:"app"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_dnd__WEBPACK_IMPORTED_MODULE_4__.Q,{backend:react_dnd_html5_backend__WEBPACK_IMPORTED_MODULE_5__.t2,debugMode:!0},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CreatableListContainer__WEBPACK_IMPORTED_MODULE_1__.A,props))))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:'function Basic() {\n  // Needs to be in div with id of app or the Tooltip causes an error\n  // TODO: Ask Jussi how to fix this in storybook\n  return <div id="app">\n      <Provider store={store}>\n        <DndProvider backend={HTML5Backend} debugMode>\n          <CreatableListContainer {...props} />\n        </DndProvider>\n      </Provider>\n    </div>;\n}',...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/CreatableList/CreatableList.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".creatable-list{display:flex;flex-direction:column}.creatable-list-item{display:flex;flex-direction:row;align-items:center}.add-item-button{display:flex;align-items:center;width:78px;cursor:pointer}.icon-handle{cursor:grab}",""]),module.exports=exports},"./src/components/CreatableList/CreatableList.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/CreatableList/CreatableList.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Button/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Button__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Button/Button.js");const __WEBPACK_DEFAULT_EXPORT__=_Button__WEBPACK_IMPORTED_MODULE_0__.A;_Button__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Button",props:{isActive:{description:"",type:{name:"bool"},required:!1},mediaQueryClassName:{description:"",type:{name:"string"},required:!1},img:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onDoubleClick:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},isSubmitType:{description:"",type:{name:"bool"},required:!1},ariaLabel:{description:"Will override translated title if both given.",type:{name:"string"},required:!1},ariaControls:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},hideTooltipShortcut:{description:"",type:{name:"bool"},required:!1},useI18String:{description:"",type:{name:"bool"},required:!1},shouldPassActiveDocumentViewerKeyToOnClickHandler:{description:"",type:{name:"bool"},required:!1},children:{description:"",type:{name:"node"},required:!1}}}},"./src/components/CreatableList/CreatableListContainer.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>CreatableList_CreatableListContainer});var react=__webpack_require__("./node_modules/react/index.js"),Button=__webpack_require__("./src/components/Button/index.js"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),useDrop=__webpack_require__("./node_modules/react-dnd/dist/esm/hooks/useDrop/useDrop.js"),useDrag=__webpack_require__("./node_modules/react-dnd/dist/esm/hooks/useDrag/useDrag.js"),Icon=__webpack_require__("./src/components/Icon/index.js");__webpack_require__("./src/components/CreatableList/CreatableList.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var CreatableListItem=function(param){var option=param.option,index=param.index,onChange=param.onChange,onDeleteItem=param.onDeleteItem,moveListItem=param.moveListItem,id=param.id,addItem=param.addItem,ItemTypes_ITEM="item",ref=(0,react.useRef)(null),drop=_sliced_to_array((0,useDrop.H)({accept:ItemTypes_ITEM,hover:function hover(item,monitor){var _ref_current;if(ref.current){var dragIndex=item.index,hoverIndex=index;if(dragIndex!==hoverIndex){var hoverBoundingRect=null===(_ref_current=ref.current)||void 0===_ref_current?void 0:_ref_current.getBoundingClientRect(),hoverMiddleY=(hoverBoundingRect.bottom-hoverBoundingRect.top)/2,hoverClientY=monitor.getClientOffset().y-hoverBoundingRect.top;dragIndex<hoverIndex&&hoverClientY<hoverMiddleY||dragIndex>hoverIndex&&hoverClientY>hoverMiddleY||(moveListItem(dragIndex,hoverIndex),item.index=hoverIndex)}}}}),2)[1],_useDrag=_sliced_to_array((0,useDrag.i)({type:ItemTypes_ITEM,item:{type:ItemTypes_ITEM,id,index},collect:function(monitor){return{isDragging:monitor.isDragging()}}}),2),isDragging=_useDrag[0].isDragging,drag=_useDrag[1],onChangeHandler=(0,react.useCallback)((function(event){onChange(event.target.value)}),[onChange]),addNewItemOnEnterKey=(0,react.useCallback)((function(event){"Enter"===event.key&&addItem()}),[addItem]);drag(drop(ref));var opacity=isDragging?0:1;return react.createElement("div",{ref,style:{opacity},className:"creatable-list-item"},react.createElement("div",{className:"icon-handle"},react.createElement(Icon.A,{glyph:"icon-drag-handle"})),react.createElement("input",{type:"text",onChange:onChangeHandler,value:option.displayValue,onKeyPress:addNewItemOnEnterKey,autoFocus:!0}),react.createElement(Button.A,{title:"action.delete",img:"icon-delete-line",onClick:onDeleteItem}))};const CreatableList_CreatableListItem=CreatableListItem;function CreatableListContainer_array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function CreatableListContainer_sliced_to_array(arr,i){return function CreatableListContainer_array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function CreatableListContainer_iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||CreatableListContainer_unsupported_iterable_to_array(arr,i)||function CreatableListContainer_non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _to_consumable_array(arr){return function _array_without_holes(arr){if(Array.isArray(arr))return CreatableListContainer_array_like_to_array(arr)}(arr)||function _iterable_to_array(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||CreatableListContainer_unsupported_iterable_to_array(arr)||function _non_iterable_spread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function CreatableListContainer_unsupported_iterable_to_array(o,minLen){if(o){if("string"==typeof o)return CreatableListContainer_array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?CreatableListContainer_array_like_to_array(o,minLen):void 0}}CreatableListItem.__docgenInfo={description:"",methods:[],displayName:"CreatableListItem"};var propTypes={options:prop_types_default().object,onOptionsUpdated:prop_types_default().func,popupRef:prop_types_default().object},CreatableListContainer=function(param){var options=param.options,onOptionsUpdated=param.onOptionsUpdated,popupRef=param.popupRef,isInitialized=(0,react.useRef)(!1);(0,react.useEffect)((function(){isInitialized.current=!1}),[onOptionsUpdated]),(0,react.useEffect)((function(){setItems(draggableItems)}),[options]);var t=(0,useTranslation.B)().t,draggableItems=options.map((function(option,index){return{id:index,displayValue:option.displayValue,value:option.value}})),_useState=CreatableListContainer_sliced_to_array((0,react.useState)(draggableItems),2),items=_useState[0],setItems=_useState[1],_useState1=CreatableListContainer_sliced_to_array((0,react.useState)(draggableItems.length),2),nextId=_useState1[0],setNextId=_useState1[1],containerRef=(0,react.useRef)();(0,react.useEffect)((function(){if(isInitialized.current){var sanitizedOptions=items.map((function(item){return{value:item.value,displayValue:item.displayValue}}));onOptionsUpdated(sanitizedOptions)}else isInitialized.current=!0}),[items,onOptionsUpdated]);var onAddItem=(0,react.useCallback)((function(){var id=nextId;setNextId(nextId+1),setItems(_to_consumable_array(items).concat([{id,value:"",displayValue:""}])),popupRef&&validatePopupHeight()}),[nextId,items]),handleItemValueChange=function(id){return function(value){var updatedItems=items.map((function(item){return item.id!==id?item:_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},item),{value,displayValue:value})}));setItems(updatedItems)}},moveListItem=(0,react.useCallback)((function(dragIndex,hoverIndex){var dragItem=items[dragIndex],itemsWithDraggedElementAtNewPosition=function addItemAtIndex(array,index,value){var result=array.slice(0);return result.splice(index,0,value),result}(items.filter((function(_item,index){return index!==dragIndex})),hoverIndex,dragItem);setItems(itemsWithDraggedElementAtNewPosition)}),[items]),validatePopupHeight=function(){var popupContainer=popupRef.current,containerElement=containerRef.current,bottom=popupContainer.getBoundingClientRect().bottom,availableHeight=window.innerHeight-bottom,isListOverflowing=containerElement.scrollHeight>containerElement.clientHeight;if(availableHeight<=40&&!isListOverflowing){var maxContainerHeight=40*containerElement.childElementCount;containerElement.style.maxHeight="".concat(maxContainerHeight,"px")}else availableHeight>40&&(containerElement.style.maxHeight="200px")};return react.createElement("div",null,react.createElement("div",{className:"creatable-list",ref:containerRef},items.map((function(item,index){return react.createElement(CreatableList_CreatableListItem,{key:item.id,index,id:item.id,option:item,onChange:handleItemValueChange(item.id),onDeleteItem:(id=item.id,function(){var updatedItems=items.filter((function(item){return id!==item.id}));setItems(updatedItems)}),moveListItem,addItem:onAddItem});var id}))),react.createElement(Button.A,{title:t("action.addOption"),className:"add-item-button",label:t("action.addOption"),img:"icon-plus-sign",onClick:onAddItem}))};CreatableListContainer.propTypes=propTypes;const CreatableList_CreatableListContainer=CreatableListContainer;CreatableListContainer.__docgenInfo={description:"",methods:[],displayName:"CreatableListContainer",props:{options:{description:"",type:{name:"object"},required:!1},onOptionsUpdated:{description:"",type:{name:"func"},required:!1},popupRef:{description:"",type:{name:"object"},required:!1}}}}}]);