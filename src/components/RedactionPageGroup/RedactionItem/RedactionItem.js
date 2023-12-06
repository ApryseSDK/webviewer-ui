import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'src/components/Icon';
import getLatestActivityDate from 'helpers/getLatestActivityDate';
import dayjs from 'dayjs';
import Button from 'components/Button';
import './RedactionItem.scss';
import RedactionTextPreview from 'components/RedactionTextPreview';
import classNames from 'classnames';
import { redactionTypeMap } from 'constants/redactionTypes';

const RedactionItem = (props) => {
  const {
    iconColor,
    annotation,
    author,
    dateFormat,
    language,
    onRedactionItemDelete,
    onRedactionItemSelection,
    textPreview,
    isSelected,
    timezone,
  } = props;
  const { t } = useTranslation();

  let date = getLatestActivityDate(annotation);

  if (timezone) {
    const datetimeStr = date.toLocaleString('en-US', { timeZone: timezone });
    date = new Date(datetimeStr);
  }

  const formattedDate = date ? dayjs(date).locale(language).format(dateFormat) : t('option.notesPanel.noteContent.noDate');
  const dateAndAuthor = `${author} - ${formattedDate}`;
  const className = classNames('redaction-item', { 'redaction-item-selected': isSelected });
  const {
    label,
    icon = 'icon-form-field-text', // Default icon if none provided
    redactionType
  } = annotation;

  let redactionPreview;

  if (redactionType === redactionTypeMap['TEXT']) {
    redactionPreview = (
      <RedactionTextPreview linesToBreak={2}>
        {textPreview}
      </RedactionTextPreview>);
  } else if (
    redactionType === redactionTypeMap['FULL_PAGE']
    || redactionType === redactionTypeMap['FULL_VIDEO_FRAME']
    || redactionType === redactionTypeMap['REGION']
    || redactionType === redactionTypeMap['AUDIO_REDACTION']
    || redactionType === redactionTypeMap['FULL_VIDEO_FRAME_AND_AUDIO']
  ) {
    redactionPreview = t(label);
  } else {
    redactionPreview = annotation.getContents();
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      onRedactionItemSelection();
    }
  };

  return (
    <div role="listitem" className={className} onClick={onRedactionItemSelection} onKeyUp={onKeyUp} tabIndex={0}>
      <div className="redaction-icon-container">
        <Icon glyph={icon} color={iconColor} />
      </div>
      <div className="redaction-item-info">
        <div className="redaction-item-preview">
          {redactionPreview}
        </div>
        {
          annotation.OverlayText ?
            <div className="redaction-item-label-text">
              {t('option.stylePopup.labelText')}: {annotation.OverlayText}
            </div> : null
        }
        <div className="redaction-item-date-author">
          {dateAndAuthor}
        </div>
      </div>
      <Button
        style={{ marginLeft: 'auto' }}
        img={'icon-close'}
        onClick={onRedactionItemDelete}
        ariaLabel={t('action.delete')}
      />
    </div>
  );
};

export default React.memo(RedactionItem);