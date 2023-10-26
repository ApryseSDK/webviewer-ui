import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import PropTypes from 'prop-types';
import './GroupedItems.scss';
import InnerItem from '../InnerItem/InnerItem';
import { JUSTIFY_CONTENT, ITEM_TYPE, DEFAULT_GAP } from 'constants/customizationVariables';
import actions from 'actions';

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
  const itemValidTypes = Object.values(ITEM_TYPE);
  const validItems = items?.filter((item) => {
    const itemType = item.type || item.props.type;
    return itemValidTypes.includes(itemType);
  });

  useEffect(() => {
    if (alwaysVisible) {
      dispatch(actions.setFixedGroupedItems(dataElement));
    }
  }, []);

  useEffect(() => {
    setItemsGap(gap);
  }, [gap]);

  if (validItems && validItems.length) {
    return (
      <div className={'GroupedItems'}
        data-element={dataElement}
        style={{
          gap: `${itemsGap}px`,
          flexDirection: headerDirection,
          justifyContent: justifyContent,
          flexGrow: grow,
          ...style,
        }}>
        {
          validItems.map((item) => {
            const itemProps = item.props || item;
            return <InnerItem key={`${dataElement}-${itemProps.dataElement}`} {...itemProps} headerDirection={headerDirection} />;
          })
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