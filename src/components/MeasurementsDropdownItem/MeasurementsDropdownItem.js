import React from 'react';

import './MeasurementsDropdownItem.scss';

class MeasurementsDropdownItem extends React.PureComponent {
  render() { 
    const { isSelected } = this.props;
    return (
    <div className={['MeasurementsDropdownItem', isSelected? 'selected': ''].join(' ').trim()} onClick={this.props.onClick}>
      <div className="Content">
        {this.props.content}
      </div>
    </div>
    );
  }
}
 
export default MeasurementsDropdownItem;