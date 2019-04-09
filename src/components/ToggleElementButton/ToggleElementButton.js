import { connect } from 'react-redux';

import Button from 'components/Button';
import { withTooltip } from 'components/Tooltip';

import selectors from 'selectors';
import actions from 'actions';

const mapStateToProps = (state, ownProps) => ({
  className: ownProps.className || 'ToggleElementButton',
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
  isActive: selectors.isElementActive(state, ownProps),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: e => {
    e.stopPropagation();
    dispatch(actions.toggleElement(ownProps.element));
  }
});

export default connect(mapStateToProps, mapDispatchToProps)(withTooltip({
  leftPanelButton: 'right',
  menuButton: 'left'
})(Button));