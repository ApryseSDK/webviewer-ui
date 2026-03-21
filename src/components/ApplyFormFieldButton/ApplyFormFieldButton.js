import React, { useCallback } from 'react';
import Button from 'components/Button';
import useCore from 'hooks/useCore';
import actions from 'actions';
import { useDispatch } from 'react-redux';
import './ApplyFormFieldButton.scss';

const ApplyFormFieldButton = () => {
  const { core } = useCore();
  const dispatch = useDispatch();

  const applyFormFields = useCallback(() => {
    core.getDocumentViewers().forEach((viewer) => {
      viewer.getAnnotationManager().getFormFieldCreationManager().endFormFieldCreationMode();
    });
    dispatch(actions.setToolbarGroup('toolbarGroup-View'));
  }, [core, dispatch]);

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