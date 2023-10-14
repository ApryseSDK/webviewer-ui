import React, { useEffect, useState, useRef } from 'react';
import './ModularHeaderItems.scss';
import InnerItem from '../ModularComponents/InnerItem';
import { PLACEMENT, DIRECTION } from 'constants/customizationVariables';
import ResponsiveContainer from 'components/ResponsiveContainer';

const ModularHeaderItems = (props) => {
  const { placement, gap, items, justifyContent, className = '', maxWidth, maxHeight, headerId } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const elementRef = useRef();

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  const headerDirection = [PLACEMENT.LEFT, PLACEMENT.RIGHT].includes(placement) ? DIRECTION.COLUMN : DIRECTION.ROW;

  const headerItems = items?.map((item, i) => {
    /**
     * We can think on a better solution later, but this is necessary
     * because the user can either intantiate a CustomButton and add it
     * to the header or add the plain object.
     */
    let itemProps = item.props || item;
    itemProps = { headerPlacement: placement, justifyContent: justifyContent, ...itemProps };
    const { type, dataElement } = itemProps;
    const key = `${type}-${dataElement || i}-wrapper-${i}`;
    return <InnerItem key={key} {...itemProps} headerDirection={headerDirection} />;
  });

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
      <ResponsiveContainer headerDirection={headerDirection} elementRef={elementRef} parent={headerId} items={items}>
        {headerItems}
      </ResponsiveContainer>
    </div>
  );
};

export default ModularHeaderItems;