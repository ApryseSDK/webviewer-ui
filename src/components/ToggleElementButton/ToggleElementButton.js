import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';
import { isMobileSize } from 'helpers/getDeviceSize';


const propTypes = {
  dataElement: PropTypes.any,
  ariaExpanded: PropTypes.bool,
  ariaPressed: PropTypes.bool,
  ariaLabel: PropTypes.any,
  isElementDisabled: PropTypes.any,
  isActive: PropTypes.any,
  onClick: PropTypes.any,
};

const ToggleElementButton = ({ onClick, dataElement, isElementDisabled, isActive, ariaLabel, ariaExpanded = false, ariaPressed = false, ...restProps }) => {
  if (isElementDisabled) {
    return null;
  }

  return (
    <Button {...restProps} isActive={isActive} dataElement={dataElement} onClick={onClick} ariaLabel={ariaLabel} ariaExpanded={ariaExpanded} ariaPressed={ariaPressed}/>
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

ToggleElementButton.propTypes = propTypes;

export default connectedComponent;
