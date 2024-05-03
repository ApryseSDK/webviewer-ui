import React from 'react';
import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';
import { isMobileSize } from 'helpers/getDeviceSize';

const ToggleElementButton = ({ onClick, dataElement, isElementDisabled, isActive, ariaLabel, ...restProps }) => {
  if (isElementDisabled) {
    return null;
  }

  return (
    <Button {...restProps} isActive={isActive} dataElement={dataElement} onClick={onClick} ariaLabel={ariaLabel} />
  );
};

const mapStateToProps = (state, ownProps) => {
  const isActive = selectors.isElementOpen(state, ownProps.element);

  return {
    isElementDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
    isActive,
  };
};

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(actions.toggleElement(ownProps.element));
    if (ownProps.onClick) {
      ownProps.onClick(dispatch);
    }
  },
});

const ConnectedToggleElementButton = connect(mapStateToProps, mapDispatchToProps)(ToggleElementButton);

const connectedComponent = (props) => {
  const isMobile = isMobileSize();

  return <ConnectedToggleElementButton {...props} isMobile={isMobile} />;
};

export default connectedComponent;
