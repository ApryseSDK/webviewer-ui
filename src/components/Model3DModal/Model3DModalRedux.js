import React, { useEffect, useState } from 'react';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import Model3DModalContainer from './Model3DModalContainer';
import DataElements from 'constants/dataElement';

function Model3DModalRedux(props) {
  const dispatch = useDispatch();
  const [url, setURL] = useState('');
  const [file, setFile] = useState({});
  const [error, setError] = useState({ 'fileError': '', 'urlError': '' });
  const fileInput = React.createRef();
  const urlInput = React.createRef();


  const [isDisabled, isOpen] = useSelector((state) => [
    selectors.isElementDisabled(state, DataElements.MODEL3D_MODAL),
    selectors.isElementOpen(state, DataElements.MODEL3D_MODAL),
  ]);

  const close3DModal = () => {
    dispatch(actions.closeElement(DataElements.MODEL3D_MODAL));
    setURL('');
    setFile({});
    setError({});
    if (fileInput.current) {
      fileInput.current.value = null;
    }
  };


  // Hack to close modal if hotkey to open other tool is used.
  useEffect(() => {
    const onToolUpdated = () => {
      dispatch(actions.closeElement(DataElements.MODEL3D_MODAL));
    };
    core.addEventListener('toolUpdated', onToolUpdated);
    return () => core.removeEventListener('toolUpdated', onToolUpdated);
  }, []);

  useEffect(() => {
    if (isOpen) {
      urlInput.current.focus();
      dispatch(actions.closeElements([
        DataElements.PRINT_MODAL,
        DataElements.LOADING_MODAL,
        DataElements.PROGRESS_MODAL,
        DataElements.ERROR_MODAL,
        DataElements.OPEN_FILE_MODAL,
      ]));
    }
  }, [dispatch, isOpen]);


  const newProps = {
    ...props,
    isDisabled,
    isOpen,
    close3DModal,
    fileInput,
    urlInput,
    error,
    setError,
    file,
    setFile,
    url,
    setURL
  };
  return <Model3DModalContainer {...newProps} />;
}

export default Model3DModalRedux;
