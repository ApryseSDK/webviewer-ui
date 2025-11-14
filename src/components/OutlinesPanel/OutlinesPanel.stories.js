import React, { Suspense } from 'react';
import { Provider } from 'react-redux';
import OutlinesPanel from './OutlinesPanel';
import core from 'core';
import { getDefaultOutlines } from '../Outline/Outline.stories';
import '../LeftPanel/LeftPanel.scss';
import { mockHeadersNormalized, mockModularComponents } from '../ModularComponents/AppStories/mockAppState';
import initialState from 'src/redux/initialState';
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from 'reducers/rootReducer';
import { setItemToFlyoutStore } from 'helpers/itemToFlyoutHelper';
import { workerTypes } from '../../constants/types';
import { within, userEvent } from 'storybook/test';
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
      pageLabels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
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
      outlines: getDefaultOutlines(),
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
      outlines: [],
    },
  }
});

export const LoadingOutlines = createTemplate({
  initialState: {
    document: {
      outlines: null,
    }
  }
});

export const AddingOutline = createTemplate({
  initialState: {
    document: {
      outlines: [],
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