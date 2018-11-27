import core from 'core';

export default (customInput, pageLabels) => {
  const totalPages = core.getTotalPages();
  const pagesToPrint = [];

  // no input, assume every page
  if (!customInput) {
    for (let i = 1; i <= totalPages; i++) {
      pagesToPrint.push(i);
    }
    return pagesToPrint;
  }

  const pageGroups = customInput.split(',');
  pageGroups.forEach(pageGroup => {
    const range = pageGroup.split('-');
    const isSinglePage = range.length === 1;
    const isRangeOfPages = range.length === 2;

    if (isSinglePage) {
      const page = getPageNumber(range[0], pageLabels);
      pagesToPrint.push(page);
    } else if (isRangeOfPages) {
      addRangeOfPagesTo(pagesToPrint, range, pageLabels);
    }
  });

  return pagesToPrint
          .filter((pageNumber, index, pagesToPrint) => {
            const isUnique = pagesToPrint.indexOf(pageNumber) === index;
            const isValidPageNumber = pageNumber > 0 && pageNumber <= totalPages; 
            return isUnique && isValidPageNumber;
          })
          .sort((a, b) => a - b);
};

const addRangeOfPagesTo = (pagesToPrint, range, pageLabels) => {
  const start = getPageNumber(range[0], pageLabels);
  let end;

  if (range[1] === '') {
    // range like 4- means page 4 to the end of the document
    end = core.getTotalPages();
  } else {
    end = getPageNumber(range[1], pageLabels);
  }

  for (let i = start; i <= end; i++) {
    pagesToPrint.push(i);
  }
};

const getPageNumber = (character, pageLabels) => {
  const pageIndex = pageLabels.indexOf(character);
  let pageNumber;

  if (pageIndex === - 1) {
    console.warn(`${character} is not a valid page label`);
  } else {
    pageNumber = pageIndex + 1;
  }

  return pageNumber;
};

