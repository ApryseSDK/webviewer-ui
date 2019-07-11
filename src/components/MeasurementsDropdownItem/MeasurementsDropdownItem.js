import React from 'react';
import PropTypes from 'prop-types';

import './MeasurementsDropdownItem.scss';

class MeasurementsDropdownItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    isSelected: PropTypes.bool,
    content: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  };

  onClick = e => {
    this.props.onClick(e);
  };

  render() {
    const { isSelected } = this.props;
    return (
      <div
        className={['MeasurementsDropdownItem', isSelected ? 'selected' : '']
          .join(' ')
          .trim()}
        onClick={this.onClick}
      >
        <div className="Content">{this.props.content}</div>
      </div>
    );
  }
}

export default MeasurementsDropdownItem;
