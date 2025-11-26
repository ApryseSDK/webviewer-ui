import classNames from 'classnames';
import Icon from 'components/Icon';
import DataElementWrapper from 'components/DataElementWrapper';
import PropTypes from 'prop-types';
import React, { useState, useRef, useEffect } from 'react';
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
  onAddingNewScale: PropTypes.func.isRequired,
  ariaLabelledBy: PropTypes.string,
  isScaleModalEnabled: PropTypes.bool,
};

const Scale = window.Core.Scale;

const ScaleSelector = ({ scales = [], selectedScales = [], onScaleSelected, onAddingNewScale, ariaLabelledBy, isScaleModalEnabled }) => {
  const [t] = useTranslation();
  const dispatch = useDispatch();

  const [scalesInfo, setScalesInfo] = useState([]);

  useEffect(() => {
    if (!scales || scales.length === 0) {
      setScalesInfo([]);
      return;
    }

    const scalesInfo = getScalesInfo(scales || []);
    setScalesInfo(scalesInfo);
  }, [scales]);

  const isMultipleScalesMode = useSelector((state) => selectors.getIsMultipleScalesMode(state));
  const isMultipleScales = selectedScales.length > 1;
  const showScaleModal = isScaleModalEnabled && isMultipleScalesMode;

  const getScalesInfo = (scales) => {
    const scalesInfo = [];
    const coreScales = core.getScales();

    if (!scales || scales.length === 0 || !coreScales || Object.keys(coreScales).length === 0) {
      return scalesInfo;
    }

    scales.forEach((scale) => {
      const coreScaleKey = scale.toString();
      const scaleData = coreScales[coreScaleKey];

      if (!scaleData || scaleData.length === 0) {
        console.warn(`No measurements found for scale ${coreScaleKey}`);
        return;
      }

      const measurements = [];
      const relatedPages = new Set();
      let canDelete = true;

      scaleData.forEach((measurementItem) => {
        const isAnnotation = measurementItem instanceof window.Core.Annotations.Annotation;
        if (!isAnnotation) {
          return;
        }

        relatedPages.add(measurementItem['PageNumber']);
        measurements.push(measurementItem);

        // If any associated measurement cannot be deleted then we won't allow this scale to be deleted.
        if (!core.canModify(measurementItem)) {
          canDelete = false;
        }
      });

      const scalesInfoAlreadyHasScale = scalesInfo.some(
        (info) => info.title === coreScaleKey,
      );

      if (scalesInfoAlreadyHasScale) {
        return;
      }

      scalesInfo.push({
        scale,
        title: scale.toString(),
        measurementsNum: measurements.length,
        pages: [...relatedPages],
        canDelete
      });
    });

    return scalesInfo;
  };

  const openScaleDeletionModal = (scaleInfo) => {
    if (!scaleInfo) {
      return;
    }

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
    const title = `${t('option.measurement.deleteScaleModal.deleteScale')} ${scaleInfo.title}`;
    const confirmBtnText = t('action.confirm');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm: () => core.deleteScale(scaleInfo.scale)
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      toggleDropdown();
    }
  };

  return (
    <DataElementWrapper
      className="scale-overlay-selector"
      dataElement="scaleSelector"
      tabIndex={-1}
      ref={selectorRef}
      onKeyDown={handleKeyDown}
      onClick={toggleDropdown}
    >
      {/* Cleanup this <div> to a <select> https://apryse.atlassian.net/browse/WVR-7613 */}
      <div
        data-testid='scale-selector'
        className="scale-overlay-selection"
        aria-expanded={isDropDownOpen}
        aria-labelledby={ariaLabelledBy}
        aria-controls="scale-overlay-dropdown"
        role="combobox"
        tabIndex={0}
      >
        <div className="scale-overlay-item">
          <div className="scale-overlay-name">
            {title}
          </div>
          <div className="scale-overlay-arrow">
            <Icon glyph="icon-chevron-down" ariaHidden={true} />
          </div>
        </div>
      </div>
      {isDropDownOpen && (
        <ul id="scale-overlay-dropdown" className={classNames('scale-overlay-list')} >
          <li>
            <div className="scale-overlay-name">{title}</div>
            <div className="scale-overlay-arrow">
              <button
                className="scale-overlay-selected-arrow"
              >
                <Icon glyph="icon-chevron-up" ariaHidden={true}/>
              </button>
            </div>
          </li>
          {scalesInfo.map((scaleInfo) => (
            <li key={scaleInfo.title} className={classNames({
              'className="scale-overlay-item': true,
              'option-selected': selectedScales.includes(scaleInfo.title)
            })}>
              <button
                className={classNames({
                  options: true,
                })}
                onClick={() => onScaleSelected(selectedScales, scaleInfo.title)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onScaleSelected(selectedScales, scaleInfo.title);
                  }
                }}
              >
                {renderScale(scaleInfo.scale)}
              </button>
              <button
                className="delete"
                tabIndex={0}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  openScaleDeletionModal(scaleInfo);
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    openScaleDeletionModal(scaleInfo);
                  }
                }}
                disabled={scalesInfo.length <= 1 || !scaleInfo.canDelete}
                aria-label={`${t('action.delete')} ${scaleInfo.title}`}
              >
                <Icon glyph="icon-delete-line" />
              </button>
            </li>
          ))}
          {showScaleModal && (
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
