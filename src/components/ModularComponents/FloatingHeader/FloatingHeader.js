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
    maxWidth,
    maxHeight,
  } = props;
  return (
    <DataElementWrapper dataElement={dataElement} className="FloatingHeader">
      <ModularHeaderItems
        items={items}
        gap={gap}
        placement={placement}
        maxWidth={maxWidth}
        maxHeight={maxHeight} />
    </DataElementWrapper >
  );
};

export default FloatingHeader;