import React, { useState, useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import selectors from 'selectors';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import Icon from 'components/Icon';
import './PageNumberInput.scss';

const propTypes = {
  id: PropTypes.string,
  selectedPageNumbers: PropTypes.arrayOf(PropTypes.number),
  pageCount: PropTypes.number,
  placeholder: PropTypes.string,
  onBlurHandler: PropTypes.func,
  onError: PropTypes.func,
  ariaLabel: PropTypes.string,
  onSelectedPageNumbersChange: PropTypes.func,
  usePageIndexes: PropTypes.bool,
};

const noop = () => { };

function PageNumberInput({
  id,
  selectedPageNumbers,
  pageCount,
  placeholder,
  onSelectedPageNumbersChange,
  ariaLabel,
  onError = noop,
  onBlurHandler = noop,
  usePageIndexes = false,
}) {

  const [t] = useTranslation();
  const isCustomPageLabelsEnabled = useSelector(selectors.isCustomPageLabelsEnabled);
  const pageLabels = useSelector(selectors.getPageLabels);

  const activePageLabels = useMemo(
    () => isCustomPageLabelsEnabled && pageLabels && !usePageIndexes
      ? pageLabels
      : Array.from({ length: pageCount }, (_, i) => (i + 1).toString()),
    [isCustomPageLabelsEnabled, pageLabels, pageCount]
  );

  const [pageString, setPageString] = useState('');
  const [hasError, setHasError] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const [pageNumberError, setPageNumberError] = useState('');

  useEffect(() => {
    if (selectedPageNumbers && !isUserTyping) {
      setPageString(getPageString(selectedPageNumbers));
    }
  }, [selectedPageNumbers, isUserTyping]);

  useEffect(() => {
    if (hasError) {
      let errorMessage = t('message.errorPageNumberPart1');
      if (!isCustomPageLabelsEnabled) {
        errorMessage = errorMessage.concat(`${t('message.errorPageNumberPart2')} ${activePageLabels.length}.`);
      }
      setPageNumberError(errorMessage);
      onError();
    }
  }, [hasError]);

  const getPageNumbersArray = (inputValue) => {
    const selectedPagesString = inputValue.replaceAll(' ', '');
    const isSelectedPagesStringEmpty = selectedPagesString.length === 0;
    const pageNumbersArray = isSelectedPagesStringEmpty ? [] : getPageArrayFromString(inputValue, activePageLabels, pageCount);
    setHasError(pageNumbersArray.length === 0 && selectedPagesString.length > 0);
    return pageNumbersArray;
  };

  const onPagesChange = (e) => {
    const inputValue = e.target.value;
    const lastChar = inputValue[inputValue.length - 1];
    setIsUserTyping(true);

    if (lastChar === ',' || lastChar === '-' || lastChar === ' ') {
      setPageString(inputValue);
      return;
    }

    setPageString(inputValue);
    const pageNumbersArray = getPageNumbersArray(inputValue);

    // Send info back to parent component
    onSelectedPageNumbersChange && onSelectedPageNumbersChange(pageNumbersArray);
  };

  const getDisplayValue = (pageNumber, pageLabels) => {
    return isCustomPageLabelsEnabled ? pageLabels[pageNumber - 1] : pageNumber;
  };

  const getPageString = (selectedPageArray) => {
    let pagesToPrint = '';
    const sortedPages = selectedPageArray.sort((a, b) => a - b);
    let prevIndex = null;

    for (let i = 0; sortedPages.length > i; i++) {
      const currentDisplayValue = getDisplayValue(sortedPages[i], activePageLabels);
      if (sortedPages[i + 1] === sortedPages[i] + 1) {
        prevIndex = prevIndex !== null ? prevIndex : sortedPages[i];
      } else if (prevIndex !== null) {
        const startDisplayValue = getDisplayValue(prevIndex, activePageLabels);
        pagesToPrint = `${pagesToPrint}${startDisplayValue}-${currentDisplayValue}, `;
        prevIndex = null;
      } else {
        pagesToPrint = `${pagesToPrint}${currentDisplayValue}, `;
      }
    }

    return pagesToPrint.slice(0, -2);
  };

  const onBlur = (e) => {
    setIsUserTyping(false);
    const pageNumbersArray = getPageNumbersArray(e.target.value);
    const pageNumbersString = getPageString(pageNumbersArray);
    setPageString(pageNumbersString);

    // Send info back to parent component
    onBlurHandler && onBlurHandler(pageNumbersArray);
  };

  return (
    <div className='PageNumberInput'>
      <div className='input-wrapper'>
        <input
          className={classNames({
            'page-number-input': true,
            'page-number-input--error': hasError
          })}
          id={id}
          type='text'
          onChange={onPagesChange}
          onBlur={onBlur}
          aria-label={ariaLabel}
          value={pageString}
          placeholder={placeholder}
          aria-describedby={hasError ? 'PageNumberInputError' : undefined}
        />
        {hasError && <Icon glyph="icon-alert" />}
      </div>
      {hasError && (
        <div id="PageNumberInputError" className="page-number-error">
          <p aria-live="assertive" className="no-margin">{pageNumberError}</p>
        </div>)}
    </div>
  );
}

PageNumberInput.propTypes = propTypes;

export default PageNumberInput;
