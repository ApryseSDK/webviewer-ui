import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { JUSTIFY_CONTENT, PLACEMENT, DEFAULT_GAP } from 'constants/customizationVariables';
import ModularHeaderItems from '../../ModularHeaderItems';
import './ModularHeader.scss';
import DataElementWrapper from 'src/components/DataElementWrapper';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import getRootNode from 'helpers/getRootNode';
import findFocusableElements from 'helpers/findFocusableElements';
import { elementsHaveChanged } from 'helpers/keyboardNavigationHelper';
import {
  SortableContext,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
const ModularHeader = React.forwardRef((props, ref) => {
  const {
    dataElement,
    placement,
    position = '', // This is to be used for floating headers
    items = [],
    gap = DEFAULT_GAP,
    justifyContent = JUSTIFY_CONTENT.START,
    style,
    autoHide = true,
    stroke,
  } = props;

  const isDisabled = useSelector((state) => selectors.isElementDisabled(state, dataElement));

  const [canRemoveItems, setCanRemoveItems] = useState(items.length > 0);
  const key = `${dataElement}-${placement}`;
  const internalRef = useRef(null);
  // Use passed ref or fallback to internalRef. Passed ref is used by left/right headers
  const headerRef = ref || internalRef;

  const [lastFocusIndex, setLastFocusIndex] = useState(-1);
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);

  const prevFocusableElementsRef = useRef([]);
  const isHorizontal = placement === PLACEMENT.TOP || placement === PLACEMENT.BOTTOM;

  let isClosed = false;
  if (!autoHide) {
    isClosed = false;
  } else if (!items.length) {
    isClosed = true;
  }

  let originalItems = [];
  if (canRemoveItems) {
    originalItems = items;
  }

  useEffect(() => {
    setCanRemoveItems(!isClosed);
  }, [isClosed]);

  const resetTabIndex = () => {
    if (headerRef.current && headerRef.current.tabIndex === -1) {
      headerRef.current.tabIndex = 0;
    }
  };

  const removeTabIndex = () => {
    if (headerRef.current && headerRef.current.tabIndex === 0) {
      headerRef.current.tabIndex = -1;
    }
  };

  useEffect(() => {
    if (headerRef.current) {
      const headerItemsContainer = headerRef.current.querySelector('.ModularHeaderItems');
      if (headerItemsContainer) {
        const elems = findFocusableElements(headerItemsContainer);

        if (elementsHaveChanged(elems, prevFocusableElementsRef.current)) {
          // Reset focus if elements change so that the user starts from the beginning if they change tool modes
          setCurrentFocusIndex(-1);
          setLastFocusIndex(-1);
        } else if (lastFocusIndex >= 0 && elems[lastFocusIndex]) {
          elems[lastFocusIndex].tabIndex = 0;
        }

        prevFocusableElementsRef.current = elems;
        setFocusableElements(elems);
      }
    }
  }, [headerRef.current, items, lastFocusIndex]);

  const updateTabIndexes = (focusedIndex) => {
    focusableElements.forEach((elem, index) => {
      elem.tabIndex = index === focusedIndex ? 0 : -1;
    });
  };

  const moveFocus = (delta) => {
    if (focusableElements.length === 0) {
      return;
    }

    let newFocusIndex = currentFocusIndex + delta;
    if (newFocusIndex < 0) {
      newFocusIndex = focusableElements.length - 1;
    } else if (newFocusIndex >= focusableElements.length) {
      newFocusIndex = 0;
    }

    setCurrentFocusIndex(newFocusIndex);
    setLastFocusIndex(newFocusIndex);
    focusableElements[newFocusIndex].focus();
    updateTabIndexes(newFocusIndex);

    removeTabIndex();
  };

  const handleTabKey = (e) => {
    if (e.shiftKey) {
      if (currentFocusIndex !== -1) {
        removeTabIndex();
      }
      setLastFocusIndex(currentFocusIndex);
      setCurrentFocusIndex(-1);
    } else {
      setLastFocusIndex(currentFocusIndex);
      setCurrentFocusIndex(-1);
      resetTabIndex();
    }
  };

  const handleHomeKey = (e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      setCurrentFocusIndex(0);
      setLastFocusIndex(0);
      focusableElements[0].focus();
      updateTabIndexes(0);
    }
  };

  const handleEndKey = (e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      const lastIndex = focusableElements.length - 1;
      setCurrentFocusIndex(lastIndex);
      setLastFocusIndex(lastIndex);
      focusableElements[lastIndex].focus();
      updateTabIndexes(lastIndex);
    }
  };

  const handleArrowKey = (e, delta) => {
    e.preventDefault();
    moveFocus(delta);
  };

  const handleKeyDown = useCallback((e) => {
    const keyActions = {
      Tab: () => handleTabKey(e),
      Home: () => handleHomeKey(e),
      End: () => handleEndKey(e),
    };

    if (keyActions[e.key]) {
      keyActions[e.key]();
      return;
    }

    if (isHorizontal) {
      const horizontalActions = {
        ArrowRight: () => handleArrowKey(e, 1),
        ArrowLeft: () => handleArrowKey(e, -1),
      };
      if (horizontalActions[e.key]) {
        horizontalActions[e.key]();
      }
    } else {
      const verticalActions = {
        ArrowDown: () => handleArrowKey(e, 1),
        ArrowUp: () => handleArrowKey(e, -1),
      };
      if (verticalActions[e.key]) {
        verticalActions[e.key]();
      }
    }
  }, [currentFocusIndex, focusableElements, isHorizontal]);

  const handleFocusIn = useCallback(() => {
    const focusedElement = getRootNode().activeElement;
    const newIndex = focusableElements.indexOf(focusedElement);

    if (newIndex !== -1) {
      setCurrentFocusIndex(newIndex);
      setLastFocusIndex(newIndex);
      updateTabIndexes(newIndex);
    }

    resetTabIndex();
  }, [focusableElements, currentFocusIndex, lastFocusIndex]);

  useEffect(() => {
    const headerElement = headerRef.current;
    if (headerElement) {
      headerElement.addEventListener('focusin', handleFocusIn);
    }

    return () => {
      if (headerElement) {
        headerElement.removeEventListener('focusin', handleFocusIn);
      }
    };
  }, [headerRef, handleFocusIn]);

  useEffect(() => {
    const activeElement = getRootNode().activeElement;

    const isFocusInCurrentHeader = activeElement && headerRef.current && headerRef.current.contains(activeElement);

    if (currentFocusIndex >= 0 && isFocusInCurrentHeader && focusableElements[currentFocusIndex]) {
      focusableElements[currentFocusIndex].focus();
      updateTabIndexes(currentFocusIndex);
    }
  }, [currentFocusIndex, focusableElements, headerRef]);

  if (isDisabled) {
    return null;
  }

  const itemsDataElements = useMemo(
    () => items.map((item) => item.dataElement),
    [items]);

  return (
    <SortableContext
      items={itemsDataElements}
      strategy={rectSortingStrategy}
    >
      <DataElementWrapper
        className={classNames({
          'ModularHeader': true,
          'closed': isClosed,
          'TopHeader': placement === PLACEMENT.TOP,
          'BottomHeader': placement === PLACEMENT.BOTTOM,
          'LeftHeader': placement === PLACEMENT.LEFT,
          'RightHeader': placement === PLACEMENT.RIGHT,
          'stroke': stroke,
        }, `${position}`)}
        data-element={dataElement}
        style={style}
        key={key}
        ref={headerRef}
        role="toolbar"
        aria-label={dataElement}
        aria-orientation={isHorizontal ? 'horizontal' : 'vertical'}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
      >
        <ModularHeaderItems
          className={classNames({ 'closed': isClosed })}
          items={originalItems}
          headerId={dataElement}
          gap={gap}
          placement={placement}
          justifyContent={justifyContent}
          parentRef={headerRef}
        />
      </DataElementWrapper>
    </SortableContext>
  );
});

ModularHeader.propTypes = {
  dataElement: PropTypes.string,
  placement: PropTypes.string,
  position: PropTypes.string,
  items: PropTypes.array,
  gap: PropTypes.number,
  justifyContent: PropTypes.string,
  style: PropTypes.object,
  autoHide: PropTypes.bool,
  stroke: PropTypes.bool,
};

ModularHeader.displayName = 'ModularHeader';

export default React.memo(ModularHeader);
