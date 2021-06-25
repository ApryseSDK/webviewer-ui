export const addEventListener = (event, eventListener) => {
  const eventToObjectMap = getEventToObjectMap();
  const object = eventToObjectMap[event];

  object.addEventListener(event, eventListener);
};

export const removeEventListener = (event, eventListener) => {
  const eventToObjectMap = getEventToObjectMap();
  const object = eventToObjectMap[event];

  object.removeEventListener(event, eventListener);
};

const getEventToObjectMap = () => {
  const annotManager = window.documentViewer.getAnnotationManager();
  const historyManager = window.documentViewer.getAnnotationHistoryManager();
  const editBoxManager = annotManager.getEditBoxManager();
  const formFieldCreationManager = annotManager.getFormFieldCreationManager();

  return {
    signatureSaved: window.documentViewer,
    signatureDeleted: window.documentViewer,
    annotationsLoaded: window.documentViewer,
    changePage: window.documentViewer,
    click: window.documentViewer,
    dblClick: window.documentViewer,
    displayPageLocation: window.documentViewer,
    keyDown: window.documentViewer,
    keyUp: window.documentViewer,
    mouseEnter: window.documentViewer,
    mouseLeave: window.documentViewer,
    mouseLeftDown: window.documentViewer,
    mouseLeftUp: window.documentViewer,
    mouseMove: window.documentViewer,
    mouseRightDown: window.documentViewer,
    mouseRightUp: window.documentViewer,
    pageComplete: window.documentViewer,
    searchInProgress: window.documentViewer,
    activeSearchResultChanged: window.documentViewer,
    searchResultsChanged: window.documentViewer,
    textSelected: window.documentViewer,
    beginRendering: window.documentViewer,
    finishedRendering: window.documentViewer,
    beforeDocumentLoaded: window.documentViewer,
    displayModeUpdated: window.documentViewer,
    documentLoaded: window.documentViewer,
    documentUnloaded: window.documentViewer,
    fitModeUpdated: window.documentViewer,
    rotationUpdated: window.documentViewer,
    toolUpdated: window.documentViewer,
    toolModeUpdated: window.documentViewer,
    zoomUpdated: window.documentViewer,
    pageNumberUpdated: window.documentViewer,
    layoutChanged: window.documentViewer,
    'fitModeUpdated.fitbutton': window.documentViewer,
    historyChanged: historyManager,
    annotationSelected: annotManager,
    annotationChanged: annotManager,
    updateAnnotationPermission: annotManager,
    addReply: annotManager,
    deleteReply: annotManager,
    annotationHidden: annotManager,
    annotationDoubleClicked: annotManager,
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
    formFieldCreationModeEnded: formFieldCreationManager
  };
};
