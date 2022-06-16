import React from 'react';
import RibbonsComponent from './Ribbons';
import { Provider } from "react-redux";
import { combineReducers, createStore } from 'redux';
import initialState from 'src/redux/initialState';
import viewerReducer from 'src/redux/reducers/viewerReducer';

const reducer = combineReducers({
  viewer: viewerReducer(initialState.viewer)
});

const store = createStore(reducer);

export default {
  title: 'Components/Ribbons',
  component: RibbonsComponent,
}

const BasicComponent = (props) => {
  const { containerWidth } = props;
  console.log({ containerWidth });
  return (
    <Provider store={store}>
      <div className='custom-ribbons-container' style={{ width: containerWidth }}>
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
