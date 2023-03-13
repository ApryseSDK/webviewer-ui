import React from 'react';
import PropTypes from 'prop-types';
import DataElementWrapper from 'components/DataElementWrapper';
import Icon from 'components/Icon';
import './NoteState.scss';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  openOnInitialLoad: PropTypes.bool,
  handleStateChange: PropTypes.func,
};
function NoteState(props) {
  const { annotation, handleStateChange = () => {} } = props;

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === 'Completed' ? 'green' : 'accepted'}`;

  const createOnStateOptionButtonClickHandler = state => {
    return () => {
      handleStateChange(state);
    };
  };

  const getStatusFromAnnotation = state => {
    if (state === 'Completed') {
      return 'Accepted';
    }
    return 'Completed';
  };

  return (
    <DataElementWrapper dataElement="notePopupState">
      <DataElementWrapper
        title="Mark as Completed"
        dataElement="notePopupStateCompleted"
        className="note-state-option"
        onClick={createOnStateOptionButtonClickHandler(getStatusFromAnnotation(annotation.getStatus()))}
      >
        <Icon backgroundNoneIcon={true} class glyph={icon} />
      </DataElementWrapper>
    </DataElementWrapper>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;
