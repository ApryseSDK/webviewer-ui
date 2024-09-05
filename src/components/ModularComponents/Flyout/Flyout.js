import React, { useCallback, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import selectors from 'selectors';
import classNames from 'classnames';
import './Flyout.scss';
import useOnClickOutside from 'hooks/useOnClickOutside';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import { FLYOUT_ITEM_HEIGHT } from 'constants/flyoutConstants';
import { DEFAULT_GAP } from 'constants/customizationVariables';
import getRootNode from 'helpers/getRootNode';
import ZoomText from './flyoutHelpers/ZoomText';
import { getFlyoutPositionOnElement } from 'helpers/flyoutHelper';
import FlyoutItem from 'components/ModularComponents/Flyout/flyoutHelpers/FlyoutItem';
import DataElements from 'src/constants/dataElement';
import useFocusOnClose from 'src/hooks/useFocusOnClose';
import { getFlyoutItemType } from 'src/helpers/itemToFlyoutHelper';
import Icon from 'src/components/Icon';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const isFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, activeFlyout), shallowEqual);
  const position = useSelector(selectors.getFlyoutPosition, shallowEqual);
  const toggleElement = useSelector(selectors.getFlyoutToggleElement);
  const topHeadersHeight = useSelector(selectors.getTopHeadersHeight);
  const bottomHeadersHeight = useSelector(selectors.getBottomHeadersHeight);
  const customizableUI = useSelector(selectors.getFeatureFlags)?.customizableUI;

  const flyoutProperties = flyoutMap[activeFlyout];
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;
  const { dataElement, items, className } = flyoutProperties;
  const [activePath, setActivePath] = useState([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);

  let activeItem = null;
  for (const index of activePath) {
    activeItem = activeItem ? activeItem.children[index] : items[index];
  }

  const flyoutRef = useRef(null);
  const flyoutItemRef = useRef(null);
  const [correctedPosition, setCorrectedPosition] = useState(position);
  const [maxHeightValue, setMaxHeightValue] = useState(window.innerHeight - horizontalHeadersUsedHeight);

  const itemsToRender = items.filter((item) => !item.hidden);
  const activeChildren = activeItem ? activeItem.children.filter((child) => !child.hidden) : [];

  const getElementDOMRef = (dataElement) => {
    return getRootNode().querySelector(`[data-element="${dataElement}"]`);
  };

  useLayoutEffect(() => {
    const tempRefElement = getElementDOMRef(toggleElement);
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

  useEffect(() => {
    if (flyoutRef.current) {
      const focusableElements = flyoutRef.current.querySelectorAll('button:not([disabled]), input:not([disabled])');
      if (focusableElements.length) {
        focusableElements[0].focus();
        setCurrentFocusIndex(0);
        setFocusableElements(focusableElements);
      }
    }
  }, [activePath, flyoutRef.current]);

  const closeFlyout = useFocusOnClose(useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
  }, [dispatch, activeFlyout]));

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getElementDOMRef(toggleElement);
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
      try {
        flyoutItem.onClick();
      } catch (error) {
        console.error(error);
      }

      if (!flyoutItem.children && dataElement !== DataElements.VIEWER_CONTROLS_FLYOUT) {
        closeFlyout();
      }
    }
  };

  const moveFocus = (delta) => {
    const newFocusIndex = (currentFocusIndex + delta + focusableElements.length) % focusableElements.length;
    const newFocusableItem = focusableElements[newFocusIndex];
    newFocusableItem.focus();
    setCurrentFocusIndex(newFocusIndex);
  };

  const onKeyDownHandler = (e) => {
    if (e.shiftKey && e.key === 'Tab') {
      e.preventDefault();
      closeFlyout();
    } else {
      switch (e.code) {
        case 'ArrowDown':
          e.preventDefault();
          moveFocus(1);
          break;
        case 'ArrowUp':
          e.preventDefault();
          moveFocus(-1);
          break;
        case 'Home':
          e.preventDefault();
          setCurrentFocusIndex(0);
          break;
        case 'End':
          e.preventDefault();
          setCurrentFocusIndex(itemsToRender.length - 1);
          break;
        case 'Escape':
        case 'Tab':
          e.preventDefault();
          closeFlyout();
          break;
        case 'Enter':
        case 'Space': {
          e.preventDefault();
          const focusedElement = focusableElements[currentFocusIndex];
          const elementType = focusedElement.tagName.toLowerCase();

          if (elementType === 'button') {
            focusedElement.click();
          } else if (elementType === 'input') {
            focusedElement.parentNode.dispatchEvent(new Event('submit', { bubbles: true }));
          }
          break;
        }
        default:
          break;
      }
    }
  };

  const renderBackButton = () => {
    const isZoomOptions = activeItem.dataElement === 'zoomOptionsButton';
    return (
      <li data-element={activeItem.dataElement} className='flyout-item-container'>
        <button
          className="flyout-item back-button"
          onClick={() => {
            const newActivePath = [...activePath];
            newActivePath.pop();
            setActivePath(newActivePath);
          }}
          onKeyDown={onKeyDownHandler}
        >
          <Icon glyph="icon-chevron-left" />
          {isZoomOptions ? <ZoomText /> : <span className="back-button-label">{t('action.back')}</span>}
        </button>
      </li>
    );
  };

  const renderItems = (itemList, isChild = false) => {
    return itemList.map((item, index) => {
      const itemType = getFlyoutItemType(item);
      return (
        <FlyoutItem
          ref={currentFocusIndex === index ? flyoutItemRef : null}
          flyoutItem={item}
          index={index}
          key={item?.dataElement || index}
          isChild={isChild}
          onClickHandler={onClickHandler}
          onKeyDownHandler={onKeyDownHandler}
          activeItem={activeItem}
          items={itemsToRender}
          activeFlyout={activeFlyout}
          type={itemType}
        />
      );
    });
  };

  const flyoutStyles = {
    left: correctedPosition.x,
    top: correctedPosition.y,
    maxHeight: maxHeightValue
  };

  if (!activeItem && !itemsToRender.length) {
    return null;
  }

  return (
    isFlyoutOpen &&
    <div
      className={classNames({
        'Flyout': true,
        'legacy-ui': !customizableUI,
      })}
      data-element={dataElement}
      ref={flyoutRef}
      style={flyoutStyles}
    >
      <menu
        id='FlyoutContainer'
        className={classNames({
          FlyoutContainer: true,
          [className]: true,
        })}
      >
        {activeItem ? (
          <>
            {renderBackButton()}
            {renderItems(activeChildren, true)}
          </>
        ) : (
          renderItems(itemsToRender)
        )}
      </menu>
    </div>
  );
};

export default Flyout;