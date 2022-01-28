import React from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import DataElementWrapper from 'components/DataElementWrapper';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import Icon from 'components/Icon';
import './NotePopup.scss';

const propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  closePopup: PropTypes.func,
  openPopup: PropTypes.func,
  isEditable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  isOpen: PropTypes.bool,
};

function noop() { }

function NotePopup(props) {
  const {
    handleEdit = noop,
    handleDelete = noop,
    closePopup = noop,
    openPopup = noop,
    isEditable,
    isDeletable,
    isOpen,
    isReply,
  } = props;

  const [t] = useTranslation();
  const popupRef = React.useRef();

  useOnClickOutside(popupRef, () => {
    closePopup();
  });

  const togglePopup = e => {
    e.stopPropagation();
    if (isOpen) {
      closePopup();
    } else {
      openPopup();
    }
  };

  function onEditButtonClick(e) {
    e.stopPropagation();
    closePopup();
    handleEdit();
  }

  function onDeleteButtonClick() {
    closePopup();
    handleDelete();
  }

  if (!isEditable && !isDeletable) {
    return null;
  }

  const notePopupButtonClass = classNames('overflow note-popup-toggle-trigger', { active: isOpen })
  const optionsClass = classNames('options note-popup-options', { 'options-reply': isReply })
  return (
    <DataElementWrapper
      className="NotePopup"
      dataElement="notePopup"
      ref={popupRef}
    >
      <div className={notePopupButtonClass} onClick={togglePopup}>
        <Icon glyph="icon-tools-more" />
      </div>
      {isOpen && (
        <div className={optionsClass}>
          {isEditable && (
            <DataElementWrapper
              type="button"
              className="option note-popup-option"
              dataElement="notePopupEdit"
              onClick={onEditButtonClick}
            >
              {t('action.edit')}
            </DataElementWrapper>
          )}
          {isDeletable && (
            <DataElementWrapper
              type="button"
              className="option note-popup-option"
              dataElement="notePopupDelete"
              onClick={onDeleteButtonClick}
            >
              {t('action.delete')}
            </DataElementWrapper>
          )}
        </div>
      )}
    </DataElementWrapper>
  );
}

NotePopup.propTypes = propTypes;

export default NotePopup;
