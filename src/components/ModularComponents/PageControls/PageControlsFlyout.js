import React, { forwardRef, useState } from 'react';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../FlyoutItemContainer';

const PageControlsFlyout = forwardRef((props, ref) => {
  const {
    onSubmit,
    onChange,
    input,
    totalPages,
    inputWidth,
    onKeyDownHandler,
    icon,
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

  const pageControlsFlyoutItem = (
    <div className="flyout-item-label">
      <div>{'Pages: '}</div>
      <form onSubmit={onSubmit} onBlur={onBlur} onFocus={onFocus}>
        <input
          type="text"
          value={input}
          onChange={onChange}
          style={style}
          onKeyDown={onKeyDownHandler}
        />
      </form>
      <div>{` of ${totalPages}`}</div>
    </div>
  );

  return (
    <FlyoutItemContainer {...props}
      ref={ref}
      additionalClass={'page-nav-display'}
      elementDOM={pageControlsFlyoutItem}
      icon={icon}
    />
  );
});

PageControlsFlyout.propTypes = {
  onSubmit: PropTypes.func,
  onChange: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  input: PropTypes.string,
  totalPages: PropTypes.number,
  inputWidth: PropTypes.number,
  onKeyDownHandler: PropTypes.func,
  icon: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};
PageControlsFlyout.displayName = 'PageControlsFlyout';

export default PageControlsFlyout;