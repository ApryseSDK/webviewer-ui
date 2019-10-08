import React, { useState, useEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, shallowEqual } from 'react-redux';
import { useTranslation } from 'react-i18next';

import Button from 'components/Button';

import core from 'core';
import { mapAnnotationToKey } from 'constants/map';
import actions from 'actions';
import selectors from 'selectors';

import './CalibrationModal.scss';

const commaRegex = /,/g;
const numberRegex = /^\d*(\.\d*)?$/;

const CalibrationModal = () => {
  const [isOpen, isDisabled] = useSelector(
    state => [
      selectors.isElementOpen(state, 'calibrationModal'),
      selectors.isElementDisabled(state, 'calibrationModal'),
    ],
    shallowEqual,
  );
  const dispatch = useDispatch();
  const [annotation, setAnnotation] = useState(null);
  const [value, setValue] = useState('');
  const [t] = useTranslation();

  useEffect(() => {
    const onAnnotationSelected = (annotations, action) => {
      if (
        annotations?.length === 1 &&
        mapAnnotationToKey(annotations[0]) === 'distanceMeasurement' &&
        action === 'selected'
      ) {
        setAnnotation(annotations[0]);
        setValue(parseContent(annotations[0].getContents()));
      } else if (action === 'deselected') {
        setAnnotation(null);
        setValue('');
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
        setValue(parseContent(annotation.getContents()));
      }
    };

    core.addEventListener('annotationChanged', onAnnotationChanged);
    return () =>
      core.removeEventListener('annotationChanged', onAnnotationChanged);
  }, [annotation]);

  const parseContent = content => {
    content = content.replace(commaRegex, '');
    return parseFloat(content);
  };

  const handleChange = e => {
    if (numberRegex.test(e.target.value)) {
      setValue(e.target.value);
    }
  };

  const handleApply = () => {
    // TODO
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
            <input type="text" value={value} onChange={handleChange} />
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
