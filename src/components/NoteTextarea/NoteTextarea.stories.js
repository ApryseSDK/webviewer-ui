import React, { useRef } from 'react';
import NoteContext from '../Note/Context';
import NoteTextarea from './NoteTextarea';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/NotesPanel/NoteTextarea',
  component: NoteTextarea,
};

function handleStateChange(newValue) {
  // eslint-disable-next-line no-console
}

const context = {
  pendingEditTextMap: {},
  pendingReplyMap: {},
};

const initialState = {
  viewer: {
    disabledElements: {},
    openElements: { audioPlaybackPopup: true },
    customElementOverrides: {},
    userData: [
      {
        value: 'John Doe',
        id: 'johndoe@gmail.com',
        email: 'johndoe@gmail.com',
      },
      {
        value: 'Jane Doe',
        id: 'janedoe@gmail.com',
        email: 'janedoe@gmail.com'
      },
      {
        value: 'Jane Doe',
        id: 'janedoejanedoejanedoejanedoe@gmail.com',
        email: 'janedoejanedoejanedoejanedoe@gmail.com'
      },
    ]
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

const props = {
  value: 'test',
  onChange: handleStateChange,
  onSubmit: () => console.log('onSubmit'),
  onBlur: () => console.log('onBlur'),
  onFocus: () => console.log('onFocus')
};

export const Basic = () => {
  const textareaRef = useRef(null);

  return (
    <Provider store={store}>
      <NoteContext.Provider value={context}>
        <NoteTextarea
          {...props}
          ref={
            (el) => {
              textareaRef.current = el;
            }
          }
        />
      </NoteContext.Provider>
    </Provider>
  );
};