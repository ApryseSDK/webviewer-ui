import React, { forwardRef } from 'react';
import ActionButton from 'components/ActionButton';
import PropTypes from 'prop-types';
import FlyoutItemContainer from '../../../FlyoutItemContainer';
import { menuItems } from '../../../Helpers/menuItems';
import { CELL_ADJUSTMENT_BUTTONS } from 'constants/customizationVariables';
import core from 'core';

const propTypes = {
  type: PropTypes.string,
  isFlyoutItem: PropTypes.bool,
  style: PropTypes.object,
  className: PropTypes.string,
  buttonType: PropTypes.string,
};

const ERROR = 'SpreadsheetEditorDocument is not loaded';

const CellAdjustmentButton = forwardRef((props, ref) => {
  const { isFlyoutItem, type, style, className, buttonType } = props;
  const isActive = false;

  const { dataElement, icon, title } = menuItems[buttonType];

  const handleClick = () => {
    const workbook = core.getDocument()?.getSpreadsheetEditorDocument()?.getWorkbook();
    const activeSheet = workbook?.getSheetAt(workbook.activeSheetIndex);
    if (!activeSheet) {
      return console.error(ERROR);
    }
    const selectedCellRange = core.getDocumentViewer().getSpreadsheetEditorManager().getSelectedCellRange();

    switch (buttonType) {
      case CELL_ADJUSTMENT_BUTTONS.INSERT_COLUMN_LEFT:
        activeSheet.createColumns(selectedCellRange.firstColumn, 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.INSERT_COLUMN_RIGHT:
        activeSheet.createColumns(selectedCellRange.lastColumn + 1, 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.INSERT_ROW_TOP:
        activeSheet.createRows(selectedCellRange.firstRow, 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.INSERT_ROW_BOTTOM:
        activeSheet.createRows(selectedCellRange.lastRow + 1, 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.INSERT_COLUMN_SHIFT_DOWN:
        // Finish once leadtools api is implemented
        return;
      case CELL_ADJUSTMENT_BUTTONS.INSERT_COLUMN_SHIFT_RIGHT:
        // Ensure this works or adjust once Leadtools API is updated to work
        for (let rowIndex = selectedCellRange.firstRow; rowIndex <= selectedCellRange.lastRow; rowIndex++) {
          const row = activeSheet.getRowAt(rowIndex);
          for (let columnIndex = selectedCellRange.firstColumn; columnIndex <= selectedCellRange.lastColumn; columnIndex++) {
            row.createCell(columnIndex);
          }
        }
        return;
      case CELL_ADJUSTMENT_BUTTONS.DELETE_COLUMN:
        activeSheet.removeColumns(selectedCellRange.firstColumn, selectedCellRange.lastColumn - selectedCellRange.firstColumn + 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.DELETE_ROW:
        activeSheet.removeRows(selectedCellRange.firstRow, selectedCellRange.lastRow - selectedCellRange.firstRow + 1);
        return;
      case CELL_ADJUSTMENT_BUTTONS.DELETE_COLUMN_SHIFT_UP:
        // Finish once leadtools api is implemented
        return;
      case CELL_ADJUSTMENT_BUTTONS.DELETE_COLUMN_SHIFT_LEFT:
        // Finish once leadtools api is implemented
        return;
      default:
        return;
    }
  };

  return (
    isFlyoutItem ?
      <FlyoutItemContainer
        {...props}
        ref={ref}
        onClick={handleClick}
        additionalClass={isActive ? 'active' : ''}
      />
      : (
        <ActionButton
          key={type}
          isActive={isActive}
          onClick={handleClick}
          dataElement={dataElement}
          title={title}
          img={icon}
          ariaPressed={isActive}
          style={style}
          className={className}
        />
      )
  );
});

CellAdjustmentButton.propTypes = propTypes;
CellAdjustmentButton.displayName = 'CellAdjustmentButton';

export default CellAdjustmentButton;
