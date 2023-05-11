import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import core from 'core';
import { mapAnnotationToKey, mapToolNameToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';
import CustomMeasurementOverlay from './CustomMeasurementOverlay';
import CountMeasurementOverlay from './CountMeasurementOverlay';

import './MeasurementOverlay.scss';

class MeasurementOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    activeToolName: PropTypes.string.isRequired,
    customMeasurementOverlay: PropTypes.array,
  };

  constructor(props) {
    super(props);

    this.state = {
      annotation: null,
      transparentBackground: false,
      position: {
        x: 0,
        y: 0,
      },
    };
    this.overlayRef = React.createRef();
    this.isCreatingAnnotation = false;
  }

  componentDidMount() {
    core.addEventListener('mouseMove', this.onMouseMove);
    core.addEventListener('annotationSelected', this.onAnnotationSelected);
    core.addEventListener('annotationChanged', this.onAnnotationChanged);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.activeToolName !== this.props.activeToolName) {
      const { openElement, closeElement } = this.props;
      if (this.isMeasurementTool(this.props.activeToolName)) {
        openElement('measurementOverlay');
      } else {
        closeElement('measurementOverlay');
      }
    }

    if (prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        annotation: null,
        transparentBackground: false,
      });
      this.isCreatingAnnotation = false;
    }
  }

  componentWillUnmount() {
    core.removeEventListener('mouseMove', this.onMouseMove);
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
  }

  onMouseMove = (e) => {
    const { activeToolName, openElement } = this.props;
    const tool = core.getTool(activeToolName);

    if (this.state.annotation) {
      const insideRect = this.isMouseInsideRect(e, this.overlayRef.current);
      let useTransparentBackground;

      if (this.isCreatingAnnotation) {
        const drawMode = core.getToolMode().getDrawMode?.();
        useTransparentBackground = insideRect && drawMode !== 'twoClicks';
      } else {
        const annotUnderMouse = core.getAnnotationByMouseEvent(e);
        useTransparentBackground = insideRect && annotUnderMouse === this.state.annotation;
      }

      this.setState({
        transparentBackground: useTransparentBackground,
      });
      this.forceUpdate();
    } else if (this.shouldShowCustomOverlay(tool.annotation)) {
      openElement('measurementOverlay');
      this.setState({ annotation: tool.annotation });
      // we know we are creating an annotation at this point because tool.annotation is truthy
      this.isCreatingAnnotation = true;
    }
  };

  isMouseInsideRect = (e, overlayElement) => {
    if (overlayElement === null) {
      return false;
    }

    const overlayRect = overlayElement.getBoundingClientRect();
    let x; let y;
    if (e.touches && e instanceof TouchEvent) {
      x = e.touches[0].clientX;
      y = e.touches[0].clientY;
    } else {
      x = e.clientX;
      y = e.clientY;
    }
    return (
      x >= overlayRect.left &&
      x <= overlayRect.right &&
      y >= overlayRect.top &&
      y <= overlayRect.bottom
    );
  };

  onAnnotationSelected = (annotations, action) => {
    const { openElement, closeElement } = this.props;

    if (
      action === 'selected' &&
      annotations.length === 1 &&
      (this.isMeasurementAnnotation(annotations[0]) || this.shouldShowCustomOverlay(annotations[0]))
    ) {
      this.setState({ annotation: annotations[0] });
      openElement('measurementOverlay');
    } else if (
      action === 'deselected' &&
      !core.isAnnotationSelected(this.state.annotation)
    ) {
      closeElement('measurementOverlay');
    }
  };

  onAnnotationChanged = (annotations, action) => {
    // measurement overlay will open and show the annotation information when we are creating an annotation using measurement tools
    // since by default we don't auto select an annotation after it's created, we close the overlay here to avoid the confusion
    // where no annotation is selected but measurement overlay shows the information about the annotation we were creating
    if (
      action === 'add' &&
      annotations.length === 1 &&
      annotations[0] === this.state.annotation
    ) {
      this.props.closeElement('measurementOverlay');
    }

    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0] === this.state.annotation
    ) {
      this.forceUpdate();
    }
  };

  isMeasurementAnnotation = (annotation) => [
    'countMeasurement'
  ].includes(mapAnnotationToKey(annotation));

  isMeasurementTool = (toolName) => [
    'countMeasurement'
  ].includes(mapToolNameToKey(toolName));

  shouldShowCustomOverlay = (annotation) => (!this.isMeasurementAnnotation(annotation) &&
    this.props.customMeasurementOverlay.some((overlay) => overlay.validate(annotation)))

  syncDraggablePosition = (e, { x, y }) => {
    this.setState({
      position: { x, y },
    });
  };

  renderOverlay = (annotation, key) => {
    if (this.shouldShowCustomOverlay(annotation)) {
      return (
        <CustomMeasurementOverlay
          annotation={annotation}
          {...this.props.customMeasurementOverlay.filter((customOverlay) => customOverlay.validate(annotation)
          )[0]}
        />
      );
    }
    if (key === 'countMeasurement') {
      return <CountMeasurementOverlay annotation={annotation} />;
    }
  }
  render() {
    const { annotation, position, transparentBackground } = this.state;
    const { isDisabled, isOpen } = this.props;
    const key = mapAnnotationToKey(annotation);

    if (isDisabled || !annotation) {
      return null;
    }

    return (
      <Draggable
        cancel="input"
        position={position}
        onDrag={this.syncDraggablePosition}
        onStop={this.syncDraggablePosition}
      >
        <div
          className={classNames({
            Overlay: true,
            MeasurementOverlay: true,
            open: isOpen,
            closed: !isOpen,
            transparent: transparentBackground,
          })}
          ref={this.overlayRef}
          data-element="measurementOverlay"
        >
          {this.renderOverlay(annotation, key)}
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = (state) => ({
  isOpen: selectors.isElementOpen(state, 'measurementOverlay'),
  isDisabled: selectors.isElementDisabled(state, 'measurementOverlay'),
  activeToolName: selectors.getActiveToolName(state),
  customMeasurementOverlay: selectors.getCustomMeasurementOverlay(state),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElement: actions.closeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementOverlay);
