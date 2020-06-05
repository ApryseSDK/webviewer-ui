import selectors from 'selectors';

import React from 'react';
import { connect } from 'react-redux';

const Wrapper = ({ children, className, dataElement, isDisabled }) => {
  if (isDisabled) {
    return null;
  }

  return (
    <div
      className={className}
      data-element={dataElement}
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