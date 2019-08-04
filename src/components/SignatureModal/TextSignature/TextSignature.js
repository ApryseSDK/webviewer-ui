import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';

import './TextSignature.scss';

const propTypes = {
  setSaveSignature: PropTypes.func.isRequired,
};

const TextSignature = ({ setSaveSignature }) => {
  const [value, setValue] = useState(core.getCurrentUser());
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    setSaveSignature(!!value);
  }, [value]);

  const handleInputChange = e => {
    const value = e.target.value;
    setValue(value);
  };

  const fonts = ['Comic Sans MS', 'Garamond', 'Palatino', 'Courier'];

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
          <div key={font} className={classNames({
            'text-signature-canvas-container': true,
            active: index === activeIndex,
          })}
          >
            <div className="text-signature-background" />
            <Canvas
              text={value}
              font={font}
              onSelect={() => setActiveIndex(index)}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

TextSignature.propTypes = propTypes;

export default TextSignature;

const Canvas = ({
  text, font, onSelect,
}) => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const canvasRef = useRef();
  const fontSize = '30px';

  useEffect(() => {
    const canvas = canvasRef.current;
    const { width, height } = canvas.getBoundingClientRect();
    // TODO: get canvas multiplier?
    canvas.width = width;
    canvas.height = height;

    const ctx = canvas.getContext('2d');

    ctx.font = `${fontSize} ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.fillStyle = '#000';
    ctx.clearRect(0, 0, width, height);
    ctx.fillText(text, width / 2, height / 2);
  }, [text]);

  const handleClick = () => {
    onSelect();
    signatureTool.setSignature(canvasRef.current.toDataURL());
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
    />
  );
};
