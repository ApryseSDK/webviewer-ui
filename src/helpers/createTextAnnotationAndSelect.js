import core from 'core';
import getToolStyles from 'helpers/getToolStyles';
import { mapAnnotationToToolName } from 'constants/map';
import actions from 'actions';

export default (dispatch, annotationConstructor) => {
  const annotations = createTextAnnotation(annotationConstructor);

  core.clearSelection();
  core.addAnnotations(annotations);
  core.selectAnnotations(annotations);
  dispatch(actions.closeElement('textPopup'));
};


const createTextAnnotation = (annotationConstructor, activeDocumentViewerKey = 1) => {
  const annotations = [];
  const quads = core.getSelectedTextQuads();

  Object.keys(quads).forEach((pageNumber) => {
    pageNumber = parseInt(pageNumber, 10);
    const annotation = createAnnotation(annotationConstructor, pageNumber, quads);

    if (window.Core.Tools.TextAnnotationCreateTool.AUTO_SET_TEXT && !(annotation instanceof window.Annotations.RedactionAnnotation)) {
      annotation.setContents(core.getSelectedText(activeDocumentViewerKey));
    }

    annotation.setCustomData('trn-annot-preview', core.getSelectedText(activeDocumentViewerKey));

    if (annotation instanceof window.Annotations.RedactionAnnotation) {
      setRedactionStyle(annotation);
      annotation.IsText = true;
    }

    setAnnotationStyle(annotation);

    annotations.push(annotation);
  });

  return annotations;
};

const createAnnotation = (annotationConstructor, pageNumber, quads) => {
  const annotation = new annotationConstructor();

  annotation.PageNumber = pageNumber;
  annotation.Quads = quads[pageNumber];
  annotation.Author = core.getCurrentUser();
  return annotation;
};

const setAnnotationStyle = (annotation) => {
  const toolName = mapAnnotationToToolName(annotation);

  if (toolName) {
    const newStyles = getToolStyles(toolName);
    Object.keys(newStyles).forEach((property) => {
      annotation[property] = newStyles[property];
    });
  }
};

const setRedactionStyle = (annotation) => {
  const { AnnotationCreateRedaction: { defaults: style = {} } } = core.getToolModeMap();

  if (style) {
    if (style.StrokeColor) {
      const color = style.StrokeColor;
      annotation.StrokeColor = new window.Annotations.Color(color['R'], color['G'], color['B'], color['A']);
    }
    if (style.StrokeThickness) {
      annotation.StrokeThickness = style['StrokeThickness'];
    }
    if (style.FillColor) {
      const fillColor = style.FillColor;
      annotation.FillColor = new window.Annotations.Color(fillColor['R'], fillColor['G'], fillColor['B'], fillColor['A']);
    }
  }
};