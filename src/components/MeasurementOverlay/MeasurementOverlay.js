import React from 'react';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import getClassName from 'helpers/getClassName';
import actions from 'actions';
import selectors from 'selectors';

import './MeasurementOverlay.scss';

class MeasurementOverlay extends React.PureComponent {
  static propTypes = {
    isOpen: PropTypes.bool,
    isDisabled: PropTypes.bool,
    openElement: PropTypes.func.isRequired,
    closeElement: PropTypes.func.isRequired,
    activeToolName: PropTypes.string.isRequired,
    t: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      annotation: null
    };
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
      this.setState({ annotation: null });
    }
  }

  componentWillUnmount() {
    core.removeEventListener('mouseMove', this.onMouseMove);
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
    core.removeEventListener('annotationChanged', this.onAnnotationChanged);
  }

  onMouseMove = () => {
    const { activeToolName, openElement } = this.props;
    const tool = core.getTool(activeToolName);

    if (this.state.annotation) {
      this.forceUpdate();
    } else if (
      this.isMeasurementTool(activeToolName) && 
      tool.annotation &&
      this.shouldShowInfo(tool.annotation)
    ) {
      openElement('measurementOverlay');
      this.setState({ annotation: tool.annotation });
    }
  }

  onAnnotationSelected = (e, annotations, action) => {
    const { openElement, closeElement } = this.props;
    
    if (
      action === 'selected' && 
      annotations.length === 1 && 
      this.isMeasurementAnnotation(annotations[0])
    ) {
      this.setState({ annotation: annotations[0] });
      openElement('measurementOverlay');
    } else if (
      action === 'deselected' &&
      !core.isAnnotationSelected(this.state.annotation)
    ) {
      closeElement('measurementOverlay');
    }
  }

  onAnnotationChanged = (e, annotations, action) => {
    // measurement overlay will open and show the annotation information when we are creating an annotation using measurement tools
    // since by default we don't auto select an annotation after it's created, we close the overlay here to avoid the confusion 
    // where no annotation is selected but measurement overlay shows the information about the annotation we were creating
    if (
      action === 'add' &&
      annotations.length === 1 &&
      annotations[0] && this.state.annotation
    ) {
      this.props.closeElement('measurementOverlay');
    }
  }

  isMeasurementAnnotation = annotation => ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'].includes(annotation.ToolName);

  isMeasurementTool = toolName => ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'].includes(toolName);

  shouldShowInfo = annotation => {
    const toolName = annotation.ToolName;
    let showInfo;
    if (toolName === 'AnnotationCreatePerimeterMeasurement' || toolName === 'AnnotationCreateAreaMeasurement') {
      // for polyline and polygon, there's no useful information we can show if it has no vertices or only one vertex.
      showInfo = annotation.getPath().length > 1;
    } else if (toolName === 'AnnotationCreateDistanceMeasurement') {
      showInfo = true;
    }

    return showInfo;
  }

  getAngleInRadians = (pt1, pt2, pt3) => {
    let angle;

    if (pt1 && pt2) {
      if (pt3) {
        // calculate the angle using Law of cosines
        const AB = Math.sqrt(Math.pow(pt2.x - pt1.x, 2) + Math.pow(pt2.y - pt1.y, 2));    
        const BC = Math.sqrt(Math.pow(pt2.x - pt3.x, 2) + Math.pow(pt2.y - pt3.y, 2)); 
        const AC = Math.sqrt(Math.pow(pt3.x - pt1.x, 2) + Math.pow(pt3.y - pt1.y, 2));
        angle = Math.acos((BC*BC + AB*AB - AC*AC) / (2*BC*AB));
      } else {
        // if there are only two points returns the angle in the plane (in radians) between the positive x-axis and the ray from (0,0) to the point (x,y)
        angle = Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x);
        // keep the angle range between 0 and Math.PI / 2
        angle = Math.abs(angle); 
        angle = angle > Math.PI / 2 ? Math.PI - angle : angle;
      }
    }

    return angle;
  }

  getNumberOfDecimalPlaces = annotation => 
    annotation.Precision === 1 
      ? 0 
      : annotation.Precision.toString().split('.')[1].length;

  renderTitle = () => {
    const { t, activeIcon, activeToolName } = this.props;
    const icon = activeIcon;

    const toolTitleMap = {
      AnnotationCreateDistanceMeasurement: t('option.measurementOverlay.distanceMeasurement'),
      AnnotationCreatePerimeterMeasurement: t('option.measurementOverlay.perimeterMeasurement'),
      AnnotationCreateAreaMeasurement: t('option.measurementOverlay.areaMeasurement')
    };

    return (
      <div className="measurement__title">
        {icon &&
          <Icon className="measurement__icon" glyph={icon} />
        }
        {toolTitleMap[activeToolName]}
      </div>
    );
  }

  renderValue = () => {
    const { annotation } = this.state;
    const { t } = this.props;
    const toolDisplayNameMap = {
      AnnotationCreateDistanceMeasurement: t('option.measurementOverlay.distance'),
      AnnotationCreatePerimeterMeasurement: t('option.measurementOverlay.perimeter'),
      AnnotationCreateAreaMeasurement: t('option.measurementOverlay.area')
    };

    return (
      <div className="measurement__value">
        {toolDisplayNameMap[annotation.ToolName]}: {annotation.getContents()}
      </div>
    );
  }

  renderDeltas = () => {
    const { annotation } = this.state;
    const angle = this.getAngleInRadians(annotation.Start, annotation.End);
    const unit = annotation.Scale[1][1];
    const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);
    const distance = parseFloat(annotation.getContents());
    const deltaX = Math.abs(distance * Math.cos(angle)).toFixed(decimalPlaces); 
    const deltaY = Math.abs(distance * Math.sin(angle)).toFixed(decimalPlaces);
    
    return (
      <div className="measurement__deltas">
        <div className="measurement__deltas--X">&Delta;X: {deltaX} {unit}</div>
        <div className="measurement__deltas--Y">&Delta;Y: {deltaY} {unit}</div>
      </div>
    );
  }

  renderAngle = () => {
    const { annotation } = this.state;
    const getIPathAnnotationPts = annotation => {
      const path = annotation.getPath();
      const length = path.length;
      return [path[length - 3], path[length - 2], path[length - 1]];
    };
    const toolPtMap = {
      AnnotationCreateDistanceMeasurement: ({ Start, End }) => [Start, End],
      AnnotationCreatePerimeterMeasurement: getIPathAnnotationPts,
      AnnotationCreateAreaMeasurement: getIPathAnnotationPts
    };
    const pts = toolPtMap[annotation.ToolName](annotation).filter(pt => !!pt);
    
    let angle = this.getAngleInRadians(...pts);
    if (angle) {
      const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);
      angle = (angle / Math.PI * 180).toFixed(decimalPlaces);
    }

    return (
      angle !== undefined && 
      <div className="measurement__angle">
        {this.props.t('option.measurementOverlay.angle')}: {angle}&deg;
      </div>
    );
  }

  render() {
    const { annotation } = this.state;
    const { isDisabled, t } = this.props;
    const className = getClassName('Overlay MeasurementOverlay', this.props);

    if (isDisabled || !annotation) {
      return null;
    }

    return (
      <div className={className} data-element="measurementOverlay">
        {this.renderTitle()}
        <div className="measurement__scale">
          {t('option.measurementOverlay.scale')}: {annotation.Measure.scale}
        </div>
        <div className="measurement__precision">
          {t('option.shared.precision')}: {annotation.Precision}
        </div>
        {this.renderValue()}
        {annotation.ToolName === 'AnnotationCreateDistanceMeasurement' &&
          this.renderDeltas()
        }
        {this.renderAngle()}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isOpen: selectors.isElementOpen(state, 'measurementOverlay'),
  isDisabled: selectors.isElementDisabled(state, 'measurementOverlay'),
  activeToolName: selectors.getActiveToolName(state),
  activeIcon: selectors.getToolButtonIcon(state, selectors.getActiveToolName(state))
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(translate()(MeasurementOverlay));