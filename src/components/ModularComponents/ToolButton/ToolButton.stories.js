import React from 'react';
import { Provider } from 'react-redux';
import ToolButton from './ToolButton';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';

export default {
  title: 'ModularComponents/ToolButton',
  component: ToolButton,
  parameters: {
    customizableUI: true,
  },
};

const toolNames = Object.values(window.Core.Tools.ToolNames);
const allToolsProps = toolNames.map((toolName) => ({
  dataElement: toolName,
  toolName,
}));

const WithProvider = ({ children }) => (
  <Provider store={configureStore({ reducer: () => initialState })}>
    {children}
  </Provider>
);

export function AllToolButtons() {
  return (
    <WithProvider>
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'column',
        overflowY: 'auto'
      }}>
        {allToolsProps.map((props) => (
          <div key={props.dataElement}>
            {props.toolName}
            <ToolButton {...props} />
          </div>
        ))}
      </div>
    </WithProvider>
  );
}

export const OverrideToolButtonProps = () => {
  const props = {
    dataElement: 'AnnotationCreateSticky',
    toolName: 'AnnotationCreateSticky',
    img: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none"/><path d="M17 3H5c-1.11 0-2 .9-2 2v14c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V7l-4-4zm-5 16c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-10H5V5h10v4z"/></svg>',
    title: 'This is not a sticky or is it?'
  };
  return (
    <WithProvider>
      <ToolButton {...props} />
    </WithProvider>
  );
};