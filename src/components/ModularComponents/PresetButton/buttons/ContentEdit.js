import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import FlyoutItemContainer from '../../FlyoutItemContainer';

/**
 * A button that toggles Content Edit Mode.
 * @name contentEditButton
 * @memberof UI.Components.PresetButton
 */
const ContentEditButton = forwardRef((props, ref) => {
  const { isFlyoutItem } = props;
  const { presetDataElement, icon, title } = menuItems.contentEditButton;
  const areContentEditWorkersLoaded = useSelector((state) => selectors.areContentEditWorkersLoaded(state));
  const dispatch = useDispatch();

  const handleClick = () => {
    const contentEditManager = core.getContentEditManager();
    const beginContentEditMode = () => {
      // loading modal for the delay when switching to content edit mode
      // but only if the workers are not loaded
      if (!areContentEditWorkersLoaded) {
        dispatch(actions.openElement(DataElements.LOADING_MODAL));
      }
      dispatch(actions.openElement(DataElements.TEXT_EDITING_PANEL));
      contentEditManager.startContentEditMode();
    };
    contentEditManager.isInContentEditMode() ? contentEditManager.endContentEditMode() : beginContentEditMode();
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      : (
        <ActionButton
          className={'PresetButton contentEditButton'}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={core.getContentEditManager().isInContentEditMode()}
        />
      )
  );
});

ContentEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
};
ContentEditButton.displayName = 'ContentEditButton';

export default ContentEditButton;