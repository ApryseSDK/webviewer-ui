import DataElements from 'constants/dataElement';
import { isElementOnLeftSide } from './rightToLeft';

export default (dataElement, state) => getLeftPanelDataElements(state).includes(dataElement);

export const getLeftPanelDataElements = (state) => {
  const featureFlags = state.featureFlags;
  const { customizableUI } = featureFlags;

  if (customizableUI) {
    return state.viewer.genericPanels.filter((item) => isElementOnLeftSide(item.location));
  }

  const defaultLeftPanels = [
    DataElements.PORTFOLIO_PANEL,
    DataElements.THUMBNAILS_PANEL,
    DataElements.OUTLINE_PANEL,
    DataElements.LAYERS_PANEL,
    DataElements.BOOKMARK_PANEL,
    DataElements.SIGNATURE_PANEL,
    DataElements.ATTACHMENT_PANEL,
  ];

  if (state.viewer.notesInLeftPanel) {
    defaultLeftPanels.push(DataElements.NOTES_PANEL);
  }

  const customPanels = state.viewer.customPanels.map(({ panel }) => panel.dataElement);

  return [...defaultLeftPanels, ...customPanels];
};
