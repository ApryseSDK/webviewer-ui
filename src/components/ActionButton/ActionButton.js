import { connect } from 'react-redux';
import classNames from 'classnames';
import Button from 'components/Button';

const mapStateToProps = (state, { isNotClickableSelector, className, disabled }) => ({
  className: classNames({
    ActionButton: true,
    [className]: !!className,
  }),
  disabled: disabled || (isNotClickableSelector && isNotClickableSelector(state)),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: (ownProps.shouldPassActiveDocumentViewerKeyToOnClickHandler || !ownProps.onClick) ?
    ownProps.onClick :
    () => ownProps.onClick(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);
