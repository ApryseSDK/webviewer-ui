(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[1436,4146],{"./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Input/Input.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{p:()=>Input});var tslib__WEBPACK_IMPORTED_MODULE_2__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/node_modules/tslib/tslib.es6.js"),classnames__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./node_modules/classnames/index.js"),classnames__WEBPACK_IMPORTED_MODULE_0___default=__webpack_require__.n(classnames__WEBPACK_IMPORTED_MODULE_0__),react__WEBPACK_IMPORTED_MODULE_1__=__webpack_require__("./node_modules/react/index.js"),_hooks__WEBPACK_IMPORTED_MODULE_3__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/hooks/useFocus.js"),_Icon__WEBPACK_IMPORTED_MODULE_4__=__webpack_require__("./node_modules/@pdftron/webviewer-react-toolkit/dist/esm/components/Icon/Icon.js"),Input=(0,react__WEBPACK_IMPORTED_MODULE_1__.forwardRef)((function(_a,ref){var _b=_a.message,message=void 0===_b?"default":_b,messageText=_a.messageText,fillWidth=_a.fillWidth,wrapperClassName=_a.wrapperClassName,padMessageText=_a.padMessageText,className=_a.className,onFocus=_a.onFocus,onBlur=_a.onBlur,rightElement=_a.rightElement,leftElement=_a.leftElement,_c=_a.type,type=void 0===_c?"text":_c,props=(0,tslib__WEBPACK_IMPORTED_MODULE_2__.Tt)(_a,["message","messageText","fillWidth","wrapperClassName","padMessageText","className","onFocus","onBlur","rightElement","leftElement","type"]),_d=(0,_hooks__WEBPACK_IMPORTED_MODULE_3__.i)(onFocus,onBlur),focused=_d.focused,handleOnFocus=_d.handleOnFocus,handleOnBlur=_d.handleOnBlur,rightIcon=(0,react__WEBPACK_IMPORTED_MODULE_1__.useMemo)((function(){if(rightElement)return rightElement;var icon=void 0;switch(message){case"warning":icon="Warning";break;case"error":icon="Error"}return icon?react__WEBPACK_IMPORTED_MODULE_1__.createElement(_Icon__WEBPACK_IMPORTED_MODULE_4__.I,{className:"ui__input__icon",icon}):void 0}),[message,rightElement]),wrapperClass=classnames__WEBPACK_IMPORTED_MODULE_0___default()("ui__base ui__input__wrapper",{"ui__input__wrapper--fill":fillWidth,"ui__input__wrapper--pad":padMessageText&&!messageText},wrapperClassName),mainClass=classnames__WEBPACK_IMPORTED_MODULE_0___default()("ui__input","ui__input--message-"+message,{"ui__input--focused":focused}),inputClass=classnames__WEBPACK_IMPORTED_MODULE_0___default()("ui__input__input",{"ui__input__input--disabled":props.disabled},className);return react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{className:wrapperClass},react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{className:mainClass},leftElement,react__WEBPACK_IMPORTED_MODULE_1__.createElement("input",(0,tslib__WEBPACK_IMPORTED_MODULE_2__.Cl)({},props,{type,onFocus:handleOnFocus,onBlur:handleOnBlur,className:inputClass,ref})),rightIcon),messageText?react__WEBPACK_IMPORTED_MODULE_1__.createElement("div",{className:"ui__input__messageText"},messageText):void 0)}))},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/MoreOptionsContextMenuPopup/MoreOptionsContextMenuPopup.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".more-options-context-menu-popup{padding-top:var(--padding-small);padding-bottom:var(--padding-small);background-color:var(--component-background);box-shadow:0 0 3px var(--document-box-shadow);border-radius:4px}.more-options-context-menu-popup .option-button{justify-content:flex-start;width:100%;padding:var(--padding-small) var(--padding-medium);border-radius:0}.more-options-context-menu-popup .option-button:not(:first-child){margin-top:var(--padding-small)}.more-options-context-menu-popup .option-button:hover{background-color:var(--tools-header-background)}.more-options-context-menu-popup .option-button .Icon{width:20px;height:auto;margin-right:10px}",""]),module.exports=exports},"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/constants/bookmarksOutlinesShared.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,".bookmark-outline-panel{display:flex;padding-left:var(--padding);padding-right:var(--padding-small)}.bookmark-outline-control-button{width:auto}.bookmark-outline-control-button span{color:inherit}.bookmark-outline-control-button,.bookmark-outline-control-button.disabled,.bookmark-outline-control-button[disabled]{color:var(--secondary-button-text)}.bookmark-outline-control-button.disabled,.bookmark-outline-control-button[disabled]{opacity:.5}.bookmark-outline-control-button.disabled span,.bookmark-outline-control-button[disabled] span{color:inherit}.bookmark-outline-control-button:not(.disabled):active,.bookmark-outline-control-button:not(.disabled):hover,.bookmark-outline-control-button:not([disabled]):active,.bookmark-outline-control-button:not([disabled]):hover{color:var(--secondary-button-hover)}.bookmark-outline-panel-header{display:flex;flex-flow:row nowrap;justify-content:space-between;align-items:center;padding-bottom:var(--padding-tiny);border-bottom:1px solid var(--divider)}.bookmark-outline-panel-header .header-title{font-size:16px}.bookmark-outline-row{flex-grow:1;overflow-y:auto}.msg-no-bookmark-outline{color:var(--placeholder-text);text-align:center}.bookmark-outline-single-container{display:flex;flex-flow:row nowrap;align-items:flex-start;border-radius:4px}.bookmark-outline-single-container.default{padding:var(--padding-small) var(--padding-tiny);border:1px solid transparent}.bookmark-outline-single-container.default.hover,.bookmark-outline-single-container.default:hover{cursor:pointer}.bookmark-outline-single-container.default.hover .bookmark-outline-more-button,.bookmark-outline-single-container.default:hover .bookmark-outline-more-button{display:flex}.bookmark-outline-single-container.default:hover{background-color:var(--outline-selected);border:1px solid var(--bookmark-outline-hover-border)}.bookmark-outline-single-container.default.hover,.bookmark-outline-single-container.default.selected{background-color:var(--popup-button-active)}.bookmark-outline-single-container.default .bookmark-outline-label-row{overflow:hidden}.bookmark-outline-single-container.editing{background-color:var(--faded-component-background);padding:var(--padding-medium) 20px}.bookmark-outline-single-container.preview{display:inline-flex;margin-top:0;padding:var(--padding-small);background-color:var(--component-background);box-shadow:0 0 3px var(--note-box-shadow)}.bookmark-outline-single-container .bookmark-outline-checkbox{flex-grow:0;flex-shrink:0;margin-top:1px;margin-bottom:0;margin-right:var(--padding-small)}.bookmark-outline-single-container .bookmark-outline-label-row{flex-grow:1;flex-shrink:1;display:flex;flex-flow:row wrap;align-items:flex-start;position:relative;overflow:hidden}.bookmark-outline-single-container .bookmark-outline-label{font-weight:600;flex-grow:1;flex-shrink:1;margin-bottom:var(--padding-small)}.bookmark-outline-single-container .bookmark-outline-input,.bookmark-outline-single-container .bookmark-outline-text{flex-grow:1;flex-shrink:1;flex-basis:calc(100% - 18px)}.bookmark-outline-single-container .bookmark-text-input{margin-left:var(--padding-large)}.bookmark-outline-single-container .bookmark-outline-input{color:var(--text-color);width:calc(100% - var(--padding-large));padding:var(--padding-small);border:1px solid var(--border)}.bookmark-outline-single-container .bookmark-outline-input:focus{border-color:var(--outline-color)}.bookmark-outline-single-container .bookmark-outline-input::-moz-placeholder{color:var(--placeholder-text)}.bookmark-outline-single-container .bookmark-outline-input::placeholder{color:var(--placeholder-text)}.bookmark-outline-single-container .bookmark-outline-more-button{display:none;flex-grow:0;flex-shrink:0;width:auto;height:auto;margin-left:var(--padding-tiny);margin-right:0}.bookmark-outline-single-container .bookmark-outline-more-button .Icon{width:14px;height:14px}.bookmark-outline-single-container .bookmark-outline-editing-controls{flex-basis:100%;display:flex;flex-flow:row wrap;justify-content:flex-end;align-items:center;margin-top:var(--padding-medium)}.bookmark-outline-single-container .bookmark-outline-cancel-button,.bookmark-outline-single-container .bookmark-outline-save-button{width:auto;padding:6px var(--padding)}.bookmark-outline-single-container .bookmark-outline-cancel-button{color:var(--secondary-button-text)}.bookmark-outline-single-container .bookmark-outline-cancel-button:hover{color:var(--secondary-button-hover)}.bookmark-outline-single-container .bookmark-outline-save-button{color:var(--primary-button-text);background-color:var(--primary-button);margin-left:var(--padding-tiny);border-radius:4px}.bookmark-outline-single-container .bookmark-outline-save-button:hover{background-color:var(--primary-button-hover)}.bookmark-outline-single-container .bookmark-outline-save-button.disabled,.bookmark-outline-single-container .bookmark-outline-save-button:disabled{background-color:var(--primary-button)!important;opacity:.5}.bookmark-outline-footer{border-top:1.5px solid var(--border);padding-top:var(--padding-medium);padding-bottom:var(--padding-medium);display:flex;justify-content:center;align-items:center}.bookmark-outline-footer .add-new-button .Icon{width:14px;height:14px;margin-right:var(--padding-tiny);color:inherit;fill:currentColor}.bookmark-outline-footer .add-new-button.disabled .Icon.disabled,.bookmark-outline-footer .add-new-button.disabled .Icon.disabled path,.bookmark-outline-footer .add-new-button[disabled] .Icon.disabled,.bookmark-outline-footer .add-new-button[disabled] .Icon.disabled path{color:inherit;fill:currentColor}.bookmark-outline-footer .multi-selection-button{width:auto;padding:7px}.bookmark-outline-footer .multi-selection-button .Icon{width:18px;height:18px}.bookmark-outline-footer .multi-selection-button:not(:first-child){margin-left:var(--padding-tiny)}.bookmark-outline-footer .multi-selection-button:hover{background-color:var(--view-header-button-hover)}",""]),module.exports=exports},"./src/components/MoreOptionsContextMenuPopup/MoreOptionsContextMenuPopup.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/MoreOptionsContextMenuPopup/MoreOptionsContextMenuPopup.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/constants/bookmarksOutlinesShared.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/constants/bookmarksOutlinesShared.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/MoreOptionsContextMenuPopup/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_MoreOptionsContextMenuPopup});var react=__webpack_require__("./node_modules/react/index.js"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),react_dom=__webpack_require__("./node_modules/react-dom/index.js"),prop_types=__webpack_require__("./node_modules/prop-types/index.js"),prop_types_default=__webpack_require__.n(prop_types),DataElementWrapper=__webpack_require__("./src/components/DataElementWrapper/index.js"),useOnClickOutside=__webpack_require__("./src/hooks/useOnClickOutside.js"),getOverlayPositionBasedOn=__webpack_require__("./src/helpers/getOverlayPositionBasedOn.js"),Button=(__webpack_require__("./src/components/MoreOptionsContextMenuPopup/MoreOptionsContextMenuPopup.scss"),__webpack_require__("./src/components/Button/index.js")),getRootNode=__webpack_require__("./src/helpers/getRootNode.js");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}var propTypes={type:prop_types_default().oneOf(["bookmark","outline","portfolio"]).isRequired,anchorButton:prop_types_default().string.isRequired,shouldDisplayDeleteButton:prop_types_default().bool,onClosePopup:prop_types_default().func.isRequired,onRenameClick:prop_types_default().func,onSetDestinationClick:prop_types_default().func,onDownloadClick:prop_types_default().func,onDeleteClick:prop_types_default().func,onOpenClick:prop_types_default().func},MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup=function(param){var type=param.type,anchorButton=param.anchorButton,shouldDisplayDeleteButton=param.shouldDisplayDeleteButton,onClosePopup=param.onClosePopup,onRenameClick=param.onRenameClick,onSetDestinationClick=param.onSetDestinationClick,onDownloadClick=param.onDownloadClick,onDeleteClick=param.onDeleteClick,onOpenClick=param.onOpenClick,t=_sliced_to_array((0,useTranslation.B)(),1)[0],containerRef=(0,react.useRef)(null),_useState=_sliced_to_array((0,react.useState)({left:-100,right:"auto",top:"auto"}),2),position=_useState[0],setPosition=_useState[1],Portal=function(param){var children=param.children,position=param.position,mount=(0,getRootNode.Ay)().querySelector("#outline-edit-popup-portal");return mount.style.position="absolute",mount.style.top="auto"===position.top?position.top:"".concat(position.top,"px"),mount.style.left="auto"===position.left?position.left:"".concat(position.left,"px"),mount.style.right="auto"===position.right?position.right:"".concat(position.right,"px"),mount.style.zIndex=999,(0,react_dom.createPortal)(children,mount)};(0,react.useEffect)((function(){var position=(0,getOverlayPositionBasedOn.A)(anchorButton,containerRef);setPosition(position)}),[anchorButton]);var onClickOutside=(0,react.useCallback)((function(e){(null==containerRef?void 0:containerRef.current.contains(e.target))||onClosePopup()}));return(0,useOnClickOutside.A)(containerRef,onClickOutside),react.createElement(Portal,{position},react.createElement(DataElementWrapper.A,{ref:containerRef,className:"more-options-context-menu-popup",dataElement:"".concat(type,"EditPopup")},"portfolio"===type&&onOpenClick&&react.createElement(Button.A,{className:"option-button",dataElement:"".concat(type,"OpenFileButton"),img:"icon-portfolio-file",label:t("portfolio.openFile"),ariaLabel:t("portfolio.openFile"),onClick:function(e){e.stopPropagation(),onOpenClick()}}),react.createElement(Button.A,{className:"option-button",dataElement:"".concat(type,"RenameButton"),img:"ic_edit_page_24px",label:t("action.rename"),ariaLabel:t("action.rename"),onClick:function(e){e.stopPropagation(),onRenameClick()}}),"outline"===type&&react.createElement(Button.A,{className:"option-button",dataElement:"".concat(type,"SetDestinationButton"),img:"icon-thumbtack",label:t("action.setDestination"),ariaLabel:t("action.setDestination"),onClick:function(e){e.stopPropagation(),onSetDestinationClick()}}),"portfolio"===type&&react.createElement(Button.A,{className:"option-button",dataElement:"".concat(type,"DownloadButton"),img:"icon-download",label:t("action.download"),ariaLabel:t("action.download"),onClick:function(e){e.stopPropagation(),onDownloadClick()}}),shouldDisplayDeleteButton&&react.createElement(Button.A,{className:"option-button",dataElement:"".concat(type,"DeleteButton"),img:"icon-delete-line",label:t("action.delete"),ariaLabel:t("action.delete"),onClick:function(e){e.stopPropagation(),onDeleteClick()}})))};MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup.propTypes=propTypes;const components_MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup=MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup;MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup.__docgenInfo={description:"",methods:[],displayName:"MoreOptionsContextMenuPopup",props:{type:{description:"",type:{name:"enum",value:[{value:"'bookmark'",computed:!1},{value:"'outline'",computed:!1},{value:"'portfolio'",computed:!1}]},required:!0},anchorButton:{description:"",type:{name:"string"},required:!0},shouldDisplayDeleteButton:{description:"",type:{name:"bool"},required:!1},onClosePopup:{description:"",type:{name:"func"},required:!0},onRenameClick:{description:"",type:{name:"func"},required:!1},onSetDestinationClick:{description:"",type:{name:"func"},required:!1},onDownloadClick:{description:"",type:{name:"func"},required:!1},onDeleteClick:{description:"",type:{name:"func"},required:!1},onOpenClick:{description:"",type:{name:"func"},required:!1}}};const components_MoreOptionsContextMenuPopup=components_MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup;components_MoreOptionsContextMenuPopup_MoreOptionsContextMenuPopup.__docgenInfo={description:"",methods:[],displayName:"MoreOptionsContextMenuPopup",props:{type:{description:"",type:{name:"enum",value:[{value:"'bookmark'",computed:!1},{value:"'outline'",computed:!1},{value:"'portfolio'",computed:!1}]},required:!0},anchorButton:{description:"",type:{name:"string"},required:!0},shouldDisplayDeleteButton:{description:"",type:{name:"bool"},required:!1},onClosePopup:{description:"",type:{name:"func"},required:!0},onRenameClick:{description:"",type:{name:"func"},required:!1},onSetDestinationClick:{description:"",type:{name:"func"},required:!1},onDownloadClick:{description:"",type:{name:"func"},required:!1},onDeleteClick:{description:"",type:{name:"func"},required:!1},onOpenClick:{description:"",type:{name:"func"},required:!1}}}},"./src/components/PortfolioPanel/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _PortfolioPanel__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/PortfolioPanel/PortfolioPanel.js");const __WEBPACK_DEFAULT_EXPORT__=_PortfolioPanel__WEBPACK_IMPORTED_MODULE_0__.A;_PortfolioPanel__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"PortfolioPanel"}},"./src/constants/dnd.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{V7:()=>DropLocation,ll:()=>ItemTypes,n0:()=>BUFFER_ROOM});var ItemTypes={OUTLINE:"outline",PORTFOLIO:"portfolio"},DropLocation={ON_TARGET_HORIZONTAL_MIDPOINT:"onTargetHorizontalMidPoint",ABOVE_TARGET:"aboveTarget",BELOW_TARGET:"belowTarget",INITIAL:"initial"},BUFFER_ROOM=8}}]);