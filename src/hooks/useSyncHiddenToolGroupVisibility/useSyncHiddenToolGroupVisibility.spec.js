import { renderHook } from '@testing-library/react-hooks';
import { ITEM_TYPE } from 'constants/customizationVariables';
import useSyncHiddenToolGroupVisibility, { getHiddenToolGroupToggleButtons, getDispatchTargets } from './useSyncHiddenToolGroupVisibility';

const mockDispatch = jest.fn();
let mockHookState = {
  viewer: {
    modularComponents: {},
    disabledElements: {},
  },
};

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useDispatch: () => mockDispatch,
  useSelector: (selector) => selector(mockHookState),
  shallowEqual: jest.requireActual('react-redux').shallowEqual,
}));

jest.mock('actions', () => ({
  disableElements: (elements) => ({ type: 'DISABLE_ELEMENTS', payload: elements }),
  enableElements: (elements) => ({ type: 'ENABLE_ELEMENTS', payload: elements }),
}));

describe('useSyncHiddenToolGroupVisibility', () => {
  describe('getHiddenToolGroupToggleButtons', () => {
    const cases = [
      {
        description: 'should return empty array when there are no items',
        items: [],
        size: 0,
        expected: [],
      },
      {
        description: 'should return empty array when there are no items even if array is not empty',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'group1', groupedItems: 'group1' },
        ],
        size: 0,
        expected: [],
      },
      {
        description: 'should return empty array when size is 0',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle2', groupedItems: 'group2' },
        ],
        size: 0,
        expected: [],
      },
      {
        description: 'should return hidden ToolGroupToggleButtons when size is less than items length',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle3', groupedItems: 'group3' },
        ],
        size: 2,
        expected: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle3', groupedItems: 'group3' },
        ],
      },
      {
        description: 'should return only ToolGroupToggleButtons that should toggle visibility',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: false, dataElement: 'toggle3', groupedItems: 'group3' },
        ],
        size: 2,
        expected: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
        ],
      },
      {
        description: 'should include only ToolGroupToggleButtons where shouldToggleVisibility is not explicitly false (undefined counts as true)',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: false, dataElement: 'toggle2', groupedItems: 'group2' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle3', groupedItems: 'group3' },
        ],
        size: 3,
        expected: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle3', groupedItems: 'group3' },
        ],
      },
      {
        description: 'should return only ToolGroupToggleButtons that are associated with a groupedItems element',
        items: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle3', groupedItems: undefined },
        ],
        size: 2,
        expected: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
        ],
      },
    ];

    test.each(cases)('$description', ({ items, size, expected }) => {
      const hiddenToolGroupToggleButtons = getHiddenToolGroupToggleButtons(items, size);
      expect(hiddenToolGroupToggleButtons).toEqual(expected);
    });
  });

  describe('getDispatchTargets', () => {
    const cases = [
      {
        description: 'should return empty dispatch targets when there are no hidden ToolGroupToggleButtons',
        hiddenToolGroupToggleButtons: [],
        activeToolName: 'tool1',
        disabledElements: { group1: false, group2: false },
        expected: {
          groupsToDisable: [],
          groupsToEnable: [],
          signature: '',
        },
      },
      {
        description: 'should include a group to enable when it is disabled, its ToolGroupToggleButton is hidden, and the active tool is in that group',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
        ],
        activeToolName: 'tool1',
        disabledElements: { group1: { disabled: true }, group2: { disabled: false } },
        expected: {
          groupsToDisable: [],
          groupsToEnable: ['group1'],
          signature: '|group1',
        },
      },
      {
        description: 'should include a group to disable when it is enabled, its ToolGroupToggleButton is hidden, and the active tool is not in that group',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
        ],
        activeToolName: 'tool2',
        disabledElements: { group1: { disabled: false }, group2: { disabled: false } },expected: {
          groupsToDisable: ['group1'],
          groupsToEnable: [],
          signature: 'group1|',
        },
      },
      {
        description: 'should include both groups to enable and disable when conditions are met',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle2', groupedItems: 'group2' },
        ],
        activeToolName: 'tool1',
        disabledElements: { group1: { disabled: true }, group2: { disabled: false } },expected: {
          groupsToDisable: ['group2'],
          groupsToEnable: ['group1'],
          signature: 'group2|group1',
        },
      },
      {
        description: 'should not include a group that is already in the correct state (already disabled when inactive)',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
        ],
        activeToolName: 'tool2',
        // group1 is already disabled and tool2 is not in it — no change needed
        disabledElements: { group1: { disabled: true } },
        expected: {
          groupsToDisable: [],
          groupsToEnable: [],
          signature: '',
        },
      },
      {
        description: 'should not include a group that is already in the correct state (already enabled when active)',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
        ],
        activeToolName: 'tool1',
        // group1 is already enabled and tool1 is active in it — no change needed
        disabledElements: { group1: { disabled: false } },
        expected: {
          groupsToDisable: [],
          groupsToEnable: [],
          signature: '',
        },
      },
      {
        description: 'should disable hidden groups when active tool is the default pan/select tool (not in any group)',
        hiddenToolGroupToggleButtons: [
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle1', groupedItems: 'group1' },
          { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, dataElement: 'toggle2', groupedItems: 'group2' },
        ],
        activeToolName: 'AnnotationEdit',
        disabledElements: { group1: { disabled: false }, group2: { disabled: false } },
        expected: {
          groupsToDisable: ['group1', 'group2'],
          groupsToEnable: [],
          signature: 'group1,group2|',
        },
      },
    ];

    test.each(cases)('$description', ({ hiddenToolGroupToggleButtons, activeToolName, disabledElements, expected }) => {
      const modularComponents = {
        group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
        group2: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool2Button'] },
        tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
        tool2Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool2', dataElement: 'tool2Button' },
      };
      const targets = getDispatchTargets({
        hiddenToolGroupToggleButtons,
        activeToolName,
        disabledElements,
        modularComponents,
      });

      expect(targets).toEqual(expected);
    });
  });

  describe('useSyncHiddenToolGroupVisibility hook', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      mockDispatch.mockClear();
    });

    afterEach(() => {
      jest.useRealTimers();
      mockHookState = {
        viewer: {
          modularComponents: {},
          disabledElements: {},
        },
      };
    });

    it('does not dispatch when no items are passed', () => {
      const items = [];
      renderHook(() => useSyncHiddenToolGroupVisibility({ items: items, size: 0, activeToolName: 'tool1' }));
      jest.runAllTimers();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('does not dispatch when no items are hidden (size = 0)', () => {
      const items = [
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
      ];
      mockHookState.viewer.modularComponents = {
        group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
        tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
      };
      renderHook(() => useSyncHiddenToolGroupVisibility({ items: items, size: 0, activeToolName: 'tool1' }));
      jest.runAllTimers();
      expect(mockDispatch).not.toHaveBeenCalled();
    });

    it('dispatches enableElements for a hidden group when the active tool is in that group', () => {
      const items = [
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
      ];
      mockHookState.viewer = {
        modularComponents: {
          group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
          tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
        },
        disabledElements: {
          group1: { disabled: true },
        },
      };
      renderHook(() => useSyncHiddenToolGroupVisibility({ items: items, size: 1, activeToolName: 'tool1' }));
      jest.runAllTimers();
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'ENABLE_ELEMENTS', payload: ['group1'] });
    });

    it('dispatches disableElements for a hidden group when the active tool is not in that group', () => {
      const items = [
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
      ];
      mockHookState.viewer = {
        modularComponents: {
          group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
          group2: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool2Button'] },
          tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
          tool2Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool2', dataElement: 'tool2Button' },
        },
        disabledElements: {
          group1: { disabled: true },
          group2: { disabled: false },
        },
      };
      renderHook(() => useSyncHiddenToolGroupVisibility({ items: items, size: 2, activeToolName: 'tool1' }));
      jest.runAllTimers();
      expect(mockDispatch).toHaveBeenCalledWith({ type: 'DISABLE_ELEMENTS', payload: ['group2'] });
    });

    it('coalesces multiple rapid re-renders into a single dispatch', () => {
      const items = [
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle2', groupedItems: 'group2' },
      ];
      mockHookState.viewer = {
        modularComponents: {
          group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
          group2: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool2Button'] },
          tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
          tool2Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool2', dataElement: 'tool2Button' },
        },
        disabledElements: {
          group1: { disabled: true },
          group2: { disabled: false },
        },
      };
      const { rerender } = renderHook(
        ({ activeToolName }) => useSyncHiddenToolGroupVisibility({ items: items, size: 2, activeToolName }),
        { initialProps: { activeToolName: 'tool1' } }
      );
      rerender({ activeToolName: 'tool1' });
      rerender({ activeToolName: 'tool1' });
      expect(mockDispatch).not.toHaveBeenCalled();
      jest.runAllTimers();
      const enableCalls = mockDispatch.mock.calls.filter((c) => c[0].type === 'ENABLE_ELEMENTS');
      const disableCalls = mockDispatch.mock.calls.filter((c) => c[0].type === 'DISABLE_ELEMENTS');
      expect(enableCalls).toHaveLength(1);
      expect(disableCalls).toHaveLength(1);
    });

    it('cancels the pending timeout on unmount without dispatching', () => {
      const items = [
        { type: ITEM_TYPE.TOOL_GROUP_TOGGLE_BUTTON, shouldToggleVisibility: true, dataElement: 'toggle1', groupedItems: 'group1' },
      ];
      mockHookState.viewer = {
        modularComponents: {
          group1: { type: ITEM_TYPE.GROUPED_ITEMS, items: ['tool1Button'] },
          tool1Button: { type: ITEM_TYPE.TOOL_BUTTON, toolName: 'tool1', dataElement: 'tool1Button' },
        },
        disabledElements: {
          group1: { disabled: true },
        },
      };
      const { unmount } = renderHook(() =>
        useSyncHiddenToolGroupVisibility({ items: items, size: 2, activeToolName: 'tool1' })
      );
      unmount();
      jest.runAllTimers();
      expect(mockDispatch).not.toHaveBeenCalled();
    });
  });
});