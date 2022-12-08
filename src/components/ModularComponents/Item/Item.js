import React from 'react';
import PropTypes from 'prop-types';


class Item extends React.Component {
  static propTypes = {
    dataElement: PropTypes.string.isRequired,
    title: PropTypes.string,
    disabled: PropTypes.bool,
  };

  render() {
    return (
      <></>
    );
  }
}

export default Item;