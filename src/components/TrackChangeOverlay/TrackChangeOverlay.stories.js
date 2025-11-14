import React from 'react';
import TrackChangeOverlay from './TrackChangeOverlay';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { OfficeEditorEditMode } from 'constants/officeEditor';

export default {
  title: 'Components/TrackChangeOverlay',
  component: TrackChangeOverlay,
  parameters: {
    legacyUI: true,
  }
};

const getStore = () => {
  const initialState = {
    activeFlyout: null,
    featureFlags: {
      customizableUI: false,
    },
    officeEditor: {
      editMode: OfficeEditorEditMode.EDITING,
    }
  };

  function rootReducer(state = initialState, action) {
    return state;
  }

  return createStore(rootReducer);
};

export function Basic() {
  return (
    <Provider store={getStore()}>
      <div style={{ width: '150px' }}>
        <TrackChangeOverlay />
      </div>
    </Provider>
  );
}

Basic.parameters = window.storybook.disableRtlMode;
