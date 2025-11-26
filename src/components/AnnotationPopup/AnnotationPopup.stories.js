import React from 'react';
import AnnotationPopup from './AnnotationPopup';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import getAnnotationStyles from 'src/helpers/getAnnotationStyles';
import core from 'core';
import { BASIC_PALETTE } from 'constants/commonColors';
import initialState from 'src/redux/initialState';
const noop = () => { };

export default {
  title: 'Components/AnnotationPopup',
  component: AnnotationPopup,
};

const mockInitialState = {
  viewer: {
    disabledElements: {},
    customElementOverrides: {},
    modularPopups: initialState.viewer.modularPopups,
    customPanels: [],
    unreadAnnotationIdSet: new Set(),
    colorMap: [{ colorMapKey: () => BASIC_PALETTE[0] }],
    openElements: {
      stylePopupTextStyleContainer: false,
    },
    activeDocumentViewerKey: 1,
  },
  featureFlags: {
    customizableUI: true,
  },
};

const mockAnnotation = {
  Author: 'Mikel Landa',
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
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
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
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...basicVerticalProps} />
    </Provider>
  );
};

BasicVertical.parameters = window.storybook.disableRtlMode;

export const IsReadOnlyMode = (props) => {
  core.getIsReadOnly = () => true;
  let annotationProps;
  if (Object.keys(props).length) {
    annotationProps = props;
  } else {
    annotationProps = basicHorizontalProps;
  }

  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...annotationProps} />
    </Provider>
  );
};

IsReadOnlyMode.parameters = window.storybook.disableRtlMode;

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
  showClearSignatureButton: true,
  onDeleteAnnotation: () => console.log('Delete'),
  isAppearanceSignature: true
};

export const SignatureReadOnlyPopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationProps} />
    </Provider>
  );
};

SignatureReadOnlyPopUp.parameters = window.storybook.disableRtlMode;

const readOnlySignatureAnnotationPropsDisabled = {
  ...readOnlySignatureAnnotationProps,
  isRightClickMenu: true,
};

export const SignatureReadOnlyDisablePopUp = () => {
  return (
    <Provider store={configureStore({ reducer: () => mockInitialState })}>
      <AnnotationPopup {...readOnlySignatureAnnotationPropsDisabled} />
    </Provider>
  );
};

SignatureReadOnlyDisablePopUp.parameters = window.storybook.disableRtlMode;

export const CustomizedAnnotationPopup = () => {
  const stateWithMockedPopups = {
    viewer: {
      disabledElements: {},
      customElementOverrides: {},
      modularPopups: {
        ...initialState.viewer.modularPopups,
        annotationPopup: [
          { dataElement: 'viewFileButton', type: 'customButton', onClick: () => {}, img: 'icon-view', title: 'View File' },
          { dataElement: 'commentcustomButton', type: 'customButton', onClick: () => {}, img: 'icon-unposted-comment', title: 'Comment' },
          { dataElement: 'stylePanelToggle', type: 'toggleButton', img: 'icon-style-panel-toggle', title: 'Edit Style' },
          { dataElement: 'statefulButton',
            type: 'statefulButton',
            mount: () =>{},
            initialState: 'SinglePage',
            className: 'stateful-button',
            states: {
              SinglePage: {
                img: 'icon-header-page-manipulation-page-layout-single-page-line',
                onClick: (update) => {
                  update('DoublePage');
                },
                title: 'Single Page',
              },
              DoublePage: {
                img: 'icon-header-page-manipulation-page-layout-double-page-line',
                onClick: (update) => {
                  update('SinglePage');
                },
                title: 'Double Page',
              },
            },
          },
        ]
      },
      customPanels: [],
      unreadAnnotationIdSet: new Set(),
      colorMap: [{ colorMapKey: () => BASIC_PALETTE[0] }],
      openElements: {
        stylePopupTextStyleContainer: false,
      },
      activeDocumentViewerKey: 1,
    },
    featureFlags: {
      customizableUI: true,
    },
  };
  return (
    <Provider store={configureStore({ reducer: () => stateWithMockedPopups })}>
      <AnnotationPopup {...basicHorizontalProps} />
    </Provider>
  );
};

CustomizedAnnotationPopup.parameters = window.storybook.disableRtlMode;
