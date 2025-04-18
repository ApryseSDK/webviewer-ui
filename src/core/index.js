import setToolMode from './setToolMode';
import getToolMode from './getToolMode';
import getToolsFromAllDocumentViewers from './getToolsFromAllDocumentViewers';
import setDisplayMode from './setDisplayMode';
import getDisplayMode from './getDisplayMode';
import rotateClockwise from './rotateClockwise';
import rotateCounterClockwise from './rotateCounterClockwise';
import rotatePages from './rotatePages';
import movePages from './movePages';
import removePages from './removePages';
import getFitMode from './getFitMode';
import fitToPage from './fitToPage';
import fitToWidth from './fitToWidth';
import fitToHeight from './fitToHeight';
import fitToZoom from './fitToZoom';
import zoomToMouse from './zoomToMouse';
import getZoom from './getZoom';
import zoomTo from './zoomTo';
import getAnnotationManager from './getAnnotationManager';
import getTotalPages from './getTotalPages';
import getCurrentPage from './getCurrentPage';
import setCurrentPage from './setCurrentPage';
import getType from './getType';
import isWebViewerServerDocument from './isWebViewerServerDocument';
import getSelectedText from './getSelectedText';
import clearSelection from './clearSelection';
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
import isScrollableDisplayMode from './isScrollableDisplayMode';
import isSearchResultEqual from './isSearchResultEqual';
import scrollViewUpdated from './scrollViewUpdated';
import canModify from './canModify';
import canModifyContents from './canModifyContents';
import deleteAnnotations from './deleteAnnotations';
import getDisplayAuthor from './getDisplayAuthor';
import getDocument from './getDocument';
import getCompleteRotation from './getCompleteRotation';
import getRotation from './getRotation';
import getPageInfo from './getPageInfo';
import clearSearchResults from './clearSearchResults';
import getPageSearchResults from './getPageSearchResults';
import displayAdditionalSearchResult from './displayAdditionalSearchResult';
import displayAdditionalSearchResults from './displayAdditionalSearchResults';
import displaySearchResult from './displaySearchResult';
import getActiveSearchResult from './getActiveSearchResult';
import setActiveSearchResult from './setActiveSearchResult';
import textSearchInit from './textSearchInit';
import getSearchMode from './getSearchMode';
import getResultCode from './getResultCode';
import getPageWidth from './getPageWidth';
import getPageHeight from './getPageHeight';
import getScales from './getScales';
import drawAnnotations from './drawAnnotations';
import getOutlines from './getOutlines';
import getSelectedAnnotations from './getSelectedAnnotations';
import updateCopiedAnnotations from './updateCopiedAnnotations';
import pasteCopiedAnnotations from './pasteCopiedAnnotations';
import selectAnnotation from './selectAnnotation';
import selectAnnotations from './selectAnnotations';
import addAnnotations from './addAnnotations';
import applyRedactions from './applyRedactions';
import isCreateRedactionEnabled from './isCreateRedactionEnabled';
import isApplyRedactionEnabled from './isApplyRedactionEnabled';
import isAnnotationRedactable from './isAnnotationRedactable';
import enableRedaction from './enableRedaction';
import drawAnnotationsFromList from './drawAnnotationsFromList';
import setInternalAnnotationsTransform from './setInternalAnnotationsTransform';
import setPagesUpdatedInternalAnnotationsTransform from './setPagesUpdatedInternalAnnotationsTransform';
import loadDocument from './loadDocument';
import loadThumbnailAsync from './loadThumbnailAsync';
import getSelectedTextQuads from './getSelectedTextQuads';
import getDisplayModeObject from './getDisplayModeObject';
import getScrollViewElement from './getScrollViewElement';
import getAnnotationById from './getAnnotationById';
import getAnnotationByMouseEvent from './getAnnotationByMouseEvent';
import isFullPDFEnabled from './isFullPDFEnabled';
import isBlendModeSupported from './isBlendModeSupported';
import isAnnotationSelected from './isAnnotationSelected';
import setAnnotationStyles from './setAnnotationStyles';
import deselectAnnotation from './deselectAnnotation';
import deselectAnnotations from './deselectAnnotations';
import deselectAllAnnotations from './deselectAllAnnotations';
import jumpToAnnotation from './jumpToAnnotation';
import insertBlankPages from './insertBlankPages';
import createAnnotationReply from './createAnnotationReply';
import getIsReadOnly from './getIsReadOnly';
import setNoteContents from './setNoteContents';
import setAnnotationRichTextStyle from './setAnnotationRichTextStyle';
import updateAnnotationRichTextStyle from './updateAnnotationRichTextStyle';
import getAnnotationsList from './getAnnotationsList';
import getAnnotationsLoadedPromise from './getAnnotationsLoadedPromise';
import getPrintablePDF from './getPrintablePDF';
import cancelLoadThumbnail from './cancelLoadThumbnail';
import showAnnotations from './showAnnotations';
import hideAnnotations from './hideAnnotations';
import goToOutline from './goToOutline';
import getViewerElement from './getViewerElement';
import { addEventListener, removeEventListener } from './eventListener';
import setAnnotationCanvasTransform from './setAnnotationCanvasTransform';
import getAnnotationCopy from './getAnnotationCopy';
import setWatermark from './setWatermark';
import getWatermark from './getWatermark';
import groupAnnotations from './groupAnnotations';
import ungroupAnnotations from './ungroupAnnotations';
import getNumberOfGroups from './getNumberOfGroups';
import getGroupAnnotations from './getGroupAnnotations';
import undo from './undo';
import redo from './redo';
import updateAnnotationState from './updateAnnotationState';
import getFontStyles from './getFontStyles';
import mergeDocument from './mergeDocument';
import getFormFieldCreationManager from './getFormFieldCreationManager';
import syncNamespaces from './syncNamespaces';
import createDocument from './createDocument';
import getContentEditManager from './getContentEditManager';
import getTool from './getTool';
import { getDocumentViewer, setDocumentViewer, getDocumentViewers, deleteDocumentViewer } from './documentViewers';
import getUserBookmarks from './getUserBookmarks';
import setUserBookmarks from './setUserBookmarks';
import addUserBookmark from './addUserBookmark';
import removeUserBookmark from './removeUserBookmark';
import setBookmarkIconShortcutVisibility from './setBookmarkIconShortcutVisibility';
import setBookmarkShortcutToggleOnFunction from './setBookmarkShortcutToggleOnFunction';
import setBookmarkShortcutToggleOffFunction from './setBookmarkShortcutToggleOffFunction';
import createAndApplyScale from './createAndApplyScale';
import replaceScales from './replaceScales';
import deleteScale from './deleteScale';
import getScalePrecision from './getScalePrecision';
import enableAnnotationNumbering from './enableAnnotationNumbering';
import getSemanticDiffAnnotations from './getSemanticDiffAnnotations';
import loadBlankOfficeEditorDocument from './loadBlankOfficeEditorDocument';
import getOfficeEditor from './getOfficeEditor';
import isValidURI from './isValidURI';
import openURI from './openURI';
import getAllowedFileExtensions from './getAllowedFileExtensions';
import loadBlankSpreadsheet from './loadBlankSpreadsheet';
import getCellRange from './getCellRange';

export default {
  getSemanticDiffAnnotations,
  getDocumentViewers,
  getDocumentViewer,
  setDocumentViewer,
  deleteDocumentViewer,
  setToolMode,
  getToolMode,
  getTool,
  getToolsFromAllDocumentViewers,
  setDisplayMode,
  getDisplayMode,
  rotateClockwise,
  rotateCounterClockwise,
  rotatePages,
  movePages,
  removePages,
  getFitMode,
  fitToPage,
  fitToWidth,
  fitToHeight,
  fitToZoom,
  zoomToMouse,
  getZoom,
  zoomTo,
  getAnnotationManager,
  getTotalPages,
  getCurrentPage,
  setCurrentPage,
  getType,
  getScales,
  isWebViewerServerDocument,
  getSelectedText,
  clearSelection,
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
  isScrollableDisplayMode,
  isSearchResultEqual,
  scrollViewUpdated,
  canModify,
  canModifyContents,
  deleteAnnotations,
  getDisplayAuthor,
  getDocument,
  getCompleteRotation,
  getRotation,
  getPageInfo,
  clearSearchResults,
  getPageSearchResults,
  displayAdditionalSearchResult,
  displayAdditionalSearchResults,
  getActiveSearchResult,
  setActiveSearchResult,
  textSearchInit,
  displaySearchResult,
  getSearchMode,
  getResultCode,
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
  applyRedactions,
  isCreateRedactionEnabled,
  isApplyRedactionEnabled,
  isAnnotationRedactable,
  enableRedaction,
  drawAnnotationsFromList,
  setInternalAnnotationsTransform,
  setPagesUpdatedInternalAnnotationsTransform,
  loadThumbnailAsync,
  loadDocument,
  getSelectedTextQuads,
  getDisplayModeObject,
  getScrollViewElement,
  getAnnotationById,
  isFullPDFEnabled,
  isBlendModeSupported,
  isAnnotationSelected,
  setAnnotationStyles,
  deselectAnnotation,
  deselectAnnotations,
  deselectAllAnnotations,
  jumpToAnnotation,
  insertBlankPages,
  createAnnotationReply,
  setNoteContents,
  setAnnotationRichTextStyle,
  updateAnnotationRichTextStyle,
  getAnnotationsList,
  getAnnotationsLoadedPromise,
  getPrintablePDF,
  addEventListener,
  removeEventListener,
  getIsReadOnly,
  cancelLoadThumbnail,
  showAnnotations,
  hideAnnotations,
  goToOutline,
  getViewerElement,
  setAnnotationCanvasTransform,
  getAnnotationCopy,
  setWatermark,
  getWatermark,
  getAnnotationByMouseEvent,
  groupAnnotations,
  ungroupAnnotations,
  getNumberOfGroups,
  getGroupAnnotations,
  undo,
  redo,
  updateAnnotationState,
  getFontStyles,
  mergeDocument,
  getFormFieldCreationManager,
  syncNamespaces,
  createDocument,
  getContentEditManager,
  getUserBookmarks,
  setUserBookmarks,
  addUserBookmark,
  removeUserBookmark,
  setBookmarkIconShortcutVisibility,
  setBookmarkShortcutToggleOnFunction,
  setBookmarkShortcutToggleOffFunction,
  createAndApplyScale,
  replaceScales,
  deleteScale,
  getScalePrecision,
  enableAnnotationNumbering,
  getOfficeEditor,
  loadBlankOfficeEditorDocument,
  isValidURI,
  openURI,
  getAllowedFileExtensions,
  loadBlankSpreadsheet,
  getCellRange,
};
