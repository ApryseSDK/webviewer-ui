import core from 'core';

export default customInput => {
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
      const page = parseInt(range[0], 10); 
      pagesToPrint.push(page);
    } else if (isRangeOfPages) {
      addRangeOfPagesTo(pagesToPrint, range);
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

const addRangeOfPagesTo = (pagesToPrint, range) => {
  const start = parseInt(range[0], 10);
  let end;

  if (range[1] === '') {
    // range like 4- means page 4 to the end of the document
    end = core.getTotalPages();
  } else {
    end = parseInt(range[1], 10);
  }

  for (let i = start; i <= end; i++) {
    pagesToPrint.push(i);
  }
};

