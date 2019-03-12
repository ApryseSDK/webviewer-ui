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
    this.setState({ scaleFrom: e.target.value });
  };

  onScaleToChange = e => {
    this.setState({ scaleTo: e.target.value });
  };

  onPrecisionChange = item => {
    const { activeToolName, onOpenDropdownChange } = this.props;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ precision: item });
    onOpenDropdownChange(-1);
    toolsList.filter(toolName => toolName !== activeToolName).concat([activeToolName]).forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults, Precision: item,
      }));
    });
  }

  onScaleFromUnitChange = unit => {
    const { activeToolName, onOpenDropdownChange } = this.props;
    const { scaleFrom, scaleTo, scaleToUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ scaleFromUnit: unit });
    onOpenDropdownChange(-1);
    // Makes the active tool the last element of the list 
    // which allows stylePopup to display the correct opacity and thickness.
    toolsList.filter(toolName => toolName !== activeToolName).concat([activeToolName]).forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults,
        Scale: [[scaleFrom, unit], [scaleTo, scaleToUnit]]
      }));
    });
  }

  onScaleToUnitChange = unit => {
    const { activeToolName, onOpenDropdownChange } = this.props;
    const { scaleFrom, scaleTo, scaleFromUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    this.setState({ scaleToUnit: unit });
    onOpenDropdownChange(-1);
    toolsList.filter(toolName => toolName !== activeToolName).concat([activeToolName]).forEach(toolName => {
      core.getTool(toolName).setStyles(() => ({
        ...core.getTool(toolName).defaults,
        Scale: [[scaleFrom, scaleFromUnit], [scaleTo, unit]]
      }));
    });
  }


  onBlur = e => {
    const { activeToolName } = this.props;
    const { scaleFrom, scaleTo, scaleFromUnit, scaleToUnit } = this.state;
    const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    const activeScale = core.getTool(activeToolName).defaults.Scale;
    if(e.target.value === ''){
      this.setState({ scaleFrom: activeScale[0][0], scaleTo: activeScale[1][0] });
    } else {
      toolsList.filter(toolName => toolName !== activeToolName).concat([activeToolName]).forEach(toolName => {
        core.getTool(toolName).setStyles(() => ({
          ...core.getTool(toolName).defaults, Scale: [[scaleFrom, scaleFromUnit], [scaleTo, scaleToUnit]]
        }));
      });
    }
  };

  render() { 
    const units = [ 'in', 'mm', 'cm', 'pt' ];
    const scales = [ 0.1, 0.01, 0.001, 0.0001 ];
    const openDropdown = this.props.openMeasurementDropdown;
    return (
    <div className="MeasurementsOverlay" onClick={()=>{this.props.onOpenDropdownChange(-1)}}>
      <div className="Scale">
        <div className="LayoutTitle">
          Scale
        </div>
        <div className="Layout">
          <input 
            className="textarea"
            type="number" 
            value={this.state.scaleFrom}
            onChange={this.onScaleFromChange}
            onBlur={this.onBlur}
          /> 
          <div className={["ScaleDropdown", openDropdown === 0 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onScaleFromUnitChange} 
              onDropdownChange={
                ()=>{
                  this.props.onOpenDropdownChange(0);
                }
              }
              dropdownList={units} 
              selectedItem={this.state.scaleFromUnit} 
              isDropdownOpen={openDropdown === 0}
            />
          </div>
          =
          <input 
            className="textarea"
            type="number" 
            value={this.state.scaleTo}
            onChange={this.onScaleToChange}
            onBlur={this.onBlur}
          /> 
          <div className={["ScaleDropdown", openDropdown === 1 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onScaleToUnitChange} 
              onDropdownChange={
                ()=>{
                  this.props.onOpenDropdownChange(1);
                }
              }
              dropdownList={units} 
              selectedItem={this.state.scaleToUnit} 
              isDropdownOpen={openDropdown === 1} 
            />
          </div>
        </div>
      </div>
      <div className="Precision">
        <div className="LayoutTitle">
          Precision
        </div>
        <div className="Layout">
          <div className={["PrecisionDropdown", openDropdown === 2 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onPrecisionChange} 
              onDropdownChange={
                ()=>{
                  this.props.onOpenDropdownChange(2);
                }
              }
              dropdownList={scales} 
              selectedItem={this.state.precision} 
              isDropdownOpen={openDropdown === 2} 
            />
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