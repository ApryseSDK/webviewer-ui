import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Icon from 'components/Icon';

import core from 'core';
import { mapAnnotationToKey, mapToolNameToKey, getDataWithKey } from 'constants/map';
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
    activeToolName: PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      annotation: null
    };
    this.isLeftMouseDown = false;
  }

  componentDidMount() {
    core.addEventListener('mouseMove', this.onMouseMove);
    core.addEventListener('annotationSelected', this.onAnnotationSelected);
  }
  
  componentDidUpdate(prevProps) {
    const { openElement, closeElement } = this.props;

    if (prevProps.activeToolName !== this.props.activeToolName) {
      if (this.isMeasurementTool(this.props.activeToolName)) {
        openElement('measurementOverlay');
      } else {
        closeElement('measurementOverlay');
      }
    }
  }

  componentWillUnmount() {
    core.removeEventListener('mouseMove', this.onMouseMove);
    core.removeEventListener('annotationSelected', this.onAnnotationSelected);
  }

  onMouseMove = () => {
    const { activeToolName, isOpen } = this.props;
    if (!isOpen) {
      return;
    }

    const tool = core.getTool(activeToolName);
    if (this.isMeasurementTool(activeToolName) && tool.annotation) {
      if (this.state.annotation === tool.annotation) {
        this.forceUpdate();
      } else {
        this.setState({ annotation: tool.annotation });
      }
    } else if (
      activeToolName === 'AnnotationEdit' && 
      this.state.annotation &&
      core.isAnnotationSelected(this.state.annotation)
    ) {
      this.forceUpdate();
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
    } else {
      this.setState({ annotation: null });
      closeElement('measurementOverlay');
    }
  }

  isMeasurementAnnotation = annotation => ['distanceMeasurement', 'perimeterMeasurement', 'areaMeasurement'].includes(mapAnnotationToKey(annotation));

  isMeasurementTool = toolName => ['distanceMeasurement', 'perimeterMeasurement', 'areaMeasurement'].includes(mapToolNameToKey(toolName));

  getAngleInRadians = (pt1, pt2) => 
    pt1 && pt2
      ? Math.atan2(pt2.y - pt1.y, pt2.x - pt1.x)
      : undefined

  getNumberOfDecimalPlaces = annotation => 
    annotation.Precision === 1 
      ? 0 
      : annotation.Precision.toString().split('.')[1].length;

  renderTitle = () => {
    const key = mapAnnotationToKey(this.state.annotation);
    const { icon } = getDataWithKey(key);

    // TODO: i18n
    const keyTitleMap = {
      distanceMeasurement: 'Distance Measurement',
      perimeterMeasurement: 'Perimeter Measurement',
      areaMeasurement: 'Area Measurement'
    };

    return (
      <div className="measurement__title">
        {icon &&
          <Icon className="measurement__icon" glyph={icon} />
        }
        {keyTitleMap[key]}
      </div>
    );
  }

  renderValue = () => {
    const { annotation } = this.state;
    const key = mapAnnotationToKey(annotation);

    // TODO: i18n
    const keyDisplayNameMap = {
      distanceMeasurement: 'Distance',
      perimeterMeasurement: 'Perimeter',
      areaMeasurement: 'Area'
    };

    return (
      <div className="measurement__value">
        {keyDisplayNameMap[key]}: {annotation.getContents()}
      </div>
    );
  }

  renderDistanceChange = () => {
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
    const key = mapAnnotationToKey(annotation);
    const getIPathAnnotationLastTwoPts = annotation => {
      const path = annotation.getPath();
      return [path[path.length - 2], path[path.length - 1]];
    } ;
    const keyPtMap = {
      distanceMeasurement: ({ Start, End }) => [Start, End],
      perimeterMeasurement: getIPathAnnotationLastTwoPts,
      areaMeasurement: getIPathAnnotationLastTwoPts
    };
    const [pt1, pt2] = keyPtMap[key](annotation);
    
    let angle = this.getAngleInRadians(pt1, pt2);
    if (angle) {
      angle = Math.abs(angle / Math.PI * 180);
      angle = angle > 90 ? 180 - angle : angle;

      const decimalPlaces = this.getNumberOfDecimalPlaces(annotation);
      angle = angle.toFixed(decimalPlaces);
    }
    
    return (
      angle !== undefined && <div className="measurement__angle">Angle: {angle}&deg;</div>
    );
  }

  render() {
    const { annotation } = this.state;
    const { isDisabled } = this.props;
    const className = getClassName('Overlay MeasurementOverlay', this.props);
    const key = mapAnnotationToKey(annotation);

    if (isDisabled || !annotation) {
      return null;
    }

    // todo: i18n scale and precision
    return (
      <div className={className} data-element="measurementOverlay">
        {this.renderTitle()}
        <div className="measurement__scale">
          scale: {annotation.Measure.scale}
        </div>
        <div className="measurement__precision">
          precision: {annotation.Precision}
        </div>
        {this.renderValue()}
        {key === 'distanceMeasurement' &&
          this.renderDistanceChange()
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
});

const mapDispatchToProps = {
  openElement: actions.openElement,
  closeElement: actions.closeElement
};

export default connect(mapStateToProps, mapDispatchToProps)(MeasurementOverlay);