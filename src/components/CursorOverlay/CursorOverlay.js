import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './CursorOverlay.scss';

class CursorOverlay extends React.PureComponent {
  static propTypes = {
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    imgSrc: PropTypes.string,
    activeToolName: PropTypes.string,
    closeElement: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props);
    this.overlay = React.createRef();
    this.state = { top: 0, left: 0 };
  }  

  componentDidMount() {
    document.addEventListener('mousemove', this.handleMouseMove);
  }

  componentDidUpdate(prevProps) {
    const signatureToolName = 'AnnotationCreateSignature';
    if (prevProps.activeToolName === signatureToolName && this.props.activeToolName !== signatureToolName) {
      this.props.closeElement('cursorOverlay');
    }
  }

  handleMouseMove = ({ clientX, clientY }) => {
    if (this.props.isOpen) {
      const { 
        top: viewerTop, 
        bottom: viewerBottom, 
        left: viewerLeft, 
        right: viewerRight 
      } = core.getViewerElement().getBoundingClientRect();
      const mouseWithinViewerElement = clientX >= viewerLeft && clientX <= viewerRight && clientY >= viewerTop && clientY <= viewerBottom;
      const HEADER_HEIGHT = 47;
      const mouseWithinHeader = clientY <= HEADER_HEIGHT;
      let left, top;
      
      if (mouseWithinViewerElement && !mouseWithinHeader) {
        const OVERLAY_LEFT_GAP = 10;
        left = clientX + OVERLAY_LEFT_GAP;
        top = clientY;
      } else {
        left = top = -9999;
      }

      this.setState({ left, top });
    }
  }

  render() {
    const { top, left } = this.state;
    const { isDisabled, imgSrc } = this.props;
    const className = getClassName('Overlay CursorOverlay', this.props);    

    if (isDisabled) {
      return null;
    }

    return(
      <div className={className} data-element="cursorOverlay" style={{ top, left }} ref={this.overlay}>
        {imgSrc &&
          <img className="cursor-image" src={imgSrc} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'cursorOverlay'),
  isOpen: selectors.isElementOpen(state, 'cursorOverlay'),
  imgSrc: selectors.getCursorOverlayImage(state),
  activeToolName: selectors.getActiveToolName(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(CursorOverlay);