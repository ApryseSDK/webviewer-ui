(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4139],{"./src/components/PasswordModal/PasswordModal.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{PasswordFailedAttemptModal:()=>PasswordFailedAttemptModal,PasswordManyAttemptsErrorModal:()=>PasswordManyAttemptsErrorModal,PasswordModal:()=>PasswordModal,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_PasswordModal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/PasswordModal/PasswordModal.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}const __WEBPACK_DEFAULT_EXPORT__={title:"Components/PasswordModal",component:PasswordModal,parameters:{customizableUI:!0}};var initialState={viewer:{disabledElements:{},customElementOverrides:{},openElements:{passwordModal:!0},isMultiTab:!1,customPanels:[]},document:{maxPasswordAttempts:3,passwordAttempts:0},featureFlags:{customizableUI:!1}},store=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.U1)({reducer:function(){return initialState}}),PasswordModal=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PasswordModal__WEBPACK_IMPORTED_MODULE_1__.Ay,null)))},failedAttemptState=_object_spread_props(_object_spread({},initialState),{document:{maxPasswordAttempts:3,passwordAttempts:1}}),attemptFailedStore=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.U1)({reducer:function(){return failedAttemptState}}),PasswordFailedAttemptModal=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store:attemptFailedStore},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PasswordModal__WEBPACK_IMPORTED_MODULE_1__.Ay,null))},userExceedsMaxAttemptsState=_object_spread_props(_object_spread({},initialState),{document:{maxPasswordAttempts:3,passwordAttempts:3}}),userExceedsMaxAttemptsStore=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_3__.U1)({reducer:function(){return userExceedsMaxAttemptsState}}),PasswordManyAttemptsErrorModal=function(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store:userExceedsMaxAttemptsStore},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PasswordModal__WEBPACK_IMPORTED_MODULE_1__.Ay,null)))};PasswordModal.parameters={...PasswordModal.parameters,docs:{...PasswordModal.parameters?.docs,source:{originalSource:"() => <Provider store={store}>\n    <div>\n      <PasswordModalComponent />\n    </div>\n  </Provider>",...PasswordModal.parameters?.docs?.source}}},PasswordFailedAttemptModal.parameters={...PasswordFailedAttemptModal.parameters,docs:{...PasswordFailedAttemptModal.parameters?.docs,source:{originalSource:"() => <Provider store={attemptFailedStore}>\n    <PasswordModalComponent />\n  </Provider>",...PasswordFailedAttemptModal.parameters?.docs?.source}}},PasswordManyAttemptsErrorModal.parameters={...PasswordManyAttemptsErrorModal.parameters,docs:{...PasswordManyAttemptsErrorModal.parameters?.docs,source:{originalSource:"() => <Provider store={userExceedsMaxAttemptsStore}>\n    <div>\n      <PasswordModalComponent />\n    </div>\n  </Provider>",...PasswordManyAttemptsErrorModal.parameters?.docs?.source}}};const __namedExportsOrder=["PasswordModal","PasswordFailedAttemptModal","PasswordManyAttemptsErrorModal"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/PasswordModal/PasswordModal.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".open.PasswordModal{visibility:visible}.closed.PasswordModal{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.PasswordModal .footer .modal-button.confirm:hover{background:var(--primary-button-hover);border-color:var(--primary-button-hover);color:var(--gray-0)}.PasswordModal .footer .modal-button.confirm{background:var(--primary-button);border-color:var(--primary-button);color:var(--primary-button-text)}.PasswordModal .footer .modal-button.confirm.disabled{cursor:default;background:var(--disabled-button-color);color:var(--primary-button-text)}.PasswordModal .footer .modal-button.confirm.disabled span{color:var(--primary-button-text)}.PasswordModal .footer .modal-button.cancel:hover,.PasswordModal .footer .modal-button.secondary-btn-custom:hover{border:none;box-shadow:inset 0 0 0 1px var(--blue-6);color:var(--blue-6)}.PasswordModal .footer .modal-button.cancel,.PasswordModal .footer .modal-button.secondary-btn-custom{border:none;box-shadow:inset 0 0 0 1px var(--primary-button);color:var(--primary-button)}.PasswordModal .footer .modal-button.cancel.disabled,.PasswordModal .footer .modal-button.secondary-btn-custom.disabled{cursor:default;border:none;box-shadow:inset 0 0 0 1px rgba(43,115,171,.5);color:rgba(43,115,171,.5)}.PasswordModal .footer .modal-button.cancel.disabled span,.PasswordModal .footer .modal-button.secondary-btn-custom.disabled span{color:rgba(43,115,171,.5)}.PasswordModal{position:fixed;left:0;bottom:0;z-index:100;width:100%;height:100%;display:flex;justify-content:center;align-items:center;background:var(--modal-negative-space)}.PasswordModal .modal-container .wrapper .modal-content{padding:10px}.PasswordModal .footer{display:flex;flex-direction:row;justify-content:flex-end;width:100%;margin-top:13px}.PasswordModal .footer.modal-footer{padding:16px;margin:0;border-top:1px solid var(--divider)}.PasswordModal .footer .modal-button{display:flex;justify-content:center;align-items:center;padding:6px 18px;margin:8px 0 0;width:auto;width:-moz-fit-content;width:fit-content;border-radius:4px;height:30px;cursor:pointer}.PasswordModal .footer .modal-button.confirm{margin-left:4px}.PasswordModal .footer .modal-button.secondary-btn-custom{border-radius:4px;padding:2px 20px 4px;cursor:pointer}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .PasswordModal .footer .modal-button{padding:23px 8px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .PasswordModal .footer .modal-button{padding:23px 8px}}.PasswordModal .swipe-indicator{background:var(--swipe-indicator-bg);border-radius:2px;height:4px;width:38px;position:absolute;top:12px;margin-left:auto;margin-right:auto;left:0;right:0}@media(min-width:641px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .PasswordModal .swipe-indicator{display:none}}@container (min-width: 641px){.App.is-web-component:not(.is-in-desktop-only-mode) .PasswordModal .swipe-indicator{display:none}}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .PasswordModal .swipe-indicator{width:32px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .PasswordModal .swipe-indicator{width:32px}}.PasswordModal .modal-container{width:480px}.PasswordModal .modal-container .wrapper form{padding:16px;font-size:14px}.PasswordModal .modal-container .wrapper .incorrect-password{margin-top:6px;font-size:13px;color:#cf0101}.PasswordModal .modal-container .wrapper .modal-button{margin-top:0}.PasswordModal .modal-container .wrapper .error-modal-content{padding:2px 16px}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./node_modules/react-swipeable/es/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Hx:()=>Swipeable});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);function _extends(){return _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var defaultProps={preventDefaultTouchmoveEvent:!1,delta:10,rotationAngle:0,trackMouse:!1,trackTouch:!0},initialState={xy:[0,0],swiping:!1,eventData:void 0,start:void 0},LEFT="Left",RIGHT="Right",UP="Up",DOWN="Down",touchStart="touchstart",touchMove="touchmove",touchEnd="touchend",mouseMove="mousemove",mouseUp="mouseup";function rotateXYByAngle(pos,angle){if(0===angle)return pos;var angleInRadians=Math.PI/180*angle;return[pos[0]*Math.cos(angleInRadians)+pos[1]*Math.sin(angleInRadians),pos[1]*Math.cos(angleInRadians)-pos[0]*Math.sin(angleInRadians)]}function getHandlers(set,handlerProps){var onStart=function onStart(event){event.touches&&event.touches.length>1||set((function(state,props){props.trackMouse&&(document.addEventListener(mouseMove,onMove),document.addEventListener(mouseUp,onUp));var _ref=event.touches?event.touches[0]:event,xy=rotateXYByAngle([_ref.clientX,_ref.clientY],props.rotationAngle);return _extends({},state,initialState,{eventData:{initial:[].concat(xy),first:!0},xy,start:event.timeStamp||0})}))},onMove=function onMove(event){set((function(state,props){if(!state.xy[0]||!state.xy[1]||event.touches&&event.touches.length>1)return state;var _ref2=event.touches?event.touches[0]:event,_rotateXYByAngle=rotateXYByAngle([_ref2.clientX,_ref2.clientY],props.rotationAngle),x=_rotateXYByAngle[0],y=_rotateXYByAngle[1],deltaX=state.xy[0]-x,deltaY=state.xy[1]-y,absX=Math.abs(deltaX),absY=Math.abs(deltaY),time=(event.timeStamp||0)-state.start,velocity=Math.sqrt(absX*absX+absY*absY)/(time||1);if(absX<props.delta&&absY<props.delta&&!state.swiping)return state;var dir=function getDirection(absX,absY,deltaX,deltaY){return absX>absY?deltaX>0?LEFT:RIGHT:deltaY>0?UP:DOWN}(absX,absY,deltaX,deltaY),eventData=_extends({},state.eventData,{event,absX,absY,deltaX,deltaY,velocity,dir});props.onSwiping&&props.onSwiping(eventData);var cancelablePageSwipe=!1;return(props.onSwiping||props.onSwiped||props["onSwiped"+dir])&&(cancelablePageSwipe=!0),cancelablePageSwipe&&props.preventDefaultTouchmoveEvent&&props.trackTouch&&event.cancelable&&event.preventDefault(),_extends({},state,{eventData:_extends({},eventData,{first:!1}),swiping:!0})}))},onEnd=function onEnd(event){set((function(state,props){var eventData;return state.swiping&&(eventData=_extends({},state.eventData,{event}),props.onSwiped&&props.onSwiped(eventData),props["onSwiped"+eventData.dir]&&props["onSwiped"+eventData.dir](eventData)),_extends({},state,initialState,{eventData})}))},cleanUpMouse=function cleanUpMouse(){document.removeEventListener(mouseMove,onMove),document.removeEventListener(mouseUp,onUp)},onUp=function onUp(e){cleanUpMouse(),onEnd(e)},attachTouch=function attachTouch(el){if(el&&el.addEventListener){var tls=[[touchStart,onStart],[touchMove,onMove],[touchEnd,onEnd]];return tls.forEach((function(_ref3){var e=_ref3[0],h=_ref3[1];return el.addEventListener(e,h)})),function(){return tls.forEach((function(_ref4){var e=_ref4[0],h=_ref4[1];return el.removeEventListener(e,h)}))}}},output={ref:function onRef(el){null!==el&&set((function(state,props){if(state.el===el)return state;var addState={};return state.el&&state.el!==el&&state.cleanUpTouch&&(state.cleanUpTouch(),addState.cleanUpTouch=null),props.trackTouch&&el&&(addState.cleanUpTouch=attachTouch(el)),_extends({},state,{el},addState)}))}};return handlerProps.trackMouse&&(output.onMouseDown=onStart),[output,attachTouch]}function updateTransientState(state,props,attachTouch){var addState={};return!props.trackTouch&&state.cleanUpTouch?(state.cleanUpTouch(),addState.cleanUpTouch=null):props.trackTouch&&!state.cleanUpTouch&&state.el&&(addState.cleanUpTouch=attachTouch(state.el)),_extends({},state,addState)}var Swipeable=function(_React$PureComponent){function Swipeable(props){var _this;return(_this=_React$PureComponent.call(this,props)||this)._set=function(cb){_this.transientState=cb(_this.transientState,_this.props)},_this.transientState=_extends({},initialState,{type:"class"}),_this}return function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype),subClass.prototype.constructor=subClass,subClass.__proto__=superClass}(Swipeable,_React$PureComponent),Swipeable.prototype.render=function render(){var _this$props=this.props,className=_this$props.className,style=_this$props.style,_this$props$nodeName=_this$props.nodeName,nodeName=void 0===_this$props$nodeName?"div":_this$props$nodeName,innerRef=_this$props.innerRef,children=_this$props.children,trackMouse=_this$props.trackMouse,_getHandlers=getHandlers(this._set,{trackMouse}),handlers=_getHandlers[0],attachTouch=_getHandlers[1];this.transientState=updateTransientState(this.transientState,this.props,attachTouch);var ref=innerRef?function(el){return innerRef(el),handlers.ref(el)}:handlers.ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(nodeName,_extends({},handlers,{className,style,ref}),children)},Swipeable}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent);Swipeable.propTypes={onSwiped:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwiping:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedUp:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedRight:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedDown:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedLeft:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,delta:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number,preventDefaultTouchmoveEvent:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,nodeName:prop_types__WEBPACK_IMPORTED_MODULE_1___default().string,trackMouse:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,trackTouch:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,innerRef:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,rotationAngle:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number},Swipeable.defaultProps=defaultProps},"./src/components/PasswordModal/PasswordModal.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/PasswordModal/PasswordModal.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Button/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Button__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Button/Button.js");const __WEBPACK_DEFAULT_EXPORT__=_Button__WEBPACK_IMPORTED_MODULE_0__.A;_Button__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Button",props:{isActive:{description:"",type:{name:"bool"},required:!1},mediaQueryClassName:{description:"",type:{name:"string"},required:!1},img:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onDoubleClick:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},isSubmitType:{description:"",type:{name:"bool"},required:!1},ariaLabel:{description:"Will override translated title if both given.",type:{name:"string"},required:!1},ariaControls:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},hideTooltipShortcut:{description:"",type:{name:"bool"},required:!1},useI18String:{description:"",type:{name:"bool"},required:!1},shouldPassActiveDocumentViewerKeyToOnClickHandler:{description:"",type:{name:"bool"},required:!1},children:{description:"",type:{name:"node"},required:!1}}}},"./src/components/PasswordModal/PasswordModal.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Ay:()=>__WEBPACK_DEFAULT_EXPORT__,Pm:()=>setCancelPasswordCheckCallback,mw:()=>setCheckPasswordFunction});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),react_i18next__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),components_Button__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/Button/index.js"),actions__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/redux/actions/index.js"),selectors__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/redux/selectors/index.js"),_ModalWrapper__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/components/ModalWrapper/index.js"),helpers_accessibility__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./src/helpers/accessibility.js"),constants_dataElement__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/constants/dataElement.js");__webpack_require__("./src/components/PasswordModal/PasswordModal.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var checkPassword=function(){},setCheckPasswordFunction=function(fn){checkPassword=fn},cancelPasswordCheckCallback=function(){},setCancelPasswordCheckCallback=function(fn){cancelPasswordCheckCallback=fn},PasswordModal=function(){var _useSelector=_sliced_to_array((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.d4)((function(state){return[selectors__WEBPACK_IMPORTED_MODULE_5__.A.isElementOpen(state,constants_dataElement__WEBPACK_IMPORTED_MODULE_7__.A.PASSWORD_MODAL),selectors__WEBPACK_IMPORTED_MODULE_5__.A.getPasswordAttempts(state),selectors__WEBPACK_IMPORTED_MODULE_5__.A.getMaxPasswordAttempts(state)]}),react_redux__WEBPACK_IMPORTED_MODULE_2__.bN),3),isOpen=_useSelector[0],attempt=_useSelector[1],maxAttempts=_useSelector[2],dispatch=(0,react_redux__WEBPACK_IMPORTED_MODULE_2__.wA)(),t=_sliced_to_array((0,react_i18next__WEBPACK_IMPORTED_MODULE_9__.B)(),1)[0],passwordInput=react__WEBPACK_IMPORTED_MODULE_0__.createRef(),_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),2),password=_useState[0],setPassword=_useState[1],_useState1=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(!1),2),userCancelled=_useState1[0],setUserCancelled=_useState1[1];(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){var _passwordInput_current;isOpen?(dispatch(actions__WEBPACK_IMPORTED_MODULE_4__.A.closeElement(constants_dataElement__WEBPACK_IMPORTED_MODULE_7__.A.PROGRESS_MODAL)),null===(_passwordInput_current=passwordInput.current)||void 0===_passwordInput_current||_passwordInput_current.focus(),window.addEventListener("keydown",(function(e){return(0,helpers_accessibility__WEBPACK_IMPORTED_MODULE_10__.dy)(e,closeModal)}))):(setPassword(""),setUserCancelled(!1));return function(){return window.removeEventListener("keydown",helpers_accessibility__WEBPACK_IMPORTED_MODULE_10__.dy)}}),[dispatch,isOpen,passwordInput]);var handleSubmit=function(e){e.preventDefault(),checkPassword(password)},closeModal=function(event){"Escape"===event.key?setUserCancelled(!0):dispatch(actions__WEBPACK_IMPORTED_MODULE_4__.A.closeElement(constants_dataElement__WEBPACK_IMPORTED_MODULE_7__.A.PASSWORD_MODAL)),cancelPasswordCheckCallback()},getErrorModal=function(errorMessage){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ModalWrapper__WEBPACK_IMPORTED_MODULE_6__.A,{isOpen,title:"message.error",closeButtonDataElement:"errorModalCloseButton",onCloseClick:closeModal},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"modal-content error-modal-content"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("p",{"aria-live":"assertive",role:"alert"},t(errorMessage))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"modal-footer footer"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Button__WEBPACK_IMPORTED_MODULE_3__.A,{className:"confirm modal-button",dataElement:"passwordSubmitButton",label:t("action.ok"),onClick:closeModal})))},onKeyDown=function(e){13===e.which&&handleSubmit(e)},renderEnterPasswordContent=function(){var wrongPassword=0!==attempt,wrongPasswordMessage="".concat(t("message.incorrectPassword",{remainingAttempts:maxAttempts-attempt}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ModalWrapper__WEBPACK_IMPORTED_MODULE_6__.A,{isOpen,title:"message.passwordRequired",closeButtonDataElement:"errorModalCloseButton",onCloseClick:function(){setUserCancelled(!0)}},react__WEBPACK_IMPORTED_MODULE_0__.createElement("form",{onSubmit:handleSubmit},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,t("message.enterPassword")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("input",{className:"".concat(wrongPassword?"wrong":"correct"," text-input-modal"),type:"password",ref:passwordInput,autoComplete:"current-password",value:password,onKeyDown,onChange:function(e){return setPassword(e.target.value)},placeholder:t("message.enterPasswordPlaceholder"),"aria-label":"".concat(wrongPassword?wrongPasswordMessage:t("message.enterPassword"))}),wrongPassword&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"incorrect-password"},wrongPasswordMessage)),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"modal-footer footer"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Button__WEBPACK_IMPORTED_MODULE_3__.A,{className:"confirm modal-button",dataElement:"passwordSubmitButton",label:t("action.submit"),disabled:!password,onClick:handleSubmit})))};return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()({Modal:!0,PasswordModal:!0,open:isOpen,closed:!isOpen}),"data-element":constants_dataElement__WEBPACK_IMPORTED_MODULE_7__.A.PASSWORD_MODAL},attempt===maxAttempts?getErrorModal("message.encryptedAttemptsExceeded"):userCancelled?getErrorModal("message.encryptedUserCancelled"):renderEnterPasswordContent())};const __WEBPACK_DEFAULT_EXPORT__=PasswordModal;PasswordModal.__docgenInfo={description:"",methods:[],displayName:"PasswordModal"}}}]);