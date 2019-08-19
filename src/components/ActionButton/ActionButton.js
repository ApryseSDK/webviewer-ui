import { connect } from 'react-redux';

import Button from 'components/Button';

const mapStateToProps = () => ({
  className: 'ActionButton',
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  onClick: () => {
    ownProps.onClick(dispatch);
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(Button);