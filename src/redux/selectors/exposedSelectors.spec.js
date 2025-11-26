import { hasPanelInItems, getDisabledToolNames } from 'selectors/exposedSelectors';
import { ITEM_RENDER_PREFIXES } from 'constants/customizationVariables';

describe('Redux Selector Tests', () => {
  it('hasPanelInItems should not break with null items', () => {
    const result = hasPanelInItems([{}, null, undefined], ITEM_RENDER_PREFIXES.SIGNATURE_LIST_PANEL);
    expect(result).toEqual(false);
  });
});

describe('getDisabledToolNames', () => {
  it('returns empty array when no tools are disabled', () => {
    const state = {
      viewer: {
        disabledElements: {},
        toolButtonObjects: {}
      }
    };
    expect(getDisabledToolNames(state)).toEqual([]);
  });

  it('returns disabled tool names', () => {
    const state = {
      viewer: {
        disabledElements: {
          eraserToolButton: { disabled: true, priority: 2 }
        },
        toolButtonObjects: {
          AnnotationEraserTool: {
            dataElement: 'eraserToolButton'
          }
        }
      }
    };
    expect(getDisabledToolNames(state)).toEqual(['AnnotationEraserTool']);
  });

  it('filters out non-disabled elements', () => {
    const state = {
      viewer: {
        disabledElements: {
          eraserToolButton: { disabled: true, priority: 2 },
          panToolButton: { disabled: false, priority: 1 }
        },
        toolButtonObjects: {
          AnnotationEraserTool: { dataElement: 'eraserToolButton' },
          Pan: { dataElement: 'panToolButton' }
        }
      }
    };
    expect(getDisabledToolNames(state)).toEqual(['AnnotationEraserTool']);
  });
});
