/* eslint-disable */


import React from 'react';
import { connect } from 'react-redux';
import onClickOutside from 'react-onclickoutside';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import './StampOverlay.scss';

const canvasWidth = 160;
const canvasHeight = 48;
const padding = 16;
const X = padding / 2, Y = padding / 2;


class StampOverlay extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
      defaultAnnotations: [],
    };
    this.stampTool = core.getTool('AnnotationCreateRubberStamp');
  }

  componentDidUpdate(prevProps) {
    if (!prevProps.isOpen && this.props.isOpen) {
      this.props.closeElements([
        'viewControlsOverlay',
        'searchOverlay',
        'menuOverlay',
        'toolsOverlay',
        'zoomOverlay',
        'toolStylePopup',
      ]);
      this.setOverlayPosition();
      this.getDefaultRubberStamps();
    }
  }

  handleClickOutside = e => {
    const rubberStampToolButton =
      e.target.getAttribute('data-element') === 'rubberStampToolButton';

    if (!rubberStampToolButton) {
      this.props.closeElement('stampOverlay');
    }
  };
  setOverlayPosition = () => {
    const rubberStampToolButton = document.querySelector(
      '[data-element="rubberStampToolButton"]',
    );

    if (!rubberStampToolButton && this.overlay.current) {
      // the button has been disabled using instance.disableElements
      // but this component can still be opened by clicking on a signature widget
      // in this case we just place it in the center
      const { width } = this.overlay.current.getBoundingClientRect();
      this.setState({ left: (window.innerWidth - width) / 2, right: 'auto' });
    } else {
      this.setState(
        getOverlayPositionBasedOn(
          'rubberStampToolButton',
          this.overlay,
          'center',
        ),
      );
    }
  };
  setRubberStamp(annotation) {
    core.setToolMode('AnnotationCreateRubberStamp');
    this.props.closeElement('stampOverlay');
    this.stampTool.setRubberStamp(annotation);
    this.stampTool.showPreview();
  }

  getDefaultRubberStamps = async () => {


    const annotations = this.stampTool.getDefaultStampAnnotations();
    const previews = await Promise.all(
      annotations.map(annotation => {

        var getWidth = canvasWidth - padding;
        var getHeight = canvasHeight - padding;

        var width = annotation.Width;
        var calculatedWidth = getWidth;
        if (width < getWidth) {
          calculatedWidth = width;
        }
        annotation.X = X;
        annotation.Y = Y;
        annotation.Width = calculatedWidth;
        annotation.Height = getHeight;
        return this.stampTool.getPreview(annotation, { canvasWidth, canvasHeight })
      }),
    )

    const defaultAnnotations = annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));

    this.setState({ defaultAnnotations });
  }
  render() {
    const { left, right, defaultAnnotations } = this.state;
    const { isDisabled, isOpen } = this.props;

    if (isDisabled || !isOpen) {
      return null;
    }
    var canvases = null;
    var imgs = null;
    if (isOpen) {
      imgs = defaultAnnotations.map(({ imgSrc, annotation }, index) => {
        return (
          <div key={index}
            className="rubber-stamp"
            onClick={() => this.setRubberStamp(annotation)}
          >
            {/* <div>{key}</div> */}
            <img src={imgSrc} />
          </div>
        );
      })
    }
    const className = getClassName('Overlay StampOverlay', this.props);
    return (
      <div
        className={className}
        ref={this.overlay}
        style={{ left, right }}
        data-element="stampOverlay"
      >
        <div className="default-signatures-container">
          <div className="modal-body">
            { canvases }
            { imgs }
          </div>
        </div>
      </div>
    );
  }
}



const mapStateToProps = state => ({
  isDisabled: selectors.isElementDisabled(state, 'stampOverlay'),
  isOpen: selectors.isElementOpen(state, 'stampOverlay')
});

const mapDispatchToProps = {
  closeElements: actions.closeElements,
  closeElement: actions.closeElement,
  openElement: actions.openElement,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(onClickOutside(StampOverlay));
