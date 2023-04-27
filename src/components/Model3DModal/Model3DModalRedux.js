import React, { useEffect, useState } from 'react';
import selectors from 'selectors';
import actions from 'actions';
import core from 'core';
import { useDispatch, useSelector } from 'react-redux';
import Model3DModalContainer from './Model3DModalContainer';

function Model3DModalRedux(props) {
  const dispatch = useDispatch();
  const [url, setURL] = useState('');
  const [file, setFile] = useState({});
  const [error, setError] = useState({ 'fileError': '', 'urlError': '' });
  const fileInput = React.createRef();
  const urlInput = React.createRef();


  const [isDisabled, isOpen] = useSelector((state) => [
    selectors.isElementDisabled(state, 'Model3DModal'),
    selectors.isElementOpen(state, 'Model3DModal'),
  ]);

  const close3DModal = () => {
    dispatch(actions.closeElement('Model3DModal'));
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
      dispatch(actions.closeElement('Model3DModal'));
    };
    core.addEventListener('toolUpdated', onToolUpdated);
    return () => core.removeEventListener('toolUpdated', onToolUpdated);
  }, []);

  useEffect(() => {
    if (isOpen) {
      urlInput.current.focus();
      dispatch(actions.closeElements(['printModal', 'loadingModal', 'progressModal', 'errorModal', 'OpenFileModal']));
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
