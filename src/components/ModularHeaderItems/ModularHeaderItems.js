import React, { useEffect, useState } from 'react';
import './ModularHeaderItems.scss';
import InnerItem from '../ModularComponents/InnerItem';
import { PLACEMENT } from 'constants/customizationVariables';

const ModularHeaderItems = (props) => {
  const { placement, gap, items, alignment, className } = props;
  const [itemsGap, setItemsGap] = useState(gap);


  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const headerDirection = [PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(placement) ? 'column' : 'row';

  const headerItems = items?.map((item, i) => {
    /**
     * We can think on a better solution later, but this is necessary
     * because the user can either intantiate a CustomButton and add it
     * to the header or add the plain object.
     */
    let itemProps = item.props || item;
    itemProps = { ...itemProps, headerPlacement: placement };
    const { type, dataElement } = itemProps;
    const key = `${type}-${dataElement || i}-wrapper-${i}`;
    return <InnerItem key={key} {...itemProps} headerDirection={headerDirection} />;
  });

  return (
    <div className={`ModularHeaderItems ${className}`}
      style={{
        gap: `${itemsGap}px`,
        flexDirection: headerDirection,
        justifyContent: alignment,
      }}
    >
      {headerItems}
    </div>
  );
};

export default ModularHeaderItems;