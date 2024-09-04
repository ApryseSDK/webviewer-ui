import './mobilePopupWrapper.scss';
import React from 'react';
import PropTypes from 'prop-types';

const MobilePopupWrapper = ({ children }) => {
  return (
    <div
      className='MobilePopupWrapper'
      data-element="mobile-popup-wrapper">
      { children }
    </div>
  );
};

export default MobilePopupWrapper;

MobilePopupWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};
