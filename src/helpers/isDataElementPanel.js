import DataElements from 'constants/dataElement';

export default (dataElement, state) => getLeftPanelDataElements(state).includes(dataElement);

export const getLeftPanelDataElements = (state) => {
  const defaultLeftPanels = [
    'thumbnailsPanel',
    DataElements.OUTLINE_PANEL,
    'layersPanel',
    DataElements.BOOKMARK_PANEL,
    'signaturePanel',
    DataElements.NOTES_PANEL,
    DataElements.PORTFOLIO_PANEL,
  ];
  const customPanels = state.viewer.customPanels.map(({ panel }) => panel.dataElement);

  return [...defaultLeftPanels, ...customPanels];
};
