import React from 'react';
import PropTypes from 'prop-types';
import Button from '../Button';

import './TextButton.scss';

const propTypes = {
  img: PropTypes.string,
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  dataElement: PropTypes.string,
  onClick: PropTypes.func,
  ariaLabel: PropTypes.string,
  ariaControls: PropTypes.string,
  role: PropTypes.string,
  disabled: PropTypes.bool
};

const TextButton = (props) => {
  const {
    img,
    dataElement,
    onClick,
    label,
    ariaLabel,
    ariaControls,
    role,
    disabled
  } = props;

  return (<Button
    className='TextButton'
    img={img}
    label={label}
    dataElement={dataElement}
    onClick={onClick}
    ariaLabel={ariaLabel}
    ariaControls={ariaControls}
    role={role}
    disabled={disabled}
  />);
};

TextButton.propTypes = propTypes;

export default React.memo(TextButton);