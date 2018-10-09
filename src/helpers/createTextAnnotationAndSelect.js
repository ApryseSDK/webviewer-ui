import core from 'core';
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
  const createAnnotation = pageNumber => {
    const annotation = new annotationConstructor();
    
    annotation.PageNumber = pageNumber;
    annotation.Quads = quads[pageNumber - 1];
    annotation.Author = core.getCurrentUser();
    return annotation;
  };
  const setAnnotationDefaultColor = annotation => {
    const hexColor = 'ffe6ae';
    const rgba = hexColor.toUpperCase().match(/.{2}/g).map(c => parseInt(c, 16));
    annotation.StrokeColor = new window.Annotations.Color(rgba[0], rgba[1], rgba[2], rgba[3]);
  };
  
  Object.keys(quads).forEach(pageIndex => {
    const pageNumber = parseInt(pageIndex) + 1;
    const annotation = createAnnotation(pageNumber);
    
    if (annotationConstructor === window.Annotations.TextHighlightAnnotation) {
      setAnnotationDefaultColor(annotation);
    }
    if (window.Tools.TextAnnotationCreateTool.AUTO_SET_TEXT) {
      annotation.setContents(core.getSelectedText(pageNumber));
    }
    
    annotations.push(annotation);
  });

  return annotations;
};