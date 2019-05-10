import React from 'react';
import PropTypes from 'prop-types';

import './OverlayItem.scss';

class OverlayItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    buttonName: PropTypes.string
  }
  render() { 
    const { buttonName } = this.props;
    return (
      <div className="OverlayItem" onClick={this.props.onClick}>
        <div className="ButtonText">
          { buttonName }
        </div>
      </div>
    );
  }
}
 
export default OverlayItem;