export const addEventListener = (event, eventListener) =>  {
  const eventToObjectMap = getEventToObjectMap(); 
  const object = eventToObjectMap[event];
  
  object.on(event, eventListener);
};

export const removeEventListener = (event, eventListener) =>  {
  const eventToObjectMap = getEventToObjectMap(); 
  const object = eventToObjectMap[event];
  
  object.off(event, eventListener);  
};

const getEventToObjectMap = () => {
  const annotManager = window.docViewer.getAnnotationManager();

  return {
    annotationsLoaded: window.docViewer,
    changePage: window.docViewer,
    click: window.docViewer,
    dblClick: window.docViewer,
    displayPageLocation: window.docViewer,
    keyDown: window.docViewer,
    keyUp: window.docViewer,
    mouseEnter: window.docViewer,
    mouseLeave: window.docViewer,
    mouseLeftDown: window.docViewer,
    mouseLeftUp: window.docViewer,
    mouseMove: window.docViewer,
    mouseRightDown: window.docViewer,
    mouseRightUp: window.docViewer,
    pageComplete: window.docViewer,
    searchInProgress: window.docViewer,
    textSelected: window.docViewer,
    beginRendering: window.docViewer,
    finishedRendering: window.docViewer,
    beforeDocumentLoaded: window.docViewer,
    displayModeUpdated: window.docViewer,
    documentLoaded: window.docViewer,
    documentUnloaded: window.docViewer,
    fitModeUpdated: window.docViewer,
    rotationUpdated: window.docViewer,
    toolUpdated: window.docViewer,
    toolModeUpdated: window.docViewer,
    zoomUpdated: window.docViewer,
    pageNumberUpdated: window.docViewer,
    layoutChanged: window.docViewer,
    'fitModeUpdated.fitbutton': window.docViewer,
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
  };
};

