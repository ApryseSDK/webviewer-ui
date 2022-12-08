import React from 'react';
import ModularHeader from 'src/components/ModularComponents/ModularHeader/ModularHeader';
import initialState from 'src/redux/initialState';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';


export default {
  title: 'Components/Header/ModularHeader',
  component: ModularHeader,
};

const store = configureStore({
  reducer: () => initialState
});

const BasicComponent = (props) => {
  return (
    <Provider store={store}>
      <ModularHeader {...props} />
    </Provider>
  );
};


export const TopHeader = BasicComponent.bind({});
TopHeader.args = {
  dataElement: 'defaultHeader',
  placement: 'top',
};

export const LeftHeader = BasicComponent.bind({});
LeftHeader.args = {
  dataElement: 'leftHeader',
  placement: 'left',
};
