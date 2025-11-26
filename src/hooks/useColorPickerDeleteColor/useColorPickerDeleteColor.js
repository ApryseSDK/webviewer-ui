import { parseColor } from 'helpers/colorPickerHelper';
import { isSpreadsheetEditorMode } from 'helpers/officeEditor';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'selectors';
import actions from 'actions';

const useColorPickerDeleteColor = ({
  selectedColor,
  colors,
  transformFn = (color) => color,
  setSelectedColor,
  onColorChange,
  updateColorsAction,
  spreadsheetSetter,
  spreadsheetGetter
}) => {
  const dispatch = useDispatch();
  const customColors = useSelector(selectors.getCustomColors);
  const spreadsheetCustomColors = useSelector((state) => {
    if (isSpreadsheetEditorMode()) {
      return selectors[spreadsheetGetter](state);
    }
    return [];
  });

  const handleDelete = () => {
    const color = parseColor(selectedColor);
    const newColors = [...colors];
    const indexToDelete = newColors.indexOf(color);

    if (indexToDelete > -1) {
      const nextIndex = indexToDelete === newColors.length - 1 ? indexToDelete - 1 : indexToDelete + 1;
      const nextColor = transformFn(newColors[nextIndex]);

      if (setSelectedColor) {
        setSelectedColor(newColors[nextIndex]);
      }
      onColorChange(nextColor);
      const currentCustomColors = isSpreadsheetEditorMode() ? spreadsheetCustomColors : customColors;
      const updatedCustomColors = currentCustomColors.filter((color) => color !== newColors[indexToDelete]);
      const actionToDispatch = isSpreadsheetEditorMode()
        ? actions[spreadsheetSetter](updatedCustomColors)
        : actions.setCustomColors(updatedCustomColors);
      dispatch(actionToDispatch);
      newColors.splice(indexToDelete, 1);
      updateColorsAction(newColors);
    }
  };

  return handleDelete;
};

export default useColorPickerDeleteColor;