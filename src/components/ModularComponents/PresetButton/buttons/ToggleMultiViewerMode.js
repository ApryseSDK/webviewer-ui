/**
 * A button that toggles multi-viewer mode for viewing documents side-by-side.
 * @name toggleMultiViewerModeButton
 * @memberof UI.Components.PresetButton
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import { useSelector, useStore } from 'react-redux';
import selectors from 'selectors';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';
import { isIE11 } from 'helpers/device';
import { cleanUpMultiViewer, setupMultiViewer } from 'helpers/multiViewerHelper';


const ToggleMultiViewerMode = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement, className, style, buttonType } = props;

  const store = useStore();
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const isMultiViewerModeAvailable = useSelector(selectors.getIsMultiViewerModeAvailable);
  const isMultiViewerMode = useSelector(selectors.isMultiViewerMode);

  const shouldShow = !isIE11 && !isMultiTab && isMultiViewerModeAvailable;

  const icon = 'icon-header-compare';
  const label = 'action.comparePages';
  const title = 'action.comparePages';
  const onClick = () => isMultiViewerMode ? cleanUpMultiViewer(store) : setupMultiViewer(store);
  const isActive = isMultiViewerMode;

  if (!shouldShow) {
    return null;
  }

  return isFlyoutItem ? (
    <FlyoutItemContainer
      {...props}
      label={label}
      title={title}
      ref={ref}
      onClick={onClick}
      isActive={isActive}
      icon={getIconDOMElement({ icon }, props.allFlyoutItems || [])}
    />
  ) : (
    getPresetButtonDOM({
      buttonType,
      onClick,
      dataElement,
      className,
      style,
      icon,
      title,
      label,
      isActive,
    })
  );
});

ToggleMultiViewerMode.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  buttonType: PropTypes.string,
  allFlyoutItems: PropTypes.array,
};
ToggleMultiViewerMode.displayName = 'ToggleMultiViewerMode';

export default ToggleMultiViewerMode;