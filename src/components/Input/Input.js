import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

const propTypes = {
  id: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  name: PropTypes.string,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  label: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
  ]).isRequired,
  checked: PropTypes.bool,
};

const Input = React.forwardRef((props, ref) => (
  <React.Fragment>
    <input className="Input" ref={ref} {...props}/>
    <label className="Input" htmlFor={props.id}>{props.label}</label>
  </React.Fragment>
));

Input.propTypes = propTypes;

export default Input;
