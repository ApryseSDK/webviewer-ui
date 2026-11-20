import { itemToFlyout, setItemToFlyoutStore } from './itemToFlyoutHelper';
import { ITEM_TYPE } from 'constants/customizationVariables';

describe('itemToFlyout', () => {
  afterEach(() => {
    setItemToFlyoutStore(null);
  });

  test('omits disabled items from nested grouped item children', () => {
    setItemToFlyoutStore({
      getState: () => ({
        viewer: {
          disabledElements: {
            eraserToolButton: { disabled: true },
          },
        },
      }),
    });

    const flyoutItem = itemToFlyout({
      dataElement: 'defaultAnnotationUtilities',
      type: ITEM_TYPE.GROUPED_ITEMS,
      items: [
        { dataElement: 'divider-0.5', type: ITEM_TYPE.DIVIDER },
        { dataElement: 'undoButton', type: ITEM_TYPE.PRESET_BUTTON, buttonType: 'undoButton' },
        { dataElement: 'redoButton', type: ITEM_TYPE.PRESET_BUTTON, buttonType: 'redoButton' },
        { dataElement: 'eraserToolButton', type: ITEM_TYPE.TOOL_BUTTON, toolName: 'AnnotationEraserTool' },
      ],
    });

    expect(flyoutItem.children).toHaveLength(3);
    expect(flyoutItem.children[0]).toBe('divider');
    expect(flyoutItem.children.map((child) => child.dataElement)).toEqual([
      undefined,
      'undoButton',
      'redoButton',
    ]);
    expect(flyoutItem.children).not.toContain(null);
  });

  test('should use the store passed by the caller instead of the scoped one', () => {
    const storeWithEnabledItem = { getState: () => ({ viewer: { disabledElements: {} } }) };
    const storeWithDisabledItem = { getState: () => ({ viewer: { disabledElements: { undoButton: { disabled: true } } } }) };
    const item = { dataElement: 'undoButton', type: ITEM_TYPE.PRESET_BUTTON, buttonType: 'undoButton' };
    setItemToFlyoutStore(storeWithEnabledItem);

    expect(itemToFlyout(item)).not.toBeNull();
    expect(itemToFlyout(item, { store: storeWithDisabledItem })).toBeNull();
  });
});