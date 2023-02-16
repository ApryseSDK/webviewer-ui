import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import Button from 'components/Button';
import hotkeys from 'hotkeys-js';
import hotkeysManager, { defaultHotkeysScope } from 'helpers/hotkeysManager';

import './EditKeyboardShortcutModal.scss';

const editShortcutHotkeysScope = 'editShortcut';

const EditKeyboardShortcutModal = ({ currentShortcut, finishEditing, getCommandStrings }) => {
  const [t] = useTranslation();

  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);

  const [currentCommand, setCurrentCommand] = useState('');

  useEffect(() => {
    setCurrentCommand(shortcutKeyMap[currentShortcut]);
  }, [currentShortcut, shortcutKeyMap]);

  useEffect(() => {
    const keyHandler = (e) => {
      e.preventDefault();

      const keyCodes = hotkeys.getPressedKeyCodes();
      const keyString = hotkeys.getPressedKeyString();
      const keyNames = keyCodes.map((keyCode, i) => {
        switch (keyCode) {
          case 16:
            return 'shift';
          case 17:
            return 'ctrl';
          case 18:
            return 'alt';
          case 91:
            return 'command';
          default:
            return keyString[i];
        }
      });
      setCurrentCommand(keyNames.join('+').toLowerCase());
    };

    hotkeys('*', editShortcutHotkeysScope, keyHandler);
    hotkeys.setScope(editShortcutHotkeysScope);

    return () => {
      hotkeys.unbind('*', editShortcutHotkeysScope, keyHandler);
      hotkeys.setScope(defaultHotkeysScope);
    };
  }, []);

  const setShortcut = () => {
    hotkeys.setScope(defaultHotkeysScope);
    hotkeysManager.setShortcutKey(currentShortcut, currentCommand);
    finishEditing();
  };

  const hasConflict = hotkeysManager.hasConflict(currentShortcut, currentCommand);

  const renderCurrentKeys = () => getCommandStrings(currentCommand).map((key, i) => (
    <span key={i}>{key}</span>
  ));

  return (
    <div className="Modal EditKeyboardShortcutModal open">
      <div className="container" onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <div>{t('option.settings.editKeyboardShorcut')}</div>
          <Button
            img="icon-close"
            onClick={finishEditing}
            title="action.close"
          />
        </div>
        <div className="divider"></div>
        <div className="body">
          <div className="press-key-note">{t('option.settings.pressKeyToSet')}</div>
          <div className="keyboard-shortcut">{renderCurrentKeys()}</div>
          {hasConflict && (<div className="conflict-warning">{t('option.settings.shortcutAlreadyExists')}</div>)}
        </div>
        <div className="divider"></div>
        <div className="footer">
          <Button
            className="modal-button confirm"
            label={t('option.settings.setShorcut')}
            disabled={hasConflict}
            onClick={setShortcut}
          />
        </div>
      </div>
    </div>
  );
};

export default EditKeyboardShortcutModal;
