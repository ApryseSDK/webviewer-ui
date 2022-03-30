import React from 'react';
import { useTranslation } from 'react-i18next';
import Icon from 'src/components/Icon';
import getLatestActivityDate from "helpers/getLatestActivityDate";
import dayjs from 'dayjs';
import Button from 'components/Button';
import './RedactionItem.scss';
import RedactionTextPreview from 'components/RedactionTextPreview';
import classNames from 'classnames';

export const redactionTypeMap = {
  REGION: 'region',
  TEXT: 'text',
  FULL_PAGE: 'fullPage',
  CREDIT_CARD: 'creditCard',
  PHONE: 'phone',
  IMAGE: 'image',
  EMAIL: 'email',
};

const mapAnnotationToRedactionType = (annotation) => {
  const isTextRedaction = annotation.IsText;
  if (isTextRedaction) {
    return redactionTypeMap['TEXT'];
  }

  const { type } = annotation;
  return type ? type : 'region';
};

const mapRedactionAnnotationToProperties = (annotation) => {
  const redactionType = mapAnnotationToRedactionType(annotation);
  switch (redactionType) {
    case redactionTypeMap['REGION']:
      return {
        redactionType,
        icon: 'icon-tool-redaction-area',
        name: 'redactionPanel.redactionItem.regionRedaction',
      };
    case redactionTypeMap['FULL_PAGE']:
      return {
        redactionType,
        icon: 'icon-header-page-manipulation-page-transition-page-by-page-line',
        name: 'redactionPanel.redactionItem.fullPageRedaction',
      };
    case redactionTypeMap['TEXT']:
      return {
        redactionType,
        icon: 'icon-form-field-text',
      };
    case redactionTypeMap['CREDIT_CARD']:
      return {
        redactionType,
        icon: 'redact-icons-credit-card',
      };
    case redactionTypeMap['PHONE']:
      return {
        redactionType,
        icon: 'redact-icons-phone-number',
      };
    case redactionTypeMap['IMAGE']:
      return {
        redactionType,
        icon: 'redact-icons-image',
        name: 'redactionPanel.redactionItem.image',
      };
    case redactionTypeMap['EMAIL']:
      return {
        redactionType,
        icon: 'redact-icons-email',
      };
  };
};

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
  } = props;
  const { t } = useTranslation();

  const date = getLatestActivityDate(annotation);
  const formattedDate = date ? dayjs(date).locale(language).format(dateFormat) : t('option.notesPanel.noteContent.noDate');
  const dateAndAuthor = `${author} - ${formattedDate}`;
  const className = classNames('redaction-item', { selected: isSelected });
  const { redactionType, name, icon } = mapRedactionAnnotationToProperties(annotation);

  let redactionPreview;
  if (redactionType === redactionTypeMap['TEXT']) {
    redactionPreview = (
      <RedactionTextPreview linesToBreak={2}>
        {textPreview}
      </RedactionTextPreview>)
  } else if (redactionType === redactionTypeMap['FULL_PAGE'] || redactionType === redactionTypeMap['REGION']) {
    redactionPreview = t(name);
  } else {
    redactionPreview = annotation.getContents();
  }

  const onKeyUp = (event) => {
    if (event.key === 'Enter') {
      onRedactionItemSelection();
    }
  }

  return (
    <div role="listitem" className={className} onClick={onRedactionItemSelection} onKeyUp={onKeyUp} tabIndex={0}>
      <div className='redaction-icon-container'>
        <Icon glyph={icon} color={iconColor} />
      </div>
      <div className="redaction-item-info">
        <div className="redaction-item-preview">
          {redactionPreview}
        </div>
        <div className='redaction-item-date-author'>
          {dateAndAuthor}
        </div>
      </div>
      <Button
        style={{ marginLeft: 'auto' }}
        img={"icon-close"}
        onClick={onRedactionItemDelete}
        ariaLabel={t('action.delete')}
      />
    </div>
  )
};

export default React.memo(RedactionItem);