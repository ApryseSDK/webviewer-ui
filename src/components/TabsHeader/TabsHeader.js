import React, { useEffect, useRef, useState, useMemo, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './TabsHeader.scss';
import Tab from 'components/TabsHeader/Tab/Tab';
import Button from 'components/Button';
import HoverTab from 'components/TabsHeader/HoverTab/HoverTab';
import FlyoutMenu from 'components/FlyoutMenu/FlyoutMenu';
import CollapsedTab from 'components/TabsHeader/CollapsedTab/CollapsedTab';
import ToggleElementButton from 'components/ToggleElementButton';
import classNames from 'classnames';
import useWindowDimensions from 'helpers/useWindowsDimensions';
import getRootNode from 'helpers/getRootNode';
import findFocusableElements from 'helpers/findFocusableElements';
import { removeFileNameExtension } from 'helpers/TabManager';
import { elementsHaveChanged, getElementToFocusOnIndex } from 'helpers/keyboardNavigationHelper';
import useFocusHandler from 'hooks/useFocusHandler';


const TabsHeader = () => {
  const dispatch = useDispatch();
  const [isDragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState();
  const [dropTarget, setDropTarget] = useState();
  const [hovering, setHovering] = useState();
  const [currentFocusIndex, setCurrentFocusIndex] = useState(-1);
  const [focusableElements, setFocusableElements] = useState([]);
  const prevFocusableElementsRef = useRef([]);
  const hoveredTab = useRef();
  const tabsHeaderRef = useRef();

  const tabNameHandler = useSelector(selectors.getTabNameHandler);
  const isMultiTab = useSelector(selectors.getIsMultiTab);
  const tabManager = useSelector(selectors.getTabManager);
  const currTabs = useSelector(selectors.getTabs, shallowEqual);
  const activeTab = useSelector(selectors.getActiveTab);
  const isEmptyPageOpen = useSelector((state) => selectors.getIsMultiTab(state) && selectors.getTabs(state).length === 0);

  const { width } = useWindowDimensions();

  const handleFocusIn = useCallback(() => {
    const focusedElement = getRootNode().activeElement;
    const newIndex = focusableElements.indexOf(focusedElement);
    if (newIndex !== -1) {
      setCurrentFocusIndex(newIndex);
    }
  }, [focusableElements, currentFocusIndex]);

  useEffect(() => {
    const headerElement = tabsHeaderRef.current;
    if (headerElement) {
      headerElement.addEventListener('focusin', handleFocusIn);
    }

    return () => {
      if (headerElement) {
        headerElement.removeEventListener('focusin', handleFocusIn);
      }
    };
  }, [tabsHeaderRef, handleFocusIn]);

  useEffect(() => {
    const div = document.createElement('div');
    div.id = '0';
    ReactDOM.render(<HoverTab onDragOver={onDragOverHoverTab} onDragLeave={onDragLeave} />, div);
    hoveredTab.current = div;
  }, []);

  const breakpoint = Math.floor((width - 80) / 180); // Browser width minus a space for the add button, divided by max-width of tab
  const activeIndex = currTabs?.findIndex((t) => t.id === activeTab);

  useEffect(() => {
    if (activeIndex >= breakpoint && breakpoint > 0 && tabManager) {
      tabManager.moveTab(activeIndex, breakpoint - 1);
    }
  }, [breakpoint, activeIndex, tabManager]);

  useEffect(() => {
    if (tabsHeaderRef.current) {
      const tabsHeader = getRootNode().querySelector('.TabsHeader');
      setFocusableElements(findFocusableElements(tabsHeader));
    }
  }, [tabsHeaderRef.current, currTabs]);

  useEffect(() => {
    if (tabsHeaderRef.current) {
      const tabsHeader = getRootNode().querySelector('.TabsHeader');
      if (tabsHeader) {
        const newFocusableElements = findFocusableElements(tabsHeader);

        if (elementsHaveChanged(newFocusableElements, prevFocusableElementsRef.current)) {
          if (!currentFocusIndex) {
            return;
          }
          const newCurrentFocusIndex = getElementToFocusOnIndex(newFocusableElements, prevFocusableElementsRef.current, currentFocusIndex);
          newFocusableElements[newCurrentFocusIndex]?.focus();
          prevFocusableElementsRef.current = newFocusableElements;
          setCurrentFocusIndex(newCurrentFocusIndex);
          setFocusableElements(newFocusableElements);
        }
      }
    }
  }, [currTabs, deleteTab]);

  const onDragStart = (e, index) => {
    if (isDragging) {
      return;
    }
    setDragging(true);
    setDragIndex(index);
    setDropTarget(index);
    e.dataTransfer.setData('text', '');
    e.dataTransfer.dropEffect = 'move';
    e.dataTransfer.effectAllowed = 'move';
  };

  const onDragOver = (e, index, fileName) => {
    e.preventDefault();
    e.stopPropagation();
    const id = `tab-${fileName}`;
    const element = e.currentTarget;
    const centerX = element.offsetLeft + element.offsetWidth / 2;
    const moveLeft = centerX >= e.pageX;
    if (index === dragIndex ||
      (index + 1 === dragIndex && !moveLeft) ||
      (index - 1 === dragIndex && moveLeft)) {
      return; // End because moving to same spot
    }
    hoveredTab.current.id = id;
    if (moveLeft && index > dragIndex && index !== 0) {
      setDropTarget(index - 1);
    } else if (!moveLeft && index < dragIndex && index !== currTabs.length - 1) {
      setDropTarget(index + 1);
    } else {
      setDropTarget(index);
    }
    moveLeft ? element.prepend(hoveredTab.current) : element.append(hoveredTab.current);
    setHovering(true);
  };

  const onDragOverHoverTab = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!hovering) {
      setHovering(true);
    }
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!getRootNode().querySelectorAll('.TabsHeader')[0]?.contains(e.target)) {
      hoveredTab.current.remove();
    }
    setHovering(false);
  };

  const onDrop = () => {
    setHovering(false);
    if (!isDragging || dragIndex === dropTarget) {
      return;
    }
    tabManager.moveTab(dragIndex, dropTarget);
    hoveredTab.current.remove();
  };

  const onDragEnd = () => {
    hoveredTab.current.remove();
    setDragging(false);
    setDragIndex(null);
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
    focusableElements[newFocusIndex].focus();
  };


  const handleArrowKey = (e, delta) => {
    e.preventDefault();
    moveFocus(delta);
  };

  const handleSpaceKey = (e) => {
    e.preventDefault();
    if (currentFocusIndex !== -1) {
      focusableElements[currentFocusIndex].click();
    }
  };

  const handleHomeKey = (e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      setCurrentFocusIndex(0);
      focusableElements[0].focus();
    }
  };

  const handleEndKey = (e) => {
    e.preventDefault();
    if (focusableElements.length > 0) {
      const lastIndex = focusableElements.length - 1;
      setCurrentFocusIndex(lastIndex);
      focusableElements[lastIndex].focus();
    }
  };

  const handleKeyDown = useCallback((e) => {
    const SpaceKey = ' ';
    const keyActions = {
      ArrowRight: () => handleArrowKey(e, 1),
      ArrowLeft: () => handleArrowKey(e, -1),
      Home: () => handleHomeKey(e),
      End: () => handleEndKey(e),
      [SpaceKey]: () => handleSpaceKey(e),
    };

    keyActions[e.key]?.();
  }, [currentFocusIndex, focusableElements]);

  const [tabs, additionalTabs] = useMemo(() => {
    if (!isMultiTab) {
      return [null, null];
    }
    const activeIndex = currTabs?.findIndex((t) => t.id === activeTab);
    if (activeIndex >= breakpoint && breakpoint > 0 && tabManager) {
      tabManager.moveTab(activeIndex, breakpoint - 1);
    }
    const renderedTabs = currTabs.map((tab, index) => {
      const isActive = tab.id === activeTab;
      const fileName = removeFileNameExtension(tab.options.filename);
      const tabId = `tab-${fileName}`;
      if (index < breakpoint) {
        return <Tab
          onDragStart={(e) => onDragStart(e, index)}
          onDragOver={(e) => onDragOver(e, index, fileName)}
          onDragLeave={onDragLeave}
          setActive={() => setActiveTab(tab.id)}
          key={tab.id}
          id={tabId}
          isActive={isActive}
          closeTab={(e) => {
            e.stopPropagation();
            deleteTab(tab.id);
          }}
          tab={tab}
          isToLeftOfActive={index === activeIndex - 1}
          ariaCurrent={isActive ? 'page' : undefined}
          tabNameHandler={tabNameHandler}
        />;
      }
      return <CollapsedTab
        onDragStart={(e) => onDragStart(e, index)}
        tab={tab}
        key={tab.id}
        id={tabId}
        closeTab={() => deleteTab(tab.id)}
        setActive={() => setActiveTab(tab.id)}
      />;
    });
    return [renderedTabs?.slice(0, breakpoint), renderedTabs?.slice(breakpoint, renderedTabs.length)];
  }, [tabManager, currTabs, breakpoint, setActiveTab, deleteTab, onDragEnd, onDragStart, onDragOver, onDragLeave]);

  async function setActiveTab(id) {
    dispatch(actions.closeElement('tabMenu'));
    const tabIndex = currTabs.findIndex((t) => t.id === id);
    if (tabIndex >= breakpoint) {
      tabManager.moveTab(tabIndex, breakpoint - 1);
    }
    activeTab !== id && await tabManager.setActiveTab(id, true);
  }

  function deleteTab(id) {
    tabManager.deleteTab(id, dispatch);
  }

  const openFile = useFocusHandler(() => dispatch(actions.openElement('OpenFileModal')));

  if (!isMultiTab) {
    return null;
  }
  return (
    <div className="TabsHeader"
      role="tablist"
      ref={tabsHeaderRef}
      tabIndex={-1}
      onDrop={onDrop}
      onDragEnd={onDragEnd}
      onKeyDown={handleKeyDown}
    >
      {tabs}
      <div className={classNames({
        'add-button': true,
        'add-button-with-label': isEmptyPageOpen,
      })}>
        {additionalTabs?.length > 0 && <ToggleElementButton
          className="dropdown-menu tab-dropdown-button"
          dataElement="tabTrigger"
          element="tabMenu"
          label={additionalTabs.length.toString()}
        />}
        <Button
          title="action.openFile"
          img="icon-menu-add"
          onClick={openFile}
          dataElement={'addTabButton'}
          tabIndex={-1}
          label={isEmptyPageOpen ? 'action.openFile' : ''}
        />
        {additionalTabs?.length > 0 && <FlyoutMenu
          menu="tabMenu"
          trigger="tabTrigger"
          onClose={undefined}
        >
          {additionalTabs}
        </FlyoutMenu>}
      </div>
    </div>
  );
};

export default TabsHeader;
