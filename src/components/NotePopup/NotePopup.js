import React from 'react';
import PropTypes from 'prop-types';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useOnFocusOutside from 'hooks/useOnFocusOutside';
import useOverflowContainer from 'hooks/useOverflowContainer';
import DataElementWrapper from 'components/DataElementWrapper';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import selectors from 'selectors';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';

import './NotePopup.scss';
import Button from '../Button';
import { useSelector } from 'react-redux';

const propTypes = {
  handleEdit: PropTypes.func,
  handleDelete: PropTypes.func,
  closePopup: PropTypes.func,
  openPopup: PropTypes.func,
  isEditable: PropTypes.bool,
  isDeletable: PropTypes.bool,
  isOpen: PropTypes.bool,
  isReply: PropTypes.bool,
};

function noop() {}

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
  const customizableUI = useSelector(state => selectors.getFeatureFlags(state)?.customizableUI);

  const { popupMenuRef, location } = useOverflowContainer(isOpen, { container: '.normal-notes-container' });

  useOnClickOutside(popupRef, () => {
    closePopup();
  });

  useOnFocusOutside(popupRef, () => {
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

  const notePopupButtonClass = classNames('overflow note-popup-toggle-trigger', { active: isOpen });
  const optionsClass = classNames('options note-popup-options', {
    'options-reply': isReply,
    'modular-ui': customizableUI,
  });
  return (
    <DataElementWrapper className="NotePopup" dataElement="notePopup" ref={popupRef}>
      <Button
        title={t('formField.formFieldPopup.options')}
        dataElement="notePopupButtonClass"
        className={notePopupButtonClass}
        onClick={togglePopup}
        img="icon-tools-more"
        isActive={isOpen}
      />
      {isOpen && (
        <div className={`${optionsClass} ${location}`} ref={popupMenuRef}>
          {isEditable && (
            <DataElementWrapper
              tabIndex={0}
              type="button"
              role="button"
              className="option note-popup-option"
              dataElement="notePopupEdit"
              onClick={onEditButtonClick}
              // Needed because safari otherwise loses focus on the button
              // and the useOnFocusOutside hook triggers
              onMouseDown={e => e.preventDefault()}
              onMouseUp={e => e.preventDefault()}
            >
              {t('action.edit')}
            </DataElementWrapper>
          )}
          {isDeletable && (
            <DataElementWrapper
              tabIndex={0}
              type="button"
              role="button"
              className="option note-popup-option"
              dataElement="notePopupDelete"
              onClick={onDeleteButtonClick}
              // Needed because safari otherwise loses focus on the button
              // and the useOnFocusOutside hook triggers
              onMouseDown={e => e.preventDefault()}
              onMouseUp={e => e.preventDefault()}
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
