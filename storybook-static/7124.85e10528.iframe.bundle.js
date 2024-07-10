(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[7124],{"./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/PageReplacementModal/FileListPanel/FileListPanel.scss":(module,exports,__webpack_require__)=>{(exports=__webpack_require__("./node_modules/css-loader/dist/runtime/api.js")(!1)).push([module.id,":host{display:inline-block;container-type:inline-size;width:100%;height:100%;overflow:hidden}@media(min-width:901px){.App:not(.is-web-component) .hide-in-desktop{display:none}}@container (min-width: 901px){.hide-in-desktop{display:none}}@media(min-width:641px)and (max-width:900px){.App:not(.is-in-desktop-only-mode):not(.is-web-component) .hide-in-tablet{display:none}}@container (min-width: 641px) and (max-width: 900px){.App.is-web-component:not(.is-in-desktop-only-mode) .hide-in-tablet{display:none}}@media(max-width:640px)and (min-width:431px){.App:not(.is-web-component) .hide-in-mobile{display:none}}@container (max-width: 640px) and (min-width: 431px){.App.is-web-component .hide-in-mobile{display:none}}@media(max-width:430px){.App:not(.is-web-component) .hide-in-small-mobile{display:none}}@container (max-width: 430px){.App.is-web-component .hide-in-small-mobile{display:none}}.always-hide{display:none}.FileListPanel{box-sizing:border-box;display:flex;flex-direction:column;align-items:center;width:100%;height:100%;overflow:auto;padding-top:20px;padding-bottom:20px;background-color:var(--document-background-color);border-radius:4px}.FileListPanel ul{display:flex;flex-wrap:wrap;justify-content:center;align-content:flex-start;list-style:none;margin:0;padding:16px;height:30em;width:100%}.FileListPanel ul li.selected{border:1px solid #48a4e0}.FileListPanel ul li{background:var(--gray-1);border:1px solid var(--blue-1);box-sizing:border-box;border-radius:6px;width:100%;height:60px;margin:4px 0;padding:8px 10px;display:flex;flex-direction:row;cursor:pointer}.FileListPanel ul li:hover{border:1px solid #48a4e0}.FileListPanel ul li .li-div{background:#fff;width:42px;height:100%;float:left;border-radius:4px;position:relative}.FileListPanel ul li .li-div-img{position:absolute;top:50%;left:50%;transform:translateY(-50%) translateX(-50%);width:28px}.FileListPanel ul li .li-div-img.with-border{height:34px;border:1px solid var(--blue-1)}.FileListPanel ul li .li-div-txt{margin-left:10px;line-height:40px}",""]),exports.locals={LEFT_HEADER_WIDTH:"41px",RIGHT_HEADER_WIDTH:"41px"},module.exports=exports},"./src/components/PageReplacementModal/FileListPanel/FileListPanel.scss":(module,__unused_webpack_exports,__webpack_require__)=>{var api=__webpack_require__("./node_modules/style-loader/dist/runtime/injectStylesIntoStyleTag.js"),content=__webpack_require__("./node_modules/css-loader/dist/cjs.js!./node_modules/postcss-loader/src/index.js??ruleSet[1].rules[14].use[2]!./node_modules/sass-loader/dist/cjs.js!./src/components/PageReplacementModal/FileListPanel/FileListPanel.scss");"string"==typeof(content=content.__esModule?content.default:content)&&(content=[[module.id,content,""]]);var options={insert:"head",singleton:!1};api(content,options);module.exports=content.locals||{}},"./src/components/PageReplacementModal/PageReplacementModal.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{"use strict";__webpack_require__.d(__webpack_exports__,{A:()=>components_PageReplacementModal_PageReplacementModal});var react=__webpack_require__("./node_modules/react/index.js"),classnames=__webpack_require__("./node_modules/classnames/index.js"),classnames_default=__webpack_require__.n(classnames),core=__webpack_require__("./src/core/index.js"),useTranslation=__webpack_require__("./node_modules/react-i18next/dist/es/useTranslation.js"),FileListPanel_FileListPanel=(__webpack_require__("./src/components/PageReplacementModal/FileListPanel/FileListPanel.scss"),function(param){var defaultValue=param.defaultValue,onFileSelect=param.onFileSelect,_param_list=param.list,list=void 0===_param_list?[]:_param_list,id=(defaultValue||{}).id,elements=list.map((function(item,i){var isSelected=id===item.id,modalClass=classnames_default()({selected:isSelected}),thumbnail=function(item){if(item.hasOwnProperty("thumbnail")){var src=null,thumbnail=item.thumbnail;thumbnail.url?src=thumbnail.url:thumbnail.toDataURL&&(src=thumbnail.toDataURL());var img=react.createElement("img",{src,className:"li-div-img"});return react.createElement("div",{className:"li-div"},img)}return null}(item);return react.createElement("li",{tabIndex:"0",key:i,onClick:function(){return function(id){onFileSelect(list.find((function(item){return item.id===id})))}(item.id)},onKeyDown:function(event){return function(event,id){"Enter"===event.key&&onFileSelect(list.find((function(item){return item.id===id})))}(event,item.id)},className:modalClass},thumbnail,react.createElement("div",{className:"li-div-txt"},item.filename))}));return react.createElement("div",{className:"FileListPanel"},react.createElement("ul",null,elements))});const PageReplacementModal_FileListPanel_FileListPanel=FileListPanel_FileListPanel;FileListPanel_FileListPanel.__docgenInfo={description:"",methods:[],displayName:"FileListPanel",props:{list:{defaultValue:{value:"[]",computed:!1},required:!1}}};const PageReplacementModal_FileListPanel=PageReplacementModal_FileListPanel_FileListPanel;PageReplacementModal_FileListPanel_FileListPanel.__docgenInfo={description:"",methods:[],displayName:"FileListPanel",props:{list:{defaultValue:{value:"[]",computed:!1},required:!1}}};var FileInputPanel=__webpack_require__("./src/components/PageReplacementModal/FileInputPanel/index.js"),FilePickerPanel=__webpack_require__("./src/components/PageReplacementModal/FilePickerPanel/index.js"),Tabs=__webpack_require__("./src/components/Tabs/index.js"),Button=__webpack_require__("./src/components/Button/index.js"),FileSelectedPanel=__webpack_require__("./src/components/PageReplacementModal/FileSelectedPanel/FileSelectedPanel.js"),pageManipulationFunctions=__webpack_require__("./src/helpers/pageManipulationFunctions.js");function _define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _object_spread_props(target,source){return source=null!=source?source:{},Object.getOwnPropertyDescriptors?Object.defineProperties(target,Object.getOwnPropertyDescriptors(source)):function ownKeys(object,enumerableOnly){var keys=Object.keys(object);if(Object.getOwnPropertySymbols){var symbols=Object.getOwnPropertySymbols(object);enumerableOnly&&(symbols=symbols.filter((function(sym){return Object.getOwnPropertyDescriptor(object,sym).enumerable}))),keys.push.apply(keys,symbols)}return keys}(Object(source)).forEach((function(key){Object.defineProperty(target,key,Object.getOwnPropertyDescriptor(source,key))})),target}var FileSelectedPanelContainer=react.forwardRef((function(props,ref){var documentInViewer=core.A.getDocument();return react.createElement(FileSelectedPanel.A,_object_spread_props(function _object_spread(target){for(var i=1;i<arguments.length;i++){var source=null!=arguments[i]?arguments[i]:{},ownKeys=Object.keys(source);"function"==typeof Object.getOwnPropertySymbols&&(ownKeys=ownKeys.concat(Object.getOwnPropertySymbols(source).filter((function(sym){return Object.getOwnPropertyDescriptor(source,sym).enumerable})))),ownKeys.forEach((function(key){_define_property(target,key,source[key])}))}return target}({},props),{documentInViewer,replacePagesHandler:pageManipulationFunctions.Db,ref}))}));FileSelectedPanelContainer.displayName="FileSelectedPanelContainer";const FileSelectedPanel_FileSelectedPanelContainer=FileSelectedPanelContainer;FileSelectedPanelContainer.__docgenInfo={description:"",methods:[],displayName:"FileSelectedPanelContainer"};const PageReplacementModal_FileSelectedPanel=FileSelectedPanel_FileSelectedPanelContainer;FileSelectedPanel_FileSelectedPanelContainer.__docgenInfo={description:"",methods:[],displayName:"FileSelectedPanelContainer"};var es=__webpack_require__("./node_modules/react-redux/es/index.js"),ModalWrapper=__webpack_require__("./src/components/ModalWrapper/index.js"),getRootNode=__webpack_require__("./src/helpers/getRootNode.js");__webpack_require__("./src/components/PageReplacementModal/PageReplacementModal.scss");function _array_like_to_array(arr,len){(null==len||len>arr.length)&&(len=arr.length);for(var i=0,arr2=new Array(len);i<len;i++)arr2[i]=arr[i];return arr2}function asyncGeneratorStep(gen,resolve,reject,_next,_throw,key,arg){try{var info=gen[key](arg),value=info.value}catch(error){return void reject(error)}info.done?resolve(value):Promise.resolve(value).then(_next,_throw)}function _async_to_generator(fn){return function(){var self=this,args=arguments;return new Promise((function(resolve,reject){var gen=fn.apply(self,args);function _next(value){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"next",value)}function _throw(err){asyncGeneratorStep(gen,resolve,reject,_next,_throw,"throw",err)}_next(void 0)}))}}function PageReplacementModal_define_property(obj,key,value){return key in obj?Object.defineProperty(obj,key,{value,enumerable:!0,configurable:!0,writable:!0}):obj[key]=value,obj}function _sliced_to_array(arr,i){return function _array_with_holes(arr){if(Array.isArray(arr))return arr}(arr)||function _iterable_to_array_limit(arr,i){var _i=null==arr?null:"undefined"!=typeof Symbol&&arr[Symbol.iterator]||arr["@@iterator"];if(null!=_i){var _s,_e,_arr=[],_n=!0,_d=!1;try{for(_i=_i.call(arr);!(_n=(_s=_i.next()).done)&&(_arr.push(_s.value),!i||_arr.length!==i);_n=!0);}catch(err){_d=!0,_e=err}finally{try{_n||null==_i.return||_i.return()}finally{if(_d)throw _e}}return _arr}}(arr,i)||function _unsupported_iterable_to_array(o,minLen){if(!o)return;if("string"==typeof o)return _array_like_to_array(o,minLen);var n=Object.prototype.toString.call(o).slice(8,-1);"Object"===n&&o.constructor&&(n=o.constructor.name);if("Map"===n||"Set"===n)return Array.from(n);if("Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n))return _array_like_to_array(o,minLen)}(arr,i)||function _non_iterable_rest(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function _ts_generator(thisArg,body){var f,y,t,g,_={label:0,sent:function(){if(1&t[0])throw t[1];return t[1]},trys:[],ops:[]};return g={next:verb(0),throw:verb(1),return:verb(2)},"function"==typeof Symbol&&(g[Symbol.iterator]=function(){return this}),g;function verb(n){return function(v){return function step(op){if(f)throw new TypeError("Generator is already executing.");for(;_;)try{if(f=1,y&&(t=2&op[0]?y.return:op[0]?y.throw||((t=y.return)&&t.call(y),0):y.next)&&!(t=t.call(y,op[1])).done)return t;switch(y=0,t&&(op=[2&op[0],t.value]),op[0]){case 0:case 1:t=op;break;case 4:return _.label++,{value:op[1],done:!1};case 5:_.label++,y=op[1],op=[0];continue;case 7:op=_.ops.pop(),_.trys.pop();continue;default:if(!(t=_.trys,(t=t.length>0&&t[t.length-1])||6!==op[0]&&2!==op[0])){_=0;continue}if(3===op[0]&&(!t||op[1]>t[0]&&op[1]<t[3])){_.label=op[1];break}if(6===op[0]&&_.label<t[1]){_.label=t[1],t=op;break}if(t&&_.label<t[2]){_.label=t[2],_.ops.push(op);break}t[2]&&_.ops.pop(),_.trys.pop();continue}op=body.call(thisArg,_)}catch(e){op=[6,e],y=0}finally{f=t=0}if(5&op[0])throw op[1];return{value:op[0]?op[1]:void 0,done:!0}}([n,v])}}}var isValidUrlRegex=new RegExp(/^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,"m"),options={loadAsPDF:!0,l:window.sampleL},PageReplacementModal_PageReplacementModal=function(param){var closeModal=param.closeModal,selectableFiles=param.selectableFiles,isOpen=param.isOpen,selectedThumbnailPageIndexes=param.selectedThumbnailPageIndexes,selectedTab=param.selectedTab,t=_sliced_to_array((0,useTranslation.B)(),1)[0],_useState=_sliced_to_array((0,react.useState)({}),2),source=_useState[0],setSource=_useState[1],_useState1=_sliced_to_array((0,react.useState)(null),2),selectedDoc=_useState1[0],setSelectedDoc=_useState1[1],_useState2=_sliced_to_array((0,react.useState)(!1),2),isFileSelected=_useState2[0],setIsFileSelected=_useState2[1],_useState3=_sliced_to_array((0,react.useState)(null),2),selectedTabInternal=_useState3[0],setSelectedTabInternal=_useState3[1],dispatch=(0,es.wA)();(0,react.useEffect)((function(){isOpen&&selectedTabInternal!==selectedTab&&setSelectedTabInternal(selectedTab)}),[isOpen,selectedTabInternal,selectedTab]);var _ref,closeThisModal=function(){setSelectedDoc(null),setIsFileSelected(!1);var el=(0,getRootNode.Ay)().querySelector("#".concat("pageReplacementFileInputId"));el&&(el.value=null),closeModal(),setSelectedTabInternal(null),setSource({})},closeModalWarning=function(){return(0,pageManipulationFunctions.Mw)(closeThisModal,dispatch)},modalClass=classnames_default()({Modal:!0,PageReplacementModal:!0,open:isOpen,closed:!isOpen}),srcString=source[selectedTabInternal],handleSelection=(_ref=_async_to_generator((function(){var document;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return setIsFileSelected(!0),srcString&&"customFileListPanelButton"===selectedTabInternal?srcString.onSelect?[4,srcString.onSelect()]:[3,2]:[3,3];case 1:document=_state.sent(),setSelectedDoc(document),_state.label=2;case 2:return[3,5];case 3:return srcString?[4,core.A.createDocument(srcString,options)]:[3,5];case 4:document=_state.sent(),setSelectedDoc(document),_state.label=5;case 5:return[2]}}))})),function handleSelection(){return _ref.apply(this,arguments)}),fileProcessedHandler=function(){var _ref=_async_to_generator((function(file){var document;return _ts_generator(this,(function(_state){switch(_state.label){case 0:return function _instanceof(left,right){return null!=right&&"undefined"!=typeof Symbol&&right[Symbol.hasInstance]?!!right[Symbol.hasInstance](left):left instanceof right}(file,(0,getRootNode.Iv)().instance.Core.Document)?(document=file,[3,3]):[3,1];case 1:return[4,core.A.createDocument(file,options)];case 2:document=_state.sent(),_state.label=3;case 3:return setSelectedDoc(document),setIsFileSelected(!0),[2]}}))}));return function fileProcessedHandler(file){return _ref.apply(this,arguments)}}(),isSelectBtnDisabled=void 0===srcString;"urlInputPanelButton"!==selectedTabInternal||isValidUrlRegex.test(srcString)||(isSelectBtnDisabled=!0);var isFilePanelEnabled,clearDocument=function(){setSelectedDoc(null),setIsFileSelected(!1)};return isOpen?react.createElement("div",{className:modalClass,"data-element":"pageReplacementModal",onMouseDown:isFileSelected?closeModalWarning:closeThisModal,id:"pageReplacementModal"},isFileSelected?react.createElement(PageReplacementModal_FileSelectedPanel,{closeThisModal,clearLoadedFile:clearDocument,pageIndicesToReplace:selectedThumbnailPageIndexes,sourceDocument:selectedDoc,closeModalWarning}):(isFilePanelEnabled=selectableFiles&&selectableFiles.length>0,react.createElement("div",{className:"container tabs",onMouseDown:function(e){return e.stopPropagation()}},react.createElement(ModalWrapper.A,{isOpen,title:t("component.pageReplaceModalTitle"),closeButtonDataElement:"pageReplacementModalClose",onCloseClick:closeThisModal,swipeToClose:!0,closeHandler:closeThisModal},react.createElement("div",{className:"swipe-indicator"}),react.createElement(Tabs.tU,{className:"page-replacement-tabs",id:"pageReplacementModal"},react.createElement("div",{className:"tabs-header-container"},react.createElement("div",{className:"tab-list"},isFilePanelEnabled&&react.createElement(react.Fragment,null,react.createElement(Tabs.oz,{dataElement:"customFileListPanelButton"},react.createElement("button",{className:"tab-options-button"},t("option.pageReplacementModal.yourFiles"))),react.createElement("div",{className:"tab-options-divider"})),react.createElement(Tabs.oz,{dataElement:"urlInputPanelButton"},react.createElement("button",{className:"tab-options-button"},t("link.url"))),react.createElement("div",{className:"tab-options-divider"}),react.createElement(Tabs.oz,{dataElement:"filePickerPanelButton"},react.createElement("button",{className:"tab-options-button"},t("option.pageReplacementModal.localFile"))))),react.createElement("div",{className:"page-replacement-divider"}),react.createElement(Tabs.Kp,{dataElement:"customFileListPanel"},react.createElement("div",{className:"panel-body"},react.createElement(PageReplacementModal_FileListPanel,{onFileSelect:function(selection){setSource(PageReplacementModal_define_property({},selectedTabInternal,selection))},list:selectableFiles,defaultValue:srcString}))),react.createElement(Tabs.Kp,{dataElement:"urlInputPanel"},react.createElement("div",{className:"panel-body"},react.createElement(FileInputPanel.A,{onFileSelect:function(url){setSource(PageReplacementModal_define_property({},selectedTabInternal,url))},defaultValue:source.urlInputPanelButton}))),react.createElement(Tabs.Kp,{dataElement:"filePickerPanel"},react.createElement("div",{className:"panel-body upload"},react.createElement(FilePickerPanel.A,{fileInputId:"pageReplacementFileInputId",onFileProcessed:function(file){return fileProcessedHandler(file)}})))),react.createElement("div",{className:"page-replacement-divider"}),react.createElement("div",{className:"footer"},react.createElement(Button.A,{className:classnames_default()("modal-btn",{noFile:isSelectBtnDisabled}),onClick:function(){return isSelectBtnDisabled?null:handleSelection()},label:t("action.select"),disabled:isSelectBtnDisabled})))))):null};const components_PageReplacementModal_PageReplacementModal=PageReplacementModal_PageReplacementModal;PageReplacementModal_PageReplacementModal.__docgenInfo={description:"",methods:[],displayName:"PageReplacementModal"}}}]);