(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4945],{"./src/components/CreateStampModal/CreateStampModal.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_CreateStampModal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/CreateStampModal/CreateStampModal.js"),redux__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),constants_defaultFonts__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/constants/defaultFonts.js"),constants_defaultDateTimeFormats__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/constants/defaultDateTimeFormats.js"),_storybook_test__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@storybook/test/dist/index.mjs");function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _async_to_generator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}function _ts_generator(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/CreateStampModal",component:_CreateStampModal__WEBPACK_IMPORTED_MODULE_1__.A,parameters:{customizableUI:!0}};var initialState={viewer:{openElements:{customStampModal:!0},disabledElements:{},customElementOverrides:{},fonts:constants_defaultFonts__WEBPACK_IMPORTED_MODULE_5__.A,dateTimeFormats:constants_defaultDateTimeFormats__WEBPACK_IMPORTED_MODULE_3__.A},user:{name:"TestName"},featureFlags:{customizableUI:!0}};var props={isOpen:!0},store=(0,redux__WEBPACK_IMPORTED_MODULE_6__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState})),Basic=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CreateStampModal__WEBPACK_IMPORTED_MODULE_1__.A,props))};Basic.play=_async_to_generator((function(){var stampTextInput,errorMessageDiv;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return[4,document.getElementById("stampTextInput")];case 1:return stampTextInput=_state.sent(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.E3)(stampTextInput).toBeInTheDocument(),stampTextInput.value=null,[4,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.Q4.click(stampTextInput)];case 2:return _state.sent(),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.Q4.type(stampTextInput,"22",{delay:100})];case 3:return _state.sent(),[4,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.Q4.clear(stampTextInput)];case 4:return _state.sent(),[4,document.querySelector(".empty-stamp-input")];case 5:return errorMessageDiv=_state.sent(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.E3)(errorMessageDiv).toBeInTheDocument(),(0,_storybook_test__WEBPACK_IMPORTED_MODULE_4__.E3)(errorMessageDiv.innerText).not.toBeNull,[2]}}))})),Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"() => <Provider store={store}>\n    <CreateStampModal {...props} />\n  </Provider>",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/@storybook/test/dist sync recursive":module=>{function webpackEmptyContext(req){var e=new Error("Cannot find module '"+req+"'");throw e.code="MODULE_NOT_FOUND",e}webpackEmptyContext.keys=()=>[],webpackEmptyContext.resolve=webpackEmptyContext,webpackEmptyContext.id="./node_modules/@storybook/test/dist sync recursive",module.exports=webpackEmptyContext},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".ui__choice__input__icon{top:-6px!important}.ui__icon{align-items:baseline!important}.ui__choice{align-items:center}.ui__choice__label{font-size:13px!important}.ui__choice__input--switch .ui__choice__input__switch{height:14px!important;border-radius:24px!important;background-color:var(--input-switch-default-color)!important;border:none!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--disabled{opacity:.6;cursor:not-allowed}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked{background-color:var(--checked-option)!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked .ui__choice__input__toggle{left:12px!important}.ui__choice__input--switch .ui__choice__input__switch--focus{outline:var(--focus-visible-outline)}.ui__choice__input--switch .ui__choice__input__switch .ui__choice__input__toggle{height:10px!important;width:10px!important;background-color:var(--gray-0)!important;left:2px!important}.ui__choice__input--switch input:disabled{cursor:not-allowed!important}.ui__choice__input__check--focus{outline:var(--focus-visible-outline)}",""]),module.exports=exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPalette/ColorPalette.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.ColorPalette{display:flex;flex-wrap:wrap;display:grid;grid-template-columns:repeat(7,1fr)}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.ColorPalette{width:196px}}.ColorPalette.padding{padding:4px 12px 8px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPalette{max-width:450px;width:auto}}@media(max-width:640px)and (-ms-high-contrast:active),(max-width:640px)and (-ms-high-contrast:none){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPalette{width:308px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPalette{max-width:450px;width:auto}@media (-ms-high-contrast:active),(-ms-high-contrast:none){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPalette{width:308px}}}.ColorPalette .cell-container{padding:0;border:none;background-color:transparent;flex:1 0 14%;cursor:pointer;width:var(--cell-border-size);height:var(--cell-border-size);display:flex;align-items:center;justify-content:center;border-radius:4px}:host(:not([data-tabbing=true])) .ColorPalette .cell-container,html:not([data-tabbing=true]) .ColorPalette .cell-container{outline:none}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPalette .cell-container{width:28px;height:28px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPalette .cell-container{width:28px;height:28px}}.ColorPalette .cell-container .cell-outer.active{border:1px solid var(--color-palette-border);width:var(--cell-outer-border-size);height:var(--cell-outer-border-size);border-radius:10000000px;display:flex;align-items:center;justify-content:center}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .ColorPalette .cell-container .cell-outer.active{width:28px;height:28px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .ColorPalette .cell-container .cell-outer.active{width:28px;height:28px}}.ColorPalette .cell-container .cell-outer .cell{width:18px;height:18px;border-radius:10000000px}.ColorPalette .cell-container .cell-outer .cell .transparent{border:2px solid var(--faded-text);border-radius:10000000px}.ColorPalette .cell-container .cell-outer .cell.border{border:1px solid var(--white-color-palette-border)}.ColorPalette .cell-container.focus-visible,.ColorPalette .cell-container:focus-visible{outline:var(--focus-visible-outline)}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPalettePicker/ColorPalettePicker.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".colorPicker .colorPickerController{padding:5px;margin-top:4px;display:flex;align-items:center;justify-content:space-between;border-radius:4px}.colorPicker .cellIcon .Icon svg{height:100%}.colorPicker .cell-container:disabled{cursor:no-drop;opacity:.5}.colorPicker .cell-container.cell-tool:not([disabled]):hover{border:none;box-shadow:var(--colorpicker-tool-shadow);background:var(--colorpicker-tool-bg);border-radius:4px}",""]),module.exports=exports},"./node_modules/react-swipeable/es/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Hx:()=>Swipeable});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);function _extends(){return _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var defaultProps={preventDefaultTouchmoveEvent:!1,delta:10,rotationAngle:0,trackMouse:!1,trackTouch:!0},initialState={xy:[0,0],swiping:!1,eventData:void 0,start:void 0},LEFT="Left",RIGHT="Right",UP="Up",DOWN="Down",touchStart="touchstart",touchMove="touchmove",touchEnd="touchend",mouseMove="mousemove",mouseUp="mouseup";function rotateXYByAngle(pos,angle){if(0===angle)return pos;var angleInRadians=Math.PI/180*angle;return[pos[0]*Math.cos(angleInRadians)+pos[1]*Math.sin(angleInRadians),pos[1]*Math.cos(angleInRadians)-pos[0]*Math.sin(angleInRadians)]}function getHandlers(set,handlerProps){var onStart=function onStart(event){event.touches&&event.touches.length>1||set((function(state,props){props.trackMouse&&(document.addEventListener(mouseMove,onMove),document.addEventListener(mouseUp,onUp));var _ref=event.touches?event.touches[0]:event,xy=rotateXYByAngle([_ref.clientX,_ref.clientY],props.rotationAngle);return _extends({},state,initialState,{eventData:{initial:[].concat(xy),first:!0},xy,start:event.timeStamp||0})}))},onMove=function onMove(event){set((function(state,props){if(!state.xy[0]||!state.xy[1]||event.touches&&event.touches.length>1)return state;var _ref2=event.touches?event.touches[0]:event,_rotateXYByAngle=rotateXYByAngle([_ref2.clientX,_ref2.clientY],props.rotationAngle),x=_rotateXYByAngle[0],y=_rotateXYByAngle[1],deltaX=state.xy[0]-x,deltaY=state.xy[1]-y,absX=Math.abs(deltaX),absY=Math.abs(deltaY),time=(event.timeStamp||0)-state.start,velocity=Math.sqrt(absX*absX+absY*absY)/(time||1);if(absX<props.delta&&absY<props.delta&&!state.swiping)return state;var dir=function getDirection(absX,absY,deltaX,deltaY){return absX>absY?deltaX>0?LEFT:RIGHT:deltaY>0?UP:DOWN}(absX,absY,deltaX,deltaY),eventData=_extends({},state.eventData,{event,absX,absY,deltaX,deltaY,velocity,dir});props.onSwiping&&props.onSwiping(eventData);var cancelablePageSwipe=!1;return(props.onSwiping||props.onSwiped||props["onSwiped"+dir])&&(cancelablePageSwipe=!0),cancelablePageSwipe&&props.preventDefaultTouchmoveEvent&&props.trackTouch&&event.cancelable&&event.preventDefault(),_extends({},state,{eventData:_extends({},eventData,{first:!1}),swiping:!0})}))},onEnd=function onEnd(event){set((function(state,props){var eventData;return state.swiping&&(eventData=_extends({},state.eventData,{event}),props.onSwiped&&props.onSwiped(eventData),props["onSwiped"+eventData.dir]&&props["onSwiped"+eventData.dir](eventData)),_extends({},state,initialState,{eventData})}))},cleanUpMouse=function cleanUpMouse(){document.removeEventListener(mouseMove,onMove),document.removeEventListener(mouseUp,onUp)},onUp=function onUp(e){cleanUpMouse(),onEnd(e)},attachTouch=function attachTouch(el){if(el&&el.addEventListener){var tls=[[touchStart,onStart],[touchMove,onMove],[touchEnd,onEnd]];return tls.forEach((function(_ref3){var e=_ref3[0],h=_ref3[1];return el.addEventListener(e,h)})),function(){return tls.forEach((function(_ref4){var e=_ref4[0],h=_ref4[1];return el.removeEventListener(e,h)}))}}},output={ref:function onRef(el){null!==el&&set((function(state,props){if(state.el===el)return state;var addState={};return state.el&&state.el!==el&&state.cleanUpTouch&&(state.cleanUpTouch(),addState.cleanUpTouch=null),props.trackTouch&&el&&(addState.cleanUpTouch=attachTouch(el)),_extends({},state,{el},addState)}))}};return handlerProps.trackMouse&&(output.onMouseDown=onStart),[output,attachTouch]}function updateTransientState(state,props,attachTouch){var addState={};return!props.trackTouch&&state.cleanUpTouch?(state.cleanUpTouch(),addState.cleanUpTouch=null):props.trackTouch&&!state.cleanUpTouch&&state.el&&(addState.cleanUpTouch=attachTouch(state.el)),_extends({},state,addState)}var Swipeable=function(_React$PureComponent){function Swipeable(props){var _this;return(_this=_React$PureComponent.call(this,props)||this)._set=function(cb){_this.transientState=cb(_this.transientState,_this.props)},_this.transientState=_extends({},initialState,{type:"class"}),_this}return function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype),subClass.prototype.constructor=subClass,subClass.__proto__=superClass}(Swipeable,_React$PureComponent),Swipeable.prototype.render=function render(){var _this$props=this.props,className=_this$props.className,style=_this$props.style,_this$props$nodeName=_this$props.nodeName,nodeName=void 0===_this$props$nodeName?"div":_this$props$nodeName,innerRef=_this$props.innerRef,children=_this$props.children,trackMouse=_this$props.trackMouse,_getHandlers=getHandlers(this._set,{trackMouse}),handlers=_getHandlers[0],attachTouch=_getHandlers[1];this.transientState=updateTransientState(this.transientState,this.props,attachTouch);var ref=innerRef?function(el){return innerRef(el),handlers.ref(el)}:handlers.ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(nodeName,_extends({},handlers,{className,style,ref}),children)},Swipeable}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent);Swipeable.propTypes={onSwiped:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwiping:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedUp:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedRight:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedDown:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedLeft:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,delta:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number,preventDefaultTouchmoveEvent:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,nodeName:prop_types__WEBPACK_IMPORTED_MODULE_1___default().string,trackMouse:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,trackTouch:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,innerRef:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,rotationAngle:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number},Swipeable.defaultProps=defaultProps},"./src/components/Choice/Choice.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ColorPalette/ColorPalette.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPalette/ColorPalette.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ColorPalettePicker/ColorPalettePicker.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/ColorPalettePicker/ColorPalettePicker.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Button/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Button__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Button/Button.js");const __WEBPACK_DEFAULT_EXPORT__=_Button__WEBPACK_IMPORTED_MODULE_0__.A;_Button__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Button",props:{isActive:{description:"",type:{name:"bool"},required:!1},mediaQueryClassName:{description:"",type:{name:"string"},required:!1},img:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onDoubleClick:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},isSubmitType:{description:"",type:{name:"bool"},required:!1},ariaLabel:{description:"Will override translated title if both given.",type:{name:"string"},required:!1},ariaControls:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},hideTooltipShortcut:{description:"",type:{name:"bool"},required:!1},useI18String:{description:"",type:{name:"bool"},required:!1},shouldPassActiveDocumentViewerKeyToOnClickHandler:{description:"",type:{name:"bool"},required:!1},children:{description:"",type:{name:"node"},required:!1}}}},"./src/components/Choice/Choice.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Choice/Choice.js"),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/redux/selectors/index.js");__webpack_require__("./src/components/Choice/Choice.scss");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={dataElement:prop_types__WEBPACK_IMPORTED_MODULE_4___default().string},Choice=react__WEBPACK_IMPORTED_MODULE_0__.forwardRef((function(_param,ref){var dataElement=_param.dataElement,props=_object_without_properties(_param,["dataElement"]);return(0,react_redux__WEBPACK_IMPORTED_MODULE_1__.d4)((function(state){return!!dataElement&&selectors__WEBPACK_IMPORTED_MODULE_2__.A.isElementDisabled(state,dataElement)}))?null:react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_5__.G,_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},props),{ref,center:!0}))}));Choice.displayName="Choice",Choice.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=Choice;Choice.__docgenInfo={description:"",methods:[],displayName:"Choice",props:{dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/components/Choice/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Choice__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Choice/Choice.js");const __WEBPACK_DEFAULT_EXPORT__=_Choice__WEBPACK_IMPORTED_MODULE_0__.A;_Choice__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Choice",props:{dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/components/ColorPalettePicker/ColorPalettePicker.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_7___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_7__),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),components_Icon__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/Icon/index.js"),components_Tooltip__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/Tooltip/index.js"),react_i18next__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),hooks_useFocusHandler__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/hooks/useFocusHandler/index.js");__webpack_require__("./src/components/ColorPalettePicker/ColorPalettePicker.scss"),__webpack_require__("./src/components/ColorPalette/ColorPalette.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={color:prop_types__WEBPACK_IMPORTED_MODULE_7___default().any,toolTipXOffset:prop_types__WEBPACK_IMPORTED_MODULE_7___default().number},ColorPalettePicker=function(param){var color=param.color,_param_customColors=param.customColors,customColors=void 0===_param_customColors?[]:_param_customColors,getHexColor=param.getHexColor,openColorPicker=param.openColorPicker,handleColorOnClick=param.handleColorOnClick,openDeleteModal=param.openDeleteModal,colorToBeDeleted=param.colorToBeDeleted,setColorToBeDeleted=param.setColorToBeDeleted,enableEdit=param.enableEdit,_param_disableTitle=param.disableTitle,disableTitle=void 0!==_param_disableTitle&&_param_disableTitle,_param_colorsAreHex=param.colorsAreHex,colorsAreHex=void 0!==_param_colorsAreHex&&_param_colorsAreHex,ariaLabelledBy=param.ariaLabelledBy,_param_toolTipXOffset=param.toolTipXOffset,toolTipXOffset=void 0===_param_toolTipXOffset?0:_param_toolTipXOffset,t=_sliced_to_array((0,react_i18next__WEBPACK_IMPORTED_MODULE_8__.B)(),1)[0],addCustomColorRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){var isNotInCustomColors=!customColors.includes(colorsAreHex?color:getHexColor(color));setColorToBeDeleted(isNotInCustomColors?"":colorsAreHex?color:getHexColor(color))}),[color]);var handleAddColor=(0,hooks_useFocusHandler__WEBPACK_IMPORTED_MODULE_4__.A)((function(){openColorPicker&&openColorPicker(!0)})),handleOpenDeleteModal=(0,hooks_useFocusHandler__WEBPACK_IMPORTED_MODULE_4__.A)((function(){openDeleteModal&&openDeleteModal((function(){addCustomColorRef.current.focus()}))}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"color-picker-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"colorPicker"},!disableTitle&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"colorPickerController"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",null,t("annotation.custom"))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"colorPickerColors ColorPalette",role:"group","aria-labelledby":ariaLabelledBy},customColors.map((function(bg,i){var _bg_toUpperCase,_bg_toUpperCase1,_color_toHexString,_color_toHexString1,_color_toHexString2,_color_toHexString3;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Tooltip__WEBPACK_IMPORTED_MODULE_3__.A,{content:"".concat(t("option.colorPalette.colorLabel")," ").concat(null==bg||null===(_bg_toUpperCase=bg.toUpperCase)||void 0===_bg_toUpperCase?void 0:_bg_toUpperCase.call(bg)),xOffset:toolTipXOffset,key:"color-".concat(i)},react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{className:"cell-container cell-color",onClick:function(){return handleColorOnClick(bg)},"aria-label":"".concat(t("option.colorPalette.colorLabel")," ").concat(null==bg||null===(_bg_toUpperCase1=bg.toUpperCase)||void 0===_bg_toUpperCase1?void 0:_bg_toUpperCase1.call(bg)),"aria-current":colorsAreHex?(null==color?void 0:color.toLowerCase())===bg.toLowerCase():(null==color||null===(_color_toHexString1=color.toHexString)||void 0===_color_toHexString1||null===(_color_toHexString=_color_toHexString1.call(color))||void 0===_color_toHexString?void 0:_color_toHexString.toLowerCase())===bg.toLowerCase()},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()({"cell-outer":!0,active:colorsAreHex?(null==color?void 0:color.toLowerCase())===bg.toLowerCase():(null==color||null===(_color_toHexString3=color.toHexString)||void 0===_color_toHexString3||null===(_color_toHexString2=_color_toHexString3.call(color))||void 0===_color_toHexString2?void 0:_color_toHexString2.toLowerCase())===bg.toLowerCase()})},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()({cell:!0,border:!0}),style:{backgroundColor:bg}},"transparency"===bg&&void 0))))})),enableEdit&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{"data-element":"addCustomColor",className:"cell-container cell-tool",title:t("option.colorPalettePicker.addColor"),onClick:handleAddColor,ref:addCustomColorRef},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell-outer"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cellIcon",id:"addCustomColor"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Icon__WEBPACK_IMPORTED_MODULE_2__.A,{glyph:"icon-header-zoom-in-line"})))),enableEdit&&customColors.length>0&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("button",{className:"cell-container cell-tool",id:"removeCustomColor",disabled:!colorToBeDeleted,onClick:handleOpenDeleteModal,title:t("warning.colorPalettePicker.deleteTitle"),"data-element":"removeCustomColor"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cell-outer"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"cellIcon"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Icon__WEBPACK_IMPORTED_MODULE_2__.A,{glyph:"icon-delete-line"})))))))};ColorPalettePicker.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=ColorPalettePicker;ColorPalettePicker.__docgenInfo={description:"",methods:[],displayName:"ColorPalettePicker",props:{customColors:{defaultValue:{value:"[]",computed:!1},required:!1},disableTitle:{defaultValue:{value:"false",computed:!1},required:!1},colorsAreHex:{defaultValue:{value:"false",computed:!1},required:!1},toolTipXOffset:{defaultValue:{value:"0",computed:!1},description:"",type:{name:"number"},required:!1},color:{description:"",type:{name:"any"},required:!1}}}},"./src/components/Dropdown/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Dropdown__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Dropdown/Dropdown.js");const __WEBPACK_DEFAULT_EXPORT__=_Dropdown__WEBPACK_IMPORTED_MODULE_0__.A;_Dropdown__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Dropdown",props:{id:{defaultValue:{value:"''",computed:!1},description:"",type:{name:"string"},required:!1},width:{defaultValue:{value:"width || DEFAULT_WIDTH",computed:!1},description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},columns:{defaultValue:{value:"1",computed:!1},description:"",type:{name:"number"},required:!1},onClickItem:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},disabled:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},applyCustomStyleToButton:{defaultValue:{value:"true",computed:!1},description:"",type:{name:"bool"},required:!1},getCustomItemStyle:{defaultValue:{value:"() => ({})",computed:!1},description:"",type:{name:"func"},required:!1},placeholder:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"string"},required:!1},getKey:{defaultValue:{value:"(item) => item",computed:!1},description:"",type:{name:"func"},required:!1},getDisplayValue:{defaultValue:{value:"(item) => item",computed:!1},description:"",type:{name:"func"},required:!1},className:{defaultValue:{value:"''",computed:!1},description:"",type:{name:"string"},required:!1},hasInput:{defaultValue:{value:"false",computed:!1},required:!1},displayButton:{defaultValue:{value:"null",computed:!1},required:!1},customDataValidator:{defaultValue:{value:"() => true",computed:!1},required:!1},isSearchEnabled:{defaultValue:{value:"true",computed:!1},required:!1},onOpened:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},onClosed:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},arrowDirection:{defaultValue:{value:"'down'",computed:!1},description:"",type:{name:"string"},required:!1},disableFocusing:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},renderItem:{defaultValue:{value:"(item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>)",computed:!1},description:"",type:{name:"func"},required:!1},renderSelectedItem:{defaultValue:{value:"(item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>)",computed:!1},description:"",type:{name:"func"},required:!1},showLabelInList:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},isFlyoutItem:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},onKeyDownHandler:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"func"},required:!1},onFocus:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"func"},required:!1},items:{defaultValue:{value:"[]",computed:!1},description:"",type:{name:"array"},required:!1},images:{defaultValue:{value:"[]",computed:!1},description:"",type:{name:"array"},required:!1},height:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},currentSelectionKey:{description:"",type:{name:"string"},required:!1},translationPrefix:{description:"",type:{name:"string"},required:!1},getTranslationLabel:{description:"",type:{name:"func"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},maxHeight:{description:"",type:{name:"number"},required:!1},labelledById:{description:"",type:{name:"string"},required:!1}}}},"./src/constants/defaultDateTimeFormats.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=[{date:"DD/MM/YYYY",time:"h:mm A",timeFirst:!1},{date:"DD/MM/YYYY",time:"HH:mm",timeFirst:!1},{date:"DD/MM/YYYY",time:"h:mm A",timeFirst:!1},{date:"DD/MM/YYYY",time:"HH:mm",timeFirst:!1},{date:"YYYY/MM/DD",time:"h:mm A",timeFirst:!1},{date:"YYYY/MM/DD",time:"HH:mm",timeFirst:!1},{date:"DD MMM YYYY",time:"h:mm A",timeFirst:!1},{date:"DD MMM YYYY",time:"HH:mm",timeFirst:!1},{date:"MMMM DD, YYYY",time:"h:mm A",timeFirst:!1},{date:"MMMM DD, YYYY",time:"HH:mm",timeFirst:!1},{date:"MMM DD YYYY",time:"h:mm A",timeFirst:!1}]},"./src/constants/defaultFonts.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=["Helvetica","Times New Roman"]},"./src/hooks/useFocusHandler/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>hooks_useFocusHandler});var focusStackManager=__webpack_require__("./src/helpers/focusStackManager.js");const hooks_useFocusHandler=function(handler){return function(e){if(e){var nativeEvent=e.nativeEvent,dataElement=e.currentTarget.getAttribute("data-element");if(!dataElement)return console.warn("You used the useFocusHandler hook on an element without a data-element attribute. Please add a dataElement for the focus transfer to work correctly."),void handler(e);"mouse"===nativeEvent.pointerType||nativeEvent.detail>0?focusStackManager.A.clear():""!==nativeEvent.pointerType&&void 0!==nativeEvent.pointerType||focusStackManager.A.push(dataElement),handler(e)}else handler()}}}}]);