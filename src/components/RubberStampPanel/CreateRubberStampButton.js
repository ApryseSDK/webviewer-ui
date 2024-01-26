import React from 'react';
import Button from '../Button';
import { useDispatch } from 'react-redux';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from '../DataElementWrapper';
import DataElements from 'constants/dataElement';

const CreateRubberStampButton = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();

  const openRubberStampModal = () => {
    dispatch(actions.openElement(DataElements.CUSTOM_STAMP_MODAL));
  };

  return (
    <DataElementWrapper dataElement={DataElements.CREATE_RUBBER_STAMP_BUTTON}>
      <Button
        className={'CreateRubberStampButton'}
        label={t('component.createStampButton')}
        onClick={openRubberStampModal} />
    </DataElementWrapper>
  );
};

export default CreateRubberStampButton;