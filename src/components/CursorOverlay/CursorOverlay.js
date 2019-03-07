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
    data: PropTypes.shape({
      imgSrc: PropTypes.string,
      width: PropTypes.number,
      height: PropTypes.number
    }),
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
      const { data } = this.props;
      let top, left;

      if (data) {
        left = clientX - data.width / 2;
        top = clientY - data.height / 2;
      } else {
        const OVERLAY_LEFT_GAP = 10;
        left = clientX + OVERLAY_LEFT_GAP;
        top = clientY;
      }

      this.setState({ left, top });
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
    const { isDisabled, data: { imgSrc, width, height } } = this.props;
    const className = getClassName('Overlay CursorOverlay', this.props);    

    if (isDisabled || isMobileDevice) {
      return null;
    }

    return(
      <div className={className} data-element="cursorOverlay" style={{ touchAction: 'none', top, left, width, height }} ref={this.overlay}>
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
  data: selectors.getCursorOverlayData(state),
  activeToolName: selectors.getActiveToolName(state)
});

const mapDispatchToProps = {
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(CursorOverlay);