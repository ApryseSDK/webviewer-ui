import React from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import ActionButton from 'components/ActionButton';
import { menuItems } from '../../Helpers/menuItems';
import core from 'core';

/**
 * A button that performs the redo action.
 * @name redoButton
 * @memberof UI.Components.PresetButton
 */
const RedoButton = (props) => {
  const { isFlyoutItem, iconDOMElement } = props;
  const { label, presetDataElement, icon, title } = menuItems.redoButton;
  const activeDocumentViewerKey = useSelector((state) => selectors.getActiveDocumentViewerKey(state));
  const { t } = useTranslation();

  const handleClick = () => {
    core.redo(activeDocumentViewerKey);
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
          className={'PresetButton redo-button'}
          dataElement={presetDataElement}
          title={title}
          img={icon}
          onClick={handleClick}
          shouldPassActiveDocumentViewerKeyToOnClickHandler={true}
          isNotClickableSelector={(state) => !state.viewer.canRedo[state.viewer.activeDocumentViewerKey]}
        />
      )
  );
};

RedoButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  iconDOMElement: PropTypes.object,
};

export default RedoButton;