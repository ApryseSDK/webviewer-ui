import React from 'react';
import Button from '../Button';
import { useDispatch , useSelector, shallowEqual } from 'react-redux';
import actions from 'actions';
import { useTranslation } from 'react-i18next';
import DataElementWrapper from '../DataElementWrapper';
import DataElements from 'constants/dataElement';
import useFocusHandler from 'hooks/useFocusHandler';
import selectors from 'selectors';

const CreateRubberStampButton = () => {
  const dispatch = useDispatch();
  const [t] = useTranslation();
  const featureFlags = useSelector(selectors.getFeatureFlags, shallowEqual);

  const openRubberStampModal = () => {
    dispatch(actions.openElement(DataElements.CUSTOM_STAMP_MODAL));
  };

  const openRubberStampModalWithFocus = useFocusHandler(openRubberStampModal);

  return (featureFlags.newStampPanel ?
    (<DataElementWrapper dataElement={DataElements.CREATE_RUBBER_STAMP_BUTTON_WRAP}>
      <Button
        className={'CreateRubberStampButton modularCreateRubberStampButton'}
        dataElement={DataElements.CREATE_RUBBER_STAMP_BUTTON}
        img="icon-plus-sign"
        label={t('component.addStampButton')}
        onClick={openRubberStampModalWithFocus} />
    </DataElementWrapper>) :
    (<DataElementWrapper dataElement={DataElements.CREATE_RUBBER_STAMP_BUTTON_WRAP}>
      <Button
        className={'CreateRubberStampButton'}
        dataElement={DataElements.CREATE_RUBBER_STAMP_BUTTON}
        label={t('component.createStampButton')}
        onClick={openRubberStampModalWithFocus} />
    </DataElementWrapper>)
  );
};

export default CreateRubberStampButton;