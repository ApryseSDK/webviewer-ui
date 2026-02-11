import { useEffect, useState } from 'react';

export const PAGE_RANGES = {
  ALL: 'all',
  CURRENT_PAGE: 'currentPage',
  CURRENT_VIEW: 'currentView',
  SPECIFY: 'specify'
};

const usePageRanges = () => {
  const [pageRange, setPageRange] = useState(PAGE_RANGES.ALL);
  const [hasPageNumberError, setHasPageNumberError] = useState(false);
  const clearError = () => setHasPageNumberError(false);
  const onError = () => setHasPageNumberError(true);
  const [specifiedPages, setSpecifiedPages] = useState([]);
  const [hasSpecifiedPages, setHasSpecifiedPages] = useState(false);
  const [isCurrentViewDisabled, setIsCurrentViewDisabled] = useState(false);

  const onPageRangeChange = (e) => {
    const isPageRangeInput = e.target.classList.contains('page-range-input') || Object.values(PAGE_RANGES).includes(e.target.value);
    if (!isPageRangeInput) {
      return;
    }
    setPageRange(e.target.value);
    if (hasPageNumberError) {
      clearError();
    }
  };

  useEffect(() => {
    setHasSpecifiedPages(specifiedPages.length > 0);
    if (specifiedPages.length) {
      clearError();
    }
  }, [specifiedPages]);

  return {
    pageRange,
    setPageRange,
    onPageRangeChange,
    hasPageNumberError,
    onError,
    clearError,
    specifiedPages,
    setSpecifiedPages,
    hasSpecifiedPages,
    isCurrentViewDisabled,
    setIsCurrentViewDisabled,
  };
};

export default usePageRanges;