import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSelector } from 'react-redux';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import core from 'core';
import { isIOS } from 'helpers/device';
import selectors from 'selectors';
import './CustomStampForums.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';



const CustomStampForums = ({ state, setState }) => {
  const [currentUser] = useState(core.getCurrentUser());
  const [stampTextInputValue, setStampText] = useState('DRAFT');
  const [dateCheckbox, setDateCheckbox] = useState(true);
  const [timeCheckbox, setTimeCheckbox] = useState(true);
  const [timeMode, setTimeMode] = useState(true);

  const [formatInput, setFormatInout] = useState(false);
  const stampTool = core.getTool(TOOL_NAME);
  const [timestampFormat, setTimestampFormat] = useState('DD/MM/YYYY, h:mm a');

  const timestampOptions = [
    { id: '1', value: 'DD/MM/YYYY, h:mm a' },
    { id: '2', value: '[By $currentUser at] h:mm a, MMMM D, YYYY' },
    { id: '3', value: '[By $currentUser on] MMMM Do, YYYY' },
    { id: '4', value: 'MMMM D, YYYY, h:mm a' },
    { id: '5', value: 'other' },
  ];

  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const inputRef = useRef();
  const customFormatInputRef = useRef();

  const updateCanvas = (title, subtitle) => {

    var parameters = {
      canvas: canvasRef.current,
      title,
      subtitle: stampTool.formatMoment(subtitle.replace('$currentUser', currentUser)),
      defaultWidth: 300,
      defaultHeight: 100,
      container: canvasContainerRef.current,
    };
    const width = stampTool.drawDynamicStamp(parameters);
    var dataURL = canvasRef.current.toDataURL();
    setState({
      ...state,
      width,
      title,
      subtitle,
      height: parameters.defaultHeight,
      dataURL,
    });
  };

  const handleInputChange = e => {
    let value = e.target.value || '';
    value = value.toUpperCase();
    setStampText(value);
    updateCanvas(value, timestampFormat);
  };

  const handleDateInputChange = () => {
    setDateCheckbox(!dateCheckbox);
  };

  const handleTimeInputChange = () => {
    setTimeCheckbox(!timeCheckbox);
  };

  const handleCustomTimeFormat = e => {
    setTimestampFormat(e.target.value);
    updateCanvas(stampTextInputValue, e.target.value);
  };

  const changeTimeMode = () => {
    if (timeMode === false) {
      setFormatInout(false);
      setTimestampFormat(timestampOptions[0].value);
    }
    setTimeMode(!timeMode);
  };

  const changeFormat = e => {
    const value = e.target.value;
    if (value === 'other') {
      setFormatInout(true);
    } else {
      setFormatInout(false);
      setTimestampFormat(value);
      updateCanvas(stampTextInputValue, value);
    }
  };

  const isEnabled = (timeMode && formatInput);
  useEffect(() => {
    if (isEnabled) {
      customFormatInputRef.current.focus();
    }
  }, [isEnabled]);

  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat);
  }, []);

  const btnLabel = (!timeMode) ? 'Custom' : 'Cancel';
  let dateCheckboxElement = null;
  let timeCheckboxElement = null;

  if (!timeMode) {
    dateCheckboxElement = <div className="custom-checkbox" style={{ width: '20%', alignSelf: 'center' }}>
      <input
        id="default-date"
        type="checkbox"
        checked={dateCheckbox}
        onChange={handleDateInputChange}
      />
      <label htmlFor="default-date">Date</label>
    </div>;

    timeCheckboxElement = <div className="custom-checkbox" style={{ width: '40%', alignSelf: 'center' }}>
      <input
        id="default-time"
        type="checkbox"
        checked={timeCheckbox}
        onChange={handleTimeInputChange}
      />
      <label htmlFor="default-time">Time</label>
    </div>;
  }

  let formatDropdownElement = null;
  if (timeMode && !formatInput) {
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
  if (timeMode && formatInput) {
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
        <div style={{ width: '20%', alignSelf: 'center' }}> Stamp text: </div>
        <input style={{ width: '80%' }}
          className="text-customstamp-input txt-uppercase"
          ref={inputRef}
          type="text"
          value={stampTextInputValue}
          onChange={handleInputChange}
        />
      </div>

      <div style={{ marginTop: 10, display: 'flex' }}>
        <div style={{ width: '20%', alignSelf: 'center' }}> Timestamp text: </div>
        {dateCheckboxElement}
        {timeCheckboxElement}
        {formatDropdownElement}
        {formatInputElement}
        <div style={{ width: '20%', alignSelf: 'center', textAlign: 'end' }}>
          <button onClick={() => changeTimeMode()} style={{ margin:0 }}>{btnLabel}</button>
        </div>
        {/* <input style={{ width: '80%' }}
          className="text-customstamp-input"
          ref={timestampInputRef}
          type="text"
          value={timestampTextInputValue}
          onChange={handleTimestampInputChange}
        /> */}
      </div>

    </div>
  );
};

export default CustomStampForums;
