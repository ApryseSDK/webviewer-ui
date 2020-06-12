import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';
import './CreateStampModal.scss';

import Button from 'components/Button';
import ActionButton from 'components/ActionButton';
import CustomStampForums from './CustomStampForums';

const TOOL_NAME = 'AnnotationCreateRubberStamp';

const CustomStampModal = () => {
  const [state, setState] = useState({});
  const stampTool = core.getTool(TOOL_NAME);
  // const isOpen = true;

  const [isOpen] = useSelector(state => [
    // selectors.isElementDisabled(state, 'customStampModal'),
    // selectors.isElementDisabled(state, 'saveSignatureButton'),
    selectors.isElementOpen(state, 'customStampModal'),
  ]);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(actions.closeElement('customStampModal'));
  };

  const createCustomStamp = () => {
    console.log('create stamp', state);

    stampTool.addCustomStamp(state);
  };

  const modalClass = classNames({
    Modal: true,
    CustomStampModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return (
    <div
      className={modalClass}
      data-element="customStampModal"
      onMouseDown={closeModal}
    >
      <div className="container" onMouseDown={e => e.stopPropagation()}>
        <div className="header">
          {/* <div>Custom Stamp</div> */}
          <ActionButton
            dataElement="customStampModalCloseButton"
            title="action.close"
            img="ic_close_black_24px"
            onClick={closeModal}
          />

        </div>
        <CustomStampForums isModalOpen={isOpen} state={state} setState={setState}/>
        <div
          className="footer"

        >
          <div className="stamp-create" onClick={closeModal}>
            {'Cancel'}
          </div>
          <div className="stamp-create" onClick={createCustomStamp}>
            {'Create'}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomStampModal;