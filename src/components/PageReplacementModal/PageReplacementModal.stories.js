import React from 'react';
import PageReplacementModal from './PageReplacementModal'
import { createStore } from 'redux';
import { Provider } from "react-redux";

export default {
  title: 'Components/PageReplacementModal',
  component: PageReplacementModal,
};

window.Core = {
  SupportedFileFormats: {
    CLIENT: []
  }
}

const initialState = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'urlInputPanelButton',
    }
  }
};

function rootReducer(state = initialState, action) {
  return state;
}

const store = createStore(rootReducer);

export function Basic() {
  function closeModal() {
    console.log('closeModal');
  }

  const props = {
    isOpen: true,
    closeModal,
  };

  return (
    <Provider store={store}>
      <div className='Overlay FlyoutMenu'>
        <PageReplacementModal  {...props}/>
      </div>
    </Provider>
  );
}

const initialStateTwo = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'filePickerPanelButton',
    }
  }
};

function rootReducerTwo(state = initialStateTwo, action) {
  return state;
}
const storeTwo = createStore(rootReducerTwo);
export function BasicUpload() {
  function closeModal() {
    console.log('closeModal');
  }

  const props = {
    isOpen: true,
    closeModal,
  };
  return (
    <Provider store={storeTwo}>
      <div className='Overlay FlyoutMenu'>
        <PageReplacementModal  {...props}/>
      </div>
    </Provider>
  );
}

const initialStateThree = {
  viewer: {
    openElements: { pageReplacementModal: true },
    disabledElements: {},
    customElementOverrides: {},
    tab: {
      pageReplacementModal: 'customFileListPanelButton',
    }
  }
};

function rootReducerThree(state = initialStateThree, action) {
  return state;
}
const storeThree = createStore(rootReducerThree);
export function BasicCustom() {
  function closeModal() {
    console.log('closeModal');
  }

  const selectableFiles = [
    { id: '23', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '24', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '25', filename: 'foobar.pdf', thumbnail: '' },
    { id: '26', filename: 'foobar.pdf' },
    { id: '27', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
    { id: '28', filename: 'foobar.pdf', thumbnail: 'https://localhost/files/placeholder.png' },
  ];

  const props = {
    isOpen: true,
    closeModal,
    selectableFiles,
  };
  return (
    <Provider store={storeThree}>
      <div className='Overlay FlyoutMenu'>
        <PageReplacementModal  {...props}/>
      </div>
    </Provider>
  );
}