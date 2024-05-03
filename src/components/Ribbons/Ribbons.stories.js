import React from 'react';
import RibbonsComponent from './Ribbons';
import { Provider } from 'react-redux';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';

const store = configureStore({
  reducer: () => initialState
});

export default {
  title: 'Components/Ribbons',
  component: RibbonsComponent,
};

const BasicComponent = (props) => {
  const { containerWidth } = props;
  return (
    <Provider store={store}>
      <div className="custom-ribbons-container" style={{ width: containerWidth }}>
        <RibbonsComponent {...props} />
      </div>
    </Provider>
  );
};

export const Ribbons = BasicComponent.bind({});

export const MobileRibbons = BasicComponent.bind({});
MobileRibbons.args = {
  containerWidth: '300px',
};