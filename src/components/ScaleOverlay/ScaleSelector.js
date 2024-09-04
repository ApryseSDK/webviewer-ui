import classNames from 'classnames';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import useOnClickOutside from 'hooks/useOnClickOutside';
import Button from 'components/Button';

const propTypes = {
  scales: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedScales: PropTypes.arrayOf(PropTypes.string).isRequired,
  onScaleSelected: PropTypes.func.isRequired,
  onAddingNewScale: PropTypes.func.isRequired
};

const Scale = window.Core.Scale;

const ScaleSelector = ({ scales = [], selectedScales = [], onScaleSelected, onAddingNewScale }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const isMultipleScalesMode = useSelector((state) => selectors.getIsMultipleScalesMode(state));

  const isMultipleScales = selectedScales.length > 1;

  const getScaleInfo = (deleteScale) => {
    const scales = core.getScales();
    const measurements = [];
    const relatedPages = new Set();
    scales[deleteScale.toString()].forEach((measurementItem) => {
      if (measurementItem instanceof window.Core.Annotations.Annotation) {
        relatedPages.add(measurementItem['PageNumber']);
        measurements.push(measurementItem);
      }
    });
    return {
      measurementsNum: measurements.length,
      pages: [...relatedPages]
    };
  };

  const openScaleDeletionModal = (scale) => {
    if (!scale) {
      return;
    }
    const deleteScale = new Scale(scale);
    const scaleInfo = getScaleInfo(deleteScale);
    const hasAssociatedMeasurements = !!scaleInfo.pages.length;
    const message = hasAssociatedMeasurements ? (
      <div className='customMessage'>
        <p>
          <span>
            {t('option.measurement.deleteScaleModal.scaleIsOn-delete-info')}
            <b>{` ${t('option.measurement.deleteScaleModal.page-delete-info')} ${scaleInfo.pages.join(', ')} `}</b>
            {t('option.measurement.deleteScaleModal.appliedTo-delete-info')}
            <b>{` ${scaleInfo.measurementsNum} ${scaleInfo.measurementsNum > 1 ? t('option.measurement.deleteScaleModal.measurements') : t('option.measurement.deleteScaleModal.measurement')}.`}</b>
          </span>
          <span> </span>
          <span>
            {t('option.measurement.deleteScaleModal.deletionIs')}
            <b>{` ${t('option.measurement.deleteScaleModal.irreversible')} `}</b>
            {t('option.measurement.deleteScaleModal.willDeleteMeasurement')}
          </span>
        </p>
        <p>
          {t('option.measurement.deleteScaleModal.confirmDelete')}
        </p>
      </div>
    ) : (
      <div className='customMessage'>
        <p>
          <span>
            {t('option.measurement.deleteScaleModal.confirmDelete')}
            {t('option.measurement.deleteScaleModal.thisCantBeUndone')}
          </span>
        </p>
      </div>
    );
    const title = `${t('option.measurement.deleteScaleModal.deleteScale')} ${deleteScale.toString()}`;
    const confirmBtnText = t('action.confirm');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => core.deleteScale(deleteScale)
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const renderScale = (scale) => {
    const precision = core.getScalePrecision(scale);
    const pageScaleStr = Scale.getFormattedValue(scale.pageScale.value, scale.pageScale.unit, precision, false);
    const worldScaleStr = Scale.getFormattedValue(scale.worldScale.value, scale.worldScale.unit, precision, false);
    const scaleDisplay = `${pageScaleStr} = ${worldScaleStr}`;

    return <div>{scaleDisplay}</div>;
  };

  let title = t('option.measurement.scaleOverlay.multipleScales');

  if (selectedScales.length && !isMultipleScales) {
    const selectedScale = new Scale(selectedScales[0]);
    title = renderScale(selectedScale);
  }

  // TODO: This is a bandaid solution to fix a Safari bug. This dropdown should be refactored to use a react-select component
  // instead of hiding and displaying based on focus pseudoclasses,
  // otherwise it is hard to debug as the open/close logic is in a CSS stylesheet and not super evident
  const [isDropDownOpen, setOpenDropDown] = useState(false);
  const toggleDropdown = () => {
    setOpenDropDown((prevValue) => !prevValue);
  };

  const selectorRef = useRef(null);

  useOnClickOutside(selectorRef, () => {
    setOpenDropDown(false);
  });

  return (
    <DataElementWrapper
      className="scale-overlay-selector"
      aria-label={t('option.measurementOption.scale')}
      dataElement="scaleSelector"
      tabIndex={-1}
      onClick={toggleDropdown}
      ref={selectorRef}
    >
      <button className="scale-overlay-selection">
        <div className="scale-overlay-item">
          <div className="scale-overlay-name">
            {title}
          </div>
          <div className="scale-overlay-arrow">
            <Icon glyph="icon-chevron-down" />
          </div>
        </div>
      </button>
      {isDropDownOpen && (
        <ul className={classNames('scale-overlay-list')} >
          <li>
            <div className="scale-overlay-name">{title}</div>
            <div className="scale-overlay-arrow">
              <button className="scale-overlay-selected-arrow" autoFocus>
                < Icon glyph="icon-chevron-up" />
              </button>
            </div>
          </li>
          {scales.map((value) => (
            <li key={value.toString()} className={classNames({
              'className="scale-overlay-item': true,
              'option-selected': selectedScales.includes(value.toString())
            })}>
              <button
                className={classNames({
                  options: true,
                })}
                onClick={() => onScaleSelected(selectedScales, value.toString())}
              >
                {renderScale(value)}
              </button>
              <button
                className="delete"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openScaleDeletionModal(value.toString());
                }}
                disabled={scales.length <= 1}
              >
                <Icon glyph="icon-delete-line" />
              </button>
            </li>
          ))}
          {isMultipleScalesMode && (
            <li>
              <Button onClick={onAddingNewScale} label={t('option.measurement.scaleOverlay.addNewScale')} className="add-new-scale" />
            </li>
          )}
        </ul>
      )}
    </DataElementWrapper>
  );
};

ScaleSelector.propTypes = propTypes;

export default ScaleSelector;
