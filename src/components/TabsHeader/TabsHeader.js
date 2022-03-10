import React, { useEffect, useMemo, useRef, useState } from 'react';
import ReactDOM from 'react-dom';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import './TabsHeader.scss';
import Tab from "components/TabsHeader/Tab/Tab";
import Button from "components/Button";
import HoverTab from "components/TabsHeader/HoverTab/HoverTab";
import CollapsedTab from "components/TabsHeader/CollapsedTab/CollapsedTab";
import FlyoutMenu from "components/FlyoutMenu/FlyoutMenu";
import OpenFileModal from "components/OpenFileModal";


const TabsHeader = () => {
  const dispatch = useDispatch();
  const [isDragging, setDragging] = useState(false);
  const [dragIndex, setDragIndex] = useState();
  const [dropTarget, setDropTarget] = useState();
  const [hovering, setHovering] = useState();
  const hoveredTab = useRef();
  const [isMultiTab, tabManager, width] = useSelector(state => [
    selectors.getIsMultiTab(state),
    selectors.getTabManager(state),
    selectors.getDocumentContainerWidth(state),
  ]);

  const breakpoint = Math.floor(width / 180); // Divided by max-width of tab

  useEffect(() => {
    const div = document.createElement("div");
    div.id = "0";
    ReactDOM.render(<HoverTab onDragOver={onDragOverHoverTab} onDragLeave={onDragLeave}/>, div);
    hoveredTab.current = div;
  }, []);

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

  const onDragOver = (e, index, id) => {
    e.preventDefault();
    e.stopPropagation();
    const element = document.getElementById(`tab-${id}`);
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
    } else if (!moveLeft && index < dragIndex && index !== tabManager.tabs.length - 1) {
      setDropTarget(index + 1);
    } else {
      setDropTarget(index);
    }
    moveLeft ? element.prepend(hoveredTab.current) : element.append(hoveredTab.current);
    setHovering(true);
  };

  const onDragOverHoverTab = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!hovering) {
      setHovering(true);
    }
  };

  const onDragLeave = e => {
    e.preventDefault();
    e.stopPropagation();
    if (!document.getElementsByClassName('TabsHeader')[0]?.contains(e.target)) {
      hoveredTab.current.remove();
    }
    setHovering(false);
  };

  const onDrop = e => {
    setHovering(false);
    if (!isDragging || dragIndex === dropTarget) {
      return;
    }
    tabManager.moveTab(dragIndex, dropTarget);
    hoveredTab.current.remove();
  };

  const onDragEnd = e => {
    hoveredTab.current.remove();
    setDragging(false);
    setDragIndex(null);
  };

  const currTabs = tabManager?.tabs;
  const [tabs, additionalTabs] = useMemo(() => {
    if (!isMultiTab) {
      return [null, null];
    }
    const activeIndex = currTabs?.findIndex(t => t.id === tabManager.activeTab);
    if (activeIndex >= breakpoint && breakpoint > 0 && tabManager) {
      tabManager.moveTab(activeIndex, breakpoint - 1);
    }
    const renderedTabs = tabManager?.map((tab, index) => {
      if (index < breakpoint) {
        return <Tab
          onDragStart={e => onDragStart(e, index)}
          onDragOver={e => onDragOver(e, index, tab.id)}
          onDragLeave={onDragLeave}
          setActive={() => setActiveTab(tab.id)}
          key={tab.id}
          id={`tab-${tab.id}`}
          isActive={tab.id === tabManager.activeTab}
          closeTab={() => deleteTab(tab.id)}
          tab={tab}
          isToLeftOfActive={index === activeIndex - 1}
        />;
      } else {
        return <CollapsedTab
          onDragStart={e => onDragStart(e, index)}
          tab={tab}
          key={tab.id}
          id={`tab-${tab.id}`}
          closeTab={() => deleteTab(tab.id)}
          setActive={() => setActiveTab(tab.id)}
        />;
      }
    });
    return [renderedTabs?.slice(0, breakpoint), renderedTabs?.slice(breakpoint, renderedTabs.length)];
  }, [tabManager, currTabs, breakpoint, setActiveTab, deleteTab, onDragEnd, onDragStart, onDragOver, onDragLeave]);

  async function setActiveTab(id) {
    const tabIndex = tabManager.tabs.findIndex(t => t.id === id);
    if (tabIndex >= breakpoint) {
      tabManager.moveTab(tabIndex, breakpoint - 1);
    }
    tabManager.activeTab !== id && await tabManager.setActiveTab(id, dispatch,true);
  }

  function deleteTab(id) {
    tabManager.deleteTab(id, dispatch);
    // React will delete the element but it has a delay, line below is to prevent delay from being visible
    document.getElementById(`tab-${id}`).style.display = 'none';
  }

  const openFile = () => dispatch(actions.openElement("OpenFileModal"));

  if (!isMultiTab) {
    return null;
  }
  return (
    <div className="TabsHeader" onDrop={onDrop} onDragEnd={onDragEnd}>
      {tabs}
      <div className="add-button">
        {additionalTabs?.length > 0 && <div
          className={"dropdown-menu tab-dropdown-button"}
          onClick={() => dispatch(actions.toggleElement("tabMenu"))}
          data-element="tabTrigger"
        >
          {additionalTabs.length}
        </div>}
        <Button
          title="action.openFile"
          img="icon-menu-add"
          onClick={openFile}
        />
        {additionalTabs?.length > 0 && <FlyoutMenu
          menu="tabMenu"
          trigger="tabTrigger"
          onClose={undefined}
        >
          {additionalTabs}
        </FlyoutMenu>}
      </div>
      <OpenFileModal />
    </div>
  );
};

export default TabsHeader;