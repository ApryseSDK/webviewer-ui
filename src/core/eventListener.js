import core from 'core';

export const addEventListener = (event, eventListener, options = null, documentViewerKey = 1) => {
  const eventToObjectMap = getEventToObjectMap(documentViewerKey);
  const object = eventToObjectMap[event];

  options ? object.addEventListener(event, eventListener, options) : object.addEventListener(event, eventListener);
};

export const removeEventListener = (event, eventListener, documentViewerKey = 1) => {
  const eventToObjectMap = getEventToObjectMap(documentViewerKey);
  const object = eventToObjectMap[event];

  object.removeEventListener(event, eventListener);
};

const getEventToObjectMap = (documentViewerKey = 1) => {
  const documentViewer = core.getDocumentViewer(documentViewerKey);
  const annotManager = documentViewer.getAnnotationManager();
  const contentEditManager = documentViewer.getContentEditManager();
  const historyManager = documentViewer.getAnnotationHistoryManager();
  const editBoxManager = annotManager.getEditBoxManager();
  const formFieldCreationManager = annotManager.getFormFieldCreationManager();
  const measurementManager = documentViewer.getMeasurementManager();

  return {
    signatureSaved: documentViewer,
    signatureDeleted: documentViewer,
    annotationsLoaded: documentViewer,
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
    readOnlyModeChanged: documentViewer,
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
    'fitModeUpdated.fitbutton': documentViewer,
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
    digitalSignatureAvailable: annotManager,
    editorFocus: editBoxManager,
    editorBlur: editBoxManager,
    editorTextChanged: editBoxManager,
    editorSelectionChanged: editBoxManager,
    formFieldCreationModeStarted: formFieldCreationManager,
    formFieldCreationModeEnded: formFieldCreationManager,
    scaleUpdated: measurementManager,
    contentEditModeStarted: contentEditManager,
    contentEditModeEnded: contentEditManager,
    createAnnotationWithNoScale: measurementManager,
  };
};
