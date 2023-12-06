import React, { useCallback, useState, useLayoutEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import './Flyout.scss';
import Icon from 'components/Icon';
import ToolButton from 'components/ModularComponents/ToolButton';
import RibbonItem from '../RibbonItem';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT } from 'constants/flyoutConstants';
import { ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import getRootNode from 'helpers/getRootNode';
import ZoomText from '../Helpers/ZoomText';
import ToolGroupButton from '../ToolGroupButton';
import PageControlsFlyout from '../PageControls/PageControlsFlyout';
import { getIconDOMElement, getSubMenuDOMElement } from '../Helpers/responsiveness-helper';
import { getFlyoutPositionOnElement } from 'helpers/flyoutHelper';
import PresetButton from '../PresetButton';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [
    flyoutMap,
    activeFlyout,
    position,
    activeToolGroup,
    toggleElement,
    topHeadersHeight,
    bottomHeadersHeight,
    currentPage,
  ] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveFlyout(state),
    selectors.getFlyoutPosition(state),
    selectors.getActiveToolGroup(state),
    selectors.getFlyoutToggleElement(state),
    selectors.getTopHeadersHeight(state),
    selectors.getBottomHeadersHeight(state),
    selectors.getCurrentPage(state),
  ]);
  const flyoutProperties = flyoutMap[activeFlyout];
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;
  const {
    dataElement,
    items,
    className
  } = flyoutProperties;
  const [activePath, setActivePath] = useState([]);
  let activeItem = null;
  for (const index of activePath) {
    activeItem = activeItem ? activeItem.children[index] : items[index];
  }
  const flyoutRef = React.createRef();
  const [correctedPosition, setCorrectedPosition] = useState(position);
  const [maxHeightValue, setMaxHeightValue] = useState(window.innerHeight - horizontalHeadersUsedHeight);

  useLayoutEffect(() => {
    const tempRefElement = getRootNode().querySelector(`[data-element="${toggleElement}"]`);
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = getRootNode().getElementById('app').getBoundingClientRect();
    const maxHeightValue = appRect.height - horizontalHeadersUsedHeight;
    setMaxHeightValue(maxHeightValue);

    // Check if the elment is in the dom or invisible
    if (tempRefElement && tempRefElement.offsetParent === null) {
      return;
    }

    // Check if toggleElement is not null
    if (toggleElement && tempRefElement) {
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
  }, [activeItem, position, items]);


  const closeFlyout = useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
  }, [dispatch, activeFlyout]);

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getRootNode().querySelector(`[data-element="${toggleElement}"]`);
      const clickedMenuButton = menuButton?.contains(e.target);
      if (!clickedMenuButton) {
        closeFlyout();
      }
    },
    [closeFlyout, toggleElement],
  );

  useOnClickOutside(flyoutRef, onClickOutside);

  const onClickHandler = (flyoutItem, isChild, index) => (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (flyoutItem.children && flyoutItem !== activeItem) {
      const newActivePath = [...activePath];
      newActivePath.push(index);
      setActivePath(newActivePath);
    }
    if (flyoutItem.onClick) {
      flyoutItem.onClick();
    }
  };

  const renderFlyoutItem = (flyoutItem, index, isChild = false) => {
    const itemIsATool = !!flyoutItem.toolName;
    const itemIsAToolGroup = !!flyoutItem.toolGroup;
    const itemIsARibbonItem = flyoutItem.type === ITEM_TYPE.RIBBON_ITEM;
    const itemIsAPresetButton = flyoutItem.type === ITEM_TYPE.PRESET_BUTTON;
    const itemIsAZoomOptionsButton = flyoutItem.dataElement === 'zoomOptionsButton' || flyoutItem.className === 'ZoomFlyoutMenu';
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
        <>
          <div className="menu-container">
            {
              hasImg ? <div className="icon-label-wrapper">
                {getIconDOMElement(flyoutItem, itemsToRender)}
                <ZoomText/>
              </div> : <ZoomText/>
            }
          </div>
          {flyoutItem.children && <Icon className="icon-open-submenu" glyph="icon-chevron-right" />}
        </>
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

    return (flyoutItem === ITEM_TYPE.DIVIDER ? <div className="divider" key={`divider-${index}`} /> : (
      <div key={flyoutItem.label} className={classNames({
        'flyout-item-container': true,
        'active': flyoutItem.isActive,
      })}
      data-element={flyoutItem.dataElement} onClick={onClickHandler(flyoutItem, isChild, index)}>
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
                isFlyoutItem={true}
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
    return <div className="back-button-container" onClick={() => {
      const newActivePath = [...activePath];
      newActivePath.pop();
      setActivePath(newActivePath);
    }}>
      <Icon glyph="icon-chevron-left" />
      {isZoomOptions ? <ZoomText /> : <div className="back-button-label">{t('action.back')}</div>}
    </div>;
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
    maxHeight: maxHeightValue
  };

  return ((!activeItem && !items.length) ? null :
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
