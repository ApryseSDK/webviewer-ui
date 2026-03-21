import { getExtendedSortStrategies } from 'constants/sortStrategies';

const fallbackSortStrategy = {
  getSortedNotes: (notes) => notes,
  shouldRenderSeparator: () => false,
  getSeparatorContent: () => '',
};

const getNotesPanelSortStrategy = (sortStrategy) => {
  const sortStrategies = getExtendedSortStrategies();
  const fallbackKey = Object.keys(sortStrategies)[0];
  const activeSortStrategy = sortStrategies[sortStrategy]
    || (fallbackKey ? sortStrategies[fallbackKey] : fallbackSortStrategy);

  if (!sortStrategies[sortStrategy]) {
    console.warn(`Unknown sort strategy: ${sortStrategy}`);
  }

  return activeSortStrategy;
};

export default getNotesPanelSortStrategy;
