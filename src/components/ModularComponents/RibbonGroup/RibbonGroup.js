import React, { useState, useEffect, useLayoutEffect, useRef, useCallback } from 'react';
import PropTypes from 'prop-types';
import RibbonItem from '../RibbonItem';
import Measure from 'react-measure';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';
import FlexDropdown from '../FlexDropdown';
import { ITEM_TYPE, DIRECTION } from 'constants/customizationVariables';
import ToggleElementButton from '../ToggleElementButton';
import { isThereAvailableSpace, getResponsiveItems, getItemsToHide } from '../Helpers/responsiveness-helper';

import './RibbonGroup.scss';

const DEFAULT_DROPDOWN_HEIGHT = 72;

const validateItems = (items) => {
  items.filter((item, index) => {
    const itemType = item.type || item.props.type;
    if (itemType !== ITEM_TYPE.RIBBON_ITEM) {
      const dataElement = item.dataElement || item.props.dataElement;
      console.warn(`${dataElement} is not a valid ribbon item.`);
    }
    item.sortIndex = index;
    return itemType === ITEM_TYPE.RIBBON_ITEM;
  });
  return items;
};

const RibbonGroup = (props) => {
  const {
    dataElement,
    items,
    headerDirection,
    headerPlacement,
    gap = headerDirection === DIRECTION.COLUMN ? 12 : 20,
    justifyContent,
    grow = 0,
  } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const [ribbonsWidth, setRibbonsWidth] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const [ribbonsHeight, setRibbonsHeight] = useState(0);
  const [containerHeight, setContainerHeight] = useState(0);
  const [overflowItems, setOverflowItems] = useState([]);
  const [ribbonItems, setRibbonItems] = useState(
    validateItems(items)
  );
  const [currentToolbarGroup, flyoutMap] = useSelector((state) => [
    selectors.getCurrentToolbarGroup(state),
    selectors.getFlyoutMap(state),
  ]);

  const ribbonsRef = useRef();
  const containerRef = useRef();
  const moreButtonRef = useRef();

  const dispatch = useDispatch();

  const FLYOUT_NAME = 'RibbonOverflowFlyout';

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const moveItemsToOverflow = (items) => {
    if (items) {
      setOverflowItems(getResponsiveItems(items, overflowItems, true));
      setRibbonItems(getResponsiveItems(items, ribbonItems, false));
    }
  };

  const moveItemsToRibbon = (items) => {
    if (items) {
      setOverflowItems(getResponsiveItems(items, overflowItems, false));
      setRibbonItems(getResponsiveItems(items, ribbonItems, true));
    }
  };

  // Using parent size to determine if overflow is needed.
  // This could probably be replaced when we have a better way to determine the size of the header items.
  const parentRect = containerRef?.current?.parentElement?.getBoundingClientRect();
  const parentWidth = parentRect?.width;
  const parentHeight = parentRect?.height;

  useLayoutEffect(() => {
    // close flyout when ribbon groups change so we don't get left with an open empty flyout
    dispatch(actions.closeElements([FLYOUT_NAME]));
    const isHorizontalHeader = headerDirection === DIRECTION.ROW;
    const ribbonItemsShown = ribbonsRef?.current?.getElementsByClassName('RibbonItem');
    const moreButtonRect = moreButtonRef.current.getBoundingClientRect();
    const availableSpace = isThereAvailableSpace(ribbonItemsShown, parentRect, headerDirection, justifyContent);
    const sizeNeededForButton = isHorizontalHeader ? moreButtonRect.width + gap : moreButtonRect.height + gap;

    if (availableSpace < sizeNeededForButton && ribbonItems.length > 1) {
      let candidateItemsToHide = ribbonItems;
      if (currentToolbarGroup === ribbonItems.at(-1).toolbarGroup) {
        // If the last item is the current toolbar group, we don't want to hide it.
        candidateItemsToHide = ribbonItems.slice(0, -1);
      }
      const itemsToHide = getItemsToHide(candidateItemsToHide, ribbonItemsShown, availableSpace, headerDirection);
      moveItemsToOverflow(itemsToHide);
    } else if (overflowItems.length > 0) {
      const shownItems = [].slice.call(ribbonItemsShown);
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
        moveItemsToRibbon([overflowItems[0]]);
      }
    }

    setOverflowFlyout();
  }, [
    parentWidth,
    ribbonsWidth,
    containerWidth,
    parentHeight,
    ribbonsHeight,
    containerHeight,
    ribbonsRef,
    containerRef,
    moreButtonRef,
  ]);

  const setOverflowFlyout = () => {
    const RibbonOverflowFlyout = {
      dataElement: FLYOUT_NAME,
      className: FLYOUT_NAME,
      items: getOverflowItems(),
    };
    if (flyoutMap[FLYOUT_NAME]) {
      dispatch(actions.updateFlyout(FLYOUT_NAME, RibbonOverflowFlyout));
    }
  };

  const getOverflowItems = () => {
    const flyoutClosingItems = overflowItems.map((item) => {
      item.onClick = () => {
        moveItemsToRibbon([item]);
        dispatch(actions.closeElements([FLYOUT_NAME]));
      };
      return item;
    });
    return flyoutClosingItems;
  };

  const setToolbarGroup = useCallback(
    (group, pickTool) => {
      dispatch(actions.setToolbarGroup(group, pickTool));
    },
    [dispatch],
  );

  const renderRibbonItems = () => {
    return ribbonItems.map((item) => {
      const itemProps = item.props || item;
      itemProps.direction = headerDirection;
      itemProps.justifyContent = justifyContent;
      return <RibbonItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} />;
    });
  };

  const getArrowDirection = () => {
    switch (headerPlacement) {
      case 'top':
        return 'down';
      case 'bottom':
        return 'up';
      case 'left':
        return 'right';
      case 'right':
        return 'left';
    }
  };

  if (ribbonItems && ribbonItems.length) {
    return (
      <>
        <Measure
          bounds
          innerRef={containerRef}
          onResize={({ bounds }) => {
            setContainerWidth(bounds.width);
            setContainerHeight(bounds.height);
          }}
        >
          {({ measureRef }) => (
            <div ref={measureRef} className={'RibbonGroupContainer'} style={{ flexGrow: grow }}>
              <Measure
                bounds
                innerRef={ribbonsRef}
                onResize={({ bounds }) => {
                  setRibbonsWidth(bounds.width);
                  setRibbonsHeight(bounds.height);
                }}
              >
                {({ measureRef }) => (
                  <div className={'RibbonGroup__wrapper'} ref={measureRef} data-element={dataElement} style={{ display: 'flex', flexDirection: headerDirection, justifyContent: justifyContent }}>
                    <div
                      className={classNames({
                        'RibbonGroup': true,
                        'hidden': ribbonItems.length <= 1 && overflowItems.length > 0,
                      })}
                      style={{
                        gap: `${itemsGap}px`,
                        flexDirection: headerDirection,
                      }}
                      onFocus={() => {
                        setOverflowFlyout();
                      }}
                    >
                      {renderRibbonItems()}
                      <div
                        ref={moreButtonRef}
                        className={classNames({
                          'RibbonGroup__moreButton': true,
                          'hidden': overflowItems.length === 0,
                        })}
                      >
                        <ToggleElementButton
                          dataElement="moreRibbonsButton"
                          toggleElement={FLYOUT_NAME}
                          title="action.more"
                          img="icon-tools-more"
                        />
                      </div>
                    </div>
                    <div
                      className={classNames({
                        'RibbonGroup__dropdown': true,
                        'hidden': ribbonItems.length > 1 || overflowItems.length === 0,
                      })}
                    >
                      <FlexDropdown
                        dataElement={`${dataElement}Dropdown`}
                        width={headerDirection === DIRECTION.COLUMN ? containerWidth : undefined}
                        height={headerDirection === DIRECTION.COLUMN ? DEFAULT_DROPDOWN_HEIGHT : undefined}
                        direction={headerDirection}
                        placement={headerPlacement}
                        objects={validateItems(items)}
                        objectKey={'toolbarGroup'}
                        currentSelectionKey={currentToolbarGroup}
                        onClickItem={(toolbarGroup) => {
                          setToolbarGroup(toolbarGroup);
                        }}
                        arrowDirection={getArrowDirection()}
                      />
                    </div>
                  </div>
                )}
              </Measure>
            </div>
          )}
        </Measure>
      </>
    );
  }

  return null;
};

RibbonGroup.propTypes = {
  dataElement: PropTypes.string,
  items: PropTypes.array,
  overflowLabel: PropTypes.string,
  gap: PropTypes.number,
  headerDirection: PropTypes.string,
};

export default RibbonGroup;
