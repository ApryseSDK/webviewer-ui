import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import ColorPalette from 'components/ColorPalette';
import core from 'core';
import { isIOS } from 'helpers/device';
import cropImageFromCanvas from 'helpers/cropImageFromCanvas';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import './TextSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  isTabPanelSelected: PropTypes.bool,
  disableCreateButton: PropTypes.func,
  enableCreateButton: PropTypes.func,
};

const FONT_SIZE = 96;
const TYPED_SIGNATURE_FONT_SIZE = (FONT_SIZE * 2) / 3;
const DEFAULT_FONT_FAMILY = 'GreatVibes-Regular';
const MAX_SIGNATURE_LENGTH = 360;

const useForceUpdate = () => {
  const [, setIt] = useState(false);
  return () => setIt(it => !it);
};

const TextSignature = ({
  isModalOpen,
  isTabPanelSelected,
  disableCreateButton,
  enableCreateButton
}) => {
  const fonts = useSelector(state => selectors.getSignatureFonts(state));
  // const [value, setValue] = useState(core.getDisplayAuthor(core.getCurrentUser()));
  const [value, setValue] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDefaultValue, setIsDefaultValue] = useState(true);
  const [fontColor, setFontColor] = useState('#000000');
  const [fontSize, setFontSize] = useState(TYPED_SIGNATURE_FONT_SIZE);
  const inputRef = useRef();
  const canvasRef = useRef();
  const textDivsRef = useRef([]);
  const [t] = useTranslation();

  const forceUpdate = useForceUpdate();

  useEffect(() => {
    // this can happen when an user added a new signature font, select it and then removed it
    // in this case we just assume there's at least one font and set the active index to 0
    if (activeIndex >= fonts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, fonts]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const multiplier = window.Core.getCanvasMultiplier();
    const textClipPadding = 100;

    const resizeCanvas = () => {
      let { width, height } = textDivsRef.current[
        activeIndex
      ].getBoundingClientRect();
      width = width + textClipPadding;
      height = height + textClipPadding;
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * multiplier;
      canvas.height = height * multiplier;
    };

    const setFont = () => {
      ctx.fillStyle = fontColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = `${FONT_SIZE * multiplier}px ${fonts[activeIndex]}`;
    };
    const drawTextSignature = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);
      ctx.fillText(value, width / 2, height / 2);
    };

    if (isTabPanelSelected) {
      resizeCanvas();
      setFont();
      drawTextSignature();
      if (isModalOpen) {
        setSignature();
      }
    }
  }, [activeIndex, isTabPanelSelected, value, fonts, fontColor]);

  useEffect(() => {
    setFontColor(fontColor);
    if (isModalOpen && isTabPanelSelected) {
      setValue(core.getDisplayAuthor(core.getCurrentUser()));
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
        setValue(core.getDisplayAuthor(core.getCurrentUser()));
        enableCreateButton();
      }
    };

    core.addEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    return () => {
      core.removeEventListener('updateAnnotationPermission', onUpdateAnnotationPermission);
    };
  }, [isDefaultValue]);

  const setSignature = () => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;

    const signatureValue = value || '';
    if (signatureValue.trim()) {
      const base64 = cropImageFromCanvas(canvas)
      signatureTool.setSignature(base64);
      enableCreateButton();
    } else {
      signatureTool.setSignature(null);
      disableCreateButton();
    }
  };

  const handleInputChange = e => {
    setIsDefaultValue(false);
    // Use regex instead of 'trimStart' for IE11 compatibility
    const value = e.target.value.replace(/^\s+/g, '');
    setSignature();
    setValue(value);

    const newFontSize = scaleFontSize(value, DEFAULT_FONT_FAMILY);
    setFontSize(newFontSize);
  };

  const handleColorInputChange = (property, value) => {
    setFontColor(value)
    // hack for tool styles for signature not being on state
    forceUpdate();
  };

  const getSignatureLength = (text, fontSize, fontFamily) => {
    const font = fontSize + 'px ' + fontFamily;
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

  return (
    <div className="text-signature">
      <div className="text-signature-input-container">
        <label>
          <input
            className="text-signature-input"
            ref={inputRef}
            type="text"
            value={value}
            placeholder="Type Signature"
            onChange={handleInputChange}
            style={{ fontFamily: fonts, fontSize: fontSize, color: fontColor }}
            disabled={!(isModalOpen && isTabPanelSelected)}
          />
        </label>
      </div>
      {fonts.map((font, index) => (
        <div
          key={font}
          className={classNames({
            'text-signature-text': true,
            active: index === activeIndex,
          })}
          style={{ fontFamily: font, fontSize: FONT_SIZE, color:fontColor}}
          onClick={() => setActiveIndex(index)}
        >
          <div
            className="text-container"
            ref={el => {
              textDivsRef.current[index] = el;
            }}
          >
            {value}
          </div>
        </div>
      ))}
      <canvas ref={canvasRef} />
      <div className="colorpalette-clear-container">
        <ColorPalette
          color={new window.Annotations.Color(fontColor)}
          property="fontColor"
          onStyleChange={(property, value) => handleColorInputChange(property, value)}
          overridePalette2={['#000000', '#4E7DE9', '#E44234']}
        />
        <button className="signature-clear" onClick={() => setValue('')} disabled={!(isModalOpen && isTabPanelSelected) || value.length === 0}>
          {t('action.clear')}
        </button>
      </div>
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;
