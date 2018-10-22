import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';

const mapStateToProps = (state, ownProps) => ({
  className: 'ActionButton',
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: e => {
    e.stopPropagation();
    ownProps.onClick(dispatch);
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);