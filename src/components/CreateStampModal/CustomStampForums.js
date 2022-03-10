import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './CustomStampForums.scss';
import ColorPalette from 'components/ColorPalette';
import Choice from '../Choice/Choice';
import { useSelector } from 'react-redux';
import selectors from 'selectors';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const COLOR_CHOICES = window.Core.Tools.RubberStampCreateTool['FILL_COLORS'];
const DEFAULT_COLOR = new window.Annotations.Color(COLOR_CHOICES[0]);

const CustomStampForums = ({ state, setState, closeModal, createCustomStamp, setEmptyInput }) => {
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
  const userName = useSelector(state => selectors.getUserName(state));

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
    setEmptyInput(!value);
    updateCanvas(value, timestampFormat, colorInput);
  };
  const handleColorInputChange = (property, value) => {
    setColorInput(value);
    updateCanvas(stampTextInputValue, timestampFormat, value);
  };

  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat, colorInput);
  }, [userName]);

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
      <div className="canvas-colorpalette-container">
        <div className="canvas-container" ref={canvasContainerRef}>
          <div className="canvas-holder">
            <canvas
              className="custom-stamp-canvas"
              ref={canvasRef}
            />
          </div>
        </div>
        <div className="colorpalette-container">
          <ColorPalette
              color={colorInput}
              property="StrokeColor"
              onStyleChange={handleColorInputChange}
              overridePalette2={COLOR_CHOICES}
          />
        </div>
      </div>
      <div className="stamp-input-container">
        <div className="stamp-label"> {stampInputLabel} </div>
        <input
          className="text-customstamp-input"
          ref={inputRef}
          type="text"
          aria-label={stampInputLabel.substring(0, stampInputLabel.length - 1)}
          value={stampTextInputValue}
          onChange={handleInputChange}
        />
      </div>

      <div className="timestamp-container">
        <div className="stamp-sublabel"> {t('option.customStampModal.timestampText')} </div>
        <div className="timeStamp-choice">
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
      </div>
      {
        !stampTextInputValue
        && (
          <div className='empty-stamp-input'>
            {t('message.emptyCustomStampInput')}
          </div>
        )
      }
    </div>
  );
};

export default CustomStampForums;
