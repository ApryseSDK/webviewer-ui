import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import React, { forwardRef } from 'react';

import ShareTypes from 'constants/shareTypes';
import DataElementWrapper from 'components/DataElementWrapper';
import ShareTypeIcon from '../NoteShareType/ShareTypeIcon';

import './NoteShareType.scss';

const propTypes = {
  onClose: PropTypes.func,
  onSelect: PropTypes.func,
  positionStyle: PropTypes.object,
  selectedShareType: PropTypes.string,
};

const NoteShareTypeDialog = forwardRef(({ onClose, onSelect, positionStyle, selectedShareType }, dialogRef) => {
  const [t] = useTranslation();

  const preventAutoClose = (e) => e.stopPropagation();

  return (
    <dialog
      ref={dialogRef}
      style={positionStyle}
      className={classNames('note-share-type-dialog')}
      onKeyDown={(e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      }}
    >
      <div className="note-share-type-popup" onClick={preventAutoClose}>
        <DataElementWrapper
          tabbable
          dataElement="notePopupStateAssessor"
          type="button"
          className={classNames('note-sharetype-option', { selected: selectedShareType === ShareTypes.ASSESSORS })}
          onClick={() => onSelect(ShareTypes.ASSESSORS)}
        >
          <ShareTypeIcon shareType={ShareTypes.ASSESSORS} />
          {t('option.state.assessors')}
        </DataElementWrapper>

        <DataElementWrapper
          tabbable
          dataElement="notePopupStateParticipants"
          type="button"
          className={classNames('note-sharetype-option', { selected: selectedShareType === ShareTypes.PARTICIPANTS })}
          onClick={() => onSelect(ShareTypes.PARTICIPANTS)}
        >
          <ShareTypeIcon shareType={ShareTypes.PARTICIPANTS} />
          {t('option.state.participants')}
        </DataElementWrapper>

        <DataElementWrapper
          tabbable
          dataElement="notePopupStateAll"
          type="button"
          className={classNames('note-sharetype-option', { selected: selectedShareType === ShareTypes.ALL })}
          onClick={() => onSelect(ShareTypes.ALL)}
        >
          <ShareTypeIcon shareType={ShareTypes.ALL} />
          {t('option.state.all')}
        </DataElementWrapper>

        <DataElementWrapper
          tabbable
          dataElement="notePopupStateAssessors"
          type="button"
          className={classNames('note-sharetype-option', { selected: selectedShareType === ShareTypes.NONE })}
          onClick={() => onSelect(ShareTypes.NONE)}
        >
          <ShareTypeIcon shareType={ShareTypes.NONE} />
          {t('option.state.none')}
        </DataElementWrapper>
      </div>
    </dialog>
  );
});

NoteShareTypeDialog.displayName = 'NoteShareTypeDialog';
NoteShareTypeDialog.propTypes = propTypes;

export default NoteShareTypeDialog;