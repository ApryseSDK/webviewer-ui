import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import getPageArrayFromString from 'helpers/getPageArrayFromString';

import './PageNumberInput.scss';

const propTypes = {
  selectedPageNumbers: PropTypes.arrayOf(PropTypes.number),
  pageCount: PropTypes.number,
  onSelectedPageNumbersChange: PropTypes.func,
  onBlurHandler: PropTypes.func,
  placeholder: PropTypes.string,
};

const noop = () => {};

function PageNumberInput({ selectedPageNumbers, onSelectedPageNumbersChange, onBlurHandler = noop, pageCount, placeHolder, onError = noop }) {
  // Since we don't have page labels info we just assume page numbers as labels
  const pageLabels = Array.from({ length: pageCount }, (_, i) => (i + 1).toString());
  const [pageString, setPageString] = useState('');

  useEffect(() => {
    // Whenever we receive a selectedPageNumbers prop, massage it into the nice format
    if (selectedPageNumbers) {
      setPageString(getPageString(selectedPageNumbers));
    }
  }, [selectedPageNumbers]);

  const onPagesChange = (e) => {
    setPageString(e.target.value);

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
    const selectedPagesString = e.target.value.replace(/ /g, '');
    const pageNumbersArray = !selectedPagesString ? [] : getPageArrayFromString(selectedPagesString, pageLabels, pageCount, onError);
    const pageNumbersString = getPageString(pageNumbersArray);
    setPageString(pageNumbersString);

    // Send info back to parent component
    onBlurHandler && onBlurHandler(pageNumbersArray);
  };

  return (
    <input
      className="page-number-input"
      type="text"
      onChange={onPagesChange}
      onBlur={onBlur}
      value={pageString}
      placeholder={placeHolder}
    />
  );
}

PageNumberInput.propTypes = propTypes;

export default PageNumberInput;
