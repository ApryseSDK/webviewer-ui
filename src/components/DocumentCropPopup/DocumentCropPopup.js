import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import DimensionsInput from './DimensionsInput';
import Dropdown from 'components/Dropdown';
import PageNumberInput from 'components/PageReplacementModal/PageNumberInput';
import core from 'core';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import pageNumberPlaceholder from 'constants/pageNumberPlaceholder';

import './DocumentCropPopup.scss';

const DocumentCropPopup = ({
  cropAnnotation,
  cropMode,
  onCropModeChange,
  closeDocumentCropPopup,
  applyCrop,
  isCropping,
  getPageHeight,
  getPageWidth,
  isPageRotated,
  redrawCropAnnotations,
  isInDesktopOnlyMode,
  isMobile,
  getPageCount,
  getCurrentPage,
  selectedPages,
  onSelectedPagesChange,
  shouldShowApplyCropWarning,
  presetCropDimensions,
}) => {
  const { t } = useTranslation();

  const className = classNames({
    Popup: true,
    DocumentCropPopup: true,
    mobile: isMobile,
  });

  const loadedDocumentPageCount = getPageCount();

  const [pages, setPages] = useState('');

  const handlePageNumbersChanged = (pageNumbers) => {
    if (pageNumbers.length > 0) {
      setPages(pageNumbers);
    }
  };

  const handlePageNumberError = (pageNumber) => {
    if (pageNumber) {
      setPageNumberError(`${t('message.errorPageNumber')} ${loadedDocumentPageCount}`);
    }
  };

  useEffect(() => {
    const timeOutWhileTyping = setTimeout(() => {
      onSelectedPagesChange(pages);
      if (pages) {
        setPageNumberError(null);
      }
    }, 2000);
    return () => clearTimeout(timeOutWhileTyping);
  }, [pages]);

  const cropNames = {
    'ALL_PAGES': t('cropPopUp.allPages'),
    'SINGLE_PAGE': t('cropPopUp.singlePage'),
    'MULTI_PAGE': t('cropPopUp.multiPage'),
  };

  const supportedUnits = {
    'Inches (in)': '"',
    'Centimeters (cm)': 'cm',
    'Millimeters (mm)': 'mm',
  };

  const unitConversions = {
    '"': 1,
    'cm': 2.54,
    'mm': 25.4,
    'pt': 72,
  };

  // set default to whichever unit is listed first in unitConversions
  const [unit, setUnit] = useState(Object.getOwnPropertyNames(supportedUnits)[0]);

  const [autoTrimActive, setAutoTrimActive] = useState(false);

  // dimensions used to place auto trim crop annotations.
  // default values are using inches
  const autoTrimDimensions = presetCropDimensions;

  const [autoTrim, setAutoTrim] = useState(null);

  const [isCropDimensionsContainerActive, setCropDimensionsContainerActive] = useState(false);

  const toggleCropDimensions = () => {
    if (isCropping) {
      setCropDimensionsContainerActive(!isCropDimensionsContainerActive);
    }
  };

  const convertUnitsToPt = (val) => {
    const unitToConvertTo = unitConversions[supportedUnits[unit]];
    const pt = unitConversions['pt'];
    return (val / unitToConvertTo) * pt;
  };

  const convertPtToUnits = (val, unitToConvertTo) => {
    val /= unitConversions['pt'];
    return val * unitConversions[supportedUnits[unitToConvertTo]];
  };

  const truncateInput = (input) => {
    const INPUT_MAX_LENGTH = 5;
    if (input) {
      input = input.toString();

      // if there is a decimal, allow an additional char to keep amount of other chars at INPUT_MAX_LENGTH
      let specialChars = 0;
      if (input.includes('.')) {
        specialChars++;
      }
      if (input.length > INPUT_MAX_LENGTH + specialChars) {
        input = input.slice(0, INPUT_MAX_LENGTH + specialChars);
      }
    }
    return input;
  };

  const validateInput = (input, dimension) => {
    if (input < 0) {
      return 0;
    }

    const pageNumber = cropAnnotation ? cropAnnotation.getPageNumber() : getCurrentPage();

    if (dimension) {
      switch (dimension) {
        case 'xOffset':
          if (isPageRotated(pageNumber)) {
            input = Math.min(input, convertPtToUnits(getPageHeight(pageNumber) - cropAnnotation.getWidth(), unit));
          } else {
            input = Math.min(input, convertPtToUnits(getPageWidth(pageNumber) - cropAnnotation.getWidth(), unit));
          }
          break;
        case 'width':
          if (isPageRotated(pageNumber)) {
            input = Math.min(input, convertPtToUnits(getPageHeight(pageNumber) - cropAnnotation.getX(), unit));
          } else {
            input = Math.min(input, convertPtToUnits(getPageWidth(pageNumber) - cropAnnotation.getX(), unit));
          }
          break;
        case 'yOffset':
          if (isPageRotated(pageNumber)) {
            input = Math.min(input, convertPtToUnits(getPageWidth(pageNumber) - cropAnnotation.getHeight(), unit));
          } else {
            input = Math.min(input, convertPtToUnits(getPageHeight(pageNumber) - cropAnnotation.getHeight(), unit));
          }
          break;
        case 'height':
          if (isPageRotated(pageNumber)) {
            input = Math.min(input, convertPtToUnits(getPageWidth(pageNumber) - cropAnnotation.getY(), unit));
          } else {
            input = Math.min(input, convertPtToUnits(getPageHeight(pageNumber) - cropAnnotation.getY(), unit));
          }
          break;
      }
    }

    input = Math.max(Number(input), 0);

    return input;
  };

  const [yOffset, setYOffset] = useState();
  const [height, setHeight] = useState();
  const [xOffset, setXOffset] = useState();
  const [width, setWidth] = useState();

  useEffect(() => {
    if (cropAnnotation) {
      // when user changes the input units or adjusts the crop annotation using the mouse, the input fields need to be updated
      onUnitChange(unit);
      const onCropAnnotationChanged = () => {
        setYOffset(Math.max(0, truncateInput(convertPtToUnits(cropAnnotation.getY(), unit))));
        setHeight(Math.max(0, truncateInput(convertPtToUnits(cropAnnotation.getHeight(), unit))));
        setXOffset(Math.max(0, truncateInput(convertPtToUnits(cropAnnotation.getX(), unit))));
        setWidth(Math.max(0, truncateInput(convertPtToUnits(cropAnnotation.getWidth(), unit))));

        setAutoTrimActive(false);
      };
      core.addEventListener('annotationChanged', onCropAnnotationChanged);
      return () => {
        core.removeEventListener('annotationChanged', onCropAnnotationChanged);
      };
    }
  }, [unit, cropAnnotation]);

  useEffect(() => {
    if (cropAnnotation) {
      redrawCropAnnotations(cropAnnotation.getRect());
    }
  }, [autoTrimActive]);

  useEffect(() => {
    if (cropAnnotation) {
      const onPagesUpdated = () => {
        setYOffset(truncateInput(convertPtToUnits(cropAnnotation.getY(), unit)));
        setHeight(truncateInput(convertPtToUnits(cropAnnotation.getHeight(), unit)));
        setXOffset(truncateInput(convertPtToUnits(cropAnnotation.getX(), unit)));
        setWidth(truncateInput(convertPtToUnits(cropAnnotation.getWidth(), unit)));
      };
      core.addEventListener('pagesUpdated', onPagesUpdated);

      return () => {
        core.removeEventListener('pagesUpdated', onPagesUpdated);
      };
    }
  }, []);

  const onDimensionChange = (input, position) => {
    if (!input) {
      input = 0;
    }

    input = validateInput(input, position);

    switch (position) {
      case 'yOffset':
        cropAnnotation.setY(convertUnitsToPt(input));
        setYOffset(truncateInput(input));
        break;
      case 'height':
        cropAnnotation.setHeight(convertUnitsToPt(input));
        setHeight(truncateInput(input));
        break;
      case 'xOffset':
        cropAnnotation.setX(convertUnitsToPt(input));
        setXOffset(truncateInput(input));
        break;
      case 'width':
        cropAnnotation.setWidth(convertUnitsToPt(input));
        setWidth(truncateInput(input));
        break;
    }
    if (cropAnnotation) {
      redrawCropAnnotations(cropAnnotation.getRect());
    }
  };

  const onUnitChange = (unit) => {
    setUnit(unit);
    setYOffset(truncateInput(convertPtToUnits(cropAnnotation.getY(), unit)));
    setHeight(truncateInput(convertPtToUnits(cropAnnotation.getHeight(), unit)));
    setXOffset(truncateInput(convertPtToUnits(cropAnnotation.getX(), unit)));
    setWidth(truncateInput(convertPtToUnits(cropAnnotation.getWidth(), unit)));
  };

  const onAutoTrimChange = (autoTrim) => {
    if (autoTrim) {
      setAutoTrim(autoTrim);
      setAutoTrimActive(true);

      const y = autoTrimDimensions[autoTrim]['yOffset'] * unitConversions[supportedUnits[unit]];
      const h = Math.max(0, autoTrimDimensions[autoTrim]['height'] * unitConversions[supportedUnits[unit]]);
      const x = autoTrimDimensions[autoTrim]['xOffset'] * unitConversions[supportedUnits[unit]];
      const w = Math.max(0, autoTrimDimensions[autoTrim]['width'] * unitConversions[supportedUnits[unit]]);

      cropAnnotation.setY(convertUnitsToPt(y));
      setYOffset(truncateInput(y));
      cropAnnotation.setX(convertUnitsToPt(x));
      setXOffset(truncateInput(x));
      cropAnnotation.setHeight(convertUnitsToPt(h));
      setHeight(truncateInput(h));
      cropAnnotation.setWidth(convertUnitsToPt(w));
      setWidth(truncateInput(w));

      if (cropAnnotation) {
        redrawCropAnnotations(cropAnnotation.getRect());
      }
    } else {
      // if no auto-trim is chosen or if auto-trim gets disabled by adjusting the crop dimensions, reset it
      setAutoTrim(undefined);
    }
  };

  const handleButtonPressed = (button) => {
    switch (button) {
      case 'apply':
        shouldShowApplyCropWarning ? openCropConfirmationWarning() : applyCrop();
        break;
      case 'cancel':
        isCropping ? openCropCancellationWarning() : closeDocumentCropPopup();
        break;
    }
  };

  const dispatch = useDispatch();

  const openCropConfirmationWarning = () => {
    const title = t('cropPopUp.cropModal.applyTitle');
    const message = t('cropPopUp.cropModal.applyMessage');
    const confirmationWarning = {
      message,
      title,
      onConfirm: () => {
        applyCrop();
      },
    };
    dispatch(actions.showWarningMessage(confirmationWarning));
  };

  const openCropCancellationWarning = () => {
    const title = t('cropPopUp.cropModal.cancelTitle');
    const message = t('cropPopUp.cropModal.cancelMessage');
    const cancellationWarning = {
      message,
      title,
      onConfirm: () => {
        closeDocumentCropPopup();
      },
    };
    dispatch(actions.showWarningMessage(cancellationWarning));
  };

  const [pageNumberError, setPageNumberError] = useState('');

  if (isMobile && !isInDesktopOnlyMode) {
    return (
      <div className={className}>
        <div className="document-crop-mobile-section">
          <div className="document-crop-mobile-container">
            <div className="custom-select document-crop-selector">
              <Dropdown
                items={Object.values(cropNames)}
                onClickItem={(e) => onCropModeChange(Object.keys(cropNames).find((key) => cropNames[key] === e))}
                currentSelectionKey={cropNames[cropMode]}
              />
              {cropMode === 'MULTI_PAGE' && (
                <div className="document-crop-page-input-container">
                  <PageNumberInput
                    data-element="multiPageCropPageNumberInput"
                    selectedPageNumbers={selectedPages}
                    pageCount={loadedDocumentPageCount}
                    onSelectedPageNumbersChange={handlePageNumbersChanged}
                    onBlurHandler={null}
                    placeHolder={pageNumberPlaceholder}
                    onError={handlePageNumberError}
                  />
                </div>
              )}
              {pageNumberError && <div className="page-number-error">{pageNumberError}</div>}
            </div>
            <button
              className="save-button"
              data-element="cropApplyButton"
              onClick={() => handleButtonPressed('apply')}
              disabled={!isCropping}
            >
              {t('action.apply')}
            </button>
          </div>
          <button
            className="cancel-button"
            data-element="cropCancelButton"
            onClick={() => handleButtonPressed('cancel')}
          >
            <Icon glyph="icon-close" />
          </button>
        </div>
      </div>
    );
  }
  return (
    <div className={className}>
      <div className="document-crop-section">
        <span className="menu-title">{t('cropPopUp.title')}</span>
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
        <Choice
          label={t('cropPopUp.multiPage')}
          name="MULTI_PAGE"
          data-element="multiPageCropRadioButton"
          onChange={() => onCropModeChange('MULTI_PAGE')}
          checked={cropMode === 'MULTI_PAGE'}
          radio
        />
        {cropMode === 'MULTI_PAGE' && (
          <div className="document-crop-page-input-container">
            <PageNumberInput
              data-element="multiPageCropPageNumberInput"
              selectedPageNumbers={selectedPages}
              pageCount={loadedDocumentPageCount}
              onSelectedPageNumbersChange={handlePageNumbersChanged}
              onBlurHandler={null}
              placeHolder={pageNumberPlaceholder}
              onError={handlePageNumberError}
            />
          </div>
        )}
        {pageNumberError && <div className="page-number-error">{pageNumberError}</div>}
      </div>
      <div className={isCropping && cropAnnotation ? 'crop-active' : 'crop-inactive'}>
        <div className="divider" />
        <div className="document-crop-section">
          <div
            className="collapsible-menu"
            style={{ pointerEvents: isCropping ? 'all' : 'none' }}
            onClick={toggleCropDimensions}
            onTouchStart={toggleCropDimensions}
          >
            <div className="menu-title">{t('cropPopUp.cropDimensions')}</div>
            <Icon
              data-testid="collapsible-menu-icon"
              className={isCropping ? 'crop-active' : 'crop-inactive'}
              glyph={`icon-chevron-${isCropDimensionsContainerActive && cropAnnotation ? 'up' : 'down'}`}
            />
          </div>
          {isCropDimensionsContainerActive && cropAnnotation && (
            <DimensionsInput
              yOffset={yOffset}
              height={height}
              xOffset={xOffset}
              width={width}
              unit={unit}
              autoTrim={autoTrim}
              supportedUnits={supportedUnits}
              autoTrimOptions={Object.keys(autoTrimDimensions)}
              onDimensionChange={onDimensionChange}
              onUnitChange={onUnitChange}
              autoTrimActive={autoTrimActive}
              setAutoTrimActive={setAutoTrimActive}
              onAutoTrimChange={onAutoTrimChange}
            />
          )}
        </div>
        <div className="divider" />
      </div>
      <div className="buttons">
        <button className="cancel-button" data-element="cropCancelButton" onClick={() => handleButtonPressed('cancel')}>
          {t('action.cancel')}
        </button>
        <button
          className="save-button"
          data-element="cropApplyButton"
          onClick={() => handleButtonPressed('apply')}
          disabled={!isCropping || pageNumberError}
        >
          {t('action.apply')}
        </button>
      </div>
    </div>
  );
};

export default DocumentCropPopup;
