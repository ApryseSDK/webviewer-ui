import React from 'react';
import Selector from 'components/Selector';
import { useTranslation } from 'react-i18next';
import { isIE11 } from 'helpers/device';

const DimensionsInput = ({
  yOffset,
  height,
  xOffset,
  width,
  unit,
  autoTrim,
  supportedUnits,
  autoTrimOptions,
  onDimensionChange,
  onUnitChange,
  autoTrimActive,
  setAutoTrimActive,
  onAutoTrimChange,
}) => {
  // Resizes number input boxes so that units of measurement can be shown next to them as if they are also in the same box
  const resizeInput = (input) => {
    let maxLength = 5;
    let length = input.toString().length;
    let decimalSize = 0.3;
    if (isIE11) {
      const IE_ADJUSTMENT = 1.25;
      length *= IE_ADJUSTMENT;
      maxLength *= IE_ADJUSTMENT;
      decimalSize *= IE_ADJUSTMENT;
    }
    if (input.toString().includes('.')) {
      if (length > maxLength) {
        return maxLength + decimalSize;
      }
    }
    if (length > maxLength) {
      return maxLength;
    }
    return length;
  };

  const { t } = useTranslation();

  return (
    <div className="crop-dimensions">
      <div className="crop-dimensions-input-container">
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">W</span>
          <div className="input-field-container">
            <input
              name="width"
              data-testid="width-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: `${resizeInput(width)}ch` }}
              onChange={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={width}
            />
            <span className="dimension-input-unit">{width > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">H</span>
          <div className="input-field-container">
            <input
              name="height"
              data-testid="height-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: `${resizeInput(height)}ch` }}
              onChange={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={height}
            />
            <span className="dimension-input-unit">{height > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">X</span>
          <div className="input-field-container">
            <input
              name="xOffset"
              data-testid="xOffset-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: `${resizeInput(xOffset)}ch` }}
              onChange={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={xOffset}
            />
            <span className="dimension-input-unit">{xOffset > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">Y</span>
          <div className="input-field-container">
            <input
              name="yOffset"
              data-testid="yOffset-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: `${resizeInput(yOffset)}ch` }}
              onChange={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={(e) => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={yOffset}
            />
            <span className="dimension-input-unit">{yOffset > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
      </div>
      <div className="crop-dimensions-settings">
        <div className="dimensions-settings-title-container">
          <span className="dimensions-settings-title">{t('cropPopUp.dimensionInput.unitOfMeasurement')}</span>
        </div>
        <div className="custom-select unit-selector">
          <Selector items={Object.keys(supportedUnits)} selectedItem={unit} onItemSelected={onUnitChange} />
        </div>
      </div>
      <div className="crop-dimensions-settings">
        <div className="dimensions-settings-title-container">
          <span className="dimensions-settings-title">{t('cropPopUp.dimensionInput.autoTrim')}</span>
        </div>
        <div className="custom-select auto-trim-selector">
          <Selector
            items={autoTrimOptions}
            selectedItem={autoTrim && autoTrimActive ? autoTrim : ''}
            onItemSelected={onAutoTrimChange}
            placeHolder={autoTrim || autoTrimOptions[0]}
            selectedItemStyle={{ color: autoTrimActive ? 'var(--text-color)' : 'var(--gray-6)' }}
          />
        </div>
      </div>
    </div>
  );
};

export default DimensionsInput;
