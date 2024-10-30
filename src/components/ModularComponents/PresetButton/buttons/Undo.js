import React, { forwardRef } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that performs the undo action.
 * @name undoButton
 * @memberof UI.Components.PresetButton
 */
const UndoButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const { presetDataElement, icon, title } = menuItems.undoButton;
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const canUndo = useSelector((state) => selectors.canUndo(state, activeDocumentViewerKey));
  const disabled = !canUndo;

  const handleClick = () => {
    core.undo(activeDocumentViewerKey);
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} disabled={disabled} />
      : (
        <ActionButton
          className={'PresetButton undo-button'}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          shouldPassActiveDocumentViewerKeyToOnClickHandler={true}
          isNotClickableSelector={(state) => !state.viewer.canUndo[state.viewer.activeDocumentViewerKey]}
        />
      )
  );
});

UndoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
UndoButton.displayName = 'UndoButton';

export default UndoButton;