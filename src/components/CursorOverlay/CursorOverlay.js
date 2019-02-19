import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import core from 'core';
import getClassName from 'helpers/getClassName';
import { isMobileDevice } from 'helpers/device';
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
    const viewerElement = core.getViewerElement();
    if (viewerElement) {
      this.bindEventListener(viewerElement);
    } else {
      // although <DocumentContainer /> comes before <CursorOverlay /> in the render function in App.js 
      // I'm not sure if <DocumentContainer /> is mounted before this component.
      // so added this case just to make sure the mouse event listeners will be bound to the viewer element anyways
      core.addEventListener('documentLoaded', () => this.bindEventListener(core.getViewerElement()));
    }
  }

  componentDidUpdate(prevProps) {
    const signatureToolName = 'AnnotationCreateSignature';
    if (prevProps.activeToolName === signatureToolName && this.props.activeToolName !== signatureToolName) {
      this.props.closeElement('cursorOverlay');
    }
  }
  
  bindEventListener = viewerElement => {
    viewerElement.addEventListener('mousemove', this.handleMouseMove);
    viewerElement.addEventListener('mouseleave', this.handleMouseLeave);
  } 

  handleMouseMove = ({ clientX, clientY }) => {
    if (this.props.isOpen) {
      const OVERLAY_LEFT_GAP = 10;
      this.setState({ 
        left: clientX + OVERLAY_LEFT_GAP,
        top: clientY
      });
    }
  }

  handleMouseLeave = () => {
    // we use -9999 to "hide" this overlay here instead of calling this.props.closeElement('cursorOverlay')
    // is because by doing so we don't need to handle extra logic like when we should call this.props.openElement('cursorOverlay')
    this.setState({
      left: -9999,
      top: -9999
    });
  }

  render() {
    const { top, left } = this.state;
    const { isDisabled, imgSrc } = this.props;
    const className = getClassName('Overlay CursorOverlay', this.props);    

    if (isDisabled || isMobileDevice) {
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