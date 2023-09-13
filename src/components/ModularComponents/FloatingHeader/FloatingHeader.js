import React from 'react';
import './FloatingHeader.scss';
import ModularHeaderItems from 'components/ModularHeaderItems';
import DataElementWrapper from 'components/DataElementWrapper';
import { DEFAULT_GAP } from 'constants/customizationVariables';

const FloatingHeader = (props) => {
  const { dataElement,
    placement,
    items = [],
    gap = DEFAULT_GAP,
  } = props;
  return (
    <DataElementWrapper dataElement={dataElement} className="FloatingHeader">
      <ModularHeaderItems
        items={items}
        gap={gap}
        placement={placement} />
    </DataElementWrapper >
  );
};

export default FloatingHeader;