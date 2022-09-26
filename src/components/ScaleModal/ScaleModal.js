import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Swipeable } from 'react-swipeable';
import { Choice, FocusTrap } from '@pdftron/webviewer-react-toolkit';
import classNames from 'classnames';
import {
  precisionOptions,
  PrecisionType,
  scalePresetPrecision,
  PresetMeasurementSystems,
  fractionalUnits,
  ifFractionalPrecision,
  initialScale
} from 'constants/measurementScale';
import core from 'core';
import useOnMeasurementToolOrAnnotationSelected from 'hooks/useOnMeasurementToolOrAnnotationSelected';
import actions from 'actions';
import selectors from 'selectors';
import ScaleCustom from './ScaleCustom';
import DataElements from 'constants/dataElement';
import useDidUpdate from 'hooks/useDidUpdate';

import Button from 'components/Button';
import Dropdown from 'components/Dropdown';
import Tooltip from 'components/Tooltip';
import DataElementWrapper from 'components/DataElementWrapper';

import './ScaleModal.scss';

const Scale = window.Core.Scale;

export const scaleOptions = {
  CUSTOM: 'custom',
  PRESET: 'preset'
};

const ScaleModal = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const { annotations, selectedTool } = useOnMeasurementToolOrAnnotationSelected();

  const [
    isDisabled,
    isOpen,
    currentToolbarGroup,
    selectedScale,
    activeToolName,
    isAddingNewScale,
    measurementScalePreset,
    { tempScale, isFractionalUnit },
    isMultipleScalesMode
  ] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.SCALE_MODAL),
    selectors.isElementOpen(state, DataElements.SCALE_MODAL),
    selectors.getCurrentToolbarGroup(state),
    selectors.getSelectedScale(state),
    selectors.getActiveToolName(state),
    selectors.getIsAddingNewScale(state),
    selectors.getMeasurementScalePreset(state),
    selectors.getCalibrationInfo(state),
    selectors.getIsMultipleScalesMode(state)
  ]);

  const [isFractionalPrecision, setIsFractionalPrecision] = useState(false);
  const [precisionOption, setPrecisionOption] = useState(precisionOptions[PrecisionType.DECIMAL][0]);
  const [scaleOption, setScaleOption] = useState(scaleOptions.CUSTOM);
  const [presetScale, setPresetScale] = useState(measurementScalePreset[PresetMeasurementSystems.METRIC][0]);
  const [customScale, setCustomScale] = useState(new Scale(''));
  const [hasScaleChanged, setHasScaleChanged] = useState(false);

  const totalScalesCount = Object.keys(core.getScales()).length;

  useEffect(() => {
    if (!precisionOptions[precisionType].includes(precisionOption)) {
      setPrecisionOption(precisionOptions[precisionType][0]);
    }
    setPresetScale(measurementScalePreset[presetMeasurementSystem][0]);
  }, [isFractionalPrecision]);

  useEffect(() => {
    setScaleOption(scaleOptions.CUSTOM);
    setCustomScale(new Scale(selectedScale.getScaleRatioAsArray()));

    const precision = core.getScalePrecision(selectedScale);
    if (!precision) {
      return;
    }
    const isFractional = ifFractionalPrecision(precision);
    setIsFractionalPrecision(isFractional);

    const precisionItems = precisionOptions[getPrecisionType(isFractional)];
    const precisionItem = precisionItems.find((item) => item[1] === precision);
    setPrecisionOption(precisionItem);

    // Update/Create button should be disabled until the user makes a change
    setTimeout(() => {
      setHasScaleChanged(false);
    });
  }, [selectedScale]);

  useDidUpdate(() => {
    if (scaleOption === scaleOptions.CUSTOM) {
      setCustomScale(presetScale[1]);
    } else {
      const presetPrecisionOption = scalePresetPrecision[presetScale[0]];
      if (presetPrecisionOption && presetPrecisionOption !== precisionOption) {
        setPrecisionOption(presetPrecisionOption);
      }
    }
  }, [scaleOption]);

  useEffect(() => {
    if (currentToolbarGroup === 'toolbarGroup-Measure') {
      closeModal();
    }
  }, [currentToolbarGroup]);

  useEffect(() => {
    const newPrecisionOption = scalePresetPrecision[presetScale[0]];
    if (newPrecisionOption && scaleOption === scaleOptions.PRESET) {
      setPrecisionOption(newPrecisionOption);
    }
  }, [presetScale]);

  useEffect(() => {
    if (isOpen && tempScale) {
      // Triggered when calibration is applied
      dispatch(actions.updateCalibrationInfo({ isCalibration: false }));
      setIsFractionalPrecision(isFractionalUnit);
    }
  }, [isOpen]);

  useEffect(() => {
    setHasScaleChanged(true);
  }, [precisionOption, customScale, presetScale, scaleOption]);

  useEffect(() => {
    // Reset component state when adding new scale
    if (isOpen && isAddingNewScale && !tempScale) {
      setScaleOption(scaleOptions.CUSTOM);
      setCustomScale(initialScale);
      setIsFractionalPrecision(false);
      setPrecisionOption(precisionOptions[PrecisionType.DECIMAL][0]);
    }
  }, [isOpen, isAddingNewScale]);

  const closeModal = () => {
    dispatch(actions.closeElement(DataElements.SCALE_MODAL));
  };

  const createAndApplyScale = (scale, applyTo) => {
    core.createAndApplyScale(scale, applyTo);
    closeModal();
  };

  const replaceScales = (originalScales, scale) => {
    core.replaceScales(originalScales, scale);
    closeModal();
  };

  const toggleFractionalPrecision = () => {
    setIsFractionalPrecision((isFractionalPrecision) => !isFractionalPrecision);
  };

  const openCalibrationTool = () => {
    core.setToolMode('AnnotationCreateCalibrationMeasurement');
    const unit = isCustomOption ? (customScale.worldScale?.unit || '') : presetScale[1].worldScale.unit;
    dispatch(actions.updateCalibrationInfo({ isCalibration: true, previousToolName: activeToolName, defaultUnit: unit }));
    closeModal();
  };

  const getCurrentScale = () => {
    const getPrecisionsValue = (value, unit) => {
      let temp = value;
      let precisionValue = precisionOption[1];

      if (!isFractionalPrecision) {
        if (unit !== 'ft-in') {
          temp = temp.toFixed((1 / precisionValue).toString().length - 1);
        }
      } else {
        if (unit === 'ft-in') {
          precisionValue /= 12;
        }
        temp = Math.round(temp / precisionValue) * precisionValue;
      }

      return temp * 1;
    };

    if (isCustomOption) {
      const scale = customScale.getScaleRatioAsArray();
      scale[0][0] = getPrecisionsValue(scale[0][0], scale[0][1]);
      scale[1][0] = getPrecisionsValue(scale[1][0], scale[1][1]);
      return scale;
    }
    return presetScale[1].toString();
  };

  const onUpdate = () => {
    replaceScales(
      [selectedScale],
      new Scale(getCurrentScale(), precisionOption[1])
    );
  };

  const onCreate = () => {
    createAndApplyScale(
      new Scale(getCurrentScale(), precisionOption[1]),
      [...annotations, selectedTool]
    );
  };

  const modalClass = classNames('Modal', 'ScaleModal', {
    open: isOpen,
    closed: !isOpen
  });
  const isCustomOption = scaleOption === scaleOptions.CUSTOM;
  const presetMeasurementSystem = isFractionalPrecision ? PresetMeasurementSystems.IMPERIAL : PresetMeasurementSystems.METRIC;
  const getPrecisionType = (isFractional) => (isFractional ? PrecisionType.FRACTIONAL : PrecisionType.DECIMAL);
  const precisionType = getPrecisionType(isFractionalPrecision);
  const isCurrentScaleValid = !isCustomOption || customScale.isValid();
  const isFractionalUnitsToggleDisabled = isCustomOption && !(fractionalUnits.includes(customScale.pageScale?.unit) && fractionalUnits.includes(customScale.worldScale?.unit));

  return !isDisabled && (
    <Swipeable onSwipedUp={closeModal} onSwipedDown={closeModal} preventDefaultTouchmoveEvent>
      <FocusTrap locked={isOpen}>
        <div className={modalClass} data-element={DataElements.SCALE_MODAL}>
          <div className="container">
            <div className="header-container">
              <div className="header">
                <p>{t('option.measurementOption.scale')}</p>
                <Button
                  className="scaleModalCloseButton"
                  title="action.close"
                  img="ic_close_black_24px"
                  onClick={closeModal}
                />
              </div>
            </div>
            <div className="content-container">
              <div className="scaleSetting">
                <div className="custom-option-wrapper">
                  <div className="custom-scale-option">
                    <Choice
                      data-element="customScaleOption"
                      radio
                      name="setting"
                      onChange={() => setScaleOption(scaleOptions.CUSTOM)}
                      checked={isCustomOption}
                      label={`${t('option.measurement.scaleModal.custom')}:`}
                      center
                    />
                  </div>
                  {isCustomOption && (
                    <button data-element="calibrate" className="calibrate-btn" onMouseDown={openCalibrationTool}>
                      {t('option.measurement.scaleModal.calibrate')}
                    </button>
                  )}
                </div>
                {isCustomOption ? (
                  <ScaleCustom
                    scale={customScale.getScaleRatioAsArray()}
                    onScaleChange={setCustomScale}
                    precision={precisionOption[1]}
                  />
                ) : (
                  <div className="block" />
                )}
                <Choice
                  data-element="presetScaleOption"
                  radio
                  onChange={() => setScaleOption(scaleOptions.PRESET)}
                  name="setting"
                  checked={!isCustomOption}
                  label={`${t('option.measurement.scaleModal.preset')}:`}
                  center
                />
                {!isCustomOption && (
                  <div className="scaleModal__preset-container">
                    <div className="selector">
                      <Dropdown
                        dataElement="presetScales"
                        items={measurementScalePreset[presetMeasurementSystem].map((item) => item[0])}
                        currentSelectionKey={presetScale[0]}
                        onClickItem={(_item, i) => setPresetScale(measurementScalePreset[presetMeasurementSystem][i])}
                      />
                    </div>
                  </div>
                )}
              </div>
              <div className="precision-container">
                <div className="precision-selector">
                  <div className="precision-title">{t('option.shared.precision')}:</div>
                  <div className="selector">
                    <Dropdown
                      dataElement="scalePrecisions"
                      items={precisionOptions[precisionType].map((item) => item[0])}
                      currentSelectionKey={precisionOption[0]}
                      onClickItem={(_item, i) => setPrecisionOption(precisionOptions[precisionType][i])}
                    />
                  </div>
                </div>
                <Tooltip content={t('option.measurement.scaleModal.fractionUnitsTooltip')}>
                  <div>
                    <Choice
                      isSwitch
                      leftLabel
                      id="scale-modal-fractional-units"
                      label={t('option.measurement.scaleModal.fractionalUnits')}
                      checked={isFractionalPrecision}
                      onChange={toggleFractionalPrecision}
                      disabled={isFractionalUnitsToggleDisabled}
                    />
                  </div>
                </Tooltip>
              </div>
            </div>
            <div className="footer">
              <DataElementWrapper
                type={'button'}
                onClick={onUpdate}
                className="scale-update"
                dataElement="updateScale"
                disabled={isAddingNewScale || !isCurrentScaleValid || !hasScaleChanged}
              >
                {t('action.update')}
              </DataElementWrapper>
              <button
                onClick={onCreate}
                className="scale-create"
                data-element="createScale"
                disabled={!isCurrentScaleValid || (!isMultipleScalesMode && totalScalesCount) || (!isAddingNewScale && !hasScaleChanged)}
              >
                {t('action.create')}
              </button>
            </div>
          </div>
        </div>
      </FocusTrap>
    </Swipeable>
  );
};

export default ScaleModal;
