import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import selectors from 'selectors';
import Choice from 'components/Choice';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import Dropdown from 'components/Dropdown';
import IncrementNumberInput from './IncrementNumberInput';
import DimensionInput from 'components/DimensionInput';
import { useTranslation } from 'react-i18next';

import './InsertBlankPagePanel.scss';

const InsertBlankPagePanel = ({
  insertNewPageBelow,
  insertNewPageIndexes,
  numberOfBlankPagesToInsert,
  setInsertNewPageBelow,
  setInsertNewPageIndexes,
  setNumberOfBlankPagesToInsert,
  setInsertPageHeight,
  setInsertPageWidth,
  loadedDocumentPageCount,
}) => {
  const [presetNewPageDimensions] = useSelector((state) => [
    selectors.getPresetNewPageDimensions(state),
  ]);

  const [t] = useTranslation();

  const presetPageDimensions = Object.keys(presetNewPageDimensions);

  const CUSTOM_PAGE_DIMENSIONS = 'Custom';

  const pagePlacementOptions = {
    'ABOVE': 'above',
    'BELOW': 'below',
  };

  const supportedUnits = {
    'Inches (in)': '"',
    'Centimeters (cm)': 'cm',
    'Millimeters (mm)': 'mm',
  };

  const PT_TO_INCHES = 72;

  const unitConversions = {
    '"': 1,
    'cm': 2.54,
    'mm': 25.4,
    'pt': PT_TO_INCHES,
  };

  const [selectedPageDimensions, setSelectedPageDimensions] = useState(presetPageDimensions[0]);
  const [openCustomDimensions, setOpenCustomDimensions] = useState(false);
  const [units, setUnits] = useState(Object.getOwnPropertyNames(supportedUnits)[0]);
  const [customWidth, setCustomWidth] = useState(presetNewPageDimensions[presetPageDimensions[0]].width);
  const [customHeight, setCustomHeight] = useState(presetNewPageDimensions[presetPageDimensions[0]].height);

  useEffect(() => {
    setInsertPageWidth(presetNewPageDimensions[selectedPageDimensions].width * PT_TO_INCHES);
    setInsertPageHeight(presetNewPageDimensions[selectedPageDimensions].height * PT_TO_INCHES);
  }, []);

  const insertNewPagePlacementAbove = () => {
    setInsertNewPageBelow(false);
  };

  const insertNewPagePlacementBelow = () => {
    setInsertNewPageBelow(true);
  };

  const handlePageNumbersChanged = (pageNumbers) => {
    setInsertNewPageIndexes(pageNumbers);
  };

  const handleAmountOfPagesChanged = (amount) => {
    setNumberOfBlankPagesToInsert(amount);
  };

  const handleUnitsChanged = (units) => {
    setUnits(units);
    setInsertPageWidth(customWidth * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
    setInsertPageHeight(customHeight * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
  };

  const handlePageDimensionsChanged = (dimensions) => {
    if (dimensions === CUSTOM_PAGE_DIMENSIONS) {
      setOpenCustomDimensions(true);
      setInsertPageWidth(customWidth * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
      setInsertPageHeight(customHeight * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
    } else {
      setInsertPageWidth(presetNewPageDimensions[dimensions].width * PT_TO_INCHES);
      setInsertPageHeight(presetNewPageDimensions[dimensions].height * PT_TO_INCHES);
      setOpenCustomDimensions(false);
    }
    setSelectedPageDimensions(dimensions);
  };

  const handleBlankPageWidthChange = (width) => {
    setCustomWidth(width);
    setInsertPageWidth(width * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
  };

  const handleBlankPageHeightChange = (height) => {
    setCustomHeight(height);
    setInsertPageHeight(height * (PT_TO_INCHES / unitConversions[supportedUnits[units]]));
  };

  return (
    <div className="insert-blank-page-panel">
      <div className="panel-container">
        <div className="subheader">{t('insertPageModal.pagePlacements.header')}</div>
        <div className="section">
          <Choice
            label={t(`insertPageModal.pagePlacements.${pagePlacementOptions.ABOVE}`)}
            name="PAGE_PLACEMENT"
            onChange={insertNewPagePlacementAbove}
            checked={!insertNewPageBelow}
            radio
          />
          <Choice
            label={t(`insertPageModal.pagePlacements.${pagePlacementOptions.BELOW}`)}
            name="PAGE_PLACEMENT"
            onChange={insertNewPagePlacementBelow}
            checked={insertNewPageBelow}
            radio
          />
        </div>
        <div className="subheader">{t('insertPageModal.pageLocations.header')}</div>
        <div className="section extra-space-section">
          <div className="input-container">
            <label className='specify-pages-wrapper' htmlFor='specifyPagesInput'>{t('insertPageModal.pageLocations.specify')}
              <span className="input-sub-text">
                {t('insertPageModal.pageLocations.total')}: {loadedDocumentPageCount}{' '}
                {t('insertPageModal.pageLocations.pages')}
              </span>
            </label>
            <PageNumberInput
              id="specifyPagesInput"
              selectedPageNumbers={insertNewPageIndexes}
              pageCount={loadedDocumentPageCount}
              onSelectedPageNumbersChange={handlePageNumbersChanged}
              onBlurHandler={handlePageNumbersChanged}
            />
          </div>
          <div className="input-container">
            <label htmlFor='numberOfPagesInput'>{t('insertPageModal.pageLocations.amount')}</label>
            <IncrementNumberInput
              id="numberOfPagesInput"
              type="number"
              min="1"
              onChange={handleAmountOfPagesChanged}
              value={numberOfBlankPagesToInsert}
              fillWidth
            />
          </div>
        </div>
        <div className="subheader">{t('insertPageModal.pageDimensions.header')}</div>
        <div className="section page-dimensions-section">
          <div className="input-container">
            <label id="insert-blank-pages-preset-label" htmlFor="pagesPreset">{t('insertPageModal.pageDimensions.subHeader')}</label>
            <Dropdown
              id="pagesPreset"
              labelledById="insert-blank-pages-preset-label"
              dataElement="presetSelector"
              currentSelectionKey={selectedPageDimensions}
              onClickItem={handlePageDimensionsChanged}
              items={[...presetPageDimensions, CUSTOM_PAGE_DIMENSIONS]}
            />
          </div>
          <div className="input-container" style={{ visibility: openCustomDimensions ? 'visible' : 'hidden' }}>
            <label id="insert-blank-pages-dimensions-label" htmlFor='pageDimensionsUnit'>{t('insertPageModal.pageDimensions.units')}</label>
            <Dropdown
              id="pageDimensionsUnit"
              labelledById="insert-blank-pages-dimensions-label"
              dataElement="unitSelector"
              currentSelectionKey={units}
              onClickItem={handleUnitsChanged}
              items={Object.keys(supportedUnits)}
            />
          </div>
        </div>
        <div className="section" style={{ display: openCustomDimensions ? 'flex' : 'none' }}>
          <div className="input-container">
            <label htmlFor='pageWidthInput'>{t('formField.formFieldPopup.width')}</label>
            <DimensionInput id='pageWidthInput'
              className='customWidthInput'
              initialValue={customWidth}
              onChange={handleBlankPageWidthChange}
              unit={supportedUnits[units]}
            />
          </div>
          <div className="input-container">
            <label htmlFor='pageHeightInput'>{t('formField.formFieldPopup.height')}</label>
            <DimensionInput id='pageHeightInput'
              className='customHeightInput'
              initialValue={customHeight}
              onChange={handleBlankPageHeightChange}
              unit={supportedUnits[units]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

InsertBlankPagePanel.propTypes = {
  insertNewPageBelow: PropTypes.bool,
  insertNewPageIndexes: PropTypes.array,
  numberOfBlankPagesToInsert: PropTypes.number,
  setInsertNewPageBelow: PropTypes.func,
  setInsertNewPageIndexes: PropTypes.func,
  setNumberOfBlankPagesToInsert: PropTypes.func,
  setInsertPageHeight: PropTypes.func,
  setInsertPageWidth: PropTypes.func,
  loadedDocumentPageCount: PropTypes.number,
};

export default InsertBlankPagePanel;
