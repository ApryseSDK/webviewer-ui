import React from 'react';
import PropTypes from 'prop-types';

import './Input.scss';

class Input extends React.PureComponent {
  static propTypes = {
    id: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    name: PropTypes.string,
    defaultChecked: PropTypes.bool,
    onChange: PropTypes.func,
    label: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object
    ]).isRequired
  }

  constructor() {
    super();
    this.inputRef = React.createRef();
  }

  get checked() {
    return this.inputRef.current.checked;
  }

  set checked(value) {
    this.inputRef.current.checked = value;
  }

  render() {
    const { id, type, name, defaultChecked, onChange, label } = this.props;

    return(
      <React.Fragment>
        <input className="Input" id={id} ref={this.inputRef} type={type} name={name} onChange={onChange} defaultChecked={defaultChecked} />
        <label className="Input" htmlFor={id}>{label}</label>
      </React.Fragment>
    );
  }
}

export default Input;