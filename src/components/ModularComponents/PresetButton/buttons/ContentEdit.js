import React, { forwardRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import classNames from 'classnames';

/**
 * A button that toggles Content Edit Mode.
 * @name contentEditButton
 * @memberof UI.Components.PresetButton
 */
const ContentEditButton = forwardRef((props, ref) => {
  const { isFlyoutItem, style, className } = props;
  const { presetDataElement, icon, title } = menuItems.contentEditButton;
  const areContentEditWorkersLoaded = useSelector((state) => selectors.areContentEditWorkersLoaded(state));
  const dispatch = useDispatch();
  const [active, setActive] = useState(core.getContentEditManager().isInContentEditMode());

  useEffect(() => {
    const contentEditManager = core.getContentEditManager();
    if (contentEditManager) {
      const updateState = () => setActive(contentEditManager.isInContentEditMode());
      contentEditManager.addEventListener('contentEditModeStarted', updateState);
      contentEditManager.addEventListener('contentEditModeEnded', updateState);
      return () => {
        contentEditManager.removeEventListener('contentEditModeStarted', updateState);
        contentEditManager.removeEventListener('contentEditModeEnded', updateState);
      };
    }
  }, []);

  const handleClick = () => {
    const contentEditManager = core.getContentEditManager();
    const beginContentEditMode = () => {
      // loading modal for the delay when switching to content edit mode
      // but only if the workers are not loaded
      if (!areContentEditWorkersLoaded) {
        dispatch(actions.openElement(DataElements.LOADING_MODAL));
      }
      contentEditManager.startContentEditMode();
      setActive(true);
      dispatch(actions.openElement(DataElements.TEXT_EDITING_PANEL));
    };
    contentEditManager.isInContentEditMode() ? contentEditManager.endContentEditMode() : beginContentEditMode();
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer {...props} ref={ref} onClick={handleClick} />
      : (
        <ActionButton
          className={classNames({
            PresetButton: true,
            contentEditButton: true,
            [className]: true,
          })}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          isActive={active}
          style={style}
          ariaPressed={active}
        />
      )
  );
});

ContentEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
};
ContentEditButton.displayName = 'ContentEditButton';

export default ContentEditButton;