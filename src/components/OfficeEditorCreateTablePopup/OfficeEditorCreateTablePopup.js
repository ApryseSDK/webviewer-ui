import React, { useState } from 'react';
import core from 'core';

import './OfficeEditorCreateTablePopup.scss';

const OfficeEditorCreateTablePopup = ({ onClose }) => {
  const [rowIndex, setRowIndex] = useState(-1);
  const [columnIndex, setColumnIndex] = useState(-1);

  const onMouseLeaveTable = () => {
    setRowIndex(-1);
    setColumnIndex(-1);
  };

  const onMouseEnterCell = (i, j) => {
    setRowIndex(i);
    setColumnIndex(j);
  };

  const onClickCell = async (i, j) => {
    await core.getOfficeEditor().insertTableAtCursor(i + 1, j + 1, 100, 'percent');
    onClose?.();
  };

  return (
    <div className='office-editor-create-table'>
      <table>
        <tbody onMouseLeave={onMouseLeaveTable}>
          {[...Array(10)].map((value, i) => (
            <tr key={`row-${i}`}>
              {[...Array(10)].map((value, j) => (
                <td
                  key={`cell-${i}-${j}`}
                  className={(i <= rowIndex && j <= columnIndex) ? 'selected-cell' : ''}
                  onMouseEnter={() => onMouseEnterCell(i, j)}
                  onClick={() => onClickCell(i, j)}
                >
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="create-table-rows-columns">{columnIndex + 1} x {rowIndex + 1}</div>
    </div>
  );
};

export default OfficeEditorCreateTablePopup;
