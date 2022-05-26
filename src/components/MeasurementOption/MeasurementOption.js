import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { withTranslation } from 'react-i18next';
import { isFirefox } from 'helpers/device';
import i18next from 'i18next';

import Choice from 'components/Choice/Choice';

import core from 'core';
import { workerTypes } from 'constants/types';
import DataElements from 'constants/dataElement';
import selectors from 'selectors';
import actions from 'actions';
import getMeasurementTools, {
  MeasurementUnits,
} from 'src/helpers/getMeasurementTools';

import './MeasurementOption.scss';

const decimalPrecision = [
  { value: 0.1, name: '0.1', format: 'D' },
  { value: 0.01, name: '0.01', format: 'D' },
  { value: 0.001, name: '0.001', format: 'D' },
  { value: 0.0001, name: '0.0001', format: 'D' },
];
const fractionPrecision = [
  { value: 0.125, name: '1/8', format: 'F' },
  { value: 0.0625, name: '1/16', format: 'F' },
  { value: 0.03125, name: '1/32', format: 'F' },
  { value: 0.015625, name: '1/64', format: 'F' },
];

const getPrecisionByUnit = unit => {
  switch (unit) {
    case MeasurementUnits.IN:
    case MeasurementUnits.FT_IN:
      return [...fractionPrecision, ...decimalPrecision];
    default:
      return decimalPrecision;
  }
};
const isImperialFractionUnit = unit => ['in', 'ft-in'].includes(unit);
const isPrecisionInFractionMark = precision => [1 / 8, 1 / 16, 1 / 32, 1 / 64].includes(precision);

class MeasurementOption extends React.Component {
  static propTypes = {
    // The current scale of a measurement tool that is consisted of two arrays
    // The first array represents the document scale and the second array represents the world scale
    // For example [[1, 'in'], [4, 'ft']] means 1 inch measured in the document is equal to 4 feet in the real world
    scale: PropTypes.arrayOf(PropTypes.array).isRequired,
    // The current precision of a measurement tool that is used to determine how many decimal places a calculated value should display
    // Calculated value depends on what the measurement tool is. For example it is distance for distance measurement tool
    precision: PropTypes.number.isRequired,
    // A prop that is passed down from translate HOC and is used to internationalize strings
    t: PropTypes.func.isRequired,
    measurementUnits: PropTypes.shape({
      from: PropTypes.array,
      to: PropTypes.array,
    }).isRequired,
    onStyleChange: PropTypes.func.isRequired,
    isScaleInputDisabled: PropTypes.bool,
    isPrecisionInputDisabled: PropTypes.bool,
    isSnapModeEnabled: PropTypes.bool,
    hideSnapModeCheckbox: PropTypes.bool,
    onSnapModeChange: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      currScaleFrom: props.scale[0][0],
      currUnitFrom: props.scale[0][1],
      currScaleTo: props.scale[1][0],
      currUnitTo: props.scale[1][1],
      currPrecision: props.precision,
      documentType: core.getDocument()?.getType(),
    };
  }

  componentDidMount() {
    core.addEventListener('documentLoaded', this.onDocumentLoaded);
  }

  componentDidUpdate(prevProps) {
    const { scale, precision } = this.props;

    if (this.props.scale !== prevProps.scale) {
      this.setState({
        currScaleFrom: scale[0][0],
        currUnitFrom: scale[0][1],
        currScaleTo: scale[1][0],
        currUnitTo: scale[1][1],
      });
    }
    if (this.props.precision !== prevProps.precision) {
      this.setState({
        currPrecision: precision,
      });
    }
  }

  componentWillUnmount() {
    core.removeEventListener('documentLoaded', this.onDocumentLoaded);
  }

  onDocumentLoaded = () => {
    this.setState({
      documentType: core.getDocument().getType(),
    });
  };

  onScaleChange = (value, type) => {
    this.setState({ [type]: Number(value) }, () => {
      this.props.onStyleChange('Scale', [
        [this.state.currScaleFrom, this.state.currUnitFrom],
        [this.state.currScaleTo, this.state.currUnitTo],
      ]);
    });
  };

  onPrecisionChange = (value, type) => {
    const { onStyleChange } = this.props;
    this.setState({ [type]: Number(value) }, () => {
      const { currPrecision } = this.state;
      onStyleChange('Precision', currPrecision);
    });
  };

  onUnitChange = (event, type) => {
    const { onStyleChange } = this.props;
    const value = event.target.value;
    this.setState({ [type]: value }, () => {
      const newScale = [
        [this.state.currScaleFrom, this.state.currUnitFrom],
        [this.state.currScaleTo, this.state.currUnitTo],
      ];
      onStyleChange('Scale', newScale);
    });
  };

  onSnappingChange = event => {
    if (!core.isFullPDFEnabled()) {
      return;
    }

    const enableSnapping = event.target.checked;
    const mode = enableSnapping ? window.documentViewer.SnapMode.e_DefaultSnapMode | window.documentViewer.SnapMode.POINT_ON_LINE : null;
    const measurementTools = getMeasurementTools();

    measurementTools.forEach(tool => {
      tool.setSnapMode?.(mode);
    });
    if (this.props.onSnapModeChange) {
      this.props.onSnapModeChange(enableSnapping);
    }
  };

  getLanguage = () => {
    let lang = 'en';

    if (i18next.language) {
      lang = i18next.language;
    }

    return lang;
  };

  formatValue = value => {
    const lang = this.getLanguage();

    if (lang === 'de') {
      value = value.toLocaleString('de-DE', { maximumFractionDigits: 4 });
    } else if (lang === 'fr') {
      value = value.toLocaleString('fr-FR', { maximumFractionDigits: 4 });
    } else if (lang === 'ru') {
      value = value.toLocaleString('ru-RU', { maximumFractionDigits: 4 });
    }

    return value;
  };

  renderScaleInput = (type, val) => {
    // There is a bug with Firefox 69 where after onFocus, it calls onBlur right away. Remove after the issue resolved.
    if (isFirefox) {
      return (
        <input
          className="ScaleInput"
          type="number"
          step="any"
          value={val}
          onChange={e => this.onScaleChange(e.target.value, type)}
        />
      );
    }

    return (
      <input
        type="number"
        inputMode="decimal"
        step="any"
        className="ScaleInput" 
        onChange={e => this.onScaleChange(e.target.value, type)}
        value={this.formatValue(val)}
      /> 
    )
  };

  render() {
    const {
      measurementUnits,
      t,
      isScaleInputDisabled,
      isPrecisionInputDisabled,
      isSnapModeEnabled,
      hideSnapModeCheckbox,
    } = this.props;
    const { from: unitFromOptions, to: unitToOptions } = measurementUnits;
    const precisionOptions = getPrecisionByUnit(this.state.currUnitTo);

    if (isScaleInputDisabled && isPrecisionInputDisabled) {
      return null;
    }

    return (
      <div className="MeasurementOption">
        {!isScaleInputDisabled && (
          <div className="Scale" data-element={DataElements.SCALE_INPUT_CONTAINER}>
            <div className="LayoutTitle">{t('option.measurementOption.scale')}</div>
            <div className="Layout">
              {this.renderScaleInput('currScaleFrom', this.state.currScaleFrom)}
              <select
                className="UnitInput"
                value={this.state.currUnitFrom}
                onChange={event => this.onUnitChange(event, 'currUnitFrom')}
              >
                {unitFromOptions.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
              <div className="ScaleEquals">=</div>
              {this.renderScaleInput('currScaleTo', this.state.currScaleTo)}
              <select
                className="UnitInput"
                value={this.state.currUnitTo}
                onChange={event => this.onUnitChange(event, 'currUnitTo')}
              >
                {unitToOptions.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {!isPrecisionInputDisabled && (
          <div className="Precision" data-element={DataElements.PRECISION_INPUT_CONTAINER}>
            <div className="LayoutTitlePrecision">{t('option.shared.precision')}</div>
            <div className="LayoutPrecision">
              <select
                className="PrecisionInput"
                value={this.state.currPrecision}
                onChange={e => this.onPrecisionChange(e.target.value, 'currPrecision')}
              >
                {precisionOptions.map(e => (
                  <option key={e.value} value={e.value}>
                    {e.format === 'F' ? e.name : this.formatValue(e.value)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        )}
        {this.state.documentType === workerTypes.PDF && !hideSnapModeCheckbox && (
          <div className="options">
            <Choice
              dataElement="measurementSnappingOption"
              id="measurement-snapping"
              type="checkbox"
              label={t('option.shared.enableSnapping')}
              checked={isSnapModeEnabled}
              onChange={this.onSnappingChange}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  measurementUnits: selectors.getMeasurementUnits(state),
  isScaleInputDisabled: selectors.isElementDisabled(state, DataElements.SCALE_INPUT_CONTAINER),
  isPrecisionInputDisabled: selectors.isElementDisabled(state, DataElements.PRECISION_INPUT_CONTAINER),
  isSnapModeEnabled: selectors.isSnapModeEnabled(state),
  activeToolName: selectors.getActiveToolName(state),
});

const mapDispatchToProps = {
  onSnapModeChange: actions.setEnableSnapMode,
};

export default connect(mapStateToProps, mapDispatchToProps)(withTranslation()(MeasurementOption));
