(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[8799],{"./src/components/AlignmentPopup/AlignmentPopup.stories.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{Basic:()=>Basic,__namedExportsOrder:()=>__namedExportsOrder,default:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),_AlignmentPopup__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./src/components/AlignmentPopup/AlignmentPopup.js"),redux__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/redux/es/redux.js"),react_redux__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/react-redux/es/index.js"),noop=function(){};const __WEBPACK_DEFAULT_EXPORT__={title:"Components/AlignmentPopup",component:_AlignmentPopup__WEBPACK_IMPORTED_MODULE_1__.A,parameters:{customizableUI:!0}};var initialState={viewer:{disabledElements:{},customElementOverrides:{},annotationPopup:[],activeDocumentViewerKey:1},featureFlags:{customizableUI:!0}};var store=(0,redux__WEBPACK_IMPORTED_MODULE_3__.y$)((function rootReducer(){return arguments.length>0&&void 0!==arguments[0]?arguments[0]:initialState})),Basic=function(){var props={alignmentConfig:[{alignment:"left",icon:"ic-alignment-left",title:"alignmentPopup.alignLeft"},{alignment:"centerHorizontal",icon:"ic-alignment-center-horizontal",title:"alignmentPopup.alignHorizontalCenter"},{alignment:"right",icon:"ic-alignment-right",title:"alignmentPopup.alignRight"},{alignment:"top",icon:"ic-alignment-top",title:"alignmentPopup.alignTop"},{alignment:"centerVertical",icon:"ic-alignment-center-vertical",title:"alignmentPopup.alignVerticalCenter"},{alignment:"bottom",icon:"ic-alignment-bottom",title:"alignmentPopup.alignBottom"}],distributeConfig:[{alignment:"distributeVertical",icon:"ic-distribute-vertical",title:"alignmentPopup.distributeVertical"},{alignment:"distributeHorizontal",icon:"ic-distribute-horizontal",title:"alignmentPopup.distributeHorizontal"}],alignmentOnClick:noop,distributeOnClick:noop,backToMenuOnClick:noop,isAnnotation:!0};return react__WEBPACK_IMPORTED_MODULE_0__.createElement(react_redux__WEBPACK_IMPORTED_MODULE_2__.Kq,{store},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"AlignAnnotationPopupContainer"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(_AlignmentPopup__WEBPACK_IMPORTED_MODULE_1__.A,props)))};Basic.parameters={...Basic.parameters,docs:{...Basic.parameters?.docs,source:{originalSource:"() => {\n  const props = {\n    alignmentConfig: [{\n      alignment: 'left',\n      icon: 'ic-alignment-left',\n      title: 'alignmentPopup.alignLeft'\n    }, {\n      alignment: 'centerHorizontal',\n      icon: 'ic-alignment-center-horizontal',\n      title: 'alignmentPopup.alignHorizontalCenter'\n    }, {\n      alignment: 'right',\n      icon: 'ic-alignment-right',\n      title: 'alignmentPopup.alignRight'\n    }, {\n      alignment: 'top',\n      icon: 'ic-alignment-top',\n      title: 'alignmentPopup.alignTop'\n    }, {\n      alignment: 'centerVertical',\n      icon: 'ic-alignment-center-vertical',\n      title: 'alignmentPopup.alignVerticalCenter'\n    }, {\n      alignment: 'bottom',\n      icon: 'ic-alignment-bottom',\n      title: 'alignmentPopup.alignBottom'\n    }],\n    distributeConfig: [{\n      alignment: 'distributeVertical',\n      icon: 'ic-distribute-vertical',\n      title: 'alignmentPopup.distributeVertical'\n    }, {\n      alignment: 'distributeHorizontal',\n      icon: 'ic-distribute-horizontal',\n      title: 'alignmentPopup.distributeHorizontal'\n    }],\n    alignmentOnClick: noop,\n    distributeOnClick: noop,\n    backToMenuOnClick: noop,\n    isAnnotation: true\n  };\n  return <Provider store={store}>\n      <div className=\"AlignAnnotationPopupContainer\">\n        <AlignmentPopup {...props} />\n      </div>\n    </Provider>;\n}",...Basic.parameters?.docs?.source}}};const __namedExportsOrder=["Basic"]},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/AlignmentPopup/AlignmentPopup.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".open.AlignAnnotationPopupContainer{visibility:visible}.closed.AlignAnnotationPopupContainer{visibility:hidden}:host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.AlignAnnotationPopupContainer{position:absolute;z-index:70;display:flex;justify-content:center;align-items:center}.AlignAnnotationPopupContainer:empty{padding:0}.AlignAnnotationPopupContainer .buttons{display:flex}.AlignAnnotationPopupContainer .Button{margin:4px;width:32px;height:32px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .AlignAnnotationPopupContainer .Button{width:42px;height:42px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .AlignAnnotationPopupContainer .Button{width:42px;height:42px}}.AlignAnnotationPopupContainer .Button:hover{background:var(--popup-button-hover)}.AlignAnnotationPopupContainer .Button:hover:disabled{background:none}.AlignAnnotationPopupContainer .Button .Icon{width:18px;height:18px}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .AlignAnnotationPopupContainer .Button .Icon{width:24px;height:24px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .AlignAnnotationPopupContainer .Button .Icon{width:24px;height:24px}}.is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button{width:100%;border-radius:0;justify-content:flex-start;padding-left:var(--padding-small);padding-right:var(--padding-small);margin:0 0 var(--padding-tiny) 0}.is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button:first-child{margin-top:var(--padding-tiny)}@media(max-width:640px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button{width:100%;height:32px}}@container (max-width: 640px){.App.is-web-component:not(.is-in-desktop-only-mode) .is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button{width:100%;height:32px}}.is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button .Icon{margin-right:10px}.is-vertical.AlignAnnotationPopupContainer .Button.main-menu-button span{white-space:nowrap}@keyframes bottom-up{0%{transform:translateY(100%)}to{transform:translateY(0)}}@keyframes up-bottom{0%{transform:translateY(0)}to{transform:translateY(100%)}}.AlignAnnotationPopupContainer{border-radius:4px;box-shadow:0 0 3px 0 var(--document-box-shadow);background:var(--component-background)}.AlignAnnotationPopup.is-horizontal .contents{display:flex;grid-gap:16px;gap:16px;flex-direction:column;padding:16px}.AlignAnnotationPopup.is-horizontal .contents .back-to-menu-button{width:24px;height:24px}.AlignAnnotationPopup.is-horizontal .contents .back-to-menu-button .Icon{width:16px;height:16px}.AlignAnnotationPopup.is-horizontal .contents .divider{height:1px;width:100%;background:var(--divider)}.AlignAnnotationPopup.is-horizontal button{padding:0;margin:0;height:32px;width:32px}.AlignAnnotationPopup.is-horizontal button .Icon{width:24px;height:24px}.AlignAnnotationPopup.is-horizontal .button-row-container{display:flex;grid-gap:8px;gap:8px;flex-direction:column}.AlignAnnotationPopup.is-horizontal .button-row{display:flex;align-items:center;grid-gap:8px;gap:8px}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/AlignmentPopup/AlignmentPopup.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/AlignmentPopup/AlignmentPopup.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/ActionButton/ActionButton.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react_redux__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react-redux/es/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),components_Button__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/Button/index.js");const __WEBPACK_DEFAULT_EXPORT__=(0,react_redux__WEBPACK_IMPORTED_MODULE_0__.Ng)((function(state,param){var obj,key,value,isNotClickableSelector=param.isNotClickableSelector,className=param.className,disabled=param.disabled;return{className:classnames__WEBPACK_IMPORTED_MODULE_1___default()((obj={ActionButton:!0},key=className,value=!!className,key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj)),disabled:disabled||isNotClickableSelector&&isNotClickableSelector(state)}}),(function(dispatch,ownProps){return{onClick:ownProps.shouldPassActiveDocumentViewerKeyToOnClickHandler||!ownProps.onClick?ownProps.onClick:function(){return ownProps.onClick(dispatch)}}}))(components_Button__WEBPACK_IMPORTED_MODULE_2__.A)},"./src/components/ActionButton/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});const __WEBPACK_DEFAULT_EXPORT__=__webpack_require__("./src/components/ActionButton/ActionButton.js").A},"./src/components/AlignmentPopup/AlignmentPopup.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var react__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/react/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_1___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_1__),prop_types__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/prop-types/index.js"),prop_types__WEBPACK_IMPORTED_MODULE_4___default=__webpack_require__.n(prop_types__WEBPACK_IMPORTED_MODULE_4__),react_i18next__WEBPACK_IMPORTED_MODULE_5__=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),components_ActionButton__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./src/components/ActionButton/index.js");__webpack_require__("./src/components/AlignmentPopup/AlignmentPopup.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={alignmentConfig:prop_types__WEBPACK_IMPORTED_MODULE_4___default().array,alignmentOnClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,backToMenuOnClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,distributeConfig:prop_types__WEBPACK_IMPORTED_MODULE_4___default().array,distributeOnClick:prop_types__WEBPACK_IMPORTED_MODULE_4___default().func,isAnnotation:prop_types__WEBPACK_IMPORTED_MODULE_4___default().bool},AlignmentPopup=function(param){var alignmentConfig=param.alignmentConfig,alignmentOnClick=param.alignmentOnClick,backToMenuOnClick=param.backToMenuOnClick,distributeConfig=param.distributeConfig,distributeOnClick=param.distributeOnClick,isAnnotation=param.isAnnotation,t=_sliced_to_array((0,react_i18next__WEBPACK_IMPORTED_MODULE_5__.B)(),1)[0],renderButtonRow=function(title,config,onClick){return react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"button-row-container"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",null,t(title)),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"button-row"},config.map((function(config){return react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_ActionButton__WEBPACK_IMPORTED_MODULE_2__.A,{key:config.title,className:"main-menu-button",title:t(config.title),img:config.icon,onClick:function(){onClick(config.alignment)}})}))))};return isAnnotation?react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{"data-testid":"alignment-annotation-element",className:classnames__WEBPACK_IMPORTED_MODULE_1___default()({Popup:!0,AlignAnnotationPopup:!0,"is-horizontal":!0})},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"contents"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"top-section"},react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"button-row"},react__WEBPACK_IMPORTED_MODULE_0__.createElement(components_ActionButton__WEBPACK_IMPORTED_MODULE_2__.A,{className:"back-to-menu-button",dataElement:"backToMenuButton",title:t("action.backToMenu"),img:"ic_chevron_left_black_24px",onClick:backToMenuOnClick}),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{role:"button",type:"button",tabIndex:"0",onClick:backToMenuOnClick,onKeyDown:backToMenuOnClick},t("action.backToMenu")))),react__WEBPACK_IMPORTED_MODULE_0__.createElement("div",{className:"divider"}),renderButtonRow("alignmentPopup.alignment",alignmentConfig,alignmentOnClick),renderButtonRow("alignmentPopup.distribute",distributeConfig,distributeOnClick))):null};AlignmentPopup.propTypes=propTypes;const __WEBPACK_DEFAULT_EXPORT__=AlignmentPopup;AlignmentPopup.__docgenInfo={description:"",methods:[],displayName:"AlignmentPopup",props:{alignmentConfig:{description:"",type:{name:"array"},required:!1},alignmentOnClick:{description:"",type:{name:"func"},required:!1},backToMenuOnClick:{description:"",type:{name:"func"},required:!1},distributeConfig:{description:"",type:{name:"array"},required:!1},distributeOnClick:{description:"",type:{name:"func"},required:!1},isAnnotation:{description:"",type:{name:"bool"},required:!1}}}},"./src/components/Button/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var _Button__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/Button/Button.js");const __WEBPACK_DEFAULT_EXPORT__=_Button__WEBPACK_IMPORTED_MODULE_0__.A;_Button__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"Button",props:{isActive:{description:"",type:{name:"bool"},required:!1},mediaQueryClassName:{description:"",type:{name:"string"},required:!1},img:{description:"",type:{name:"string"},required:!1},label:{description:"",type:{name:"union",value:[{name:"string"},{name:"number"}]},required:!1},title:{description:"",type:{name:"string"},required:!1},color:{description:"",type:{name:"string"},required:!1},dataElement:{description:"",type:{name:"string"},required:!1},className:{description:"",type:{name:"string"},required:!1},onClick:{description:"",type:{name:"func"},required:!1},onDoubleClick:{description:"",type:{name:"func"},required:!1},onMouseUp:{description:"",type:{name:"func"},required:!1},isSubmitType:{description:"",type:{name:"bool"},required:!1},ariaLabel:{description:"Will override translated title if both given.",type:{name:"string"},required:!1},ariaControls:{description:"",type:{name:"string"},required:!1},role:{description:"",type:{name:"string"},required:!1},hideTooltipShortcut:{description:"",type:{name:"bool"},required:!1},useI18String:{description:"",type:{name:"bool"},required:!1},shouldPassActiveDocumentViewerKeyToOnClickHandler:{description:"",type:{name:"bool"},required:!1},children:{description:"",type:{name:"node"},required:!1}}}}}]);