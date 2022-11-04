import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ColorPalette from 'components/ColorPalette';
import Dropdown from 'components/Dropdown';
import core from 'core';
import { isIOS, isMobile } from 'helpers/device';
import cropImageFromCanvas from 'helpers/cropImageFromCanvas';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import './TextSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  disableCreateButton: PropTypes.func,
  enableCreateButton: PropTypes.func,
  isInitialsModeEnabled: PropTypes.bool,
};

const FONT_SIZE = 72;
const TYPED_SIGNATURE_FONT_SIZE = (FONT_SIZE * 2) / 3;
const MAX_SIGNATURE_LENGTH = 350;
const DEFAULT_FONT_COLOR = '#000000';
const CANVAS_MULTIPLIER = window.Core.getCanvasMultiplier();
const TEXT_CLIP_PADDING = 100;

const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt((it) => !it);
};

const parseInitialsFromFullSignature = (fullSiganture) => {
  return fullSiganture?.split(' ').map((x) => x[0]).join('').toUpperCase();
};

const getSignatureLength = (text, fontSize, fontFamily) => {
  const font = `${fontSize}px ${fontFamily}`;
  const textSpan = document.createElement('span');
  textSpan.id = 'textSpan';
  textSpan.style.display = 'inline-block';
  textSpan.style.visibility = 'hidden';
  textSpan.style.font = font;

  document.getElementsByTagName('body')[0].appendChild(textSpan);
  textSpan.textContent = text;

  const signatureWidth = textSpan.getBoundingClientRect().width;
  textSpan.remove();
  return signatureWidth;
};

const scaleFontSize = (text, fontFamily) => {
  let minFontSize = 0;
  let maxFontSize = TYPED_SIGNATURE_FONT_SIZE;
  let currentFontSize;

  while (minFontSize <= maxFontSize) {
    currentFontSize = Math.floor((minFontSize + maxFontSize) / 2);

    const signatureWidth = getSignatureLength(text, currentFontSize, fontFamily);
    if (signatureWidth > MAX_SIGNATURE_LENGTH) {
      maxFontSize = currentFontSize - 1;
    } else {
      minFontSize = currentFontSize + 1;
    }
  }
  return currentFontSize;
};

const resizeCanvas = (canvas, measurementReference) => {
  let { width, height } = measurementReference.current.getBoundingClientRect();
  width += TEXT_CLIP_PADDING;
  height += TEXT_CLIP_PADDING;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  canvas.width = width * CANVAS_MULTIPLIER;
  canvas.height = height * CANVAS_MULTIPLIER;
};

const setFontInCanvas = ({ canvas, text, selectedFontFamily, fontColor }) => {
  const ctx = canvas.getContext('2d');
  const fontSize = scaleFontSize(text, selectedFontFamily);
  ctx.fillStyle = fontColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.font = `${fontSize * CANVAS_MULTIPLIER}px ${selectedFontFamily}`;
};

const drawTextInCanvas = (canvas, text) => {
  const ctx = canvas.getContext('2d');
  const { width, height } = canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.fillText(text, width / 2, height / 2);
};

const TextSignature = ({
  isModalOpen,
  isTabPanelSelected,
  disableCreateButton,
  enableCreateButton,
  isInitialsModeEnabled = false,
}) => {
  const fonts = useSelector((state) => selectors.getSignatureFonts(state));
  const [fullSignature, setFullSiganture] = useState('');
  const [initials, setInitials] = useState('');
  const [isDefaultValue, setIsDefaultValue] = useState(true);
  const [fontColor, setFontColor] = useState(new window.Annotations.Color(DEFAULT_FONT_COLOR));
  const [fontSize, setFontSize] = useState(TYPED_SIGNATURE_FONT_SIZE);
  const inputRef = useRef();
  const fullSignatureHiddenCanvasRef = useRef();
  const initialsHiddenCanvasRef = useRef();
  const hiddenFullSignatureRef = useRef();
  const hiddenInitialsRef = useRef();
  const [t] = useTranslation();

  const [selectedFontFamily, setSelectedFontFamily] = useState(fonts[0]);

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // this can happen when an user added a new signature font, select it and then removed it
    // in this case we just assume there's at least one font and set the active index to 0
    if (!fonts.includes(selectedFontFamily)) {
      setSelectedFontFamily(fonts[0]);
    }
  }, [selectedFontFamily, fonts]);

  useEffect(() => {
    const initialsCanvas = initialsHiddenCanvasRef.current;

    if (isTabPanelSelected) {
      resizeCanvas(initialsCanvas, hiddenInitialsRef);
      setFontInCanvas({
        canvas: initialsCanvas,
        text: initials,
        selectedFontFamily,
        fontColor,
      });
      drawTextInCanvas(initialsCanvas, initials);

      if (isModalOpen) {
        setInitialsInTool();
      }
    }
  }, [isTabPanelSelected, initials, fonts, fontColor, selectedFontFamily]);

  useEffect(() => {
    const fullSignatureCanvas = fullSignatureHiddenCanvasRef.current;

    if (isTabPanelSelected) {
      resizeCanvas(fullSignatureCanvas, hiddenFullSignatureRef);
      setFontInCanvas({
        canvas: fullSignatureCanvas,
        text: fullSignature,
        selectedFontFamily,
        fontColor,
      });
      drawTextInCanvas(fullSignatureCanvas, fullSignature);
      if (isModalOpen) {
        setSignature();
      }
    }
  }, [isTabPanelSelected, fullSignature, fonts, fontColor, selectedFontFamily]);

  useEffect(() => {
    setFontColor(fontColor);
    if (isModalOpen && isTabPanelSelected) {
      const currentUser = core.getDisplayAuthor(core.getCurrentUser());
      setFullSiganture(currentUser);
      setInitials(parseInitialsFromFullSignature(currentUser));
      setSignature();
    }
  }, [isModalOpen, isTabPanelSelected]);

  useEffect(() => {
    if (isTabPanelSelected) {
      inputRef.current?.focus();

      if (isIOS) {
        inputRef.current.setSelectionRange(0, 9999);
      } else {
        inputRef.current.select();
      }
    }
  }, [isTabPanelSelected]);

  useEffect(() => {
    const onUpdateAnnotationPermission = () => {
      if (isDefaultValue) {
        const currentUser = core.getDisplayAuthor(core.getCurrentUser());
        setFullSiganture(currentUser);
        setInitials(parseInitialsFromFullSignature(currentUser));
        enableCreateButton();
      }
    };

    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => {
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    };
  }, [isDefaultValue]);

  const setSignature = () => {
    const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
    const canvas = fullSignatureHiddenCanvasRef.current;

    const signatureValue = fullSignature || '';
    if (signatureValue.trim()) {
      const base64 = cropImageFromCanvas(canvas);
      signatureToolArray.forEach((tool) => tool.setSignature(base64));
      enableCreateButton();
    } else {
      signatureToolArray.forEach((tool) => tool.setSignature(null));
      disableCreateButton();
    }
  };

  const setInitialsInTool = () => {
    const signatureToolArray = core.getToolsFromAllDocumentViewers('AnnotationCreateSignature');
    const canvas = initialsHiddenCanvasRef.current;

    const initialsValue = initials || '';
    if (initialsValue.trim()) {
      const base64 = cropImageFromCanvas(canvas);
      signatureToolArray.forEach((tool) => tool.setInitials(base64));
      enableCreateButton();
    } else {
      signatureToolArray.forEach((tool) => tool.setInitials(null));
      disableCreateButton();
    }
  };

  const handleFullSignatureChange = (e) => {
    setIsDefaultValue(false);
    // Use regex instead of 'trimStart' for IE11 compatibility
    const value = e.target.value.replace(/^\s+/g, '');
    setSignature();
    setFullSiganture(value);
    setInitials(parseInitialsFromFullSignature(value));

    const newFontSize = scaleFontSize(value, selectedFontFamily);
    setFontSize(newFontSize);
  };

  const handleInitialsChange = (e) => {
    setIsDefaultValue(false);
    // Use regex instead of 'trimStart' for IE11 compatibility
    const initials = e.target.value.replace(/^\s+/g, '');
    setSignature();
    setInitials(initials);
  };

  const handleColorInputChange = (property, value) => {
    setFontColor(value);
    // hack for tool styles for signature not being on state
    // Note from ADBG : But why tho?
    forceUpdate();
  };

  const handleDropdownSelectionChange = (font) => {
    setSelectedFontFamily(font);
    const newFontSize = scaleFontSize(fullSignature, font);
    setFontSize(newFontSize);
  };

  // These elements are hidden from the user but are used as references to measure
  // how the text fits, and then resize the canvas accordingly
  const renderHiddenSignatureElements = () => {
    return (
      <div
        className={classNames({
          'text-signature-text': true,
        })}
        style={{ fontFamily: selectedFontFamily, fontSize: FONT_SIZE, color: fontColor.toHexString() }}
      >
        <div
          className="text-container"
          ref={hiddenFullSignatureRef}
        >
          {fullSignature}
        </div>
        <div
          className="text-container"
          ref={hiddenInitialsRef}
        >
          {initials}
        </div>
      </div>
    );
  };

  const isDisabled = !(isModalOpen && isTabPanelSelected);
  const initialsInputStyle = isInitialsModeEnabled ? {} : { display: 'none' };

  return (
    <div className="text-signature">
      <div className="signature-and-initials-container">
        <div className="signature-input full-signature">
          <label>
            <input
              className="text-signature-input"
              ref={inputRef}
              type="text"
              value={fullSignature}
              onChange={handleFullSignatureChange}
              style={{ fontFamily: selectedFontFamily || fonts, fontSize, color: fontColor.toHexString() }}
              disabled={isDisabled}
            />
          </label>
          <div className="signature-input-footer">
            <div className='signature-prompt'>
              {t('option.signatureModal.typeSignature')}
            </div>
            <button
              className="footer-signature-clear"
              onClick={() => setFullSiganture('')}
              disabled={isDisabled || fullSignature.length === 0}
            >
              {t('action.clear')}
            </button>
          </div>
        </div>
        <div className="signature-input initials" style={initialsInputStyle}>
          <label>
            <input
              className="text-signature-input"
              type="text"
              value={initials}
              onChange={handleInitialsChange}
              style={{ fontFamily: selectedFontFamily || fonts, fontSize, color: fontColor.toHexString() }}
              disabled={isDisabled}
            />
          </label>
          <div className="signature-input-footer">
            <div className='signature-prompt'>
              {t('option.signatureModal.typeInitial')}
            </div>
            <button
              className="footer-signature-clear"
              onClick={() => setInitials('')}
              disabled={isDisabled || initials.length === 0}
            >
              {t('action.clear')}
            </button>
          </div>
        </div>
      </div>
      {renderHiddenSignatureElements()}
      <canvas ref={fullSignatureHiddenCanvasRef} />
      <canvas ref={initialsHiddenCanvasRef} />
      <div className="colorpalette-clear-container">
        <div className="signature-style-options">
          <Dropdown
            items={fonts.map((font) => ({ font, value: `${fullSignature} ${isInitialsModeEnabled ? initials : ''}` }))}
            getCustomItemStyle={(item) => ({ fontFamily: item.font })}
            getKey={(item) => item.font}
            getDisplayValue={(item) => {
              return item.value || item.font;
            }}
            onClickItem={handleDropdownSelectionChange}
            currentSelectionKey={selectedFontFamily || fonts[0]}
            maxHeight={isMobile() ? 80 : null}
            dataElement="text-signature-font-dropdown"
          />
          <div className="placeholder-dropdown"></div>
          <div className="divider"></div>
          <ColorPalette
            color={fontColor}
            property="fontColor"
            onStyleChange={(property, value) => handleColorInputChange(property, value)}
            overridePalette2={['#000000', '#4E7DE9', '#E44234']}
          />
        </div>
      </div>
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;
