import React, { useState, useEffect, useRef } from 'react';
import selectors from 'selectors';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import core from 'core';
import actions from 'actions';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import Dropdown from '../Dropdown';
import Tooltip from '../Tooltip';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import {
  metricUnits,
  convertUnit,
  fractionalUnits,
  floatRegex,
  inFractionalRegex,
  ftInFractionalRegex,
  ftInDecimalRegex,
  parseFtInDecimal,
  parseInFractional,
  parseFtInFractional,
  hintValues
} from 'constants/measurementScale';
import classNames from 'classnames';

import './CalibrationPopup.scss';

const Scale = window.Core.Scale;

const parseMeasurementContentsByAnnotation = (annotation) => {
  const factor = annotation.Measure.axis[0].factor;
  const unit = annotation.Scale[1][1];

  switch (unit) {
    case 'ft-in':
      return (annotation.getLineLength() * factor) / 12;
    case 'in':
    default:
      return annotation.getLineLength() * factor;
  }
};

const getDefaultPageUnit = (pageUnit) => {
  if (pageUnit === 'pt') {
    return 'pt';
  }
  if (metricUnits.includes(pageUnit)) {
    return 'mm';
  }
  return 'in';
};

const CalibrationPropType = {
  annotation: PropTypes.shape({
    Scale: PropTypes.arrayOf(PropTypes.array),
  }),
};

const CalibrationPopup = ({ annotation }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [
    measurementUnits,
    { tempScale, isFractionalUnit, defaultUnit }
  ] = useSelector((state) => [
    selectors.getMeasurementUnits(state),
    selectors.getCalibrationInfo(state)
  ], shallowEqual);
  const [valueDisplay, setValueDisplay] = useState('');
  const inputRef = useRef(null);

  const unitTo = new Scale(tempScale).worldScale?.unit || 'mm';
  const unitToOptions = isFractionalUnit ? measurementUnits.to.filter((unit) => fractionalUnits.includes(unit)) : measurementUnits.to;
  const isFractionalUnitsToggleDisabled = !fractionalUnits.includes(unitTo);
  const valueInputType = (isFractionalUnit || unitTo === 'ft-in') ? 'text' : 'number';
  const inputValueClass = classNames('input-field', {
    'invalid-value': !(tempScale && new Scale(tempScale).worldScale?.value > 0)
  });

  const updateTempScale = (scaleValue, scaleUnit) => {
    const currentDistance = parseMeasurementContentsByAnnotation(annotation);
    const currentScale = annotation.Scale;
    const newRatio = currentDistance / currentScale[1][0];
    const pageScale = [currentScale[0][0] * newRatio, currentScale[0][1]];
    const defaultPageUnit = getDefaultPageUnit(scaleUnit);
    const defaultPageValue = convertUnit(pageScale[0], pageScale[1], defaultPageUnit);
    dispatch(actions.updateCalibrationInfo({ tempScale: `${defaultPageValue} ${defaultPageUnit} = ${scaleValue} ${scaleUnit}`, isFractionalUnit }));
  };

  const setValue = (scaleValue) => {
    updateTempScale(scaleValue, new Scale(tempScale).worldScale?.unit);
  };

  const setUnitTo = (scaleUnit) => {
    updateTempScale(new Scale(tempScale).worldScale?.value, scaleUnit);
  };

  const toggleFractionalUnits = () => {
    dispatch(actions.updateCalibrationInfo({ tempScale, isFractionalUnit: !isFractionalUnit }));
  };

  const onValueInputChange = (e) => {
    setValueDisplay(e.target.value);
    const inputValue = e.target.value.trim();
    if (!isFractionalUnit) {
      if (unitTo === 'ft-in' && ftInDecimalRegex.test(inputValue)) {
        const result = parseFtInDecimal(inputValue);
        if (result > 0) {
          setValue(result);
          return;
        }
      } else if (floatRegex.test(inputValue)) {
        const result = parseFloat(inputValue) || 0;
        setValue(result);
        return;
      }
    } else {
      if (unitTo === 'in') {
        if (inFractionalRegex.test(inputValue)) {
          const result = parseInFractional(inputValue);
          if (result > 0) {
            setValue(result);
            return;
          }
        }
      } else if (unitTo === 'ft-in') {
        if (ftInFractionalRegex.test(inputValue)) {
          const result = parseFtInFractional(inputValue);
          if (result > 0) {
            setValue(result);
            return;
          }
        }
      }
    }
    setValue(0);
  };

  const onValueInputBlur = () => {
    updateValueDisplay();
  };

  const updateValueDisplay = () => {
    const scaleValue = new Scale(tempScale).worldScale?.value;
    let newValueDisplay;
    if (!isFractionalUnit && unitTo !== 'ft-in') {
      newValueDisplay = `${scaleValue}`;
    } else {
      newValueDisplay = Scale.getFormattedValue(scaleValue, unitTo, isFractionalUnit ? 1 / 64 : 0.0001, false, true);
    }
    setValueDisplay(newValueDisplay || '');
  };

  const tempScaleRef = useRef(tempScale);
  useEffect(() => {
    tempScaleRef.current = tempScale;
  }, [tempScale]);
  useEffect(() => {
    if (annotation) {
      const value = parseMeasurementContentsByAnnotation(annotation);
      const unit = annotation.Scale[1][1];
      if (defaultUnit) {
        updateTempScale(convertUnit(value, unit, defaultUnit), defaultUnit);
      } else {
        updateTempScale(value, unit);
      }
    }

    const onAnnotationChanged = (annotations, action) => {
      if (action === 'modify' && annotations.length === 1 && annotations[0] === annotation) {
        const value = parseMeasurementContentsByAnnotation(annotation);
        const unit = annotation.Scale[1][1];
        const currentUnit = new Scale(tempScaleRef.current).worldScale?.unit;
        if (currentUnit) {
          updateTempScale(convertUnit(value, unit, currentUnit), currentUnit);
        } else {
          updateTempScale(value, unit);
        }
      }
    };
    core.addEventListener('annotationChanged', onAnnotationChanged);

    return () => {
      core.removeEventListener('annotationChanged', onAnnotationChanged);
      core.deleteAnnotations([annotation]);
    };
  }, [annotation]);

  useEffect(() => {
    if (inputRef?.current !== document.activeElement) {
      updateValueDisplay();
    }
  }, [tempScale, isFractionalUnit]);

  return (
    <div className="CalibrationPopup" data-element="calibrationPopup">
      <div className="input-container">
        <input
          className={inputValueClass}
          ref={inputRef}
          type={valueInputType}
          value={valueDisplay}
          min='0'
          onChange={onValueInputChange}
          onBlur={onValueInputBlur}
          placeholder={isFractionalUnit ? hintValues[unitTo] : (unitTo === 'ft-in' ? hintValues['ft-in decimal'] : '')}
        />
        <Tooltip content={'option.measurement.scaleModal.displayUnits'}>
          <div className="input-field">
            <Dropdown
              dataElement="calibrationUnits"
              items={unitToOptions}
              currentSelectionKey={unitTo}
              onClickItem={setUnitTo}
            />
          </div>
        </Tooltip>
      </div>
      <Tooltip content={t('option.measurement.scaleModal.fractionUnitsTooltip')}>
        <div>
          <Choice
            isSwitch
            leftLabel
            label={t('option.measurement.scaleModal.fractionalUnits')}
            disabled={isFractionalUnitsToggleDisabled}
            checked={isFractionalUnit}
            id="calibration-popup-fractional-units"
            className="pop-switch"
            onChange={toggleFractionalUnits}
          />
        </div>
      </Tooltip>
    </div>
  );
};

CalibrationPopup.propTypes = CalibrationPropType;

export default CalibrationPopup;
