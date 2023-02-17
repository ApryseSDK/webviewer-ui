import React, { useEffect, useState } from 'react';
import selectors from 'selectors';
import { useSelector } from 'react-redux';
import './ModularHeaderItems.scss';
import InnerItem from '../ModularComponents/InnerItem';
import { PLACEMENT } from 'constants/customizationVariables';

const ModularHeaderItems = (props) => {
  const { placement, gap, items, alignment } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const [activeGroupedItems] = useSelector((state) => [
    selectors.getCurrentGroupedItems(state),
  ]);

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const headerDirection = [PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(placement) ? 'column' : 'row';

  const filteredItems = items?.filter((item) => {
    const itemProps = item.props || item;
    if (itemProps.type === 'groupedItems' && activeGroupedItems) {
      return activeGroupedItems.includes(itemProps.dataElement);
    }
    return true;
  });

  const headerItems = filteredItems?.map((item, i) => {
    /**
     * We can think on a better solution later, but this is necessary
     * because the user can either intantiate a CustomButton and add it
     * to the header or add the plain object.
     */
    const itemProps = item.props || item;
    const { type, dataElement } = itemProps;
    const key = `${type}-${dataElement || i}-wrapper-${i}`;
    return <InnerItem key={key} {...itemProps} headerDirection={headerDirection} />;
  });

  return (
    <div className="ModularHeaderItems"
      style={{
        gap: `${itemsGap}px`,
        flexDirection: headerDirection,
        justifyContent: alignment,
      }}>
      {headerItems}
    </div>
  );
};

export default ModularHeaderItems;