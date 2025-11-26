import { useCallback } from 'react';
import actions from 'actions';
import selectors from 'selectors';
import { getCustomColorAndRemove, parseColor } from 'helpers/colorPickerHelper';
import Events from 'constants/events';
import DataElements from 'constants/dataElement';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { getEventHandler } from 'helpers/fireEvent';
import { isSpreadsheetEditorMode } from 'helpers/officeEditor';

const useAddColorHandler = ({
  colors,
  setSelectedColor = () => {},
  onColorChange,
  type,
  activeToolName = '',
  setColors,
  useHex = false,
  spreadsheetSetter,
  spreadsheetGetter,
}) => {
  const dispatch = useDispatch();
  const store = useStore();
  const customColors = useSelector(selectors.getCustomColors);
  const spreadsheetCustomColors = useSelector((state) => {
    if (isSpreadsheetEditorMode()) {
      return selectors[spreadsheetGetter](state);
    }
    return [];
  });

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
            const actionToDispatch = isSpreadsheetEditorMode() ?
              actions[spreadsheetSetter]([...spreadsheetCustomColors, color]) :
              actions.setCustomColors([...customColors, color]);
            dispatch(actionToDispatch);
          }
        }
        getEventHandler().removeEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
      }
    };

    getEventHandler().addEventListener(Events.VISIBILITY_CHANGED, onVisibilityChanged);
  }, [colors, type, activeToolName]);

  return handleAddColor;
};


export default useAddColorHandler;
