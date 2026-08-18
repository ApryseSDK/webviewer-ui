// Single-step grid moves keyed by direction
export const GRID_DIRECTION = {
  UP: 'up',
  DOWN: 'down',
  LEFT: 'left',
  RIGHT: 'right',
};

export const GRID_STEP_BY_DIRECTION = {
  [GRID_DIRECTION.UP]: { deltaRow: -1, deltaCol: 0 },
  [GRID_DIRECTION.DOWN]: { deltaRow: 1, deltaCol: 0 },
  [GRID_DIRECTION.LEFT]: { deltaRow: 0, deltaCol: -1 },
  [GRID_DIRECTION.RIGHT]: { deltaRow: 0, deltaCol: 1 },
};

// Return the appropriate index after wrapping around the grid for a given count
const wrapIndex = (index, count) => (index + count) % count;

/**
 * Computes the next row/column position in a grid after a single-step move in
 * the given direction, wrapping around the edges of the grid.
 * @ignore
 * @param {number} rowIndex - The current row index.
 * @param {number} colIndex - The current column index.
 * @param {('up'|'down'|'left'|'right')} direction - The single-step direction to move.
 * @param {number} rowCount - The number of rows in the grid.
 * @param {number} colCount - The number of columns in the grid.
 * @returns {{ nextRowIndex: number, nextColIndex: number }} The wrapped next position.
 */
export const getWrappedGridPosition = (rowIndex, colIndex, direction, rowCount, colCount) => {
  const { deltaRow, deltaCol } = GRID_STEP_BY_DIRECTION[direction];
  const nextRowIndex = wrapIndex(rowIndex + deltaRow, rowCount);
  const nextColIndex = wrapIndex(colIndex + deltaCol, colCount);

  return { nextRowIndex, nextColIndex };
};
