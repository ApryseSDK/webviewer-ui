(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[8043],{"./src/components/ScaleModal/ScaleModal.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_ScaleModal__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/ScaleModal/ScaleModal.js"),redux__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),core__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/core/index.js"),constants_measurementScale__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/constants/measurementScale.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/ScaleModal",component:_ScaleModal__WEBPACK_IMPORTED_MODULE_1__.A,parameters:{customizableUI:!0}};core__WEBPACK_IMPORTED_MODULE_3__.A.getScales=function(){return[]},core__WEBPACK_IMPORTED_MODULE_3__.A.getScalePrecision=function(){return.1},core__WEBPACK_IMPORTED_MODULE_3__.A.getViewerElement=function(){};var getStore=function(){var initialState={viewer:{openElements:{scaleModal:!0},disabledElements:{},hiddenElements:{},calibrationInfo:{tempScale:"",isFractionalUnit:!1},measurementScalePreset:(0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_4__.gK)(),measurementUnits:{from:["in","mm","cm","pt"],to:["in","mm","cm","pt","ft","ft-in","m","yd","km","mi"]},selectedScale:constants_measurementScale__WEBPACK_IMPORTED_MODULE_4__.Br,customElementOverrides:{}}};return(0,redux__WEBPACK_IMPORTED_MODULE_5__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState}))};function Basic(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store:getStore()},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_ScaleModal__WEBPACK_IMPORTED_MODULE_1__.A,null))}Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"function Basic() {\n  return <Provider store={getStore()}>\n      <ScaleModal />\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".ui__choice__input__icon{top:-6px!important}.ui__icon{align-items:baseline!important}.ui__choice{align-items:center}.ui__choice__label{font-size:13px!important}.ui__choice__input--switch .ui__choice__input__switch{height:14px!important;border-radius:24px!important;background-color:var(--input-switch-default-color)!important;border:none!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--disabled{opacity:.6;cursor:not-allowed}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked{background-color:var(--checked-option)!important}.ui__choice__input--switch .ui__choice__input__switch.ui__choice__input__switch--checked .ui__choice__input__toggle{left:12px!important}.ui__choice__input--switch .ui__choice__input__switch--focus{outline:var(--focus-visible-outline)}.ui__choice__input--switch .ui__choice__input__switch .ui__choice__input__toggle{height:10px!important;width:10px!important;background-color:var(--gray-0)!important;left:2px!important}.ui__choice__input--switch input:disabled{cursor:not-allowed!important}.ui__choice__input__check--focus{outline:var(--focus-visible-outline)}",""]),module.exports=exports},"./node_modules/react-swipeable/es/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{Hx:()=>Swipeable});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_1__);function _extends(){return _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source)Object.prototype.hasOwnProperty.call(source,key)&&(target[key]=source[key])}return target},_extends.apply(this,arguments)}var defaultProps={preventDefaultTouchmoveEvent:!1,delta:10,rotationAngle:0,trackMouse:!1,trackTouch:!0},initialState={xy:[0,0],swiping:!1,eventData:void 0,start:void 0},LEFT="Left",RIGHT="Right",UP="Up",DOWN="Down",touchStart="touchstart",touchMove="touchmove",touchEnd="touchend",mouseMove="mousemove",mouseUp="mouseup";function rotateXYByAngle(pos,angle){if(0===angle)return pos;var angleInRadians=Math.PI/180*angle;return[pos[0]*Math.cos(angleInRadians)+pos[1]*Math.sin(angleInRadians),pos[1]*Math.cos(angleInRadians)-pos[0]*Math.sin(angleInRadians)]}function getHandlers(set,handlerProps){var onStart=function onStart(event){event.touches&&event.touches.length>1||set((function(state,props){props.trackMouse&&(document.addEventListener(mouseMove,onMove),document.addEventListener(mouseUp,onUp));var _ref=event.touches?event.touches[0]:event,xy=rotateXYByAngle([_ref.clientX,_ref.clientY],props.rotationAngle);return _extends({},state,initialState,{eventData:{initial:[].concat(xy),first:!0},xy,start:event.timeStamp||0})}))},onMove=function onMove(event){set((function(state,props){if(!state.xy[0]||!state.xy[1]||event.touches&&event.touches.length>1)return state;var _ref2=event.touches?event.touches[0]:event,_rotateXYByAngle=rotateXYByAngle([_ref2.clientX,_ref2.clientY],props.rotationAngle),x=_rotateXYByAngle[0],y=_rotateXYByAngle[1],deltaX=state.xy[0]-x,deltaY=state.xy[1]-y,absX=Math.abs(deltaX),absY=Math.abs(deltaY),time=(event.timeStamp||0)-state.start,velocity=Math.sqrt(absX*absX+absY*absY)/(time||1);if(absX<props.delta&&absY<props.delta&&!state.swiping)return state;var dir=function getDirection(absX,absY,deltaX,deltaY){return absX>absY?deltaX>0?LEFT:RIGHT:deltaY>0?UP:DOWN}(absX,absY,deltaX,deltaY),eventData=_extends({},state.eventData,{event,absX,absY,deltaX,deltaY,velocity,dir});props.onSwiping&&props.onSwiping(eventData);var cancelablePageSwipe=!1;return(props.onSwiping||props.onSwiped||props["onSwiped"+dir])&&(cancelablePageSwipe=!0),cancelablePageSwipe&&props.preventDefaultTouchmoveEvent&&props.trackTouch&&event.cancelable&&event.preventDefault(),_extends({},state,{eventData:_extends({},eventData,{first:!1}),swiping:!0})}))},onEnd=function onEnd(event){set((function(state,props){var eventData;return state.swiping&&(eventData=_extends({},state.eventData,{event}),props.onSwiped&&props.onSwiped(eventData),props["onSwiped"+eventData.dir]&&props["onSwiped"+eventData.dir](eventData)),_extends({},state,initialState,{eventData})}))},cleanUpMouse=function cleanUpMouse(){document.removeEventListener(mouseMove,onMove),document.removeEventListener(mouseUp,onUp)},onUp=function onUp(e){cleanUpMouse(),onEnd(e)},attachTouch=function attachTouch(el){if(el&&el.addEventListener){var tls=[[touchStart,onStart],[touchMove,onMove],[touchEnd,onEnd]];return tls.forEach((function(_ref3){var e=_ref3[0],h=_ref3[1];return el.addEventListener(e,h)})),function(){return tls.forEach((function(_ref4){var e=_ref4[0],h=_ref4[1];return el.removeEventListener(e,h)}))}}},output={ref:function onRef(el){null!==el&&set((function(state,props){if(state.el===el)return state;var addState={};return state.el&&state.el!==el&&state.cleanUpTouch&&(state.cleanUpTouch(),addState.cleanUpTouch=null),props.trackTouch&&el&&(addState.cleanUpTouch=attachTouch(el)),_extends({},state,{el},addState)}))}};return handlerProps.trackMouse&&(output.onMouseDown=onStart),[output,attachTouch]}function updateTransientState(state,props,attachTouch){var addState={};return!props.trackTouch&&state.cleanUpTouch?(state.cleanUpTouch(),addState.cleanUpTouch=null):props.trackTouch&&!state.cleanUpTouch&&state.el&&(addState.cleanUpTouch=attachTouch(state.el)),_extends({},state,addState)}var Swipeable=function(_React$PureComponent){function Swipeable(props){var _this;return(_this=_React$PureComponent.call(this,props)||this)._set=function(cb){_this.transientState=cb(_this.transientState,_this.props)},_this.transientState=_extends({},initialState,{type:"class"}),_this}return function _inheritsLoose(subClass,superClass){subClass.prototype=Object.create(superClass.prototype),subClass.prototype.constructor=subClass,subClass.__proto__=superClass}(Swipeable,_React$PureComponent),Swipeable.prototype.render=function render(){var _this$props=this.props,className=_this$props.className,style=_this$props.style,_this$props$nodeName=_this$props.nodeName,nodeName=void 0===_this$props$nodeName?"div":_this$props$nodeName,innerRef=_this$props.innerRef,children=_this$props.children,trackMouse=_this$props.trackMouse,_getHandlers=getHandlers(this._set,{trackMouse}),handlers=_getHandlers[0],attachTouch=_getHandlers[1];this.transientState=updateTransientState(this.transientState,this.props,attachTouch);var ref=innerRef?function(el){return innerRef(el),handlers.ref(el)}:handlers.ref;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(nodeName,_extends({},handlers,{className,style,ref}),children)},Swipeable}(react__WEBPACK_IMPORTED_MODULE_0__.PureComponent);Swipeable.propTypes={onSwiped:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwiping:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedUp:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedRight:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedDown:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,onSwipedLeft:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,delta:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number,preventDefaultTouchmoveEvent:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,nodeName:prop_types__WEBPACK_IMPORTED_MODULE_1___default().string,trackMouse:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,trackTouch:prop_types__WEBPACK_IMPORTED_MODULE_1___default().bool,innerRef:prop_types__WEBPACK_IMPORTED_MODULE_1___default().func,rotationAngle:prop_types__WEBPACK_IMPORTED_MODULE_1___default().number},Swipeable.defaultProps=defaultProps},"./src/components/Choice/Choice.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Choice/Choice.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/Button/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Button__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Button/Button.js");const __WEBPACK_DEFAULT_EXPORT__=_Button__WEBPACK_IMPORTED_MODULE_0__.A;_Button__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Button",props:{isActive:{description:"",type:{name:"bool"},required:!1},mediaQueryClassName:{description:"",type:{name:"string"},required:!1},img:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onDoubleClick:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},isSubmitType:{description:"",type:{name:"bool"},required:!1},ariaLabel:{description:"Will override translated title if both given.",type:{name:"string"},required:!1},ariaControls:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},hideTooltipShortcut:{description:"",type:{name:"bool"},required:!1},useI18String:{description:"",type:{name:"bool"},required:!1},shouldPassActiveDocumentViewerKeyToOnClickHandler:{description:"",type:{name:"bool"},required:!1},children:{description:"",type:{name:"node"},required:!1}}}},"./src/components/Dropdown/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Dropdown__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Dropdown/Dropdown.js");const __WEBPACK_DEFAULT_EXPORT__=_Dropdown__WEBPACK_IMPORTED_MODULE_0__.A;_Dropdown__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Dropdown",props:{id:{defaultValue:{value:"''",computed:!1},description:"",type:{name:"string"},required:!1},width:{defaultValue:{value:"width || DEFAULT_WIDTH",computed:!1},description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},columns:{defaultValue:{value:"1",computed:!1},description:"",type:{name:"number"},required:!1},onClickItem:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},disabled:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},applyCustomStyleToButton:{defaultValue:{value:"true",computed:!1},description:"",type:{name:"bool"},required:!1},getCustomItemStyle:{defaultValue:{value:"() => ({})",computed:!1},description:"",type:{name:"func"},required:!1},placeholder:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"string"},required:!1},getKey:{defaultValue:{value:"(item) => item",computed:!1},description:"",type:{name:"func"},required:!1},getDisplayValue:{defaultValue:{value:"(item) => item",computed:!1},description:"",type:{name:"func"},required:!1},className:{defaultValue:{value:"''",computed:!1},description:"",type:{name:"string"},required:!1},hasInput:{defaultValue:{value:"false",computed:!1},required:!1},displayButton:{defaultValue:{value:"null",computed:!1},required:!1},customDataValidator:{defaultValue:{value:"() => true",computed:!1},required:!1},isSearchEnabled:{defaultValue:{value:"true",computed:!1},required:!1},onOpened:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},onClosed:{defaultValue:{value:"() => { }",computed:!1},description:"",type:{name:"func"},required:!1},arrowDirection:{defaultValue:{value:"'down'",computed:!1},description:"",type:{name:"string"},required:!1},disableFocusing:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},renderItem:{defaultValue:{value:"(item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>)",computed:!1},description:"",type:{name:"func"},required:!1},renderSelectedItem:{defaultValue:{value:"(item, getTranslatedDisplayValue) => (<>{getTranslatedDisplayValue(item)}</>)",computed:!1},description:"",type:{name:"func"},required:!1},showLabelInList:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},isFlyoutItem:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},onKeyDownHandler:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"func"},required:!1},onFocus:{defaultValue:{value:"null",computed:!1},description:"",type:{name:"func"},required:!1},items:{defaultValue:{value:"[]",computed:!1},description:"",type:{name:"array"},required:!1},images:{defaultValue:{value:"[]",computed:!1},description:"",type:{name:"array"},required:!1},height:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},currentSelectionKey:{description:"",type:{name:"string"},required:!1},translationPrefix:{description:"",type:{name:"string"},required:!1},getTranslationLabel:{description:"",type:{name:"func"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},maxHeight:{description:"",type:{name:"number"},required:!1},labelledById:{description:"",type:{name:"string"},required:!1}}}},"./src/constants/measurementScale.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}__webpack_require__.d(__webpack_exports__,{Br:()=>initialScale,CR:()=>ftInFractionalRegex,Cg:()=>parseFtInDecimal,D4:()=>PrecisionType,EN:()=>metricUnits,Iq:()=>precisionFractions,OR:()=>hintValues,Oh:()=>scalePresetPrecision,Ph:()=>fractionalUnits,QQ:()=>parseFtInFractional,SY:()=>floatRegex,cX:()=>parseInFractional,dz:()=>precisionOptions,fM:()=>ifFractionalPrecision,gJ:()=>PresetMeasurementSystems,gK:()=>getMeasurementScalePreset,oU:()=>convertUnit,oi:()=>ftInDecimalRegex,yQ:()=>inFractionalRegex});var _obj,_obj1,Scale=window.Core.Scale,PresetMeasurementSystems={METRIC:"metric",IMPERIAL:"imperial"},metricPreset=[["1:10",new Scale([[1,"mm"],[10,"mm"]])],["1:20",new Scale([[1,"mm"],[20,"mm"]])],["1:50",new Scale([[1,"mm"],[50,"mm"]])],["1:100",new Scale([[1,"mm"],[100,"mm"]])],["1:200",new Scale([[1,"mm"],[200,"mm"]])],["1:500",new Scale([[1,"mm"],[500,"mm"]])],["1:1000",new Scale([[1,"mm"],[1e3,"mm"]])]],imperialPreset=[['1/16"=1\'-0"',new Scale([[1/16,"in"],[1,"ft-in"]])],['3/32"=1\'-0"',new Scale([[3/32,"in"],[1,"ft-in"]])],['1/8"=1\'-0"',new Scale([[1/8,"in"],[1,"ft-in"]])],['3/16"=1\'-0"',new Scale([[3/16,"in"],[1,"ft-in"]])],['1/4"=1\'-0"',new Scale([[1/4,"in"],[1,"ft-in"]])],['3/8"=1\'-0"',new Scale([[3/8,"in"],[1,"ft-in"]])],['1/2"=1\'-0"',new Scale([[.5,"in"],[1,"ft-in"]])],['3/4"=1\'-0"',new Scale([[3/4,"in"],[1,"ft-in"]])],['1"=1\'-0"',new Scale([[1,"in"],[1,"ft-in"]])]],getMeasurementScalePreset=function(){var _obj;return _define_property(_obj={},PresetMeasurementSystems.METRIC,metricPreset),_define_property(_obj,PresetMeasurementSystems.IMPERIAL,imperialPreset),_obj},fractionalPrecisions=[["1/8",.125],["1/16",.0625],["1/32",.03125],["1/64",.015625]],PrecisionType={DECIMAL:"decimal",FRACTIONAL:"fractional"},precisionOptions=(_define_property(_obj={},PrecisionType.DECIMAL,[["0.1",.1],["0.01",.01],["0.001",.001],["0.0001",1e-4]]),_define_property(_obj,PrecisionType.FRACTIONAL,fractionalPrecisions),_obj),precisionFractions={.125:"1/8",.0625:"1/16",.03125:"1/32",.015625:"1/64"},floatRegex=/^(\d+)?(\.)?(\d+)?$/,inFractionalRegex=/^((\d+) )?((\d+)\/)?(\d+)"$/,ftInFractionalRegex=/^((\d+)'-)?((\d+) )?((\d+)\/)?(\d+)"$/,ftInDecimalRegex=/^((\d+)ft-)?(((\d+).)?(\d+))in$/,parseFtInDecimal=function(valueStr){var matches=valueStr.match(ftInDecimalRegex),sum=0;return sum+=matches[2]?Number(matches[2]):0,matches[3]&&Number(matches[3])&&(sum+=Number(matches[3])/12),sum},parseInFractional=function(valueStr){var matches=valueStr.match(inFractionalRegex),sum=0;return sum+=matches[2]?Number(matches[2]):0,matches[5]&&Number(matches[5])&&(matches[4]&&Number(matches[4])?sum+=Number(matches[4])/Number(matches[5]):sum+=Number(matches[5])),sum},parseFtInFractional=function(valueStr){var matches=valueStr.match(ftInFractionalRegex),sum=0;return sum+=matches[2]?Number(matches[2]):0,sum+=matches[4]?Number(matches[4])/12:0,matches[7]&&Number(matches[7])&&(matches[6]&&Number(matches[6])?sum+=Number(matches[6])/Number(matches[7])/12:sum+=Number(matches[7])/12),sum},fractionalUnits=["in","ft-in"],metricUnits=["mm","cm","m","km"],ifFractionalPrecision=function(precision){return fractionalPrecisions.map((function(item){return item[0]})).includes(precision)||fractionalPrecisions.map((function(item){return item[1]})).includes(precision)},hintValues={in:'eg. 1 1/2"',"ft-in":"eg. 1'-1 1/2\"","ft-in decimal":"eg. 1ft-10.5in"},unitConversion={mm:.1,cm:1,m:100,km:1e5,mi:160394,yd:91.44,ft:30.48,in:2.54,"ft'":30.48,'in"':2.54,pt:.0352778,"ft-in":30.48},convertUnit=function(value,unit,newUnit){return value*unitConversion[unit]/unitConversion[newUnit]},scalePresetPrecision=(_define_property(_obj1={},imperialPreset[0][0],fractionalPrecisions[1]),_define_property(_obj1,imperialPreset[1][0],fractionalPrecisions[2]),_define_property(_obj1,imperialPreset[2][0],fractionalPrecisions[0]),_define_property(_obj1,imperialPreset[3][0],fractionalPrecisions[1]),_define_property(_obj1,imperialPreset[4][0],fractionalPrecisions[0]),_define_property(_obj1,imperialPreset[5][0],fractionalPrecisions[0]),_define_property(_obj1,imperialPreset[6][0],fractionalPrecisions[0]),_define_property(_obj1,imperialPreset[7][0],fractionalPrecisions[0]),_define_property(_obj1,imperialPreset[8][0],fractionalPrecisions[0]),_obj1),initialScale=new Scale({pageScale:{value:1,unit:"in"},worldScale:{value:1,unit:"in"}})},"./src/hooks/useDidUpdate.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function __WEBPACK_DEFAULT_EXPORT__(){var callback=arguments.length>0&&void 0!==arguments[0]?arguments[0]:function(){},deps=arguments.length>1?arguments[1]:void 0,didMount=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(!1);(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){if(didMount.current)return callback();didMount.current=!0}),deps)}}}]);