import React, { useEffect, useState } from 'react';
import classNames from 'classnames';
import Icon from 'components/Icon';
import { useTranslation } from 'react-i18next';
import { Choice } from '@pdftron/webviewer-react-toolkit';
import DimensionsInput from './DimensionsInput';
import Dropdown from 'components/Dropdown';
import core from 'core';
import actions from 'actions';
import { useDispatch } from 'react-redux';

import './DocumentCropPopup.scss';

const DocumentCropPopup = ({
  cropAnnotation,
  cropMode,
  onCropModeChange,
  getCropDimension,
  setCropTop,
  setCropBottom,
  setCropLeft,
  setCropRight,
  closeDocumentCropPopup,
  applyCrop,
  isCropping,
  getPageHeight,
  getPageWidth,
  redrawCropAnnotations,
  isInDesktopOnlyMode,
  isMobile,
}) => {
  const { t } = useTranslation();

  const className = classNames({
    Popup: true,
    DocumentCropPopup: true,
    mobile: isMobile,
  });

  const cropNames = {
    'SINGLE_PAGE': t('cropPopUp.singlePage'),
    'ALL_PAGES': t('cropPopUp.allPages'),
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
  const autoTrimDimensions = {
    'Letter': {
      'top': 0,
      'bottom': 11,
      'left': 0,
      'right': 8.5,
    },
    'Half letter': {
      'top': 0,
      'bottom': 5.5,
      'left': 0,
      'right': 8.5,
    },
    'Junior legal': {
      'top': 0,
      'bottom': 5,
      'left': 0,
      'right': 8,
    },
  };

  const [autoTrim, setAutoTrim] = useState(null);

  const [isCropDimensionsContainerActive, setCropDimensionsContainerActive] = useState(false);

  const toggleCropDimensions = () => {
    if (cropAnnotation) {
      setCropDimensionsContainerActive(!isCropDimensionsContainerActive);
    }
  };

  const convertUnitsToPt = val => {
    const unitToConvertTo = unitConversions[supportedUnits[unit]];
    const pt = unitConversions['pt'];
    return (val / unitToConvertTo) * pt;
  };

  const convertPtToUnits = (val, unitToConvertTo) => {
    val /= unitConversions['pt'];
    return val * unitConversions[supportedUnits[unitToConvertTo]];
  };

  const truncateInput = input => {
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
  }

  const validateInput = (input, dimension) => {
    if (input < 0) {
      return 0;
    }

    if (dimension) {
      switch (dimension) {
        case 'left':
          input = Math.min(input, convertPtToUnits(getPageWidth(cropAnnotation.getPageNumber()) - getCropDimension('right'), unit));
          break;
        case 'right':
          input = Math.min(input, convertPtToUnits(getPageWidth(cropAnnotation.getPageNumber()) - getCropDimension('left'), unit));
          break;
        case 'top':
          input = Math.min(input, convertPtToUnits(getPageHeight(cropAnnotation.getPageNumber()) - getCropDimension('bottom'), unit));
          break;
        case 'bottom':
          input = Math.min(input, convertPtToUnits(getPageHeight(cropAnnotation.getPageNumber()) - getCropDimension('top'), unit));
          break;
      }
    }

    input = Number(input);

    return input;
  };

  const [top, setTop] = useState();
  const [bottom, setBottom] = useState();
  const [left, setLeft] = useState();
  const [right, setRight] = useState();

  useEffect(() => {
    if (cropAnnotation) {
      // when user changes the input units or adjusts the crop annotation using the mouse, the input fields need to be updated
      onUnitChange(unit);
      const onCropAnnotationChanged = () => {
        setTop(truncateInput(convertPtToUnits(getCropDimension('top'), unit)));
        setBottom(truncateInput(convertPtToUnits(getCropDimension('bottom'), unit)));
        setLeft(truncateInput(convertPtToUnits(getCropDimension('left'), unit)));
        setRight(truncateInput(convertPtToUnits(getCropDimension('right'), unit)));

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
      const onLayoutChanged = () => {
        setTop(truncateInput(convertPtToUnits(getCropDimension('top'), unit)));
        setBottom(truncateInput(convertPtToUnits(getCropDimension('bottom'), unit)));
        setLeft(truncateInput(convertPtToUnits(getCropDimension('left'), unit)));
        setRight(truncateInput(convertPtToUnits(getCropDimension('right'), unit)));
      };
      core.addEventListener('layoutChanged', onLayoutChanged);

      return () => {
        core.removeEventListener('layoutChanged', onLayoutChanged);
      };
    }
  }, []);

  const onDimensionChange = (input, position) => {
    input = validateInput(input, position);
    switch (position) {
      case 'top':
        setCropTop(convertUnitsToPt(input));
        setTop(truncateInput(input));
        break;
      case 'bottom':
        setCropBottom(convertUnitsToPt(input));
        setBottom(truncateInput(input));
        break;
      case 'left':
        setCropLeft(convertUnitsToPt(input));
        setLeft(truncateInput(input));
        break;
      case 'right':
        setCropRight(convertUnitsToPt(input));
        setRight(truncateInput(input));
        break;
    }
    if (cropAnnotation) {
      redrawCropAnnotations(cropAnnotation.getRect());
    }
  };

  const onUnitChange = unit => {
    setUnit(unit);
    setTop(truncateInput(convertPtToUnits(getCropDimension('top'), unit)));
    setBottom(truncateInput(convertPtToUnits(getCropDimension('bottom'), unit)));
    setLeft(truncateInput(convertPtToUnits(getCropDimension('left'), unit)));
    setRight(truncateInput(convertPtToUnits(getCropDimension('right'), unit)));
  };

  const onAutoTrimChange = autoTrim => {
    if (autoTrim) {
      setAutoTrim(autoTrim);

      const pageWidth = convertPtToUnits(getPageWidth(cropAnnotation.getPageNumber()), unit);
      const pageHeight = convertPtToUnits(getPageHeight(cropAnnotation.getPageNumber()), unit);

      const pageRotation = documentViewer.getDocument().getPageRotation(cropAnnotation.getPageNumber());

      const topTrim = autoTrimDimensions[autoTrim]['top'] * unitConversions[supportedUnits[unit]];
      const bottomTrim = Math.max(
        0,
        pageHeight - autoTrimDimensions[autoTrim]['bottom'] * unitConversions[supportedUnits[unit]],
      );
      const leftTrim = autoTrimDimensions[autoTrim]['left'] * unitConversions[supportedUnits[unit]];
      const rightTrim = Math.max(
        0,
        pageWidth - autoTrimDimensions[autoTrim]['right'] * unitConversions[supportedUnits[unit]],
      );

      onDimensionChange(topTrim, 'top');
      onDimensionChange(bottomTrim, pageRotation % 180 === 0 ? 'bottom' : 'right');
      onDimensionChange(leftTrim, 'left');
      onDimensionChange(rightTrim, pageRotation % 180 === 0 ? 'right' : 'bottom');
    } else {
      // if no auto-trim is chosen or if auto-trim gets disabled by adjusting the crop dimensions, reset it
      setAutoTrim(undefined);
    }
  };

  const handleButtonPressed = button => {
    switch (button) {
      case 'apply':
        openCropConfirmationWarning();
        break;
      case 'cancel':
        openCropCancellationWarning();
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

  if (isMobile && !isInDesktopOnlyMode) {
    return (
      <div className={className}>
        <div className="document-crop-mobile-section">
          <div className="document-crop-mobile-container">
            <div className="custom-select document-crop-selector">
              <Dropdown
                items={Object.values(cropNames)}
                onClickItem={e => onCropModeChange(Object.keys(cropNames).find(key => cropNames[key] === e))}
                currentSelectionKey={cropNames[cropMode]}
              />
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
        ></Choice>
        <Choice
          label={t('cropPopUp.singlePage')}
          name="SINGLE_PAGE"
          data-element="singlePageCropRadioButton"
          onChange={() => onCropModeChange('SINGLE_PAGE')}
          checked={cropMode === 'SINGLE_PAGE'}
          radio
        ></Choice>
      </div>
      <div hidden={!isCropping}>
        <div className="divider" />
        <div className="document-crop-section">
          <div className="collapsible-menu" onClick={toggleCropDimensions}>
            <div className="menu-title">{t('cropPopUp.cropDimensions')}</div>
            <Icon
              data-testid="collapsible-menu-icon"
              glyph={`icon-chevron-${isCropDimensionsContainerActive ? 'up' : 'down'}`}
            />
          </div>
          {isCropDimensionsContainerActive && (
            <DimensionsInput
              top={top}
              bottom={bottom}
              left={left}
              right={right}
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
          disabled={!isCropping}
        >
          {t('action.apply')}
        </button>
      </div>
    </div>
  );
};

export default DocumentCropPopup;
