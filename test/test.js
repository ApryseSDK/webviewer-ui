import constants from './constants';

import './test.css';

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
var Tools

viewerElement.addEventListener('ready', function() {
  viewerInstance = viewer.getInstance();
  var missingApis = [];
  Object.keys(viewerInstance).forEach(function(key) {
    if (typeof viewerInstance[key] === 'function' && !apis[key] && constants.whitelist.indexOf(key) < 0) {
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
  closeElement: function() {
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
    viewerInstance.disableAnnotations();
  },
  enableAnnotations: function() {
    viewerInstance.enableAnnotations();
  },
  disableDownload: function() {
    viewerInstance.disableDownload();
  },  
  enableDownload: function() {
    viewerInstance.enableDownload();
  },  
  enableFilePicker: function() {
    viewerInstance.enableFilePicker();
  },
  disableFilePicker: function() {
    viewerInstance.disableFilePicker();
  },
  disableNotesPanel: function() {
    viewerInstance.disableNotesPanel();
  },
  enableNotesPanel: function() {
    viewerInstance.enableNotesPanel();
  },
  disablePrint: function() {
    viewerInstance.disablePrint();
  },
  enablePrint: function() {
    viewerInstance.enablePrint();
  },
  useEmbeddedPrint: function() {
    viewerInstance.useEmbeddedPrint(false);
  },
  disableTextSelection: function() {
    viewerInstance.disableTextSelection();
  },
  enableTextSelection: function() {
    viewerInstance.enableTextSelection();
  },
  divider7: true,
  setAnnotationUser: function() {
    viewerInstance.setAnnotationUser('PDFTron');
  },
  getAnnotationUser: function() {
    console.log('Current annotation user: ', viewerInstance.getAnnotationUser());
  },
  setAdminUser: function() {
    viewerInstance.setAdminUser(true);
  },
  isAdminUser: function() {
    console.log('Is user admin: ', viewerInstance.isAdminUser());
  },
  setReadOnly: function() {
    viewerInstance.setReadOnly(true);
  },
  isReadOnly: function() {
    console.log('Is read only: ', viewerInstance.isReadOnly());
  },
  divider8: true,
  getCurrentPageNumber: function() {
    console.log('Current page number: ', viewerInstance.getCurrentPageNumber());
  },
  setCurrentPageNumber: function() {
    viewerInstance.setCurrentPageNumber(2);
  },
  getPageCount: function() {
    console.log('Total pages: ', viewerInstance.getPageCount());
  },
  goToNextPage: function() {
    viewerInstance.goToNextPage();
  },
  goToPrevPage: function() {
    viewerInstance.goToPrevPage();
  },
  goToLastPage: function() {
    viewerInstance.goToLastPage();
  },
  goToFirstPage: function() {
    viewerInstance.goToFirstPage();
  },
  divider9: true,
  getFitMode: function() {
    console.log('Current fit mode: ', viewerInstance.getFitMode());
  },
  setFitMode: function() {
    viewerInstance.setFitMode(viewerInstance.FitMode.FitWidth);
  },
  getLayoutMode: function() {
    console.log('Current layout mode: ', viewerInstance.getLayoutMode());
  },
  setLayoutMode: function() {
    viewerInstance.setLayoutMode(viewerInstance.LayoutMode.Single);
  },
  getZoomLevel: function() {
    console.log('Current zoom level: ', viewerInstance.getZoomLevel());
  },
  setZoomLevel: function() {
    viewerInstance.setZoomLevel('160%');
  },
  rotateClockwise: function() {
    viewerInstance.rotateClockwise();
  },
  rotateCounterClockwise: function() {
    viewerInstance.rotateCounterClockwise();
  },
  divider10: true,
  getToolMode: function() {
    console.log('Current tool mode: ', viewerInstance.getToolMode());
  },
  setToolMode: function() {
    viewerInstance.setToolMode('AnnotationCreateRectangle');
  },
  registerTool: function() {
    var contentWindow = document.querySelector('iframe').contentWindow;
    var MyTool = function() {
      contentWindow.Tools.StickyCreateTool.call(this, viewerInstance.docViewer, contentWindow.Annotations.StickyAnnotation);
    };
    MyTool.prototype = new contentWindow.Tools.StickyCreateTool();
    viewerInstance.registerTool({
      toolName: 'MyTool',
      toolObject: new MyTool(),
      buttonImage: 'ic_annotation_sticky_note_black_24px',
      buttonName: 'myToolButton',
      buttonGroup: 'miscTools',
      tooltip: 'MyTool'
    });
    viewerInstance.setToolMode('MyTool');
  },
  unregisterTool: function() {
    viewerInstance.unregisterTool('MyTool');
  },
  updateTool: function() {
    viewerInstance.updateTool('AnnotationCreateRectangle', {
      buttonGroup: 'miscTools'
    });
  },
  divider12: true,  
  setActiveHeaderGroup: function() {
    viewerInstance.setActiveHeaderGroup('tools');
  },
  setActiveLeftPanel: function() {
    viewerInstance.setActiveLeftPanel('thumbnailsPanel');
  },  
  setCustomPanel: function() {
    viewerInstance.setCustomPanel({
      tab:{
        dataElement: 'customPanelTab',
        title: 'customPanelTab',
        img: 'https://pbs.twimg.com/profile_images/927446347879292930/Fi0D7FGJ_400x400.jpg',
      },
      panel: {
        dataElement: 'customPanel',
        render: function() {
          const div = document.createElement('div');
          div.innerHTML = 'Hello World';
          return div;
        }
      }
    });
  },
  setHeaderItems: function() {
    viewerInstance.setHeaderItems(function(header) {
      header.push({
        type: 'actionButton',
        label: 'HO',
        onClick: function() {
          console.log('HO');
        }
      })
    });
  },
  setLanguage: function() {
    viewerInstance.setLanguage('fr');
  },
  setNoteDateFormat: function() {
    viewerInstance.setNoteDateFormat('DD.MM.YYYY HH:MM');
  },
  setPageLabels: function() {
    viewerInstance.setPageLabels([ 'i', 'ii', 'iii' ]);
  },
  setTheme: function() {
    viewerInstance.setTheme('dark');
  },
  divider13: true,
  downloadPdf: function() {
    viewerInstance.downloadPdf();
  },
  focusNote: function() {
    var annotationId = viewerInstance.docViewer.getAnnotationManager().getAnnotationsList()[0].Id;
    viewerInstance.focusNote(annotationId);
  },
  isMobileDevice: function() {
    console.log('isMobileDevice: ' + !!viewerInstance.isMobileDevice());
  },
  toggleFullScreen: function() {
    viewerInstance.toggleFullScreen();
  }
}