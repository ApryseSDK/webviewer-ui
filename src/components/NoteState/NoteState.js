import React from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import NoteStateFlyout from 'components/ModularComponents/NoteStateFlyout/NoteStateFlyout';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import DataElements from 'constants/dataElement';
import { spreadsheetNoteStateFlyoutItems } from 'constants/flyoutConstants';
import {
  SPREADSHEET_COMMENT_STATE_KEY,
  SPREADSHEET_THREAD_ID_KEY,
  SpreadsheetEditorEditMode,
} from 'constants/spreadsheetEditor';
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

  const isSpreadsheetComment = !!annotation.getCustomData(SPREADSHEET_THREAD_ID_KEY);
  const annotationState = isSpreadsheetComment
    ? annotation.getCustomData(SPREADSHEET_COMMENT_STATE_KEY) || ''
    : annotation.getStatus();
  const spreadsheetStateIcon = annotationState === 'resolved' ? 'completed' : 'none';
  const iconState = isSpreadsheetComment ? spreadsheetStateIcon : annotationState.toLowerCase();
  const icon = `icon-annotation-status-${iconState || 'none'}`;
  const id = flyoutId || annotation.Id;
  const statusList = useSelector(selectors.getStatusList);
  const spreadsheetEditorEditMode = useSelector(selectors.getSpreadsheetEditorEditMode);
  const flyoutItems = isSpreadsheetComment ? spreadsheetNoteStateFlyoutItems : undefined;
  const isStatusListEmpty = !isSpreadsheetComment && Array.isArray(statusList) && statusList.length === 0;
  const isSpreadsheetCommentStateDisabled = isSpreadsheetComment && spreadsheetEditorEditMode === SpreadsheetEditorEditMode.VIEW_ONLY;

  return (
    <>
      <ToggleElementButton
        dataElement={`noteState-${id}`}
        title={t('option.notesOrder.status')}
        img={icon}
        toggleElement={`${DataElements.NOTE_STATE_FLYOUT}-${id}`}
        disabled={isStatusListEmpty || isSpreadsheetCommentStateDisabled}
      />
      <NoteStateFlyout
        noteId={id}
        handleStateChange={handleStateChange}
        items={flyoutItems}
      />
    </>
  );
}

NoteState.propTypes = propTypes;

export default NoteState;