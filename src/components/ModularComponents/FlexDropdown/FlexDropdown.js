import React from 'react';
import Dropdown from 'components/Dropdown';

import './FlexDropdown.scss';

const FlexDropdown = (props) => {
  return (
    <Dropdown {...props} className={`FlexDropdown ${props.direction}`} />
  );
};

export default FlexDropdown;