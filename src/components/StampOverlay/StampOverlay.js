import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import onClickOutside from 'react-onclickoutside';
import getClassName from 'helpers/getClassName';
import getToolStylePopupPositionBasedOn from 'helpers/getToolStylePopupPositionBasedOn';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';

import './StampOverlay.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const canvasWidth = 160;
const canvasHeight = 48;
const padding = 16;
const X = padding / 2;
const Y = padding / 2;


class StampOverlay extends React.Component {
  static propTypes = {
    activeToolName: PropTypes.string,
    isDisabled: PropTypes.bool,
    isOpen: PropTypes.bool,
    toolButtonObjects: PropTypes.object.isRequired,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    closeElements: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.overlay = React.createRef();

    const { toolButtonObjects } = props;
    const dataElement = toolButtonObjects[TOOL_NAME].dataElement;
    this.state = {
      left: 0,
      right: 'auto',
      top: 0,
      defaultAnnotations: [],
      dataElement,
    };
    this.stampTool = core.getTool(TOOL_NAME);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeToolName !== this.props.activeToolName) {
      if (this.props.activeToolName === TOOL_NAME) {
        this.props.openElement('stampOverlay');
        this.setOverlayPosition();
        this.getDefaultRubberStamps();
      } else {
        this.props.closeElement('stampOverlay');
      }
    }
  }

  handleClickOutside = e => {
    const rubberStampToolButton =
      e.target.getAttribute('data-element') === this.state.dataElement;

    if (!rubberStampToolButton) {
      this.props.closeElement('stampOverlay');
    }
  }

  setOverlayPosition = () => {
    const rubberStampToolButton = document.querySelector(
      `[data-element="${this.state.dataElement}"]`,
    );

    if (rubberStampToolButton && this.overlay.current) {
      const res = getToolStylePopupPositionBasedOn(rubberStampToolButton, this.overlay);
      this.setState(res);
    }
  }

  setRubberStamp(annotation) {
    core.setToolMode(TOOL_NAME);
    this.props.closeElement('stampOverlay');
    this.stampTool.setRubberStamp(annotation);
    this.stampTool.showPreview();
  }

  getDefaultRubberStamps = async () => {
    if (!this.state.defaultAnnotations.length) {
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
          return this.stampTool.getPreview(annotation, { canvasWidth, canvasHeight });
        }),
      );

      const defaultAnnotations = annotations.map((annotation, i) => ({
        annotation,
        imgSrc: previews[i],
      }));

      this.setState({ defaultAnnotations });
    }
  }

  render() {
    const { left, top, defaultAnnotations } = this.state;
    const { isDisabled, isOpen } = this.props;
    if (isDisabled) {
      return null;
    }

    var canvases = null;
    var imgs = null;
    if (isOpen) {
      imgs = defaultAnnotations.map(({ imgSrc, annotation }, index) =>
        <div key={index}
          className="rubber-stamp"
          onClick={() => this.setRubberStamp(annotation)}
        >
          <img src={imgSrc} />
        </div>,
      );
    }
    const className = getClassName('Overlay StampOverlay', this.props);
    return (
      <div
        className={className}
        ref={this.overlay}
        style={{ left, top }}
        data-element="stampOverlay"
      >
        <div className="default-stamp-container">
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
  isOpen: selectors.isElementOpen(state, 'stampOverlay'),
  activeToolName: selectors.getActiveToolName(state),
  toolButtonObjects: selectors.getToolButtonObjects(state),
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
