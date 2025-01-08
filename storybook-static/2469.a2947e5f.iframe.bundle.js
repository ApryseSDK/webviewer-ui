"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[2469],{"./src/components/FormFieldEditPopup/FormFieldEditPopup.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/Button/index.js"),react_i18next__WEBPACK_IMPORTED_MODULE_11__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_12__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Choice/Choice.js"),_CreatableDropdown__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/CreatableDropdown/index.js"),_FormFieldPopupDimensionsInput__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/components/FormFieldEditPopup/FormFieldPopupDimensionsInput/index.js"),_HorizontalDivider__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/HorizontalDivider/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_10___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_10__),_TextInput__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/components/TextInput/index.js"),_CreatableList__WEBPACK_IMPORTED_MODULE_8__=(__webpack_require__("./src/components/FormFieldEditPopup/FormFieldEditPopup.scss"),__webpack_require__("./src/components/CreatableList/index.js")),_FormFieldEditPopupIndicator__WEBPACK_IMPORTED_MODULE_9__=__webpack_require__("./src/components/FormFieldEditPopup/FormFieldEditPopupIndicator/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={fields:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array.isRequired,flags:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array.isRequired,closeFormFieldEditPopup:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,isValid:prop_types__WEBPACK_IMPORTED_MODULE_10___default().bool.isRequired,validationMessage:prop_types__WEBPACK_IMPORTED_MODULE_10___default().string.isRequired,radioButtonGroups:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array,options:prop_types__WEBPACK_IMPORTED_MODULE_10___default().array,onOptionsChange:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func,annotation:prop_types__WEBPACK_IMPORTED_MODULE_10___default().object.isRequired,selectedRadioGroup:prop_types__WEBPACK_IMPORTED_MODULE_10___default().string,getPageHeight:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,getPageWidth:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,redrawAnnotation:prop_types__WEBPACK_IMPORTED_MODULE_10___default().func.isRequired,indicator:prop_types__WEBPACK_IMPORTED_MODULE_10___default().object.isRequired},FormFieldEditPopup=function(param){var fields=param.fields,flags=param.flags,closeFormFieldEditPopup=param.closeFormFieldEditPopup,isValid=param.isValid,validationMessage=param.validationMessage,radioButtonGroups=param.radioButtonGroups,options=param.options,onOptionsChange=param.onOptionsChange,annotation=param.annotation,selectedRadioGroup=param.selectedRadioGroup,getPageHeight=param.getPageHeight,getPageWidth=param.getPageWidth,redrawAnnotation=param.redrawAnnotation,indicator=param.indicator,validateWidth=function validateWidth(width){var maxWidth=getPageWidth()-annotation.X;return width>maxWidth?maxWidth:width},validateHeight=function validateHeight(height){var maxHeight=getPageHeight()-annotation.Y;return height>maxHeight?maxHeight:height},renderTextInput=function renderTextInput(field){var hasError=field.required&&!isValid;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_TextInput__WEBPACK_IMPORTED_MODULE_6__.A,{label:"".concat(field.label,"-input"),value:field.value,onChange:field.onChange,validationMessage,hasError,ariaDescribedBy:hasError?"FormFieldInputError":void 0,ariaLabelledBy:field.label})},renderSelectInput=function renderSelectInput(field){var displayRadioGroups=radioButtonGroups.map((function(group){return{value:group,label:group}}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react__WEBPACK_IMPORTED_MODULE_0__.Fragment,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CreatableDropdown__WEBPACK_IMPORTED_MODULE_3__.A,{textPlaceholder:t("formField.formFieldPopup.fieldName"),options:displayRadioGroups,onChange:function(inputValue){return function onSelectInputChange(field,input){null===input?(field.onChange(""),setRadioButtonGroup(null)):(field.onChange(input.value),setRadioButtonGroup({value:input.value,label:input.value}))}(field,inputValue)},value:radioButtonGroup,isValid,messageText:t(validationMessage)}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"radio-group-label"},t("formField.formFieldPopup.radioGroups")))},t=(0,react_i18next__WEBPACK_IMPORTED_MODULE_11__.B)().t,className=classnames__WEBPACK_IMPORTED_MODULE_1___default()({Popup:!0,FormFieldEditPopup:!0}),_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(annotation.Width.toFixed(0)),2),width=_useState[0],setWidth=_useState[1],_useState1=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(annotation.Height.toFixed(0)),2),height=_useState1[0],setHeight=_useState1[1],popupRef=(0,react__WEBPACK_IMPORTED_MODULE_0__.useRef)(null),_useState2=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)(""===selectedRadioGroup?null:{value:selectedRadioGroup,label:selectedRadioGroup}),2),radioButtonGroup=_useState2[0],setRadioButtonGroup=_useState2[1];(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){setRadioButtonGroup(""!==selectedRadioGroup?{value:selectedRadioGroup,label:selectedRadioGroup}:null)}),[selectedRadioGroup]);var indicatorPlaceholder=t("formField.formFieldPopup.indicatorPlaceHolders.".concat(annotation.getField().getFieldType()));return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className,ref:popupRef},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"fields-container"},fields.map((function(field){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"field-input",key:field.label},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{id:field.label},t(field.label),field.required?"*":"",":"),function renderInput(field){return"text"===field.type?renderTextInput(field):"select"===field.type?renderSelectInput(field):void 0}(field))}))),options&&function renderListOptions(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"field-options-container"},t("formField.formFieldPopup.options"),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_CreatableList__WEBPACK_IMPORTED_MODULE_8__.A,{options,onOptionsUpdated:onOptionsChange,popupRef}))}(),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"field-flags-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("span",{className:"field-flags-title"},t("formField.formFieldPopup.flags")),flags.map((function(flag){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_pdftron_webviewer_react_toolkit__WEBPACK_IMPORTED_MODULE_12__.G,{id:t(flag.label),key:t(flag.label),checked:flag.isChecked,onChange:function(event){return flag.onChange(event.target.checked)},label:t(flag.label),"aria-label":t(flag.label),"aria-checked":flag.isChecked})}))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FormFieldPopupDimensionsInput__WEBPACK_IMPORTED_MODULE_4__.A,{width,height,onWidthChange:function onWidthChange(width){var validatedWidth=validateWidth(width);annotation.setWidth(validatedWidth),setWidth(validatedWidth),redrawAnnotation(annotation)},onHeightChange:function onHeightChange(height){var validatedHeight=validateHeight(height);annotation.setHeight(validatedHeight),setHeight(validatedHeight),redrawAnnotation(annotation)}}),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_HorizontalDivider__WEBPACK_IMPORTED_MODULE_5__.A,null),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_FormFieldEditPopupIndicator__WEBPACK_IMPORTED_MODULE_9__.A,{indicator,indicatorPlaceholder}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"form-buttons-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Button__WEBPACK_IMPORTED_MODULE_2__.A,{className:"ok-form-field-button",onClick:closeFormFieldEditPopup,dataElement:"formFieldOK",label:t("action.close"),disabled:!isValid})))};FormFieldEditPopup.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=FormFieldEditPopup;FormFieldEditPopup.__docgenInfo={description:"",methods:[],displayName:"FormFieldEditPopup",props:{fields:{description:"",type:{name:"array"},required:!0},flags:{description:"",type:{name:"array"},required:!0},closeFormFieldEditPopup:{description:"",type:{name:"func"},required:!0},isValid:{description:"",type:{name:"bool"},required:!0},validationMessage:{description:"",type:{name:"string"},required:!0},radioButtonGroups:{description:"",type:{name:"array"},required:!1},options:{description:"",type:{name:"array"},required:!1},onOptionsChange:{description:"",type:{name:"func"},required:!1},annotation:{description:"",type:{name:"object"},required:!0},selectedRadioGroup:{description:"",type:{name:"string"},required:!1},getPageHeight:{description:"",type:{name:"func"},required:!0},getPageWidth:{description:"",type:{name:"func"},required:!0},redrawAnnotation:{description:"",type:{name:"func"},required:!0},indicator:{description:"",type:{name:"object"},required:!0}}}},"./src/components/FormFieldEditPopup/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>components_FormFieldEditPopup});var react=__webpack_require__("./node_modules/react/index.js"),cjs=__webpack_require__("./node_modules/react-draggable/build/cjs/cjs.js"),cjs_default=__webpack_require__.n(cjs),core=__webpack_require__("./src/core/index.js"),FormFieldEditPopup=__webpack_require__("./src/components/FormFieldEditPopup/FormFieldEditPopup.js"),FormFieldEditSignaturePopup=__webpack_require__("./src/components/FormFieldEditPopup/FormFieldEditSignaturePopup/FormFieldEditSignaturePopup.js");const FormFieldEditPopup_FormFieldEditSignaturePopup=FormFieldEditSignaturePopup.A;FormFieldEditSignaturePopup.A.__docgenInfo={description:"",methods:[],displayName:"FormFieldEditSignaturePopup",props:{fields:{description:"",type:{name:"array"},required:!1},flags:{description:"",type:{name:"array"},required:!1},closeFormFieldEditPopup:{description:"",type:{name:"func"},required:!1},isValid:{description:"",type:{name:"bool"},required:!1},validationMessage:{description:"",type:{name:"string"},required:!1},annotation:{description:"",type:{name:"object"},required:!1},getPageHeight:{description:"",type:{name:"func"},required:!1},getPageWidth:{description:"",type:{name:"func"},required:!1},redrawAnnotation:{description:"",type:{name:"func"},required:!1},onSignatureOptionChange:{description:"",type:{name:"func"},required:!1},getSignatureOptionHandler:{description:"",type:{name:"func"},required:!1},indicator:{description:"",type:{name:"object"},required:!1}}};var es=__webpack_require__("./node_modules/react-redux/es/index.js"),actions=__webpack_require__("./src/redux/actions/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),useOnClickOutside=__webpack_require__("./src/hooks/useOnClickOutside.js"),getPopupPosition=__webpack_require__("./src/helpers/getPopupPosition.js"),DataElementWrapper=__webpack_require__("./src/components/DataElementWrapper/index.js"),getDeviceSize=__webpack_require__("./src/helpers/getDeviceSize.js"),dataElement=__webpack_require__("./src/constants/dataElement.js"),actionPriority=__webpack_require__("./src/constants/actionPriority.js"),throttle=__webpack_require__("./node_modules/lodash/throttle.js"),throttle_default=__webpack_require__.n(throttle),debounce=(__webpack_require__("./src/components/FormFieldEditPopup/FormFieldEditPopup.scss"),__webpack_require__("./node_modules/lodash/debounce.js")),debounce_default=__webpack_require__.n(debounce),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types);function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _instanceof(left,right){return null!=right&&"undefined"!=typeof Symbol&&right[Symbol.hasInstance]?!!right[Symbol.hasInstance](left):left instanceof right}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||_unsupported_iterable_to_array(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _to_consumable_array(arr){return function _array_without_holes(arr){if(Array.isArray(arr))return _array_like_to_array(arr)}(arr)||function _iterable_to_array(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||_unsupported_iterable_to_array(arr)||function _non_iterable_spread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _unsupported_iterable_to_array(o,minLen){if(o){if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);return"Object"===n&&o.constructor&&(n=o.constructor.name),"Map"===n||"Set"===n?Array.from(n):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_array_like_to_array(o,minLen):void 0}}var Annotations=window.Core.Annotations,propTypes={annotation:prop_types_default().object.isRequired};function FormFieldEditPopupContainer_FormFieldEditPopupContainer(param){var annotation=param.annotation,formFieldCreationManager=core.A.getFormFieldCreationManager(),_useState=_sliced_to_array((0,react.useState)(""),2),fieldName=_useState[0],setFieldName=_useState[1],_useState1=_sliced_to_array((0,react.useState)(""),2),fieldValue=_useState1[0],setFieldValue=_useState1[1],_useState2=_sliced_to_array((0,react.useState)(!1),2),isReadOnly=_useState2[0],setReadOnly=_useState2[1],_useState3=_sliced_to_array((0,react.useState)(!1),2),isMultiLine=_useState3[0],setMultiLine=_useState3[1],_useState4=_sliced_to_array((0,react.useState)(!1),2),isRequired=_useState4[0],setIsRequired=_useState4[1],_useState5=_sliced_to_array((0,react.useState)(!1),2),isMultiSelect=_useState5[0],setIsMultiSelect=_useState5[1],_useState6=_sliced_to_array((0,react.useState)(!0),2),isValid=_useState6[0],setIsValid=_useState6[1],_useState7=_sliced_to_array((0,react.useState)([]),2),radioButtonGroups=_useState7[0],setRadioButtonGroups=_useState7[1],_useState8=_sliced_to_array((0,react.useState)({left:0,top:0}),2),position=_useState8[0],setPosition=_useState8[1],_useState9=_sliced_to_array((0,react.useState)(""),2),validationMessage=_useState9[0],setValidationMessage=_useState9[1],_useState10=_sliced_to_array((0,react.useState)(!1),2),showIndicator=_useState10[0],setShowIndicator=_useState10[1],_useState11=_sliced_to_array((0,react.useState)(""),2),indicatorText=_useState11[0],setIndicatorText=_useState11[1],popupRef=(0,react.useRef)(),mountedRef=(0,react.useRef)(!0),isOpen=_sliced_to_array((0,es.d4)((function(state){return[selectors.A.isElementOpen(state,dataElement.A.FORM_FIELD_EDIT_POPUP)]}),es.bN),1)[0],dispatch=(0,es.wA)();function closeAndReset(){dispatch(actions.A.enableElement(dataElement.A.ANNOTATION_POPUP,actionPriority.sg)),dispatch(actions.A.closeElement(dataElement.A.FORM_FIELD_EDIT_POPUP)),setFieldName(""),setFieldValue(""),setReadOnly(!1),setMultiLine(!1),setIsRequired(!1),setIsMultiSelect(!1),setIsValid(!0),setShowIndicator(!1),setIndicatorText("")}(0,useOnClickOutside.A)(popupRef,(function(){""!==fieldName.trim()&&closeAndReset()})),(0,react.useEffect)((function(){var onFormFieldCreationModeStarted=function(){setRadioButtonGroups(formFieldCreationManager.getRadioButtonGroups())};return core.A.addEventListener("formFieldCreationModeStarted",onFormFieldCreationModeStarted),function(){core.A.removeEventListener("formFieldCreationModeStarted",onFormFieldCreationModeStarted)}}),[]),(0,react.useEffect)((function(){var radioButtons=core.A.getAnnotationsList().filter((function(annotation){return _instanceof(annotation,Annotations.RadioButtonWidgetAnnotation)})),radioGroups=radioButtons.map((function(radioButton){return radioButton.getField().name})),dedupedRadioGroups=_to_consumable_array(new Set(_to_consumable_array(radioGroups)));setRadioButtonGroups(dedupedRadioGroups)}),[]);var setPopupPosition=function(){popupRef.current&&mountedRef.current&&setPosition((0,getPopupPosition.FL)(annotation,popupRef))},handleResize=throttle_default()((function(){setPopupPosition()}),16);(0,react.useEffect)((function(){return mountedRef.current=!0,window.addEventListener("resize",handleResize),function(){mountedRef.current=!1,window.removeEventListener("resize",handleResize)}}),[]),(0,react.useLayoutEffect)((function(){if(isOpen&&annotation){var currentFlags=annotation.getFieldFlags(),isReadOnly=currentFlags[Annotations.WidgetFlags.READ_ONLY],isMultiLine=currentFlags[Annotations.WidgetFlags.MULTILINE],isRequired=currentFlags[Annotations.WidgetFlags.REQUIRED],isMultiSelect=currentFlags[Annotations.WidgetFlags.MULTI_SELECT],field=annotation.getField();setPopupPosition(),setFieldName(field.name),setFieldValue(field.value),setReadOnly(isReadOnly||!1),setMultiLine(isMultiLine||!1),setIsRequired(isRequired||!1),setIsMultiSelect(isMultiSelect||!1);var dedupedRadioGroups=_to_consumable_array(new Set(_to_consumable_array(radioButtonGroups).concat(_to_consumable_array(formFieldCreationManager.getRadioButtonGroups()))));setRadioButtonGroups(dedupedRadioGroups);var isFieldNameValid=!!field.name;setIsValid(isFieldNameValid);var validationMessage="";isFieldNameValid||(validationMessage="formField.formFieldPopup.invalidField.empty"),setValidationMessage(validationMessage),setShowIndicator(formFieldCreationManager.getShowIndicator(annotation)),setIndicatorText(formFieldCreationManager.getIndicatorText(annotation))}}),[isOpen]),(0,react.useLayoutEffect)((function(){var setPosition=debounce_default()((function(){popupRef.current&&setPopupPosition()}),100),scrollViewElement=core.A.getDocumentViewer().getScrollViewElement();return null==scrollViewElement||scrollViewElement.addEventListener("scroll",setPosition),function(){return null==scrollViewElement?void 0:scrollViewElement.removeEventListener("scroll",setPosition)}}),[annotation]);var onFieldNameChange=(0,react.useCallback)((function(name){var validatedResponse=formFieldCreationManager.setFieldName(annotation,name);setIsValid(validatedResponse.isValid),mapValidationResponseToTranslation(validatedResponse),setFieldName(name)}),[annotation]),mapValidationResponseToTranslation=function(validationResponse){var translationKey="";switch(validationResponse.errorType){case"empty":translationKey="formField.formFieldPopup.invalidField.empty";break;case"duplicate":translationKey="formField.formFieldPopup.invalidField.duplicate"}setValidationMessage(translationKey)},onFieldValueChange=(0,react.useCallback)((function(value){setFieldValue(value),annotation.getField().setValue(value)}),[annotation]),onReadOnlyChange=(0,react.useCallback)((function(isReadOnly){setReadOnly(isReadOnly),annotation.setFieldFlag(Annotations.WidgetFlags.READ_ONLY,isReadOnly)}),[annotation]),onMultiLineChange=(0,react.useCallback)((function(isMultiLine){setMultiLine(isMultiLine),annotation.setFieldFlag(Annotations.WidgetFlags.MULTILINE,isMultiLine)}),[annotation]),onRequiredChange=(0,react.useCallback)((function(isRequired){setIsRequired(isRequired),annotation.setFieldFlag(Annotations.WidgetFlags.REQUIRED,isRequired)}),[annotation]),onMultiSelectChange=(0,react.useCallback)((function(isMultiSelect){setIsMultiSelect(isMultiSelect),annotation.setFieldFlag(Annotations.WidgetFlags.MULTI_SELECT,isMultiSelect)}),[annotation]),onFieldOptionsChange=(0,react.useCallback)((function(options){annotation.setFieldOptions(options)}),[annotation]),onShowFieldIndicatorChange=(0,react.useCallback)((function(showIndicator){setShowIndicator(showIndicator),formFieldCreationManager.setShowIndicator(annotation,showIndicator)}),[annotation]),onFieldIndicatorTextChange=(0,react.useCallback)((function(indicatorText){setIndicatorText(indicatorText),formFieldCreationManager.setIndicatorText(annotation,indicatorText)}),[annotation]),closeFormFieldEditPopup=(0,react.useCallback)((function(){closeAndReset()}),[]),onCloseRadioButtonPopup=(0,react.useCallback)((function(){isValid&&-1===radioButtonGroups.indexOf(fieldName)&&""!==fieldName&&setRadioButtonGroups([fieldName].concat(_to_consumable_array(radioButtonGroups))),closeAndReset()}),[fieldName,radioButtonGroups]),redrawAnnotation=(0,react.useCallback)((function(annotation){core.A.getAnnotationManager().drawAnnotationsFromList([annotation])}),[]),getPageHeight=(0,react.useCallback)((function(){return core.A.getPageHeight(core.A.getCurrentPage())}),[]),getPageWidth=(0,react.useCallback)((function(){return core.A.getPageWidth(core.A.getCurrentPage())}),[]),onSignatureOptionChange=(0,react.useCallback)((function(signatureOption){var value=signatureOption.value;formFieldCreationManager.setSignatureOption(annotation,value)}),[annotation]),getSignatureOption=(0,react.useCallback)((function(widget){return formFieldCreationManager.getSignatureOption(widget)}),[]),fields={NAME:{label:"formField.formFieldPopup.fieldName",onChange:onFieldNameChange,value:fieldName,required:!0,type:"text",focus:!0},VALUE:{label:"formField.formFieldPopup.fieldValue",onChange:onFieldValueChange,value:fieldValue,type:"text"},RADIO_GROUP:{label:"formField.formFieldPopup.fieldName",onChange:onFieldNameChange,value:fieldName,required:!0,type:"select"}},flags={READ_ONLY:{label:"formField.formFieldPopup.readOnly",onChange:onReadOnlyChange,isChecked:isReadOnly},MULTI_LINE:{label:"formField.formFieldPopup.multiLine",onChange:onMultiLineChange,isChecked:isMultiLine},REQUIRED:{label:"formField.formFieldPopup.required",onChange:onRequiredChange,isChecked:isRequired},MULTI_SELECT:{label:"formField.formFieldPopup.multiSelect",onChange:onMultiSelectChange,isChecked:isMultiSelect}},textFields=[fields.NAME,fields.VALUE],defaultFields=[fields.NAME],radioButtonFields=[fields.RADIO_GROUP],listBoxFields=[fields.NAME],comboBoxFields=[fields.NAME],pushButtonFields=[fields.NAME],textFieldFlags=[flags.READ_ONLY,flags.MULTI_LINE,flags.REQUIRED],signatureFlags=[flags.REQUIRED,flags.READ_ONLY],checkBoxFlags=[flags.READ_ONLY,flags.REQUIRED],radioButtonFlags=[flags.READ_ONLY,flags.REQUIRED],listBoxFlags=[flags.MULTI_SELECT,flags.READ_ONLY,flags.REQUIRED],comboBoxFlags=[flags.READ_ONLY,flags.REQUIRED],pushButtonFlags=[flags.READ_ONLY],isMobile=(0,getDeviceSize.IS)(),indicator={label:"formField.formFieldPopup.documentFieldIndicator",toggleIndicator:onShowFieldIndicatorChange,isChecked:showIndicator,onChange:onFieldIndicatorTextChange,value:indicatorText},renderPopUp=function(){switch(!0){case _instanceof(annotation,Annotations.TextWidgetAnnotation):return react.createElement(FormFieldEditPopup.A,{fields:textFields,flags:textFieldFlags,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,indicator});case _instanceof(annotation,Annotations.SignatureWidgetAnnotation):return react.createElement(FormFieldEditPopup_FormFieldEditSignaturePopup,{fields:defaultFields,flags:signatureFlags,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,onSignatureOptionChange,getSignatureOptionHandler:getSignatureOption,indicator});case _instanceof(annotation,Annotations.CheckButtonWidgetAnnotation):return react.createElement(FormFieldEditPopup.A,{fields:defaultFields,flags:checkBoxFlags,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,indicator});case _instanceof(annotation,Annotations.RadioButtonWidgetAnnotation):return react.createElement(FormFieldEditPopup.A,{fields:radioButtonFields,flags:radioButtonFlags,closeFormFieldEditPopup:onCloseRadioButtonPopup,isValid,validationMessage,radioButtonGroups,annotation,selectedRadioGroup:fieldName,redrawAnnotation,getPageHeight,getPageWidth,indicator});case _instanceof(annotation,Annotations.ListWidgetAnnotation):return fieldOptions=annotation.getFieldOptions(),react.createElement(FormFieldEditPopup.A,{fields:listBoxFields,flags:listBoxFlags,options:fieldOptions,onOptionsChange:onFieldOptionsChange,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,indicator});case _instanceof(annotation,Annotations.ChoiceWidgetAnnotation):return function(){var fieldOptions=annotation.getFieldOptions();return react.createElement(FormFieldEditPopup.A,{fields:comboBoxFields,flags:comboBoxFlags,options:fieldOptions,onOptionsChange:onFieldOptionsChange,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,indicator})}();case _instanceof(annotation,Annotations.PushButtonWidgetAnnotation):return react.createElement(FormFieldEditPopup.A,{fields:pushButtonFields,flags:pushButtonFlags,closeFormFieldEditPopup,isValid,validationMessage,annotation,redrawAnnotation,getPageHeight,getPageWidth,indicator});default:return null}var fieldOptions},renderFormFieldEditPopup=function(){return react.createElement(DataElementWrapper.A,{className:classnames_default()({Popup:!0,FormFieldEditPopupContainer:!0,open:isOpen,closed:!isOpen}),"data-element":dataElement.A.FORM_FIELD_EDIT_POPUP,style:_object_spread({},position),ref:popupRef},isOpen&&renderPopUp())};return isMobile?renderFormFieldEditPopup():react.createElement(cjs_default(),{cancel:".Button, .cell, .sliders-container svg, .creatable-list, .ui__input__input, .form-dimension-input, .ui__choice__input"},renderFormFieldEditPopup())}FormFieldEditPopupContainer_FormFieldEditPopupContainer.propTypes=propTypes;const FormFieldEditPopup_FormFieldEditPopupContainer=react.memo(FormFieldEditPopupContainer_FormFieldEditPopupContainer);FormFieldEditPopupContainer_FormFieldEditPopupContainer.__docgenInfo={description:"",methods:[],displayName:"FormFieldEditPopupContainer",props:{annotation:{description:"",type:{name:"object"},required:!0}}};const components_FormFieldEditPopup=FormFieldEditPopup_FormFieldEditPopupContainer;FormFieldEditPopupContainer.__docgenInfo={description:"",methods:[],displayName:"FormFieldEditPopupContainer",props:{annotation:{description:"",type:{name:"object"},required:!0}}}}}]);