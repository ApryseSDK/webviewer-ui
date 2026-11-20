import core from 'core';
import Events from 'constants/events';
import { getInstanceBoundCallback, findInstanceBoundCallback } from './documentViewers';

export const addEventListener = (event, eventListener, options, documentViewerKey) => {
  const eventToObjectMap = getEventToObjectMap(documentViewerKey);
  const object = eventToObjectMap[event];
  const listener = getInstanceBoundCallback(eventListener);

  options ? object.addEventListener(event, listener, options) : object.addEventListener(event, listener);
};

export const removeEventListener = (event, eventListener, documentViewerKey) => {
  const eventToObjectMap = getEventToObjectMap(documentViewerKey);
  const object = eventToObjectMap[event];

  object.removeEventListener(event, findInstanceBoundCallback(eventListener) || eventListener);
};

const getEventToObjectMap = (documentViewerKey) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const annotManager = documentViewer.getAnnotationManager();
  const contentEditManager = documentViewer.getContentEditManager();
  const historyManager = documentViewer.getAnnotationHistoryManager();
  const editBoxManager = annotManager.getEditBoxManager();
  const formFieldCreationManager = annotManager.getFormFieldCreationManager();
  const measurementManager = documentViewer.getMeasurementManager();
  const accessibleReadingOrderManager = documentViewer.getAccessibleReadingOrderManager();
  const spreadsheetEditorManager = documentViewer.getSpreadsheetEditorManager();

  return {
    cursorPropertiesUpdated: documentViewer,
    selectionPropertiesUpdated: documentViewer,
    officeDocumentEdited: documentViewer,
    signatureSaved: documentViewer,
    signatureDeleted: documentViewer,
    annotationsLoaded: documentViewer,
    tap: documentViewer,
    longTap: documentViewer,
    click: documentViewer,
    dblClick: documentViewer,
    displayPageLocation: documentViewer,
    keyDown: documentViewer,
    keyUp: documentViewer,
    mouseEnter: documentViewer,
    mouseLeave: documentViewer,
    mouseLeftDown: documentViewer,
    mouseLeftUp: documentViewer,
    mouseMove: documentViewer,
    mouseRightDown: documentViewer,
    mouseRightUp: documentViewer,
    pageComplete: documentViewer,
    searchInProgress: documentViewer,
    activeSearchResultChanged: documentViewer,
    searchResultsChanged: documentViewer,
    textSelected: documentViewer,
    beginRendering: documentViewer,
    finishedRendering: documentViewer,
    beforeDocumentLoaded: documentViewer,
    displayModeUpdated: documentViewer,
    documentLoaded: documentViewer,
    documentUnloaded: documentViewer,
    fitModeUpdated: documentViewer,
    rotationUpdated: documentViewer,
    toolUpdated: documentViewer,
    toolModeUpdated: documentViewer,
    zoomUpdated: documentViewer,
    pageNumberUpdated: documentViewer,
    pagesUpdated: documentViewer,
    visiblePagesChanged: documentViewer,
    'fitModeUpdated.fitbutton': documentViewer,
    [Events.COMPARE_ANNOTATIONS_LOADED]: documentViewer,
    historyChanged: historyManager,
    annotationSelected: annotManager,
    annotationChanged: annotManager,
    outlineSetDestination: annotManager,
    updateAnnotationPermission: annotManager,
    addReply: annotManager,
    deleteReply: annotManager,
    annotationHidden: annotManager,
    annotationDoubleClicked: annotManager,
    annotationNumberingUpdated: annotManager,
    annotationFiltered: annotManager,
    annotationToggled: annotManager,
    fieldChanged: annotManager,
    notify: annotManager,
    setNoteText: annotManager,
    fileAttachmentDataAvailable: annotManager,
    digitalSignatureApplied: annotManager,
    widgetHighlightingChanged: annotManager,
    editorFocus: editBoxManager,
    editorBlur: editBoxManager,
    editorTextChanged: editBoxManager,
    editorSelectionChanged: editBoxManager,
    formFieldCreationModeStarted: formFieldCreationManager,
    formFieldCreationModeEnded: formFieldCreationManager,
    scaleUpdated: measurementManager,
    contentEditModeStarted: contentEditManager,
    contentEditModeEnded: contentEditManager,
    contentBoxEditStarted: contentEditManager,
    contentBoxEditEnded: contentEditManager,
    contentEditSelectionChange: contentEditManager,
    contentEditDocumentDigitallySigned: contentEditManager,
    contentEditPasswordRequired: contentEditManager,
    createAnnotationWithNoScale: measurementManager,
    accessibleReadingOrderModeStarted: accessibleReadingOrderManager,
    accessibleReadingOrderModeReady: accessibleReadingOrderManager,
    accessibleReadingOrderModeEnded: accessibleReadingOrderManager,
    accessibleReadingOrderModeNoStructure: accessibleReadingOrderManager,
    userBookmarksChanged: documentViewer,
    selectionChanged: spreadsheetEditorManager,
    sheetChanged: spreadsheetEditorManager,
    spreadsheetEditorEditModeChanged: spreadsheetEditorManager,
    spreadsheetEditorHistoryChanged: spreadsheetEditorManager,
    activeSheetChanged: spreadsheetEditorManager,
    spreadsheetEditorLoaded: spreadsheetEditorManager,
    spreadsheetEditorReady: spreadsheetEditorManager,
    selectedRangeStyleChanged: spreadsheetEditorManager,
    formulaSearchEvent: spreadsheetEditorManager,
    formulaHelpEvent: spreadsheetEditorManager,
    formulaBarTextChangedEvent: spreadsheetEditorManager,
    formulaBarSelectionChangedEvent: spreadsheetEditorManager,
  };
};
