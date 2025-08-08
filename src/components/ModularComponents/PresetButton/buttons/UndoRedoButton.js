import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import { getButtonPressedAnnouncement } from 'helpers/accessibility';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';
import { triggerSelectedRangeStyleChangedWithLatestStyle } from 'src/helpers/undoRedoSpreadsheetHelpers';

// Configuration map for undo/redo operations
const UNDO_REDO_CONFIG = {
  undo: {
    menuItem: () => menuItems.undoButton,
    selectors: {
      canPerformAction: (state, key) => selectors.canUndo(state, key),
      isOfficeEditorActionEnabled: (state) => selectors.isOfficeEditorUndoEnabled(state),
      spreadsheetEditorCanPerformAction: (state) => selectors.spreadsheetEditorCanUndo(state),
    },
    handlers: {
      officeEditor: (editor) => editor.undo(),
      spreadsheetEditor: (historyManager) => historyManager.undo(),
      default: (activeKey) => core.undo(activeKey),
    },
    className: 'undo-button',
  },
  redo: {
    menuItem: () => menuItems.redoButton,
    selectors: {
      canPerformAction: (state, key) => selectors.canRedo(state, key),
      isOfficeEditorActionEnabled: (state) => selectors.isOfficeEditorRedoEnabled(state),
      spreadsheetEditorCanPerformAction: (state) => selectors.spreadsheetEditorCanRedo(state),
    },
    handlers: {
      officeEditor: (editor) => editor.redo(),
      spreadsheetEditor: (historyManager) => historyManager.redo(),
      default: (activeKey) => core.redo(activeKey),
    },
    className: 'redo-button',
  },
};

/**
 * @ignore
 * A reusable button component that performs undo or redo actions.
 * @name undoRedoButton
 * @memberof UI.Components.PresetButton
 */
const UndoRedoButton = forwardRef((props, ref) => {
  const {
    type, // 'undo' or 'redo'
    isFlyoutItem,
    style,
    className,
    dataElement,
    img: icon,
    title,
  } = props;

  const config = UNDO_REDO_CONFIG[type];
  const menuItem = config.menuItem();

  const finalDataElement = dataElement || menuItem.dataElement;
  const finalIcon = icon || menuItem.icon;
  const finalTitle = title || menuItem.title;

  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const canPerformAction = useSelector((state) =>
    config.selectors.canPerformAction(state, activeDocumentViewerKey)
  );
  const isOfficeEditorMode = useSelector((state) => selectors.getIsOfficeEditorMode(state));
  const isOfficeEditorActionEnabled = useSelector((state) =>
    config.selectors.isOfficeEditorActionEnabled(state)
  );
  const uiConfiguration = useSelector((state) => selectors.getUIConfiguration(state));
  const isSpreadsheetEditorMode = uiConfiguration === 'spreadsheetEditor';
  const spreadsheetEditorCanPerformAction = useSelector((state) =>
    config.selectors.spreadsheetEditorCanPerformAction(state)
  );

  const disabled =
    (!isOfficeEditorMode && !isSpreadsheetEditorMode && !canPerformAction) ||
    (isOfficeEditorMode && !isOfficeEditorActionEnabled) ||
    (isSpreadsheetEditorMode && !spreadsheetEditorCanPerformAction);

  const handleClick = () => {
    if (isOfficeEditorMode) {
      const officeEditor = core.getOfficeEditor();
      return config.handlers.officeEditor(officeEditor);
    }

    if (isSpreadsheetEditorMode) {
      const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
      const historyManager = spreadsheetEditorManager.getSpreadsheetEditorHistoryManager();

      config.handlers.spreadsheetEditor(historyManager);
      triggerSelectedRangeStyleChangedWithLatestStyle(spreadsheetEditorManager);
      return;
    }

    config.handlers.default(activeDocumentViewerKey);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} disabled={disabled} />
      : (
        <ActionButton
          className={classNames({
            PresetButton: true,
            [config.className]: true,
            [className]: true,
          })}
          dataElement={finalDataElement}
          title={finalTitle}
          img={finalIcon}
          onClick={handleClick}
          shouldPassActiveDocumentViewerKeyToOnClickHandler={true}
          disabled={disabled}
          style={style}
          onClickAnnouncement={getButtonPressedAnnouncement(finalTitle)}
        />
      )
  );
});

UndoRedoButton.propTypes = {
  type: PropTypes.oneOf(['undo', 'redo']).isRequired,
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};

UndoRedoButton.displayName = 'UndoRedoButton';

export default UndoRedoButton;