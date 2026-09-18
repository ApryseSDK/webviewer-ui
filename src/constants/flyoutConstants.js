export const WIDTH_PLUS_PADDING = 224 + 8;
export const FLYOUT_ITEM_HEIGHT = 32; // Without padding;

export const createFlyoutItem = (option, icon, dataElement) => ({
  icon,
  label: `option.state.${option.toLowerCase()}`,
  title: `option.state.${option.toLowerCase()}`,
  option,
  dataElement,
});

export const noteStateFlyoutItems = [
  createFlyoutItem('Accepted', 'icon-annotation-status-accepted', 'noteStateFlyoutAcceptedOption'),
  createFlyoutItem('Rejected', 'icon-annotation-status-rejected', 'noteStateFlyoutRejectedOption'),
  createFlyoutItem('Cancelled', 'icon-annotation-status-cancelled', 'noteStateFlyoutCancelledOption'),
  createFlyoutItem('Completed', 'icon-annotation-status-completed', 'noteStateFlyoutCompletedOption'),
  createFlyoutItem('None', 'icon-annotation-status-none', 'noteStateFlyoutNoneOption'),
  createFlyoutItem('Marked', 'icon-annotation-status-marked', 'noteStateFlyoutMarkedOption'),
  createFlyoutItem('Unmarked', 'icon-annotation-status-unmarked', 'noteStateFlyoutUnmarkedOption'),
];

export const spreadsheetNoteStateFlyoutItems = [
  createFlyoutItem('open', 'icon-annotation-status-none', 'noteStateFlyoutOpenOption'),
  createFlyoutItem('resolved', 'icon-annotation-status-completed', 'noteStateFlyoutResolvedOption'),
];
