import React, { useCallback } from 'react';
import Button from 'components/Button';
import useCore from 'hooks/useCore';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import './ApplyFormFieldButton.scss';

const ApplyFormFieldButton = () => {
  const { core } = useCore();
  const dispatch = useDispatch();
  const formFieldCreationManager = core.getFormFieldCreationManager();

  const applyFormFields = useCallback(() => {
    formFieldCreationManager.endFormFieldCreationMode();
    dispatch(actions.setToolbarGroup('toolbarGroup-View'));
  }, [formFieldCreationManager, dispatch]);

  return (
    <Button
      dataElement="applyFormFieldButton"
      label="formField.apply"
      className="apply-form-field-button"
      onClick={applyFormFields}
    />
  );
};

export default ApplyFormFieldButton;