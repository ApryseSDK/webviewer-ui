import React from 'react';
import { useDispatch, useStore } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import core from 'core';
const useRibbonActions = (items) => {
  const dispatch = useDispatch();
  const store = useStore();

  const setActiveGroupedItemsAndTool = React.useCallback(
    (ribbonDataElement) => {
      const groupedItems = items.find((item) => item.dataElement === ribbonDataElement)?.groupedItems;
      if (!groupedItems) {
        return;
      }

      dispatch(actions.setActiveGroupedItems(groupedItems));

      const state = store.getState();
      const lastActiveToolForRibbon = selectors.getLastActiveToolForRibbon(state, ribbonDataElement);
      const firstRibbonItemTool = selectors.getFirstToolForRibbon(state, ribbonDataElement);
      const ribbonItemTool = lastActiveToolForRibbon ?? firstRibbonItemTool;

      if (ribbonItemTool) {
        core.setToolMode(ribbonItemTool);
      }
    },
    [items]
  );

  return { setActiveGroupedItemsAndTool };
};

export default useRibbonActions;
