import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import DataElements from 'constants/dataElement';

const TextEditingWrapper = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(actions.disableElement(DataElements.TEXT_EDITING_PANEL));
  }, []);

  return <>{children}</>;
};

export default TextEditingWrapper;