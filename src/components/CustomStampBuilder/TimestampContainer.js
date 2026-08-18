import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import selectors from 'selectors';
import PropTypes from 'prop-types';
import Dropdown from 'components/Dropdown';
import Choice from 'components/Choice';
import Icon from 'components/Icon';

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

const TimestampContainer = ({
  handleTimestampFormatChange
}) => {
  const [t] = useTranslation();
  const dateTimeFormats = useSelector((state) => selectors.getDateTimeFormats(state));

  const defaultDateTimeFormat = dateTimeFormats?.[0] ?? FALLBACK_DATE_TIME_FORMAT;
  const [dateTime, setDateTime] = useState(dateTimeFormatToString(defaultDateTimeFormat));
  const [usernameCheckbox, setUsernameCheckbox] = useState(true);
  const [dateCheckbox, setDateCheckbox] = useState(true);
  const [timeCheckbox, setTimeCheckbox] = useState(true);
  const shouldShowDateFormatContainer = dateCheckbox || timeCheckbox;

  const tooltipRef = useRef(null);
  const [tooltipVisible, setTooltipVisible] = useState(false);

  const handleClickOutside = (event) => {
    if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
      setTooltipVisible(false);
    }
  };

  useEffect(() => {
    if (tooltipVisible) {
      document.addEventListener('click', handleClickOutside);
    } else {
      document.removeEventListener('click', handleClickOutside);
    }

    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, [tooltipVisible]);

  const handleTooltipClick = () => {
    setTooltipVisible(!tooltipVisible);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault(); // Prevent default action for space key
      handleTooltipClick();
    }
  };

  useEffect(() => {
    let newTimestampFormat = '';
    if (usernameCheckbox) {
      newTimestampFormat += '[$currentUser] ';
    }
    if (dateCheckbox || timeCheckbox) {
      newTimestampFormat += dateTime;
    }
    handleTimestampFormatChange(newTimestampFormat);
  }, [dateTime, usernameCheckbox, dateCheckbox, timeCheckbox]);

  const handleDateCheckboxChange = () => {
    const newDateTime = dateTimeFormatToString(defaultDateTimeFormat, !dateCheckbox, timeCheckbox);
    setDateTime(newDateTime);
    setDateCheckbox(!dateCheckbox);
  };

  const handleTimeCheckboxChange = () => {
    const newDateTime = dateTimeFormatToString(defaultDateTimeFormat, dateCheckbox, !timeCheckbox);
    setDateTime(newDateTime);
    setTimeCheckbox(!timeCheckbox);
  };

  const handleUsernameCheckbox = () => {
    setUsernameCheckbox(!usernameCheckbox);
  };

  const onDateFormatChange = (newFormat) => {
    setDateTime(newFormat);
  };

  const formatsList = dateTimeFormats || [FALLBACK_DATE_TIME_FORMAT];
  const dateTimeDropdownItems = Array.from(new Set(
    formatsList.map((format) => dateTimeFormatToString(format, dateCheckbox, timeCheckbox))
  )).filter((format) => format !== '');

  const timestampContainer = <div className="timestamp-container">
    <div id="timestamp-label" className="stamp-sublabel">
      {t('option.customStampModal.timestampText')}
    </div>
    <div className="timeStamp-choice" role="group" aria-labelledby="timestamp-label">
      <Choice
        id="default-username"
        checked={usernameCheckbox}
        onChange={handleUsernameCheckbox}
        label={t('option.customStampModal.Username')} />
      <Choice
        id="default-date"
        checked={dateCheckbox}
        onChange={handleDateCheckboxChange}
        label={t('option.customStampModal.Date')} />
      <Choice
        id="default-time"
        checked={timeCheckbox}
        onChange={handleTimeCheckboxChange}
        label={t('option.customStampModal.Time')} />
    </div>
  </div>;

  const dateFormatContainer = <div className="date-format-container">
    <div className="stamp-sublabel" id="custom-stamp-date-format-label">{t('option.customStampModal.dateFormat')}</div>
    <button
      className="hover-icon"
      ref={tooltipRef}
      onClick={handleTooltipClick}
      aria-label={`${t('option.customStampModal.dateToolTipLabel')}`}
      type="button"
      tabIndex="0"
      onKeyDown={handleKeyDown}
    >
      <Icon glyph="icon-info" />
      {tooltipVisible &&
          (<div className="date-format-description">
            <div className="date-format-cell">M = {t('option.customStampModal.month')}</div>
            <div className="date-format-cell">D = {t('option.customStampModal.day')}</div>
            <div className="date-format-cell">Y = {t('option.customStampModal.year')}</div>
            <div className="date-format-cell">H = {t('option.customStampModal.hour')} (24hr)</div>
            <div className="date-format-cell">h = {t('option.customStampModal.hour')} (12hr)</div>
            <div className="date-format-cell">m = {t('option.customStampModal.minute')}</div>
            <div className="date-format-cell">s = {t('option.customStampModal.second')}</div>
            <div className="date-format-cell">A = AM/PM</div>
          </div>
          )
      }
    </button>
    <Dropdown
      id='custom-stamp-date-format-dropdown'
      labelledById='custom-stamp-date-format-label'
      items={dateTimeDropdownItems}
      ariaLabel={`${t('option.customStampModal.dateFormat')} - ${dateTime}`}
      currentSelectionKey={dateTime}
      onClickItem={onDateFormatChange}
      maxHeight={200}
    />
  </div>;

  return <>
    {timestampContainer}
    {shouldShowDateFormatContainer && dateFormatContainer}
  </>;
};

TimestampContainer.propTypes = {
  handleTimestampFormatChange: PropTypes.func,
};

export default TimestampContainer;