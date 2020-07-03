import { connect } from 'react-redux';

import Button from 'components/Button';

const mapStateToProps = (state, { isNotClickableSelector }) => ({
  className: 'ActionButton',
  disabled: isNotClickableSelector && isNotClickableSelector(state),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    ownProps.onClick(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);