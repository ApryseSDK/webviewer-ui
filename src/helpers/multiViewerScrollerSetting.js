const multiViewerScollerSetting = {
  isScrolledByClickingChangeItem: false,
};

export const setIsScrolledByClickingChangeItem = (value) => {
  multiViewerScollerSetting.isScrolledByClickingChangeItem = value;
};

export const getIsScrolledByClickingChangeItem = () => {
  return multiViewerScollerSetting.isScrolledByClickingChangeItem;
};
