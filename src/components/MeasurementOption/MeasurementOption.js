import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { translate } from 'react-i18next';

import MeasurementsDropdown from 'components/MeasurementsDropdown';

import selectors from 'selectors';

import './MeasurementOption.scss';

class MeasurementOption extends React.PureComponent {
  static propTypes = {
    /**
     * The current scale of a measurement tool that is consisted of two arrays
     * The first array represents the document scale and the second array represents the world scale
     * For example [[1, 'in'], [4, 'ft']] means 1 inch measured in the document is equal to 4 feet in the real world
     */
    scale: PropTypes.arrayOf(PropTypes.array).isRequired,
    /**
     * The current precision of a measurement tool that is used to determine how many decimal places a calculated value should display
     * Calculated value depends on what the measurement tool is. For example it is distance for distance measurement tool
     */
    precision: PropTypes.number.isRequired,
    /**
     * A prop that is passed down from translate HOC and is used to internationalize strings
     */
    t: PropTypes.func.isRequired,
    measurementUnits: PropTypes.shape({
      from: PropTypes.array,
      to: PropTypes.array,
    }).isRequired,
    onStyleChange: PropTypes.func.isRequired,
    onOpenDropdownChange: PropTypes.func.isRequired,
    openMeasurementDropdown: PropTypes.number,
  };

  scaleFromRef = React.createRef();
  scaleToRef = React.createRef();

  /**
   * A callback function that is used to change the scale for a measurement tool
   * The argument has the same format as this.props.scale
   * If values in the array are falsy then current value will be used instead
   */
  onScaleChange = ([[scaleFrom, unitFrom], [scaleTo, unitTo]]) => {
    const { scale } = this.props;

    scaleFrom = scaleFrom || scale[0][0];
    unitFrom = unitFrom || scale[0][1];
    scaleTo = scaleTo || scale[1][0];
    unitTo = unitTo || scale[1][1];

    this.props.onStyleChange('Scale', [
      [scaleFrom, unitFrom],
      [scaleTo, unitTo],
    ]);
    this.props.onOpenDropdownChange(-1);
  };

  onPrecisionChange = precision => {
    this.props.onStyleChange('Precision', precision);
    this.props.onOpenDropdownChange(-1);
  };

  onBlur = () => {
    const scaleFromRefValue = this.scaleFromRef.current.value;
    const scaleToRefValue = this.scaleToRef.current.value;
    const [[scaleFrom], [scaleTo]] = this.props.scale;

    if (scaleFromRefValue === '') {
      this.scaleFromRef.current.value = scaleFrom;
    } else if (scaleToRefValue === '') {
      this.scaleToRef.current.value = scaleTo;
    }
  };

  render() {
    const {
      scale,
      precision,
      measurementUnits,
      openMeasurementDropdown,
      onOpenDropdownChange,
      t,
    } = this.props;
    const [[scaleFrom, unitFrom], [scaleTo, unitTo]] = scale;
    const { from: unitFromOptions, to: unitToOptions } = measurementUnits;
    const scaleOptions = [0.1, 0.01, 0.001, 0.0001];

    return (
      <div
        className="MeasurementOption"
        onClick={() => onOpenDropdownChange(-1)}
      >
        <div className="Scale">
          <div className="LayoutTitle">
            {t('option.measurementOption.scale')}
          </div>
          <div className="Layout">
            <input
              className="textarea"
              type="text"
              ref={this.scaleFromRef}
              defaultValue={scaleFrom}
              onChange={e =>
                e.target.value &&
                this.onScaleChange([[Number(e.target.value)], []])
              }
              onBlur={this.onBlur}
            />
            <div
              className={[
                'ScaleDropdown',
                openMeasurementDropdown === 0 ? 'open' : '',
              ]
                .join(' ')
                .trim()}
            >
              <MeasurementsDropdown
                onClick={unit => this.onScaleChange([[undefined, unit], []])}
                onDropdownChange={() => onOpenDropdownChange(0)}
                dropdownList={unitFromOptions}
                selectedItem={unitFrom}
                isDropdownOpen={openMeasurementDropdown === 0}
              />
            </div>
            =
            <input
              className="textarea"
              type="text"
              ref={this.scaleToRef}
              defaultValue={scaleTo}
              onChange={e =>
                e.target.value &&
                this.onScaleChange([[], [Number(e.target.value)]])
              }
              onBlur={this.onBlur}
            />
            <div
              className={[
                'ScaleDropdown',
                openMeasurementDropdown === 1 ? 'open' : '',
              ]
                .join(' ')
                .trim()}
            >
              <MeasurementsDropdown
                onClick={unit => this.onScaleChange([[], [undefined, unit]])}
                onDropdownChange={() => onOpenDropdownChange(1)}
                dropdownList={unitToOptions}
                selectedItem={unitTo}
                isDropdownOpen={openMeasurementDropdown === 1}
              />
            </div>
          </div>
        </div>
        <div className="Precision">
          <div className="LayoutTitle">{t('option.shared.precision')}</div>
          <div className="Layout">
            <div
              className={[
                'PrecisionDropdown',
                openMeasurementDropdown === 2 ? 'open' : '',
              ]
                .join(' ')
                .trim()}
            >
              <MeasurementsDropdown
                onClick={this.onPrecisionChange}
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

const mapStateToProps = state => ({
  measurementUnits: selectors.getMeasurementUnits(state),
});

export default connect(mapStateToProps)(translate()(MeasurementOption));
