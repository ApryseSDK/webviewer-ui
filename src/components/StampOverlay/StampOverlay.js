/* eslint-disable */


import React from 'react';
import { connect } from 'react-redux';
import { withTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import onClickOutside from 'react-onclickoutside';
import { isDesktop } from 'helpers/device';
import ToolButton from 'components/ToolButton';
import getClassName from 'helpers/getClassName';
import getOverlayPositionBasedOn from 'helpers/getOverlayPositionBasedOn';
import Button from 'components/Button';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import defaultTool from 'constants/defaultTool';

import './StampOverlay.scss';
const typeEnum = {
  'Approved': 'Approved',
  'AsIs': 'As Is',
  'Completed': 'Completed',
  'Confidential': 'Confidential',
  'Departmental': 'Departmental',
  'Draft': 'Draft',
  'Experimental': 'Experimental',
  'Expired': 'Expired',
  'Final': 'Final',
  'ForComment': 'For Comment',
  'ForPublicRelease': 'For Public Release',
  'InformationOnly': 'Information Only',
  'NotApproved': 'Not Approved',
  'NotForPublicRelease': 'Not For Public Release',
  'PreliminaryResults': 'Preliminary Results',
  'Sold': 'Sold',
  'TopSecret': 'Top Secret',
  'Void': 'Void',
};



class StampOverlay extends React.Component {
  static propTypes = {};

  constructor() {
    super();
    this.overlay = React.createRef();
    this.state = {
      left: 0,
      right: 'auto',
    };
    this.stampTool = core.getTool('AnnotationCreateRubberStamp');

    // this.handleRubberStampClick = this.handleRubberStampClick.bind(this);
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
    }

    // if (
    //   prevProps.isOpen &&
    //   !this.props.isOpen &&
    //   !this.props.isSignatureModalOpen &&
    //   this.signatureTool.isEmptySignature()
    // ) {
    //   // location of signatureTool will be set when clicking on a signature widget
    //   // we want to clear location when the overlay is closed without any default signatures selected
    //   // to prevent signature from being drawn to the previous location
    //   // however the overlay will be closed without any default signature selected if we clicked the "add signature" button(which opens the signature modal)
    //   // we don't want to clear the location in the case because we still want the signature to be automatically added to the widget after the create button is hit in the modal
    //   this.signatureTool.clearLocation();
    // }
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
  setRubberStamp(stampName, stampText) {
    var _canvas = document.createElement('canvas');
    var _ctx = _canvas.getContext('2d');
    _ctx.font = 'italic 30px Verdana';

    var getHeight = 38;
    var width = _ctx.measureText(stampText).width;

    const annotation = new Annotations.StampAnnotation();
    annotation.Width = width;
    annotation.Height = getHeight;
    annotation.Icon = stampName;
    annotation.MaintainAspectRatio = true;

    core.setToolMode('AnnotationCreateRubberStamp');
    this.props.closeElement('stampOverlay');
    this.stampTool.setRubberStamp(annotation);
    this.stampTool.showPreview();
  }
  render() {
    const { left, right } = this.state;
    const { isDisabled, isOpen } = this.props;

    if (isDisabled || !isOpen || !core.isCreateRedactionEnabled()) {
      return null;
    }
    var canvases = null;
    if (isOpen) {
      canvases = Object.keys(typeEnum).map((key, index) => {
        const style = {
          // border: '1px solid #d3d3d3',
        };
        return (
          <Canvas
            code={key}
            text={typeEnum[key]}
            key={index}
            width="160"
            height="48"
            style={style}
            stampTool={this.stampTool}
            onClick={() => this.setRubberStamp(key, typeEnum[key])}
          />
        );
      });
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
          </div>
        </div>

        {/* <Button
          img="ic_annotation_stamp_black_24px"
          onClick={this.handleRubberStampClick}
          title="annotation.rubberStamp"
        /> */}
      </div>
    );
  }
}





class Canvas extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {
    const canvas = this.canvas;
    var _canvas = document.createElement('canvas');
    var _ctx = _canvas.getContext('2d');
    _ctx.font = 'bold italic 30px Verdana';
    var stampText = this.props.text;
    var X = 5;
    var Y = 5;
    var opacity = 1;
    var getWidth = this.props.width - 10;
    var getHeight = this.props.height - 10;

    var width = _ctx.measureText(stampText).width;
    var w = getWidth;
    if (width < getWidth) {
      w = width;
    }

    const ctx = canvas.getContext('2d');

    const stampAnnot = new Annotations.StampAnnotation();
    stampAnnot.PageNumber = 1;
    stampAnnot.X = X;
    stampAnnot.Y = Y;
    stampAnnot.Width = w;
    stampAnnot.Height = getHeight;
    stampAnnot.Opacity = opacity;
    stampAnnot.Icon = this.props.code;
    stampAnnot.MaintainAspectRatio = true;
    this.props.stampTool.getPreview(stampAnnot, ctx);
  }

  render() {
    const { width, height, style } = this.props;

    return (
      <canvas className="column" ref={ref => { this.canvas = ref; }}
        style={style}
        width={width}
        height={height}
        onClick={this.props.onClick}
      />
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