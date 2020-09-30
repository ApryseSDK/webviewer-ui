import { connect } from 'react-redux';
import classNames from 'classnames';

import Button from 'components/Button';
import selectors from 'selectors';

const mapStateToProps = (state, { isNotClickableSelector, className, element }) => ({
  className: classNames({
    ActionButton: true,
    [className]: !!className,
  }),
  disabled: isNotClickableSelector && isNotClickableSelector(state),
  isActive: selectors.isElementOpen(state, element),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    ownProps.onClick(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);