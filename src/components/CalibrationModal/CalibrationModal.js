import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import core from 'core';
import { mapAnnotationToKey } from 'constants/map';
import setToolStyles from 'helpers/setToolStyles';
import parseMeasurementContents from 'helpers/parseMeasurementContents';
import actions from 'actions';
import selectors from 'selectors';

import './CalibrationModal.scss';

const numberRegex = /^\d*(\.\d*)?$/;

const CalibrationModal = () => {
  const [isOpen, isDisabled, units] = useSelector(
    state => [
      selectors.isElementOpen(state, 'calibrationModal'),
      selectors.isElementDisabled(state, 'calibrationModal'),
      selectors.getMeasurementUnits(state),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [value, setValue] = useState('');
  const [unitTo, setUnitTo] = useState('');
  const [t] = useTranslation();

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (
        annotations?.length === 1 &&
        mapAnnotationToKey(annotations[0]) === 'distanceMeasurement' &&
        action === 'selected'
      ) {
        const annot = annotations[0];
        setAnnotation(annot);
        setValue(parseMeasurementContents(annot.getContents()));
        setUnitTo(annot.Scale[1][1]);
      } else if (action === 'deselected') {
        setAnnotation(null);
        setValue('');
        setUnitTo('');
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
        setValue(parseMeasurementContents(annotation.getContents()));
        setUnitTo(annotation.Scale[1][1]);
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    return () =>
      core.removeEventListener('annotationChanged', onAnnotationChanged);
  }, [annotation]);

  const handleInputChange = e => {
    if (numberRegex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const handleSelectChange = e => {
    setUnitTo(e.target.value);
  };

  const handleApply = () => {
    const currentDistance = parseMeasurementContents(annotation.getContents());
    const newDistance = parseFloat(value);
    const ratio = newDistance / currentDistance;

    const currentScale = annotation.Scale;
    const newScale = [
      [currentScale[0][0], currentScale[0][1]],
      [currentScale[1][0] * ratio, unitTo],
    ];

    core.setAnnotationStyles(annotation, {
      Scale: newScale,
    });

    // this will also set the Scale for the other two measurement tools
    setToolStyles('AnnotationCreateDistanceMeasurement', 'Scale', newScale);

    dispatch(actions.closeElements(['calibrationModal']));
  };

  const handleCancel = () => {
    dispatch(actions.closeElements(['calibrationModal']));
  };

  return isDisabled || !annotation ? null : (
    <div
      className={classNames({
        Modal: true,
        CalibrationModal: true,
        open: isOpen,
        closed: !isOpen,
      })}
    >
      <div className="container">
        <div className="calibration__header">{t('component.calibration')}</div>
        <div className="calibration__body">
          <div>{t('message.enterMeasurement')}</div>
          <div>
            <input type="text" value={value} onChange={handleInputChange} />
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
        </div>
        <div className="calibration__footer">
          <Button
            dataElement="passwordSubmitButton"
            label={t('action.apply')}
            onClick={handleApply}
          />
          <Button
            dataElement="passwordCancelButton"
            label={t('action.cancel')}
            onClick={handleCancel}
          />
        </div>
      </div>
    </div>
  );
};

export default CalibrationModal;
