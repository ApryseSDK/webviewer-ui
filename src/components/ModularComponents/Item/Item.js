import React from 'react';
import PropTypes from 'prop-types';

const Item = (props) => {
  return (
    <div {...props}></div>
  );
};

Item.propTypes = {
  dataElement: PropTypes.string.isRequired,
  title: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Item;