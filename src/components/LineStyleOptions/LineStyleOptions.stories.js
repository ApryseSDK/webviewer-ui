import React from 'react';
import { createStore } from 'redux';
import { Provider as ReduxProvider } from "react-redux";
import LineStyleOptions from './LineStyleOptions';

export default {
  title: 'Components/LineStyleOptions',
  component: LineStyleOptions,
};

function noop () {}

export function Basic() {
  const properties = {
    StartLineStyle: 'OpenArrow',
    EndLineStyle: 'OpenArrow',
  };

  return (
    <ReduxProvider store={createStore((state = {}) => state)}>
      <div style={{ width: 100 }}>
        <LineStyleOptions
          properties={properties}
          onLineStyleChange={noop}
        />
      </div>
    </ReduxProvider>
  );
}