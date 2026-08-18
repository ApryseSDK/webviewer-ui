import { getWrappedGridPosition, GRID_DIRECTION } from './gridNavigationHelper';

describe('getWrappedGridPosition', () => {
  const DEFAULT_ROW_INDEX = 0;
  const DEFAULT_COL_INDEX = 0;
  const DEFAULT_ROW_COUNT = 10;
  const DEFAULT_COL_COUNT = 10;

  it('should move right within bounds', () => {
    expect(getWrappedGridPosition(DEFAULT_ROW_INDEX, DEFAULT_COL_INDEX, GRID_DIRECTION.RIGHT, DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT)).toEqual({ nextRowIndex: 0, nextColIndex: 1 });
  });

  it('should move down within bounds', () => {
    expect(getWrappedGridPosition(DEFAULT_ROW_INDEX, DEFAULT_COL_INDEX, GRID_DIRECTION.DOWN, DEFAULT_ROW_COUNT, DEFAULT_COL_COUNT)).toEqual({ nextRowIndex: 1, nextColIndex: 0 });
  });

  it('should wrap the column to the last index when moving left past the start', () => {
    const colCount = 7;
    const expectedColIndex = colCount - 1;
    expect(getWrappedGridPosition(DEFAULT_ROW_INDEX, DEFAULT_COL_INDEX, GRID_DIRECTION.LEFT, DEFAULT_ROW_COUNT, colCount)).toEqual({ nextRowIndex: 0, nextColIndex: expectedColIndex });
  });

  it('should wrap the column to zero when moving right past the last column', () => {
    const colCount = 7;
    const startingColIndex = colCount - 1;
    expect(getWrappedGridPosition(DEFAULT_ROW_INDEX, startingColIndex, GRID_DIRECTION.RIGHT, DEFAULT_ROW_COUNT, colCount)).toEqual({ nextRowIndex: 0, nextColIndex: DEFAULT_COL_INDEX });
  });

  it('should wrap the row to the last index when moving up past the top', () => {
    const rowCount = 3;
    const expectedRowIndex = rowCount - 1;
    expect(getWrappedGridPosition(DEFAULT_ROW_INDEX, DEFAULT_COL_INDEX, GRID_DIRECTION.UP, rowCount, DEFAULT_COL_COUNT)).toEqual({ nextRowIndex: expectedRowIndex, nextColIndex: 0 });
  });

  it('should wrap the row to zero when moving down past the last row', () => {
    const rowCount = 3;
    const startingRowIndex = rowCount - 1;
    expect(getWrappedGridPosition(startingRowIndex, DEFAULT_COL_INDEX, GRID_DIRECTION.DOWN, rowCount, DEFAULT_COL_COUNT)).toEqual({ nextRowIndex: DEFAULT_ROW_INDEX, nextColIndex: 0 });
  });
});
