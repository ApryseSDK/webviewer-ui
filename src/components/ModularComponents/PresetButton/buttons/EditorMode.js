import React, { forwardRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import actions from 'actions';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';


const EditorModeButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const dispatch = useDispatch();
  const isInEditorMode = useSelector(selectors.isInEditorMode);
  const label = isInEditorMode ? 'Turn off Editor Mode' : 'Turn on Editor Mode';

  const handleOnClick = () => {
    dispatch(actions.setIsInEditorMode(!isInEditorMode));
    if (!isInEditorMode) {
      dispatch(actions.openElement('editorPanel'));
    } else {
      dispatch(actions.closeElement('editorPanel'));
    }
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} label={label} ref={ref} onClick={handleOnClick} />
      :
      getPresetButtonDOM(PRESET_BUTTON_TYPES.EDITOR_MODE, false, handleOnClick, undefined, isInEditorMode, isInEditorMode)
  );
});

EditorModeButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
EditorModeButton.displayName = 'EditorModeButton';

export default EditorModeButton;