import actions from 'actions';
import {
  verticalAlignmentLabels,
  horizontalAlignmentLabels,
  getFormatTypeFromFormatString,
} from 'constants/spreadsheetEditor';

const filterUndefined = (obj) =>
  // eslint-disable-next-line no-unused-vars
  Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== undefined));

export default (dispatch) => (styleObject) => {
  const verticalAlignment = verticalAlignmentLabels[styleObject.verticalAlignment];
  const horizontalAlignment = horizontalAlignmentLabels[styleObject.horizontalAlignment];
  const formatType = getFormatTypeFromFormatString(styleObject.formatString);

  const filteredPayload = filterUndefined({
    verticalAlignment,
    horizontalAlignment,
    font: styleObject.font,
    formatType,
  });

  if (Object.keys(filteredPayload).length > 0) {
    dispatch(actions.setActiveCellRangeStyle(filteredPayload));
  }
};