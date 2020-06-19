import React from 'react';
import PropTypes from 'prop-types';

import './OverlayItem.scss';

class OverlayItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    buttonName: PropTypes.string,
  }

  render() {
    const { buttonName } = this.props;
    return (
      <button className="OverlayItem" onClick={this.props.onClick} aria-label={buttonName}>
        <div className="ButtonText">
          { buttonName }
        </div>
      </button>
    );
  }
}

export default OverlayItem;