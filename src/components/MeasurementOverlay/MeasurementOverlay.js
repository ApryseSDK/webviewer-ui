import React from 'react';
import classNames from 'classnames';
import Draggable from 'react-draggable';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import { mapAnnotationToKey, mapToolNameToKey, getDataWithKey } from 'constants/map';
import parseMeasurementContents from 'helpers/parseMeasurementContents';
import actions from 'actions';
import selectors from 'selectors';

import './MeasurementOverlay.scss';
import CustomMeasurementOverlay from './CustomMeasurementOverlay';
import EllipseMeasurementOverlay from './EllipseMeasurementOverlay';
import LineMeasurementInput from './LineMeasurementInput';
import CountMeasurementOverlay from './CountMeasurementOverlay';

class MeasurementOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    activeToolName: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired,
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

  onMouseMove = e => {
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
    } else if (
      (this.isMeasurementToolWithInfo(tool) && !this.isSmallAnnotation(tool.annotation)) ||
      this.shouldShowCustomOverlay(tool.annotation)
    ) {
      openElement('measurementOverlay');
      this.setState({ annotation: tool.annotation });
      // we know we are creating an annotation at this point because tool.annotation is truthy
      this.isCreatingAnnotation = true;
    }
  };

  isMouseInsideRect = (e, overlayElement) => {
    const overlayRect = overlayElement.getBoundingClientRect();
    const { clientX: x, clientY: y } = e;

    return (
      x >= overlayRect.left &&
      x <= overlayRect.right &&
      y >= overlayRect.top &&
      y <= overlayRect.bottom
    );
  };

  isMeasurementToolWithInfo(tool) {
    const { activeToolName } = this.props;
    return (
      this.isMeasurementTool(activeToolName) &&
      tool.annotation &&
      this.shouldShowInfo(tool.annotation)
    );
  }

  // This helps ensure we don't show an overlay for small annotations
  isSmallAnnotation = annotation => {
    const w = annotation.getWidth();
    const h = annotation.getHeight();
    const minSize = (annotation.getRectPadding() + 1) * 2;

    return w <= minSize && h <= minSize;
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

  isMeasurementAnnotation = annotation =>
    [
      'distanceMeasurement',
      'perimeterMeasurement',
      'areaMeasurement',
      'rectangularAreaMeasurement',
      'ellipseMeasurement',
      'countMeasurement'
    ].includes(mapAnnotationToKey(annotation));

  isMeasurementTool = toolName =>
    [
      'distanceMeasurement',
      'perimeterMeasurement',
      'areaMeasurement',
      'rectangularAreaMeasurement',
      'ellipseMeasurement',
      'countMeasurement'
    ].includes(mapToolNameToKey(toolName));

  shouldShowCustomOverlay = annotation =>
    (!this.isMeasurementAnnotation(annotation) &&
    this.props.customMeasurementOverlay.some(overlay => overlay.validate(annotation)))

  shouldShowInfo = annotation => {
    const key = mapAnnotationToKey(annotation);

    let showInfo;
    if (
      key === 'perimeterMeasurement' ||
      key === 'areaMeasurement' ||
      key === 'rectangularAreaMeasurement'
    ) {
      // for polyline and polygon, there's no useful information we can show if it has no vertices or only one vertex.
      showInfo = annotation.getPath().length > 1;
    } else if (key === 'distanceMeasurement' || key === 'ellipseMeasurement') {
      showInfo = true;
    }

    return showInfo;
  };

  getAngleInRadians = (pt1, pt2, pt3) => {
    let angle;

    if (pt1 && pt2) {
      if (pt3) {
        // calculate the angle using Law of cosines
        const AB = Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));
        const BC = Math.sqrt(Math.pow(pt2.x - pt3.x, 2) + Math.pow(pt2.y - pt3.y, 2));
        const AC = Math.sqrt(Math.pow(pt3.x - pt1.x, 2) + Math.pow(pt3.y - pt1.y, 2));
        angle = Math.acos((BC * BC + AB * AB - AC * AC) / (2 * BC * AB));
      } else {
        // if there are only two points returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y)
        angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
        // keep the angle range between 0 and Math.PI / 2
        angle = Math.abs(angle);
        angle = angle > Math.PI / 2 ? Math.PI - angle : angle;
      }
    }

    return angle;
  };

  getNumberOfDecimalPlaces = annotation =>
    annotation.Precision === 1 ? 0 : annotation.Precision.toString().split('.')[1].length;

  syncDraggablePosition = (e, { x, y }) => {
    this.setState({
      position: { x, y },
    });
  };

  renderTitle = () => {
    const { t } = this.props;
    const key = mapAnnotationToKey(this.state.annotation);
    const { icon } = getDataWithKey(key);

    const keyTitleMap = {
      distanceMeasurement: t('option.measurementOverlay.distanceMeasurement'),
      perimeterMeasurement: t('option.measurementOverlay.perimeterMeasurement'),
      areaMeasurement: t('option.measurementOverlay.areaMeasurement'),
      rectangularAreaMeasurement: t('option.measurementOverlay.areaMeasurement'),
    };

    return (
      <div className="measurement__title">
        {icon && <Icon className="measurement__icon" glyph={icon} />}
        {keyTitleMap[key]}
      </div>
    );
  };

  renderScaleRatio = () => {
    const { annotation } = this.state;
    const scale = annotation.Scale;
    const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);

    return `${scale[0][0]} ${scale[0][1]} = ${scale[1][0].toFixed(decimalPlaces)} ${scale[1][1]}`;
  };

  renderValue = () => {
    const { annotation } = this.state;
    const { t } = this.props;
    const key = mapAnnotationToKey(annotation);

    const keyDisplayNameMap = {
      distanceMeasurement: t('option.measurementOverlay.distance'),
      perimeterMeasurement: t('option.measurementOverlay.perimeter'),
      areaMeasurement: t('option.measurementOverlay.area'),
      rectangularAreaMeasurement: t('option.measurementOverlay.area'),
    };

    return (
      <div className="measurement__value">
        {keyDisplayNameMap[key]}: {annotation.getContents()}
      </div>
    );
  };

  renderDeltas = () => {
    const { annotation } = this.state;
    const angle = this.getAngleInRadians(annotation.Start, annotation.End);
    const unit = annotation.Scale[1][1];
    const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);
    const distance = parseMeasurementContents(annotation.getContents());
    const deltaX = Math.abs(distance * Math.cos(angle)).toFixed(decimalPlaces);
    const deltaY = Math.abs(distance * Math.sin(angle)).toFixed(decimalPlaces);

    return (
      <div className="measurement__deltas">
        <div className="measurement__deltas--X">
          &Delta;X: {deltaX} {unit}
        </div>
        <div className="measurement__deltas--Y">
          &Delta;Y: {deltaY} {unit}
        </div>
      </div>
    );
  };

  renderAngle = () => {
    const { annotation } = this.state;
    const key = mapAnnotationToKey(annotation);
    const getIPathAnnotationPts = annotation => {
      const path = annotation.getPath();
      const length = path.length;
      return [path[length - 3], path[length - 2], path[length - 1]];
    };
    const keyPtMap = {
      distanceMeasurement: ({ Start, End }) => [Start, End],
      perimeterMeasurement: getIPathAnnotationPts,
      areaMeasurement: getIPathAnnotationPts,
      rectangularAreaMeasurement: getIPathAnnotationPts,
    };
    const pts = keyPtMap[key](annotation).filter(pt => !!pt);

    let angle = this.getAngleInRadians(...pts);
    if (angle) {
      const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);
      angle = ((angle / Math.PI) * 180).toFixed(decimalPlaces);
    }

    return (
      angle !== undefined && (
        <div className="measurement__angle">
          {this.props.t('option.measurementOverlay.angle')}: {angle}&deg;
        </div>
      )
    );
  };

  renderOverlay = (annotation, t, isOpen, key) => {
    if (this.shouldShowCustomOverlay(annotation)) {
      return (
        <CustomMeasurementOverlay
          annotation={annotation}
          {...this.props.customMeasurementOverlay.filter(customOverlay =>
            customOverlay.validate(annotation)
          )[0]}
        />
      );
    } else if (key === 'ellipseMeasurement') {
      return <EllipseMeasurementOverlay annotation={annotation} isOpen={isOpen} />;
    } else if (key === 'countMeasurement') {
      return <CountMeasurementOverlay annotation={annotation} t={t} />;
    } else {
      return (
        <>
          {this.renderTitle()}
          <div className="measurement__scale">
            {t('option.measurementOverlay.scale')}: {this.renderScaleRatio()}
          </div>
          <div className="measurement__precision">
            {t('option.shared.precision')}: {annotation.Precision}
          </div>
          {key === 'distanceMeasurement' ? (
            <LineMeasurementInput annotation={annotation} isOpen={isOpen} t={t} />
          ) : (
            this.renderValue()
          )}
          {key === 'distanceMeasurement' && this.renderDeltas()}
          {key !== 'rectangularAreaMeasurement' &&
            key !== 'distanceMeasurement' &&
            this.renderAngle()}
        </>
      );
    }
  }
  render() {
    const { annotation, position, transparentBackground } = this.state;
    const { isDisabled, t, isOpen } = this.props;
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
          {this.renderOverlay(annotation, t, isOpen, key)}
        </div>
      </Draggable>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'measurementOverlay'),
  isDisabled: selectors.isElementDisabled(state, 'measurementOverlay'),
  activeToolName: selectors.getActiveToolName(state),
  customMeasurementOverlay: selectors.getCustomMeasurementOverlay(state),
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElement: actions.closeElement,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MeasurementOverlay));
