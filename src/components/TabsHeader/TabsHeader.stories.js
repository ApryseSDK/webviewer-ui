import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import App from 'components/App';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import { createStore, createTemplate } from 'helpers/storybookHelper';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { defaultPanels } from 'src/redux/modularComponents';
import initialState from 'src/redux/initialState';

export default {
  title: 'ModularComponents/MultiTab',
  component: App,
  parameters: {
    customizableUI: true,
  }
};

const noop = () => { };

const state = {
  ...initialState,
  viewer: {
    ...initialState.viewer,
    modularHeaders: mockHeadersNormalized,
    modularComponents: mockModularComponents,
    flyoutMap: {},
    openElements: {},
    genericPanels: defaultPanels,
    activeGroupedItems: ['annotateGroupedItems'],
    lastPickedToolForGroupedItems: {
      annotateGroupedItems: 'AnnotationCreateTextUnderline',
    },
    activeCustomRibbon: 'toolbarGroup-Annotate',
    lastPickedToolAndGroup: {
      tool: 'AnnotationCreateTextUnderline',
      group: ['annotateGroupedItems'],
    },
    activeToolName: 'AnnotationCreateTextUnderline',
    isMultiTab: true,
    tabs:[
      { id: 1, src: 'file1.pdf', options: { filename: 'Title A.pdf' }, },
      { id: 2, src: 'file2.docx', options: { filename: 'Title B.docx' }, },
      { id: 3, src: 'file3.pptx', options: { filename: 'Selected Document.pptx' }, },
      { id: 4, src: 'file4.pdf', options: { filename: 'Title C.pdf' }, },
      { id: 5, src: 'file5.docx', options: { filename: 'Title D.pdf' }, },
      { id: 6, src: 'file6.pptx', options: { filename: 'Title E.pdf' }, },
    ],
    activeTab: 3,
  },
  featureFlags: {
    customizableUI: true,
  },
};

export const MultiTabWithMarginOffset = () => {
  useEffect(() => {
    const originalInnerWidth = window.innerWidth;

    // Mock window.innerWidth
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 880,
    });

    window.dispatchEvent(new Event('resize'));

    return () => {
      window.innerWidth = originalInnerWidth;
      window.dispatchEvent(new Event('resize'));
    };
  }, []);

  const store = createStore(state);

  setItemToFlyoutStore(store);

  const divStyle = {
    margin: '0 0 0 100px',
    maxWidth: '880px',
    position: 'relative',
    display: 'inline-block',
    width: 'calc(100% - 130px)',
    height: 'calc(100% - 60px)',
    marginTop: '60px',
    marginLeft: '130px',
  };

  return (
    <Provider store={store}>
      <div style={divStyle}>
        <App removeEventHandlers={noop}/>
      </div>
    </Provider>
  );
};

export const MultiTabWithNameHandler = createTemplate({ headers: mockHeadersNormalized, components: mockModularComponents, isMultiTab: true });

MultiTabWithNameHandler.play = async () => {
  const instance = window.instance;

  instance.UI.TabManager.setTabNameHandler((originalName) => {
    return originalName.toUpperCase();
  });
};

MultiTabWithNameHandler.parameters = {
  layout: 'fullscreen',
  customizableUI: true,
};