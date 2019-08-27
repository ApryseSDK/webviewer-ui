import { connect } from 'react-redux';

import Button from 'components/Button';

import selectors from 'selectors';
import actions from 'actions';

const mapStateToProps = (state, ownProps) => ({
  className: ownProps.className || 'ToggleElementButton',
  isActive: selectors.isElementActive(state, ownProps),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    dispatch(actions.toggleElement(ownProps.element));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);