import React from 'react';

import './DropdownItem.scss';

class DropdownItem extends React.PureComponent {
  render() { 
    const { buttonName } = this.props;
    return (
      <div className="DropdownItem" onClick={this.props.onClick}>
        <div className="ButtonText">
          { buttonName }
        </div>
      </div>
    );
  }
}
 
export default DropdownItem;