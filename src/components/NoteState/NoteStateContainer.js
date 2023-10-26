import React from 'react';
import PropTypes from 'prop-types';
import core from 'core';

import NoteState from './NoteState';
import { createStateAnnotation } from 'helpers/NoteStateUtils';
import { useSelector } from 'react-redux';
import selectors from 'selectors';


const propTypes = {
  annotation: PropTypes.object,
};

function NoteStateContainer(props) {
  const [
    activeDocumentViewerKey,
  ] = useSelector((state) => [
    selectors.getActiveDocumentViewerKey(state),
  ]);
  const { annotation } = props;

  const handleStateChange = React.useCallback(function handleStateChangeCallback(newValue) {
    const stateAnnotation = createStateAnnotation(annotation, newValue, activeDocumentViewerKey);
    annotation.addReply(stateAnnotation);
    const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
    annotationManager.addAnnotation(stateAnnotation);
    annotationManager.trigger('addReply', [stateAnnotation, annotation, annotationManager.getRootAnnotation(annotation)]);
  }, [annotation, activeDocumentViewerKey]);

  return (
    <div>
      <NoteState handleStateChange={handleStateChange} {...props} />
    </div>
  );
}

NoteStateContainer.propTypes = propTypes;
export default NoteStateContainer;
