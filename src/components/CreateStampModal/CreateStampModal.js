import React, { useState } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { FocusTrap } from '@pdftron/webviewer-react-toolkit';
import core from 'core';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import CustomStampForums from './CustomStampForums';
import Button from 'components/Button';

import './CreateStampModal.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const fillColors = window.Core.Tools.RubberStampCreateTool['FILL_COLORS'];

const CustomStampModal = () => {
  const [state, setState] = useState({ font: 'Helvetica', bold: true, color: fillColors[0] });
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);
  const [t] = useTranslation();
  const store = useStore();
  const [emptyInput, setEmptyInput] = useState(false);
  const [isOpen, fonts, dateTimeFormats, userName] = useSelector((state) => [
    selectors.isElementOpen(state, 'customStampModal'),
    selectors.getFonts(state),
    selectors.getDateTimeFormats(state),
    selectors.getUserName(state),
  ]);
  const dispatch = useDispatch();
  const closeModal = () => {
    dispatch(actions.closeElement('customStampModal'));
  };

  const openColorPicker = () => {
    dispatch(actions.openElement('ColorPickerModal'));
  };

  const getCustomColorAndRemove = () => {
    const customColor = selectors.getCustomColor(store.getState());
    dispatch(actions.setCustomColor(null));
    return customColor;
  };

  const openDeleteModal = async (onConfirm) => {
    const message = t('warning.colorPicker.deleteMessage');
    const title = t('warning.colorPicker.deleteTitle');
    const confirmBtnText = t('action.ok');

    const warning = {
      message,
      title,
      confirmBtnText,
      onConfirm,
    };
    dispatch(actions.showWarningMessage(warning));
  };

  const modalClass = classNames({
    Modal: true,
    CustomStampModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const createCustomStamp = async () => {
    core.setToolMode(TOOL_NAME);
    for (const stampTool of stampToolArray) {
      stampTool.addCustomStamp(state);
      const annot = await stampTool.createCustomStampAnnotation(state);
      await stampTool.setRubberStamp(annot);
      stampTool.showPreview();
    }
    dispatch(actions.closeElement('customStampModal'));
    const standardStampCount = stampToolArray[0].getStandardStamps().length;
    const customStampCount = stampToolArray[0].getCustomStamps().length;
    dispatch(actions.setSelectedStampIndex(standardStampCount + customStampCount - 1));
  };

  return (
    isOpen ?
      <div
        className={modalClass}
        data-element="customStampModal"
      >
        <FocusTrap locked={isOpen}>
          <div className="container" onMouseDown={(e) => e.stopPropagation()}>
            <div className="header">
              <p>{t('option.customStampModal.modalName')}</p>
              <Button
                dataElement="customStampModalCloseButton"
                title="action.close"
                img="ic_close_black_24px"
                onClick={closeModal}
              />
            </div>
            <CustomStampForums
              openDeleteModal={openDeleteModal}
              getCustomColorAndRemove={getCustomColorAndRemove}
              openColorPicker={openColorPicker}
              isModalOpen={isOpen}
              state={state}
              setState={setState}
              closeModal={closeModal}
              setEmptyInput={setEmptyInput}
              fonts={fonts}
              dateTimeFormats={dateTimeFormats}
              stampTool={stampToolArray[0]}
              userName={userName}
            />
            <div className="footer">
              <div
                className={
                  emptyInput
                    ? 'stamp-create stamp-create-disabled'
                    : 'stamp-create'
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
