import React from 'react';
import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';
import useMedia from 'hooks/useMedia';

import core from 'core';
import defaultTool from 'constants/defaultTool';

const ToggleElementButton = ({
  onClick,
  dataElement,
  isElementDisabled,
  isActive,
  ariaLabel,
  ...restProps
}) => {
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
    // hack for new ui
    if (ownProps.element === 'searchPanel') {
      dispatch(actions.closeElement('detachedNotesPanel'));
    } else if (ownProps.element === 'detachedNotesPanel') {
      dispatch(actions.closeElement('searchPanel'));
    }
    dispatch(actions.toggleElement(ownProps.element));
  },
});

const ConnectedToggleElementButton = connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToggleElementButton);

export default props => {
  const isMobile = useMedia(
    // Media queries
    ['(max-width: 640px)'],
    [true],
    // Default value
    false,
  );

  return (
    <ConnectedToggleElementButton {...props} isMobile={isMobile} />
  );
};
