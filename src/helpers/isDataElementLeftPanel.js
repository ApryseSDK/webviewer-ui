import DataElements from 'constants/dataElement';

export default (dataElement, state) => getLeftPanelDataElements(state).includes(dataElement);

export const getLeftPanelDataElements = (state) => {
  const defaultLeftPanels = [
    DataElements.PORTFOLIO_PANEL,
    DataElements.THUMBNAILS_PANEL,
    DataElements.OUTLINE_PANEL,
    'layersPanel',
    DataElements.BOOKMARK_PANEL,
    'signaturePanel',
    'attachmentPanel',
  ];

  if (state.viewer.notesInLeftPanel) {
    defaultLeftPanels.push(DataElements.NOTES_PANEL);
  }

  const customPanels = state.viewer.customPanels.map(({ panel }) => panel.dataElement);

  return [...defaultLeftPanels, ...customPanels];
};
