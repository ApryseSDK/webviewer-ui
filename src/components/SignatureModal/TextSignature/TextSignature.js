import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';
import { isIOS } from 'helpers/device';
import selectors from 'selectors';

import './TextSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  _setSaveSignature: PropTypes.func.isRequired,
  isTabPanelSelected: PropTypes.bool,
};

const FONT_SIZE = 100;

const TextSignature = ({
  isModalOpen,
  _setSaveSignature,
  isTabPanelSelected,
}) => {
  const fonts = useSelector(state => selectors.getSignatureFonts(state));
  const [value, setValue] = useState(core.getCurrentUser());
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef();
  const canvasRef = useRef();
  const textDivsRef = useRef([]);

  useEffect(() => {
    // this can happen when an user added a new signature font, select it and then removed it
    // in this case we just assume there's at least one font and set the active index to 0
    if (activeIndex >= fonts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, fonts]);

  const setSignature = useCallback(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');
    const canvas = canvasRef.current;
    _setSaveSignature(!!value);

    if (value) {
      signatureTool.setSignature(canvas.toDataURL());
    } else {
      signatureTool.setSignature(null);
    }
  }, [_setSaveSignature, value]);

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
  }, [activeIndex, isTabPanelSelected, value, fonts, setSignature]);

  useEffect(() => {
    if (isModalOpen && isTabPanelSelected) {
      setSignature();
    }
  }, [isModalOpen, isTabPanelSelected, setSignature]);

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

  const handleInputChange = e => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <div className="text-signature">
      <input
        className="text-signature-input"
        ref={inputRef}
        type="text"
        value={value}
        onChange={handleInputChange}
      />
      <div className="text-signature-container">
        <div className="text-signature-inner-container">
          {fonts.map((font, index) => (
            <div
              key={font}
              ref={el => {
                textDivsRef.current[index] = el;
              }}
              className={classNames({
                'text-signature-text': true,
                active: index === activeIndex,
              })}
              style={{ fontFamily: font, fontSize: FONT_SIZE }}
              onClick={() => setActiveIndex(index)}
            >
              {value}
            </div>
          ))}
        </div>
        <canvas ref={canvasRef} />
      </div>
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;