import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Button from 'components/Button';
import hotkeys from 'hotkeys-js';
import hotkeysManager, { defaultHotkeysScope } from 'helpers/hotkeysManager';
import ModalWrapper from '../ModalWrapper';
import getRootNode from 'helpers/getRootNode';
import classNames from 'classnames';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './EditKeyboardShortcutModal.scss';

const editShortcutHotkeysScope = 'editShortcut';

const EditKeyboardShortcutModal = ({ currentShortcut, finishEditing, getCommandStrings }) => {
  const [t] = useTranslation();
  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);

  const [currentCommand, setCurrentCommand] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [pressedKeys, setPressedKeys] = useState(new Set());
  const [activatedByKeyboard, setActivatedByKeyboard] = useState(false);

  useEffect(() => {
    setCurrentCommand(shortcutKeyMap[currentShortcut]);
  }, [currentShortcut, shortcutKeyMap]);

  useEffect(() => {
    if (!isRecording) {
      return;
    }

    const keyDownHandler = (e) => {
      e.preventDefault();
      const keyName = getKeyString(e);
      setPressedKeys((prevKeys) => new Set([...prevKeys, keyName]));
    };

    const keyUpHandler = () => {
      if (pressedKeys.size > 0) {
        const formattedCommand = Array.from(pressedKeys).join('+').toLowerCase();
        setCurrentCommand(formattedCommand);
      }
      setPressedKeys(new Set());
      setIsRecording(false);

      // Only focus the button if it was activated via the keyboard
      if (activatedByKeyboard) {
        const editButton = getRootNode().querySelector('[data-element="EditKeyboardShortcutModalEditButton"]');
        if (editButton) {
          editButton.focus();
        }
      }
    };

    window.addEventListener('keydown', keyDownHandler);
    window.addEventListener('keyup', keyUpHandler);

    hotkeys.setScope(editShortcutHotkeysScope);

    return () => {
      window.removeEventListener('keydown', keyDownHandler);
      window.removeEventListener('keyup', keyUpHandler);
      hotkeys.setScope(defaultHotkeysScope);
    };
  }, [isRecording, pressedKeys, activatedByKeyboard]);

  const startRecording = (e) => {
    setPressedKeys(new Set());

    // If this was triggered by a mouse click (event.detail > 0), start recording immediately
    if (e.detail > 0) {
      setIsRecording(true);
      setActivatedByKeyboard(false); // Activated by mouse, so no focus after recording
    } else {
      // Otherwise, it was a keyboard event, wait for key release before recording
      setActivatedByKeyboard(true); // Activated by keyboard, so focus after recording

      const keyReleaseHandler = () => {
        setIsRecording(true);
        window.removeEventListener('keyup', keyReleaseHandler);
      };

      window.addEventListener('keyup', keyReleaseHandler);
    }
  };

  const onCloseHandler = useFocusOnClose(finishEditing);

  const setShortcut = () => {
    hotkeys.setScope(defaultHotkeysScope);
    hotkeysManager.setShortcutKey(currentShortcut, currentCommand);
    onCloseHandler();
  };

  const getKeyString = (e) => {
    switch (e.keyCode) {
      case 16:
        return 'shift';
      case 17:
        return 'ctrl';
      case 18:
        return 'alt';
      case 91:
      case 93:
        return 'command';
      default: {
        const keyString = hotkeys.getPressedKeyString();
        const index = hotkeys.getPressedKeyCodes().indexOf(e.keyCode);
        return keyString[index];
      }
    }
  };

  const hasConflict = hotkeysManager.hasConflict(currentShortcut, currentCommand);

  const renderCurrentKeys = () => getCommandStrings(currentCommand).map((key, i) => (
    <span key={i}>{key}</span>
  ));

  return (
    <div className="Modal EditKeyboardShortcutModal open">
      <ModalWrapper isOpen={true} title='option.settings.editKeyboardShorcut' onCloseClick={finishEditing}>
        <div className="body">
          <div className={classNames({
            'keyboard-shortcut': true,
            'recording': isRecording && activatedByKeyboard,
          })}>{renderCurrentKeys()}</div>
          {hasConflict && (<div className="conflict-warning">{t('option.settings.shortcutAlreadyExists')}</div>)}
        </div>
        <div className="divider"></div>
        <div className="footer">
          <Button
            className="modal-button secondary-btn-custom"
            label={t('option.settings.editShortcut')}
            disabled={isRecording}
            onClick={startRecording}
            dataElement='EditKeyboardShortcutModalEditButton'
          />
          <Button
            className="modal-button confirm"
            label={t('option.settings.setShortcut')}
            disabled={isRecording || hasConflict}
            onClick={setShortcut}
            dataElement='EditKeyboardShortcutModalSetButton'
          />
        </div>
      </ModalWrapper>
    </div>
  );
};

export default EditKeyboardShortcutModal;
