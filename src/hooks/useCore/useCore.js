// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

export const createWrappedCore = (key) => ({
  ...core,
  getFormFieldCreationManager: () => core.getFormFieldCreationManager(key),
  getSelectedAnnotations: () => core.getSelectedAnnotations(key),
  getToolMode: () => core.getToolMode(key),
  getAnnotationManager: () => core.getAnnotationManager(key),
  canModify: (annotation) => core.canModify(annotation, key),
  addEventListener: (event, handler, options) => core.addEventListener(event, handler, options, key),
  removeEventListener: (event, handler) => core.removeEventListener(event, handler, key),
  getDocument: () => core.getDocument(key),
  getCurrentPage: () => core.getCurrentPage(key),
  setCurrentPage: (pageNum) => core.setCurrentPage(pageNum, key),
  getDisplayAuthor: (author) => core.getDisplayAuthor(author, key),
  getOutlines: (callback) => core.getOutlines(callback, key),
  getSelectedText: () => core.getSelectedText(key),
  getAnnotationsList: () => core.getAnnotationsList(key),
  getAnnotationsLoadedPromise: () => core.getAnnotationsLoadedPromise(key),
  getPrintablePDF: () => core.getPrintablePDF(key),
  getScrollViewElement: () => core.getScrollViewElement(key),
  getAnnotationById: (id) => core.getAnnotationById(id, key),
  getNumberOfGroups: (annotations) => core.getNumberOfGroups(annotations, key),
  isFullPDFEnabled: () => core.isFullPDFEnabled(key),
  isAnnotationSelected: (annotation) => core.isAnnotationSelected(annotation, key),
  deselectAnnotation: (annotation) => core.deselectAnnotation(annotation, key),
  deselectAnnotations: (annotations) => core.deselectAnnotations(annotations, key),
  deselectAllAnnotations: () => core.deselectAllAnnotations(),
  jumpToAnnotation: (annotation) => core.jumpToAnnotation(annotation, key),
  selectAnnotation: (annotation) => core.selectAnnotation(annotation, key),
  selectAnnotations: (annotations) => core.selectAnnotations(annotations, key),
  addAnnotations: (annotations) => core.addAnnotations(annotations, key),
  deleteAnnotations: (annotations, options) => core.deleteAnnotations(annotations, options, key),
  getGroupAnnotations: (annotation) => core.getGroupAnnotations(annotation, key),
  groupAnnotations: (annotation, annotations) => core.groupAnnotations(annotation, annotations, key),
  ungroupAnnotations: (annotations) => core.ungroupAnnotations(annotations, key),
  getTool: (toolName) => core.getTool(toolName, key),
  setToolMode: (toolName) => core.setToolMode(toolName),
  getOfficeEditor: () => core.getOfficeEditor(key),
  getDocumentViewer: () => core.getDocumentViewer(key),
  getTotalPages: () => core.getTotalPages(key),
  getZoom: () => core.getZoom(key),
  fitToWidth: () => core.fitToWidth(key),
  fitToPage: () => core.fitToPage(key),
  fitToHeight: () => core.fitToHeight(key),
  getCurrentUser: () => core.getCurrentUser(key),
  getUserBookmarks: () => core.getUserBookmarks(key),
  setUserBookmarks: (bookmarks) => core.setUserBookmarks(bookmarks, key),
  addUserBookmark: (pageNumber, text) => core.addUserBookmark(pageNumber, text, key),
  removeUserBookmark: (pageNumber) => core.removeUserBookmark(pageNumber, key),
  setBookmarkIconShortcutVisibility: (isVisible) => core.setBookmarkIconShortcutVisibility(isVisible, key),
  getSemanticDiffAnnotations: () => core.getSemanticDiffAnnotations(key),
  rotateClockwise: () => core.rotateClockwise(key),
  rotateCounterClockwise: () => core.rotateCounterClockwise(key),
  getPageInfo: (pageNumber) => core.getPageInfo(pageNumber, key),
  drawAnnotations: (pageNumber, canvas, includeBackground, widgetContainer) => core.drawAnnotations(pageNumber, canvas, includeBackground, widgetContainer, key),
  getCompleteRotation: (pageNumber) => core.getCompleteRotation(pageNumber, key),
  getRotation: (pageNumber) => core.getRotation(pageNumber, key),
  getDisplayModeObject: () => core.getDisplayModeObject(key),
  getViewerElement: () => core.getViewerElement(key),
  createAndApplyScale: (scale, applyTo) => core.createAndApplyScale(scale, applyTo, key),
  getScales: () => core.getScales(key),
  setActiveSearchResult: (result) => core.setActiveSearchResult(result, key),
  deleteScale: (scale) => core.deleteScale(scale, key),
  getScalePrecision: (scale) => core.getScalePrecision(scale, key),
  getPageWidth: (pageNumber) => core.getPageWidth(pageNumber, key),
  getPageHeight: (pageNumber) => core.getPageHeight(pageNumber, key),
  setAnnotationCanvasTransform: (ctx, zoom, rotation) => core.setAnnotationCanvasTransform(ctx, zoom, rotation, key),
  movePages: (pageArray, newLocation) => core.movePages(pageArray, newLocation, key),
  cancelLoadThumbnail: (requestId) => core.cancelLoadThumbnail(requestId, key),
  goToOutline: (outline) => core.goToOutline(outline, key),
});

const useCore = (overrideDocumentViewerKey) => {
  const documentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const key = overrideDocumentViewerKey || documentViewerKey;
  const wrappedCore = useMemo(() => createWrappedCore(key), [key]);
  const documentViewer = useMemo(() => core.getDocumentViewer(key), [key]);

  return {
    core: wrappedCore,
    documentViewer,
  };
};

export default useCore;
