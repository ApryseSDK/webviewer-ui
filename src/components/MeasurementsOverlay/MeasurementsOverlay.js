import React from 'react';
import { connect } from 'react-redux';

import core from 'core';

import MeasurementsDropdown from 'components/MeasurementsDropdown';
import selectors from 'selectors';

import './MeasurementsOverlay.scss';

class MeasurementsOverlay extends React.PureComponent {
  constructor(props){
    super(props);
    this.state = { scaleFrom: 1, scaleTo: 1, scaleFromUnit: 'in', scaleToUnit: 'in', precision: 0.01 };
  }

  componentDidMount() {
    const { activeToolName } = this.props;
    const activeScale = core.getTool(activeToolName).defaults.Scale;
    const activePrecision = core.getTool(activeToolName).defaults.Precision;
    if (!activeScale) {
      this.setState({ precision: 0.01 });
      const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
      toolsList.forEach(toolName => {
        core.getTool(toolName).setStyles(() => ({
          ...core.getTool(toolName).defaults, Scale: [[1, 'in'], [1, 'in']]
        }));
      });
    } else {
      this.setState({ scaleFrom: activeScale[0][0], scaleTo: activeScale[1][0], scaleFromUnit: activeScale[0][1], scaleToUnit: activeScale[1][1], precision: activePrecision });
    }
  }

  onScaleFromChange = e => {
    const re = /^[0-9\b]*[.]?[0-9\b]*$/;
    if (re.test(e.target.value) || e.target.value === ''){
      this.setState({ scaleFrom: e.target.value });
    }
  };

  onScaleToChange = e => {
    const re = /^[0-9\b]*[.]?[0-9\b]*$/;
    if (re.test(e.target.value) || e.target.value === ''){
      this.setState({ scaleTo: e.target.value });
    }
  };

  onPrecisionChange = item => {
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ precision: item });
    toolsList.forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults, Precision: item,
      }));
    });
  }

  onScaleFromUnitChange = unit => {
    const { scaleFrom, scaleTo, scaleToUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ scaleFromUnit: unit });
    toolsList.forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults,
        Scale: [[scaleFrom, unit], [scaleTo, scaleToUnit]]
      }));
    });
  }

  onScaleToUnitChange = unit => {
    const { scaleFrom, scaleTo, scaleFromUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ scaleToUnit: unit });
    toolsList.forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults,
        Scale: [[scaleFrom, scaleFromUnit], [scaleTo, unit]]
      }));
    });
  }


  onBlur = () => {
    const { scaleFrom, scaleTo, scaleFromUnit, scaleToUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    toolsList.forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults, Scale: [[scaleFrom, scaleFromUnit], [scaleTo, scaleToUnit]]
      }));
    });
  };

  render() { 
    const units = [ 'in', 'px', 'cm' ];
    const scales = [ 0.1, 0.01, 0.001, 0.0001 ];
    return (
    <div className="MeasurementsOverlay">
      <div className="Scale">
        <div className="LayoutTitle">
          Scale
        </div>
        <div className="Layout">
          <textarea 
            className="textarea"
            maxLength="5"
            value={this.state.scaleFrom}
            onChange={this.onScaleFromChange}
            onBlur={this.onBlur}
          />
          <div className="ScaleDropdown">
            <MeasurementsDropdown onClick={this.onScaleFromUnitChange} dropdownList={units} selectedItem={this.state.scaleFromUnit} />
          </div>
          =
          <textarea 
            className="textarea"
            maxLength="5"
            value={this.state.scaleTo}
            onChange={this.onScaleToChange}
            onBlur={this.onBlur}
          />
          <div className="ScaleDropdown">
            <MeasurementsDropdown onClick={this.onScaleToUnitChange} dropdownList={units} selectedItem={this.state.scaleToUnit}/>
          </div>
        </div>
      </div>
      <div className="Precision">
        <div className="LayoutTitle">
          Precision
        </div>
        <div className="Layout">
          <div className="PrecisionDropdown">
            <MeasurementsDropdown onClick={this.onPrecisionChange} dropdownList={scales} selectedItem={this.state.precision}/>
          </div>
        </div>
      </div>
    </div>
    );
  }
}
 
const mapStateToProps = state => ({
  activeToolName: selectors.getActiveToolName(state)
});
export default connect(mapStateToProps)(MeasurementsOverlay);