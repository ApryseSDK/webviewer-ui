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
    openMeasurementDropdown: PropTypes.number // not very sure why this is a number, the name sounds like a function...
  }

  constructor(props){
    super(props);
    this.scaleFromRef = React.createRef();
    this.scaleToRef = React.createRef();
  }

  onBlur = () => {
    const scaleFromRefValue = this.scaleFromRef.current.value;
    const scaleToRefValue = this.scaleToRef.current.value;
    const [[scaleFrom, unitFrom], [scaleTo, unitTo]] = this.props.scale;

    if (scaleFromRefValue === '') {
      this.scaleFromRef.current.value = scaleFrom;
    } else if (scaleToRefValue === '') {
      this.scaleToRef.current.value = scaleTo;
    } else {
      this.setMeasurementToolStyles({
        Scale: [
          [parseFloat(scaleFromRefValue), unitFrom], 
          [parseFloat(scaleToRefValue), unitTo]
        ]
      });
    }
  };

  setMeasurementToolStyles = styles => {
    const MEASUREMENT_TOOL_NAMES = [
      'AnnotationCreateDistanceMeasurement', 
      'AnnotationCreatePerimeterMeasurement', 
      'AnnotationCreateAreaMeasurement'
    ] ;

    MEASUREMENT_TOOL_NAMES.map(core.getTool).forEach(tool => {
      tool.setStyles(() => styles);
    });

    this.props.onOpenDropdownChange(-1);
  }

  render() { 
    const { 
      scale, 
      precision, 
      openMeasurementDropdown,
      onOpenDropdownChange 
    } = this.props;
    const [[scaleFrom, unitFrom], [scaleTo, unitTo]] = scale;
    const unitFromOptions = ['in', 'mm', 'cm', 'pt'];
    const unitToOptions = ['in', 'mm', 'cm', 'pt', 'ft', 'm', 'yd', 'km', 'mi'];
    const scaleOptions = [0.1, 0.01, 0.001, 0.0001];

    return (
    <div className="MeasurementOption" onClick={()=> onOpenDropdownChange(-1)}>
      <div className="Scale">
        <div className="LayoutTitle">
          Scale
        </div>
        <div className="Layout">
          <input 
            className="textarea"
            type="number" 
            ref={this.scaleFromRef}
            defaultValue={scaleFrom}
            onBlur={this.onBlur}
          /> 
          <div className={['ScaleDropdown', openMeasurementDropdown === 0 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={
                unit => this.setMeasurementToolStyles({ 
                  Scale: [[scaleFrom, unit], [scaleTo, unitTo]] 
                })
              } 
              onDropdownChange={() => onOpenDropdownChange(0)}
              dropdownList={unitFromOptions} 
              selectedItem={unitFrom} 
              isDropdownOpen={openMeasurementDropdown === 0}
            />
          </div>
          =
          <input 
            className="textarea"
            type="number" 
            ref={this.scaleToRef}
            defaultValue={scaleTo}
            onChange={this.onScaleToChange}
            onBlur={this.onBlur}
          /> 
          <div className={['ScaleDropdown', openMeasurementDropdown === 1 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={
                unit => this.setMeasurementToolStyles({ 
                  Scale: [[scaleFrom, unitFrom], [scaleTo, unit]] 
                })
              } 
              onDropdownChange={() => onOpenDropdownChange(1)}
              dropdownList={unitToOptions} 
              selectedItem={unitTo} 
              isDropdownOpen={openMeasurementDropdown === 1} 
            />
          </div>
        </div>
      </div>
      <div className="Precision">
        <div className="LayoutTitle">
          Precision
        </div>
        <div className="Layout">
          <div className={['PrecisionDropdown', openMeasurementDropdown === 2 ? 'open': ''].join(' ').trim()}>
            <MeasurementsDropdown 
              onClick={
                precision => this.setMeasurementToolStyles({
                  Precision: precision
                })
              } 
              onDropdownChange={() => onOpenDropdownChange(2)}
              dropdownList={scaleOptions} 
              selectedItem={precision} 
              isDropdownOpen={openMeasurementDropdown === 2} 
            />
          </div>
        </div>
      </div>
    </div>
    );
  }
}
 
export default MeasurementOption;