export default (dataElement, state) => getLeftPanelDataElements(state).includes(dataElement);

export const getLeftPanelDataElements = state => {
  const defaultLeftPanels = [
    'notesPanel',
    'thumbnailsPanel',
    'outlinesPanel',
    'layersPanel',
    'bookmarksPanel',
    'signaturePanel',
  ];
  const customPanels = state.viewer.customPanels.map(({ panel }) => panel.dataElement);

  return [...defaultLeftPanels, ...customPanels];
};
