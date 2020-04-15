import React, { useState, useEffect, useCallback } from 'react';
import classNames from 'classnames';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { Tabs, Tab, TabPanel } from 'components/Tabs';
import InkSignature from 'components/SignatureModal/InkSignature';
import TextSignature from 'components/SignatureModal/TextSignature';
import ImageSignature from 'components/SignatureModal/ImageSignature';

import core from 'core';
import defaultTool from 'constants/defaultTool';
import actions from 'actions';
import selectors from 'selectors';
import { Swipeable } from 'react-swipeable';
import getAnnotationStyles from 'helpers/getAnnotationStyles';

import './SignatureModal.scss';

const SignatureModal = () => {
  const [isDisabled, isOpen, activeToolName, savedSignatures2] = useSelector(state => [
    selectors.isElementDisabled(state, 'signatureModal'),
    selectors.isElementOpen(state, 'signatureModal'),
    selectors.getActiveToolName(state),
    selectors.getSavedSignatures(state),
  ]);

  const signatureTool = core.getTool('AnnotationCreateSignature');
  useEffect(() => {
    signatureTool.on('signatureSaved', onSignatureSaved);
    signatureTool.on('signatureDeleted', onSignatureDeleted);
    core.addEventListener('annotationChanged', onAnnotationChanged);

    // return () => {
    //   signatureTool.off('signatureSaved', onSignatureSaved);
    //   signatureTool.off('signatureDeleted', onSignatureDeleted);
    // };
  }, []);

  // Hack to close modal if hotkey to open other tool is used.
  useEffect(() => {
    if (activeToolName !== 'AnnotationCreateSignature') {
      dispatch(
        actions.closeElements([
          'signatureModal',
          'signatureOverlay',
        ]),
      );
    }
  }, [dispatch, activeToolName]);

  const dispatch = useDispatch();
  const [t] = useTranslation();
  const store = useStore();

  useEffect(() => {
    if (isOpen) {
      dispatch(
        actions.closeElements([
          'printModal',
          'loadingModal',
          'progressModal',
          'errorModal',
        ]),
      );
    }
  }, [dispatch, isOpen]);

  const closeModal = () => {
    signatureTool.clearLocation();
    dispatch(actions.closeElement('signatureModal'));
    // core.setToolMode(defaultTool);
  };

  const createSignature = () => {
    if (!signatureTool.isEmptySignature()) {
      signatureTool.saveSignatures(signatureTool.annot);

      dispatch(actions.setSelectedSignatureIndex(savedSignatures2.length));
      signatureTool.setSignature(signatureTool.annot);
      core.setToolMode('AnnotationCreateSignature');
      signatureTool.showPreview();

      // if (signatureTool.hasLocation()) {
      //   signatureTool.addSignature();
      // } else {
      //   signatureTool.showPreview();
      // }
      dispatch(actions.closeElement('signatureModal'));
    }
  };

  const onSignatureSaved = async annotations => {
    const savedSignatures = selectors.getSavedSignatures(store.getState());
    const numberOfSignaturesToRemove = savedSignatures.length + annotations.length - 4;
    let newSavedSignatures = [...savedSignatures];

    if (numberOfSignaturesToRemove > 0) {
      // to keep the UI sync with the signatures saved in the tool
      for (let i = 0; i < numberOfSignaturesToRemove; i++) {
        signatureTool.deleteSavedSignature(0);
      }

      newSavedSignatures.splice(0, numberOfSignaturesToRemove);
    }

    const signaturesToStore = await getSignatureDataToStore(annotations);
    newSavedSignatures = newSavedSignatures.concat(signaturesToStore);

    // dispatch(actions.setSelectedSignatureIndex(newSavedSignatures.length - 1));
    dispatch(actions.setSavedSignatures(newSavedSignatures));
  };

  const onSignatureDeleted = async() => {
    const savedSignatures = selectors.getSavedSignatures(store.getState());
    const coreSavedSignatures = signatureTool.getSavedSignatures();

    // fire set saved signatures
    const newSavedSignatures = await getSignatureDataToStore(
      // the saved signatures will have a different style than what we've saved in this component
      // if a user changes the styles of a signature after it's added to the document
      // here to sync up the styles we grab a saved signature in this component and use its styles to override the signatures saved in the tool
      coreSavedSignatures.map(annotation =>
        Object.assign(
          annotation,
          getAnnotationStyles(savedSignatures[0].annotation),
        ),
      )
    );

    dispatch(actions.setSavedSignatures(newSavedSignatures));
  };

  const onAnnotationChanged = async(annotations, action) => {
    const savedSignatures = selectors.getSavedSignatures(store.getState());
    if (
      action === 'modify' &&
      annotations.length === 1 &&
      annotations[0].ToolName === 'AnnotationCreateSignature'
    ) {
      const newStyles = getAnnotationStyles(annotations[0]);
      const annotationsWithNewStyles = savedSignatures.map(
        ({ annotation }) => Object.assign(annotation, newStyles),
      );
      const newSavedSignatures = await this.getSignatureDataToStore(
        annotationsWithNewStyles,
      );

      dispatch(actions.setSavedSignatures(newSavedSignatures));
    }
  };

  // returns an array of objects in the shape of: { annotation, preview }
  // annotation: a copy of the annotation passed in
  // imgSrc: preview of the annotation, a base64 string
  const getSignatureDataToStore = async annotations => {
    // copy the annotation because we need to mutate the annotation object later if there're any styles changes
    // and we don't want the original annotation to be mutated as well
    // since it's been added to the canvas
    annotations = annotations.map(core.getAnnotationCopy);
    const previews = await Promise.all(
      annotations.map(annotation => signatureTool.getPreview(annotation)),
    );

    return annotations.map((annotation, i) => ({
      annotation,
      imgSrc: previews[i],
    }));
  };


  const modalClass = classNames({
    Modal: true,
    SignatureModal: true,
    open: isOpen,
    closed: !isOpen,
  });

  return isDisabled ? null : (
    <Swipeable
      onSwipedUp={closeModal}
      onSwipedDown={closeModal}
      preventDefaultTouchmoveEvent
    >
      <div
        className={modalClass}
        data-element="signatureModal"
        onMouseDown={closeModal}
      >
        <div
          className="container"
          onMouseDown={e => e.stopPropagation()}
        >
          <div className="swipe-indicator" />
          <Tabs id="signatureModal">
            <div className="tab-list">
              <Tab dataElement="inkSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.draw')}
                </div>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement="textSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.type')}
                </div>
              </Tab>
              <div className="tab-options-divider" />
              <Tab dataElement="imageSignaturePanelButton">
                <div className="tab-options-button">
                  {t('action.upload')}
                </div>
              </Tab>
            </div>
            <TabPanel dataElement="inkSignaturePanel">
              <InkSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="textSignaturePanel">
              <TextSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
            <TabPanel dataElement="imageSignaturePanel">
              <ImageSignature
                isModalOpen={isOpen}
                createSignature={createSignature}
              />
            </TabPanel>
          </Tabs>
        </div>
      </div>
    </Swipeable>
  );
};

export default SignatureModal;
