import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import Selector from 'components/Selector';
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
  const [pageNumberError, setPageNumberError] = useState('');

  useEffect(() => {
    setInsertPageWidth(presetNewPageDimensions[selectedPageDimensions].width * PT_TO_INCHES);
    setInsertPageHeight(presetNewPageDimensions[selectedPageDimensions].height * PT_TO_INCHES);
  }, []);

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${loadedDocumentPageCount}`);
    }
  };

  const insertNewPagePlacementAbove = () => {
    setInsertNewPageBelow(false);
  };

  const insertNewPagePlacementBelow = () => {
    setInsertNewPageBelow(true);
  };

  const handlePageNumbersChanged = (pageNumbers) => {
    setPageNumberError(null);
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
        <div className="section">
          <div className="input-container">
            <p>{t('insertPageModal.pageLocations.specify')}</p>
            <PageNumberInput
              selectedPageNumbers={insertNewPageIndexes}
              pageCount={loadedDocumentPageCount}
              onBlurHandler={handlePageNumbersChanged}
              onError={handlePageNumberError}
            />
            <p className="input-sub-text">
              {t('insertPageModal.pageLocations.total')} {loadedDocumentPageCount}{' '}
              {t('insertPageModal.pageLocations.pages')}
            </p>
            {pageNumberError && <div className="page-number-error">{pageNumberError}</div>}
          </div>
          <div className="input-container">
            <p>{t('insertPageModal.pageLocations.amount')}</p>
            <IncrementNumberInput
              type="number"
              min="1"
              onChange={handleAmountOfPagesChanged}
              value={numberOfBlankPagesToInsert}
              fillWidth
            />
          </div>
        </div>
        <div className="subheader">{t('insertPageModal.pageDimensions.header')}</div>
        <div className="section">
          <div className="input-container">
            <p>{t('insertPageModal.pageDimensions.subHeader')}</p>
            <Selector
              className='presetSelector'
              selectedItem={selectedPageDimensions}
              onItemSelected={handlePageDimensionsChanged}
              items={[...presetPageDimensions, CUSTOM_PAGE_DIMENSIONS]}
            />
          </div>
          <div className="input-container" style={{ visibility: openCustomDimensions ? 'visible' : 'hidden' }}>
            <p>{t('insertPageModal.pageDimensions.units')}</p>
            <Selector
              className='unitSelector'
              selectedItem={units}
              onItemSelected={handleUnitsChanged}
              items={Object.keys(supportedUnits)}
            />
          </div>
        </div>
        <div className="section" style={{ display: openCustomDimensions ? 'flex' : 'none' }}>
          <div className="input-container">
            <p>{t('formField.formFieldPopup.width')}</p>
            <DimensionInput className='customWidthInput' initialValue={customWidth} onChange={handleBlankPageWidthChange} unit={supportedUnits[units]} />
          </div>
          <div className="input-container">
            <p>{t('formField.formFieldPopup.height')}</p>
            <DimensionInput className='customHeightInput' initialValue={customHeight} onChange={handleBlankPageHeightChange} unit={supportedUnits[units]} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertBlankPagePanel;
