import React from 'react';
import PropTypes from 'prop-types';
import core from 'core';

import NoteState from './NoteState';
import { createStateAnnotation } from 'helpers/NoteStateUtils';


const propTypes = {
  annotation: PropTypes.object,
};

function NoteStateContainer(props) {
  const { annotation } = props;

  const handleStateChange = React.useCallback(function handleStateChangeCallback(newValue) {
    const stateAnnotation = createStateAnnotation(annotation, newValue);
    annotation.addReply(stateAnnotation);
    const annotationManager = core.getAnnotationManager();
    annotationManager.addAnnotation(stateAnnotation);
    annotationManager.trigger('addReply', [stateAnnotation, annotation, annotationManager.getRootAnnotation(annotation)]);
  }, [annotation]);

  return (
    <div>
      <NoteState handleStateChange={handleStateChange} {...props} />
    </div>
  );
}

NoteStateContainer.propTypes = propTypes;
export default NoteStateContainer;
