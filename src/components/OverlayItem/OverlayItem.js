import React from 'react';
import PropTypes from 'prop-types';

import './OverlayItem.scss';
import classNames from 'classnames';

class OverlayItem extends React.PureComponent {
  static propTypes = {
    onClick: PropTypes.func,
    buttonName: PropTypes.string,
    role: PropTypes.string,
    selected: PropTypes.bool
  }

  render() {
    const { buttonName, role, selected } = this.props;
    return (
      <button className={classNames({ OverlayItem: true, selected })} onClick={this.props.onClick} aria-label={buttonName} role={role}>
        <div className="ButtonText">
          { buttonName }
        </div>
      </button>
    );
  }
}

export default OverlayItem;
