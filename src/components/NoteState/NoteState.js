import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import NoteStateFlyout from 'components/ModularComponents/NoteStateFlyout';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';

const propTypes = {
  annotation: PropTypes.object.isRequired,
  handleStateChange: PropTypes.func,
  flyoutId: PropTypes.string,
};

function NoteState(props) {
  const {
    annotation,
    handleStateChange = () => { },
    flyoutId,
  } = props;

  const [t] = useTranslation();

  const annotationState = annotation.getStatus();
  const icon = `icon-annotation-status-${annotationState === '' ? 'none' : annotationState.toLowerCase()}`;
  const id = flyoutId || annotation.Id;
  const statusList = useSelector(selectors.getStatusList);
  const isStatusListEmpty = Array.isArray(statusList) && statusList.length === 0;

  return (
    <>
      <ToggleElementButton
        dataElement={`noteState-${id}`}
        title={t('option.notesOrder.status')}
        img={icon}
        toggleElement={`${DataElements.NOTE_STATE_FLYOUT}-${id}`}
        disabled={isStatusListEmpty}
      />
      <NoteStateFlyout
        noteId={id}
        handleStateChange={handleStateChange}
      />
    </>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;