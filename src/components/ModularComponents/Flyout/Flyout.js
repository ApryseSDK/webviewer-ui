import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import './Flyout.scss';
import Icon from 'components/Icon';
import ToolButton from 'components/ToolButton';
import RibbonItem from '../RibbonItem';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT } from 'constants/flyoutConstants';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import getRootNode from 'helpers/getRootNode';
import ZoomText from '../Helpers/ZoomText';
import ToolGroupButton from '../ToolGroupButton';
import { getIconDOMElement, getSubMenuDOMElement } from '../Helpers/responsiveness-helper';
import { getFlyoutPositionOnElement } from 'helpers/flyoutHelper';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [flyoutMap,
    activeFlyout,
    position,
    activeToolGroup,
    toggleElement,
    topHeadersHeight,
    bottomHeadersHeight
  ] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveFlyout(state),
    selectors.getFlyoutPosition(state),
    selectors.getActiveToolGroup(state),
    selectors.getFlyoutToggleElement(state),
    selectors.getTopHeadersHeight(state),
    selectors.getBottomHeadersHeight(state)
  ]);
  const flyoutProperties = flyoutMap[activeFlyout];
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;
  const {
    dataElement,
    items,
    className
  } = flyoutProperties;
  const [activeItem, setActiveItem] = useState(null);
  const flyoutRef = React.createRef();
  const [correctedPosition, setCorrectedPosition] = useState(position);
  const [maxHeightValue, setMaxHeightValue] = useState(window.innerHeight - horizontalHeadersUsedHeight);

  useLayoutEffect(() => {
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = getRootNode().getElementById('app').getBoundingClientRect();
    const maxHeightValue = appRect.height - horizontalHeadersUsedHeight;
    setMaxHeightValue(maxHeightValue);

    if (toggleElement) {
      const { x, y } = getFlyoutPositionOnElement(toggleElement, flyoutRef);
      correctedPosition.x = x;
      correctedPosition.y = y;
    } else {
      const correctedPosition = { x: position.x, y: position.y };
      const widthOverflow = position.x + flyoutRef.current?.offsetWidth - appRect.width;
      const maxElementHeight = activeItem && activeItem.children.length > items.length ? activeItem.children.length : items.length;
      const heightOverflow = position.y + maxElementHeight * (FLYOUT_ITEM_HEIGHT + 8) - appRect.height;
      if (widthOverflow > 0) {
        correctedPosition.x = position.x - widthOverflow;
      }
      if (heightOverflow > 0) {
        correctedPosition.y = position.y - heightOverflow;
      }
      if (correctedPosition.x < 0) {
        correctedPosition.x = 0;
      }
      if (correctedPosition.y < 0) {
        correctedPosition.y = 0;
      }
    }
    setCorrectedPosition(correctedPosition);
  }, [activeItem, position]);

  const onClickOutside = useCallback(() => {
    dispatch(actions.closeElement(activeFlyout));
  }, [dispatch, activeFlyout]);
  useOnClickOutside(flyoutRef, onClickOutside);

  const onClickHandler = (flyoutItem, isChild) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (flyoutItem.children && flyoutItem !== activeItem && !isChild) {
      setActiveItem(flyoutItem);
    } else if (!isChild) {
      setActiveItem(null);
    }
    if (flyoutItem.onClick) {
      flyoutItem.onClick();
    }
  };

  const renderFlyoutItem = (flyoutItem, index, isChild = false) => {
    const itemIsATool = !!flyoutItem.toolName;
    const itemIsAToolGroup = !!flyoutItem.toolGroup;
    const itemIsARibbonItem = flyoutItem.type === ITEM_TYPE.RIBBON_ITEM;
    const itemIsAZoomOptionsButton = flyoutItem.dataElement === 'zoomOptionsButton';
    const itemsToRender = isChild ? activeItem.children : items;

    const getFlyoutItemWrapper = (elementDOM, additionalClass) => {
      return (
        <div key={flyoutItem.label} data-element={flyoutItem.dataElement}
          onClick={onClickHandler(flyoutItem, isChild)}
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
    if (itemIsAZoomOptionsButton) {
      const zoomOptionsElement = (
        <>
          <div className="menu-container">
            <ZoomText />
          </div>
          {flyoutItem.children && <Icon className="icon-open-submenu" glyph="icon-chevron-right" />}
        </>
      );
      return getFlyoutItemWrapper(zoomOptionsElement, 'zoom-options');
    }
    return (flyoutItem === ITEM_TYPE.DIVIDER ? <div className="divider" key={`divider-${index}`} /> : (
      <div key={flyoutItem.label} className="flyout-item-container"
        data-element={flyoutItem.dataElement} onClick={onClickHandler(flyoutItem, isChild)}>
        <div className="menu-container">
          {
            itemIsATool ? (
              // We should update when we have the customizable Tool Button component
              <ToolButton
                className={classNames({ ZoomItem: true })}
                role="option"
                toolName={flyoutItem.toolName}
                label={flyoutItem.label}
                img={flyoutItem.icon}
              />
            ) : (
              <div className="icon-label-wrapper">
                {getIconDOMElement(flyoutItem, itemsToRender)}
                {<div className="flyout-item-label">{t(flyoutItem.label)}</div>}
              </div>
            )
          }
        </div>
        {getSubMenuDOMElement(flyoutItem, itemsToRender)}
      </div>
    ));
  };

  const renderBackButton = () => {
    const isZoomOptions = activeItem.dataElement === 'zoomOptionsButton';
    return <div className="back-button-container" onClick={() => setActiveItem(null)}>
      <Icon glyph="icon-chevron-left" />
      {isZoomOptions ? <ZoomText /> : <div className="back-button-label">{t('action.back')}</div>}
    </div>;
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
    maxHeight: maxHeightValue
  };

  return (
    <div className="Flyout" data-element={dataElement} ref={flyoutRef} style={flyoutStyles}>
      <div id="FlyoutContainer"
        className={classNames({
          'FlyoutContainer': true,
          [className]: true
        })}>
        {activeItem ? (
          <>
            {renderBackButton()}
            {activeItem.children.map(((activeChild, index) => renderFlyoutItem(activeChild, index, true)))}
          </>
        ) :
          items.map((flyoutItem, index) => renderFlyoutItem(flyoutItem, index))
        }
      </div>
    </div>
  );
};

export default Flyout;
