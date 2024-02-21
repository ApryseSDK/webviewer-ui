import React, { useState } from 'react';
import PropTypes from 'prop-types';

function PageControlsFlyout(props) {
  const {
    onSubmit,
    onChange,
    input,
    totalPages,
    inputWidth,
  } = props;
  const [isFocused, setIsFocused] = useState(false);

  const onBlur = () => {
    setIsFocused(false);
    props.onBlur();
  };

  const onFocus = () => {
    setIsFocused(true);
    props.onFocus();
  };

  const style = {};
  if (isFocused) {
    style.width = inputWidth;
  } else {
    style.width = inputWidth - 10;
  }

  return (
    <div tabIndex={0} className="flyout-item-label" style={{ textTransform: 'none', display: 'flex', height: 25 }}>
      <div>{'Pages: '}</div>
      <form onSubmit={onSubmit} onBlur={onBlur} onFocus={onFocus}>
        <input
          type="text"
          value={input}
          onChange={onChange}
          style={style}
        />
      </form>
      <div>{` of ${totalPages}`}</div>
    </div>
  );
}

PageControlsFlyout.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  input: PropTypes.string,
  totalPages: PropTypes.number,
  inputWidth: PropTypes.number,
};

export default PageControlsFlyout;