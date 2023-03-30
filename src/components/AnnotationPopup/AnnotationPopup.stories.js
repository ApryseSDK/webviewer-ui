import React from 'react';
import AnnotationPopup from './AnnotationPopup';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import getAnnotationStyles from 'src/helpers/getAnnotationStyles';

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
      { dataElement: 'calibrateButton' },
      { dataElement: 'linkButton' },
      { dataElement: 'fileAttachmentDownload' },
      { dataElement: 'annotationDeleteButton' },
      { dataElement: 'shortCutKeysFor3D' },
      { dataElement: 'playSoundButton' },
    ],
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: [{ colorMapKey: () => '#F1A099' }],
    openElements: {
      stylePopupTextStyleContainer: false,
    },
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