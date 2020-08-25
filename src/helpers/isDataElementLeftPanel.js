export default (dataElement, state) => getLeftPanelDataElements(state).includes(dataElement);

export const getLeftPanelDataElements = state => {
  const defaultLeftPanels = [
    'thumbnailsPanel',
    'outlinesPanel',
    'layersPanel',
    'bookmarksPanel',
  ];

  if (state.viewer.notesInLeftPanel) {
    defaultLeftPanels.push('notesPanel');
  }

  const customPanels = state.viewer.customPanels.map(({ panel }) => panel.dataElement);

  return [...defaultLeftPanels, ...customPanels];
};
