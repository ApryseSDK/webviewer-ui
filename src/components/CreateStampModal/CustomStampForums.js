import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './CustomStampForums.scss';
import ColorPalette from 'components/ColorPalette';
import Choice from '../Choice/Choice';


const TOOL_NAME = 'AnnotationCreateRubberStamp';
const COLOR_CHOICES = window.Tools.RubberStampCreateTool['FILL_COLORS'];
const DEFAULT_COLOR =  new window.Annotations.Color(COLOR_CHOICES[0]);

const CustomStampForums = ({ state, setState, closeModal, createCustomStamp }) => {
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

  const [stampTextInputValue, setStampText] = useState('Draft');
  const [t] = useTranslation();
  const [colorInput, setColorInput] = useState(DEFAULT_COLOR);
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
      width: 300,
      height: 100,
      color,
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
  const handleColorInputChange = (property, value) => {
    setColorInput(value);
    updateCanvas(stampTextInputValue, timestampFormat, value);
  };

  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat, colorInput);
  }, []);

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

  const stampInputLabel = t('option.customStampModal.stampText');

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
        <div className="stamp-label" style={{ width: '20%', alignSelf: 'center' }}> {stampInputLabel} </div>
        <input
          className="text-customstamp-input"
          ref={inputRef}
          type="text"
          aria-label={stampInputLabel.substring(0, stampInputLabel.length - 1)}
          value={stampTextInputValue}
          onChange={handleInputChange}
        />
      </div>

      <div style={{ marginTop: 10, marginBottom: 8, display: 'flex' }}>
        <div className="stamp-sublabel" style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.timestampText')} </div>
        <Choice
          id="default-username"
          checked={usernameCheckbox}
          onChange={handleUsernameCheckbox}
          label={t('option.customStampModal.Username')}
        />
        <Choice
          id="default-date"
          checked={dateCheckbox}
          onChange={handleDateInputChange}
          label={t('option.customStampModal.Date')}
        />
        <Choice
          id="default-time-input"
          checked={timeCheckbox}
          onChange={handleTimeInputChange}
          label={t('option.customStampModal.Time')}
        />
      </div>
      <div className="divider-horizontal"></div>
      <div className="footer">
        <button className="stamp-close" onClick={closeModal}>
          {t('action.cancel')}
        </button>
        <ColorPalette
          color={colorInput}
          property="StrokeColor"
          onStyleChange={handleColorInputChange}
          overridePalette2={COLOR_CHOICES}
        />
        <button className="stamp-create" onClick={createCustomStamp}>
          {t('action.create')}
        </button>
      </div>

    </div>
  );
};

export default CustomStampForums;
