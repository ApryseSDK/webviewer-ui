import React, {useState} from 'react';
import { createStore } from 'redux';
import { Provider } from "react-redux";
import Model3DModal from './Model3DModal';

export default {
  title: 'Components/Model3DModal',
  component: Model3DModal,
};

export function Basic() {
  const initialState = {
    viewer:{
      disabledElements: {},
      customElementOverrides: {},
    }
  };

  function rootReducer(state = initialState, action) {
    return state;
  }
  const store = createStore(rootReducer);
  
  
  const [url, setURL] = useState('');
  const [file, setFile] = useState({});
  const [error, setError] = useState({ 'fileError': '', 'urlError': '' });
  // const fileInput = React.createRef();
  // const urlInput = React.createRef();
  function closeModal() {
    console.log('closeModal');
  }

  
  const props = {
    error,
    setError,
    file,
    setFile,
    url,
    setURL,
    closeModal,
  };
  return (
    <Provider store={store}>
      <div>
        <Model3DModal {...props} />
      </div>
    </Provider>
  );
}
