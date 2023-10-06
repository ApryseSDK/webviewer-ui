import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Measure from 'react-measure';
import selectors from 'selectors';
import classNames from 'classnames';
import { ALIGNMENT, ITEM_TYPE, DIRECTION, DEFAULT_GAP } from 'constants/customizationVariables';
import actions from 'actions';
import InnerItem from '../InnerItem';
import ToggleElementButton from '../ToggleElementButton';
import { getItemsToHide, getResponsiveItems, isThereAvailableSpace } from '../Helpers/responsiveness-helper';
import './GroupedTools.scss';

const GroupedTools = (props) => {
  const {
    dataElement,
    items,
    headerDirection,
    gap = DEFAULT_GAP,
    grow = 0,
    alignment = ALIGNMENT.START,
    uniqueID,
  } = props;

  const OVERFLOW_FLYOUT = 'GroupedToolsOverflowFlyout';
  const overflowFlyoutIdentifier = `${OVERFLOW_FLYOUT}-${uniqueID}`;
  const moreButtonIdentifier = `${uniqueID}-moreItemsButton`;
  const dispatch = useDispatch();
  const moreButtonDefaultIcon = 'icon-tools-more';
  const [itemsGap, setItemsGap] = useState(gap);
  const itemValidTypes = Object.values(ITEM_TYPE);
  const validItems = items?.filter((item) => {
    const itemType = item?.type || item?.props?.type;
    return itemValidTypes.includes(itemType);
  });
  const [moreButtonIcon, setMoreButtonIcon] = useState(moreButtonDefaultIcon);
  const [itemsWidth, setItemsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [itemsHeight, setItemsHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [overflowItems, setOverflowItems] = useState([]);
  const [visibleItems, setVisibleItems] = useState(
    items?.filter((item, index) => {
      const itemType = item.type || item.props.type;
      if (itemType !== ITEM_TYPE.TOOL_GROUP_BUTTON) {
        const dataElement = item.dataElement || item.props.dataElement;
        console.warn(`${dataElement} is not a valid tool button item.`);
      }
      item.sortIndex = index;
      return itemType === ITEM_TYPE.TOOL_GROUP_BUTTON;
    }),
  );

  const visibleItemsRef = useRef();
  const containerRef = useRef();
  const moreButtonRef = useRef();

  const [flyoutMap, activeToolName] = useSelector((state) => [
    selectors.getFlyoutMap(state),
    selectors.getActiveToolName(state),
  ]);

  const parentRect = containerRef?.current?.parentElement?.getBoundingClientRect();
  const parentWidth = parentRect?.width;
  const parentHeight = parentRect?.height;

  useEffect(() => {
    // close flyout when visible items change so we don't get left with an open empty flyout
    dispatch(actions.closeElements([overflowFlyoutIdentifier]));
    const isHorizontalHeader = headerDirection === DIRECTION.ROW;
    const itemsShown = visibleItemsRef?.current?.getElementsByClassName('ToolGroupButton');
    const moreButtonRect = moreButtonRef.current.getBoundingClientRect();
    const availableSpace = isThereAvailableSpace(itemsShown, parentRect, headerDirection, alignment);
    const sizeNeededForButton = isHorizontalHeader ? moreButtonRect.width + gap : moreButtonRect.height + gap;

    if (availableSpace < sizeNeededForButton && visibleItems.length > 1) {
      const minAvailableSpaceRequired = availableSpace - sizeNeededForButton;
      const itemsToHide = getItemsToHide(visibleItems, itemsShown, minAvailableSpaceRequired, headerDirection);
      moveItemsToOverflow(itemsToHide);
    } else if (overflowItems.length > 0) {
      const shownItems = [].slice.call(itemsShown);
      const largestItem = shownItems.reduce((largestItem, item) => {
        if (isHorizontalHeader) {
          return largestItem.getBoundingClientRect().width > item.getBoundingClientRect().width ? largestItem : item;
        }
        return largestItem.getBoundingClientRect().height > item.getBoundingClientRect().height ? largestItem : item;
      });

      const spaceForLargestItem = (isHorizontalHeader
        ? largestItem.getBoundingClientRect().width
        : largestItem.getBoundingClientRect().height) + gap;
      if (availableSpace > spaceForLargestItem + sizeNeededForButton) {
        moveItemsToContainer([overflowItems[0]]);
      }
    }

    setOverflowFlyout();
  }, [
    parentWidth,
    itemsWidth,
    containerWidth,
    parentHeight,
    itemsHeight,
    containerHeight,
    visibleItemsRef,
    containerRef,
    moreButtonRef,
    activeToolName,
  ]);

  useEffect(() => {
    handleMoreButtonIcon(activeToolName);
  }, [activeToolName]);

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const handleMoreButtonIcon = (item) => {
    if (isItemIntoOverflow(item)) {
      setMoreButtonIcon('icon-tools-more-active');
    } else {
      setMoreButtonIcon(moreButtonDefaultIcon);
    }
  };

  const isItemIntoOverflow = (activeItem) => {
    let isItemIntoOverflow = false;
    overflowItems.forEach((item) => {
      item?.tools.forEach((tool) => {
        if (tool.toolName === activeItem) {
          isItemIntoOverflow = true;
        }
      });
    });

    return isItemIntoOverflow;
  };

  const moveItemsToOverflow = (items) => {
    if (items) {
      setOverflowItems(getResponsiveItems(items, overflowItems, true));
      setVisibleItems(getResponsiveItems(items, visibleItems, false));
    }
  };

  const moveItemsToContainer = (items) => {
    if (items) {
      setOverflowItems(getResponsiveItems(items, overflowItems, false));
      setVisibleItems(getResponsiveItems(items, visibleItems, true));
    }
  };

  const setOverflowFlyout = () => {
    const OverflowFlyout = {
      dataElement: overflowFlyoutIdentifier,
      className: OVERFLOW_FLYOUT,
      items: getOverflowItems(),
    };
    if (flyoutMap[overflowFlyoutIdentifier]) {
      dispatch(actions.updateFlyout(overflowFlyoutIdentifier, OverflowFlyout));
    } else {
      dispatch(actions.addFlyout(OverflowFlyout, overflowFlyoutIdentifier));
    }
  };

  const getOverflowItems = () => {
    const items = overflowItems.map((item, index) => {
      if (item.tools.length > 1) {
        item.children = item.tools;
      }
      item.onClick = () => {
        handleMoreButtonIcon(item.tools[0].toolName);
        dispatch(actions.closeElements([overflowFlyoutIdentifier]));
      };
      item.key = `${overflowFlyoutIdentifier}-${index}`;
      return item;
    });
    return items;
  };

  const renderContainerItems = () => {
    return visibleItems.map((item) => {
      const itemProps = item.props || item;
      return <InnerItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} headerDirection={headerDirection} callHandleClick={handleMoreButtonIcon} />;
    });
  };

  if (validItems && validItems.length) {
    return (
      <div className={'GroupedTools'}
        data-element={dataElement}
        style={{
          gap: `${itemsGap}px`,
          flexDirection: headerDirection,
          justifyContent: alignment,
          flexGrow: grow
        }}>
        <Measure
          bounds
          innerRef={containerRef}
          onResize={({ bounds }) => {
            setContainerWidth(bounds.width);
            setContainerHeight(bounds.height);
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={'ResponsiveContainer'}>
              <Measure
                bounds
                innerRef={visibleItemsRef}
                onResize={({ bounds }) => {
                  setItemsWidth(bounds.width);
                  setItemsHeight(bounds.height);
                }}
              >
                {({ measureRef }) => (
                  <div className={'ResponsiveContainer__wrapper'} ref={measureRef} data-element={dataElement}>
                    <div
                      className={classNames({
                        'ResponsiveContainerContent': true,
                        'hidden': visibleItems.length <= 1 && overflowItems.length > 0,
                      })}
                      style={{
                        gap: `${itemsGap}px`,
                        flexDirection: headerDirection,
                      }}
                      onFocus={() => {
                        setOverflowFlyout();
                      }}
                    >
                      <div className='ItemsContainer' style={{ display: 'flex', flexDirection: headerDirection }}>
                        {renderContainerItems()}
                      </div>
                      <div
                        ref={moreButtonRef}
                        className={classNames({
                          'ResponsiveContainer__moreButton': true,
                          'hidden': overflowItems.length === 0,
                        })}
                      >
                        <ToggleElementButton
                          dataElement={moreButtonIdentifier}
                          toggleElement={overflowFlyoutIdentifier}
                          title="action.more"
                          img={moreButtonIcon}
                        />
                      </div>
                    </div>
                  </div>
                )}
              </Measure>
            </div>

          )}
        </Measure>
      </div>);
  }
  return null;
};

GroupedTools.propTypes = {
  dataElement: PropTypes.string,
  items: PropTypes.array,
  headerDirection: PropTypes.string,
  gap: PropTypes.number,
  grow: PropTypes.number,
  alignment: PropTypes.string,
  uniqueID: PropTypes.string,
};

export default GroupedTools;