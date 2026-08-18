import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch } from 'react-redux';
import useCore from 'hooks/useCore';
import actions from 'actions';
import selectors from 'selectors';
import { useTranslation } from 'react-i18next';
import CustomStampBuilder from '../CustomStampBuilder/CustomStampBuilder';
import Button from 'components/Button';
import DataElements from 'constants/dataElement';
import ModalWrapper from 'components/ModalWrapper';
import useFocusOnClose from 'hooks/useFocusOnClose';

import './CreateStampModal.scss';

const TOOL_NAME = 'AnnotationCreateRubberStamp';
const fillColors = window.Core.Tools.RubberStampCreateTool['FILL_COLORS'];

const CustomStampModal = () => {
  const { core } = useCore();
  const [t] = useTranslation();
  const customStampModalOverlayRef = useRef(null);
  const modalWrapperRef = useRef(null);
  const dispatch = useDispatch();

  const defaultStamp = {
    title: 'Draft',
    font: 'Helvetica',
    bold: true,
    color: fillColors[0],
    subtitle: '[$currentUser] DD/MM/YYYY h:mm A',
  };
  const [stamp, setStamp] = useState(defaultStamp);
  const stampToolArray = core.getToolsFromAllDocumentViewers(TOOL_NAME);
  const isOpen = useSelector((state) => selectors.isElementOpen(state, DataElements.CUSTOM_STAMP_MODAL));
  const userName = useSelector((state) => selectors.getUserName(state));
  const featureFlags = useSelector((state) => selectors.getFeatureFlags(state));

  const isStampTextInputEmpty = !stamp.title || stamp.title.trim() === '';
  const isCategoryInputEmpty = !stamp.category || stamp.category.trim() === '';
  const isCreateDisabled = isStampTextInputEmpty || (featureFlags.newStampPanel && isCategoryInputEmpty);

  const updateOverflow = () => {
    const currentModalOverlayElement = customStampModalOverlayRef.current;
    if (!currentModalOverlayElement) {
      return;
    }

    const modalElementContainer = modalWrapperRef.current;
    if (!modalElementContainer) {
      return;
    }

    const customStampModalRect = currentModalOverlayElement.getBoundingClientRect();
    const modalContainerRect = modalElementContainer.getBoundingClientRect();
    const enableScrollBar = customStampModalRect.height > 0 && modalContainerRect.height >= customStampModalRect.height;

    if (enableScrollBar) {
      modalElementContainer.style.overflow = 'auto';
    } else {
      modalElementContainer.style.overflow = 'visible';
    }
  };

  useLayoutEffect(() => {
    if (!isOpen) {
      return;
    }
    updateOverflow();
    window.addEventListener('resize', updateOverflow);

    return () => {
      window.removeEventListener('resize', updateOverflow);
    };
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      core.deselectAllAnnotations();
    }
  }, [isOpen]);

  const closeModal = useFocusOnClose(() => {
    dispatch(actions.closeElement(DataElements.CUSTOM_STAMP_MODAL));
  });

  const modalClass = classNames({
    Modal: true,
    CustomStampModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  const createCustomStamp = async () => {
    core.setToolMode(TOOL_NAME);
    for (const stampTool of stampToolArray) {
      stampTool.addCustomStamp(stamp);
      const annot = await stampTool.createCustomStampAnnotation(stamp);
      await stampTool.setRubberStamp(annot);
      stampTool.showPreview();
    }
    dispatch(actions.closeElement(DataElements.CUSTOM_STAMP_MODAL));
    const standardStampCount = stampToolArray[0].getStandardStamps().length;
    const customStampCount = stampToolArray[0].getCustomStamps().length;
    dispatch(actions.setSelectedStampIndex(standardStampCount + customStampCount - 1));
  };

  const onCreateCustomStampClick = useFocusOnClose(() => {
    if (isCreateDisabled) {
      return;
    }
    createCustomStamp();
  });

  return (
    isOpen ?
      <div
        className={modalClass}
        data-element={DataElements.CUSTOM_STAMP_MODAL}
        ref={customStampModalOverlayRef}
      >
        <ModalWrapper
          ref={modalWrapperRef}
          title={t('option.customStampModal.modalName')}
          modalDataElement={DataElements.CUSTOM_STAMP_MODAL}
          closeHandler={closeModal}
          onCloseClick={closeModal}
          isOpen={isOpen}
          swipeToClose
        >
          <div className="container" onMouseDown={(e) => e.stopPropagation()}>
            <CustomStampBuilder
              stamp={stamp}
              setStamp={setStamp}
              stampTool={stampToolArray[0]}
              userName={userName}
            />
            <div className="footer">
              <Button
                label={t('action.create')}
                title={t('action.create')}
                onClick={onCreateCustomStampClick}
                disabled={isCreateDisabled}
                className="stamp-create"
              />
            </div>
          </div>
        </ModalWrapper>
      </div>
      :
      null
  );
};

export default CustomStampModal;
