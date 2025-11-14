import getSelectedCellStyle from './getSelectedCellStyle';

const isBorderButtonActive = (borderButton) => {
  const isSelectingMultipleCells = ['Inside', 'Vertical', 'Horizontal', 'All'].includes(borderButton);
  if (isSelectingMultipleCells) {
    return false;
  }
  const cellStyle = getSelectedCellStyle();
  const borderTopStyle = cellStyle?.getCellBorder('Top');
  const borderLeftStyle = cellStyle?.getCellBorder('Left');
  const borderBottomStyle = cellStyle?.getCellBorder('Bottom');
  const borderRightStyle = cellStyle?.getCellBorder('Right');

  const isUndefinedBorders = !borderTopStyle && !borderLeftStyle && !borderBottomStyle && !borderRightStyle;
  const isRemovedBorders = [borderTopStyle, borderLeftStyle, borderBottomStyle, borderRightStyle].every((border) => border?.style === 'None');
  if (isUndefinedBorders || isRemovedBorders) {
    return borderButton === 'None';
  }
  const isHavingStylesOnAllBorders = [borderTopStyle, borderLeftStyle, borderBottomStyle, borderRightStyle].every((border) => border && border.style !== 'None');
  if (isHavingStylesOnAllBorders) {
    return borderButton === 'Outside';
  }

  const borderStyleMap = {
    'Left': borderLeftStyle,
    'Right': borderRightStyle,
    'Top': borderTopStyle,
    'Bottom': borderBottomStyle,
  };

  const borderStyle = borderStyleMap[borderButton];
  const isBorderStyleActive = borderStyle?.style !== 'None' && Object.keys(borderStyleMap).includes(borderButton);
  return isBorderStyleActive;
};

export default isBorderButtonActive;