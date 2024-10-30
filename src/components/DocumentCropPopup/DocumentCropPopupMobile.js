import React from 'react';
import DataElements from 'constants/dataElement';
import './DocumentCropPopup.scss';
import DimensionsInput from './DimensionsInput';
import Button from 'components/Button';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import PagesToCropOptions from './PagesToCropOptions';
import CollapsibleSection from '../CollapsibleSection';
import classNames from 'classnames';

const DocumentCropPopupMobile = ({
  className,
  cropMode,
  onCropModeChange,
  loadedDocumentPageCount,
  selectedPages,
  handlePageNumbersChanged,
  handlePageNumberError,
  pageNumberError,
  handleApply,
  handleCancel,
  isCropping,
  yOffset,
  height,
  xOffset,
  width,
  unit,
  autoTrim,
  supportedUnits,
  onDimensionChange,
  onUnitChange,
  autoTrimActive,
  setAutoTrimActive,
  onAutoTrimChange,
  autoTrimDimensions,
  isCropDimensionsContainerActive,
  cropAnnotation,
  toggleCropDimensions,
}) => {
  const { t } = useTranslation();

  return (
    <div className={className} data-element={DataElements.DOCUMENT_CROP_POPUP}>
      <div className="document-crop-mobile-section">
        <div className="document-crop-mobile-container">
          <CollapsibleSection
            header={t('cropPopUp.title')}
            isInitiallyExpanded={false}>
            <div className="document-crop-section">
              <PagesToCropOptions
                cropMode={cropMode}
                onCropModeChange={onCropModeChange}
                loadedDocumentPageCount={loadedDocumentPageCount}
                selectedPages={selectedPages}
                handlePageNumbersChanged={handlePageNumbersChanged}
                handlePageNumberError={handlePageNumberError}
                pageNumberError={pageNumberError}
              />
            </div>
          </CollapsibleSection>
          <CollapsibleSection
            className={classNames({
              'crop-inactive': !cropAnnotation,
            })}
            headingLevel={2}
            header={t('cropPopUp.cropDimensions')}
            isInitiallyExpanded={false}
            isExpanded={Boolean(isCropDimensionsContainerActive && cropAnnotation)}
            toggleHandler={toggleCropDimensions}>
            <div className="document-crop-section">
              <DimensionsInput
                yOffset={yOffset}
                height={height}
                xOffset={xOffset}
                width={width}
                unit={unit}
                autoTrim={autoTrim}
                supportedUnits={supportedUnits}
                autoTrimOptions={[t('cropPopUp.dimensionInput.autoTrimCustom'), ...Object.keys(autoTrimDimensions)]}
                onDimensionChange={onDimensionChange}
                onUnitChange={onUnitChange}
                autoTrimActive={autoTrimActive}
                setAutoTrimActive={setAutoTrimActive}
                onAutoTrimChange={onAutoTrimChange}
              />
            </div>
          </CollapsibleSection>
          <div className="buttons">
            <Button
              className="cancel-button"
              dataElement="cropCancelButton"
              onClick={handleCancel}
              label={t('action.cancel')}
            />
            <Button
              className="save-button"
              dataElement="cropApplyButton"
              onClick={handleApply}
              disabled={!isCropping || pageNumberError}
              label={t('action.apply')}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCropPopupMobile;

DocumentCropPopupMobile.propTypes = {
  cropAnnotation: PropTypes.object,
  isCropping: PropTypes.bool,
  pageNumberError: PropTypes.string,
  yOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  xOffset: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  unit: PropTypes.string,
  autoTrim: PropTypes.string,
  supportedUnits: PropTypes.object,
  autoTrimDimensions: PropTypes.object,
  onDimensionChange: PropTypes.func,
  onUnitChange: PropTypes.func,
  autoTrimActive: PropTypes.bool,
  setAutoTrimActive: PropTypes.func,
  onAutoTrimChange: PropTypes.func,
  handleApply: PropTypes.func,
  handleCancel: PropTypes.func,
  className: PropTypes.string,
  cropMode: PropTypes.string,
  onCropModeChange: PropTypes.func,
  loadedDocumentPageCount: PropTypes.number,
  selectedPages: PropTypes.array,
  handlePageNumbersChanged: PropTypes.func,
  handlePageNumberError: PropTypes.func,
  toggleCropDimensions: PropTypes.func,
  isCropDimensionsContainerActive: PropTypes.bool,
};