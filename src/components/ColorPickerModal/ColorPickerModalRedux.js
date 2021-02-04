import React from 'react';
import selectors from 'selectors';
import actions from 'actions';
import { useSelector, useDispatch } from 'react-redux';
import ColorPickerModalContainer from './ColorPickerModalContainer';

function ColorPickerModalRedux(props) {
  const dispatch = useDispatch();
  const [isDisabled, isOpen, color] = useSelector(state => [
    selectors.isElementDisabled(state, 'ColorPickerModal'),
    selectors.isElementOpen(state, 'ColorPickerModal'),
    selectors.getCustomColor(state),
  ]);

  const onColorChange = (selectedColor) => {
    const convertedColor = new window.Annotations.Color(selectedColor.r, selectedColor.g, selectedColor.b, selectedColor.a)
    dispatch(actions.setCustomColor(convertedColor));
  };

  const closeColorPicker = () => {
    dispatch(actions.closeElement('ColorPickerModal'));
  };

  const newProps = {
    ...props,
    color,
    onColorChange,
    isDisabled,
    closeColorPicker,
    isOpen,
  };
  return <ColorPickerModalContainer {...newProps} />;
}

export default ColorPickerModalRedux;
