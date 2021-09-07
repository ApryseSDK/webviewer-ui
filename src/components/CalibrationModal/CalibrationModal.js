import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';
import Button from 'components/Button';
import core from 'core';
import { mapAnnotationToKey } from 'constants/map';
import setToolStyles from 'helpers/setToolStyles';
import parseMeasurementContents from 'helpers/parseMeasurementContents';
import evalFraction from 'helpers/evalFraction';
import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';

import './CalibrationModal.scss';

const parseMeasurementContentByUnit = (content, unit) => {
  if (content.includes('\'')|| content.includes('"')) {
    const ftNum = parseFloat(content.slice(0, content.indexOf('\'')));
    const inNum = parseFloat(content.slice(content.indexOf('\'') + 1, content.indexOf(('"'))));
    if (unit === 'ft') {
      return ftNum + inNum / 12;
    } else {
      return ftNum * 12 + inNum;
    }
  } else {
    return parseMeasurementContents(content);
  }
};

const numberRegex = /^\d*(\.\d*)?$/;
const fractionRegex = /^\d*(\s\d\/\d*)$/;
const pureFractionRegex = /^(\d\/\d*)*$/;

const CalibrationModal = () => {
  const [isOpen, isDisabled, units] = useSelector(
    state => [
      selectors.isElementOpen(state, 'calibrationModal'),
      selectors.isElementDisabled(state, 'calibrationModal'),
      selectors.getMeasurementUnits(state),
    ],
    shallowEqual
  );
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [value, setValue] = useState('');
  const [newDistance, setNewDistance] = useState(0);
  const [unitTo, setUnitTo] = useState('');
  const [showError, setShowError] = useState(false);
  const [t] = useTranslation();
  const inputRef = useRef(null);

  useEffect(() => {
    isOpen && inputRef?.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (
        annotations?.length === 1 &&
        mapAnnotationToKey(annotations[0]) === 'distanceMeasurement' &&
        action === 'selected'
      ) {
        const annot = annotations[0];
        setAnnotation(annot);
        const value = parseMeasurementContentByUnit(annot.getContents(), annot.Scale[1][1]);
        setValue(value);
        setUnitTo(annot.Scale[1][1]);
        // initial new distance should be the same as the value
        // in case the user doesn't change the input value
        setNewDistance(parseFloat(value));
      } else if (action === 'deselected') {
        setAnnotation(null);
        setValue('');
        setUnitTo('');
        setNewDistance(0);
      }
    };

    core.addEventListener('annotationSelected', onAnnotationSelected);
    return () =>
      core.removeEventListener('annotationSelected', onAnnotationSelected);
  }, []);

  useEffect(() => {
    const onAnnotationChanged = (annotations, action) => {
      if (
        action === 'modify' &&
        annotations.length === 1 &&
        annotations[0] === annotation
      ) {
        setValue(parseMeasurementContentByUnit(annotation.getContents(), annotation.Scale[1][1]));
        setUnitTo(annotation.Scale[1][1]);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    return () =>
      core.removeEventListener('annotationChanged', onAnnotationChanged);
  }, [annotation]);

  const handleInputChange = e => {
    setShowError(false);
    setValue(e.target.value);
  };

  const validateInput = e => {
    const inputValue = e.target.value.trim();
    if (inputValue === '') {
      setShowError(true);
    }
    if (numberRegex.test(inputValue)) {
      const newDistance = parseFloat(inputValue);
      if (newDistance !== 0) {
        setNewDistance(parseFloat(inputValue));
        setValue(inputValue);
      } else {
        setShowError(true);
      }
    } else if (fractionRegex.test(inputValue)) {
      const [whole, fraction] = inputValue.split(' ');
      if (Number.isFinite(evalFraction(fraction))) {
        const number = Number(whole) + evalFraction(fraction);
        setNewDistance(parseFloat(number));
        setValue(number);
      } else {
        setShowError(true);
      }
    } else if (pureFractionRegex.test(inputValue)) {
      if (Number.isFinite(evalFraction(inputValue))) {
        const number = evalFraction(inputValue);
        setNewDistance(parseFloat(number));
        setValue(number);
      } else {
        setShowError(true);
      }
    } else {
      setShowError(true);
    }
  };

  const handleSelectChange = e => {
    setUnitTo(e.target.value);
  };

  const handleApply = () => {
    const newScale = getNewScale();
    const accurateNewScale = handleLossOfPrecision(newScale);

    core.setAnnotationStyles(annotation, {
      Scale: accurateNewScale,
    });

    // this will also set the Scale for the other two measurement tools
    setToolStyles(
      'AnnotationCreateDistanceMeasurement',
      'Scale',
      accurateNewScale
    );

    dispatch(actions.closeElements(['calibrationModal']));
  };

  const handleLossOfPrecision = scale => {
    // when the new distance that's entered in the modal is much bigger than the current distance, loss of precision can happen
    // because internally WebViewer will do several multiplications and divisions to get the value to store in a measure dictionary
    // in this case, setting 'Scale' again should fix this issue because this time the new distance and the current distance is very close, and we should get the accurate scale
    annotation.Scale = scale;

    return getNewScale();
  };

  const getNewScale = () => {
    const currentDistance = parseMeasurementContentByUnit(annotation.getContents(), annotation.Scale[1][1]);
    const ratio = newDistance / currentDistance;

    const currentScale = annotation.Scale;
    const newScale = [
      [currentScale[0][0], currentScale[0][1]],
      [currentScale[1][0] * ratio, unitTo],
    ];

    return newScale;
  };

  const closeModal = () => {
    dispatch(actions.closeElements(['calibrationModal']));
  };

  return isDisabled || !annotation ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={classNames({
          Modal: true,
          CalibrationModal: true,
          open: isOpen,
          closed: !isOpen,
        })}
        onMouseDown={closeModal}
      >
        <div className="container" onMouseDown={e => e.stopPropagation()}>
          <div className="swipe-indicator" />
          <div className="calibration__header">
            {t('component.calibration')}
          </div>
          <div className="calibration__body">
            <div>{t('message.enterMeasurement')}</div>
            <div className="calibration__input">
              <input
                className={showError ? 'error' : ''}
                ref={inputRef}
                type="text"
                value={value}
                onChange={handleInputChange}
                onBlur={validateInput}
              />
              <select
                className="unitToInput"
                value={unitTo}
                onChange={handleSelectChange}
              >
                {units.to.map(unit => (
                  <option key={unit} value={unit}>
                    {unit}
                  </option>
                ))}
              </select>
            </div>
            {showError ? <div className="errorMeasurement">{t('message.errorEnterMeasurement')}</div> : null}
          </div>
          <div className="calibration__footer">
            <Button
              dataElement="passwordSubmitButton"
              label={t('action.apply')}
              onClick={handleApply}
              disabled={showError}
            />
          </div>
        </div>
      </div>
    </Swipeable>
  );
};

export default CalibrationModal;
