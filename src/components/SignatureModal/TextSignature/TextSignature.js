import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';
import { isIOS } from 'helpers/device';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';

import './TextSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  createSignature: PropTypes.func.isRequired,
  isTabPanelSelected: PropTypes.bool,
};

const FONT_SIZE = 96;

const TextSignature = ({
  isModalOpen,
  isTabPanelSelected,
  createSignature,
}) => {
  const fonts = useSelector(state => selectors.getSignatureFonts(state));
  const [value, setValue] = useState(core.getCurrentUser());
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef();
  const canvasRef = useRef();
  const textDivsRef = useRef([]);
  const [t] = useTranslation();

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
    const multiplier = window.utils.getCanvasMultiplier();

    const resizeCanvas = () => {
      const { width, height } = textDivsRef.current[
        activeIndex
      ].getBoundingClientRect();
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      canvas.width = width * multiplier;
      canvas.height = height * multiplier;
    };

    const setFont = () => {
      ctx.fillStyle = '#000';
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
      setSignature();
    }
  }, [activeIndex, isTabPanelSelected, value, fonts]);

  useEffect(() => {
    if (isModalOpen && isTabPanelSelected) {
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

  const setSignature = () => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;

    const signatureValue = value || '';
    if (signatureValue.trim()) {
      signatureTool.setSignature(canvas.toDataURL());
    } else {
      signatureTool.setSignature(null);
    }
  };

  const handleInputChange = e => {
    // Use regex instead of 'trimStart' for IE11 compatibility
    const value = e.target.value.replace(/^\s+/g, '');
    setValue(value);
  };

  return (
    <React.Fragment>
      <div className="text-signature">
        <label>
          <input
            className="text-signature-input"
            ref={inputRef}
            type="text"
            value={value}
            onChange={handleInputChange}
            disabled={!(isModalOpen && isTabPanelSelected)}
          />
        </label>
        {fonts.map((font, index) => (
          <div
            key={font}
            className={classNames({
              'text-signature-text': true,
              active: index === activeIndex,
            })}
            style={{ fontFamily: font, fontSize: FONT_SIZE }}
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
      </div>
      <div
        className="footer"
      >
        <button className="signature-clear" onClick={() => setValue('')} disabled={!(isModalOpen && isTabPanelSelected)}>
          {t('action.clear')}
        </button>
        <button className="signature-create" onClick={createSignature} disabled={!(isModalOpen && isTabPanelSelected)}>
          {t('action.create')}
        </button>
      </div>
    </React.Fragment>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;
