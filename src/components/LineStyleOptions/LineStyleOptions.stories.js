import React from 'react';
import { Provider as ReduxProvider } from 'react-redux';
import LineStyleOptions from './LineStyleOptions';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'src/redux/reducers/rootReducer';
import { disableRtlModeParameters } from 'helpers/storybookParams';

export default {
  title: 'Components/LineStyleOptions',
  component: LineStyleOptions,
};

function noop() { }

export function Basic() {
  const properties = {
    StartLineStyle: 'OpenArrow',
    StrokeStyle: 'solid',
    EndLineStyle: 'OpenArrow',
  };

  return (
    <ReduxProvider store={configureStore({ reducer: rootReducer() })}>
      <div style={{ width: 100 }}>
        <LineStyleOptions
          properties={properties}
          onLineStyleChange={noop}
        />
      </div>
    </ReduxProvider>
  );
}

Basic.parameters = disableRtlModeParameters;
