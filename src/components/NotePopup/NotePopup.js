import React from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import DataElementWrapper from 'components/DataElementWrapper';
import { useTranslation } from 'react-i18next';

import Icon from 'components/Icon';

import './NotePopup.scss';

const propTypes = {
  annotation: PropTypes.object,
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  closePopup: PropTypes.func,
  openPopup: PropTypes.func,
  isEditable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  isOpen: PropTypes.bool,
};

function noop() {}

function NotePopup(props) {
  const {
    annotation,
    handleEdit = noop,
    handleDelete = noop,
    closePopup = noop,
    openPopup = noop,
    isEditable,
    isDeletable,
    isOpen,
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
      openPopup(annotation?.Id);
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

  return (
    <DataElementWrapper
      className="NotePopup"
      dataElement="notePopup"
    >
      <div className="overflow note-popup-toggle-trigger" onClick={togglePopup}>
        <Icon glyph="icon-tools-more" />
      </div>
      {isOpen && (
        <div ref={popupRef} className="options note-popup-options">
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
