import React from 'react';
import { useTranslation } from 'react-i18next';
import Dropdown from 'components/Dropdown';

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
  const { t } = useTranslation();

  return (
    <div className="crop-dimensions">
      <div className="crop-dimensions-input-container">
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">W</span>
          <input
            name="width"
            data-testid="width-input"
            type="number"
            min="0"
            step="any"
            className="dimension-input-field"
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
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">H</span>
          <input
            name="height"
            data-testid="height-input"
            type="number"
            min="0"
            step="any"
            className="dimension-input-field"
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
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">X</span>
          <input
            name="xOffset"
            data-testid="xOffset-input"
            type="number"
            min="0"
            step="any"
            className="dimension-input-field"
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
        </label>
        <label className="crop-dimensions-input">
          <span className="dimensions-settings-title">Y</span>
          <input
            name="yOffset"
            data-testid="yOffset-input"
            type="number"
            min="0"
            step="any"
            className="dimension-input-field"
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
        </label>
      </div>
      <div className="crop-dimensions-settings">
        <div className="dimensions-settings-title-container">
          <label id="crop-dimensions-unit-label" htmlFor='document-crop-unit-dropdown' className="dimensions-settings-title">{t('cropPopUp.dimensionInput.unitOfMeasurement')}</label>
        </div>
        <Dropdown
          id='document-crop-unit-dropdown'
          labelledById='crop-dimensions-unit-label'
          className='document-crop-dropdown'
          ariaLabel={t('cropPopUp.dimensionInput.unitOfMeasurement')}
          items={Object.keys(supportedUnits)}
          currentSelectionKey={unit}
          onClickItem={onUnitChange}
        />
      </div>
      <div className="crop-dimensions-settings">
        <div className="dimensions-settings-title-container">
          <label id="crop-auto-trim-label" htmlFor='document-crop-auto-trim-dropdown' className="dimensions-settings-title">{t('cropPopUp.dimensionInput.autoTrim')}</label>
        </div>
        <Dropdown
          id='document-crop-auto-trim-dropdown'
          labelledById='crop-auto-trim-label'
          className='document-crop-dropdown'
          ariaLabel={t('cropPopUp.dimensionInput.autoTrim')}
          items={autoTrimOptions}
          currentSelectionKey={autoTrim && autoTrimActive ? autoTrim : autoTrimOptions[0]}
          onClickItem={onAutoTrimChange}
        />
      </div>
    </div>
  );
};

export default DimensionsInput;
