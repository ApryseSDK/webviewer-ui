"use strict";(self.webpackChunkwebviewer_ui=self.webpackChunkwebviewer_ui||[]).push([[9411],{"./node_modules/@babel/runtime/helpers/esm/toConsumableArray.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>_toConsumableArray});var arrayLikeToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/arrayLikeToArray.js");var unsupportedIterableToArray=__webpack_require__("./node_modules/@babel/runtime/helpers/esm/unsupportedIterableToArray.js");function _toConsumableArray(arr){return function _arrayWithoutHoles(arr){if(Array.isArray(arr))return(0,arrayLikeToArray.A)(arr)}(arr)||function _iterableToArray(iter){if("undefined"!=typeof Symbol&&null!=iter[Symbol.iterator]||null!=iter["@@iterator"])return Array.from(iter)}(arr)||(0,unsupportedIterableToArray.A)(arr)||function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}},"./src/components/NotesPanel/index.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.r(__webpack_exports__),__webpack_require__.d(__webpack_exports__,{default:()=>__WEBPACK_DEFAULT_EXPORT__});var _NotesPanelContainer__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/components/NotesPanel/NotesPanelContainer.js");const __WEBPACK_DEFAULT_EXPORT__=_NotesPanelContainer__WEBPACK_IMPORTED_MODULE_0__.A;_NotesPanelContainer__WEBPACK_IMPORTED_MODULE_0__.A.__docgenInfo={description:"",methods:[],displayName:"NotesPanelContainer"}},"./src/helpers/adjustFreeTextBoundingBox.js":(__unused_webpack_module,__webpack_exports__,__webpack_require__)=>{__webpack_require__.d(__webpack_exports__,{A:()=>__WEBPACK_DEFAULT_EXPORT__});var core__WEBPACK_IMPORTED_MODULE_0__=__webpack_require__("./src/core/index.js");function __WEBPACK_DEFAULT_EXPORT__(annotation){var FreeTextAnnotation=window.Core.Annotations.FreeTextAnnotation;if(function _instanceof(left,right){return null!=right&&"undefined"!=typeof Symbol&&right[Symbol.hasInstance]?!!right[Symbol.hasInstance](left):left instanceof right}(annotation,FreeTextAnnotation)&&annotation.getAutoSizeType()!==FreeTextAnnotation.AutoSizeTypes.NONE){var doc=core__WEBPACK_IMPORTED_MODULE_0__.A.getDocument(),pageNumber=annotation.PageNumber,pageInfo=doc.getPageInfo(pageNumber),pageMatrix=doc.getPageMatrix(pageNumber),pageRotation=doc.getPageRotation(pageNumber);annotation.fitText(pageInfo,pageMatrix,pageRotation)}}}}]);