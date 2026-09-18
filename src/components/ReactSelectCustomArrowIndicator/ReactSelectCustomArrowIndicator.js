import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';

const ReactSelectCustomArrowIndicator = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;
  return (
    <components.DropdownIndicator {...props}>
      <Icon className="arrow" glyph={`icon-chevron-${menuIsOpen ? 'up' : 'down'}`} />
    </components.DropdownIndicator>
  );
};

export default ReactSelectCustomArrowIndicator;
