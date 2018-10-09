import setToolMode from './setToolMode';
import getToolMode from './getToolMode';
import getTool from './getTool';
import setDisplayMode from './setDisplayMode';
import getDisplayMode from './getDisplayMode';
import rotateClockwise from './rotateClockwise';
import rotateCounterClockwise from './rotateCounterClockwise';
import getFitMode from './getFitMode';
import fitToPage from './fitToPage';
import fitToWidth from './fitToWidth';
import fitToHeight from './fitToHeight';
import fitToZoom from './fitToZoom';
import zoomToMouse from './zoomToMouse';
import getZoom from './getZoom';
import zoomTo from './zoomTo';
import getDocumentViewer from './getDocumentViewer';
import getAnnotationManager from './getAnnotationManager';
import getTotalPages from './getTotalPages';
import getCurrentPage from './getCurrentPage';
import setCurrentPage from './setCurrentPage';
import getSelectedText from './getSelectedText';
import clearSelection from './clearSelection';
import setOptions from './setOptions';
import closeDocument from './closeDocument';
import getToolModeMap from './getToolModeMap';
import getCurrentUser from './getCurrentUser';
import getIsAdminUser from './getIsAdminUser';
import setIsAdminUser from './setIsAdminUser';
import exportAnnotations from './exportAnnotations';
import setCurrentUser from './setCurrentUser';
import setReadOnly from './setReadOnly';
import setScrollViewElement from './setScrollViewElement';
import setViewerElement from './setViewerElement';
import isContinuousDisplayMode from './isContinuousDisplayMode';
import scrollViewUpdated from './scrollViewUpdated';
import canModify from './canModify';
import deleteAnnotations from './deleteAnnotations';
import getDisplayAuthor from './getDisplayAuthor';
import getDocument from './getDocument';
import getCompleteRotation from './getCompleteRotation';
import getRotation from './getRotation';
import getPageInfo from './getPageInfo';
import clearSearchResults from './clearSearchResults';
import displayAdditionalSearchResult from './displayAdditionalSearchResult';
import displaySearchResult from './displaySearchResult';
import setActiveSearchResult from './setActiveSearchResult';
import textSearchInit from './textSearchInit';
import getSearchMode from './getSearchMode';
import getPageWidth from './getPageWidth';
import getPageHeight from './getPageHeight';
import drawAnnotations from './drawAnnotations';
import getOutlines from './getOutlines';
import getSelectedAnnotations from './getSelectedAnnotations';
import updateCopiedAnnotations from './updateCopiedAnnotations';
import pasteCopiedAnnotations from './pasteCopiedAnnotations';
import selectAnnotation from './selectAnnotation';
import selectAnnotations from './selectAnnotations';
import addAnnotations from './addAnnotations';
import drawAnnotationsFromList from './drawAnnotationsFromList';
import setInternalAnnotationsTransform from './setInternalAnnotationsTransform';
import setPagesUpdatedInternalAnnotationsTransform from './setPagesUpdatedInternalAnnotationsTransform';
import loadAsync from './loadAsync';
import loadThumbnailAsync from './loadThumbnailAsync';
import getSelectedTextQuads from './getSelectedTextQuads';
import getDisplayModeObject from './getDisplayModeObject';
import getScrollViewElement from './getScrollViewElement';
import getAnnotationById from './getAnnotationById';
import isAnnotationSelected from './isAnnotationSelected';
import setAnnotationStyles from './setAnnotationStyles';
import deselectAnnotation from './deselectAnnotation';
import deselectAllAnnotations from './deselectAllAnnotations';
import jumpToAnnotation from './jumpToAnnotation';
import createAnnotationReply from './createAnnotationReply';
import getIsReadOnly from './getIsReadOnly';
import setNoteContents from './setNoteContents';
import getAnnotationsList from './getAnnotationsList';
import getAnnotationsLoadedPromise from './getAnnotationsLoadedPromise';
import getPrintablePDF from './getPrintablePDF';
import cancelLoadThumbnail from './cancelLoadThumbnail';
import showAnnotations from './showAnnotations';
import hideAnnotations from './hideAnnotations';
import goToOutline from './goToOutline';
import { addEventListener, removeEventListener } from './eventListener';

export default {
  setToolMode,
  getToolMode,
  getTool,
  setDisplayMode,
  getDisplayMode,
  rotateClockwise,
  rotateCounterClockwise,
  getFitMode,
  fitToPage,
  fitToWidth,
  fitToHeight,
  fitToZoom,
  zoomToMouse,
  getZoom,
  zoomTo,
  getDocumentViewer,
  getAnnotationManager,
  getTotalPages,
  getCurrentPage,
  setCurrentPage,
  getSelectedText,
  clearSelection,
  setOptions,
  closeDocument,
  getToolModeMap,
  getCurrentUser,
  getIsAdminUser,
  setIsAdminUser,
  exportAnnotations,
  setCurrentUser,
  setReadOnly,
  setScrollViewElement,
  setViewerElement,
  isContinuousDisplayMode,
  scrollViewUpdated,
  canModify,
  deleteAnnotations,
  getDisplayAuthor,
  getDocument,
  getCompleteRotation,
  getRotation,
  getPageInfo,
  clearSearchResults,
  displayAdditionalSearchResult,
  setActiveSearchResult,
  textSearchInit,
  displaySearchResult,
  getSearchMode,
  getPageWidth,
  getPageHeight,
  drawAnnotations,
  getOutlines,
  getSelectedAnnotations,
  updateCopiedAnnotations,
  pasteCopiedAnnotations,
  selectAnnotation,
  selectAnnotations,
  addAnnotations,
  drawAnnotationsFromList,
  setInternalAnnotationsTransform,
  setPagesUpdatedInternalAnnotationsTransform,
  loadThumbnailAsync,
  loadAsync,
  getSelectedTextQuads,
  getDisplayModeObject,
  getScrollViewElement,
  getAnnotationById,
  isAnnotationSelected,
  setAnnotationStyles,
  deselectAnnotation,
  deselectAllAnnotations,
  jumpToAnnotation,
  createAnnotationReply,
  setNoteContents,
  getAnnotationsList,
  getAnnotationsLoadedPromise,
  getPrintablePDF,
  addEventListener,
  removeEventListener,
  getIsReadOnly,
  cancelLoadThumbnail,
  showAnnotations,
  hideAnnotations,
  goToOutline
};