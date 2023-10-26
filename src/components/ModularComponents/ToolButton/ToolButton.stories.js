import React from 'react';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import ToolButton from './ToolButton';
import { configureStore } from '@reduxjs/toolkit';

export default {
  title: 'ModularComponents/ToolButton',
  component: ToolButton,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    openElements: [],
    colorMap: {
      'arc': {
        currentStyleTab: 'StrokeColor',
        iconColor: 'StrokeColor'
      }
    },
    toolButtonObjects: {
      AnnotationCreateSticky2: {
        dataElement: 'stickyToolButton2',
        title: 'annotation.stickyNote',
        img: 'icon-tool-comment-line',
        group: 'stickyTools',
        showColor: 'always',
      },
    }

  }
};

const props = {
  dataElement: 'stickyToolButton2',
  title: 'Note',
  img: 'icon-tool-comment-line',
  type: 'toolButton',
  color: '#E44234',
  toolName: 'AnnotationCreateSticky2'
};

export function ToolButtonBasic() {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <div>
        <ToolButton {...props} />
      </div>
    </Provider>
  );
}
