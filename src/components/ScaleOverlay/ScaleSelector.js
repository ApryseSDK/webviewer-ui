import classNames from 'classnames';
import Icon from 'components/Icon';
import PropTypes from 'prop-types';
import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import actions from 'actions';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import core from 'core';
import useOnClickOutside from 'hooks/useOnClickOutside';

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
      if (measurementItem instanceof window.Annotations.Annotation) {
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
      <div>
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
      <div>
        <p>
          <span>
            {t('option.measurement.deleteScaleModal.deletionIs')}
            <b>{` ${t('option.measurement.deleteScaleModal.irreversible')}. `}</b>
            {t('option.measurement.deleteScaleModal.confirmDelete')}
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

    return <div><span>{scaleDisplay}</span></div>;
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
    <div
      className="scale-overlay-selector"
      data-element="scaleSelector"
      tabIndex={0}
      onClick={toggleDropdown}
      ref={selectorRef}
    >
      <button className="scale-overlay-selection" data-element="scaleSelectorTitle">
        {title}
        <Icon className="scale-overlay-arrow" glyph="icon-chevron-down" />
      </button>
      {isDropDownOpen && (
        <ul className={classNames('scale-overlay-list')} >
          <li>
            <div>{title}</div>
            <Icon className="scale-overlay-arrow" glyph="icon-chevron-up" />
          </li>
          {scales.map((value) => (
            <li key={value.toString()}>
              <button
                className="delete"
                onMouseDown={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openScaleDeletionModal(value.toString());
                }}
                disabled={scales.length <= 1}
              >
                <Icon glyph="icon-delete-line" />
              </button>
              <button
                className={classNames({
                  options: true,
                  'option-selected': selectedScales.includes(value.toString()),
                })}
                onMouseDown={() => onScaleSelected(selectedScales, value.toString())}
              >
                {renderScale(value)}
              </button>
            </li>
          ))}
          {isMultipleScalesMode && (
            <li>
              <button onMouseDown={onAddingNewScale} className="add-new-scale">
                {t('option.measurement.scaleOverlay.addNewScale')}
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
};

ScaleSelector.propTypes = propTypes;

export default ScaleSelector;
