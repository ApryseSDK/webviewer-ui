import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './GroupedItems.scss';
import InnerItem from '../InnerItem/InnerItem';
import { ITEM_TYPE } from 'constants/customizationVariables';

const GroupedItems = (props) => {
  const { dataElement, items, headerDirection, gap = 16 } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const itemValidTypes = Object.values(ITEM_TYPE);
  const validItems = items.filter((item) => {
    const itemType = item.type || item.props.type;
    return itemValidTypes.includes(itemType);
  });

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  if (validItems.length) {
    return (
      <div className={'GroupedItems'}
        data-element={dataElement}
        style={{
          gap: `${itemsGap}px`,
          flexDirection: headerDirection
        }}>
        {
          validItems.map((item) => {
            const itemProps = item.props || item;
            return <InnerItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} />;
          })
        }
      </div>
    );
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