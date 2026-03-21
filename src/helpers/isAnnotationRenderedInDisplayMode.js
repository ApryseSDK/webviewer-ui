export const isAnnotationRenderedInDisplayMode = (core, annotation) => {
  const pageCount = core.getTotalPages();
  if (!annotation || !annotation.PageNumber || annotation.PageNumber > pageCount) {
    return false;
  }

  const visiblePages = core.getDisplayModeObject().getVisiblePages();
  const isAnnotationInVisiblePages = visiblePages.includes(annotation.PageNumber);
  const isFocusableInCurrentDisplayMode = core.isContinuousDisplayMode() || (!core.isContinuousDisplayMode() && isAnnotationInVisiblePages);
  return isFocusableInCurrentDisplayMode;
};