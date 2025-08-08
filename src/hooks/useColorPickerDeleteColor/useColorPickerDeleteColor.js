import { parseColor } from 'helpers/colorPickerHelper';

const useColorPickerDeleteColor = ({
  selectedColor,
  colors,
  transformFn = (color) => color,
  setSelectedColor,
  onColorChange,
  updateColorsAction,
}) => {
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
      newColors.splice(indexToDelete, 1);
      updateColorsAction(newColors);
    }
  };

  return handleDelete;
};

export default useColorPickerDeleteColor;