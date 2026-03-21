import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import OutlinesPanel from './OutlinesPanel';
import core from 'core';
import { getDefaultOutlines , createOutlines } from '../Outline/Outline.stories';
import '../LeftPanel/LeftPanel.scss';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { workerTypes } from '../../constants/types';
import { expect, within, userEvent, waitFor } from 'storybook/test';
import { getTranslatedText } from 'src/helpers/testTranslationHelper';

export default {
  title: 'Components/OutlinesPanel',
  component: OutlinesPanel,
};

core.isFullPDFEnabled = () => true;

const MockApp = ({ initialState, width, height }) => {
  const store = configureStore({
    reducer: rootReducer,
    preloadedState: initialState,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
      serializableCheck: false,
      thunk: true,
      immutableCheck: false,
    })
  });
  setItemToFlyoutStore(store);
  return (
    <div className='Panel LeftPanel' style={{ width: '330px', minWidth: '330px' }}>
      <div className='left-panel-container' style={{ minWidth: '330px' }}>
        <Provider store={store}>
          <OutlinesPanel isTest/>
        </Provider>
      </div>
    </div>
  );
};

const Template = (args) => {
  const argsX = args || {};
  const initialStateX = argsX.initialState || {};
  const argsViewer = initialStateX.viewer || {};
  const argsDocument = initialStateX.document || {};

  core.getDocumentViewer = () => ({
    getDocument: () => ({
      getType: () => workerTypes.PDF,
      getBookmarks: async () => null,
    }),
  });

  const stateWithHeaders = {
    ...initialState,
    viewer: {
      ...initialState.viewer,
      disabledElements: {},
      customElementOverrides: {},
      isOutlineEditingEnabled: true,
      pageLabels: { 1: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] },
      flyoutMap: {
      },
      activeFlyout: 'bookmarkOutlineFlyout',
      openElements: {
        'bookmarkOutlineFlyout': true,
      },
      activeToolName: args.activeToolName || 'AnnotationCreateTextUnderline',
      ...argsViewer,
    },
    document: {
      outlines: { 1: getDefaultOutlines() },
      ...argsDocument,
    },
    featureFlags: {
      customizableUI: true,
    },
  };

  return <Suspense fallback={<div>Loading...</div>}><MockApp initialState={stateWithHeaders} width={args.width} height={args.height}/></Suspense>;
};

function createTemplate({
  width = '100%',
  height = '100%',
  headers = mockHeadersNormalized,
  components = mockModularComponents,
  activeCustomRibbon = 'toolbarGroup-Annotate',
  activeToolName,
  initialState = {},
} = {}) {
  const template = Template.bind({});
  template.args = { headers, components, width, height, activeCustomRibbon, activeToolName, initialState };
  template.parameters = { layout: 'fullscreen' };
  return template;
}

export const Editable = createTemplate({
  initialState: {}
});
export const NonEditable = createTemplate({
  initialState: {
    viewer: {
      isOutlineEditingEnabled: false,
    },
  }
});
export const Expanded = createTemplate({
  initialState: {
    viewer: {
      autoExpandOutlines: true,
    },
  }
});
export const NoOutlines = createTemplate({
  initialState: {
    document: {
      outlines: { 1: [] },
    },
  }
});

export const LoadingOutlines = createTemplate({
  initialState: {
    document: {
      outlines: { 1: null },
    }
  }
});

export const AddingOutline = createTemplate({
  initialState: {
    document: {
      outlines: { 1: [] },
    }
  }
});
AddingOutline.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const addOutlinesLabel = `${getTranslatedText('action.add')} ${getTranslatedText('component.outlinesPanel')}`;
  await canvas.findByRole('button', { name: new RegExp(addOutlinesLabel) });
  const addOutlinesButton = canvas.getByRole('button', { name: addOutlinesLabel });
  userEvent.click(addOutlinesButton);
};

const MAX_OUTLINES = 100;

export const ManyNestedOutlinesPanel = createTemplate({
  initialState: {
    document: {
      outlines: { 1: createOutlines([
        ...Array.from({ length: MAX_OUTLINES }, (_, i) => {
          const rootNum = i + 1;
          return {
            name: `Root ${rootNum}`,
            children: [
              {
                name: `Section ${rootNum}.1`,
                children: [
                  {
                    name: `Subsection ${rootNum}.1.1`,
                    children: [
                      { name: `Subsubsection ${rootNum}.1.1.1`, children: [] },
                      { name: `Subsubsection ${rootNum}.1.1.2`, children: [] },
                    ],
                  },
                  {
                    name: `Subsection ${rootNum}.1.2`,
                    children: [],
                  },
                ],
              },
              {
                name: `Section ${rootNum}.2`,
                children: [
                  { name: `Subsection ${rootNum}.2.1`, children: [] },
                ],
              },
            ],
          };
        })
      ]) },
    },
    viewer: {
      outlinesStateMap: { 1: {} },
    }
  }
});

ManyNestedOutlinesPanel.play = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const expandLabel = getTranslatedText('action.expand');

  // Open all of root 1 (all nested levels)
  const scroller = canvasElement.querySelector('[data-testid="virtuoso-scroller"]');
  const clickExpand = async (name) => {
    const button = await canvas.findByRole('button', { name: `${expandLabel} ${name}` });
    await userEvent.click(button);
  };
  await clickExpand('Root 1');
  await clickExpand('Section 1.1');
  await clickExpand('Subsection 1.1.1');
  await clickExpand('Section 1.2');

  const SCROLL_INCREMENT = 200;

  // Scroll down by SCROLL_INCREMENT increments MAX_OUTLINES times
  for (let i = 0; i < MAX_OUTLINES; i++) {
    scroller.scrollTop += SCROLL_INCREMENT;
    await new Promise(requestAnimationFrame);
  }

  await canvas.findByText(`Root ${MAX_OUTLINES}`);

  // Scroll back up to root 1
  scroller.scrollTop = 0;
  await new Promise(requestAnimationFrame);

  // Ensure all nested outlines in root 1 are present
  await canvas.findByText('Subsubsection 1.1.1.1');
  await canvas.findByText('Subsubsection 1.1.1.2');
  await canvas.findByText('Subsection 1.2.1');
};