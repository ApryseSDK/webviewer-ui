import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import RibbonItem from '../RibbonItem';
import './RibbonGroup.scss';

const RibbonGroup = (props) => {
  const {
    dataElement,
    items,
    headerDirection,
    gap = headerDirection === 'column' ? 12 : 20
  } = props;
  const [itemsGap, setItemsGap] = useState(gap);
  const ribbonItems = items?.filter((item) => {
    const itemType = item.type || item.props.type;
    if (itemType !== 'ribbonItem') {
      const dataElement = item.dataElement || item.props.dataElement;
      console.warn(`${dataElement} is not a valid ribbon item.`);
    }
    return itemType === 'ribbonItem';
  });

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  if (ribbonItems && ribbonItems.length) {
    return (
      <div
        className={'RibbonGroup'}
        data-element={dataElement}
        style={{
          gap: `${itemsGap}px`,
          flexDirection: headerDirection,
        }}
      >
        {ribbonItems.map((item) => {
          const itemProps = item.props || item;
          return <RibbonItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} />;
        })}
      </div>
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