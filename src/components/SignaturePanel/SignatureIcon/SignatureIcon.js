import React from 'react';
import PropTypes from 'prop-types';

import Icon from 'components/Icon';

import './SignatureIcon.scss';

const propTypes = {
  badge: PropTypes.string,
  size: PropTypes.string,
};

const SignatureIcon = ({ badge, size = 'medium' }) => (
  <div className="signature-icon">
    {badge && <Icon glyph={badge} className={`badge ${size}`} />}
  </div>
);

SignatureIcon.propTypes = propTypes;

export default SignatureIcon;
