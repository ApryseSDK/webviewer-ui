import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';

/**
 * A button that performs the undo action.
 * @name undoButton
 * @memberof UI.Components.PresetButton
 */
const UndoButton = forwardRef((props, ref) => {
  const { isFlyoutItem, style, className } = props;
  const { presetDataElement, icon, title } = menuItems.undoButton;
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const canUndo = useSelector((state) => selectors.canUndo(state, activeDocumentViewerKey));
  const isOfficeEditorMode = useSelector((state) => selectors.getIsOfficeEditorMode(state));
  const isOfficeEditorUndoEnabled = useSelector((state) => selectors.isOfficeEditorUndoEnabled(state));
  const disabled = (!isOfficeEditorMode && !canUndo) || (isOfficeEditorMode && !isOfficeEditorUndoEnabled);

  const handleClick = () => {
    if (isOfficeEditorMode) {
      return core.getOfficeEditor().undo();
    }
    core.undo(activeDocumentViewerKey);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} disabled={disabled} />
      : (
        <ActionButton
          className={classNames({
            PresetButton: true,
            'undo-button': true,
            [className]: true,
          })}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          shouldPassActiveDocumentViewerKeyToOnClickHandler={true}
          disabled={disabled}
          style={style}
        />
      )
  );
});

UndoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};
UndoButton.displayName = 'UndoButton';

export default UndoButton;