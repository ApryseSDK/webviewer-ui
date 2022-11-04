import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import Selector from 'components/Selector';
import IncrementNumberInput from './IncrementNumberInput';

import { useTranslation } from 'react-i18next';

import './InsertBlankPagePanel.scss';

const InsertBlankPagePanel = ({ getPageCount }) => {
  const presetNewPageDimensions = useSelector((state) => selectors.getPresetNewPageDimensions(state));

  const [t] = useTranslation();

  const presetPageDimensions = Object.keys(presetNewPageDimensions);

  const loadedDocumentPageCount = getPageCount();

  const pagePlacementOptions = {
    'ABOVE': 'above',
    'BELOW': 'below'
  };

  const [selectedPagePlacement, setSelectedPagePlacement] = useState(pagePlacementOptions.BELOW);
  const [selectedPages, setSelectedPages] = useState([]);
  const [amountOfPages, setAmountOfPages] = useState(1);
  const [selectedPageDimensions, setSelectedPageDimensions] = useState(presetPageDimensions[0]);

  const handlePagePlacementChanged = (placement) => {
    setSelectedPagePlacement(placement);
  };

  const handlePageNumbersChanged = (pageNumbers) => {
    setSelectedPages(pageNumbers);
  };

  const handleAmountOfPagesChanged = (amount) => {
    setAmountOfPages(amount);
  };

  const handlePageDimensionsChanged = (dimensions) => {
    setSelectedPageDimensions(dimensions);
  };

  return (
    <div className="insert-blank-page-panel">
      <div className="panel-container">
        <div className="subheader">{t('insertPageModal.pagePlacements.header')}</div>
        <div className="section">
          <Choice
            label={t(`insertPageModal.pagePlacements.${pagePlacementOptions.ABOVE}`)}
            name="PAGE_PLACEMENT"
            onChange={() => handlePagePlacementChanged(pagePlacementOptions.ABOVE)}
            checked={selectedPagePlacement === pagePlacementOptions.ABOVE}
            radio
          />
          <Choice
            label={t(`insertPageModal.pagePlacements.${pagePlacementOptions.BELOW}`)}
            name="PAGE_PLACEMENT"
            onChange={() => handlePagePlacementChanged(pagePlacementOptions.BELOW)}
            checked={selectedPagePlacement === pagePlacementOptions.BELOW}
            radio
          />
        </div>
        <div className="subheader">{t('insertPageModal.pageLocations.header')}</div>
        <div className="section">
          <div className="input-container">
            <p>{t('insertPageModal.pageLocations.specify')}</p>
            <PageNumberInput
              selectedPageNumbers={selectedPages}
              pageCount={loadedDocumentPageCount}
              onBlurHandler={handlePageNumbersChanged}
            />
            <p className="input-sub-text">
              {t('insertPageModal.pageLocations.total')} {amountOfPages >= 0 ? selectedPages.length * amountOfPages : 0}{' '}
              {t('insertPageModal.pageLocations.pages')}
            </p>
          </div>
          <div className="input-container">
            <p>{t('insertPageModal.pageLocations.amount')}</p>
            <IncrementNumberInput
              type="number"
              min="1"
              onChange={handleAmountOfPagesChanged}
              value={amountOfPages}
              fillWidth
            />
          </div>
        </div>
        <div className="subheader">{t('insertPageModal.pageDimensions.header')}</div>
        <div className="section">
          <div className="input-container">
            <p>{t('insertPageModal.pageDimensions.subHeader')}</p>
            <Selector
              selectedItem={selectedPageDimensions}
              onItemSelected={handlePageDimensionsChanged}
              items={presetPageDimensions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default InsertBlankPagePanel;
