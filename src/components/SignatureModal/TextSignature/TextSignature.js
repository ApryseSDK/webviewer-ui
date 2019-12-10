import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import FontHandler from 'components/FontHandler';

import core from 'core';
import selectors from 'selectors';

import './TextSignature.scss';

const propTypes = {
  isModalOpen: PropTypes.bool,
  _setSaveSignature: PropTypes.func.isRequired,
  isTabPanelSelected: PropTypes.bool,
};

const TextSignature = ({
  isModalOpen,
  _setSaveSignature,
  isTabPanelSelected,
}) => {
  const fonts = useSelector(state => selectors.getSignatureFonts(state));
  const [value, setValue] = useState(core.getCurrentUser());
  const [activeIndex, setActiveIndex] = useState(0);
  const canvasesRef = useRef([]);

  useEffect(() => {
    // this can happen when an user added a new signature font, select it and then removed it
    // in this case we just assume there's at least one font and set the active index to 0
    if (activeIndex >= fonts.length) {
      setActiveIndex(0);
    }
  }, [activeIndex, fonts]);

  useEffect(() => {
    const signatureTool = core.getTool('AnnotationCreateSignature');

    if (isModalOpen && isTabPanelSelected) {
      _setSaveSignature(!!value);

      if (value) {
        signatureTool.setSignature(
          canvasesRef.current[activeIndex].toDataURL(),
        );
      } else {
        signatureTool.setSignature(null);
      }
    }
  }, [_setSaveSignature, isTabPanelSelected, activeIndex, value, isModalOpen]);

  const handleInputChange = e => {
    const value = e.target.value;
    setValue(value);
  };

  return (
    <div className="text-signature">
      <input
        className="text-signature-input"
        type="text"
        value={value}
        onChange={handleInputChange}
      />
      <div className="text-signature-wrapper">
        <div className="text-signature-container">
          {fonts.map((font, index) => (
            <div
              key={font}
              className={classNames({
                'text-signature-canvas-container': true,
                active: index === activeIndex,
              })}
            >
              <div className="text-signature-background" />
              <Canvas
                ref={el => {
                  canvasesRef.current[index] = el;
                }}
                text={value}
                font={font}
                onSelect={() => setActiveIndex(index)}
                isTabPanelSelected={isTabPanelSelected}
              />
            </div>
          ))}
        </div>
      </div>
      <FontHandler fonts={fonts} />
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;

const Canvas = React.forwardRef(
  ({ text, font, onSelect, isTabPanelSelected }, forwardedRef) => {
    const canvasRef = useRef();

    useEffect(() => {
      // the panel has display: none when it's not selected, which will affect the canvas size
      // so we resize the canvas whenever this panel is selected
      const canvas = canvasRef.current;

      if (isTabPanelSelected && canvas) {
        const { width, height } = canvas.getBoundingClientRect();
        canvas.width = width;
        canvas.height = height;

        // when a canvas's width and height are both 0, changing the value of ctx.font won't actually apply the font
        // so here we set the font and then redraw the text every time the tab is selected, since this is when a canvas's size can change
        setFont();
        drawTextSignature();
      }
    }, [isTabPanelSelected, drawTextSignature, setFont]);

    useEffect(() => setFont(), [font, setFont]);

    useEffect(() => drawTextSignature(), [text, drawTextSignature]);

    const setFont = useCallback(() => {
      const canvas = canvasRef.current;
      const multiplier = window.utils.getCanvasMultiplier();
      const fontSize = `${100 * multiplier}px`;
      const { width, height } = canvas.getBoundingClientRect();
      canvas.width = width * multiplier;
      canvas.height = height * multiplier;

      const ctx = canvas.getContext('2d');

      ctx.font = `${fontSize} ${font}`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
    }, [font]);

    const drawTextSignature = useCallback(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const { width, height } = canvas;

      ctx.fillStyle = '#000';
      ctx.clearRect(0, 0, width, height);
      ctx.fillText(text, width / 2, height / 2, width);
    }, [text]);

    const handleClick = () => {
      const signatureTool = core.getTool('AnnotationCreateSignature');
      if (text) {
        signatureTool.setSignature(canvasRef.current.toDataURL());
      } else {
        signatureTool.annot = null;
      }

      onSelect();
    };

    return (
      <canvas
        ref={el => {
          canvasRef.current = el;
          forwardedRef(el);
        }}
        onClick={handleClick}
      />
    );
  },
);

Canvas.propTypes = {
  text: PropTypes.string.isRequired,
  font: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  isTabPanelSelected: PropTypes.bool,
};
