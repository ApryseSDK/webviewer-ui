import React from 'react';
import './Spinner.scss';
import classNames from 'classnames';
import PropTypes from 'prop-types';

const Spinner = ({ height = '50px', width = '54px', inPanel = false }) => {
  const spinnerStyle = {
    height,
    width,
  };

  return (
    <div className={classNames('spinner', { 'panel-type': inPanel })} style={spinnerStyle}></div>
  );
};

Spinner.propTypes = {
  height: PropTypes.string,
  width: PropTypes.string,
  inPanel: PropTypes.bool,
};

export default Spinner;