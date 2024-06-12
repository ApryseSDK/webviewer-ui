import React from 'react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import StylePickerComponent from './StylePicker';

export default {
  title: 'ModularComponents/StylePicker',
  component: StylePickerComponent,
  parameters: {
    customizableUI: true,
  },
};

const store = configureStore({
  reducer: rootReducer,
});

const style = {
  Opacity: 1,
  StrokeThickness: 1,
  Scale: [
    [1, 'in'],
    [1, 'in']
  ],
  Precision: 0.1,
};

export const StylePicker = () => {
  const props = {
    style: style,
    sliderProperties: ['Opacity', 'StrokeThickness'],
    showLineStyleOptions: true,
    startLineStyle: 'None',
    endLineStyle: 'None',
    strokeStyle: 'solid',
    onStyleChange: () => { },
  };
  return (
    <Provider store={store}>
      <div style={{ width: '310px', padding: '16px' }}>
        <StylePickerComponent {...props} />
      </div>
    </Provider>
  );
};