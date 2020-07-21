import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './CustomStampForums.scss';
import ColorPalette from 'components/ColorPalette';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const COLOR_CHOICES = window.Tools.RubberStampCreateTool['FILL_COLORS'];
const DEFAULT_COLOR =  new window.Annotations.Color(COLOR_CHOICES[0]);

const CustomStampForums = ({ state, setState }) => {
  const updateTimestampLabel = (usernameChk, dateChk, timeChk) => {
    let tmpText = '';
    if (usernameChk) {
      tmpText += '[$currentUser] ';
    }
    if (dateChk) {
      tmpText += 'DD/MM/YYYY ';
    }

    if (timeChk) {
      tmpText += 'h:mm a';
    }
    return tmpText;
  };

  const [usernameCheckbox, setUsernameCheckbox] = useState(true);
  const [dateCheckbox, setDateCheckbox] = useState(true);
  const [timeCheckbox, setTimeCheckbox] = useState(true);

  const [colorInput, setColorInput] = useState(DEFAULT_COLOR);

  const [stampTextInputValue, setStampText] = useState('DRAFT');
  const [t] = useTranslation();
  const stampTool = core.getTool(TOOL_NAME);

  const txt = updateTimestampLabel(usernameCheckbox, dateCheckbox, timeCheckbox);
  const [timestampFormat, setTimestampFormat] = useState(txt);

  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const inputRef = useRef();

  const updateCanvas = (title, subtitle, color) => {
    const parameters = {
      canvas: canvasRef.current,
      title,
      subtitle,
      color,
      width: 300,
      height: 100,
      canvasParent: canvasContainerRef.current,
    };

    const width = stampTool.drawCustomStamp(parameters);
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


  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat, colorInput);
  }, []);


  const handleColorInputChange = (property, value) => {
    setColorInput(value);
    updateCanvas(stampTextInputValue, timestampFormat, value);
  };

  const handleDateInputChange = () => {
    setDateCheckbox(!dateCheckbox);
    const txt = updateTimestampLabel(usernameCheckbox, !dateCheckbox, timeCheckbox);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt, colorInput);
  };

  const handleTimeInputChange = () => {
    setTimeCheckbox(!timeCheckbox);
    const txt = updateTimestampLabel(usernameCheckbox, dateCheckbox, !timeCheckbox);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt, colorInput);
  };

  const handleUsernameCheckbox = () => {
    setUsernameCheckbox(!usernameCheckbox);
    const txt = updateTimestampLabel(!usernameCheckbox, dateCheckbox, timeCheckbox);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt, colorInput);
  };

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

      <div style={{ marginTop: 10, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.timestampText')} </div>
        <div className="custom-checkbox" data-element="usernameButton">
          <input
            id="default-username"
            type="checkbox"
            checked={usernameCheckbox}
            onChange={handleUsernameCheckbox}
          />
          <label htmlFor="default-username">
            {t('option.customStampModal.Username')}
          </label>
        </div>

        <div className="custom-checkbox" data-element="dateButton">
          <input
            id="default-date"
            type="checkbox"
            checked={dateCheckbox}
            onChange={handleDateInputChange}
          />
          <label htmlFor="default-date">
            {t('option.customStampModal.Date')}
          </label>
        </div>

        <div className="custom-checkbox" data-element="timeButton">
          <input
            id="default-time"
            type="checkbox"
            checked={timeCheckbox}
            onChange={handleTimeInputChange}
          />
          <label htmlFor="default-time">
            {t('option.customStampModal.Time')}
          </label>
        </div>
      </div>

      <div style={{ marginTop: 10, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.stampColor')} </div>
        <ColorPalette
          color={colorInput}
          onStyleChange={handleColorInputChange}
          colorMapKey="customStamp"
          property="TextColor"
        />
      </div>

    </div>
  );
};

export default CustomStampForums;
