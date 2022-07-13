import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import Choice from 'components/Choice';
import Dropdown from 'components/Dropdown';
import Button from 'components/Button';
import Icon from 'components/Icon';
import ColorPalettePicker from 'components/ColorPalettePicker/ColorPalettePicker'; // ColorPalletPicker inner import required as we are not using the redux outer container
import Events from 'constants/events';
import PropTypes from 'prop-types';

import './CustomStampForums.scss';

const FALLBACK_DATE_TIME_FORMAT = {
  date: 'MM/DD/YYYY',
  time: 'hh:mm A',
  timeFirst: false,
};

const dateTimeFormatToString = (format, useDate = true, useTime = true) => {
  if (!useDate) {
    if (!format.time) {
      return '';
    }
    return format.time;
  }
  if (!useTime) {
    if (!format.date) {
      return '';
    }
    return format.date;
  }
  return format.timeFirst ?
    `${format.time} ${format.date}` :
    `${format.date} ${format.time}`;
};

const propTypes = {
  state: PropTypes.object,
  setState: PropTypes.func,
  setEmptyInput: PropTypes.func,
  fonts: PropTypes.array,
  openColorPicker: PropTypes.func,
  getCustomColorAndRemove: PropTypes.func,
  openDeleteModal: PropTypes.func,
  dateTimeFormats: PropTypes.array,
  stampTool: PropTypes.object,
  userName: PropTypes.string,
};

const CustomStampForums = ({
  state,
  setState,
  setEmptyInput,
  fonts,
  openColorPicker,
  getCustomColorAndRemove,
  openDeleteModal,
  dateTimeFormats,
  stampTool,
  userName,
}) => {
  const updateTimestampLabel = (usernameChk, dateChk, dateTime) => {
    let tmpText = '';
    if (usernameChk) {
      tmpText += '[$currentUser] ';
    }
    if (dateChk) {
      tmpText += dateTime;
    }
    return tmpText;
  };

  const defaultDateTimeFormat = dateTimeFormats && dateTimeFormats[0] ? dateTimeFormats[0] : FALLBACK_DATE_TIME_FORMAT;
  const [dateTime, setDateTime] = useState(dateTimeFormatToString(defaultDateTimeFormat));
  const [usernameCheckbox, setUsernameCheckbox] = useState(true);
  const [dateCheckbox, setDateCheckbox] = useState(true);
  const [timeCheckbox, setTimeCheckbox] = useState(true);

  const [stampTextInputValue, setStampText] = useState('Draft');
  const [t] = useTranslation();

  const txt = updateTimestampLabel(usernameCheckbox, dateCheckbox, dateTime);
  const [timestampFormat, setTimestampFormat] = useState(txt);

  const canvasRef = useRef();
  const canvasContainerRef = useRef();
  const inputRef = useRef();

  const updateCanvas = (title, subtitle, newState = state) => {
    const parameters = {
      canvas: canvasRef.current,
      title,
      subtitle,
      width: 300,
      height: 100,
      color: newState.color,
      textColor: newState.textColor,
      canvasParent: canvasContainerRef.current,
      font: newState.font,
      bold: newState.bold,
      italic: newState.italic,
      underline: newState.underline,
      strikeout: newState.strikeout,
    };

    const width = stampTool.drawCustomStamp(parameters);
    const dataURL = canvasRef.current.toDataURL();

    setState({
      ...newState,
      width,
      title,
      subtitle,
      height: parameters.height,
      dataURL,
    });
  };

  const handleInputChange = e => {
    const value = e.target.value || '';
    setStampText(value);
    setEmptyInput(!value);
    updateCanvas(value, timestampFormat);
  };

  useEffect(() => {
    updateCanvas(stampTextInputValue, timestampFormat, state);
  }, [userName]);

  const handleDateCheckboxChange = () => {
    setDateCheckbox(!dateCheckbox);
    const newDateTime = dateTimeFormatToString(defaultDateTimeFormat, !dateCheckbox, timeCheckbox);
    setDateTime(newDateTime);
    const txt = updateTimestampLabel(usernameCheckbox, (!dateCheckbox || timeCheckbox), newDateTime);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt);
  };

  const handleTimeCheckboxChange = () => {
    setTimeCheckbox(!timeCheckbox);
    const newDateTime = dateTimeFormatToString(defaultDateTimeFormat, dateCheckbox, !timeCheckbox);
    setDateTime(newDateTime);
    const txt = updateTimestampLabel(usernameCheckbox, (dateCheckbox || !timeCheckbox), newDateTime);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt);
  };

  const handleUsernameCheckbox = () => {
    setUsernameCheckbox(!usernameCheckbox);
    const txt = updateTimestampLabel(!usernameCheckbox, dateCheckbox, dateTime);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt);
  };

  const handleFontChange = font => {
    updateCanvas(stampTextInputValue, timestampFormat, {
      ...state,
      font,
    });
  };

  const onDateFormatChange = newFormat => {
    setDateTime(newFormat);
    const txt = updateTimestampLabel(usernameCheckbox, (dateCheckbox || timeCheckbox), newFormat);
    setTimestampFormat(txt);
    updateCanvas(stampTextInputValue, txt);
  };

  const handleRichTextStyleChange = style => {
    updateCanvas(stampTextInputValue, timestampFormat, {
      ...state,
      [style]: !state[style],
    });
  };

  const toggleBold = () => handleRichTextStyleChange('bold');
  const toggleItalic = () => handleRichTextStyleChange('italic');
  const toggleStrikeout = () => handleRichTextStyleChange('strikeout');
  const toggleUnderline = () => handleRichTextStyleChange('underline');

  const stampInputLabel = t('option.customStampModal.stampText');

  const getHexColor = givenColor => {
    if (givenColor && givenColor.A) {
      return givenColor.toHexString().toLowerCase();
    }
    return '#000000';
  };
  const openPicker = (addNew, type) => {
    const isText = type === 'text';
    openColorPicker();
    const handleVisiblityChanged = e => {
      const { element, isVisible } = e.detail;
      if (element === 'ColorPickerModal' && !isVisible) {
        const color = getCustomColorAndRemove();
        if (color) {
          const colorToBeAdded = getHexColor(color);
          isText ? setTextColor(colorToBeAdded) : setBackgroundColor(colorToBeAdded);
          const toolColors = window.Core.Tools.RubberStampCreateTool[isText ? 'TEXT_COLORS' : 'FILL_COLORS'];
          toolColors.push(colorToBeAdded);
          isText ? setTextColors(toolColors) : setBackgroundColors(toolColors);
          state = {
            ...state,
            [isText ? 'textColor' : 'color']: colorToBeAdded,
          };
          updateCanvas(stampTextInputValue, timestampFormat, state);
        }
      }
      window.instance.UI.removeEventListener(Events.VISIBILITY_CHANGED, handleVisiblityChanged);
    };
    window.instance.UI.addEventListener(Events.VISIBILITY_CHANGED, handleVisiblityChanged);
  };
  const deleteColor = type => {
    const isText = type === 'text';
    openDeleteModal(() => {
      const newColors = isText ?
        textColors.filter(color => color !== textColorToBeDeleted) :
        backgroundColors.filter(color => color !== backgroundColorToBeDeleted);
      isText ? setTextColors(newColors) : setBackgroundColors(newColors);
      isText ? setTextColorToBeDeleted(null) : setBackgroundColorToBeDeleted(null);
      window.Core.Tools.RubberStampCreateTool[isText ? 'TEXT_COLORS' : 'FILL_COLORS'] = newColors;
    });
  };

  const [backgroundColors, setBackgroundColors] = useState(window.Core.Tools.RubberStampCreateTool['FILL_COLORS']);
  const [backgroundColor, setBackgroundColor] = useState(window.Core.Tools.RubberStampCreateTool['FILL_COLORS'][0]);
  const [backgroundColorToBeDeleted, setBackgroundColorToBeDeleted] = useState(null);

  const [textColors, setTextColors] = useState(window.Core.Tools.RubberStampCreateTool['TEXT_COLORS']);
  const [textColor, setTextColor] = useState(window.Core.Tools.RubberStampCreateTool['TEXT_COLORS'][0]);
  const [textColorToBeDeleted, setTextColorToBeDeleted] = useState(null);

  const openColorPickerText = addNew => openPicker(addNew, 'text');
  const handleTextColorChange = newColor => {
    setTextColor(newColor);
    state = {
      ...state,
      textColor: newColor,
    };
    updateCanvas(stampTextInputValue, timestampFormat, state);
  };
  const handleTextColorDelete = () => deleteColor('text');

  const openColorPickerBackground = addNew => openPicker(addNew, 'fill');
  const handleBackgroundColorChange = newColor => {
    setBackgroundColor(newColor);
    state = {
      ...state,
      color: newColor,
    };
    updateCanvas(stampTextInputValue, timestampFormat, state);
  };
  const handleBackgroundColorDelete = () => deleteColor('fill');

  const formatsList = dateTimeFormats ? dateTimeFormats : [FALLBACK_DATE_TIME_FORMAT];
  const dateTimeDropdownItems = Array.from(new Set(
    formatsList.map(format => dateTimeFormatToString(format, dateCheckbox, timeCheckbox))
  )).filter(format => format !== '');

  return (
    <div className="text-customstamp">
      <div className="canvas-container" ref={canvasContainerRef}>
        <canvas
          className="custom-stamp-canvas"
          ref={canvasRef}
        />
      </div>
      <div className="scroll-container">
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
          {
            !stampTextInputValue
            && (
              <div className="empty-stamp-input">
                {t('message.emptyCustomStampInput')}
              </div>
            )
          }
        </div>
        <div className="font-container">
          <div className="stamp-sublabel"> {t('option.customStampModal.fontStyle')} </div>
          <div className="font-inner-container">
            <Dropdown
              items={fonts}
              onClickItem={handleFontChange}
              currentSelectionKey={state.font || fonts[0]}
              isFont
            />
            <Button
              dataElement="stampTextBoldButton"
              onClick={toggleBold}
              img="icon-menu-bold"
              title="option.richText.bold"
              isActive={state.bold}
            />
            <Button
              dataElement="stampTextItalicButton"
              onClick={toggleItalic}
              img="icon-menu-italic"
              title="option.richText.italic"
              isActive={state.italic}
            />
            <Button
              dataElement="stampTextUnderlineButton"
              onClick={toggleUnderline}
              img="icon-menu-text-underline"
              title="option.richText.underline"
              isActive={state.underline}
            />
            <Button
              dataElement="stampTextStrikeoutButton"
              onClick={toggleStrikeout}
              img="icon-tool-text-manipulation-strikethrough"
              title="option.richText.strikeout"
              isActive={state.strikeout}
            />
          </div>
        </div>
        <div className="color-container">
          <div className="stamp-sublabel">{t('option.customStampModal.textColor')}</div>
          <div className="colorpalette-container">
            <ColorPalettePicker
              getHexColor={getHexColor}
              color={textColor}
              setColorToBeDeleted={setTextColorToBeDeleted}
              colorToBeDeleted={textColorToBeDeleted}
              customColors={textColors}
              onStyleChange={setTextColor}
              handleColorOnClick={handleTextColorChange}
              handleOnClick={handleTextColorChange}
              openColorPicker={openColorPickerText}
              openDeleteModal={handleTextColorDelete}
              disableTitle
              enableEdit
              colorsAreHex
            />
          </div>
        </div>
        <div className="color-container">
          <div className="stamp-sublabel">{t('option.customStampModal.backgroundColor')}</div>
          <div className="colorpalette-container">
            <ColorPalettePicker
              getHexColor={getHexColor}
              color={backgroundColor}
              setColorToBeDeleted={setBackgroundColorToBeDeleted}
              colorToBeDeleted={backgroundColorToBeDeleted}
              customColors={backgroundColors}
              onStyleChange={setBackgroundColor}
              handleColorOnClick={handleBackgroundColorChange}
              handleOnClick={handleBackgroundColorChange}
              openColorPicker={openColorPickerBackground}
              openDeleteModal={handleBackgroundColorDelete}
              disableTitle
              enableEdit
              colorsAreHex
            />
          </div>
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
              onChange={handleDateCheckboxChange}
              label={t('option.customStampModal.Date')}
            />
            <Choice
              id="default-time"
              checked={timeCheckbox}
              onChange={handleTimeCheckboxChange}
              label={t('option.customStampModal.Time')}
            />
          </div>
        </div>
        {(dateCheckbox || timeCheckbox) && <div className="date-format-container">
          <div className="stamp-sublabel">{t('option.customStampModal.dateFormat')}</div>
          <div className="hover-icon">
            <Icon glyph="icon-info"/>
            <div className="date-format-description">
              <div className="date-format-cell">M = {t('option.customStampModal.month')}</div>
              <div className="date-format-cell">D = {t('option.customStampModal.day')}</div>
              <div className="date-format-cell">Y = {t('option.customStampModal.year')}</div>
              <div className="date-format-cell">H = {t('option.customStampModal.hour')} (24hr)</div>
              <div className="date-format-cell">h = {t('option.customStampModal.hour')} (12hr)</div>
              <div className="date-format-cell">m = {t('option.customStampModal.minute')}</div>
              <div className="date-format-cell">s = {t('option.customStampModal.second')}</div>
              <div className="date-format-cell">A = AM/PM</div>
            </div>
          </div>
          <Dropdown
            items={dateTimeDropdownItems}
            currentSelectionKey={dateTime}
            onClickItem={onDateFormatChange}
          />
        </div>}
      </div>
    </div>
  );
};

CustomStampForums.propTypes = propTypes;

export default CustomStampForums;
