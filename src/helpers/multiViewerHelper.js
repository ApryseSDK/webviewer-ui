const multiViewerHelper = {
  matchedPages: null,
  isScrolledByClickingChangeItem: false,
};

export const setIsScrolledByClickingChangeItem = (value) => {
  multiViewerHelper.isScrolledByClickingChangeItem = value;
};

export const getIsScrolledByClickingChangeItem = () => {
  return multiViewerHelper.isScrolledByClickingChangeItem;
};

export default multiViewerHelper;
