import React, {
  useState, useEffect, useRef,
} from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';

import './TypeCanvas.scss';

const propTypes = {
  setSaveSignature: PropTypes.func.isRequired,
};

const TypeCanvas = ({ setSaveSignature }) => {
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
    <div className="type-signature">
      <input
        className="type-signature-input"
        type="text"
        value={value}
        onChange={handleInputChange}
      />
      <div className="type-signature-container">
        {fonts.map((font, index) => (
          <Canvas
            key={font}
            text={value}
            font={font}
            isActive={index === activeIndex}
            onSelect={() => setActiveIndex(index)}
          />
        ))}
      </div>
    </div>
  );
};

TypeCanvas.propTypes = propTypes;

export default TypeCanvas;

const Canvas = ({
  text, font, isActive, onSelect,
}) => {
  const signatureTool = core.getTool('AnnotationCreateSignature');
  const canvasRef = useRef();
  const fontSize = '30px';

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    ctx.font = `${fontSize} ${font}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const { width, height } = canvas;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f8f8f8';
    ctx.fillRect(0, 0, width, height);

    ctx.fillStyle = '#000';
    ctx.fillText(text, width / 2, height / 2);
  }, [text]);

  const handleClick = () => {
    onSelect();
    signatureTool.setSignature(canvasRef.current.toDataURL());
  };

  return (
    <canvas
      className={classNames({
        active: isActive,
      })}
      ref={canvasRef}
      onClick={handleClick}
    />
  );
};
