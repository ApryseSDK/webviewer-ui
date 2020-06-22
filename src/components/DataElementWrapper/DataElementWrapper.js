import selectors from 'selectors';

import React from 'react';
import { connect } from 'react-redux';

const Wrapper = ({ children, isDisabled, ...props }) => {
  if (isDisabled) {
    return null;
  }

  return (
    <div
      {...props}
    >
      {children}
    </div>
  );
};

const mapStateToProps = (state, { dataElement }) => ({
  isDisabled: selectors.isElementDisabled(state, dataElement),
});

const ConnectedWrapper = connect(
  mapStateToProps,
)(Wrapper);

export default ConnectedWrapper;