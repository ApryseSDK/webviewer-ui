import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import UndoRedoButton from './UndoRedoButton';

/**
 * A button that performs the undo action.
 * @name undoButton
 * @memberof UI.Components.PresetButton
 */
const UndoButton = forwardRef((props, ref) => {
  return <UndoRedoButton {...props} ref={ref} type="undo" />;
});

UndoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};
UndoButton.displayName = 'UndoButton';

export default UndoButton;