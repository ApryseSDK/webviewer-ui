import React from 'react';
import selectors from 'selectors';
import { shallowEqual, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './ZoomText.scss';
import { FLYOUT_ITEM_TYPES, ITEM_TYPE } from 'constants/customizationVariables';
import classNames from 'classnames';
import { getIconDOMElement } from 'components/ModularComponents/Helpers/responsiveness-helper';
import RibbonItem from 'components/ModularComponents/RibbonItem';
import PresetButton from 'components/ModularComponents/PresetButton';
import ZoomText from 'components/ModularComponents/Flyout/flyoutHelpers/ZoomText';
import PageControlsFlyout from 'components/ModularComponents/PageControls/PageControlsFlyout';
import getToolbarTranslationString from 'helpers/translationKeyMapping';
import ToolButton from 'components/ModularComponents/ToolButton';
import { itemToFlyout } from 'helpers/itemToFlyoutHelper';
import PropTypes from 'prop-types';
import core from 'core';
import FlyoutItemContainer from '../../FlyoutItemContainer';
const propTypes = {
  flyoutItem: PropTypes.oneOfType([
    // ie. 'divider'
    PropTypes.string,
    PropTypes.object
  ]),
  onClickHandler: PropTypes.func,
  activeFlyout: PropTypes.string,
  type: PropTypes.string,
};

const FlyoutItem = React.forwardRef((props, ref) => {
  const { flyoutItem, type, onClickHandler } = props;
  const modularComponent = useSelector((state) => flyoutItem?.dataElement ? selectors.getModularComponent(state, flyoutItem.dataElement) : undefined);

  const typesToGetExtraInfo = [
    ITEM_TYPE.PRESET_BUTTON,
    ITEM_TYPE.RIBBON_ITEM,
    ITEM_TYPE.TOOL_BUTTON,
    ITEM_TYPE.BUTTON,
    ITEM_TYPE.STATEFUL_BUTTON,
    ITEM_TYPE.TOGGLE_BUTTON,
  ];
  if (flyoutItem && flyoutItem.dataElement && modularComponent && typesToGetExtraInfo.includes(modularComponent.type)) {
    const newFlyoutItemState = {
      ...flyoutItem,
      ...itemToFlyout(modularComponent, {
        useOverrideClickOnly: true,
        onClick: flyoutItem?.onClick,
        children: flyoutItem?.children,
      }),
      type: type,
      onClickHandler: onClickHandler,
    };
    return <StaticItem {...props} flyoutItem={newFlyoutItemState} ref={ref} />;
  }
  return <StaticItem {...props} />;
});

FlyoutItem.propTypes = propTypes;
FlyoutItem.displayName = 'FlyoutItem';

export default FlyoutItem;

const StaticItem = React.forwardRef((props, ref) => {
  const { flyoutItem, isChild, index, activeItem, items, activeFlyout, type } = props;
  const allProps = { ...flyoutItem, ...props };
  const { t } = useTranslation();
  const customHeadersAdditionalProperties = useSelector(selectors.getCustomHeadersAdditionalProperties, shallowEqual);
  const currentPage = useSelector(selectors.getCurrentPage);
  const activeCustomPanel = useSelector((state) => selectors.getActiveCustomPanel(state, activeFlyout.split('-flyout')[0]));
  const isDisabledItem = useSelector((state) => selectors.isElementDisabled(state, flyoutItem?.dataElement));

  if (isDisabledItem || (flyoutItem.hasOwnProperty('hidden') && flyoutItem.hidden)) {
    return null;
  }

  const itemsToRender = isChild ? activeItem.children : items;
  const icon = getIconDOMElement(flyoutItem, itemsToRender);

  switch (type) {
    case FLYOUT_ITEM_TYPES.LABEL: {
      return <div className="flyout-label" key={`label-${index}`}>{t(flyoutItem)}</div>;
    }
    case FLYOUT_ITEM_TYPES.DIVIDER: {
      return <div className="divider" key={`divider-${index}`} />;
    }
    case FLYOUT_ITEM_TYPES.RIBBON_ITEM: {
      return <RibbonItem isFlyoutItem={true} {...allProps} ref={ref} icon={icon} />;
    }
    case FLYOUT_ITEM_TYPES.PRESET_BUTTON: {
      return <PresetButton {...allProps} isFlyoutItem={true} ref={ref} icon={icon} buttonType={allProps.dataElement} />;
    }
    case FLYOUT_ITEM_TYPES.TOOL_BUTTON: {
      return <ToolButton {...allProps} isFlyoutItem={true} ref={ref} allFlyoutItems={itemsToRender} />;
    }
    case FLYOUT_ITEM_TYPES.PAGE_NAVIGATION_BUTTON: {
      return <PageControlsFlyout {...allProps} currentPage={currentPage} ref={ref} icon={icon} />;
    }
    case FLYOUT_ITEM_TYPES.ZOOM_OPTIONS_BUTTON: {
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          index={index}
          label={<ZoomText />}
          additionalClass={'zoom-options'}
          icon={icon}
          isZoomOptions={true}
          isChild={isChild}
        />
      );
    }
    default: {
      const alabel = flyoutItem.toolbarGroup
        ? getToolbarTranslationString(flyoutItem.toolbarGroup, customHeadersAdditionalProperties)
        : flyoutItem.label;
      const itemIsAPanelTab = type === FLYOUT_ITEM_TYPES.TAB_PANEL_ITEM;
      const itemIsAZoomButton = type === FLYOUT_ITEM_TYPES.ZOOM_BUTTON;
      const isItemActive = flyoutItem.isActive ||
        itemIsAPanelTab && activeCustomPanel === flyoutItem.dataElement ||
        itemIsAZoomButton && Math.ceil(core.getZoom() * 100).toString() === flyoutItem.dataElement?.split('zoom-button-')[1];

      const flyoutItemClasses = classNames({
        'disabled': flyoutItem.disabled,
        'active': isItemActive,
        [allProps.additionalClass]: true,
      });
      return (
        <FlyoutItemContainer {...allProps}
          ref={ref}
          label={alabel}
          additionalClass={flyoutItemClasses}
          icon={icon}
        />
      );
    }
  }
});

const staticItemPropTypes = {
  flyoutItem: PropTypes.oneOfType([
    // ie. 'divider'
    PropTypes.string,
    PropTypes.object
  ]),
  isChild: PropTypes.bool,
  index: PropTypes.number,
  onClickHandler: PropTypes.func,
  activeItem: PropTypes.object,
  items: PropTypes.array,
  type: PropTypes.string,
  activeFlyout: PropTypes.string,
};

StaticItem.propTypes = staticItemPropTypes;
StaticItem.displayName = 'StaticItem';