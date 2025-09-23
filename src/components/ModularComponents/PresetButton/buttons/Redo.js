import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import UndoRedoButton from './UndoRedoButton';

/**
 * A button that performs the redo action.
 * @name redoButton
 * @memberof UI.Components.PresetButton
 */
const RedoButton = forwardRef((props, ref) => {
  return <UndoRedoButton {...props} ref={ref} type="redo" />;
});

RedoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  style: PropTypes.object,
  className: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
};
RedoButton.displayName = 'RedoButton';

export default RedoButton;