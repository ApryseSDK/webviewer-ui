export const isAnnotationRenderedInDisplayMode = (core, annotation) => {
  const visiblePages = core.getDisplayModeObject().getVisiblePages();
  const isAnnotationInVisiblePages = visiblePages.includes(annotation.PageNumber);
  const isFocusableInCurrentDisplayMode = core.isContinuousDisplayMode() || (!core.isContinuousDisplayMode() && isAnnotationInVisiblePages);
  return isFocusableInCurrentDisplayMode;
};