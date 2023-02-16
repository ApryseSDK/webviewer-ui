import React from 'react';
import CustomButton from 'components/Button/CustomButton';
import GroupedItems from '../GroupedItems/GroupedItems';
import RibbonItem from '../RibbonItem';
import { ITEM_TYPE } from 'constants/customizationVariables';

const InnerItem = (props) => {
  const { type, dataElement, headerDirection } = props;
  const key = `${type}-${dataElement}`;

  switch (type) {
    case ITEM_TYPE.BUTTON:
      return <CustomButton key={key} {...props} />;
    case ITEM_TYPE.GROUPED_ITEMS:
      return <GroupedItems key={key} {...props} headerDirection={headerDirection} />;
    case ITEM_TYPE.RIBBON_ITEM:
      return <RibbonItem key={key} {...props} />;
    default:
      console.warn(`${type} is not a valid item type.`);
      return null;
  }
};

export default InnerItem;