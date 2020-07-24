import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import defaultTool from 'constants/defaultTool';
import core from 'core';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import NoteTextarea from 'components/NoteTextarea';

import { Swipeable } from 'react-swipeable';

import './EditTextModal.scss';



const EditTextModal = () => {
  const [
    isDisabled,
    isOpen,
  ] = useSelector(state => [
    selectors.isElementDisabled(state, 'editTextModal'),
    selectors.isElementOpen(state, 'editTextModal'),
  ]);

  const [t] = useTranslation();
  const dispatch = useDispatch();

  const newTextInput = React.createRef();

  // todo: if user select multiple lines, we may need to change this to an array
  const [newText, setNewText] = useState("");

  const closeModal = () => {
    window.console.log('closeModal() executed');
    dispatch(actions.closeElement('editTextModal'));
    setNewText('');
    core.setToolMode(defaultTool);
  };


  useEffect(() => {
    if (isOpen) {
      //  prepopulate selected text
      setNewText(core.getSelectedText());
    }
  }, [isOpen]);



  const updateText = e => {
    e.preventDefault();
    window.console.log('updateText() executed');
    // update link
    closeModal();
  };




  const modalClass = classNames({
    Modal: true,
    EditTextModal: true,
    open: isOpen,
    closed: !isOpen,
  });


  const handleInputChange = e => {
    window.console.log('handleInputChange triggered', e.target.value);

    const value = e.target.value || '';
    // setNewText(value);
  };


  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="editTextModal"
        onMouseDown={closeModal}
      >
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <p>Enter the text you want to replaced</p>
          <input
            type="text"
            value={newText}
            onChange={e => {
              setNewText(e.target.value);
            }}

          />

          <Button
            dataElement="linkSubmitButton"
            label={t('action.save')}
            onClick={updateText}
          />
        </div>
      </div>
    </Swipeable>
  );
};

export default EditTextModal;
