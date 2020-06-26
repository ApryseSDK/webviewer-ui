import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './CustomStampForums.scss';
import ColorPalette from 'components/ColorPalette';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const COLOR_CHOICES = window.Tools.RubberStampCreateTool['FILL_COLORS'];
const DEFAULT_COLOR =  new window.Annotations.Color(COLOR_CHOICES[0]);

const CustomStampForums = ({ state, setState, closeModal, createDynamicStamp }) => {
  const [currentUser] = useState(core.getCurrentUser());
  const [stampTextInputValue, setStampText] = useState('Draft');
  const [t] = useTranslation();
  const [formatInput, setFormatInput] = useState(false);
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR);
  const stampTool = core.getTool(TOOL_NAME);
  const timestampOptions =  window.Tools.RubberStampCreateTool['TIMESTAMP_CHOICHES'];

  const [timestampFormat, setTimestampFormat] = useState(timestampOptions[0].value);

  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const inputRef = useRef();
  const customFormatInputRef = useRef();

  const updateCanvas = (title, subtitle, color) => {
    const parameters = {
      canvas: canvasRef.current,
      title,
      subtitle,
      width: 300,
      height: 100,
      color,
      canvasParent: canvasContainerRef.current,
    };

    const width = stampTool.drawDynamicStamp(parameters);
    const dataURL = canvasRef.current.toDataURL();

    setState({
      ...state,
      width,
      title,
      color,
      subtitle,
      height: parameters.height,
      dataURL,
    });
  };

  const handleInputChange = e => {
    const value = e.target.value || '';
    setStampText(value);
    updateCanvas(value, timestampFormat, colorInput);
  };
  const handleColorInputChange = (property, value) => {
    setColorInput(value);
    updateCanvas(stampTextInputValue, timestampFormat, value);
  };

  const handleCustomTimeFormat = e => {
    setTimestampFormat(e.target.value);
    updateCanvas(stampTextInputValue, e.target.value, colorInput);
  };

  const changeTimeMode = () => {
    setFormatInput(false);
  };

  const changeFormat = e => {
    const value = e.target.value;
    if (value === 'other') {
      setFormatInput(true);
    } else {
      setFormatInput(false);
      setTimestampFormat(value);
      updateCanvas(stampTextInputValue, value);
    }
  };

  const isEnabled = (formatInput);
  useEffect(() => {
    if (isEnabled) {
      customFormatInputRef.current.focus();
    }
  }, [isEnabled]);

  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat);
  }, []);


  let formatDropdownElement = null;
  if (!formatInput) {
    formatDropdownElement = <div className="StyleOption" style={{ width: '60%', alignSelf: 'center' }}>
      <select
        className="styles-input"
        value={timestampFormat}
        onChange={changeFormat}
        style={{ textTransform: 'none', width: '100%' }}
      >
        {timestampOptions.map(item => {
          return (<option key={item.id} value={item.value}>{item.value}</option>);
        })}
      </select>
    </div>;
  }
  let formatInputElement = null;
  if (formatInput) {
    formatInputElement = <div style={{ width: '60%', alignSelf: 'center' }}>
      <input style={{ width: '100%' }}
        className="text-customstamp-input"
        ref={customFormatInputRef}
        type="text"
        value={timestampFormat}
        onChange={handleCustomTimeFormat}
      />
    </div>;
  }

  let cancelBtn = null;
  if (formatInputElement) {
    cancelBtn = <div style={{ width: '20%', alignSelf: 'center', textAlign: 'end' }}>
      <button onClick={() => changeTimeMode()} style={{ margin:0 }}>{t('action.cancel')}</button>
    </div>;
  }

  return (
    <div className="text-customstamp">

      <div className="canvas-container" ref={canvasContainerRef}>
        <div className="canvas-holder">
          <canvas
            className="custom-stamp-canvas"
            ref={canvasRef}
          />
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.stampText')} </div>
        <input style={{ width: '80%' }}
          className="text-customstamp-input"
          ref={inputRef}
          type="text"
          value={stampTextInputValue}
          onChange={handleInputChange}
        />
      </div>

      <div style={{ marginTop: 10, marginBottom: 8, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.timestampText')} </div>
        {formatDropdownElement}
        {formatInputElement}
        {cancelBtn}
      </div>
      <div className="divider-horizontal"></div>
      <div className="footer">
        <div className="stamp-close" onClick={closeModal}>
          {t('action.cancel')}
        </div>
        <ColorPalette
          color={colorInput}
          property="StrokeColor"
          onStyleChange={handleColorInputChange}
          overridePalette2={COLOR_CHOICES}
        />
        <div className="stamp-create" onClick={createDynamicStamp}>
          {t('action.create')}
        </div>
      </div>

    </div>
  );
};

export default CustomStampForums;
