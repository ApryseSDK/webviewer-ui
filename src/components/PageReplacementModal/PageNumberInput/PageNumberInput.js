import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import getPageArrayFromString from 'helpers/getPageArrayFromString';
import Icon from 'components/Icon';
import './PageNumberInput.scss';

const propTypes = {
  id: PropTypes.string,
  selectedPageNumbers: PropTypes.arrayOf(PropTypes.number),
  pageCount: PropTypes.number,
  placeholder: PropTypes.string,
  pageNumberError: PropTypes.string,
  onBlurHandler: PropTypes.func,
  onError: PropTypes.func,
  ariaLabel: PropTypes.string,
  onSelectedPageNumbersChange: PropTypes.func,
  customPageLabels: PropTypes.array,
  enablePageLabels: PropTypes.bool
};

const noop = () => { };

function PageNumberInput({
  id,
  selectedPageNumbers,
  pageCount,
  enablePageLabels = false,
  customPageLabels = null,
  placeholder,
  pageNumberError,
  onSelectedPageNumbersChange,
  ariaLabel,
  onError = noop,
  onBlurHandler = noop,
}) {
  // Since we don't have page labels info we just assume page numbers as labels
  let pageLabels = Array.from({ length: pageCount }, (_, i) => (i + 1).toString());
  const [pageString, setPageString] = useState('');
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // Whenever we receive a selectedPageNumbers prop, massage it into the nice format
    if (selectedPageNumbers) {
      setPageString(getPageString(selectedPageNumbers));
    }
  }, [selectedPageNumbers]);

  useEffect(() => {
    setHasError(!!pageNumberError);
  }, [pageNumberError]);

  const onPagesChange = (e) => {
    const inputValue = e.target.value;
    const lastChar = inputValue[inputValue.length - 1];

    if (lastChar === ',' || lastChar === '-' || lastChar === ' ') {
      setPageString(inputValue);
      return;
    }

    setPageString(inputValue);

    if (enablePageLabels && customPageLabels) {
      pageLabels = customPageLabels;
    }

    const selectedPagesString = e.target.value.replace(/ /g, '');
    const pageNumbersArray = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels, pageCount, onError);

    // Send info back to parent component
    onSelectedPageNumbersChange && onSelectedPageNumbersChange(pageNumbersArray);
  };

  const getPageString = (selectedPageArray) => {
    let pagesToPrint = '';
    const sortedPages = selectedPageArray.sort((a, b) => a - b);
    let prevIndex = null;

    for (let i = 0; sortedPages.length > i; i++) {
      if (sortedPages[i + 1] === sortedPages[i] + 1) {
        prevIndex = prevIndex !== null ? prevIndex : sortedPages[i];
      } else if (prevIndex !== null) {
        pagesToPrint = `${pagesToPrint}${prevIndex}-${sortedPages[i]}, `;
        prevIndex = null;
      } else {
        pagesToPrint = `${pagesToPrint}${sortedPages[i]}, `;
      }
    }

    return pagesToPrint.slice(0, -2);
  };

  const onBlur = (e) => {
    if (enablePageLabels && customPageLabels) {
      pageLabels = customPageLabels;
    }

    const selectedPagesString = e.target.value.replace(/ /g, '');
    const pageNumbersArray = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels, pageCount, onError);
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
