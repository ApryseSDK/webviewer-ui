import React, { forwardRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import '../Flyout/Flyout.scss';
import { getClickMiddleWare, ClickedItemTypes } from 'helpers/clickTracker';
import selectors from 'selectors';
import { getIconDOMElement } from 'helpers/itemToFlyoutHelper';
import { ITEM_TYPE } from 'constants/customizationVariables';

const FlyoutItemContainer = forwardRef((props, ref) => {
  let customElementOverrides = useSelector((state) => selectors.getCustomElementOverrides(state, props.dataElement));
  if (customElementOverrides) {
    customElementOverrides = { ...customElementOverrides };
    const newIcon = getIconDOMElement(customElementOverrides);
    if (newIcon) {
      customElementOverrides.icon = newIcon;
    }
  }
  const {
    label,
    secondaryLabel,
    title,
    dataElement,
    disabled,
    additionalClass = '',
    ariaKeyshortcuts,
    children,
    index,
    isChild,
    elementDOM,
    onKeyDownHandler,
    onClickHandler,
  } = { ...props, ...customElementOverrides };

  let icon = customElementOverrides?.icon || customElementOverrides?.img || props.icon;

  if (!customElementOverrides && props.flyoutItem?.type === ITEM_TYPE.PRESET_BUTTON && disabled) {
    const newIcon = getIconDOMElement(props.flyoutItem, props.allFlyoutItems, disabled);
    if (newIcon) {
      icon = newIcon;
    }
  }

  const { t } = useTranslation();

  const getFlyoutItemContent = () => {
    if (elementDOM) {
      return (
        <div className='custom-element-wrapper'>
          {icon}
          {elementDOM}
        </div>
      );
    }

    const onClick = (e) => {
      getClickMiddleWare()?.(dataElement, { type: ClickedItemTypes.BUTTON });
      customElementOverrides?.onClick ? customElementOverrides.onClick(e) : onClickHandler(props, isChild, index)(e);
    };

    const flyoutItemLabel = label ?? title;
    const finalLabel = typeof flyoutItemLabel === 'string' ? t(flyoutItemLabel) : flyoutItemLabel;
    const finalLabelString = typeof finalLabel === 'string' ? finalLabel : null;
    const isSelected = props.additionalClass === 'active';
    return (
      <button
        className="flyout-item"
        disabled={disabled}
        onClick={onClick}
        aria-disabled={disabled}
        onKeyDown={onKeyDownHandler}
        data-element={dataElement}
        aria-label={finalLabelString}
        aria-pressed={isSelected}
      >
        <div className="icon-label-wrapper">
          {icon}
          {finalLabel && <span className="flyout-item-label">{finalLabel}</span>}
        </div>
        {ariaKeyshortcuts && <span className="hotkey-wrapper">{`(${ariaKeyshortcuts})`}</span>}
        {secondaryLabel && <span className="secondary-label">{secondaryLabel}</span>}
        {children && <Icon className="icon-open-submenu" glyph="icon-chevron-right" />}
      </button>
    );
  };

  return (
    <li
      key={label}
      ref={ref}
      draggable={props.draggable}
      onDragStart={props.onDragStart}
      onDragEnd={props.onDragEnd}
      className={classNames({
        'flyout-item-container': true,
        'disabled': disabled,
        [additionalClass]: true
      })}
    >
      {getFlyoutItemContent()}
    </li>
  );
});

FlyoutItemContainer.propTypes = {
  label: PropTypes.oneOfType([
    PropTypes.string,
    // e.g. Zoom Options
    PropTypes.object,
  ]),
  secondaryLabel: PropTypes.string,
  title: PropTypes.string,
  dataElement: PropTypes.string,
  disabled: PropTypes.bool,
  additionalClass: PropTypes.string,
  icon: PropTypes.node,
  ariaKeyshortcuts: PropTypes.string,
  children: PropTypes.array,
  index: PropTypes.number,
  isChild: PropTypes.bool,
  elementDOM: PropTypes.node,
  onKeyDownHandler: PropTypes.func,
  onClickHandler: PropTypes.func,
  draggable: PropTypes.bool,
  onDragStart: PropTypes.func,
  onDragEnd: PropTypes.func,
  flyoutItem: PropTypes.object,
  allFlyoutItems: PropTypes.array,
};
FlyoutItemContainer.displayName = 'FlyoutItemContainer';

export default FlyoutItemContainer;