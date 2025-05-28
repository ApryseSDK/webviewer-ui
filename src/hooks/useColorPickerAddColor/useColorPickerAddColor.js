import { useCallback } from 'react';
import actions from 'actions';
import { getCustomColorAndRemove, parseColor } from 'helpers/colorPickerHelper';
import { getInstanceNode } from 'helpers/getRootNode';
import Events from 'constants/events';
import DataElements from 'constants/dataElement';
import { useDispatch, useStore } from 'react-redux';

const useAddColorHandler = ({
  colors,
  setSelectedColor = () => {},
  onColorChange,
  type,
  activeToolName = '',
  setColors,
  useHex = false,
}) => {
  const dispatch = useDispatch();
  const store = useStore();

  const handleAddColor = useCallback(() => {
    dispatch(actions.openElement(DataElements.COLOR_PICKER_MODAL));

    const onVisibilityChanged = (e) => {
      const { element, isVisible } = e.detail;

      if (element === DataElements.COLOR_PICKER_MODAL && !isVisible) {
        const colorObject = getCustomColorAndRemove(dispatch, store);
        const color = parseColor(colorObject);
        const newColor = useHex ? color : colorObject;
        if (color) {
          if (colors.includes(color)) {
            setSelectedColor(newColor);
            onColorChange(newColor);
          } else {
            const newColors = [...colors, color];
            setColors(newColors);
            setSelectedColor(newColor);
            onColorChange(newColor);
          }
        }
        getInstanceNode().removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
      }
    };

    getInstanceNode().addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
  }, [colors, type, activeToolName]);

  return handleAddColor;
};


export default useAddColorHandler;