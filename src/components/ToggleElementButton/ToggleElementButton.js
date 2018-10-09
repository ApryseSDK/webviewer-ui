import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';

const mapStateToProps = (state, ownProps) => ({
  className: 'ToggleElementButton',
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  isActive: selectors.isElementOpen(state, ownProps.element),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: e => {
    e.stopPropagation();
    
    dispatch(actions.toggleElement(ownProps.element));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);