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

    if (window.Tools.TextAnnotationCreateTool.AUTO_SET_TEXT && !(annotation instanceof Annotations.RedactionAnnotation)) {
      annotation.setContents(core.getSelectedText(pageNumber));
    }

    if (annotation instanceof Annotations.RedactionAnnotation) {
      setRedactionStyle(annotation);
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

const setRedactionStyle = annotation => {
  const { AnnotationCreateRedaction: { defaults: style = {} } } = readerControl.docViewer.getToolModeMap();

  if (style) {
    if (style.StrokeColor) {
      const color = style.StrokeColor;
      annotation.StrokeColor = new Annotations.Color(color['R'], color['G'], color['B'], color['A']);
    }
    if ( style.StrokeThickness) {
      annotation.StrokeThickness = style['StrokeThickness'];
    }
    if (style.FillColor) {
      const fillColor = style.FillColor;
      annotation.FillColor = new Annotations.Color(fillColor['R'], fillColor['G'], fillColor['B'], fillColor['A']);
    }
  }
}