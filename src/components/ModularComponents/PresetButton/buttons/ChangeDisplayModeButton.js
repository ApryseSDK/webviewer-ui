/**
 * A button that sets the document display to continuous page transition mode.
 * @name continuousPageTransitionButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that sets the document display to default page transition mode (page-by-page).
 * @name defaultPageTransitionButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that sets the document display to reader page transition mode.
 * @name readerPageTransitionButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that sets the document display to single page layout mode.
 * @name singleLayoutButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that sets the document display to double page layout mode.
 * @name doubleLayoutButton
 * @memberof UI.Components.PresetButton
 */

/**
 * A button that sets the document display to cover page layout mode.
 * @name coverLayoutButton
 * @memberof UI.Components.PresetButton
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { getPresetButtonDOM } from '../../Helpers/menuItems';
import { PRESET_BUTTON_TYPES } from 'constants/customizationVariables';
import FlyoutItemContainer from '../../FlyoutItemContainer';
import { useSelector, useStore, useDispatch } from 'react-redux';
import selectors from 'selectors';
import displayModeObjects from 'constants/displayModeObjects';
import { exitReaderMode, enterReaderMode } from 'helpers/readerMode';
import DataElements from 'constants/dataElement';
import useCore from 'hooks/useCore';
import actions from 'actions';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';

const ChangeDisplayModeButton = forwardRef((props, ref) => {
  const { isFlyoutItem, dataElement, className, style, buttonType } = props;

  const { core } = useCore();
  const store = useStore();
  const dispatch = useDispatch();
  const isReaderMode = useSelector(selectors.isReaderMode);
  const displayMode = useSelector(selectors.getDisplayMode);
  const totalPages = useSelector(selectors.getTotalPages);

  const totalPageThreshold = 1000;
  let isPageTransitionEnabled = totalPages < totalPageThreshold;

  let pageTransition;
  let layout;
  const displayModeObject = displayModeObjects.find((obj) => obj.displayMode === displayMode);
  if (displayModeObject) {
    pageTransition = displayModeObject.pageTransition;
    layout = displayModeObject.layout;
  }

  const handleClick = (pageTransition, layout) => {
    const setDisplayMode = () => {
      const displayModeObject = displayModeObjects.find((obj) => obj.pageTransition === pageTransition && obj.layout === layout);
      core.setDisplayMode(displayModeObject.displayMode);
    };

    if (isReaderMode) {
      exitReaderMode(store);
      setTimeout(() => {
        setDisplayMode();
      });
    } else {
      setDisplayMode();
    }
  };

  const handleReaderModeClick = () => {
    if (isReaderMode) {
      return;
    }
    enterReaderMode(store);
    dispatch(actions.closeElement(DataElements.VIEW_CONTROLS_FLYOUT));
  };

  let icon;
  let label;
  let title;
  let isActive = false;
  let shouldShow = isPageTransitionEnabled;
  let onClick;
  switch (buttonType) {
    case PRESET_BUTTON_TYPES.CONTINUOUS_PAGE_TRANSITION:
      icon = 'icon-header-page-manipulation-page-transition-continuous-page-line';
      label = 'option.pageTransition.continuous';
      title = 'option.pageTransition.continuous';
      isActive = pageTransition === 'continuous' && !isReaderMode;
      onClick = () => handleClick('continuous', layout);
      break;
    case PRESET_BUTTON_TYPES.DEFAULT_PAGE_TRANSITION:
      icon = 'icon-header-page-manipulation-page-transition-page-by-page-line';
      label = 'option.pageTransition.default';
      title = 'option.pageTransition.default';
      isActive = pageTransition === 'default' && !isReaderMode;
      onClick = () => handleClick('default', layout);
      break;
    case PRESET_BUTTON_TYPES.READER_PAGE_TRANSITION:
      icon = 'icon-header-page-manipulation-page-transition-reader';
      label = 'option.pageTransition.reader';
      title = 'option.pageTransition.reader';
      isActive = isReaderMode;
      shouldShow = isPageTransitionEnabled && core.isFullPDFEnabled() && core.getDocument()?.getType() === 'pdf';
      onClick = handleReaderModeClick;
      break;
    case PRESET_BUTTON_TYPES.SINGLE_LAYOUT:
      icon = 'icon-header-page-manipulation-page-layout-single-page-line';
      label = 'option.layout.single';
      title = 'option.layout.single';
      isActive = layout === 'single';
      onClick = () => handleClick(pageTransition, 'single');
      shouldShow = !isReaderMode;
      break;
    case PRESET_BUTTON_TYPES.DOUBLE_LAYOUT:
      icon = 'icon-header-page-manipulation-page-layout-double-page-line';
      label = 'option.layout.double';
      title = 'option.layout.double';
      onClick = () => handleClick(pageTransition, 'double');
      isActive = layout === 'double';
      shouldShow = !isReaderMode;
      break;
    case PRESET_BUTTON_TYPES.COVER_LAYOUT:
      icon = 'icon-header-page-manipulation-page-layout-cover-line';
      label = 'option.layout.cover';
      title = 'option.layout.cover';
      onClick = () => handleClick(pageTransition, 'cover');
      isActive = layout === 'cover';
      shouldShow = !isReaderMode;
      break;
  }

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
      isActive,
      label,
    })
  );
});

ChangeDisplayModeButton.propTypes = {
  isFlyoutItem: PropTypes.bool,
  dataElement: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  img: PropTypes.string,
  title: PropTypes.string,
  buttonType: PropTypes.string,
  allFlyoutItems: PropTypes.array,
};
ChangeDisplayModeButton.displayName = 'ChangeDisplayModeButton';

export default ChangeDisplayModeButton;