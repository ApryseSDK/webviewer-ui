import React, { useEffect, useState, useRef, useMemo } from 'react';
import './ModularHeaderItems.scss';
import InnerItem from '../ModularComponents/InnerItem';
import { PLACEMENT, DIRECTION, ITEM_TYPE } from 'constants/customizationVariables';
import ResponsiveContainer from 'components/ResponsiveContainer';
import { useSelector, useDispatch } from 'react-redux';
import sizeManager, { useSizeStore } from 'helpers/responsivenessHelper';
import { itemToFlyout } from 'helpers/itemToFlyoutHelper';
import selectors from 'selectors';
import actions from 'actions';
import ToggleElementButton from 'components/ModularComponents/ToggleElementButton';
import PropTypes from 'prop-types';

const ModularHeaderItems = (props) => {
  const dispatch = useDispatch();
  const { placement, gap, items, justifyContent, className = '', maxWidth, maxHeight, headerId } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const elementRef = useRef();
  const headerDirection = [PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(placement) ? DIRECTION.COLUMN : DIRECTION.ROW;

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const flyoutDataElement = `${headerId}Flyout`;
  const size = useSelector((state) => selectors.getCustomElementSize(state, headerId));
  const disabledElements = useSelector(selectors.getDisabledElements);

  useEffect(() => {
    sizeManager[headerId] = {
      ...(sizeManager[headerId] ? sizeManager[headerId] : {}),
      canGrow: size > 0,
      canShrink: size < items.length,
      grow: () => {
        const newSize = size - 1;
        dispatch(actions.setCustomElementSize(headerId, newSize < 0 ? 0 : newSize));
      },
      shrink: () => {
        dispatch(actions.setCustomElementSize(headerId, size + 1));
      },
      size: size,
    };
  }, [size, items]);
  useEffect(() => {
    const flyout = {
      dataElement: flyoutDataElement,
      className: 'GroupedItemsFlyout',
      items: [],
    };
    if (size > 0) {
      const indexToExclude = items.length - size;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
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
  }, [size, items]);
  useSizeStore({
    elementRef,
    dataElement: headerId,
    headerDirection,
  });

  const headerItems = useMemo(() => items?.filter((item) => !disabledElements[item.dataElement]?.disabled).map((item, index) => {
    const hasToShrink = size > 0;
    const indexesToExclude = items.length - size;
    const isLastIndexAndDivider = index === indexesToExclude - 1 && item.type === ITEM_TYPE.DIVIDER;
    const shouldExcludeIndex = index >= indexesToExclude || isLastIndexAndDivider;
    if (hasToShrink && shouldExcludeIndex) {
      return null;
    }
    /**
     * We can think on a better solution later, but this is necessary
     * because the user can either instantiate a CustomButton and add it
     * to the header or add the plain object.
     */
    let itemProps = item.props || item;
    itemProps = { headerPlacement: placement, justifyContent: justifyContent, ...itemProps };
    const { type, dataElement } = itemProps;
    const key = `${type}-${dataElement || index}-wrapper-${index}`;
    return <InnerItem key={key} {...itemProps} headerDirection={headerDirection} />;
  }), [items, size, disabledElements]);

  return (
    <div className={`ModularHeaderItems ${className}`}
      ref={elementRef}
      style={{
        gap: `${itemsGap}px`,
        flexDirection: headerDirection,
        justifyContent: justifyContent,
        maxWidth: `${maxWidth}px`,
        maxHeight: `${maxHeight}px`,
      }}>
      <ResponsiveContainer headerDirection={headerDirection} elementRef={elementRef} parentDataElement={headerId}
        items={items}>
        {headerItems}
      </ResponsiveContainer>
      {size > 0 &&
        <ToggleElementButton
          dataElement={`${flyoutDataElement}Toggle`}
          toggleElement={flyoutDataElement}
          title="action.more"
          img="icon-double-chevron-down" />
      }
    </div>
  );
};

ModularHeaderItems.props = {
  items: PropTypes.arrayOf({
    dataElement: PropTypes.string.isRequired,
  }),
  placement: PropTypes.string,
  gap: PropTypes.any,
  justifyContent: PropTypes.string,
  className: PropTypes.string,
  maxWidth: PropTypes.any,
  maxHeight: PropTypes.any,
  headerId: PropTypes.string,
};

export default ModularHeaderItems;