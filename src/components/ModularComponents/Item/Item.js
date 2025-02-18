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
  style: PropTypes.object,
  className: PropTypes.string,
};

export default Item;