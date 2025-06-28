import core from 'core';

const horizontalAlignmentMap = {
  'left': 1,
  'center': 2,
  'right': 3,
};

const verticalAlignmentMap = {
  'top': 1,
  'middle': 2,
  'bottom': 3,
};

export function getAlignmentProperties(alignmentType) {
  const isVerticalAlignment = verticalAlignmentMap[alignmentType] !== undefined;
  const alignmentValue = isVerticalAlignment ? verticalAlignmentMap[alignmentType] : horizontalAlignmentMap[alignmentType];
  if (alignmentValue === undefined) {
    return {
      alignment: undefined,
      alignmentValue: undefined,
    };
  }

  const alignment = isVerticalAlignment ? 'verticalAlignment' : 'horizontalAlignment';
  return {
    alignment,
    alignmentValue,
  };
}

export default (alignmentType) => {
  if (!alignmentType) {
    return;
  }

  const spreadsheetEditorManager = core.getDocumentViewer().getSpreadsheetEditorManager();
  const { alignment, alignmentValue } = getAlignmentProperties(alignmentType);
  spreadsheetEditorManager.setSelectedCellsStyle({
    [alignment]: alignmentValue,
  });
};