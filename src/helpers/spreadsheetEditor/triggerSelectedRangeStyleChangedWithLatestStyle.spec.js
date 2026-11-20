import { triggerSelectedRangeStyleChangedWithLatestStyle } from './triggerSelectedRangeStyleChangedWithLatestStyle';
import * as styleHelper from './getStyleObjectFromCellStyle';

jest.mock('./getStyleObjectFromCellStyle');

describe('triggerSelectedRangeStyleChangedWithLatestStyle', () => {
  let mockSpreadsheetEditorManager;
  let mockCell;
  let mockCellStyle;

  beforeEach(() => {
    mockCellStyle = { color: 'red' };

    mockCell = {
      getStyle: jest.fn(() => mockCellStyle),
    };

    mockSpreadsheetEditorManager = {
      getSelectedCells: jest.fn(() => [mockCell]),
      trigger: jest.fn(),
    };

    styleHelper.getStyleObjectFromCellStyle.mockReturnValue({
      backgroundColor: 'white',
      font: { color: 'red' },
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should trigger event with style object when cells are selected', () => {
    triggerSelectedRangeStyleChangedWithLatestStyle(mockSpreadsheetEditorManager);
    expect(mockSpreadsheetEditorManager.trigger).toHaveBeenCalledWith(
      'selectedRangeStyleChanged',
      {
        backgroundColor: 'white',
        font: { color: 'red' },
      }
    );
  });

  it('should handle multiple selected cells by using the first cell', () => {
    const secondCell = {
      getStyle: jest.fn(() => ({ color: 'blue' })),
    };
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([mockCell, secondCell]);
    triggerSelectedRangeStyleChangedWithLatestStyle(mockSpreadsheetEditorManager);
    expect(mockCell.getStyle).toHaveBeenCalled();
    expect(secondCell.getStyle).not.toHaveBeenCalled();
  });

  it('should trigger the event with an empty style when no cells are selected', () => {
    mockSpreadsheetEditorManager.getSelectedCells.mockReturnValue([]);
    styleHelper.getStyleObjectFromCellStyle.mockReturnValue({ /* empty */ });
    triggerSelectedRangeStyleChangedWithLatestStyle(mockSpreadsheetEditorManager);
    expect(mockSpreadsheetEditorManager.trigger).toHaveBeenCalledWith('selectedRangeStyleChanged', {});
  });
});
