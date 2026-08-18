import React, { useCallback, useState, useLayoutEffect, useRef, useEffect, isValidElement } from 'react';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import classNames from 'classnames';
import actions from 'actions';
import useOnClickOutside from 'hooks/useOnClickOutside';
import useFocusOnClose from 'hooks/useFocusOnClose';
import { ITEM_TYPE, PRESET_BUTTON_TYPES, PRESET_BUTTONS_MODAL_TOGGLES } from 'constants/customizationVariables';
import DataElements from 'constants/dataElement';
import ZoomText from './flyoutHelpers/ZoomText';
import getRootNode from 'helpers/getRootNode';
import { getFlyoutItemType } from 'helpers/itemToFlyoutHelper';
import { getElementToFocusOnIndex } from 'helpers/keyboardNavigationHelper';
import FlyoutItem from 'components/ModularComponents/Flyout/flyoutHelpers/FlyoutItem';
import Icon from 'components/Icon';
import './Flyout.scss';
import useCore from 'hooks/useCore';

const Flyout = ({ flyoutRef, shouldOverflow, recalculatePlacement }) => {
  const { core } = useCore();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const fallbackFlyoutRef = useRef(null);
  const resolvedFlyoutRef = flyoutRef || fallbackFlyoutRef;

  const flyoutMap = useSelector(selectors.getFlyoutMap, shallowEqual);
  const activeFlyout = useSelector(selectors.getActiveFlyout);
  const isFlyoutOpen = useSelector((state) => selectors.isElementOpen(state, activeFlyout), shallowEqual);
  const toggleElement = useSelector(selectors.getFlyoutToggleElement);
  const currentPage = useSelector(selectors.getCurrentPage);
  const isSignatureModalOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.SIGNATURE_MODAL));

  const flyoutProperties = flyoutMap[activeFlyout];
  const { dataElement, items, className } = flyoutProperties;
  const [activePath, setActivePath] = useState([]);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);
  const [inputValue, setInputValue] = useState('');

  let activeItem = null;
  for (const index of activePath) {
    activeItem = activeItem ? activeItem.children[index] : items[index];
  }

  const flyoutItemRef = useRef(null);

  const itemsToRender = items.filter((item) => !item.hidden);
  const activeChildren = activeItem ? activeItem.children.filter((child) => !child.hidden) : [];

  // Resolve the per-instance root from the flyout element itself. The module- level `rootNode` singleton in helpers/getRootNode.js is overwritten by whichever WebComponent called setRootNode last, so in multi-WC mode a keyless `getRootNode().querySelector(...)` returns the wrong instance's node and flyouts position themselves against the sibling instance.
  const getLocalRoot = () => resolvedFlyoutRef.current?.getRootNode?.() || getRootNode();

  const getElementDOMRef = (dataElement) => {
    return getLocalRoot().querySelector(`[data-element="${dataElement}"]`);
  };

  const getFocusableElements = () => {
    return resolvedFlyoutRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), div[role="combobox"]:not([disabled])');
  };

  const closeFlyout = useFocusOnClose(useCallback(() => {
    dispatch(actions.closeElements([activeFlyout]));
    setActivePath([]);
  }, [dispatch, activeFlyout]));

  // Placement and overflow are owned by FlyoutContainer. Retrigger them when the flyout's content changes (submenu navigation or typing) since that can change the rendered size.
  useLayoutEffect(() => {
    recalculatePlacement?.();
  }, [activePath, inputValue, recalculatePlacement]);

  // Reset submenu navigation when the flyout closes (e.g. when FlyoutContainer closes it because its toggle scrolled out of view) so it reopens at the root level.
  useEffect(() => {
    if (!isFlyoutOpen) {
      setActivePath([]);
    }
  }, [isFlyoutOpen]);

  useEffect(() => {
    if (resolvedFlyoutRef.current) {
      const focusableElements = getFocusableElements();
      if (focusableElements.length) {
        focusableElements[0].focus({ preventScroll: true });
        setCurrentFocusIndex(0);
        setFocusableElements(focusableElements);
      }
    }
  }, [activePath, resolvedFlyoutRef.current]);

  useEffect(() => {
    if (resolvedFlyoutRef.current) {
      // This is to handle cases where the flyout items can be disabled while interacting with them,
      // for example the Page Controls flyout items can be disabled when the user is on the first or last page.
      const newFocusableElements = getFocusableElements();
      setFocusableElements(newFocusableElements);

      // If the current focused element is disabled, we need to find the next focusable element to focus on
      if (focusableElements[currentFocusIndex] !== newFocusableElements[currentFocusIndex]) {
        const newCurrentFocusIndex = getElementToFocusOnIndex(newFocusableElements, focusableElements, currentFocusIndex);
        newFocusableElements[newCurrentFocusIndex].focus({ preventScroll: true });
        setCurrentFocusIndex(newCurrentFocusIndex);
      }
    }
  }, [currentPage]);

  const isPlacingSignatureOnDocument = (e) => {
    const toolMode = core.getToolMode();
    const isSignatureTool =  ['AnnotationCreateSignature', 'AnnotationCreateInitials'].includes(toolMode?.name);
    const isPlacingOnWidget = e.target.closest('[id^="SignatureFormField"]');
    const isPlacingOnDocument = e.target.id.startsWith('pageContainer') || e.target.id.startsWith('pageWidgetContainer');
    return isSignatureTool && (isPlacingOnWidget || isPlacingOnDocument);
  };

  const onClickOutside = useCallback(
    (e) => {
      const menuButton = getElementDOMRef(toggleElement);
      const clickedMenuButton = menuButton?.contains(e.target);
      const isClickingColorPicker = e.target.closest('.ColorPickerOverlay');
      const isClickingColorModal = e.target.closest('[data-element="ColorPickerModal"]');
      const isDrawingOrCreatingSignature = isSignatureModalOpen && (e.target.closest('.SignatureModal') || e.target.classList.contains('signature-create'));
      if (!clickedMenuButton && !isClickingColorPicker && !isClickingColorModal && !isPlacingSignatureOnDocument(e) && !isDrawingOrCreatingSignature) {
        closeFlyout();
      }
    },
    [closeFlyout, toggleElement, isSignatureModalOpen],
  );

  useOnClickOutside(resolvedFlyoutRef, onClickOutside);

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
        flyoutItem.dataElement !== DataElements.OFFICE_EDITOR_FLYOUT_COLOR_PICKER &&
        flyoutItem.dataElement !== DataElements.OFFICE_EDITOR_FLYOUT_HIGHLIGHT_COLOR_PICKER &&
        flyoutItem.buttonType !== PRESET_BUTTON_TYPES.OE_COLOR_PICKER;

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
      return;
    }

    switch (e.code) {
      case 'ArrowDown':
      case 'ArrowRight':
        e.preventDefault();
        moveFocus(1);
        break;
      case 'ArrowUp':
      case 'ArrowLeft':
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
          const inputType = targetElement.type?.toLowerCase();
          if (inputType === 'checkbox' || inputType === 'radio') {
            targetElement.click();
          } else {
            targetElement.parentNode.dispatchEvent(new Event('submit', { bubbles: true }));
          }
        }
        break;
      }
      default:
        if (elementType === 'input') {
          setInputValue(targetElement.value);
        }
        break;
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
      if (isValidElement(item)) {
        return item;
      }

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
          id={item?.id}
          labelledById={item?.labelledById}
        />
      );
    });
  };

  if (!activeItem && !itemsToRender.length) {
    return null;
  }

  const menuRef = flyoutRef ? undefined : resolvedFlyoutRef;

  return isFlyoutOpen && (
    <menu
      id='FlyoutContainer'
      ref={menuRef}
      className={classNames({
        FlyoutContainer: true,
        [className]: true,
        'overflow': shouldOverflow,
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
  );
};

Flyout.propTypes = {
  flyoutRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.any }),
  ]),
  shouldOverflow: PropTypes.bool,
  recalculatePlacement: PropTypes.func,
};

export default Flyout;