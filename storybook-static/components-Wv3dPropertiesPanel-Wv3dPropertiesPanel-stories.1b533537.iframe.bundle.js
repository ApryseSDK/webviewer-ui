(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[3403],{"./src/components/Wv3dPropertiesPanel/Wv3dPropertiesPanel.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{DefaultStandard:()=>DefaultStandard,DefaultWide:()=>DefaultWide,EmptyPanel:()=>EmptyPanel,GroupOrderSpecified:()=>GroupOrderSpecified,MultiplePropertiesElements:()=>MultiplePropertiesElements,RemoveEmptyGroups:()=>RemoveEmptyGroups,RemoveEmptyRows:()=>RemoveEmptyRows,RemoveRawValues:()=>RemoveRawValues,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),redux__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react-redux/es/index.js"),components_RightPanel__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/RightPanel/index.js"),_Wv3dPropertiesPanel__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./src/components/Wv3dPropertiesPanel/Wv3dPropertiesPanel.js");const __WEBPACK_DEFAULT_EXPORT__={title:"Components/Wv3dPropertiesPanel",component:_Wv3dPropertiesPanel__WEBPACK_IMPORTED_MODULE_3__.A};var baseSchema={headerName:"Name",defaultValues:{Description:"Description",GlobalID:"GlobalId",Handle:"handle",EmptyRow1:"EmptyRow1"},groups:{Dimensions:{Length:"Length",Width:"Width",Height:"Height",EmptyRow2:"EmptyRow2",GrossFootprintArea:"GrossFootprintArea",GrossSideArea:"GrossSideArea",GrossVolume:"GrossVolume"},RandomStuff:{ObjectType:"ObjectType",EmptyRow3:"EmptyRow3",ObjectPlacement:"ObjectPlacement"},EmptyGroupTest:{ObjectType:"Elephants",EmptyRow3:"Tigers",ObjectPlacement:"Bears"}},groupOrder:[],removeEmptyRows:!1,removeEmptyGroups:!1,createRawValueGroup:!0},oneElement=[{ConnectedFrom:"2274843",ConnectedTo:"2274847",ContainedInStructure:"2258156",Declares:"",Decomposes:"",Description:"ÿ",ExtendToStructure:"T",FillsVoids:"",GlobalId:"3_YR89Qiz6UgyQsBcI$FJz",GrossFootprintArea:"317.638889",GrossSideArea:"4879.727431",GrossVolume:"8132.879051",HasAssignments:"",HasAssociations:"2260414",HasContext:"",HasCoverings:"",HasOpenings:"",HasProjections:"",Height:"25.604167",InterferesElements:"",IsConnectionRealization:"",IsDeclaredBy:"",IsDefinedBy:"29092,29099",IsExternal:"T",IsInterferedByElements:"",IsNestedBy:"",IsTypedBy:"2266845",Length:"190.583333",LoadBearing:"F",Name:"Basic Wall:Reinforced Concrete - 1'-8\":117463",Nests:"",ObjectPlacement:"29040",ObjectType:"Basic Wall:Reinforced Concrete - 1'-8\":118691",OwnerHistory:"42",PredefinedType:"NOTDEFINED",ProvidesBoundaries:"",Reference:"Basic Wall:Reinforced Concrete - 1'-8\"",ReferencedBy:"",ReferencedInStructures:"",Representation:"29077",Tag:"117463",Width:"1.666667",handle:"29081"}],initialState={viewer:{isInDesktopOnlyMode:!0,disabledElements:{logoBar:{disabled:!0}},customElementOverrides:{},openElements:{header:!0,wv3dPropertiesPanel:!0},currentLanguage:"en",panelWidths:{wv3dPropertiesPanel:330},modularHeaders:{},modularHeadersHeight:{topHeaders:40,bottomHeaders:40}},featureFlags:{customizableUI:!1},wv3dPropertiesPanel:{modelData:[],schema:{headerName:"Name",defaultValues:{},groups:{},groupOrder:[],removeEmptyRows:!1,removeEmptyGroups:!1,createRawValueGroup:!0}}};var store=(0,redux__WEBPACK_IMPORTED_MODULE_4__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState})),PropertiesPanelStoryWrapper=function(param){var children=param.children;return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_1__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_RightPanel__WEBPACK_IMPORTED_MODULE_2__.A,{dataElement:"wv3dPropertiesPanel"},children))},StandardTemplate=function(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(PropertiesPanelStoryWrapper,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"Panel wv3d-properties-panel",style:{width:"330px",minWidth:"330px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Wv3dPropertiesPanel__WEBPACK_IMPORTED_MODULE_3__.A,args)))},Default=StandardTemplate.bind({}),defaultArgs={modelData:oneElement,schema:baseSchema,currentWidth:"330px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function DefaultStandard(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(Default,defaultArgs)}Default.args=defaultArgs;var DefaultWide=function(args){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(PropertiesPanelStoryWrapper,null,react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"Panel wv3d-properties-panel",style:{width:"660px",minWidth:"330px"}},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Wv3dPropertiesPanel__WEBPACK_IMPORTED_MODULE_3__.A,args)))}.bind({});DefaultWide.args={modelData:oneElement,schema:baseSchema,currentWidth:"660px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};var MultipleElements=StandardTemplate.bind({}),multipleElementsArgs={modelData:[{ConnectedFrom:"2274843",ConnectedTo:"2274847",ContainedInStructure:"2258156",Declares:"",Decomposes:"",Description:"ÿ",ExtendToStructure:"T",FillsVoids:"",GlobalId:"3_YR89Qiz6UgyQsBcI$FJz",GrossFootprintArea:"317.638889",GrossSideArea:"4879.727431",GrossVolume:"8132.879051",HasAssignments:"",HasAssociations:"2260414",HasContext:"",HasCoverings:"",HasOpenings:"",HasProjections:"",Height:"25.604167",InterferesElements:"",IsConnectionRealization:"",IsDeclaredBy:"",IsDefinedBy:"29092,29099",IsExternal:"T",IsInterferedByElements:"",IsNestedBy:"",IsTypedBy:"2266845",Length:"190.583333",LoadBearing:"F",Name:"Basic Wall:Reinforced Concrete - 1'-8\":117463",Nests:"",ObjectPlacement:"29040",ObjectType:"Basic Wall:Reinforced Concrete - 1'-8\":118691",OwnerHistory:"42",PredefinedType:"NOTDEFINED",ProvidesBoundaries:"",Reference:"Basic Wall:Reinforced Concrete - 1'-8\"",ReferencedBy:"",ReferencedInStructures:"",Representation:"29077",Tag:"117463",Width:"1.666667",handle:"29081"},{ConnectedFrom:"2274843",ConnectedTo:"2274847",ContainedInStructure:"2258156",Declares:"",Decomposes:"",Description:"ÿ",ExtendToStructure:"T",FillsVoids:"",GlobalId:"3_YR89Qiz6UgyQsBcI$FJz",GrossFootprintArea:"317.638889",GrossSideArea:"4879.727431",GrossVolume:"8132.879051",HasAssignments:"",HasAssociations:"2260414",HasContext:"",HasCoverings:"",HasOpenings:"",HasProjections:"",Height:"25.604167",InterferesElements:"",IsConnectionRealization:"",IsDeclaredBy:"",IsDefinedBy:"29092,29099",IsExternal:"T",IsInterferedByElements:"",IsNestedBy:"",IsTypedBy:"2266845",Length:"190.583333",LoadBearing:"F",Name:"Basic Wall:Reinforced Concrete - 1'-8\":117463",Nests:"",ObjectPlacement:"29040",ObjectType:"Basic Wall:Reinforced Concrete - 1'-8\":118691",OwnerHistory:"42",PredefinedType:"NOTDEFINED",ProvidesBoundaries:"",Reference:"Basic Wall:Reinforced Concrete - 1'-8\"",ReferencedBy:"",ReferencedInStructures:"",Representation:"29077",Tag:"117463",Width:"1.666667",handle:"29081"}],schema:baseSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function MultiplePropertiesElements(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(MultipleElements,multipleElementsArgs)}MultipleElements.args=multipleElementsArgs;var NoElementsSelected=StandardTemplate.bind({}),noElementsSelectedArgs={modelData:[],schema:baseSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function EmptyPanel(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(NoElementsSelected,noElementsSelectedArgs)}NoElementsSelected.args=noElementsSelectedArgs;var GroupOrderDefined=StandardTemplate.bind({}),groupOrderSchema=JSON.parse(JSON.stringify(baseSchema));groupOrderSchema.groupOrder=["RandomStuff","Dimensions"];var groupOrderDefinedArgs={modelData:oneElement,schema:groupOrderSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function GroupOrderSpecified(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(GroupOrderDefined,groupOrderDefinedArgs)}GroupOrderDefined.args=groupOrderDefinedArgs;var EmptyRowsRemoved=StandardTemplate.bind({}),rowsRemovedSchema=JSON.parse(JSON.stringify(baseSchema));rowsRemovedSchema.removeEmptyRows=!0;var emptyRowsRemovedArgs={modelData:oneElement,schema:rowsRemovedSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function RemoveEmptyRows(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyRowsRemoved,emptyRowsRemovedArgs)}EmptyRowsRemoved.args=emptyRowsRemovedArgs;var EmptyGroupsRemoved=StandardTemplate.bind({}),rowsAndGroupsRemovedSchema=JSON.parse(JSON.stringify(baseSchema));rowsAndGroupsRemovedSchema.removeEmptyRows=!0,rowsAndGroupsRemovedSchema.removeEmptyGroups=!0;var emptyGroupsRemovedArgs={modelData:oneElement,schema:rowsAndGroupsRemovedSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function RemoveEmptyGroups(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(EmptyGroupsRemoved,emptyRowsRemovedArgs)}EmptyGroupsRemoved.args=emptyGroupsRemovedArgs;var NoRawValues=StandardTemplate.bind({}),NoRawValuesSchema=JSON.parse(JSON.stringify(baseSchema));NoRawValuesSchema.createRawValueGroup=!1;var noRawValuesArgs={modelData:oneElement,schema:NoRawValuesSchema,currentWidth:"300px",isInDesktopOnlyMode:!1,isMobile:!1,closeWv3dPropertiesPanel:!1};function RemoveRawValues(){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(NoRawValues,noRawValuesArgs)}NoRawValues.args=noRawValuesArgs,DefaultStandard.parameters={...DefaultStandard.parameters,docs:{...DefaultStandard.parameters?.docs,source:{originalSource:"function DefaultStandard() {\n  return <Default {...defaultArgs} />;\n}",...DefaultStandard.parameters?.docs?.source}}},DefaultWide.parameters={...DefaultWide.parameters,docs:{...DefaultWide.parameters?.docs,source:{originalSource:"args => <PropertiesPanelStoryWrapper>\n    <div className=\"Panel wv3d-properties-panel\" style={{\n    width: '660px',\n    minWidth: '330px'\n  }}>\n      <Wv3dPropertiesPanel {...args} />\n    </div>\n  </PropertiesPanelStoryWrapper>",...DefaultWide.parameters?.docs?.source}}},MultiplePropertiesElements.parameters={...MultiplePropertiesElements.parameters,docs:{...MultiplePropertiesElements.parameters?.docs,source:{originalSource:"function MultiplePropertiesElements() {\n  return <MultipleElements {...multipleElementsArgs} />;\n}",...MultiplePropertiesElements.parameters?.docs?.source}}},EmptyPanel.parameters={...EmptyPanel.parameters,docs:{...EmptyPanel.parameters?.docs,source:{originalSource:"function EmptyPanel() {\n  return <NoElementsSelected {...noElementsSelectedArgs} />;\n}",...EmptyPanel.parameters?.docs?.source}}},GroupOrderSpecified.parameters={...GroupOrderSpecified.parameters,docs:{...GroupOrderSpecified.parameters?.docs,source:{originalSource:"function GroupOrderSpecified() {\n  return <GroupOrderDefined {...groupOrderDefinedArgs} />;\n}",...GroupOrderSpecified.parameters?.docs?.source}}},RemoveEmptyRows.parameters={...RemoveEmptyRows.parameters,docs:{...RemoveEmptyRows.parameters?.docs,source:{originalSource:"function RemoveEmptyRows() {\n  return <EmptyRowsRemoved {...emptyRowsRemovedArgs} />;\n}",...RemoveEmptyRows.parameters?.docs?.source}}},RemoveEmptyGroups.parameters={...RemoveEmptyGroups.parameters,docs:{...RemoveEmptyGroups.parameters?.docs,source:{originalSource:"function RemoveEmptyGroups() {\n  return <EmptyGroupsRemoved {...emptyRowsRemovedArgs} />;\n}",...RemoveEmptyGroups.parameters?.docs?.source}}},RemoveRawValues.parameters={...RemoveRawValues.parameters,docs:{...RemoveRawValues.parameters?.docs,source:{originalSource:"function RemoveRawValues() {\n  return <NoRawValues {...noRawValuesArgs} />;\n}",...RemoveRawValues.parameters?.docs?.source}}};const __namedExportsOrder=["DefaultStandard","DefaultWide","MultiplePropertiesElements","EmptyPanel","GroupOrderSpecified","RemoveEmptyRows","RemoveEmptyGroups","RemoveRawValues"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Wv3dPropertiesPanel/HeaderTitle/HeaderTitle.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".header-value{color:var(--gray-7)}.header-title{font-size:16px}",""]),module.exports=exports},"./src/components/Wv3dPropertiesPanel/HeaderTitle/HeaderTitle.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/Wv3dPropertiesPanel/HeaderTitle/HeaderTitle.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/DataElementWrapper/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_DataElementWrapper});var prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),react=__webpack_require__("./node_modules/react/index.js"),es=__webpack_require__("./node_modules/react-redux/es/index.js"),selectors=__webpack_require__("./src/redux/selectors/index.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}function _object_without_properties(source,excluded){if(null==source)return{};var key,i,target=function _object_without_properties_loose(source,excluded){if(null==source)return{};var key,i,target={},sourceKeys=Object.keys(source);for(i=0;i<sourceKeys.length;i++)key=sourceKeys[i],excluded.indexOf(key)>=0||(target[key]=source[key]);return target}(source,excluded);if(Object.getOwnPropertySymbols){var sourceSymbolKeys=Object.getOwnPropertySymbols(source);for(i=0;i<sourceSymbolKeys.length;i++)key=sourceSymbolKeys[i],excluded.indexOf(key)>=0||Object.prototype.propertyIsEnumerable.call(source,key)&&(target[key]=source[key])}return target}var propTypes={id:prop_types_default().string,children:prop_types_default().node,dataElement:prop_types_default().string,type:prop_types_default().string,ariaLabel:prop_types_default().string};var DataElementWrapper=react.forwardRef((function(_param,ref){var _param_type=_param.type,type=void 0===_param_type?"div":_param_type,children=_param.children,dataElement=_param.dataElement,ariaLabel=_param.ariaLabel,props=_object_without_properties(_param,["type","children","dataElement","ariaLabel"]),isDisabled=function useIsDisabledWithDefaultValue(selector){var defaultValue=arguments.length>1&&void 0!==arguments[1]&&arguments[1];try{return(0,es.d4)(selector)}catch(e){e.message}return defaultValue}((function(state){return selectors.A.isElementDisabled(state,dataElement)}));return isDisabled?null:"button"===type?react.createElement("button",_object_spread({ref,"data-element":dataElement,"aria-label":ariaLabel},props),children):react.createElement("div",_object_spread({ref,"data-element":dataElement},props),children)}));DataElementWrapper.displayName="DataElementWrapper",DataElementWrapper.propTypes=propTypes;const DataElementWrapper_DataElementWrapper=DataElementWrapper;DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},ariaLabel:{description:"Accessibility",type:{name:"string"},required:!1}}};const components_DataElementWrapper=DataElementWrapper_DataElementWrapper;DataElementWrapper_DataElementWrapper.__docgenInfo={description:"",methods:[],displayName:"DataElementWrapper",props:{type:{defaultValue:{value:"'div'",computed:!1},description:"",type:{name:"string"},required:!1},id:{description:"",type:{name:"string"},required:!1},children:{description:"",type:{name:"node"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},ariaLabel:{description:"Accessibility",type:{name:"string"},required:!1}}}},"./src/components/Icon/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Icon__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Icon/Icon.js");const __WEBPACK_DEFAULT_EXPORT__=_Icon__WEBPACK_IMPORTED_MODULE_0__.A;_Icon__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[{name:"updateSvg",docblock:null,modifiers:[],params:[],returns:null},{name:"isInlineSvg",docblock:null,modifiers:[],params:[],returns:null}],displayName:"Icon",props:{ariaHidden:{defaultValue:{value:"false",computed:!1},description:"",type:{name:"bool"},required:!1},className:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},glyph:{description:"",type:{name:"string"},required:!0},fillColor:{description:"",type:{name:"string"},required:!1},strokeColor:{description:"",type:{name:"string"},required:!1},disabled:{description:"",type:{name:"bool"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1}}}},"./src/components/Wv3dPropertiesPanel/GeneralValuesSection/GeneralValuesSection.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_PropertyKeyValuePair_PropertyKeyValuePair__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Wv3dPropertiesPanel/PropertyKeyValuePair/PropertyKeyValuePair.js"),GeneralValuesSection=function(props){var entities=props.entities,elements=[];for(var entity in entities)elements.push(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PropertyKeyValuePair_PropertyKeyValuePair__WEBPACK_IMPORTED_MODULE_1__.A,{key:entity,name:entity,value:entities[entity]}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-element":"generalValues"},elements)};const __WEBPACK_DEFAULT_EXPORT__=GeneralValuesSection;GeneralValuesSection.__docgenInfo={description:"",methods:[],displayName:"GeneralValuesSection"}},"./src/components/Wv3dPropertiesPanel/GroupsContainer/GroupsContainer.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_Group_Group__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Wv3dPropertiesPanel/Group/Group.js");var GroupsContainer=function(props){var groups=props.groups,groupOrder=props.groupOrder,combinedGroups=[];if(groupOrder&&groupOrder.length>0)for(var group in combinedGroups=function addOrderedGroups(orderedGroup,groups){var orderArray=[];for(var group in orderedGroup){var groupName=orderedGroup[group];groupName in groups&&orderArray.push(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Group_Group__WEBPACK_IMPORTED_MODULE_1__.A,{name:groupName,key:groupName,data:groups[groupName],open:!0}))}return orderArray}(groupOrder,groups),groups)groupOrder.includes(group)||combinedGroups.push(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Group_Group__WEBPACK_IMPORTED_MODULE_1__.A,{name:group,key:group,data:groups[group],open:!0}));else for(var group1 in groups)combinedGroups.push(react__WEBPACK_IMPORTED_MODULE_0__.createElement(_Group_Group__WEBPACK_IMPORTED_MODULE_1__.A,{name:group1,key:group1,data:groups[group1],open:!0}));return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-element":"groupsContainer"},combinedGroups)};const __WEBPACK_DEFAULT_EXPORT__=GroupsContainer;GroupsContainer.__docgenInfo={description:"",methods:[],displayName:"GroupsContainer"}},"./src/components/Wv3dPropertiesPanel/PropertiesElement/PropertiesElement.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>PropertiesElement_PropertiesElement});var react=__webpack_require__("./node_modules/react/index.js"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),GeneralValuesSection=__webpack_require__("./src/components/Wv3dPropertiesPanel/GeneralValuesSection/GeneralValuesSection.js"),GroupsContainer=__webpack_require__("./src/components/Wv3dPropertiesPanel/GroupsContainer/GroupsContainer.js"),Group=__webpack_require__("./src/components/Wv3dPropertiesPanel/Group/Group.js"),HeaderTitle_HeaderTitle=(__webpack_require__("./src/components/Wv3dPropertiesPanel/HeaderTitle/HeaderTitle.scss"),function(attributes){var title=attributes.title,t=(0,useTranslation.B)().t;return react.createElement("h1",{"data-element":"headerTitle",className:"header-title"},react.createElement("span",null,t("wv3dPropertiesPanel.propertiesHeader")),react.createElement("span",null," "),react.createElement("span",{className:"header-value"},title))});const Wv3dPropertiesPanel_HeaderTitle_HeaderTitle=HeaderTitle_HeaderTitle;function createDataSet(dataMap,propertySet,removeEmptyRows){var combinedMap={};if(removeEmptyRows)for(var item in dataMap){var dataPoint=propertySet[dataMap[item]];void 0!==dataPoint&&""!==dataPoint&&(combinedMap[item]=dataPoint)}else for(var item1 in dataMap)combinedMap[item1]=propertySet[dataMap[item1]];return combinedMap}function checkForEmptyKeys(data){for(var key in data){var value=data[key];if(void 0!==value&&""!==value)return!1}return!0}HeaderTitle_HeaderTitle.__docgenInfo={description:"",methods:[],displayName:"HeaderTitle"};var PropertiesElement=function(props){var element=props.element,schema=props.schema,headerName=schema.headerName,defaultValues=schema.defaultValues,groups=schema.groups,groupOrder=schema.groupOrder,removeEmptyRows=schema.removeEmptyRows,removeEmptyGroups=schema.removeEmptyGroups,createRawValueGroup=schema.createRawValueGroup,t=(0,useTranslation.B)().t,defaultItems=createDataSet(defaultValues,element,removeEmptyRows),groupsItems=function generateGroupDataSet(dataMap,propertySet,removeEmptyRows,removeEmptyGroups){var combinedGroupMap={};if(removeEmptyGroups)for(var group in dataMap){var dataset=createDataSet(dataMap[group],propertySet,removeEmptyRows);Object.keys(dataset).length>0&&(checkForEmptyKeys(dataset)||(combinedGroupMap[group]=dataset))}else for(var group1 in dataMap)combinedGroupMap[group1]=createDataSet(dataMap[group1],propertySet,removeEmptyRows);return combinedGroupMap}(groups,element,removeEmptyRows,removeEmptyGroups),name=element[headerName];return react.createElement("section",{"data-element":"propertiesElement"},react.createElement(Wv3dPropertiesPanel_HeaderTitle_HeaderTitle,{title:name}),react.createElement(GeneralValuesSection.A,{entities:defaultItems}),react.createElement(GroupsContainer.A,{groups:groupsItems,groupOrder}),createRawValueGroup?react.createElement(Group.A,{"data-element":"Group",name:t("wv3dPropertiesPanel.miscValuesHeader"),data:element,open:!0}):null)};const PropertiesElement_PropertiesElement=PropertiesElement;PropertiesElement.__docgenInfo={description:"",methods:[],displayName:"PropertiesElement"}},"./src/components/Wv3dPropertiesPanel/Wv3dPropertiesPanel.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),react_i18next__WEBPACK_IMPORTED_MODULE_6__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),components_Icon__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/Icon/index.js"),_DataElementWrapper__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/DataElementWrapper/index.js"),uuid__WEBPACK_IMPORTED_MODULE_7__=__webpack_require__("./node_modules/uuid/dist/esm-browser/v4.js"),_PropertiesElement_PropertiesElement__WEBPACK_IMPORTED_MODULE_5__=(__webpack_require__("./src/components/Wv3dPropertiesPanel/Wv3dPropertiesPanel.scss"),__webpack_require__("./src/components/Panel/Panel.scss"),__webpack_require__("./src/components/Wv3dPropertiesPanel/PropertiesElement/PropertiesElement.js")),Wv3dPropertiesPanel=function(props){var currentWidth=props.currentWidth,isInDesktopOnlyMode=props.isInDesktopOnlyMode,_props_isMobile=props.isMobile,isMobile=void 0!==_props_isMobile&&_props_isMobile,closeWv3dPropertiesPanel=props.closeWv3dPropertiesPanel,schema=props.schema,modelData=props.modelData,t=(0,react_i18next__WEBPACK_IMPORTED_MODULE_6__.B)().t,style=!isInDesktopOnlyMode&&isMobile?{}:{width:"".concat(currentWidth,"px"),minWidth:"".concat(currentWidth,"px")},propertiesCollection=modelData.map((function(element){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(_PropertiesElement_PropertiesElement__WEBPACK_IMPORTED_MODULE_5__.A,{key:"".concat(element.handle,"-").concat((0,uuid__WEBPACK_IMPORTED_MODULE_7__.A)()),element,schema})}));return modelData.length<1&&(propertiesCollection=react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"no-selections"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Icon__WEBPACK_IMPORTED_MODULE_1__.A,{className:"empty-icon",glyph:"ic-wv3d-properties-panel-menu"})),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"empty-text"},t("wv3dPropertiesPanel.emptyPanelMessage")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement(_DataElementWrapper__WEBPACK_IMPORTED_MODULE_2__.A,{dataElement:"wv3dPropertiesPanel",className:"Panel wv3d-properties-panel",style},!isInDesktopOnlyMode&&isMobile&&react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"close-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"close-icon-container",onClick:closeWv3dPropertiesPanel},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_Icon__WEBPACK_IMPORTED_MODULE_1__.A,{glyph:"ic_close_black_24px",className:"close-icon"}))),propertiesCollection)};const __WEBPACK_DEFAULT_EXPORT__=Wv3dPropertiesPanel;Wv3dPropertiesPanel.__docgenInfo={description:"",methods:[],displayName:"Wv3dPropertiesPanel"}},"./src/helpers/getDeviceSize.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{$p:()=>isTabletAndMobileSize,IS:()=>isMobileSize,sf:()=>isTabletSize,ud:()=>isDesktopSize});var _getRootNode__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/helpers/getRootNode.js"),hooks_useMedia__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/hooks/useMedia.js"),constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/constants/deviceSizes.js"),isMobileSize=function(){var _getRootNode;return window.isApryseWebViewerWebComponent?(null===(_getRootNode=(0,_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)())||void 0===_getRootNode?void 0:_getRootNode.host.clientWidth)<=constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.j:(0,hooks_useMedia__WEBPACK_IMPORTED_MODULE_0__.A)(["(max-width: ".concat(constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.j,"px)")],[!0],!1)},isTabletSize=function(){var _getRootNode,_getRootNode1;return window.isApryseWebViewerWebComponent?(null===(_getRootNode=(0,_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)())||void 0===_getRootNode?void 0:_getRootNode.host.clientWidth)>constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.j&&(null===(_getRootNode1=(0,_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)())||void 0===_getRootNode1?void 0:_getRootNode1.host.clientWidth)<=constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T:(0,hooks_useMedia__WEBPACK_IMPORTED_MODULE_0__.A)(["(min-width: ".concat(constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.j+1,"px) and (max-width: ").concat(constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T,"px)")],[!0],!1)},isTabletAndMobileSize=function(){var _getRootNode;return window.isApryseWebViewerWebComponent?(null===(_getRootNode=(0,_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)())||void 0===_getRootNode?void 0:_getRootNode.host.clientWidth)<=constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T:(0,hooks_useMedia__WEBPACK_IMPORTED_MODULE_0__.A)(["(max-width: ".concat(constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T,"px)")],[!0],!1)},isDesktopSize=function(){var _getRootNode;return window.isApryseWebViewerWebComponent?(null===(_getRootNode=(0,_getRootNode__WEBPACK_IMPORTED_MODULE_1__.Ay)())||void 0===_getRootNode?void 0:_getRootNode.host.clientWidth)>constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T:(0,hooks_useMedia__WEBPACK_IMPORTED_MODULE_0__.A)(["(min-width: ".concat(constants_deviceSizes__WEBPACK_IMPORTED_MODULE_2__.T+1,"px)")],[!0],!1)}},"./src/hooks/useMedia.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function __WEBPACK_DEFAULT_EXPORT__(queries,values,defaultValue){var mediaQueryLists=queries.map((function(q){return window.matchMedia("screen and ".concat(q))})),getValue=function(initial){initial&&window.innerWidth;var index=mediaQueryLists.findIndex((function(mql){return null==mql?void 0:mql.matches}));return void 0!==values[index]?values[index]:defaultValue},_useState=_sliced_to_array((0,react__WEBPACK_IMPORTED_MODULE_0__.useState)((function(){return getValue(!0)})),2),value=_useState[0],setValue=_useState[1];return(0,react__WEBPACK_IMPORTED_MODULE_0__.useEffect)((function(){var handler=function(){return setValue((function(){return getValue()}))};return mediaQueryLists.forEach((function(mql){return null==mql?void 0:mql.addListener(handler)})),function(){return mediaQueryLists.forEach((function(mql){return null==mql?void 0:mql.removeListener(handler)}))}}),[]),value}}}]);