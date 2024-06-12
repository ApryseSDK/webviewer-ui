import React from 'react';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import './ZoomText.scss';
import { ITEM_TYPE } from 'constants/customizationVariables';
import classNames from 'classnames';
import ToolGroupButton from 'components/ModularComponents/ToolGroupButton';
import { getIconDOMElement, getSubMenuDOMElement } from 'components/ModularComponents/Helpers/responsiveness-helper';
import RibbonItem from 'components/ModularComponents/RibbonItem';
import PresetButton from 'components/ModularComponents/PresetButton';
import ZoomText from 'components/ModularComponents/Flyout/flyoutHelpers/ZoomText';
import Icon from 'components/Icon';
import PageControlsFlyout from 'components/ModularComponents/PageControls/PageControlsFlyout';
import getToolbarTranslationString from 'helpers/translationKeyMapping';
import ToolButton from 'components/ModularComponents/ToolButton';
import { itemToFlyout } from 'helpers/itemToFlyoutHelper';
import PropTypes from 'prop-types';
import core from 'core';

const propTypes = {
  flyoutItem: PropTypes.oneOfType([
    // ie. 'divider'
    PropTypes.string,
    PropTypes.object
  ]),
};

function FlyoutItem(props) {
  const { flyoutItem } = props;
  const [
    modularComponent
  ] = useSelector((state) => [
    flyoutItem?.dataElement ? selectors.getModularComponent(state, flyoutItem.dataElement) : undefined,
  ]);
  const typesToConvert = [
    ITEM_TYPE.PRESET_BUTTON,
    ITEM_TYPE.RIBBON_ITEM,
    ITEM_TYPE.TOOL_BUTTON,
    ITEM_TYPE.TOOL_GROUP_BUTTON,
    ITEM_TYPE.BUTTON,
    ITEM_TYPE.STATEFUL_BUTTON,
    ITEM_TYPE.TOGGLE_BUTTON,
  ];
  if (flyoutItem && flyoutItem.dataElement && modularComponent && typesToConvert.includes(modularComponent.type)) {
    const newFlyoutItemState = {
      ...props.flyoutItem,
      ...itemToFlyout(modularComponent, {
        useOverrideClickOnly: true,
        onClick: flyoutItem?.onClick,
        children: flyoutItem?.children,
      }),
    };
    return <StaticItem {...props} flyoutItem={newFlyoutItemState}/>;
  }
  return <StaticItem {...props}/>;
}

FlyoutItem.propTypes = propTypes;

export default FlyoutItem;

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
  activeFlyout: PropTypes.string,
};

function StaticItem({ flyoutItem, isChild, index, onClickHandler, activeItem, items, activeFlyout }) {
  const [
    customHeadersAdditionalProperties,
    currentPage,
    activeToolGroup,
    activeCustomPanel,
  ] = useSelector((state) => [
    selectors.getCustomHeadersAdditionalProperties(state),
    selectors.getCurrentPage(state),
    selectors.getActiveToolGroup(state),
    selectors.getActiveCustomPanel(state, activeFlyout.split('-flyout')[0])
  ]);

  const { t } = useTranslation();

  if (flyoutItem.hasOwnProperty('hidden') && flyoutItem.hidden) {
    return null;
  }

  const itemIsAPanelTab = !!flyoutItem.tabPanel;
  const itemIsATool = !!flyoutItem.toolName;
  const itemIsAToolGroup = !!flyoutItem.toolGroup;
  const itemIsARibbonItem = flyoutItem.type === ITEM_TYPE.RIBBON_ITEM;
  const itemIsAPresetButton = flyoutItem.type === ITEM_TYPE.PRESET_BUTTON;
  const itemIsAZoomOptionsButton = flyoutItem.dataElement === 'zoomOptionsButton' || flyoutItem.className === 'ZoomFlyoutMenu';
  const itemIsAZoomButton = flyoutItem.dataElement?.includes('zoom-button-');
  const itemIsPageNavButton = flyoutItem.dataElement === 'pageNavigationButton';
  const itemsToRender = isChild ? activeItem.children : items;
  const itemIsALabel = typeof flyoutItem === 'string' && flyoutItem !== ITEM_TYPE.DIVIDER;

  const getFlyoutItemWrapper = (elementDOM, additionalClass) => {
    return (
      <div key={flyoutItem.label} data-element={flyoutItem.dataElement}
        onClick={onClickHandler(flyoutItem, isChild, index)}
        className={classNames({
          'flyout-item-container': true,
          [additionalClass]: true
        })}
      >
        {elementDOM}
      </div>
    );
  };

  if (itemIsAToolGroup) {
    const isActiveClass = activeToolGroup === flyoutItem.toolGroup ? 'active' : '';
    const toolGroupElement = <ToolGroupButton
      key={flyoutItem.key}
      {...flyoutItem}
      onClick={onClickHandler()}
      isFlyoutItem={true}
      iconDOMElement={getIconDOMElement(flyoutItem, itemsToRender)}
      subMenuDOMElement={getSubMenuDOMElement(flyoutItem, itemsToRender)}
    />;
    return getFlyoutItemWrapper(toolGroupElement, isActiveClass);
  }
  if (itemIsARibbonItem) {
    const ribbonItemElement = <RibbonItem key={flyoutItem.label}
      {...flyoutItem}
      isFlyoutItem={true}
      iconDOMElement={getIconDOMElement(flyoutItem, itemsToRender)}
    />;
    return getFlyoutItemWrapper(ribbonItemElement);
  }
  if (itemIsAPresetButton) {
    const presetButtonElement = <PresetButton
      buttonType={flyoutItem.dataElement}
      isFlyoutItem={true}
      iconDOMElement={getIconDOMElement(flyoutItem, itemsToRender)}/>;
    return getFlyoutItemWrapper(presetButtonElement);
  }
  if (itemIsAZoomOptionsButton) {
    const hasImg = !!flyoutItem.img || !!flyoutItem.icon;
    const zoomOptionsElement = (
      <div className="menu-container">
        {
          hasImg ? <div className="icon-label-wrapper">
            {getIconDOMElement(flyoutItem, itemsToRender)}
            <ZoomText/>
          </div> : <ZoomText/>
        }
        {flyoutItem.children && <Icon className="icon-open-submenu" glyph="icon-chevron-right"/>}
      </div>
    );
    return getFlyoutItemWrapper(zoomOptionsElement, 'zoom-options');
  }

  if (itemIsPageNavButton) {
    return getFlyoutItemWrapper((
      <div className="menu-container" key={flyoutItem.label}>
        <div className="icon-label-wrapper">
          {getIconDOMElement(flyoutItem, itemsToRender)}
          <PageControlsFlyout {...flyoutItem} currentPage={currentPage}/>
        </div>
      </div>
    ), 'page-nav-display');
  }

  if (itemIsALabel) {
    return <div className="flyout-label" key={`label-${index}`}>{t(flyoutItem)}</div>;
  }
  const alabel = flyoutItem.toolbarGroup
    ? getToolbarTranslationString(flyoutItem.toolbarGroup, customHeadersAdditionalProperties)
    : flyoutItem.label;

  return (flyoutItem === ITEM_TYPE.DIVIDER ? <div className="divider" key={`divider-${index}`}/> : (
    <div key={flyoutItem.label || flyoutItem.dataElement} className={classNames({
      'flyout-item-container': true,
      'active': flyoutItem.isActive
        || itemIsAPanelTab && activeCustomPanel === flyoutItem.dataElement
        || itemIsATool && core.getToolMode()?.name === flyoutItem.toolName
        || itemIsAZoomButton && Math.ceil(core.getZoom() * 100).toString() === flyoutItem.dataElement?.split('zoom-button-')[1]
    })}
    data-element={flyoutItem.dataElement} onClick={onClickHandler(flyoutItem, isChild, index)}>
      { itemIsATool ? (
        // We should update when we have the customizable Tool Button component
        <ToolButton
          className={classNames({ ZoomItem: true })}
          role="option"
          toolName={flyoutItem.toolName}
          label={alabel}
          img={flyoutItem.icon}
          isFlyoutItem={true}
        />
      ) :
        (
          <div className="menu-container">
            <div className="icon-label-wrapper">
              {getIconDOMElement(flyoutItem, itemsToRender)}
              {<div className="flyout-item-label">{t(alabel)}</div>}
            </div>
          </div>
        )}
      {getSubMenuDOMElement(flyoutItem, itemsToRender)}
    </div>
  ));
}

StaticItem.propTypes = staticItemPropTypes;