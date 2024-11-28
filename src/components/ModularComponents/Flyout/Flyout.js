import React, { useCallback, useState, useLayoutEffect, useRef, useEffect } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useFocusOnClose from 'hooks/useFocusOnClose';
import { FLYOUT_ITEM_HEIGHT } from 'constants/flyoutConstants';
import { DEFAULT_GAP, ITEM_TYPE, PRESET_BUTTONS_MODAL_TOGGLES } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import ZoomText from './flyoutHelpers/ZoomText';
import getRootNode from 'helpers/getRootNode';
import { getFlyoutPositionOnElement } from 'helpers/flyoutHelper';
import { getFlyoutItemType } from 'helpers/itemToFlyoutHelper';
import { isMobileSize } from 'helpers/getDeviceSize';
import { getElementToFocusOnIndex } from 'helpers/keyboardNavigationHelper';
import FlyoutItem from 'components/ModularComponents/Flyout/flyoutHelpers/FlyoutItem';
import Icon from 'components/Icon';
import './Flyout.scss';
import { Swipeable } from 'react-swipeable';

const Flyout = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const isMobile = isMobileSize();

  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const isFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, activeFlyout), shallowEqual);
  const position = useSelector(selectors.getFlyoutPosition, shallowEqual);
  const toggleElement = useSelector(selectors.getFlyoutToggleElement);
  const topHeadersHeight = useSelector(selectors.getTopHeadersHeight);
  const bottomHeadersHeight = useSelector(selectors.getBottomHeadersHeight);
  const customizableUI = useSelector(selectors.getFeatureFlags)?.customizableUI;
  const currentPage = useSelector(selectors.getCurrentPage);

  const flyoutProperties = flyoutMap[activeFlyout];
  const horizontalHeadersUsedHeight = topHeadersHeight + bottomHeadersHeight + DEFAULT_GAP;
  const { dataElement, items, className } = flyoutProperties;
  const [activePath, setActivePath] = useState([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);
  const [inputValue, setInputValue] = useState('');

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

  const getFocusableElements = () => {
    return flyoutRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), div[role="combobox"]:not([disabled])');
  };

  useLayoutEffect(() => {
    const tempRefElement = getElementDOMRef(toggleElement);
    const correctedPosition = { x: position.x, y: position.y };
    const appRect = getRootNode().getElementById('app').getBoundingClientRect();
    const maxHeightValue = appRect.height - horizontalHeadersUsedHeight;
    setMaxHeightValue(maxHeightValue);

    // Check if the element is in the dom or invisible
    if (tempRefElement && tempRefElement.offsetParent === null) {
      return;
    }

    const calculateAndSetPosition = () => {
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
    };

    // We should wait for the flyout to be rendered before calculating the position
    requestAnimationFrame(calculateAndSetPosition);
  }, [activeItem, position, items, inputValue]);

  useEffect(() => {
    if (flyoutRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length) {
        focusableElements[0].focus();
        setCurrentFocusIndex(0);
        setFocusableElements(focusableElements);
      }
    }
  }, [activePath, flyoutRef.current]);

  useEffect(() => {
    if (flyoutRef.current) {
      // This is to handle cases where the flyout items can be disabled while interacting with them,
      // for example the Page Controls flyout items can be disabled when the user is on the first or last page.
      const newFocusableElements = getFocusableElements();
      setFocusableElements(newFocusableElements);

      // If the current focused element is disabled, we need to find the next focusable element to focus on
      if (focusableElements[currentFocusIndex] !== newFocusableElements[currentFocusIndex]) {
        const newCurrentFocusIndex = getElementToFocusOnIndex(newFocusableElements, focusableElements, currentFocusIndex);
        newFocusableElements[newCurrentFocusIndex].focus();
        setCurrentFocusIndex(newCurrentFocusIndex);
      }
    }
  }, [currentPage]);

  const closeFlyout = useFocusOnClose(useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
    setActivePath([]);
  }, [dispatch, activeFlyout]));

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getElementDOMRef(toggleElement);
      const clickedMenuButton = menuButton?.contains(e.target);
      const isClickingColorPicker = e.target.closest('.ColorPickerOverlay');
      if (!clickedMenuButton && !isClickingColorPicker) {
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
        flyoutItem.onClick(e, dataElement);
      } catch (error) {
        console.error(error);
      }
      const isKeyboardEvent = e.nativeEvent.isKeyboardAction;
      const isModalToggle = PRESET_BUTTONS_MODAL_TOGGLES.includes(flyoutItem.dataElement);
      const shouldCloseFlyoutCases = dataElement !== DataElements.VIEW_CONTROLS_FLYOUT &&
        flyoutItem.type !== ITEM_TYPE.PAGE_NAVIGATION_BUTTON &&
        flyoutItem.dataElement !== DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER;

      if (!flyoutItem.children && shouldCloseFlyoutCases) {
        // keep open if keyboard event and modal toggle so we can transfer focus back and forth
        if (!(isKeyboardEvent && isModalToggle)) {
          closeFlyout();
        }
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
    const targetElement = e.target;
    const elementType = targetElement.tagName.toLowerCase();

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

          if (elementType === 'button') {
            // Trigger the button's onClick handler directly, passing an additional flag to identify it as a keyboard action
            const syntheticEvent = new Event('click', { bubbles: true, cancelable: true });
            syntheticEvent.isKeyboardAction = true;
            targetElement.dispatchEvent(syntheticEvent);
          } else if (elementType === 'input') {
            targetElement.parentNode.dispatchEvent(new Event('submit', { bubbles: true }));
          }
          break;
        }
        default:
          if (elementType === 'input') {
            setInputValue(targetElement.value);
          }
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
      const itemType = item.type ?? getFlyoutItemType(item);
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

  const onSwipeDown = () => {
    if (isMobile) {
      closeFlyout();
    }
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
    <Swipeable onSwipedDown={onSwipeDown} trackMouse preventDefaultTouchmoveEvent>
      <div
        className={classNames({
          'Flyout': true,
          'legacy-ui': !customizableUI,
          'mobile': isMobile,
        })}
        data-element={dataElement}
        ref={flyoutRef}
        style={!isMobile ? flyoutStyles : undefined}
      >
        {isMobile && <div className="swipe-indicator" />}
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
    </Swipeable>
  );
};

export default Flyout;