// eslint-disable-next-line custom/use-core-hook-in-components
import core from 'core';
import { useContext, useMemo } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { runWithInstance, getCurrentInstanceId, createInstanceScopedState } from 'core/documentViewers';
import InstanceIdContext from 'src/context/InstanceIdContext';

const setToolModeForKey = (toolName, key) => {
  if (core.getMultiViewerModeActive?.()) {
    core.setToolMode(toolName);
    return;
  }

  const documentViewer = core.getDocumentViewer(key);
  documentViewer?.setToolMode?.(documentViewer.getTool(toolName));
};

/**
 * Wraps every method of `wrapped` so it executes against `instanceId`.
 * @ignore
 */
const bindWrappedCoreToInstance = (wrapped, instanceId) => {
  const bound = { ...wrapped };
  Object.keys(wrapped).forEach((name) => {
    if (typeof wrapped[name] === 'function') {
      bound[name] = (...args) => runWithInstance(instanceId, () => wrapped[name](...args));
    }
  });
  return bound;
};

const instanceCores = createInstanceScopedState((instanceId) => bindWrappedCoreToInstance(core, instanceId));

/**
 * `core` with every method bound to `instanceId`; original signatures, including explicit viewer keys, are preserved.
 * @ignore
 */
export const getInstanceCore = (instanceId = getCurrentInstanceId()) => instanceCores.get(instanceId);

/**
 * For hooks and components that call `core` directly. Effects run after React has left the rendering instance, so unbound `core` could resolve a sibling.
 * @ignore
 */
export const useInstanceCore = () => getInstanceCore(useContext(InstanceIdContext) ?? getCurrentInstanceId());

// `instanceId` defaults to the ambient instance at creation, so wrappers made in handlers or API calls stay on it across awaits.
export const createWrappedCore = (key, instanceId = getCurrentInstanceId()) => bindWrappedCoreToInstance({
  ...core,
  getDocumentViewers: () => core.getDocumentViewers(),
  getFormFieldCreationManager: () => core.getFormFieldCreationManager(key),
  getSelectedAnnotations: () => core.getSelectedAnnotations(key),
  getToolMode: () => core.getToolMode(key),
  getAnnotationManager: () => core.getAnnotationManager(key),
  canModify: (annotation) => core.canModify(annotation, key),
  addEventListener: (event, handler, options) => core.addEventListener(event, handler, options, key),
  removeEventListener: (event, handler) => core.removeEventListener(event, handler, key),
  getDocument: () => core.getDocument(key),
  closeDocument: () => core.closeDocument(key),
  getCurrentPage: () => core.getCurrentPage(key),
  setCurrentPage: (pageNum) => core.setCurrentPage(pageNum, key),
  getDisplayAuthor: (author) => core.getDisplayAuthor(author, key),
  getOutlines: (callback) => core.getOutlines(callback, key),
  getSelectedText: () => core.getSelectedText(key),
  getAnnotationsList: () => core.getAnnotationsList(key),
  getAnnotationsLoadedPromise: () => core.getAnnotationsLoadedPromise(key),
  exportAnnotations: (options) => core.exportAnnotations(options, key),
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
  setToolMode: (toolName) => setToolModeForKey(toolName, key),
  getOfficeEditor: () => core.getOfficeEditor(key),
  getTrackedChangeManager: () => core.getTrackedChangeManager(key),
  getDocumentViewer: () => core.getDocumentViewer(key),
  getTotalPages: () => core.getTotalPages(key),
  getZoom: () => core.getZoom(key),
  zoomTo: (zoomFactor, x, y) => core.zoomTo(zoomFactor, x, y, key),
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
}, instanceId);

const useCore = (overrideDocumentViewerKey) => {
  const documentViewerKey = useSelector(selectors.getActiveDocumentViewerKey);
  const instanceId = useContext(InstanceIdContext) ?? getCurrentInstanceId();
  const key = overrideDocumentViewerKey || documentViewerKey;
  const wrappedCore = useMemo(() => createWrappedCore(key, instanceId), [key, instanceId]);
  const documentViewer = useMemo(() => core.getDocumentViewer(key, instanceId), [key, instanceId]);

  return {
    core: wrappedCore,
    documentViewer,
  };
};

export default useCore;
