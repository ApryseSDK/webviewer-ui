import React, { useEffect, useRef, useState } from 'react';
import Icon from 'components/Icon';
import Dropdown from 'components/Dropdown';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import { useTranslation } from 'react-i18next';

const DimensionsInput = ({
  top,
  right,
  bottom,
  left,
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

  /**
   * Resizes number input boxes so that units of measurement can be shown next to them as if they are also in the same box
   * @param {*} input the input to be displayed
   * @returns {number} the length of the input to resize the box to
   */
  const resizeInput = input => {
    let maxLength = 5;
    let length = input.toString().length;
    if (input.toString().includes('.')) {
      const DECIMAL_SIZE = 0.3;
      if (length > maxLength) {
        return maxLength + DECIMAL_SIZE;
      }
    }
    if (length > maxLength) {
      return maxLength;
    }
    return length;
  };

  /**
   * Toggles auto-trim on/off and defaults back to the first option if none was selected previously.
   */
  const toggleAutoTrim = () => {
    setAutoTrimActive(!autoTrimActive);
    if (!autoTrim) {
      onAutoTrimChange(autoTrimOptions[0]);
    }
  };

  useEffect(() => {
    if (autoTrimActive) {
      onAutoTrimChange(autoTrim);
    }
  }, [autoTrimActive]);

  const { t } = useTranslation();

  return (
    <div className="crop-dimensions">
      <div className="crop-dimensions-input-container">
        <label className="crop-dimensions-input">
          <Icon glyph="ic_align_top" />
          <div className="input-field-container">
            <input
              name="top"
              data-testid="top-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: resizeInput(top) + 'ch' }}
              onChange={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={top}
            />
            <span className="dimension-input-unit">{top > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <Icon glyph="ic_align_right" />
          <div className="input-field-container">
            <input
              name="right"
              data-testid="right-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: resizeInput(right) + 'ch' }}
              onChange={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={right}
            />
            <span className="dimension-input-unit">{right > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <Icon glyph="ic_align_bottom" />
          <div className="input-field-container">
            <input
              name="bottom"
              data-testid="bottom-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: resizeInput(bottom) + 'ch' }}
              onChange={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={bottom}
            />
            <span className="dimension-input-unit">{bottom > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
        <label className="crop-dimensions-input">
          <Icon glyph="ic_align_left" />
          <div className="input-field-container">
            <input
              name="left"
              data-testid="left-input"
              type="number"
              min="0"
              className="dimension-input-field"
              style={{ width: resizeInput(left) + 'ch' }}
              onChange={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              onKeyUp={e => {
                onDimensionChange(e.target.value, e.target.name);
                setAutoTrimActive(false);
              }}
              value={left}
            />
            <span className="dimension-input-unit">{left > 0 && supportedUnits[unit]}</span>
          </div>
        </label>
      </div>
      <div className="crop-dimensions-settings">
        <label>
          <div className="dimensions-settings-title-container">
            <Icon glyph="ic-calibrate" />
            <span className="dimensions-settings-title">{t('cropPopUp.dimensionInput.unitOfMeasurement')}</span>
          </div>
          <div className="custom-select unit-selector">
            <Dropdown items={Object.keys(supportedUnits)} onClickItem={onUnitChange} currentSelectionKey={unit} />
          </div>
        </label>
      </div>
      <div className="crop-dimensions-settings">
        <label>
          <Choice
            label={t('cropPopUp.dimensionInput.autoTrim') + ':'}
            onChange={toggleAutoTrim}
            checked={autoTrimActive}
          ></Choice>
          <div className="custom-select auto-trim-selector">
            <Dropdown
              disabled={!autoTrimActive}
              items={autoTrimOptions}
              onClickItem={onAutoTrimChange}
              currentSelectionKey={autoTrim ? autoTrim : autoTrimOptions[0]}
            />
          </div>
        </label>
      </div>
    </div>
  );
};

export default DimensionsInput;
