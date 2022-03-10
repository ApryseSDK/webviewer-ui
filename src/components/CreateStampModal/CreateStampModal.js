import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
// import ActionButton from 'components/ActionButton'; /* Temporarily commented out */
import CustomStampForums from './CustomStampForums';
import Button from 'components/Button';

import './CreateStampModal.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const CustomStampModal = () => {
  const [state, setState] = useState({});
  const stampTool = core.getTool(TOOL_NAME);
  const [t] = useTranslation();
  const [emptyInput, setEmptyInput] = useState(false);
  const [isOpen] = useSelector(state => [
    selectors.isElementOpen(state, 'customStampModal'),
  ]);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(actions.closeElement('customStampModal'));
  };


  const modalClass = classNames({
    Modal: true,
    CustomStampModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const createCustomStamp = async () => {
    core.setToolMode(TOOL_NAME);
    stampTool.addCustomStamp(state);
    const annot = await stampTool.createCustomStampAnnotation(state);
    await stampTool.setRubberStamp(annot);
    stampTool.showPreview();
    dispatch(actions.closeElement('customStampModal'));
    const standardStampCount = stampTool.getStandardStamps().length;
    const customStampCount = stampTool.getCustomStamps().length;
    dispatch(actions.setSelectedStampIndex(standardStampCount + customStampCount - 1));
  };

  return (
    isOpen ?
      <div
        className={modalClass}
        data-element="customStampModal"
      >
        <FocusTrap locked={isOpen}>
          <div className="container" onMouseDown={e => e.stopPropagation()}>
            <div className="header">
              <p>{t(`option.customStampModal.modalName`)}</p>
              <Button
              dataElement="customStampModalCloseButton"
              title="action.close"
              img="ic_close_black_24px"
              onClick={closeModal}
              /> 
            </div>
            <CustomStampForums
              isModalOpen={isOpen}
              state={state}
              setState={setState}
              closeModal={closeModal}
              createCustomStamp={createCustomStamp}
              setEmptyInput={setEmptyInput}
            />
            <div className="footer">
              <div
                className={
                  emptyInput
                    ? "stamp-create stamp-create-disabled"
                    : "stamp-create"
                }
                onClick={
                  () => {
                    if (emptyInput) {
                      return;
                    }
                    createCustomStamp();
                  }
                }
              >
                {t('action.create')}
              </div>
            </div>
          </div>
        </FocusTrap>
      </div>
      :
      null
  );
};

export default CustomStampModal;
