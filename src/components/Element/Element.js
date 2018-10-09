import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

import './Element.scss';

class Element extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    className: PropTypes.string.isRequired,
    dataElement: PropTypes.string.isRequired,
    children: PropTypes.node
  }

  render() {
    const { isDisabled, className, dataElement, children } = this.props;
    
    if (isDisabled) {
      return null;
    }

    return (
      <div className={className} data-element={dataElement}>
        {children}
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  isDisabled: selectors.isElementDisabled(state, ownProps.dataElement),
});

export default connect(mapStateToProps)(Element);