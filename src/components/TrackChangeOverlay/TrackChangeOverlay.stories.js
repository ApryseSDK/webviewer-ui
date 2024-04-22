import React from 'react';
import TrackChangeOverlay from './TrackChangeOverlay';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import { OFFICE_EDITOR_EDIT_MODE } from 'constants/officeEditor';

export default {
  title: 'Components/TrackChangeOverlay',
  component: TrackChangeOverlay
};

const getStore = () => {
  const initialState = {
    officeEditor: {
      editMode: OFFICE_EDITOR_EDIT_MODE.EDITING
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
