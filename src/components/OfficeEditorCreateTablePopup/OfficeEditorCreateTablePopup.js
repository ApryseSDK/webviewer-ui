import React, { createRef, useEffect, useRef, useState } from 'react';
import core from 'core';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import useFocusOnClose from 'hooks/useFocusOnClose';
import FocusStackManager from 'helpers/focusStackManager';
import DataElements from 'constants/dataElement';
import FocusTrap from '../FocusTrap';
import './OfficeEditorCreateTablePopup.scss';

const DEFAULT_GRID_SIZE = 10;

const propTypes = {
  isOpen: PropTypes.bool,
  onClose: PropTypes.func,
};

const OfficeEditorCreateTablePopup = ({ isOpen, onClose }) => {
  const [currentRowIndex, setCurrentRowIndex] = useState(0);
  const [currentColIndex, setCurrentColIndex] = useState(0);
  const gridRefs = useRef([...Array(DEFAULT_GRID_SIZE)].map(() => {
    return [...Array(DEFAULT_GRID_SIZE)].map(() => createRef());
  }));

  const closeModalWithOnFocusClose = useFocusOnClose(onClose);

  const moveFocus = (rowIndex, colIndex, deltaX, deltaY) => {
    let nextRowIndex = rowIndex + deltaY;
    let nextColIndex = colIndex + deltaX;
    if (nextRowIndex < 0) {
      nextRowIndex = DEFAULT_GRID_SIZE - 1;
    }
    if (nextRowIndex >= DEFAULT_GRID_SIZE) {
      nextRowIndex = 0;
    }
    if (nextColIndex < 0) {
      nextColIndex = DEFAULT_GRID_SIZE - 1;
    }
    if (nextColIndex >= DEFAULT_GRID_SIZE) {
      nextColIndex = 0;
    }
    setCurrentRowIndex(nextRowIndex);
    setCurrentColIndex(nextColIndex);
  };

  const onKeyDown = (rowIndex, colIndex) => (event) => {
    switch (event.key) {
      case 'ArrowRight':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, 1, 0);
        break;
      case 'ArrowLeft':
        event.preventDefault();
        event.stopPropagation();
        moveFocus(rowIndex, colIndex, -1, 0);
        break;
      case 'ArrowDown':
        event.preventDefault();
        moveFocus(rowIndex, colIndex, 0, 1);
        break;
      case 'ArrowUp':
        event.preventDefault();
        moveFocus(rowIndex, colIndex, 0, -1);
        break;
      case 'Enter':
        event.preventDefault();
        createTable(rowIndex, colIndex);
        break;
      case 'Escape':
        onClose();
        break;
      case 'Tab':
        if (event.shiftKey) {
          event.preventDefault();
          event.stopPropagation();
          closeModalWithOnFocusClose();
        } else {
          onClose();
          FocusStackManager.clear();
        }
        break;
      default:
        break;
    }
  };

  const onMouseEnterCell = (rowIndex, colIndex) => {
    setCurrentRowIndex(rowIndex);
    setCurrentColIndex(colIndex);
  };

  const createTable = async (rowIndex, colIndex) => {
    await core.getOfficeEditor().insertTableAtCursor(rowIndex + 1, colIndex + 1, 100, 'percent');
    onClose();
  };

  useEffect(() => {
    if (currentRowIndex < 0 || currentRowIndex >= DEFAULT_GRID_SIZE || currentColIndex < 0 || currentColIndex >= DEFAULT_GRID_SIZE) {
      return;
    }
    gridRefs.current[currentRowIndex][currentColIndex].current.focus();
  }, [currentRowIndex, currentColIndex]);

  useEffect(() => {
    if (!isOpen) {
      setCurrentRowIndex(0);
      setCurrentColIndex(0);
    } else {
      FocusStackManager.push(DataElements.OFFICE_EDITOR_TOOLS_HEADER_INSERT_TABLE_BUTTON);
    }
  }, [isOpen]);

  return (
    <FocusTrap locked={isOpen}>
      <div className='office-editor-create-table'>
        <table>
          <tbody>
            {gridRefs.current.map((rowRefs, rowIndex) => (
              // sonarcloud: do not use Array index in keys
              <tr key={`row-${rowIndex + 1}`}>
                {rowRefs.map((cellRef, colIndex) => (
                  <td
                    key={`cell-${rowIndex}-${colIndex}`}
                    ref={cellRef}
                    className={classNames({
                      'highlighted-cell': rowIndex <= currentRowIndex && colIndex <= currentColIndex,
                    })}
                    tabIndex={0}
                    role={'gridcell'}
                    aria-label={`${colIndex + 1}x${rowIndex + 1} Table`}
                    aria-selected={rowIndex === currentRowIndex && colIndex === currentColIndex}
                    onClick={() => createTable(rowIndex, colIndex)}
                    onMouseEnter={() => onMouseEnterCell(rowIndex, colIndex)}
                    onKeyDown={onKeyDown(rowIndex, colIndex)}
                  >
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <div className="create-table-rows-columns">{currentColIndex + 1} x {currentRowIndex + 1}</div>
      </div>
    </FocusTrap>
  );
};

OfficeEditorCreateTablePopup.propTypes = propTypes;
export default OfficeEditorCreateTablePopup;
