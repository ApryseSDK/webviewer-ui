import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import ToolButton from './ToolButton';
import { configureStore } from '@reduxjs/toolkit';
import initialState from 'src/redux/initialState';
import { expect, within } from 'storybook/test';
import core from 'core';
import actions from 'actions';

export default {
  title: 'ModularComponents/ToolButton',
  component: ToolButton,
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

export const WithCustomStyle = () => {
  const props = {
    dataElement: 'AnnotationCreateSticky',
    toolName: 'AnnotationCreateSticky',
    img: 'icon-tool-measurement-arc',
    title: 'Arc measurement',
    className: 'arc-measurement-class',
    style: {
      backgroundColor: 'darksalmon',
      color: 'white',
      borderRadius: '50%',
    }
  };
  return (
    <WithProvider>
      <ToolButton {...props} />
    </WithProvider>
  );
};

WithCustomStyle.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: /Arc measurement/i });
  expect(button.classList.contains('arc-measurement-class')).toBe(true);
};

let toolStyles;
const ReduxStory = () => {
  toolStyles = {
    StrokeColor: {
      R: 0,
      G: 122,
      B: 59,
      A: 1,
      // eslint-disable-next-line custom/no-hex-colors
      toHexString: () => '#007a3b'
    },
    StrokeThickness: 1,
    Opacity: 1,
  };
  const props = {
    dataElement: 'AnnotationCreateRectangle',
    toolName: 'AnnotationCreateRectangle',
  };
  const originalGetTool = core.getTool;
  core.getTool = () => ({
    ...originalGetTool(),
    defaults: toolStyles,
  });
  useEffect(() => {
    return () => core.getTool = originalGetTool;
  }, []);
  return <ToolButton {...props}/>;
};

const store = configureStore({
  reducer: () => ({
    ...initialState,
    viewer: {
      ...initialState.viewer,
      activeToolStyles: { ...toolStyles },
    }
  })
});
export const ChangingToolStylesShouldRerender = () => (
  <Provider store={store}>
    <ReduxStory/>
  </Provider>
);
ChangingToolStylesShouldRerender.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const button = canvas.getByRole('button', { name: /Rectangle/i });
  await expect(button.firstChild.style.color).toBe('rgb(0, 122, 59)');
  toolStyles.StrokeColor = {
    R: 100,
    G: 0,
    B: 100,
    A: 1,
    // eslint-disable-next-line custom/no-hex-colors
    toHexString: () => '#640064',
  };
  store.dispatch(actions.setActiveToolStyles(toolStyles));
  await expect(button.firstChild.style.color).toBe('rgb(100, 0, 100)');
};