import React from 'react';
import Item from 'components/ModularComponents/Item/Item';
import '../Button.scss';
import PropTypes from 'prop-types';
import Tooltip from 'src/components/Tooltip';

class CustomButton extends Item {
  static propTypes = {
    icon: PropTypes.any,
    onClick: PropTypes.func
  };

  render() {
    return (
      <Tooltip content={this.props.title}>
        <button
          className="CustomButton Button"
          data-element={this.props.dataElement}
          onClick={this.props.onClick}
          disabled={this.props.disabled}
        >
          {this.props.icon}
        </button>
      </Tooltip>
    );
  }
}

export default CustomButton;
