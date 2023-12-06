import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import { Shortcuts } from 'helpers/hotkeysManager';
import { isMac } from 'helpers/device';
import EditKeyboardShortcutModal from './EditKeyboardShortcutModal';
import { SearchWrapper } from './SearchWrapper';

import './KeyboardShortcutTab.scss';

const keyboardShortcuts = [
  [Shortcuts.ROTATE_CLOCKWISE, 'option.settings.rotateDocumentClockwise'],
  [Shortcuts.ROTATE_COUNTER_CLOCKWISE, 'option.settings.rotateDocumentCounterclockwise'],
  [Shortcuts.COPY, 'option.settings.copyText'],
  [Shortcuts.PASTE, 'option.settings.pasteText'],
  [Shortcuts.UNDO, 'option.settings.undoChange'],
  [Shortcuts.REDO, 'option.settings.redoChange'],
  [Shortcuts.OPEN_FILE, 'option.settings.openFile'],
  [Shortcuts.SEARCH, 'option.settings.openSearch'],
  [Shortcuts.ZOOM_IN, 'option.settings.zoomIn'],
  [Shortcuts.ZOOM_OUT, 'option.settings.zoomOut'],
  [Shortcuts.FIT_SCREEN_WIDTH, 'option.settings.fitScreenWidth'],
  [Shortcuts.PRINT, 'option.settings.print'],
  [Shortcuts.BOOKMARK, 'option.settings.bookmarkOpenPanel'],
  [Shortcuts.PREVIOUS_PAGE, 'option.settings.goToPreviousPage'],
  [Shortcuts.NEXT_PAGE, 'option.settings.goToNextPage'],
  [Shortcuts.UP, 'option.settings.goToPreviousPageArrowUp'],
  [Shortcuts.DOWN, 'option.settings.goToNextPageArrowDown'],
  [Shortcuts.SWITCH_PAN, 'option.settings.holdSwitchPan'],
  [Shortcuts.SELECT, 'option.settings.selectAnnotationEdit'],
  [Shortcuts.PAN, 'option.settings.selectPan'],
  [Shortcuts.ARROW, 'option.settings.selectCreateArrowTool'],
  [Shortcuts.CALLOUT, 'option.settings.selectCreateCalloutTool'],
  [Shortcuts.ERASER, 'option.settings.selectEraserTool'],
  [Shortcuts.FREEHAND, 'option.settings.selectCreateFreeHandTool'],
  [Shortcuts.IMAGE, 'option.settings.selectCreateStampTool'],
  [Shortcuts.LINE, 'option.settings.selectCreateLineTool'],
  [Shortcuts.STICKY_NOTE, 'option.settings.selectCreateStickyTool'],
  [Shortcuts.ELLIPSE, 'option.settings.selectCreateEllipseTool'],
  [Shortcuts.RECTANGLE, 'option.settings.selectCreateRectangleTool'],
  [Shortcuts.RUBBER_STAMP, 'option.settings.selectCreateRubberStampTool'],
  [Shortcuts.FREETEXT, 'option.settings.selectCreateFreeTextTool'],
  [Shortcuts.SIGNATURE, 'option.settings.openSignatureModal'],
  [Shortcuts.SQUIGGLY, 'option.settings.selectCreateTextSquigglyTool'],
  [Shortcuts.HIGHLIGHT, 'option.settings.selectCreateTextHighlightTool'],
  [Shortcuts.STRIKEOUT, 'option.settings.selectCreateTextStrikeoutTool'],
  [Shortcuts.UNDERLINE, 'option.settings.selectCreateTextUnderlineTool']
];

const KeyboardShortcutTab = () => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const shortcutKeyMap = useSelector(selectors.getShortcutKeyMap);

  const [currentShortcut, setCurrentShortcut] = useState(undefined);

  const getCommandStrings = (command) => {
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
                img="icon-edit-form-field"
                title={t('action.edit')}
                onClick={() => editShortcut(command)}
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

export default KeyboardShortcutTab;
