import React from 'react';
import AnnotationPopup from './AnnotationPopup';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import getAnnotationStyles from 'src/helpers/getAnnotationStyles';
import DataElements from 'constants/dataElement';
import core from 'core';

const noop = () => { };

export default {
  title: 'Components/AnnotationPopup',
  component: AnnotationPopup,
};

const initialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    annotationPopup: [
      { dataElement: 'viewFileButton' },
      { dataElement: 'annotationCommentButton' },
      { dataElement: 'annotationStyleEditButton' },
      { dataElement: 'annotationDateEditButton' },
      { dataElement: 'annotationRedactButton' },
      { dataElement: 'annotationCropButton' },
      { dataElement: 'annotationContentEditButton' },
      { dataElement: 'annotationGroupButton' },
      { dataElement: 'annotationUngroupButton' },
      { dataElement: 'formFieldEditButton' },
      { dataElement: DataElements.CALIBRATION_POPUP_BUTTON },
      { dataElement: 'linkButton' },
      { dataElement: 'fileAttachmentDownload' },
      { dataElement: 'annotationDeleteButton' },
      { dataElement: 'shortCutKeysFor3D' },
      { dataElement: 'playSoundButton' },
      { dataElement: 'annotationClearSignatureButton' }
    ],
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: [{ colorMapKey: () => '#F1A099' }],
    openElements: {
      stylePopupTextStyleContainer: false,
    },
    activeDocumentViewerKey: 1,
  },
};

const mockAnnotation = {
  Author: 'Mikel Landa',
  isFormFieldPlaceholder: () => false,
  getReplies: () => [],
  getStatus: () => '',
  isReply: () => false,
  getAssociatedNumber: () => 1,
  getContents: noop,
  getCustomData: () => '',
  getAttachments: noop,
  getRichTextStyle: noop,
  ToolName: '',
  Opacity: 1,
  StrokeThickness: 1,
};

const basicHorizontalProps = {
  isOpen: true,
  isRightClickMenu: false,
  focusedAnnotation: mockAnnotation,
  position: { top: 0, left: 0 },
  showCommentButton: true,
  onCommentAnnotation: () => console.log('Comment'),
  showEditStyleButton: true,
  annotationStyle: getAnnotationStyles(mockAnnotation),
  showLinkButton: true,
  linkAnnotationToURL: () => console.log('Link'),
  showDeleteButton: true,
  onDeleteAnnotation: () => console.log('Delete'),
};


export const BasicHorizontal = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <AnnotationPopup {...basicHorizontalProps} />
    </Provider>
  );
};

const basicVerticalProps = {
  ...basicHorizontalProps,
  isRightClickMenu: true,
};

export const BasicVertical = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <AnnotationPopup {...basicVerticalProps} />
    </Provider>
  );
};

export const IsReadOnlyMode = (props) => {
  core.getIsReadOnly = () => true;
  let annotationProps;
  if (Object.keys(props).length) {
    annotationProps = props;
  } else {
    annotationProps = basicHorizontalProps;
  }

  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <AnnotationPopup {...annotationProps} />
    </Provider>
  );
};

const readOnlySignatureAnnotationProps = {
  isOpen: true,
  isRightClickMenu: false,
  focusedAnnotation: mockAnnotation,
  position: { top: 0, left: 0 },
  showCommentButton: false,
  onCommentAnnotation: () => console.log('Comment'),
  showEditStyleButton: false,
  annotationStyle: getAnnotationStyles(mockAnnotation),
  showLinkButton: false,
  linkAnnotationToURL: () => console.log('Link'),
  showDeleteButton: false,
  onDeleteAnnotation: () => console.log('Delete'),
  isAppearanceSignature: true
};

export const SignatureReadOnlyPopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationProps} />
    </Provider>
  );
};

const readOnlySignatureAnnotationPropsDisabled = {
  ...readOnlySignatureAnnotationProps,
  isRightClickMenu: true,
};

export const SignatureReadOnlyDiablePopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => initialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationPropsDisabled} />
    </Provider>
  );
};
