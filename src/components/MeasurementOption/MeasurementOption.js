import React from 'react';
import PropTypes from 'prop-types';

import MeasurementsDropdown from 'components/MeasurementsDropdown';

import core from 'core';

import './MeasurementOption.scss';

class MeasurementOption extends React.PureComponent {
  static propTypes = {
    scale: PropTypes.arrayOf(PropTypes.array).isRequired,
    precision: PropTypes.number.isRequired,
    onOpenDropdownChange: PropTypes.func.isRequired,
    openMeasurementDropdown: PropTypes.number // not very sure why this is a number...
  }

  constructor(props){
    super(props);
    this.MEASUREMENT_TOOL_NAMES = [
      'AnnotationCreateDistanceMeasurement', 
      'AnnotationCreatePerimeterMeasurement', 
      'AnnotationCreateAreaMeasurement'
    ];
  }

  onScaleFromChange = e => {
    let [[scaleFrom, unitFrom], [scaleTo, unitTo]] = this.props.scale;
    scaleFrom = parseFloat(e.target.value);

    this.setMeasurementToolStyles({
      Scale: [[scaleFrom, unitFrom], [scaleTo, unitTo]]
    });
  };

  onUnitFromChange = unit => {
    let [[scaleFrom, unitFrom], [scaleTo, unitTo]] = this.props.scale;
    unitFrom = unit;

    this.setMeasurementToolStyles({
      Scale: [[scaleFrom, unitFrom], [scaleTo, unitTo]]
    });
    this.props.onOpenDropdownChange(-1);
  }

  onScaleToChange = e => {
    let [[scaleFrom, unitFrom], [scaleTo, unitTo]] = this.props.scale;
    scaleTo = parseFloat(e.target.value);

    this.setMeasurementToolStyles({
      Scale: [[scaleFrom, unitFrom], [scaleTo, unitTo]]
    });
  };

  onUnitToChange = unit => {
    let [[scaleFrom, unitFrom], [scaleTo, unitTo]] = this.props.scale;
    unitTo = unit;

    this.setMeasurementToolStyles({
      Scale: [[scaleFrom, unitFrom], [scaleTo, unitTo]]
    });
    this.props.onOpenDropdownChange(-1);
  }

  onPrecisionChange = precision => {
    this.setMeasurementToolStyles({
      Precision: precision
    });
    this.props.onOpenDropdownChange(-1);
  }

  setMeasurementToolStyles = styles => {
    this.MEASUREMENT_TOOL_NAMES.map(core.getTool).forEach(tool => {
      tool.setStyles(() => styles);
    });
  }

  onBlur = e => {
    // const { activeToolName } = this.props;
    // const { scaleFrom, scaleTo, scaleFromUnit, scaleToUnit } = this.state;
    // const toolsList = ['AnnotationCreateDistanceMeasurement', 'AnnotationCreatePerimeterMeasurement', 'AnnotationCreateAreaMeasurement'];
    // const activeScale = core.getTool(activeToolName).defaults.Scale;
    // if(e.target.value === ''){
    //   this.setState({ scaleFrom: activeScale[0][0], scaleTo: activeScale[1][0] });
    // } else {
    //   toolsList.filter(toolName => toolName !== activeToolName).concat([activeToolName]).forEach(toolName => {
    //     core.getTool(toolName).setStyles(() => ({
    //       ...core.getTool(toolName).defaults, Scale: [[scaleFrom, scaleFromUnit], [scaleTo, scaleToUnit]]
    //     }));
    //   });
    // }
  };

  render() { 
    const { scale, precision } = this.props;
    const unitOptions = [ 'in', 'mm', 'cm', 'pt' ];
    const scaleOptions = [ 0.1, 0.01, 0.001, 0.0001 ];
    const openDropdown = this.props.openMeasurementDropdown;
    return (
    <div className="MeasurementOption" onClick={()=> this.props.onOpenDropdownChange(-1)}>
      <div className="Scale">
        <div className="LayoutTitle">
          Scale
        </div>
        <div className="Layout">
          <input 
            className="textarea"
            type="number" 
            value={scale[0][0]}
            onChange={this.onScaleFromChange}
            onBlur={this.onBlur}
          /> 
          <div className={['ScaleDropdown', openDropdown === 0 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onUnitFromChange} 
              onDropdownChange={() => this.props.onOpenDropdownChange(0)}
              dropdownList={unitOptions} 
              selectedItem={scale[0][1]} 
              isDropdownOpen={openDropdown === 0}
            />
          </div>
          =
          <input 
            className="textarea"
            type="number" 
            value={scale[1][0]}
            onChange={this.onScaleToChange}
            onBlur={this.onBlur}
          /> 
          <div className={['ScaleDropdown', openDropdown === 1 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onScaleToUnitChange} 
              onDropdownChange={() => this.props.onOpenDropdownChange(1)}
              dropdownList={unitOptions} 
              selectedItem={scale[1][1]} 
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
          <div className={['PrecisionDropdown', openDropdown === 2 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={this.onPrecisionChange} 
              onDropdownChange={this.props.onOpenDropdownChange(2)}
              dropdownList={scaleOptions} 
              selectedItem={precision} 
              isDropdownOpen={openDropdown === 2} 
            />
          </div>
        </div>
      </div>
    </div>
    );
  }
}
 
export default MeasurementOption;