export default (dataElement, state) => isDefaultPanel(dataElement) || isCustomPanel(dataElement, state);

const isDefaultPanel = dataElement => ['notesPanel', 'thumbnailsPanel', 'outlinesPanel'].includes(dataElement);

const isCustomPanel = (dataElement, state) => state.viewer.customPanels.map(({ panel }) => panel.dataElement).includes(dataElement);
