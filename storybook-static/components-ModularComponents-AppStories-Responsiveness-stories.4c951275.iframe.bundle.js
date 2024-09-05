"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[4979],{"./src/components/ModularComponents/AppStories/Responsiveness.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{ExtraItemsAdded:()=>ExtraItemsAdded,ExtraLarge:()=>ExtraLarge,ExtraSmall:()=>ExtraSmall,Full:()=>Full,Large:()=>Large,Medium:()=>Medium,Small:()=>Small,TooSmall:()=>TooSmall,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/@reduxjs/toolkit/dist/redux-toolkit.esm.js"),components_App__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/App/index.js"),src_redux_initialState__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/redux/initialState.js"),reducers_rootReducer__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./src/redux/reducers/rootReducer.js"),_mockAppState__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./src/components/ModularComponents/AppStories/mockAppState.js"),helpers_itemToFlyoutHelper__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./src/helpers/itemToFlyoutHelper.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}const __WEBPACK_DEFAULT_EXPORT__={title:"ModularComponents/App Responsiveness",component:components_App__WEBPACK_IMPORTED_MODULE_2__.A};var noop=function(){},MockApp=function(param){var initialState=param.initialState,width=param.width,height=param.height,store=(0,_reduxjs_toolkit__WEBPACK_IMPORTED_MODULE_7__.U1)({reducer:reducers_rootReducer__WEBPACK_IMPORTED_MODULE_4__.A,preloadedState:initialState,middleware:function(getDefaultMiddleware){return getDefaultMiddleware({serializableCheck:!1})}});return(0,helpers_itemToFlyoutHelper__WEBPACK_IMPORTED_MODULE_6__.Hk)(store),react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{style:{maxWidth:width,maxHeight:height,width:"100%",height:"100%"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_App__WEBPACK_IMPORTED_MODULE_2__.A,{removeEventHandlers:noop})))},Template=function(args){var stateWithHeaders=_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_3__.A),{viewer:_object_spread_props(_object_spread({},src_redux_initialState__WEBPACK_IMPORTED_MODULE_3__.A.viewer),{modularHeaders:args.headers,modularComponents:args.components,openElements:{},genericPanels:[{dataElement:"stylePanel",render:"stylePanel",location:"left"}],activeGroupedItems:["annotateGroupedItems"],lastPickedToolForGroupedItems:{annotateGroupedItems:"AnnotationCreateTextUnderline"},activeCustomRibbon:"annotations-ribbon-item",lastPickedToolAndGroup:{tool:"AnnotationCreateTextUnderline",group:["annotateGroupedItems"]},activeToolName:"AnnotationCreateTextUnderline"}),featureFlags:{customizableUI:!0}});return react__WEBPACK_IMPORTED_MODULE_0__.createElement(MockApp,{initialState:stateWithHeaders,width:args.width,height:args.height})};function createTemplate(){var _ref=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},_ref_width=_ref.width,width=void 0===_ref_width?"100%":_ref_width,_ref_height=_ref.height,height=void 0===_ref_height?"100%":_ref_height,_ref_headers=_ref.headers,headers=void 0===_ref_headers?_mockAppState__WEBPACK_IMPORTED_MODULE_5__.k:_ref_headers,_ref_components=_ref.components,components=void 0===_ref_components?_mockAppState__WEBPACK_IMPORTED_MODULE_5__.j:_ref_components,template=Template.bind({});return template.args={headers,components,width,height},template.parameters={layout:"fullscreen"},template}var Full=createTemplate(),ExtraLarge=createTemplate({width:"1920px",height:"1080px"}),Large=createTemplate({width:"1024px",height:"768px"}),Medium=createTemplate({width:"768px",height:"1024px"}),Small=createTemplate({width:"576px",height:"800px"}),ExtraSmall=createTemplate({width:"360px",height:"667px"}),TooSmall=createTemplate({width:"200px",height:"300px"}),ExtraItemsAdded=createTemplate({headers:_object_spread_props(_object_spread({},_mockAppState__WEBPACK_IMPORTED_MODULE_5__.k),{"default-top-header":_object_spread_props(_object_spread({},_mockAppState__WEBPACK_IMPORTED_MODULE_5__.k["default-top-header"]),{items:["groupedLeftHeaderButtons","default-ribbon-group","searchPanelToggle","notesPanelToggle","stylePanelToggle","filePickerButton","downloadButton","settingsButton","annotateGroupedItems2"]})}),components:_object_spread_props(_object_spread({},_mockAppState__WEBPACK_IMPORTED_MODULE_5__.j),{annotateGroupedItems2:{dataElement:"annotateGroupedItems2",items:["underlineToolButton","highlightToolButton","rectangleToolButton","freeTextToolButton","squigglyToolButton","strikeoutToolButton","defaultAnnotationUtilities2"],type:"groupedItems",justifyContent:"center",grow:0,gap:12,alwaysVisible:!0,style:{}},defaultAnnotationUtilities2:{dataElement:"defaultAnnotationUtilities2",items:["divider-0.12046025247094039","stylePanelToggle","divider-0.3460871740070717","undoButton","redoButton","eraserToolButton"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!0,style:{}}})});Full.parameters={...Full.parameters,docs:{...Full.parameters?.docs,source:{originalSource:"createTemplate()",...Full.parameters?.docs?.source}}},ExtraLarge.parameters={...ExtraLarge.parameters,docs:{...ExtraLarge.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '1920px',\n  height: '1080px'\n})",...ExtraLarge.parameters?.docs?.source}}},Large.parameters={...Large.parameters,docs:{...Large.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '1024px',\n  height: '768px'\n})",...Large.parameters?.docs?.source}}},Medium.parameters={...Medium.parameters,docs:{...Medium.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '768px',\n  height: '1024px'\n})",...Medium.parameters?.docs?.source}}},Small.parameters={...Small.parameters,docs:{...Small.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '576px',\n  height: '800px'\n})",...Small.parameters?.docs?.source}}},ExtraSmall.parameters={...ExtraSmall.parameters,docs:{...ExtraSmall.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '360px',\n  height: '667px'\n})",...ExtraSmall.parameters?.docs?.source}}},TooSmall.parameters={...TooSmall.parameters,docs:{...TooSmall.parameters?.docs,source:{originalSource:"createTemplate({\n  width: '200px',\n  height: '300px'\n})",...TooSmall.parameters?.docs?.source}}},ExtraItemsAdded.parameters={...ExtraItemsAdded.parameters,docs:{...ExtraItemsAdded.parameters?.docs,source:{originalSource:"createTemplate({\n  headers: ExtraItemsAddedHeaders,\n  components: ExtraItemsAddedComponents\n})",...ExtraItemsAdded.parameters?.docs?.source}}};const __namedExportsOrder=["Full","ExtraLarge","Large","Medium","Small","ExtraSmall","TooSmall","ExtraItemsAdded"]},"./src/components/ModularComponents/AppStories/mockAppState.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{j:()=>mockModularComponents,k:()=>mockHeadersNormalized});var src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/redux/modularComponents.js"),constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/constants/customizationVariables.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}var mockHeadersNormalized={"default-top-header":{dataElement:"default-top-header",placement:"top",grow:0,gap:12,position:"start",float:!1,stroke:!0,dimension:{paddingTop:8,paddingBottom:8,borderWidth:1},style:{},items:["groupedLeftHeaderButtons","default-ribbon-group","searchPanelToggle","notesPanelToggle"]},"tools-header":_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.wY["tools-header"]),"bottomHeader-23ds":{dataElement:"bottomHeader-23ds",placement:"bottom",grow:0,gap:12,position:"center",float:!0,stroke:!0,dimension:{paddingTop:8,paddingBottom:8,borderWidth:1},style:{background:"var(--gray-1)",padding:"8px",borderStyle:"solid",borderWidth:1,borderColor:"var(--gray-6)"},items:["page-controls-container"]}},mockModularComponents={filePickerButton:{dataElement:"filePickerButton",title:"action.openFile",label:"action.openFile",icon:"icon-header-file-picker-line",type:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.Nt.PRESET_BUTTON,buttonType:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.dQ.FILE_PICKER},downloadButton:{dataElement:"downloadButton",title:"action.download",label:"action.download",icon:"icon-download",type:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.Nt.PRESET_BUTTON,buttonType:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.dQ.DOWNLOAD},saveAsButton:{dataElement:"saveAsButton",title:"saveModal.saveAs",isActive:!1,label:"saveModal.saveAs",icon:"icon-save",type:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.Nt.PRESET_BUTTON,buttonType:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.dQ.SAVE_AS},printButton:{dataElement:"printButton",title:"action.print",isActive:!1,label:"action.print",icon:"icon-header-print-line",type:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.Nt.PRESET_BUTTON,buttonType:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.dQ.PRINT},undefined:{},createPortfolioButton:{dataElement:"createPortfolioButton",title:"portfolio.createPDFPortfolio",isActive:!1,label:"portfolio.createPDFPortfolio",icon:"icon-pdf-portfolio"},settingsButton:{dataElement:"settingsButton",title:"option.settings.settings",isActive:!1,label:"option.settings.settings",icon:"icon-header-settings-line",type:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.Nt.PRESET_BUTTON,buttonType:constants_customizationVariables__WEBPACK_IMPORTED_MODULE_1__.dQ.SETTINGS},"divider-0.1":{dataElement:"divider-0.1",type:"divider"},"divider-0.2":{dataElement:"divider-0.2",type:"divider"},"divider-0.3":{dataElement:"divider-0.3",type:"divider"},"divider-0.4":{dataElement:"divider-0.4",type:"divider"},"divider-0.5":{dataElement:"divider-0.5",type:"divider"},"divider-0.6":{dataElement:"divider-0.6",type:"divider"},"left-panel-toggle":_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX["left-panel-toggle"]),"view-controls":_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX["view-controls"]),"zoom-container":_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX["zoom-container"]),panToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.panToolButton),annotationEditToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.annotationEditToolButton),"menu-toggle-button":_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX["menu-toggle-button"]),groupedLeftHeaderButtons:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.groupedLeftHeaderButtons),"view-ribbon-item":{dataElement:"view-ribbon-item",title:"View",type:"ribbonItem",label:"View",groupedItems:[],toolbarGroup:"toolbarGroup-View"},"annotations-ribbon-item":{dataElement:"annotations-ribbon-item",title:"Annotate",type:"ribbonItem",label:"Annotate",groupedItems:["annotateGroupedItems"],toolbarGroup:"toolbarGroup-Annotate"},"shapes-ribbon-item":{dataElement:"shapes-ribbon-item",title:"Shapes",type:"ribbonItem",label:"Shapes",groupedItems:["shapesGroupedItems"],toolbarGroup:"toolbarGroup-Shapes"},"insert-ribbon-item":{dataElement:"insert-ribbon-item",title:"Insert",type:"ribbonItem",label:"Insert",groupedItems:["insertGroupedItems"],toolbarGroup:"toolbarGroup-Insert"},"redaction-ribbon-item":{dataElement:"redaction-ribbon-item",title:"Redact",type:"ribbonItem",label:"Redact",groupedItems:["redactionGroupedItems"],toolbarGroup:"toolbarGroup-Redact"},"measure-ribbon-item":{dataElement:"measure-ribbon-item",title:"Measure",type:"ribbonItem",label:"Measure",groupedItems:["measureGroupedItems"],toolbarGroup:"toolbarGroup-Measure"},"edit-ribbon-item":{dataElement:"edit-ribbon-item",title:"Edit",type:"ribbonItem",label:"Edit",groupedItems:["editGroupedItems"],toolbarGroup:"toolbarGroup-Edit"},"fillAndSign-ribbon-item":{dataElement:"fillAndSign-ribbon-item",title:"Fill and Sign",type:"ribbonItem",label:"Fill and Sign",groupedItems:["fillAndSignGroupedItems"],toolbarGroup:"toolbarGroup-FillAndSign"},"default-ribbon-group":{dataElement:"default-ribbon-group",items:["view-ribbon-item","annotations-ribbon-item","shapes-ribbon-item","insert-ribbon-item","redaction-ribbon-item","measure-ribbon-item","edit-ribbon-item","fillAndSign-ribbon-item"],type:"ribbonGroup",justifyContent:"start",grow:2,gap:12,alwaysVisible:!1,style:{}},searchPanelToggle:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.searchPanelToggle),notesPanelToggle:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.notesPanelToggle),underlineToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.underlineToolButton),highlightToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.highlightToolButton),rectangleToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.rectangleToolButton),freeTextToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.freeTextToolButton),squigglyToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.squigglyToolButton),strikeoutToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.strikeoutToolButton),"divider-0.12046025247094039":{dataElement:"divider-0.12046025247094039",type:"divider"},stylePanelToggle:{dataElement:"stylePanelToggle",title:"stylePanel.headings.styles",type:"toggleButton",img:"icon-style-panel-toggle",toggleElement:"stylePanel"},"divider-0.3460871740070717":{dataElement:"divider-0.3460871740070717",type:"divider"},undoButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.undoButton),redoButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.redoButton),eraserToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.eraserToolButton),defaultAnnotationUtilities:{dataElement:"defaultAnnotationUtilities",items:["divider-0.12046025247094039","stylePanelToggle","divider-0.3460871740070717","undoButton","redoButton","eraserToolButton"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},annotateGroupedItems:{dataElement:"annotateGroupedItems",items:["underlineToolButton","highlightToolButton","rectangleToolButton","freeTextToolButton","squigglyToolButton","strikeoutToolButton","defaultAnnotationUtilities"],type:"groupedItems",justifyContent:"center",grow:0,gap:12,alwaysVisible:!1,style:{}},freeHandToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.freeHandToolButton),freeHandHighlightToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.freeHandHighlightToolButton),lineToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.lineToolButton),polylineToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.polylineToolButton),arrowToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.arrowToolButton),arcToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.arcToolButton),ellipseToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.ellipseToolButton),polygonToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.polygonToolButton),cloudToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.cloudToolButton),shapesGroupedItems:{dataElement:"shapesGroupedItems",items:["rectangleToolButton","freeHandToolButton","freeHandHighlightToolButton","lineToolButton","polylineToolButton","arrowToolButton","arcToolButton","ellipseToolButton","polygonToolButton","cloudToolButton","defaultAnnotationUtilities"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},rubberStampToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.rubberStampToolButton),signatureCreateToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.signatureCreateToolButton),insertGroupedItems:{dataElement:"insertGroupedItems",items:["rubberStampToolButton","signatureCreateToolButton","undoButton","redoButton","eraserToolButton"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},redactionToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.redactionToolButton),panel2Button:{dataElement:"panel2Button",type:"toggleButton",img:"icon-redact-panel",toggleElement:"redactPanel_1"},redactionGroupedItems:{dataElement:"redactionGroupedItems",items:["redactionToolButton","panel2Button","defaultAnnotationUtilities"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},distanceMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.distanceMeasurementToolButton),arcMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.arcMeasurementToolButton),perimeterMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.perimeterMeasurementToolButton),areaMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.areaMeasurementToolButton),ellipseMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.ellipseMeasurementToolButton),rectangularAreaMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.rectangularAreaMeasurementToolButton),countMeasurementToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.countMeasurementToolButton),cloudyRectangularAreaMeasurementToolButton:{dataElement:"cloudyRectangularAreaMeasurementToolButton",type:"toolButton",toolName:"AnnotationCreateCloudyRectangularAreaMeasurement"},measureGroupedItems:{dataElement:"measureGroupedItems",items:["distanceMeasurementToolButton","arcMeasurementToolButton","perimeterMeasurementToolButton","areaMeasurementToolButton","ellipseMeasurementToolButton","rectangularAreaMeasurementToolButton","cloudyRectangularAreaMeasurementToolButton","countMeasurementToolButton","defaultAnnotationUtilities"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},cropToolButton:_object_spread({},src_redux_modularComponents__WEBPACK_IMPORTED_MODULE_0__.AX.cropToolButton),editGroupedItems:{dataElement:"editGroupedItems",items:["cropToolButton","undoButton","redoButton","eraserToolButton"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},fillAndSignGroupedItems:{dataElement:"fillAndSignGroupedItems",items:["rubberStampToolButton","defaultAnnotationUtilities"],type:"groupedItems",grow:0,gap:12,alwaysVisible:!1,style:{}},"page-controls-container":{dataElement:"page-controls-container",type:"pageControls"},"grouped-item":{items:["button1","button2"]},group1:{items:["button8","button9"]}}}}]);