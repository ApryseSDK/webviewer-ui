import Choice from 'components/Choice';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import PropTypes from 'prop-types';
import React from 'react';
import { useTranslation } from 'react-i18next';

const PagesToCropOptions = ({
  cropMode,
  onCropModeChange,
  loadedDocumentPageCount,
  selectedPages,
  handlePageNumbersChanged,
  handlePageNumberError,
  pageNumberError,
}) => {
  const { t } = useTranslation();

  return (
    <>
      <Choice
        label={t('cropPopUp.allPages')}
        name="All"
        data-element="allPagesCropRadioButton"
        onChange={() => onCropModeChange('ALL_PAGES')}
        checked={cropMode === 'ALL_PAGES'}
        radio
      />
      <Choice
        label={t('cropPopUp.singlePage')}
        name="SINGLE_PAGE"
        data-element="singlePageCropRadioButton"
        onChange={() => onCropModeChange('SINGLE_PAGE')}
        checked={cropMode === 'SINGLE_PAGE'}
        radio
      />
      <div className='multi-page-crop-wrapper'>
        <Choice
          label={t('cropPopUp.multiPage')}
          name="MULTI_PAGE"
          data-element="multiPageCropRadioButton"
          onChange={() => onCropModeChange('MULTI_PAGE')}
          checked={cropMode === 'MULTI_PAGE'}
          radio
        />
        {cropMode === 'MULTI_PAGE' && (
          <span className='multi-page-crop-example'>
          - {t('option.thumbnailPanel.multiSelectPagesExample')}
          </span>
        )}
      </div>
      {cropMode === 'MULTI_PAGE' && (
        <>
          <div className="document-crop-page-input-container">
            <PageNumberInput
              data-element="multiPageCropPageNumberInput"
              selectedPageNumbers={selectedPages}
              pageCount={loadedDocumentPageCount}
              onSelectedPageNumbersChange={handlePageNumbersChanged}
              onBlurHandler={handlePageNumbersChanged}
              onError={handlePageNumberError}
              pageNumberError={pageNumberError}
            />
          </div>
          <div className="section extra-space-section" />
        </>
      )}
    </>
  );
};

export default PagesToCropOptions;

PagesToCropOptions.propTypes = {
  cropMode: PropTypes.string.isRequired,
  onCropModeChange: PropTypes.func.isRequired,
  loadedDocumentPageCount: PropTypes.number,
  selectedPages: PropTypes.array,
  handlePageNumbersChanged: PropTypes.func.isRequired,
  handlePageNumberError: PropTypes.func.isRequired,
  pageNumberError: PropTypes.string,
};
