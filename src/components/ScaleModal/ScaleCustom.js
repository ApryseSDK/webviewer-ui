import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import selectors from 'selectors';
import Tooltip from '../Tooltip';
import Dropdown from '../Dropdown';
import {
  ifFractionalPrecision,
  hintValues,
  HintKeys,
  Units,
  convertUnit,
  fractionalUnits,
  floatRegex,
  inFractionalRegex,
  ftInFractionalRegex,
  ftInDecimalRegex,
  parseFtInDecimal,
  parseInFractional,
  parseFtInFractional
} from 'constants/measurementScale';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { getDOMActiveElement } from 'src/helpers/webComponent';

const Scale = window.Core.Scale;

const ScaleCustomProps = {
  scale: PropTypes.array,
  onScaleChange: PropTypes.func,
  precision: PropTypes.number
};

function ScaleCustom({ scale, onScaleChange, precision }) {
  const [measurementUnits] = useSelector((state) => [selectors.getMeasurementUnits(state)], shallowEqual);
  const [pageValueDisplay, setPageValueDisplay] = useState('');
  const [worldValueDisplay, setWorldValueDisplay] = useState('');
  const [pageWarningMessage, setPageWarningMessage] = useState('');
  const [worldWarningMessage, setWorldWarningMessage] = useState('');
  const [scaleValueBlurFlag, setScaleValueBlurFlag] = useState(false);

  const [leftDropdownWidth, setLeftDropdownWidth] = useState(0);
  const pageValueInput = useRef(null);
  const worldValueInput = useRef(null);
  const leftContainerRef = useRef(null);

  const [t] = useTranslation();

  const isFractionalPrecision = ifFractionalPrecision(precision);
  const filterFractionalUnits = (units = []) => units.filter((unit) => fractionalUnits.includes(unit));
  const unitFromOptions = isFractionalPrecision ? filterFractionalUnits(measurementUnits?.from) : (measurementUnits?.from || []);
  const unitToOptions = isFractionalPrecision ? filterFractionalUnits(measurementUnits?.to) : (measurementUnits?.to || []);

  const pageScaleEntry = Array.isArray(scale?.[0]) ? scale[0] : [];
  const worldScaleEntry = Array.isArray(scale?.[1]) ? scale[1] : [];
  const pageScale = {
    value: pageScaleEntry[0],
    unit: pageScaleEntry[1] || unitFromOptions[0]
  };
  const worldScale = {
    value: worldScaleEntry[0],
    unit: worldScaleEntry[1] || unitToOptions[0]
  };

  // If our scale has a unit that is not in the current 'from' measurement units, change it
  // to the first unit in the list.
  useEffect(() => {
    if (unitFromOptions.length && !unitFromOptions.includes(pageScale.unit)) {
      onScaleUnitChange(unitFromOptions[0], true);
    }
  }, [pageScale.unit]);

  // If our scale has a unit that is not in the current 'to' measurement units, change it
  // to the first unit in the list. We want to wait until the 'from' unit is valid before
  // setting the 'to' unit. Otherwise, we will reset the 'from' unit.
  useEffect(() => {
    if (unitToOptions.length && unitFromOptions.includes(pageScale.unit) && !unitToOptions.includes(worldScale.unit)) {
      onScaleUnitChange(unitToOptions[0], false);
    }
  }, [pageScale.unit, worldScale.unit]);

  useEffect(() => {
    const formatDecimal = (value) => {
      return value?.toFixed((1 / precision).toString().length - 1);
    };

    const activeElement = getDOMActiveElement();

    if (pageScale.value && pageValueInput?.current !== activeElement) {
      if (!isFractionalPrecision) {
        setPageValueDisplay(formatDecimal(pageScale.value) || '');
      } else {
        setPageValueDisplay(Scale.getFormattedValue(pageScale.value, pageScale.unit, precision, false, true) || '');
      }
    }
    if (worldScale.value && worldValueInput?.current !== activeElement) {
      if (!isFractionalPrecision && worldScale.unit !== Units.FT_IN) {
        setWorldValueDisplay(formatDecimal(worldScale.value) || '');
      } else {
        setWorldValueDisplay(Scale.getFormattedValue(worldScale.value, worldScale.unit, precision, false, true) || '');
      }
    }
  }, [pageScale.value, pageScale.unit, worldScale.value, worldScale.unit, precision, worldValueInput, pageValueInput, isFractionalPrecision, scaleValueBlurFlag]);

  useEffect(() => {
    if (isFractionalPrecision) {
      setPageWarningMessage(hintValues[pageScale.unit]);
      setWorldWarningMessage(hintValues[worldScale.unit]);
    } else if (worldScale.unit === Units.FT_IN) {
      setPageWarningMessage('');
      setWorldWarningMessage(hintValues[HintKeys.FT_IN_DECIMAL]);
    } else {
      setPageWarningMessage('');
      setWorldWarningMessage('');
    }
  }, [pageScale.unit, worldScale.unit, isFractionalPrecision]);

  // Re-validate invalid world value input when world unit changes
  useEffect(() => {
    !isWorldValueValid && onInputValueChange(worldValueInput.current.value, false);
  }, [worldScale.unit]);

  // Re-validate invalid scale value input when isFractionalPrecision value changes
  useEffect(() => {
    if (!isPageValueValid && !isWorldValueValid) {
      let didPageScaleChange = false;
      let updatedPageScale = {
        value: pageScale.value,
        unit: pageScale.unit
      };
      onInputValueChange(pageValueInput.current.value, true, (newScale) => {
        if (updatedPageScale.value !== newScale.pageScale.value || updatedPageScale.unit !== newScale.pageScale.unit) {
          updatedPageScale = newScale.pageScale;
          didPageScaleChange = true;
        }
      });
      let updatedWorldScale = {
        value: worldScale.value,
        unit: worldScale.unit
      };
      onInputValueChange(worldValueInput.current.value, false, (newScale) => {
        updatedWorldScale = newScale.worldScale;
      });

      _onScaleChange(new Scale({ pageScale: updatedPageScale, worldScale: updatedWorldScale }), { didPageScaleChange });
    } else {
      !isPageValueValid && onInputValueChange(pageValueInput.current.value, true);
      !isWorldValueValid && onInputValueChange(worldValueInput.current.value, false);
    }
  }, [isFractionalPrecision]);

  useEffect(() => {
    if (leftContainerRef.current) {
      setLeftDropdownWidth((leftContainerRef.current.clientWidth - 8) / 2);
    }
  }, [leftContainerRef]);

  const isPageValueValid = !!pageScale.value;
  const isWorldValueValid = !!worldScale.value;

  const pageValueClass = classNames('scale-input', {
    'invalid-value': !isPageValueValid
  });
  const worldValueClass = classNames('scale-input', {
    'invalid-value': !isWorldValueValid
  });

  // If scale value is smaller than the current precision, replace it with precision value to prevent 0 value.
  const _onScaleChange = (newScale, { didPageScaleChange } = {}) => {
    const getPrecision = (unit) => (unit === Units.FT_IN ? precision / 12 : precision);

    if (newScale.pageScale.value && newScale.pageScale.value < precision) {
      newScale.pageScale.value = getPrecision(newScale.pageScale.unit);
    }
    if (newScale.worldScale.value && newScale.worldScale.value < precision) {
      newScale.worldScale.value = getPrecision(newScale.worldScale.unit);
    }
    onScaleChange(newScale, { didPageScaleChange });
  };

  const onInputValueChange = (value, isPageValue, getNewScale) => {
    const updateScaleValue = (scaleValue) => {
      if ((isPageValue && scaleValue !== pageScale.value) || (!isPageValue && scaleValue !== worldScale.value)) {
        const pageValue = isPageValue ? scaleValue : pageScale.value;
        const worldValue = isPageValue ? worldScale.value : scaleValue;
        const newScale = new Scale({
          pageScale: { value: pageValue, unit: pageScale.unit },
          worldScale: { value: worldValue, unit: worldScale.unit }
        });
        if (getNewScale) {
          getNewScale(newScale);
        } else {
          _onScaleChange(newScale, { didPageScaleChange: isPageValue });
        }
      }
    };

    if (isPageValue) {
      setPageValueDisplay(value);
    } else {
      setWorldValueDisplay(value);
    }
    const inputValue = value.trim();
    if (!isFractionalPrecision) {
      if (!isPageValue && worldScale.unit === Units.FT_IN) {
        if (ftInDecimalRegex.test(inputValue)) {
          const result = parseFtInDecimal(inputValue);
          if (result > 0) {
            updateScaleValue(result);
            return;
          }
        }
      } else if (floatRegex.test(inputValue)) {
        const scaleValue = parseFloat(inputValue) || 0;
        updateScaleValue(scaleValue);
        return;
      }
    } else {
      const scaleUnit = isPageValue ? pageScale.unit : worldScale.unit;
      if (scaleUnit === Units.IN) {
        if (inFractionalRegex.test(inputValue)) {
          const result = parseInFractional(inputValue);
          if (result > 0) {
            updateScaleValue(result);
            return;
          }
        }
      } else if (scaleUnit === Units.FT_IN) {
        if (ftInFractionalRegex.test(inputValue)) {
          const result = parseFtInFractional(inputValue);
          if (result > 0) {
            updateScaleValue(result);
            return;
          }
        }
      }
    }
    updateScaleValue(undefined);
  };

  const onScaleUnitChange = (newUnit, isPageUnit) => {
    if (!newUnit) {
      return;
    }

    let newPageScale;
    if (isPageUnit && newUnit !== pageScale.unit) {
      newPageScale = {
        value: pageScale.value ? convertUnit(pageScale.value, pageScale.unit, newUnit) : pageScale.value,
        unit: newUnit
      };
    } else {
      newPageScale = { value: pageScale.value, unit: pageScale.unit };
    }
    let newWorldScale;
    if (!isPageUnit && newUnit !== worldScale.unit) {
      newWorldScale = {
        value: worldScale.value ? convertUnit(worldScale.value, worldScale.unit, newUnit) : worldScale.value,
        unit: newUnit
      };
    } else {
      newWorldScale = { value: worldScale.value, unit: worldScale.unit };
    }

    _onScaleChange(new Scale({ pageScale: newPageScale, worldScale: newWorldScale }), { didPageScaleChange: isPageUnit });
  };

  const getInputPlaceholder = (isPageValue) => {
    const unit = isPageValue ? pageScale.unit : worldScale.unit;
    let placeholderKey = '';

    if (isFractionalPrecision) {
      placeholderKey = unit;
    } else if (unit === Units.FT_IN) {
      placeholderKey = HintKeys.FT_IN_DECIMAL;
    }

    return placeholderKey ? hintValues[placeholderKey] : '';
  };

  const onInputBlur = () => {
    setScaleValueBlurFlag((flag) => !flag);
  };

  return (
    <div className="custom-scale-container">
      <div className="scale-ratio-input-container">
        <div className="scale-ratio-display">
          <div className="left-container" ref={leftContainerRef}>
            <div className="unit-label" id="paper-units-dropdown-label">{t('option.measurement.scaleModal.paperUnits')}</div>
            <div className="input-wrapper">
              <div className={classNames({ 'warning-alert': !isPageValueValid })}>
                <input
                  type={isFractionalPrecision ? 'text' : 'number'}
                  min="0"
                  className={pageValueClass}
                  value={pageValueDisplay}
                  aria-label={t('option.measurement.scaleModal.paperUnits')}
                  data-element="customPageScaleValue"
                  onChange={(e) => onInputValueChange(e.target.value, true)}
                  placeholder={getInputPlaceholder(true)}
                  ref={pageValueInput}
                  onBlur={onInputBlur}
                />
                <Icon glyph="icon-alert" className="warning-alert-icon" />
              </div>
              <Tooltip content={'option.measurement.scaleModal.paperUnits'}>
                <div className="unit-input">
                  <Dropdown
                    id="paper-units-dropdown"
                    labelledById='paper-units-dropdown-label'
                    dataElement="customPageScaleUnit"
                    items={unitFromOptions}
                    onClickItem={(value) => onScaleUnitChange(value, true)}
                    currentSelectionKey={pageScale.unit}
                    width={leftDropdownWidth}
                  />
                </div>
              </Tooltip>
            </div>
          </div>
          <div className="scale-ratio-equal">{' = '}</div>
          <div className="right-container">
            <div className="unit-label" id="display-units-dropdown-label">{t('option.measurement.scaleModal.displayUnits')}</div>
            <div className="input-wrapper">
              <div className={classNames({ 'warning-alert': !isWorldValueValid })}>
                <input
                  type={(isFractionalPrecision || worldScale.unit === Units.FT_IN) ? 'text' : 'number'}
                  min='0'
                  className={worldValueClass}
                  value={worldValueDisplay}
                  aria-label={t('option.measurement.scaleModal.displayUnits')}
                  data-element="customDisplayScaleValue"
                  onChange={(e) => onInputValueChange(e.target.value, false)}
                  placeholder={getInputPlaceholder(false)}
                  ref={worldValueInput}
                  onBlur={onInputBlur}
                />
                <Icon glyph="icon-alert" className="warning-alert-icon" />
              </div>
              <Tooltip content={'option.measurement.scaleModal.displayUnits'}>
                <div className="unit-input">
                  <Dropdown
                    id="display-units-dropdown"
                    labelledById='display-units-dropdown-label'
                    items={unitToOptions}
                    dataElement="customDisplayScaleUnit"
                    onClickItem={(value) => onScaleUnitChange(value, false)}
                    currentSelectionKey={worldScale.unit}
                    width={leftDropdownWidth}
                  />
                </div>
              </Tooltip>
            </div>
          </div>

        </div>
      </div>
      <div className="warning-messages" aria-live="assertive" >
        {!isPageValueValid && (
          <p className="no-margin">
            {`${t('option.measurement.scaleModal.incorrectSyntax')} ${pageWarningMessage}`}
          </p>
        )}
        {!isWorldValueValid && (
          <p className="world-value-warning no-margin">
            {`${t('option.measurement.scaleModal.incorrectSyntax')} ${worldWarningMessage}`}
          </p>
        )}
      </div>
    </div>
  );
}

ScaleCustom.propTypes = ScaleCustomProps;

export default ScaleCustom;
