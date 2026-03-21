import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';
import './WarningBanner.scss';

function WarningBanner({ className, primaryMessage, secondaryMessage }) {
  return (
    <div
      role="alert"
      className={classNames('WarningBanner', className)}
    >
      <Icon glyph="icon-alert" className="WarningBanner__icon" role="presentation" />
      <div className="WarningBanner__messages">
        <div>{primaryMessage}</div>
        {secondaryMessage && <div>{secondaryMessage}</div>}
      </div>
    </div>
  );
}

WarningBanner.propTypes = {
  className: PropTypes.string,
  primaryMessage: PropTypes.node,
  secondaryMessage: PropTypes.node,
};

export default WarningBanner;
