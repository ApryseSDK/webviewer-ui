import React, { useCallback } from 'react';
import RedactionSearchResults from './RedactionSearchResults';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import selectors from 'selectors'
import applyRedactions from 'helpers/applyRedactions';
import core from 'core';

function createRedactionAnnotations(searchResults, activeToolStyles) {
  const { StrokeColor, OverlayText } = activeToolStyles
  const redactionAnnotations = searchResults.map(result => {
    const redaction = new Annotations.RedactionAnnotation();
    redaction.PageNumber = result.page_num;
    redaction.Quads = result.quads.map((quad) => quad.getPoints());
    redaction.StrokeColor = StrokeColor;
    redaction.OverlayText = OverlayText;
    redaction.setContents(result.result_str);
    redaction.type = result.type;
    redaction.Author = core.getCurrentUser();

    if (result.type === 'text') {
      redaction.setCustomData('trn-annot-preview', result.result_str);
    }

    redaction.setCustomData('trn-redaction-type', result.type)

    return redaction;
  })

  return redactionAnnotations;
}

const defaultRedactionStyles = { OverlayText: '', StrokeColor: new Annotations.Color(255, 0, 0) };

function RedactionSearchResultsContainer(props) {
  const { onCancelSearch } = props;
  const dispatch = useDispatch();
  // activeToolStyles is an object so we do a shallowEqual to check equality 
  const [activeToolStyles, activeToolName] = useSelector(
    state => [
      selectors.getActiveToolStyles(state),
      selectors.getActiveToolName(state)
    ], shallowEqual);

  const redactSelectedResults = (searchResults) => {
    const redactionAnnotations = createRedactionAnnotations(searchResults, defaultRedactionStyles);
    dispatch(applyRedactions(redactionAnnotations, onCancelSearch));
  };

  const markSelectedResultsForRedaction = useCallback((searchResults) => {
    const redactionStyles = activeToolName.includes('Redaction') ? activeToolStyles : defaultRedactionStyles;
    const redactionAnnotations = createRedactionAnnotations(searchResults, redactionStyles);
    const annotationManager = core.getAnnotationManager();
    annotationManager.addAnnotations(redactionAnnotations);
  }, [activeToolStyles, activeToolName]);

  return (
    <RedactionSearchResults
      markSelectedResultsForRedaction={markSelectedResultsForRedaction}
      redactSelectedResults={redactSelectedResults}
      {...props} />);
};

export default RedactionSearchResultsContainer;