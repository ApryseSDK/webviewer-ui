import React, { useCallback } from 'react';
import RedactionSearchResults from './RedactionSearchResults';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import applyRedactions from 'helpers/applyRedactions';
import core from 'core';

const { ToolNames } = window.Core.Tools;

export const defaultRedactionStyles = {
  OverlayText: '',
  StrokeColor: new window.Core.Annotations.Color(255, 0, 0),
  TextColor: new window.Core.Annotations.Color(255, 0, 0, 1),
  Font: 'Helvetica',
};

export function createRedactionAnnotations(searchResults, activeToolStyles = defaultRedactionStyles) {
  const {
    StrokeColor,
    OverlayText,
    FillColor,
    Font = 'Helvetica',
    TextColor,
    FontSize,
    TextAlign,
  } = activeToolStyles;
  const redactionAnnotations = searchResults.map((result) => {
    const redaction = new window.Core.Annotations.RedactionAnnotation();
    redaction.PageNumber = result.page_num;
    redaction.Quads = result.quads.map((quad) => quad.getPoints());
    redaction.StrokeColor = StrokeColor;
    redaction.OverlayText = OverlayText;
    redaction.FillColor = FillColor;
    redaction.Font = Font;
    redaction.FontSize = FontSize;
    if (window.Core.Annotations.Utilities.calculateAutoFontSize) {
      redaction.FontSize = window.Core.Annotations.Utilities.calculateAutoFontSize(redaction);
    }
    redaction.TextColor = TextColor;
    redaction.TextAlign = TextAlign;
    redaction.setContents(result.result_str);
    redaction.type = result.type;
    redaction.Author = core.getCurrentUser();

    if (result.type === 'text') {
      redaction.setCustomData('trn-annot-preview', result.result_str);
    }

    redaction.setCustomData('trn-redaction-type', result.type);

    return redaction;
  });

  return redactionAnnotations;
}

function RedactionSearchResultsContainer(props) {
  const { onCancelSearch } = props;
  const dispatch = useDispatch();
  // activeToolStyles is an object so we do a shallowEqual to check equality
  const [activeToolStyles, activeToolName] = useSelector(
    (state) => [
      selectors.getActiveToolStyles(state),
      selectors.getActiveToolName(state)
    ], shallowEqual);

  const redactSelectedResults = (searchResults) => {
    const redactionAnnotations = createRedactionAnnotations(searchResults, defaultRedactionStyles);
    dispatch(applyRedactions(redactionAnnotations, onCancelSearch));
  };

  const markSelectedResultsForRedaction = useCallback((searchResults) => {
    const tool = core.getTool(ToolNames.REDACTION);
    const alternativeDefaultStyles = (tool && tool.defaults) ? tool.defaults : defaultRedactionStyles;
    const redactionStyles = activeToolName.includes('Redaction') ? activeToolStyles : alternativeDefaultStyles;
    const redactionAnnotations = createRedactionAnnotations(searchResults, redactionStyles);
    const annotationManager = core.getAnnotationManager();
    annotationManager.addAnnotations(redactionAnnotations);
  }, [activeToolStyles, activeToolName]);

  return (
    <RedactionSearchResults
      markSelectedResultsForRedaction={markSelectedResultsForRedaction}
      redactSelectedResults={redactSelectedResults}
      {...props}
    />);
}

export default RedactionSearchResultsContainer;