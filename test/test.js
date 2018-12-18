var viewerElement = document.getElementById('viewer');
var buttonsElement = document.getElementById('buttons');
var divider = document.createElement('hr');
var button = document.createElement('button');
button.style.display = 'block';

var viewer = new PDFTron.WebViewer({
  path: '/lib',
  l: window.sampleL,
  initialDoc: '/samples/files/webviewer-demo-annotated.pdf',
}, viewerElement);
var viewerInstance;

viewerElement.addEventListener('ready', function() {
  viewerInstance = viewer.getInstance();
  var missingApis = [];
  Object.keys(viewerInstance).forEach(function(key) {
    if (typeof viewerInstance[key] === 'function' && !apis[key]) {
      missingApis.push(key);
    }
  });
  if (missingApis.length > 0) {
    console.warn(`APIs missing from this test:\n${missingApis.sort().join('\n')}`);
  }

  Object.keys(apis).forEach(function(key) {
    if (key.indexOf('divider') === 0) {
      buttonsElement.appendChild(divider.cloneNode());
    } else {
      var clonedButton = button.cloneNode();
      clonedButton.onclick = apis[key];
      clonedButton.innerHTML = key;
      buttonsElement.appendChild(clonedButton);
    }
  });
});

var constants = {
  whitelist: [
    'getBBAnnotManager',
    'setNotesPanelSort',
    'setSortNotesBy',
    'setEngineType',
    'setPrintQuality',
    'updateOutlines'
  ],
  searchListener: function(searchValue, options, results) {
    console.log('Search listener triggered.', results);
  },
  sortStrategy: {
    name: 'annotationType',
    getSortedNotes: notes => {
      return notes.sort((a ,b) => {
        if (a.Subject < b.Subject) return -1;
        if (a.Subject > b.Subject) return 1;
        if (a.Subject === b.Subject) return 0;
      })
    },
    shouldRenderSeparator: (prevNote, currNote) => prevNote.Subject !== currNote.Subject,
    getSeparatorContent: (prevNote, currNote) => `${currNote.Subject}`
  }
}

var apis = {
  loadDocument: function() {
    viewerInstance.loadDocument('/samples/files/webviewer-demo-annotated.pdf');
  },
  closeDocument: function() {
    viewerInstance.closeDocument();
  },
  divider1: true,
  addSearchListener: function() {
    viewerInstance.addSearchListener(constants.searchListener);
  },
  removeSearchListener: function() {
    viewerInstance.removeSearchListener(constants.searchListener);
  },
  searchText: function() {
    viewerInstance.searchText('web');
  },
  searchTextFull: function() {
    viewerInstance.searchTextFull('web');
  },
  divider2: true,
  addSortStrategy: function() {
    viewerInstance.addSortStrategy(constants.sortStrategy);
  },
  setSortStrategy: function() {
    viewerInstance.setSortStrategy('time');
  },
  divider3: true,
  openElement: function() {
    viewerInstance.openElement('viewControlsOverlay');
  },
  isElementOpen: function() {
    viewerInstance.isElementOpen('viewControlsOverlay');
  },
  closeElement: function(dataElement) {
    viewerInstance.closeElement('viewControlsOverlay');
  },
  toggleElement: function() {
    viewerInstance.toggleElement('viewControlsOverlay');
  },
  openElements: function() {
    viewerInstance.openElements([ 'outlinesPanel' ]);
  },
  closeElements: function() {
    viewerInstance.closeElements([ 'outlinesPanel' ]);
  },
  divider4: true,
  disableTool: function() {
    viewerInstance.disableTool('AnnotationCreateSticky');
  },
  isToolDisabled: function() {
    viewerInstance.isToolDisabled('AnnotationCreateSticky');
  },
  enableTool: function() {
    viewerInstance.enableTool('AnnotationCreateSticky');
  },
  disableTools: function() {
    viewerInstance.disableTools();
  },
  enableTools: function() {
    viewerInstance.enableTools();
  },
  divider5: true,
  disableElement: function() {
    viewerInstance.disableElement('leftPanelButton');
  },
  isElementDisabled: function() {
    viewerInstance.isElementDisabled('leftPanelButton');
  },
  enableElement: function() {
    viewerInstance.enableElement('leftPanelButton');
  },
  disableElements: function() {
    viewerInstance.disableElements([ 'fitButton', 'zoomOutButton', 'zoomInButton' ]);
  },
  enableElements: function() {
    viewerInstance.enableElements([ 'fitButton', 'zoomOutButton', 'zoomInButton' ]);
  },
  enableAllElements: function() {
    viewerInstance.enableAllElements();
  },
  divider6: true,
  disableAnnotations: function() {
    // TODO
  },
  enableAnnotations: function() {
    // TODO
  },
  disableDownload: function() {
    // TODO
  },  
  enableDownload: function() {
    // TODO
  },  
  enableFilePicker: function() {
    // TODO
  },
  disableFilePicker: function() {
    // TODO
  },
  disableNotesPanel: function() {
    // TODO
  },
  enableNotesPanel: function() {
    // TODO
  },
  disablePrint: function() {
    // TODO
  },
  enablePrint: function() {
    // TODO
  },
  disableTextSelection: function() {
    // TODO
  },
  enableTextSelection: function() {
    // TODO
  },
  divider7: true,
  setAnnotationUser: function() {
    // TODO
  },
  getAnnotationUser: function() {
    // TODO
  },
  setAdminUser: function() {
    // TODO
  },
  isAdminUser: function() {
    // TODO
  },
  setReadyOnly: function() {
    // TODO
  },
  isReadOnly: function() {
    // TODO
  },
  divider8: true,
  getCurrentPageNumber: function() {
    // TODO
  },
  setCurrentPageNumber: function() {
    // TODO
  },
  getPageCount: function() {
    // TODO
  },
  goToFirstPage: function() {
    // TODO
  },
  goToLastPage: function() {
    // TODO
  },
  goToNextPage: function() {
    // TODO
  },
  goToPrevPage: function() {
    // TODO
  },
  goToPrevPage: function() {
    // TODO
  },
  divider9: true,
  getFitMode: function() {
    // TODO
  },
  setFitMode: function() {
    // TODO
  },
  getLayoutMode: function() {
    // TODO
  },
  setLayoutMode: function() {
    // TODO
  },
  getZoomLevel: function() {
    // TODO
  },
  setZoomLevel: function() {
    // TODO
  },
  rotateClockwise: function() {
    // TODO
  },
  rotateCounterClockwise: function() {
    // TODO
  },
  divider10: true,
  getShowSideWindow: function() {
    // TODO
  },
  setShowSideWindow: function() {
    // TODO
  },
  getSideWindowVisibility: function() {
    // TODO
  },
  divider11: true,
  getToolMode: function() {
    // TODO
  },
  setToolMode: function() {
    // TODO
  },
  registerTool: function() {
    // TODO
  },
  unregisterTool: function() {
    // TODO
  },
  updateTool: function() {
    // TODO
  },
  divider12: true,  
  setActiveHeaderGroup: function() {
    // TODO
  },
  setActiveLeftPanel: function() {
    // TODO
  },  
  setCustomPanel: function() {
    // TODO
  },
  setHeaderItems: function() {
    // TODO
  },
  setLanguage: function() {
    // TODO
  },
  setNoteDateFormat: function() {
    // TODO
  },
  setPageLabels: function() {
    // TODO
  },
  setTheme: function() {
    // TODO
  },
  divider13: true,
  downloadPdf: function() {
    // TODO
  },
  focusNote: function() {
    // TODO
  },
  isMobileDevice: function() {
    // TODO
  },
  saveAnnotations: function() {
    // TODO
  },
  toggleFullScreen: function() {
    // TODO
  }
}