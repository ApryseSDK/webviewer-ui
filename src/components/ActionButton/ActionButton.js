import { connect } from 'react-redux';

import Button from 'components/Button';

const mapStateToProps = () => ({
  className: 'ActionButton',
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: e => {
    e.stopPropagation();
    ownProps.onClick(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);