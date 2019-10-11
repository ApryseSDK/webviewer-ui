import React, { useState, useEffect, useRef } from 'react';
import { useSelector, shallowEqual } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';
import selectors from 'selectors';

import './TextSignature.scss';

const propTypes = {
  _setSaveSignature: PropTypes.func.isRequired,
};

const TextSignature = ({ _setSaveSignature }) => {
  const fonts = useSelector(
    state => selectors.getSignatureFonts(state),
    shallowEqual,
  );
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

    _setSaveSignature(!!value);

    if (value) {
      signatureTool.setSignature(canvasesRef.current[activeIndex].toDataURL());
    } else {
      signatureTool.annot = null;
    }
  }, [_setSaveSignature, activeIndex, value]);

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
              text={value}
              font={font}
              onSelect={() => setActiveIndex(index)}
              ref={el => {
                canvasesRef.current[index] = el;
              }}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;

const Canvas = React.forwardRef(({ text, font, onSelect }, forwardedRef) => {
  const canvasRef = useRef();

  useEffect(() => {
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

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, width, height);
    ctx.fillText(text, width / 2, height / 2);
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
});

Canvas.propTypes = {
  text: PropTypes.string.isRequired,
  font: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
};
