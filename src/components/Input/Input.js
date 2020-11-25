import React from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Icon from 'components/Icon';

import './Input.scss';
import selectors from 'selectors';

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
  dataElement: PropTypes.string.isRequired,
};

const Input = React.forwardRef((props, ref) => {
  const isDisabled = useSelector(state => selectors.isElementDisabled(state, props.dataElement));

  const inputProps = omit(props, ['dataElement', 'label']);

  const labelClassName = `Input ${props.disabled ? 'disabled': ''}`;

  return isDisabled ? null : (
    <React.Fragment>
      <input className="Input" ref={ref} {...inputProps}/>
      <label className={labelClassName} htmlFor={props.id} data-element={props.dataElement}>{props.label}
        {ref?.current?.checked &&
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

const omit = (obj, keysToOmit) => {
  return Object.keys(obj).reduce((result, key) => {
    if (!keysToOmit.includes(key)) {
      result[key] = obj[key];
    }

    return result;
  }, {});
};

Input.propTypes = propTypes;

export default Input;
