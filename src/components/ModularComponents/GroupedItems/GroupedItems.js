import React, { useState, useEffect, useRef, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import './GroupedItems.scss';
import InnerItem from '../InnerItem/InnerItem';
import { JUSTIFY_CONTENT, ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import actions from 'actions';
import sizeManager, { useSizeStore } from 'helpers/responsivenessHelper';
import { itemToFlyout } from 'helpers/itemToFlyoutHelper';
import selectors from 'selectors';
import ToggleElementButton from '../ToggleElementButton';
import core from 'core';

const GroupedItems = (props) => {
  const {
    dataElement,
    items,
    headerDirection,
    gap = DEFAULT_GAP,
    justifyContent = JUSTIFY_CONTENT.START,
    grow = 0,
    alwaysVisible = false,
    style,
  } = props;
  const dispatch = useDispatch();
  const [itemsGap, setItemsGap] = useState(gap);

  const validItems = useMemo(() => {
    const itemValidTypes = Object.values(ITEM_TYPE);
    return items?.filter((item) => {
      const itemType = item.type || item.props.type;
      return itemValidTypes.includes(itemType);
    });
  }, [items]);

  const flyoutDataElement = `${dataElement}Flyout`;
  const activeGroupedItems = useSelector(selectors.getActiveGroupedItems);
  const activeToolName = useSelector(selectors.getActiveToolName);
  const alwaysVisibleGroupedItems = useSelector(selectors.getAlwaysVisibleGroupedItems);
  const flyoutItems = useSelector((state) => selectors.getFlyoutMap(state)[flyoutDataElement]?.items);

  const moreButtonDefaultIcon = 'icon-tools-more';
  const moreButtonActiveIcon = 'icon-tools-more-active';
  const [moreButtonIcon, setMoreButtonIcon] = useState(moreButtonDefaultIcon);

  const findActiveToolInFlyout = (flyoutItems) => {
    const activeTool = core.getToolMode();
    if (!flyoutItems) {
      return;
    }
    for (const item of flyoutItems) {
      if (item.toolName && item.toolName === activeTool?.name) {
        return item;
      }
      if (item.children) {
        const found = findActiveToolInFlyout(item.children);
        if (found) {
          return found;
        }
      }
    }
  };

  const handleMoreButtonIcon = () => {
    const isActiveToolInFlyout = findActiveToolInFlyout(flyoutItems);
    const isGroupedItemsActive = activeGroupedItems?.includes(dataElement) || alwaysVisibleGroupedItems?.includes(dataElement);
    if (size > 0 && isActiveToolInFlyout && isGroupedItemsActive) {
      setMoreButtonIcon(moreButtonActiveIcon);
    } else {
      setMoreButtonIcon(moreButtonDefaultIcon);
    }
  };

  useEffect(() => {
    if (alwaysVisible) {
      dispatch(actions.setFixedGroupedItems(dataElement));
    }
  }, []);

  const elementRef = useRef();
  const size = useSelector((state) => selectors.getCustomElementSize(state, dataElement));
  useEffect(() => {
    const responsiveItems = validItems.filter((item) => item.type !== ITEM_TYPE.DIVIDER);
    sizeManager[dataElement] = {
      ...(sizeManager[dataElement] ? sizeManager[dataElement] : {}),
      canGrow: size > 0,
      canShrink: size < validItems.length - 1 && responsiveItems.length > 2,
      grow: () => {
        const newSize = size - 1;
        dispatch(actions.setCustomElementSize(dataElement, newSize < 0 ? 0 : newSize));
      },
      shrink: () => {
        dispatch(actions.setCustomElementSize(dataElement, size + 1));
      },
      size: size,
    };
    handleMoreButtonIcon();
  }, [size, items, activeToolName]);

  useSizeStore({ dataElement, elementRef, headerDirection });

  useEffect(() => {
    const flyout = {
      dataElement: flyoutDataElement,
      className: 'GroupedItemsFlyout',
      items: [],
    };
    if (size > 0) {
      const indexToExclude = validItems.length - size;
      for (let i = 0; i < validItems.length; i++) {
        const item = validItems[i];
        if (i < indexToExclude) {
          continue;
        }
        const flyoutItem = itemToFlyout(item);
        if (flyoutItem) {
          flyout.items.push(flyoutItem);
        }
      }
    }
    flyout.items.length > 0 ? dispatch(actions.updateFlyout(flyoutDataElement, flyout)) : dispatch(actions.removeFlyout(flyoutDataElement));
  }, [size, validItems]);

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const renderedItems = useMemo(() => {
    return validItems.map((item, index) => {
      const hasToShrink = size > 0;
      const indexesToExclude = validItems.length - size;
      const isLastIndexAndDivider = index === indexesToExclude - 1 && item.type === ITEM_TYPE.DIVIDER;
      const shouldExcludeIndex = index >= indexesToExclude || isLastIndexAndDivider;
      if (hasToShrink && shouldExcludeIndex) {
        return null;
      }
      const itemProps = item.props || item;
      return <InnerItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} headerDirection={headerDirection}
        groupedItem={dataElement}/>;
    });
  }, [validItems, size]);

  if (validItems && validItems.length) {
    return (
      <div className={'GroupedItems'}
        ref={elementRef}
        data-element={dataElement}
        style={{
          gap: `${itemsGap}px`,
          flexDirection: headerDirection,
          justifyContent: justifyContent,
          flexGrow: grow,
          ...style,
        }}>
        {renderedItems}
        {size > 0 &&
          <ToggleElementButton
            dataElement={`${flyoutDataElement}Toggle`}
            toggleElement={flyoutDataElement}
            title="action.more"
            img={moreButtonIcon} />
        }
      </div>);
  }
  return null;
};

GroupedItems.propTypes = {
  dataElement: PropTypes.string,
  items: PropTypes.array,
  overflowLabel: PropTypes.string,
  gap: PropTypes.number,
  headerDirection: PropTypes.string
};

export default GroupedItems;