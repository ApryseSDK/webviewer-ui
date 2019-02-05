import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import selectors from 'selectors';

import './CursorOverlay.scss';

class CursorOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    imgSrc: PropTypes.string
  }

  constructor(props) {
    super(props);
    this.state = { x: 0, y: 0 };
  }

  handleMouseMove = e => {
    this.setState({
      x: e.clientX,
      y: e.clientY
    });
  }

  render() {
    const { left, right } = this.state;
    const { isDisabled, imgSrc } = this.props;
    const className = getClassName('Overlay CursorOverlay', this.props);    

    if (isDisabled || !imgSrc) {
      return null;
    }

    return(

    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'cursorOverlay'),
  isOpen: selectors.isElementOpen(state, 'cursorOverlay'),
  imgSrc: selectors.getCursorOverlayImage(state)
});

export default connect(mapStateToProps)(CursorOverlay);