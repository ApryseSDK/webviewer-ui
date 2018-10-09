import core from 'core';

const setupDocViewer = () => {  
  const docViewer = core.getDocumentViewer();

  // at 100% zoom level, adjust this whenever zoom/fitmode is updated
  docViewer.DEFAULT_MARGIN = 10; 
  addToolsToDocViewer(docViewer);
};

const addToolsToDocViewer = docViewer => {
  const toolModeMap =  core.getToolModeMap();

  toolModeMap.AnnotationCreateTextHighlight2 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight2');
  toolModeMap.AnnotationCreateTextHighlight3 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight3');
  toolModeMap.AnnotationCreateTextHighlight4 = new window.Tools.TextHighlightCreateTool(docViewer, 'AnnotationCreateTextHighlight4');
  toolModeMap.AnnotationCreateFreeHand2 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand2');
  toolModeMap.AnnotationCreateFreeHand3 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand3');
  toolModeMap.AnnotationCreateFreeHand4 = new window.Tools.FreeHandCreateTool(docViewer, 'AnnotationCreateFreeHand4');
};

export default setupDocViewer;