import React from 'react';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import DataElements from 'constants/dataElement';

/**
 * A button that toggles Content Edit Mode.
 * @name contentEditButton
 * @memberof UI.Components.PresetButton
 */
const ContentEditButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label, presetDataElement, icon, title } = menuItems.contentEditButton;
  const { t } = useTranslation();
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

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleClick();
    }
  };

  return (
    isFlyoutItem ?
      (
        <div className="menu-container"
          tabIndex="0" onClick={handleClick} onKeyDown={onKeyDown}>
          <div className="icon-label-wrapper">
            {iconDOMElement}
            {label && <div className="flyout-item-label">{t(label)}</div>}
          </div>
        </div>
      )
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
};

ContentEditButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default ContentEditButton;