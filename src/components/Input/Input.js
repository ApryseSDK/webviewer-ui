import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Icon from 'components/Icon';


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
  disabled: PropTypes.bool,
};

const Input = React.forwardRef((props, ref) => {
  const { checked } = props;
  // useEffect(() => {

  // });

  // const showIcon = ref.current?.checked;
  // const showIcon = true;

  return (
    <React.Fragment>
      <input className="Input" ref={ref} {...props}/>
      <label className="Input" htmlFor={props.id}>{props.label}
        {checked &&
          <div
            className="icon-container"
          >
            <Icon
              glyph="icon-menu-checkmark"
            />
          </div>}
      </label>
    </React.Fragment>
  );
});


Input.propTypes = propTypes;

export default Input;
