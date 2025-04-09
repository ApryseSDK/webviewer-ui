const HeaderFooterModalState = (() => {
  let pageNumber = 0;
  return {
    setPageNumber: (val) => pageNumber = val,
    getPageNumber: () => pageNumber,
  };
})();

export default HeaderFooterModalState;
