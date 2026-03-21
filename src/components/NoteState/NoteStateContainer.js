import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import useCore from 'hooks/useCore';

import NoteState from './NoteState';
import { createStateAnnotation } from 'helpers/NoteStateUtils';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import useFocusOnClose from 'hooks/useFocusOnClose';

const propTypes = {
  annotation: PropTypes.object,
};

function NoteStateContainer(props) {
  const { core } = useCore();
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const isNoteStateDisabled = useSelector((state) => selectors.isElementDisabled(state, 'noteState'));

  const { annotation } = props;

  const handleStateChange = useFocusOnClose(useCallback(function handleStateChangeCallback(newValue) {
    const stateAnnotation = createStateAnnotation(annotation, newValue, activeDocumentViewerKey);
    annotation.addReply(stateAnnotation);
    const annotationManager = core.getAnnotationManager(activeDocumentViewerKey);
    annotationManager.addAnnotation(stateAnnotation);
  }, [annotation, activeDocumentViewerKey]));

  return (!isNoteStateDisabled &&
    <div>
      <NoteState handleStateChange={handleStateChange} {...props} />
    </div>
  );
}

NoteStateContainer.propTypes = propTypes;
export default NoteStateContainer;
