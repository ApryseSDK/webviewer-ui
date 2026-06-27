import { useEffect, useMemo, useRef } from 'react';
import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import actions from 'actions';
import selectors from 'selectors';
import { ITEM_TYPE } from 'constants/customizationVariables';

/**
 * Helper that filters a list of items and returns those that are hidden (past the size limit) and are
 * ToolGroupToggleButtons that should toggle the visibility of a tool group
 * @param {object[]} items The items to filter, typically the items in a GroupedItems component
 * @param {number} size The number of items that can be shown
 * @returns {object[]} An array of hidden ToolGroupToggleButtons that should toggle visibility
 * @ignore
 */
export const getHiddenToolGroupToggleButtons = (items, size) => {
  if (!items?.length || size <= 0) {
    return [];
  }

  const firstHiddenIndex = items.length - size;
  const hiddenItems = items.slice(firstHiddenIndex);
  const hiddenItemProps = hiddenItems.map((item) => item?.props || item);
  return hiddenItemProps
    .filter((props) => {
      return props &&
        props.type === ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON &&
        props.shouldToggleVisibility !== false &&
        props.groupedItems;
    });
};

/**
 * Helper that gets all the tool names associated with a given groupedItems
 * @param {string} groupedItemsDataElement The dataElement of the groupedItems to get tool names for
 * @param {object} modularComponents The modularComponents state, used to look up the groupedItems and its nested items
 * @returns {string[]} An array of tool names associated with the groupedItems
 * @ignore
 */
const getToolNamesForGroup = (groupedItemsDataElement, modularComponents) => {
  return selectors.getAllToolNamesForGroupedItems(
    { viewer: { modularComponents } },
    groupedItemsDataElement
  );
};

/**
 * Helper that returns an object with empty arrays for groupsToDisable and groupsToEnable, and an empty string for signature
 * @returns {object} The empty targets object
 * @ignore
 */
const getEmptyTargets = () => ({
  groupsToDisable: [],
  groupsToEnable: [],
  signature: '',
});

/**
 * Helper that determines which tool groups should be enabled or disabled based on the currently hidden ToolGroupToggleButtons
 * For each hidden ToolGroupToggleButton, it checks if the active tool is in that group and whether the group is currently enabled or disabled
 * If the active tool is in a hidden group and the group is disabled, it should be enabled
 * If the active tool is not in a hidden group and the group is enabled, it should be disabled
 * @param {object} params
 * @param {object[]} params.hiddenToolGroupToggleButtons The list of hidden ToolGroupToggleButtons that should toggle visibility
 * @param {string} params.activeToolName The name of the currently active tool, used to determine whether a toggle should be enabling or disabling its group
 * @param {object} params.disabledElements The disabledElements state, used to determine whether a toggle's group is currently enabled or disabled
 * @param {object} params.modularComponents The modularComponents state, used to look up the items in a group and their associated tool names
 * @returns {object} Object containing groups to enable, disable, and a signature string for memoization
 * @ignore
 */
export const getDispatchTargets = ({
  hiddenToolGroupToggleButtons,
  activeToolName,
  disabledElements,
  modularComponents,
}) => {
  if (!hiddenToolGroupToggleButtons.length) {
    return getEmptyTargets();
  }

  const groupsToEnableSet = new Set();
  const groupsToDisableSet = new Set();

  hiddenToolGroupToggleButtons.forEach(({ groupedItems: groupedItemsDataElement }) => {
    const toolNamesInGroup = getToolNamesForGroup(groupedItemsDataElement, modularComponents);
    const isGroupActive = toolNamesInGroup.includes(activeToolName);
    if (isGroupActive && disabledElements[groupedItemsDataElement]?.disabled) {
      groupsToEnableSet.add(groupedItemsDataElement);
      return;
    }
    if (!isGroupActive && !disabledElements[groupedItemsDataElement]?.disabled) {
      groupsToDisableSet.add(groupedItemsDataElement);
    }
  });

  const localeCompare = (a, b) => a.localeCompare(b);
  const groupsToDisable = Array.from(groupsToDisableSet).sort(localeCompare);
  const groupsToEnable = Array.from(groupsToEnableSet).sort(localeCompare);
  const hasChanges = groupsToDisable.length > 0 || groupsToEnable.length > 0;

  if (!hasChanges) {
    return getEmptyTargets();
  }

  return {
    groupsToDisable,
    groupsToEnable,
    signature: `${groupsToDisable.join(',')}|${groupsToEnable.join(',')}`,
  };
};

/**
 * Helper that dispatches actions to disable or enable target elements
 * @param {*} dispatch The dispatch function from useDispatch
 * @param {*} targets The target groups to enable or disable, as determined by getDispatchTargets
 * @ignore
 */
const applyDispatchTargets = (dispatch, targets) => {
  if (targets.groupsToDisable.length) {
    dispatch(actions.disableElements(targets.groupsToDisable));
  }
  if (targets.groupsToEnable.length) {
    dispatch(actions.enableElements(targets.groupsToEnable));
  }
};

/**
 * Custom hook that reconciles hidden ToolGroupToggleButtons with the current state of the application
 * @param {object} params
 * @param {object[]} params.items The list of valid items to consider for reconciliation
 * @param {number} params.size The size of the container, used to determine visibility
 * @param {string} params.activeToolName The name of the currently active tool
 * @ignore
 */
const useSyncHiddenToolGroupVisibility = ({
  items,
  size,
  activeToolName,
}) => {
  const dispatch = useDispatch();
  const disabledElements = useSelector(selectors.getDisabledElements, shallowEqual);
  const modularComponents = useSelector(selectors.getModularComponents, shallowEqual);
  const reconciliationTimeoutRef = useRef();

  const dispatchTargets = useMemo(() => {
    const hiddenToolGroupToggleButtons = getHiddenToolGroupToggleButtons(items, size);
    return getDispatchTargets({
      hiddenToolGroupToggleButtons,
      activeToolName,
      disabledElements,
      modularComponents,
    });
  }, [items, size, activeToolName, disabledElements, modularComponents]);

  useEffect(() => {
    if (!dispatchTargets.signature) {
      return;
    }
    // If there are any pending timeouts, clear them before setting a new one
    if (reconciliationTimeoutRef.current) {
      clearTimeout(reconciliationTimeoutRef.current);
    }

    // Set a timeout to apply the dispatch targets on the next tick, to avoid spamming dispatches during render
    reconciliationTimeoutRef.current = setTimeout(() => {
      applyDispatchTargets(dispatch, dispatchTargets);
      reconciliationTimeoutRef.current = undefined;
    }, 0);

    return () => {
      if (reconciliationTimeoutRef.current) {
        clearTimeout(reconciliationTimeoutRef.current);
        reconciliationTimeoutRef.current = undefined;
      }
    };
  }, [dispatchTargets.signature]);
};

export default useSyncHiddenToolGroupVisibility;
