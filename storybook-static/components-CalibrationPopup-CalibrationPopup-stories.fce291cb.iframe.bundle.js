(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[6897],{"./src/components/CalibrationPopup/CalibrationPopup.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),redux__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_CalibrationPopup__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/CalibrationPopup/CalibrationPopup.js"),reducers_viewerReducer__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/redux/reducers/viewerReducer.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/redux/initialState.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/CalibrationPopup",component:_CalibrationPopup__WEBPACK_IMPORTED_MODULE_2__.A,argTypes:{annotation:{table:{disable:!0}},style:{table:{disable:!0}}}};var reducer=(0,redux__WEBPACK_IMPORTED_MODULE_5__.HY)({viewer:(0,reducers_viewerReducer__WEBPACK_IMPORTED_MODULE_3__.A)(src_redux_initialState__WEBPACK_IMPORTED_MODULE_4__.A.viewer)}),store=(0,redux__WEBPACK_IMPORTED_MODULE_5__.y$)(reducer),distanceMeasurementAnnot=new window.Core.Annotations.LineAnnotation;distanceMeasurementAnnot.Measure={scale:"1 in = 1 in",axis:[{factor:.0138889,unit:"in",decimalSymbol:".",thousandsSymbol:",",display:"D",precision:100,unitPrefix:"",unitSuffix:"",unitPosition:"S"}],distance:[{factor:1,unit:"in",decimalSymbol:".",thousandsSymbol:",",display:"D",precision:100,unitPrefix:"",unitSuffix:"",unitPosition:"S"}],area:[{factor:1,unit:"sq in",decimalSymbol:".",thousandsSymbol:",",display:"D",precision:100,unitPrefix:"",unitSuffix:"",unitPosition:"S"}]},distanceMeasurementAnnot.IT="LineDimension",distanceMeasurementAnnot.DisplayUnits=["in"],distanceMeasurementAnnot.Scale=[[1,"in"],[1,"in"]],distanceMeasurementAnnot.Precision=.01;var Basic=function(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CalibrationPopup__WEBPACK_IMPORTED_MODULE_2__.A,args))}.bind({});Basic.args={annotation:distanceMeasurementAnnot},Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"args => {\n  return <ReduxProvider store={store}>\n      <CalibrationPopup {...args} />\n    </ReduxProvider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/CalibrationPopup/CalibrationPopup.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}@keyframes bottom-up{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes up-bottom{0%{transform:translateY(0)}to{transform:translateY(100%)}}.CalibrationPopup{display:flex;flex-direction:column;align-items:flex-start;padding:var(--padding-medium);width:220px;background:var(--gray-0);box-shadow:0 0 3px var(--gray-7);border-radius:4px}.CalibrationPopup .calibration-popup-label{font-weight:700;margin-bottom:var(--padding-medium)}.CalibrationPopup .pop-switch{margin-top:var(--padding-medium)}.CalibrationPopup .pop-switch.ui__choice--disabled .ui__choice__label{color:var(--gray-5)}.CalibrationPopup .input-container{display:flex;flex-direction:row;justify-content:space-between;align-items:flex-start;grid-gap:var(--padding-small);gap:var(--padding-small);height:32px}.CalibrationPopup .input-container .input-field{width:94px;height:32px}.CalibrationPopup .input-container .input-field.invalid-value{border-color:red}.CalibrationPopup .input-container .input-field:focus{border:1px solid var(--blue-5)}.CalibrationPopup .input-container .input-field .Dropdown__wrapper{width:100%;height:100%}.CalibrationPopup .input-container .input-field .Dropdown__wrapper .Dropdown{height:100%;width:100%!important;text-align:left}.CalibrationPopup .input-container .input-field .Dropdown__wrapper .Dropdown__items{width:100%}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/CalibrationPopup/CalibrationPopup.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/CalibrationPopup/CalibrationPopup.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/CalibrationPopup/CalibrationPopup.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),selectors__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/redux/selectors/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),core__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/core/index.js"),actions__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/redux/actions/index.js"),_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Choice/Choice.js"),_Dropdown__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/Dropdown/index.js"),_Tooltip__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/components/Tooltip/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),react_i18next__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./src/constants/measurementScale.js"),classnames__WEBPACK_IMPORTED_MODULE_8__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_8___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_8__);__webpack_require__("./src/components/CalibrationPopup/CalibrationPopup.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var Scale=window.Core.Scale,parseMeasurementContentsByAnnotation=function(annotation){var factor=annotation.Measure.axis[0].factor;return"ft-in"===annotation.Scale[1][1]?annotation.getLineLength()*factor/12:annotation.getLineLength()*factor},CalibrationPropType={annotation:prop_types__WEBPACK_IMPORTED_MODULE_10___default().shape({Scale:prop_types__WEBPACK_IMPORTED_MODULE_10___default().arrayOf(prop_types__WEBPACK_IMPORTED_MODULE_10___default().array)})},CalibrationPopup=function(param){var _worldScale,_worldScale1,annotation=param.annotation,t=_sliced_to_array((0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.B)(),1)[0],dispatch=(0,react_redux__WEBPACK_IMPORTED_MODULE_2__.wA)(),_useSelector=_sliced_to_array((0,react_redux__WEBPACK_IMPORTED_MODULE_2__.d4)((function(state){return[selectors__WEBPACK_IMPORTED_MODULE_1__.A.getMeasurementUnits(state),selectors__WEBPACK_IMPORTED_MODULE_1__.A.getCalibrationInfo(state)]}),react_redux__WEBPACK_IMPORTED_MODULE_2__.bN),2),measurementUnits=_useSelector[0],_useSelector_=_useSelector[1],tempScale=_useSelector_.tempScale,isFractionalUnit=_useSelector_.isFractionalUnit,defaultUnit=_useSelector_.defaultUnit,_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""),2),valueDisplay=_useState[0],setValueDisplay=_useState[1],inputRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),unitTo=(null===(_worldScale=new Scale(tempScale).worldScale)||void 0===_worldScale?void 0:_worldScale.unit)||"mm",unitToOptions=isFractionalUnit?measurementUnits.to.filter((function(unit){return constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.Ph.includes(unit)})):measurementUnits.to,isFractionalUnitsToggleDisabled=!constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.Ph.includes(unitTo),valueInputType=isFractionalUnit||"ft-in"===unitTo?"text":"number",inputValueClass=classnames__WEBPACK_IMPORTED_MODULE_8___default()("input-field",{"invalid-value":!(tempScale&&(null===(_worldScale1=new Scale(tempScale).worldScale)||void 0===_worldScale1?void 0:_worldScale1.value)>0)}),updateTempScale=function(scaleValue,scaleUnit){var pageUnit,currentDistance=parseMeasurementContentsByAnnotation(annotation),currentScale=annotation.Scale,newRatio=currentDistance/currentScale[1][0],pageScale=[currentScale[0][0]*newRatio,currentScale[0][1]],defaultPageUnit="pt"===(pageUnit=scaleUnit)?"pt":constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.EN.includes(pageUnit)?"mm":"in",defaultPageValue=(0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.oU)(pageScale[0],pageScale[1],defaultPageUnit);dispatch(actions__WEBPACK_IMPORTED_MODULE_4__.A.updateCalibrationInfo({tempScale:"".concat(defaultPageValue," ").concat(defaultPageUnit," = ").concat(scaleValue," ").concat(scaleUnit),isFractionalUnit}))},setValue=function(scaleValue){var _worldScale;updateTempScale(scaleValue,null===(_worldScale=new Scale(tempScale).worldScale)||void 0===_worldScale?void 0:_worldScale.unit)},updateValueDisplay=function(){var _worldScale,newValueDisplay,scaleValue=null===(_worldScale=new Scale(tempScale).worldScale)||void 0===_worldScale?void 0:_worldScale.value;newValueDisplay=isFractionalUnit||"ft-in"===unitTo?Scale.getFormattedValue(scaleValue,unitTo,isFractionalUnit?1/64:1e-4,!1,!0):"".concat(scaleValue),setValueDisplay(newValueDisplay||"")},tempScaleRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(tempScale);return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){tempScaleRef.current=tempScale}),[tempScale]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){if(annotation){var value=parseMeasurementContentsByAnnotation(annotation),unit=annotation.Scale[1][1];defaultUnit?updateTempScale((0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.oU)(value,unit,defaultUnit),defaultUnit):updateTempScale(value,unit)}var onAnnotationChanged=function(annotations,action){if("modify"===action&&1===annotations.length&&annotations[0]===annotation){var _worldScale,value=parseMeasurementContentsByAnnotation(annotation),unit=annotation.Scale[1][1],currentUnit=null===(_worldScale=new Scale(tempScaleRef.current).worldScale)||void 0===_worldScale?void 0:_worldScale.unit;currentUnit?updateTempScale((0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.oU)(value,unit,currentUnit),currentUnit):updateTempScale(value,unit)}};return core__WEBPACK_IMPORTED_MODULE_3__.A.addEventListener("annotationChanged",onAnnotationChanged),function(){core__WEBPACK_IMPORTED_MODULE_3__.A.removeEventListener("annotationChanged",onAnnotationChanged),core__WEBPACK_IMPORTED_MODULE_3__.A.deleteAnnotations([annotation])}}),[annotation]),(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){(null==inputRef?void 0:inputRef.current)!==document.activeElement&&updateValueDisplay()}),[tempScale,isFractionalUnit]),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"CalibrationPopup","data-element":"calibrationPopup"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("label",{className:"calibration-popup-label",id:"calibration-popup-label",htmlFor:"calibration-popup-value"},t("option.measurement.scaleModal.units")),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"input-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("input",{id:"calibration-popup-value",className:inputValueClass,ref:inputRef,type:valueInputType,value:valueDisplay,min:"0",onChange:function(e){setValueDisplay(e.target.value);var inputValue=e.target.value.trim();if(isFractionalUnit){if("in"===unitTo){if(constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.yQ.test(inputValue)){var result2=(0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.cX)(inputValue);if(result2>0)return void setValue(result2)}}else if("ft-in"===unitTo&&constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.CR.test(inputValue)){var result3=(0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.QQ)(inputValue);if(result3>0)return void setValue(result3)}}else if("ft-in"===unitTo&&constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.oi.test(inputValue)){var result=(0,constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.Cg)(inputValue);if(result>0)return void setValue(result)}else if(constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.SY.test(inputValue)){var result1=parseFloat(inputValue)||0;return void setValue(result1)}setValue(0)},onBlur:function(){updateValueDisplay()},placeholder:isFractionalUnit?constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.OR[unitTo]:"ft-in"===unitTo?constants_measurementScale__WEBPACK_IMPORTED_MODULE_7__.OR["ft-in decimal"]:""}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Tooltip__WEBPACK_IMPORTED_MODULE_6__.A,{content:"option.measurement.scaleModal.displayUnits"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"input-field"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Dropdown__WEBPACK_IMPORTED_MODULE_5__.A,{id:"calibration-popup-units",dataElement:"calibrationUnits",items:unitToOptions,currentSelectionKey:unitTo,onClickItem:function(scaleUnit){var _worldScale;updateTempScale(null===(_worldScale=new Scale(tempScale).worldScale)||void 0===_worldScale?void 0:_worldScale.value,scaleUnit)},labelledById:"calibration-popup-label"})))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Tooltip__WEBPACK_IMPORTED_MODULE_6__.A,{content:t("option.measurement.scaleModal.fractionUnitsTooltip")},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_12__.G,{isSwitch:!0,leftLabel:!0,label:t("option.measurement.scaleModal.fractionalUnits"),disabled:isFractionalUnitsToggleDisabled,checked:isFractionalUnit,id:"calibration-popup-fractional-units",className:"pop-switch",onChange:function(){dispatch(actions__WEBPACK_IMPORTED_MODULE_4__.A.updateCalibrationInfo({tempScale,isFractionalUnit:!isFractionalUnit}))}}))))};CalibrationPopup.propTypes=CalibrationPropType;const __WEBPACK_DEFAULT_EXPORT__=CalibrationPopup;CalibrationPopup.__docgenInfo={description:"",methods:[],displayName:"CalibrationPopup",props:{annotation:{description:"",type:{name:"shape",value:{Scale:{name:"arrayOf",value:{name:"array"},required:!1}}},required:!1}}}}}]);