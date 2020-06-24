import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import core from 'core';
import './CustomStampForums.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';


const CustomStampForums = ({ state, setState }) => {
  const [currentUser] = useState(core.getCurrentUser());
  const [stampTextInputValue, setStampText] = useState('DRAFT');
  const [t] = useTranslation();
  const [formatInput, setFormatInput] = useState(false);
  const stampTool = core.getTool(TOOL_NAME);
  const timestampOptions = [
    { id: '1', value: 'DD/MM/YYYY, h:mm a' },
    { id: '2', value: '[By $currentUser at] h:mm a, MMMM D, YYYY' },
    { id: '3', value: '[By $currentUser on] MMMM Do, YYYY' },
    { id: '4', value: 'MMMM D, YYYY, h:mm a' },
    { id: '5', value: 'other' },
  ];
  const [timestampFormat, setTimestampFormat] = useState(timestampOptions[0].value);

  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const inputRef = useRef();
  const customFormatInputRef = useRef();

  const updateCanvas = (title, subtitle) => {

    var parameters = {
      canvas: canvasRef.current,
      title,
      subtitle: stampTool.formatMoment(subtitle.replace('$currentUser', currentUser)),
      width: 300,
      height: 100,
      canvasParent: canvasContainerRef.current,
    };

    const width = stampTool.drawDynamicStamp(parameters);
    var dataURL = canvasRef.current.toDataURL();
    setState({
      ...state,
      width,
      title,
      subtitle,
      height: parameters.height,
      dataURL,
    });
  };

  const handleInputChange = e => {
    let value = e.target.value || '';
    value = value.toUpperCase();
    setStampText(value);
    updateCanvas(value, timestampFormat);
  };

  const handleCustomTimeFormat = e => {
    setTimestampFormat(e.target.value);
    updateCanvas(stampTextInputValue, e.target.value);
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
          className="text-customstamp-input txt-uppercase"
          ref={inputRef}
          type="text"
          value={stampTextInputValue}
          onChange={handleInputChange}
        />
      </div>

      <div style={{ marginTop: 10, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> {t('option.customStampModal.timestampText')} </div>
        {formatDropdownElement}
        {formatInputElement}
        {cancelBtn}
      </div>

    </div>
  );
};

export default CustomStampForums;