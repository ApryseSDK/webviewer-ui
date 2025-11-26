import React, { useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import { EditorModes } from 'helpers/hotkeysManager';
import { isMac } from 'helpers/device';
import EditKeyboardShortcutModal from './EditKeyboardShortcutModal';
import { SearchWrapper } from './SearchWrapper';
import useFocusHandler from 'hooks/useFocusHandler';
import PropTypes from 'prop-types';
import useKeyboardShortcuts from 'src/hooks/useKeyboardShortcuts';

import './KeyboardShortcutTab.scss';

const KeyboardShortcutTab = ({ editorMode = EditorModes.DEFAULT }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();
  const isViewOnly = useSelector(selectors.isViewOnly);

  const { keyboardShortcuts, shortcutKeyMap } = useKeyboardShortcuts(editorMode);
  const [currentShortcut, setCurrentShortcut] = useState(undefined);
  const isEditingDisabled = useMemo(() => {
    return editorMode !== EditorModes.DEFAULT || isViewOnly;
  }, [editorMode]);

  const getCommandStrings = (command) => {
    if (!command) {
      return [];
    }
    command = command.toUpperCase();
    if (command.includes(', COMMAND')) {
      const commands = command.split(', ');
      command = isMac ? commands[1] : commands[0];
    }
    return command.split(/(\+)/g);
  };

  const editShortcut = (shortcut) => {
    dispatch(actions.setIsElementHidden(DataElements.SETTINGS_MODAL, true));
    setCurrentShortcut(shortcut);
  };

  const finishEditing = () => {
    setCurrentShortcut(undefined);
    dispatch(actions.setIsElementHidden(DataElements.SETTINGS_MODAL, false));
  };

  const focusHandler = useFocusHandler((e) => {
    const shortcut = e.currentTarget.getAttribute('data-element').replace('edit-button-', '');
    editShortcut(shortcut);
  });

  return (
    <>
      <div className="shortcut-table-header">
        <div className="shortcut-table-header-command">{t('option.settings.command')}</div>
        <div className="shortcut-table-header-description">{t('option.settings.description')}</div>
        <div className="shortcut-table-header-action">{t('option.settings.action')}</div>
      </div>
      <div className="shortcut-table-content">
        {keyboardShortcuts.map(([command, description]) => (
          <SearchWrapper
            key={command}
            keywords={[t(description)]}
          >
            <div className="shortcut-table-item">
              <div className="shortcut-table-item-command">
                {getCommandStrings(shortcutKeyMap[command]).map((str, i) => (
                  <span key={i}>{str}</span>
                ))}
              </div>
              <div className="shortcut-table-item-description">
                {t(description)}
              </div>
              <Button
                dataElement={`edit-button-${command}`}
                img="icon-edit-form-field"
                title={t('action.edit')}
                ariaLabel={`${t(description)} ${t('action.edit')}`}
                onClick={focusHandler}
                disabled={isEditingDisabled}
              />
            </div>
          </SearchWrapper>
        ))}
      </div>
      {currentShortcut && (
        <EditKeyboardShortcutModal
          currentShortcut={currentShortcut}
          finishEditing={finishEditing}
          getCommandStrings={getCommandStrings}
        />
      )}
    </>
  );
};

KeyboardShortcutTab.propTypes = {
  editorMode: PropTypes.oneOf(Object.values(EditorModes))
};

export default KeyboardShortcutTab;