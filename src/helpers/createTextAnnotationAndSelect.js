import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import { mapAnnotationToToolName } from 'constants/map';
import actions from 'actions';

export default (dispatch, annotationConstructor) =>  {
  const annotations = createTextAnnotation(annotationConstructor);

  core.clearSelection();    
  core.addAnnotations(annotations);
  core.selectAnnotations(annotations);
  dispatch(actions.closeElement('textPopup'));
};


const createTextAnnotation = annotationConstructor => {
  const annotations = [];
  const quads = core.getSelectedTextQuads();
  
  Object.keys(quads).forEach(pageIndex => {
    const pageNumber = parseInt(pageIndex) + 1;
    const annotation = createAnnotation(annotationConstructor, pageNumber, quads);
    
    if (window.Tools.TextAnnotationCreateTool.AUTO_SET_TEXT) {
      annotation.setContents(core.getSelectedText(pageNumber));
    }
    setAnnotationColor(annotation);
    
    annotations.push(annotation);
  });

  return annotations;
};

const createAnnotation = (annotationConstructor, pageNumber, quads) => {
  const annotation = new annotationConstructor();
  
  annotation.PageNumber = pageNumber;
  annotation.Quads = quads[pageNumber - 1];
  annotation.Author = core.getCurrentUser();
  return annotation;
};

const setAnnotationColor = annotation => {
  const toolName = mapAnnotationToToolName(annotation);
  
  if (toolName) {
    const { StrokeColor } = getToolStyles(toolName);
    annotation.StrokeColor = StrokeColor;
  }
};