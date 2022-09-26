import React from 'react';
import ReplyAttachmentList from './ReplyAttachmentList';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

export default {
  title: 'Components/ReplyAttachmentList',
  component: ReplyAttachmentList
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {}
  }
};
function rootReducer(state = initialState, action) {
  return state;
}
const store = createStore(rootReducer);

const files = [
  {
    name: 'file_1.pdf'
  },
  {
    name: 'file_2.doc'
  },
  {
    name: 'file_3_extra_long_file_name.cad'
  }
];

// State 1
export function DisplayMode() {
  const props = {
    files,
    isEditing: false
  };

  return (
    <Provider store={store}>
      <div style={{ width: '200px' }}>
        <ReplyAttachmentList {...props} />
      </div>
    </Provider>
  );
}

// State 2
export function EditMode() {
  const props = {
    files,
    isEditing: true
  };

  return (
    <Provider store={store}>
      <div style={{ width: '200px' }}>
        <ReplyAttachmentList {...props} />
      </div>
    </Provider>
  );
}
