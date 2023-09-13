import React from 'react';
import { components } from 'react-select';
import Icon from 'components/Icon';

const ReactSelectCustomArrowIndicator = (props) => {
  const { selectProps } = props;
  const { menuIsOpen } = selectProps;
  return (
    <components.IndicatorsContainer {...props}>
      <Icon className="arrow" glyph={`icon-chevron-${menuIsOpen ? 'up' : 'down'}`} />
    </components.IndicatorsContainer>
  );
};

export default ReactSelectCustomArrowIndicator;